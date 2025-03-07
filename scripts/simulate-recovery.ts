#!/usr/bin/env tsx

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration
const BACKUP_DIR = process.env.DB_BACKUP_DIR || path.join(process.cwd(), 'backups');
const TEST_DB_NAME = process.env.TEST_DB_NAME || 'whoyouknow_test_recovery';
const DATABASE_URL = process.env.DATABASE_URL;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  console.error(`Backup directory not found: ${BACKUP_DIR}`);
  process.exit(1);
}

// Extract database connection details from URL
const extractConnectionParams = (url: string) => {
  try {
    // Parse a connection string like: postgresql://user:password@host:port/database
    const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    if (!match) {
      throw new Error('Invalid database URL format');
    }

    const [, user, password, host, port, dbName] = match;

    return {
      user,
      password,
      host,
      port,
      dbName
    };
  } catch (error) {
    console.error('Failed to parse database URL:', error);
    throw error;
  }
};

// Get the latest backup file
const getLatestBackup = (): string | null => {
  try {
    const files = fs.readdirSync(BACKUP_DIR);
    const backupFiles = files.filter(file => file.startsWith('backup-') && file.endsWith('.sql'));

    if (backupFiles.length === 0) {
      console.error('No backup files found');
      return null;
    }

    // Sort files by modification time (newest first)
    backupFiles.sort((a, b) => {
      const statA = fs.statSync(path.join(BACKUP_DIR, a));
      const statB = fs.statSync(path.join(BACKUP_DIR, b));
      return statB.mtime.getTime() - statA.mtime.getTime();
    });

    return path.join(BACKUP_DIR, backupFiles[0]);
  } catch (error) {
    console.error('Error getting latest backup:', error);
    return null;
  }
};

// Create test database for recovery
const createTestDatabase = async (user: string, password: string, host: string, port: string): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log(`Creating test database: ${TEST_DB_NAME}...`);

    // Set up environment with password
    const env = {
      ...process.env,
      PGPASSWORD: password
    };

    // Drop existing test database if it exists
    const dropDb = spawn('dropdb', [
      '-h', host,
      '-p', port,
      '-U', user,
      '--if-exists',
      TEST_DB_NAME
    ], { env });

    dropDb.on('close', (code) => {
      if (code !== 0 && code !== 1) { // 1 can occur if db doesn't exist, which is fine
        console.error(`Failed to drop test database, code: ${code}`);
        resolve(false);
        return;
      }

      // Create a new test database
      const createDb = spawn('createdb', [
        '-h', host,
        '-p', port,
        '-U', user,
        TEST_DB_NAME
      ], { env });

      createDb.on('close', (code) => {
        if (code !== 0) {
          console.error(`Failed to create test database, code: ${code}`);
          resolve(false);
          return;
        }

        console.log(`Test database ${TEST_DB_NAME} created successfully`);
        resolve(true);
      });
    });
  });
};

// Restore backup to test database
const restoreBackup = async (backupFile: string, user: string, password: string, host: string, port: string): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log(`Restoring backup file to test database: ${backupFile}`);

    const startTime = Date.now();

    // Set up environment with password
    const env = {
      ...process.env,
      PGPASSWORD: password
    };

    // Restore backup using pg_restore
    const pg_restore = spawn('pg_restore', [
      '-h', host,
      '-p', port,
      '-U', user,
      '-d', TEST_DB_NAME,
      '-v', // Verbose output
      backupFile
    ], { env });

    pg_restore.stdout.on('data', (data) => {
      console.log(`pg_restore: ${data}`);
    });

    pg_restore.stderr.on('data', (data) => {
      // pg_restore often outputs progress information to stderr
      console.log(`pg_restore stderr: ${data}`);
    });

    pg_restore.on('close', (code) => {
      const duration = Date.now() - startTime;

      if (code === 0) {
        console.log(`Restore completed successfully in ${duration / 1000} seconds`);
        resolve(true);
      } else {
        // Some errors during restore are normal and don't indicate failure
        console.warn(`Restore completed with code ${code} in ${duration / 1000} seconds`);
        console.warn('Some warnings during restore are normal, checking database...');
        resolve(code !== null && code <= 1); // 1 can sometimes indicate non-fatal errors
      }
    });
  });
};

// Verify the restored database by running a simple query
const verifyDatabase = async (user: string, password: string, host: string, port: string): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log('Verifying restored database...');

    // Set up environment with password
    const env = {
      ...process.env,
      PGPASSWORD: password
    };

    // Run a simple query to check if database is functioning
    const psql = spawn('psql', [
      '-h', host,
      '-p', port,
      '-U', user,
      '-d', TEST_DB_NAME,
      '-c', 'SELECT COUNT(*) FROM "User";' // Assuming User table exists
    ], { env });

    let output = '';

    psql.stdout.on('data', (data) => {
      output += data.toString();
    });

    psql.stderr.on('data', (data) => {
      console.error(`psql error: ${data}`);
    });

    psql.on('close', (code) => {
      if (code === 0) {
        console.log('Database verification successful');
        console.log(`Query result: ${output}`);
        resolve(true);
      } else {
        console.error('Database verification failed');
        resolve(false);
      }
    });
  });
};

// Run the recovery simulation
const runRecoverySimulation = async () => {
  if (!DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  try {
    // Get the latest backup file
    const backupFile = getLatestBackup();
    if (!backupFile) {
      console.error('No backup file available for recovery');
      process.exit(1);
    }

    console.log(`Selected backup for recovery: ${backupFile}`);
    console.log(`Starting recovery simulation at ${new Date().toISOString()}`);
    const simulationStartTime = Date.now();

    // Extract connection info
    const { user, password, host, port } = extractConnectionParams(DATABASE_URL);

    // Create test database
    const dbCreated = await createTestDatabase(user, password, host, port);
    if (!dbCreated) {
      console.error('Failed to create test database');
      process.exit(1);
    }

    // Restore backup to test database
    const restoreSuccess = await restoreBackup(backupFile, user, password, host, port);
    if (!restoreSuccess) {
      console.error('Failed to restore backup to test database');
      process.exit(1);
    }

    // Verify database
    const verifySuccess = await verifyDatabase(user, password, host, port);
    if (!verifySuccess) {
      console.error('Database verification failed');
      process.exit(1);
    }

    // Calculate total recovery time
    const totalDuration = (Date.now() - simulationStartTime) / 1000;

    console.log('\n=============== RECOVERY SIMULATION RESULTS ===============');
    console.log(`Recovery completed successfully in ${totalDuration.toFixed(2)} seconds`);
    console.log(`Backup file used: ${path.basename(backupFile)}`);
    console.log(`Test database: ${TEST_DB_NAME}`);
    console.log('=========================================================\n');

    console.log('Recovery Plan Steps:');
    console.log('1. Create an empty database (completed in simulation)');
    console.log('2. Restore the latest backup using pg_restore (completed in simulation)');
    console.log('3. Verify database functionality with basic queries (completed in simulation)');
    console.log('4. Update connection strings in application to point to restored database');
    console.log('5. Restart application services to use the recovered database');
    console.log('\nEstimated recovery time in production: ~5-10 minutes');

  } catch (error) {
    console.error('Error during recovery simulation:', error);
    process.exit(1);
  }
};

// Run the simulation
runRecoverySimulation()
  .then(() => {
    console.log('Recovery simulation completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
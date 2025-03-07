#!/usr/bin/env tsx

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const BACKUP_DIR = process.env.DB_BACKUP_DIR || path.join(process.cwd(), 'backups');
const DATABASE_URL = process.env.DATABASE_URL;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log(`Created backup directory: ${BACKUP_DIR}`);
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

// Create a timestamped filename for the backup
const generateBackupFilename = () => {
  const now = new Date();
  return `backup-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}.sql`;
};

// Run the backup process
const runBackup = async () => {
  if (!DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  const backupFilename = generateBackupFilename();
  const backupFilePath = path.join(BACKUP_DIR, backupFilename);

  try {
    const { user, password, host, port, dbName } = extractConnectionParams(DATABASE_URL);

    console.log(`Starting database backup for ${dbName} at ${new Date().toISOString()}`);

    // Set up environment for pg_dump with password
    const env = {
      ...process.env,
      PGPASSWORD: password
    };

    // Create a pg_dump process
    const pg_dump = spawn('pg_dump', [
      '-h', host,
      '-p', port,
      '-U', user,
      '-d', dbName,
      '-F', 'c', // Custom format (compressed)
      '-f', backupFilePath
    ], { env });

    pg_dump.stdout.on('data', (data) => {
      console.log(`pg_dump: ${data}`);
    });

    pg_dump.stderr.on('data', (data) => {
      console.error(`pg_dump stderr: ${data}`);
    });

    pg_dump.on('close', (code) => {
      if (code === 0) {
        console.log(`Backup completed successfully at ${new Date().toISOString()}`);
        console.log(`Backup stored at: ${backupFilePath}`);

        // Get file size
        const stats = fs.statSync(backupFilePath);
        console.log(`Backup size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);

        // Clean up old backups if needed (keep last 7 days)
        cleanOldBackups();
      } else {
        console.error(`Backup failed with code ${code}`);
      }
    });
  } catch (error) {
    console.error('Error running backup:', error);
    process.exit(1);
  }
};

// Clean up old backups (keep the last 7 days)
const cleanOldBackups = () => {
  try {
    const files = fs.readdirSync(BACKUP_DIR);

    // Keep track of backups to delete
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    let deletedCount = 0;
    let deletedSize = 0;

    files.forEach(file => {
      if (!file.startsWith('backup-')) return;

      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      const fileDate = stats.mtime;

      // Delete files older than 7 days
      if (fileDate < sevenDaysAgo) {
        const fileSize = stats.size;
        fs.unlinkSync(filePath);
        deletedCount++;
        deletedSize += fileSize;
      }
    });

    if (deletedCount > 0) {
      console.log(`Cleaned up ${deletedCount} old backups (${(deletedSize / (1024 * 1024)).toFixed(2)} MB freed)`);
    }
  } catch (error) {
    console.error('Error cleaning old backups:', error);
  }
};

// Run the backup
runBackup().catch(err => {
  console.error('Unexpected error in backup script:', err);
  process.exit(1);
});
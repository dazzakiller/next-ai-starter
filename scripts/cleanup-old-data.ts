#!/usr/bin/env tsx

import { prisma } from "../src/lib/db";
import { logger } from "../src/lib/monitoring/logging";

// Configuration
const JOB_LISTING_RETENTION_DAYS = 90; // Keep job listings for 90 days
const LOG_RETENTION_DAYS = 30; // Keep logs for 30 days (if we have a logs table)
const VERIFY_TOKEN_RETENTION_DAYS = 3; // Keep verification tokens for 3 days

/**
 * Helper to get a date in the past based on current date
 */
function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Clean up old job listings
 */
async function cleanupOldJobListings(): Promise<number> {
  try {
    // Check if the Jobs table exists in the schema
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'Job'
      )
    `;

    // If the table doesn't exist yet, skip this cleanup
    if (!tableExists || !Array.isArray(tableExists) || !tableExists[0]?.exists) {
      logger.info("Jobs table does not exist yet, skipping cleanup");
      return 0;
    }

    const cutoffDate = getDaysAgo(JOB_LISTING_RETENTION_DAYS);

    // Since we don't have an actual Job model defined yet, use dynamic query
    // This will be replaced with proper model query once the Job model is defined
    const result = await prisma.$executeRawUnsafe(`
      DELETE FROM "Job"
      WHERE "createdAt" < $1
      RETURNING COUNT(*)
    `, cutoffDate);

    return typeof result === 'number' ? result : 0;
  } catch (error) {
    logger.error("Error cleaning up old job listings", { error });
    return 0;
  }
}

/**
 * Clean up expired verification tokens
 */
async function cleanupExpiredVerificationTokens(): Promise<number> {
  try {
    const cutoffDate = getDaysAgo(VERIFY_TOKEN_RETENTION_DAYS);

    const deleteCount = await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lt: cutoffDate
        }
      }
    });

    return deleteCount.count;
  } catch (error) {
    logger.error("Error cleaning up verification tokens", { error });
    return 0;
  }
}

/**
 * Clean up expired sessions
 */
async function cleanupExpiredSessions(): Promise<number> {
  try {
    const now = new Date();

    const deleteCount = await prisma.session.deleteMany({
      where: {
        expires: {
          lt: now
        }
      }
    });

    return deleteCount.count;
  } catch (error) {
    logger.error("Error cleaning up expired sessions", { error });
    return 0;
  }
}

/**
 * Run all cleanup tasks
 */
async function runCleanup() {
  logger.info("Starting data cleanup process", {
    retention: {
      jobs: `${JOB_LISTING_RETENTION_DAYS} days`,
      logs: `${LOG_RETENTION_DAYS} days`,
      verificationTokens: `${VERIFY_TOKEN_RETENTION_DAYS} days`
    }
  });

  try {
    // Run cleanup tasks and collect results
    const [jobsDeleted, tokensDeleted, sessionsDeleted] = await Promise.all([
      cleanupOldJobListings(),
      cleanupExpiredVerificationTokens(),
      cleanupExpiredSessions()
    ]);

    // Log results
    logger.info("Cleanup completed successfully", {
      results: {
        jobsDeleted,
        tokensDeleted,
        sessionsDeleted,
        totalDeleted: jobsDeleted + tokensDeleted + sessionsDeleted
      }
    });
  } catch (error) {
    logger.error("Error during cleanup process", { error });
    process.exit(1);
  }
}

// Execute the cleanup
runCleanup()
  .then(() => {
    logger.info("Cleanup process finished");
    process.exit(0);
  })
  .catch(error => {
    logger.error("Unhandled error in cleanup script", { error });
    process.exit(1);
  });
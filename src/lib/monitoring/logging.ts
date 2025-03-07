/**
 * A simple structured logging utility
 */

// Logging levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

// Configuration
const config = {
  minLevel: process.env.LOG_LEVEL as LogLevel || LogLevel.INFO,
  includeTimestamp: true,
};

// Log level priorities
const levelPriorities = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
};

// Base log entry structure
interface LogEntry {
  message: string;
  level: LogLevel;
  timestamp?: string;
  [key: string]: any;
}

/**
 * Format a log entry as JSON
 */
function formatLogEntry(entry: LogEntry): string {
  if (config.includeTimestamp && !entry.timestamp) {
    entry.timestamp = new Date().toISOString();
  }

  return JSON.stringify(entry);
}

/**
 * Check if a log level should be displayed based on configured minimum level
 */
function shouldLog(level: LogLevel): boolean {
  return levelPriorities[level] >= levelPriorities[config.minLevel];
}

/**
 * Core logging function
 */
function log(level: LogLevel, message: string, meta: Record<string, any> = {}): void {
  if (!shouldLog(level)) return;

  const entry: LogEntry = {
    message,
    level,
    ...meta,
  };

  const logString = formatLogEntry(entry);

  switch (level) {
    case LogLevel.DEBUG:
      console.debug(logString);
      break;
    case LogLevel.INFO:
      console.info(logString);
      break;
    case LogLevel.WARN:
      console.warn(logString);
      break;
    case LogLevel.ERROR:
      console.error(logString);
      break;
  }
}

// Public API
export const logger = {
  debug: (message: string, meta: Record<string, any> = {}) => log(LogLevel.DEBUG, message, meta),
  info: (message: string, meta: Record<string, any> = {}) => log(LogLevel.INFO, message, meta),
  warn: (message: string, meta: Record<string, any> = {}) => log(LogLevel.WARN, message, meta),
  error: (message: string, meta: Record<string, any> = {}) => log(LogLevel.ERROR, message, meta),

  // Create a child logger with predefined metadata
  child: (defaultMeta: Record<string, any>) => ({
    debug: (message: string, meta: Record<string, any> = {}) =>
      log(LogLevel.DEBUG, message, { ...defaultMeta, ...meta }),
    info: (message: string, meta: Record<string, any> = {}) =>
      log(LogLevel.INFO, message, { ...defaultMeta, ...meta }),
    warn: (message: string, meta: Record<string, any> = {}) =>
      log(LogLevel.WARN, message, { ...defaultMeta, ...meta }),
    error: (message: string, meta: Record<string, any> = {}) =>
      log(LogLevel.ERROR, message, { ...defaultMeta, ...meta }),
  }),
};
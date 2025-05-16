/**
 * Logger utility for consistent logging across the application
 */

// Define log levels with their numeric values for comparison
const logLevels = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
} as const;

// Get the current log level from environment variables or default to INFO
const getCurrentLogLevel = (): keyof typeof logLevels => {
  const envLogLevel = process.env.LOG_LEVEL?.toUpperCase();
  return (envLogLevel && envLogLevel in logLevels)
    ? envLogLevel as keyof typeof logLevels
    : 'INFO';
};

type LogLevel = keyof typeof logLevels;

// Main Logger class
class Logger {
  private prefix: string;
  private currentLogLevel: LogLevel;

  constructor(prefix = '') {
    this.prefix = prefix ? `[${prefix}] ` : '';
    this.currentLogLevel = getCurrentLogLevel();
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${this.prefix}${message}`;
  }

  error(message: string, ...args: any[]): void {
    if (logLevels[this.currentLogLevel] >= logLevels['ERROR']) {
      console.error(this.formatMessage('ERROR', message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (logLevels[this.currentLogLevel] >= logLevels['WARN']) {
      console.warn(this.formatMessage('WARN', message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (logLevels[this.currentLogLevel] >= logLevels['INFO']) {
      console.info(this.formatMessage('INFO', message), ...args);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (logLevels[this.currentLogLevel] >= logLevels['DEBUG']) {
      console.debug(this.formatMessage('DEBUG', message), ...args);
    }
  }

  // Create a child logger with a specific prefix
  child(prefix: string): Logger {
    return new Logger(prefix);
  }
}

// Export a default instance
export default new Logger();
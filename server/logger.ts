/**
 * Logger utility for consistent logging across the application
 */

const logLevels = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

type LogLevel = keyof typeof logLevels;

class Logger {
  private prefix: string;
  private currentLogLevel: LogLevel;

  constructor(prefix = '') {
    this.prefix = prefix;
    this.currentLogLevel = (process.env.LOG_LEVEL as LogLevel) || 'INFO';
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    const prefix = this.prefix ? `[${this.prefix}]` : '';
    return `[${timestamp}] [${level}] ${prefix} ${message}`;
  }

  error(message: string, ...args: any[]): void {
    console.error(this.formatMessage(logLevels.ERROR, message), ...args);
  }

  warn(message: string, ...args: any[]): void {
    if (['ERROR', 'WARN', 'INFO', 'DEBUG'].includes(this.currentLogLevel)) {
      console.warn(this.formatMessage(logLevels.WARN, message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (['INFO', 'DEBUG'].includes(this.currentLogLevel)) {
      console.log(this.formatMessage(logLevels.INFO, message), ...args);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.currentLogLevel === 'DEBUG') {
      console.log(this.formatMessage(logLevels.DEBUG, message), ...args);
    }
  }

  child(prefix: string): Logger {
    return new Logger(prefix);
  }
}

// Create and export a default logger instance
const logger = new Logger();
export default logger;
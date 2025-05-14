/**
 * Simple logger utility for consistent logging throughout the application
 */
export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`${new Date().toLocaleTimeString()} [express] ${message}`, ...args);
  },

  warn: (message: string, ...args: any[]) => {
    console.warn(`${new Date().toLocaleTimeString()} [express] WARNING: ${message}`, ...args);
  },

  error: (message: string, ...args: any[]) => {
    console.error(`${new Date().toLocaleTimeString()} [express] ERROR: ${message}`, ...args);
  },

  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`${new Date().toLocaleTimeString()} [express] DEBUG: ${message}`, ...args);
    }
  }
};
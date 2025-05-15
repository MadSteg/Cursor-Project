/**
 * Global browser type extensions for blockchain libraries
 */

interface Window {
  global: Window;
  Buffer: any;
  process: any;
}

declare global {
  interface Window {
    global: Window;
    Buffer: any;
    process: any;
  }
}

export {};
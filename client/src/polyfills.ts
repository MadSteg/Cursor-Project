/**
 * Polyfills for browser environment
 * 
 * These are required for libraries that expect Node.js globals
 * to be present in browser environments.
 */

// WalletConnect and some blockchain libraries expect 'global' to be defined
window.global = window;

// Add minimal process implementation
// @ts-ignore
window.process = window.process || { 
  env: {} 
};
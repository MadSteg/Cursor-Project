/**
 * Mock wallet provider for development environment
 * 
 * This module provides a simulated wallet provider for testing wallet integration
 * in environments where MetaMask or other wallet extensions are not available.
 */

// Example Ethereum wallet private/public key pair
// This is for development only - DO NOT use in production or for real transactions
export const MOCK_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
export const MOCK_CHAIN_ID = '0x13882'; // Polygon Amoy in hex (80002)
export const MOCK_CHAIN_NAME = 'Polygon Amoy Testnet';

// Event listeners
const listeners: { [key: string]: Function[] } = {
  'accountsChanged': [],
  'chainChanged': [],
  'connect': [],
  'disconnect': []
};

// Mock ethereum provider that simulates MetaMask functionality
export const mockProvider = {
  isMetaMask: true,
  isConnected: () => true,
  selectedAddress: MOCK_ADDRESS,
  chainId: MOCK_CHAIN_ID,
  networkVersion: '80002',
  
  // Request handler that handles common wallet methods
  request: async ({ method, params }: { method: string; params?: any[] }) => {
    console.log(`[Mock Wallet] Request method: ${method}`, params);
    
    switch (method) {
      case 'eth_requestAccounts':
        return [MOCK_ADDRESS];
      
      case 'eth_accounts':
        return [MOCK_ADDRESS];
      
      case 'eth_chainId':
        return MOCK_CHAIN_ID;
      
      case 'eth_sendTransaction':
        // Simulate a successful transaction
        return '0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234';
      
      case 'eth_signTypedData_v4':
      case 'personal_sign':
        // Mock signature - this is not a real signature
        return '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1c';
      
      case 'wallet_switchEthereumChain':
        if (params && params[0] && params[0].chainId === MOCK_CHAIN_ID) {
          // Already on the correct chain
          return null;
        }
        // Fire chainChanged event
        setTimeout(() => {
          notifyListeners('chainChanged', MOCK_CHAIN_ID);
        }, 500);
        return null;
      
      case 'wallet_addEthereumChain':
        // Simulate adding a chain
        setTimeout(() => {
          notifyListeners('chainChanged', MOCK_CHAIN_ID);
        }, 500);
        return null;
      
      default:
        console.warn(`[Mock Wallet] Unhandled method: ${method}`);
        return null;
    }
  },
  
  // Event listener management
  on: (eventName: string, callback: Function) => {
    if (!listeners[eventName]) {
      listeners[eventName] = [];
    }
    listeners[eventName].push(callback);
    console.log(`[Mock Wallet] Added listener for ${eventName}`);
    return mockProvider;
  },
  
  removeListener: (eventName: string, callback: Function) => {
    if (listeners[eventName]) {
      listeners[eventName] = listeners[eventName].filter(cb => cb !== callback);
      console.log(`[Mock Wallet] Removed listener for ${eventName}`);
    }
    return mockProvider;
  }
};

// Helper to trigger events
export function notifyListeners(eventName: string, ...args: any[]) {
  if (listeners[eventName]) {
    listeners[eventName].forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`[Mock Wallet] Error in ${eventName} callback:`, error);
      }
    });
  }
}

// Helper to simulate connecting a wallet
export function simulateWalletConnection() {
  // Simulate accounts changed event
  notifyListeners('accountsChanged', [MOCK_ADDRESS]);
  
  // Simulate connection event
  notifyListeners('connect', { chainId: MOCK_CHAIN_ID });
  
  return MOCK_ADDRESS;
}

// Helper to simulate disconnecting a wallet
export function simulateWalletDisconnection() {
  // Simulate accounts changed event with empty array
  notifyListeners('accountsChanged', []);
  
  // Simulate disconnect event
  notifyListeners('disconnect');
}

// Helper to simulate switching chains
export function simulateChainSwitch(chainId: string) {
  notifyListeners('chainChanged', chainId);
}

// Helper to check if we're currently using the mock wallet
export function isMockWalletActive(): boolean {
  return window.ethereum?.isMetaMask === true && 
         window.ethereum?.selectedAddress === MOCK_ADDRESS;
}
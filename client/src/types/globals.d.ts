/**
 * Global browser type extensions for blockchain libraries
 */

// Ethereum provider interface for MetaMask and other wallet extensions
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, callback: any) => void;
  removeListener: (eventName: string, callback: any) => void;
  isMetaMask?: boolean;
  selectedAddress?: string;
  chainId?: string;
  networkVersion?: string;
  isConnected?: () => boolean;
}

interface Window {
  global: Window;
  Buffer: any;
  process: any;
  ethereum?: EthereumProvider;
}

declare global {
  interface Window {
    global: Window;
    Buffer: any;
    process: any;
    ethereum?: EthereumProvider;
  }
}

export {};
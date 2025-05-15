/**
 * TypeScript interface extensions for window.ethereum 
 * 
 * This file extends the Window interface to include Ethereum provider types
 * for better type checking with MetaMask and other web3 wallets.
 */

interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, callback: (...args: any[]) => void) => void;
  removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
  selectedAddress?: string;
  isConnected: () => boolean;
  chainId?: string;
  networkVersion?: string;
  _metamask?: {
    isUnlocked: () => Promise<boolean>;
  };
  connection?: {
    disconnect: () => void;
  };
}

interface Window {
  ethereum?: EthereumProvider;
}
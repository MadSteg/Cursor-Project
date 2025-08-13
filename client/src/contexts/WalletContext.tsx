import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  wallet: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  chainId: number | null;
  balance: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
  signMessage: (message: string) => Promise<string | null>;
  error: string | null;
  clearError: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  };

  // Get the ethereum object
  const getEthereum = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return window.ethereum;
    }
    return null;
  };

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      if (!isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to use this application.');
      }

      const ethereum = getEthereum();
      if (!ethereum) {
        throw new Error('No Ethereum provider found');
      }

      // Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const account = accounts[0];
      setWallet(account);
      setIsConnected(true);

      // Get chain ID
      const chainIdHex = await ethereum.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16);
      setChainId(chainId);

      // Get balance
      const balanceHex = await ethereum.request({
        method: 'eth_getBalance',
        params: [account, 'latest']
      });
      const balanceWei = parseInt(balanceHex, 16);
      const balanceEth = (balanceWei / 1e18).toFixed(4);
      setBalance(balanceEth);

      // Listen for account changes
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('chainChanged', handleChainChanged);

      console.log('Wallet connected:', account);
    } catch (err: any) {
      console.error('Error connecting wallet:', err);
      setError(err.message || 'Failed to connect wallet');
      setIsConnected(false);
      setWallet(null);
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet function
  const disconnectWallet = () => {
    setWallet(null);
    setIsConnected(false);
    setChainId(null);
    setBalance(null);
    setError(null);

    const ethereum = getEthereum();
    if (ethereum) {
      ethereum.removeListener('accountsChanged', handleAccountsChanged);
      ethereum.removeListener('chainChanged', handleChainChanged);
    }

    console.log('Wallet disconnected');
  };

  // Switch network function
  const switchNetwork = async (targetChainId: number) => {
    try {
      setError(null);
      const ethereum = getEthereum();
      
      if (!ethereum) {
        throw new Error('No Ethereum provider found');
      }

      // Try to switch to the target network
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });

      console.log(`Switched to network: ${targetChainId}`);
    } catch (err: any) {
      console.error('Error switching network:', err);
      setError(err.message || 'Failed to switch network');
    }
  };

  // Sign message function
  const signMessage = async (message: string): Promise<string | null> => {
    try {
      if (!wallet) {
        throw new Error('No wallet connected');
      }

      const ethereum = getEthereum();
      if (!ethereum) {
        throw new Error('No Ethereum provider found');
      }

      const signature = await ethereum.request({
        method: 'personal_sign',
        params: [message, wallet],
      });

      console.log('Message signed:', signature);
      return signature;
    } catch (err: any) {
      console.error('Error signing message:', err);
      setError(err.message || 'Failed to sign message');
      return null;
    }
  };

  // Handle account changes
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      disconnectWallet();
    } else {
      // User switched accounts
      setWallet(accounts[0]);
      console.log('Account changed to:', accounts[0]);
    }
  };

  // Handle chain changes
  const handleChainChanged = (chainIdHex: string) => {
    const newChainId = parseInt(chainIdHex, 16);
    setChainId(newChainId);
    console.log('Chain changed to:', newChainId);
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (isMetaMaskInstalled()) {
        const ethereum = getEthereum();
        if (ethereum) {
          try {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
              setWallet(accounts[0]);
              setIsConnected(true);
              
              // Get chain ID
              const chainIdHex = await ethereum.request({ method: 'eth_chainId' });
              const chainId = parseInt(chainIdHex, 16);
              setChainId(chainId);

              // Get balance
              const balanceHex = await ethereum.request({
                method: 'eth_getBalance',
                params: [accounts[0], 'latest']
              });
              const balanceWei = parseInt(balanceHex, 16);
              const balanceEth = (balanceWei / 1e18).toFixed(4);
              setBalance(balanceEth);

              // Set up listeners
              ethereum.on('accountsChanged', handleAccountsChanged);
              ethereum.on('chainChanged', handleChainChanged);
            }
          } catch (err) {
            console.error('Error checking wallet connection:', err);
          }
        }
      }
    };

    checkWalletConnection();
  }, []);

  const value: WalletContextType = {
    wallet,
    isConnecting,
    isConnected,
    chainId,
    balance,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    signMessage,
    error,
    clearError,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// Export aliases for backward compatibility
export const AuthProvider = WalletProvider;
export const useAuth = useWallet;

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define wallet provider types
export type WalletProvider = 'metamask' | 'walletconnect' | 'coinbase' | 'none';

// Define wallet connection status
export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected' | 'error';

// Define the wallet context type
interface WalletContextType {
  walletAddress: string | null;
  shortAddress: string | null;
  balance: string | null;
  network: {
    chainId: number | null;
    name: string | null;
  };
  provider: WalletProvider;
  status: ConnectionStatus;
  isConnected: boolean;
  connect: (provider?: WalletProvider) => Promise<void>;
  disconnect: () => Promise<void>;
  switchNetwork: (chainId: number) => Promise<void>;
  error: string | null;
}

// Create the wallet context with default values
const WalletContext = createContext<WalletContextType>({
  walletAddress: null,
  shortAddress: null,
  balance: null,
  network: {
    chainId: null,
    name: null,
  },
  provider: 'none',
  status: 'disconnected',
  isConnected: false,
  connect: async () => {},
  disconnect: async () => {},
  switchNetwork: async () => {},
  error: null,
});

// Custom hook to use the wallet context
export const useWallet = () => useContext(WalletContext);

// Props for the WalletProvider component
interface WalletProviderProps {
  children: ReactNode;
}

// Networks configuration
const NETWORKS = {
  ETHEREUM_MAINNET: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/your-infura-key',
    currency: 'ETH'
  },
  POLYGON_MAINNET: {
    chainId: 137,
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-rpc.com',
    currency: 'MATIC'
  },
  POLYGON_MUMBAI: {
    chainId: 80001,
    name: 'Polygon Mumbai Testnet',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    currency: 'MATIC'
  },
  POLYGON_AMOY: {
    chainId: 80002,
    name: 'Polygon Amoy Testnet',
    rpcUrl: import.meta.env.VITE_POLYGON_AMOY_RPC_URL || 'https://polygon-amoy.g.alchemy.com/v2/demo',
    currency: 'MATIC'
  }
};

// Default network
const DEFAULT_NETWORK = NETWORKS.POLYGON_AMOY;

// Helper to format the address to a short version
const formatAddress = (address: string | null): string | null => {
  if (!address) return null;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

// WalletProvider component
export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  // State variables
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<{ chainId: number | null; name: string | null }>({
    chainId: null,
    name: null,
  });
  const [provider, setProvider] = useState<WalletProvider>('none');
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);

  // Derived values
  const shortAddress = formatAddress(walletAddress);
  const isConnected = status === 'connected';

  // Check if the window.ethereum object exists
  const hasEthereum = typeof window !== 'undefined' && window.ethereum;

  // Check if MetaMask is installed
  const hasMetaMask = hasEthereum && window.ethereum.isMetaMask;

  // Connect to wallet
  const connect = async (requestedProvider: WalletProvider = 'metamask') => {
    try {
      setStatus('connecting');
      setError(null);

      // Default to MetaMask if available and no provider specified
      const finalProvider = requestedProvider === 'none' && hasMetaMask 
        ? 'metamask' 
        : requestedProvider;
      
      setProvider(finalProvider);

      // Connect to MetaMask
      if (finalProvider === 'metamask') {
        if (!hasMetaMask) {
          throw new Error('MetaMask is not installed');
        }

        // Request accounts
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        if (accounts.length === 0) {
          throw new Error('No accounts found');
        }
        
        // Get the network ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const networkId = parseInt(chainId, 16);
        
        // Set the network information
        setNetwork({
          chainId: networkId,
          name: getNetworkName(networkId),
        });
        
        // Set the wallet address
        setWalletAddress(accounts[0]);
        
        // Get the balance
        const balanceHex = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest'],
        });
        
        // Convert the balance from wei to ether
        const balanceInWei = parseInt(balanceHex, 16);
        const balanceInEther = balanceInWei / 1e18;
        setBalance(balanceInEther.toFixed(4));
        
        // Set the status
        setStatus('connected');
        
        // Save the connection in local storage
        localStorage.setItem('walletProvider', finalProvider);
        localStorage.setItem('walletConnected', 'true');
      } 
      // Add support for other wallets here as needed
      else {
        throw new Error(`Provider ${finalProvider} not supported yet`);
      }
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      setStatus('error');
      setError(err.message || 'Failed to connect wallet');
      
      // Reset state
      setWalletAddress(null);
      setBalance(null);
      setNetwork({
        chainId: null,
        name: null,
      });
      setProvider('none');
      
      // Clear local storage
      localStorage.removeItem('walletProvider');
      localStorage.removeItem('walletConnected');
    }
  };

  // Disconnect from wallet
  const disconnect = async () => {
    try {
      // Reset state
      setWalletAddress(null);
      setBalance(null);
      setNetwork({
        chainId: null,
        name: null,
      });
      setProvider('none');
      setStatus('disconnected');
      setError(null);
      
      // Clear local storage
      localStorage.removeItem('walletProvider');
      localStorage.removeItem('walletConnected');
    } catch (err: any) {
      console.error('Failed to disconnect wallet:', err);
      setError(err.message || 'Failed to disconnect wallet');
    }
  };

  // Switch to a different network
  const switchNetwork = async (chainId: number) => {
    try {
      if (!hasEthereum) {
        throw new Error('Ethereum provider not available');
      }
      
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }
      
      // Get the network configuration
      const networkConfig = Object.values(NETWORKS).find(
        (network) => network.chainId === chainId
      );
      
      if (!networkConfig) {
        throw new Error(`Network with chain ID ${chainId} not configured`);
      }
      
      // Convert chain ID to hexadecimal
      const chainIdHex = `0x${chainId.toString(16)}`;
      
      try {
        // Try to switch to the network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          // Add the network
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
                chainName: networkConfig.name,
                rpcUrls: [networkConfig.rpcUrl],
                nativeCurrency: {
                  name: networkConfig.currency,
                  symbol: networkConfig.currency,
                  decimals: 18,
                },
              },
            ],
          });
        } else {
          throw switchError;
        }
      }
      
      // Get the new chain ID
      const newChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const newNetworkId = parseInt(newChainId, 16);
      
      // Set the network information
      setNetwork({
        chainId: newNetworkId,
        name: getNetworkName(newNetworkId),
      });
    } catch (err: any) {
      console.error('Failed to switch network:', err);
      setError(err.message || 'Failed to switch network');
    }
  };

  // Helper function to get network name
  const getNetworkName = (chainId: number): string => {
    const network = Object.values(NETWORKS).find(
      (network) => network.chainId === chainId
    );
    
    return network ? network.name : `Unknown Network (${chainId})`;
  };

  // Setup event listeners for MetaMask
  useEffect(() => {
    if (hasEthereum) {
      // Setup MetaMask event listeners
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect();
        } else if (accounts[0] !== walletAddress) {
          // User switched accounts
          setWalletAddress(accounts[0]);
        }
      };
      
      const handleChainChanged = (chainId: string) => {
        // Chain changed, reload the page
        window.location.reload();
      };
      
      const handleDisconnect = (error: { code: number; message: string }) => {
        // Handle disconnection
        disconnect();
      };
      
      // Add event listeners
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
      
      // Clean up event listeners
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      };
    }
  }, [hasEthereum, walletAddress]);

  // Restore wallet connection from local storage
  useEffect(() => {
    const restoreConnection = async () => {
      const savedProvider = localStorage.getItem('walletProvider') as WalletProvider;
      const wasConnected = localStorage.getItem('walletConnected') === 'true';
      
      if (savedProvider && wasConnected) {
        // Attempt to reconnect
        await connect(savedProvider);
      }
    };
    
    restoreConnection();
  }, []);

  // Value to be provided by the context
  const value: WalletContextType = {
    walletAddress,
    shortAddress,
    balance,
    network,
    provider,
    status,
    isConnected,
    connect,
    disconnect,
    switchNetwork,
    error,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

// Fix TypeScript error for window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}
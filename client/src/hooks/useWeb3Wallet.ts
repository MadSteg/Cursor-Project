/**
 * Hook for interacting with Web3 wallet
 * 
 * This hook provides a simplified interface for connecting to Ethereum wallets.
 * In development mode, it will use a mock wallet.
 */
import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  error: string | null;
}

export function useWeb3Wallet() {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    chainId: null,
    error: null,
  });
  const { toast } = useToast();

  // Initialize wallet on component mount
  useEffect(() => {
    const checkForWallet = async () => {
      try {
        // In development, use a mock wallet
        if (process.env.NODE_ENV === 'development') {
          console.log("Using mock wallet for development:", "0x0CC9bb224dA2cbe7764ab7513D493cB2b3BeA6FC");
          setState({
            isConnected: true,
            address: "0x0CC9bb224dA2cbe7764ab7513D493cB2b3BeA6FC",
            chainId: 80002, // Polygon Amoy
            error: null,
          });
          return;
        }

        // Check if window.ethereum is available (MetaMask or similar)
        if (!window.ethereum) {
          setState(prev => ({
            ...prev,
            error: "No Ethereum wallet found. Please install MetaMask.",
          }));
          return;
        }

        // Check if already connected
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts && accounts.length > 0) {
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          setState({
            isConnected: true,
            address: accounts[0],
            chainId: parseInt(chainId, 16),
            error: null,
          });
        }
      } catch (error) {
        console.error("Error checking for wallet:", error);
        setState(prev => ({
          ...prev,
          error: "Error connecting to wallet",
        }));
      }
    };

    checkForWallet();

    // Set up event listeners for wallet changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Handle account changes
  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setState({
        isConnected: false,
        address: null,
        chainId: null,
        error: null,
      });
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } else {
      // User switched accounts
      setState(prev => ({
        ...prev,
        isConnected: true,
        address: accounts[0],
      }));
      toast({
        title: "Account Changed",
        description: `Now connected to: ${formatAddress(accounts[0])}`,
      });
    }
  };

  // Handle network changes
  const handleChainChanged = (chainIdHex: string) => {
    const newChainId = parseInt(chainIdHex, 16);
    setState(prev => ({
      ...prev,
      chainId: newChainId,
    }));
    
    toast({
      title: "Network Changed",
      description: `Network switched to ${getNetworkName(newChainId)}`,
    });
  };

  // Connect wallet
  const connect = useCallback(async () => {
    try {
      // In development, connect to mock wallet
      if (process.env.NODE_ENV === 'development') {
        setState({
          isConnected: true,
          address: "0x0CC9bb224dA2cbe7764ab7513D493cB2b3BeA6FC",
          chainId: 80002, // Polygon Amoy
          error: null,
        });
        toast({
          title: "Connected",
          description: "Connected to mock wallet for development",
        });
        return "0x0CC9bb224dA2cbe7764ab7513D493cB2b3BeA6FC";
      }

      if (!window.ethereum) {
        const error = "No Ethereum wallet found. Please install MetaMask.";
        setState(prev => ({ ...prev, error }));
        toast({
          title: "Wallet Not Found",
          description: error,
          variant: "destructive",
        });
        throw new Error(error);
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const chainIdHex = await window.ethereum.request({ 
        method: 'eth_chainId' 
      });
      
      const chainId = parseInt(chainIdHex, 16);
      
      setState({
        isConnected: true,
        address: accounts[0],
        chainId,
        error: null,
      });
      
      toast({
        title: "Connected",
        description: `Connected to ${formatAddress(accounts[0])}`,
      });
      
      return accounts[0];
    } catch (error) {
      console.error("Error connecting wallet:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Error connecting to wallet";
        
      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [toast]);

  // Switch to specified network
  const switchNetwork = useCallback(async (chainId: number) => {
    try {
      // In development, just update the state
      if (process.env.NODE_ENV === 'development') {
        setState(prev => ({
          ...prev,
          chainId,
        }));
        toast({
          title: "Network Switched",
          description: `Switched to ${getNetworkName(chainId)} in development mode`,
        });
        return;
      }

      if (!window.ethereum) {
        throw new Error("No Ethereum wallet found");
      }

      try {
        // Try to switch to the network
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
      } catch (switchError: any) {
        // Network doesn't exist in wallet, so try to add it
        if (switchError.code === 4902) {
          await addNetwork(chainId);
        } else {
          throw switchError;
        }
      }
    } catch (error) {
      console.error("Error switching network:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Error switching network";
        
      toast({
        title: "Network Switch Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [toast]);

  // Add network configuration to wallet
  const addNetwork = async (chainId: number) => {
    const networkParams = getNetworkParams(chainId);
    
    if (!networkParams) {
      throw new Error(`Configuration for network ID ${chainId} not found`);
    }
    
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkParams],
    });
  };

  // Disconnect wallet (for UI purposes)
  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      address: null,
      chainId: null,
      error: null,
    });
    
    toast({
      title: "Disconnected",
      description: "Your wallet has been disconnected from this site",
    });
  }, [toast]);

  // Format address for display
  const formatAddress = (address: string): string => {
    return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';
  };

  return {
    isConnected: state.isConnected,
    address: state.address,
    chainId: state.chainId,
    error: state.error,
    connect,
    disconnect,
    switchNetwork,
    shortDisplayAddress: state.address ? formatAddress(state.address) : '',
    networkName: state.chainId ? getNetworkName(state.chainId) : null,
  };
}

// Helper function to get network name from chain ID
function getNetworkName(chainId: number): string {
  const networks: Record<number, string> = {
    1: 'Ethereum Mainnet',
    3: 'Ropsten',
    4: 'Rinkeby',
    5: 'Goerli',
    42: 'Kovan',
    56: 'Binance Smart Chain',
    137: 'Polygon',
    80001: 'Polygon Mumbai',
    80002: 'Polygon Amoy',
    42161: 'Arbitrum One',
    421613: 'Arbitrum Goerli',
  };
  
  return networks[chainId] || `Network ${chainId}`;
}

// Helper function to get network parameters for adding to wallet
function getNetworkParams(chainId: number): any {
  const networkParams: Record<number, any> = {
    80002: {
      chainId: '0x138C2',
      chainName: 'Polygon Amoy Testnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: ['https://polygon-amoy.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr'],
      blockExplorerUrls: ['https://www.oklink.com/amoy'],
    },
    80001: {
      chainId: '0x13881',
      chainName: 'Polygon Mumbai Testnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
      blockExplorerUrls: ['https://mumbai.polygonscan.com'],
    },
    // Add more networks as needed
  };
  
  return networkParams[chainId] || null;
}

// Extend window with ethereum property
declare global {
  interface Window {
    ethereum?: any;
  }
}
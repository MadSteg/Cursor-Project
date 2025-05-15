import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

// Configure the supported chains
const POLYGON_MAINNET_CHAIN_ID = 137;
const POLYGON_AMOY_CHAIN_ID = 80002;

// Custom error class for unsupported chains
class UnsupportedChainIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnsupportedChainIdError';
  }
}

interface Web3ContextProps {
  active: boolean;
  account: string | null;
  chainId: number | undefined;
  library: ethers.providers.Web3Provider | undefined;
  error: Error | undefined;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToPolygonAmoy: () => Promise<void>;
  isCorrectNetwork: boolean;
}

const Web3Context = createContext<Web3ContextProps>({
  active: false,
  account: null,
  chainId: undefined,
  library: undefined,
  error: undefined,
  connect: async () => {},
  disconnect: () => {},
  switchToPolygonAmoy: async () => {},
  isCorrectNetwork: false
});

export function Web3ContextProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [library, setLibrary] = useState<ethers.providers.Web3Provider | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [tried, setTried] = useState(false);
  const { toast } = useToast();

  // Function to get the provider
  const getProvider = async (): Promise<ethers.providers.Web3Provider | null> => {
    // @ts-ignore
    if (window.ethereum) {
      try {
        // @ts-ignore
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        return provider;
      } catch (err) {
        console.error('Failed to create Web3Provider:', err);
        return null;
      }
    }
    return null;
  };

  // Function to get the current account and chain ID
  const getAccountAndChainId = async () => {
    const provider = await getProvider();
    if (!provider) {
      setActive(false);
      setAccount(null);
      setChainId(undefined);
      setLibrary(undefined);
      return;
    }

    try {
      // Request accounts, this will trigger the MetaMask popup
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setActive(true);
        setLibrary(provider);

        // Get the network
        const network = await provider.getNetwork();
        setChainId(network.chainId);
      } else {
        setAccount(null);
        setActive(false);
      }
    } catch (err) {
      console.error('Failed to get accounts:', err);
      setError(err as Error);
      setActive(false);
      setAccount(null);
    }
  };

  // Try to automatically connect
  useEffect(() => {
    const localStorageWalletConnected = localStorage.getItem('walletConnected') === 'true';
    
    async function tryConnect() {
      if (localStorageWalletConnected && !active && !error) {
        try {
          await connect();
        } catch (err) {
          console.error('Failed to activate wallet on auto-connect', err);
        }
      }
      setTried(true);
    }
    
    tryConnect();
  }, []);
  
  // Setup ethereum event listeners
  useEffect(() => {
    // @ts-ignore
    if (window.ethereum) {
      // @ts-ignore
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setActive(true);
        } else {
          setAccount(null);
          setActive(false);
        }
      });

      // @ts-ignore
      window.ethereum.on('chainChanged', (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
      });

      // @ts-ignore
      window.ethereum.on('disconnect', () => {
        setActive(false);
        setAccount(null);
      });
    }

    return () => {
      // @ts-ignore
      if (window.ethereum) {
        // @ts-ignore
        window.ethereum.removeAllListeners('accountsChanged');
        // @ts-ignore
        window.ethereum.removeAllListeners('chainChanged');
        // @ts-ignore
        window.ethereum.removeAllListeners('disconnect');
      }
    };
  }, []);
  
  // Handle any connection errors
  useEffect(() => {
    if (error) {
      // Check if it's a chain ID error
      if (error.name === 'UnsupportedChainIdError' || (error as any).code === 'UNSUPPORTED_CHAIN_ID') {
        toast({
          title: 'Unsupported Network',
          description: 'Please connect to the Polygon Amoy testnet',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Connection Error',
          description: 'Failed to connect wallet',
          variant: 'destructive'
        });
      }
      console.error('Web3 connection error:', error);
    }
  }, [error, toast]);
  
  // Check if they're connected to Polygon Amoy
  const isCorrectNetwork = chainId === POLYGON_AMOY_CHAIN_ID;
  
  // Connect wallet
  const connect = async () => {
    try {
      // @ts-ignore
      if (!window.ethereum) {
        toast({
          title: 'MetaMask Not Found',
          description: 'Please install MetaMask to connect your wallet',
          variant: 'destructive'
        });
        return;
      }

      const provider = await getProvider();
      if (!provider) {
        throw new Error('Failed to get provider');
      }

      setLibrary(provider);

      // Request accounts from MetaMask
      // @ts-ignore
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setActive(true);
        
        // Get the current chain ID
        const network = await provider.getNetwork();
        setChainId(network.chainId);
        
        localStorage.setItem('walletConnected', 'true');
        
        toast({
          title: 'Wallet Connected',
          description: 'Your wallet has been successfully connected',
          variant: 'default'
        });
      } else {
        throw new Error('No accounts found');
      }
    } catch (err) {
      console.error('Failed to connect wallet', err);
      
      toast({
        title: 'Connection Failed',
        description: 'Please make sure MetaMask is installed and unlocked',
        variant: 'destructive'
      });
    }
  };
  
  // Disconnect wallet
  const disconnect = () => {
    setActive(false);
    setAccount(null);
    localStorage.removeItem('walletConnected');
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
      variant: 'default'
    });
  };
  
  // Switch to Polygon Amoy
  const switchToPolygonAmoy = async () => {
    // @ts-ignore
    if (!window.ethereum || !window.ethereum.request) {
      toast({
        title: 'Provider Error',
        description: 'No provider available',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Try to switch to Polygon Amoy
      // @ts-ignore
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${POLYGON_AMOY_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError: any) {
      // This error code means the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          // @ts-ignore
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${POLYGON_AMOY_CHAIN_ID.toString(16)}`,
                chainName: 'Polygon Amoy Testnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://polygon-amoy.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr'],
                blockExplorerUrls: ['https://amoy.polygonscan.com/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add Polygon Amoy network to MetaMask', addError);
          toast({
            title: 'Network Addition Failed',
            description: 'Failed to add Polygon Amoy network to your wallet',
            variant: 'destructive'
          });
        }
      } else {
        console.error('Failed to switch to Polygon Amoy network', switchError);
        toast({
          title: 'Network Switch Failed',
          description: 'Failed to switch to Polygon Amoy network',
          variant: 'destructive'
        });
      }
    }
  };
  
  const contextValue: Web3ContextProps = {
    active,
    account,
    chainId,
    library,
    error,
    connect,
    disconnect,
    switchToPolygonAmoy,
    isCorrectNetwork
  };
  
  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
}

// Custom hook to access the Web3 context
export function useWeb3() {
  return useContext(Web3Context);
}

// Web3 provider to wrap application
export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <Web3ContextProvider>
      {children}
    </Web3ContextProvider>
  );
}
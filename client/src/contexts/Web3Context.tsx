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
      // Check if ethereum is defined in window
      // @ts-ignore
      const ethereum = window.ethereum;
      
      if (!ethereum) {
        // More detailed error message when MetaMask is not found
        toast({
          title: 'Web3 Wallet Not Detected',
          description: 'Please install MetaMask or another Web3 wallet extension to connect.',
          variant: 'destructive'
        });
        throw new Error('No Web3 wallet extension detected');
      }

      // Verify we can actually interact with the provider
      if (!ethereum.request) {
        toast({
          title: 'Invalid Provider',
          description: 'Your browser has a Web3 object but it doesn\'t appear to be a valid provider.',
          variant: 'destructive'
        });
        throw new Error('Invalid ethereum provider');
      }

      // Create ethers provider
      const provider = new ethers.providers.Web3Provider(ethereum);
      if (!provider) {
        throw new Error('Failed to create Web3 provider');
      }

      setLibrary(provider);

      // Request accounts (this will prompt the MetaMask popup)
      let accounts;
      try {
        accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      } catch (requestError: any) {
        // Handle specific request errors
        if (requestError.code === 4001) {
          // User rejected the request
          toast({
            title: 'Connection Rejected',
            description: 'You declined the connection request. Please try again and approve the connection.',
            variant: 'destructive'
          });
          throw new Error('User rejected the request');
        } else {
          toast({
            title: 'Connection Error',
            description: requestError.message || 'Failed to request accounts from your wallet',
            variant: 'destructive'
          });
          throw requestError;
        }
      }
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        setActive(true);
        
        // Get the current chain ID
        const network = await provider.getNetwork();
        setChainId(network.chainId);
        
        localStorage.setItem('walletConnected', 'true');
        
        toast({
          title: 'Wallet Connected',
          description: `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
          variant: 'default'
        });
      } else {
        toast({
          title: 'No Accounts Found',
          description: 'Please unlock your wallet and try again',
          variant: 'destructive'
        });
        throw new Error('No accounts found');
      }
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      setError(err);
      
      // Don't show a toast message here as we already show specific toasts for different errors
      if (!err.message.includes('User rejected') && 
          !err.message.includes('No Web3 wallet') && 
          !err.message.includes('Invalid ethereum provider') &&
          !err.message.includes('No accounts found')) {
        toast({
          title: 'Connection Failed',
          description: 'Please make sure your wallet is installed and unlocked',
          variant: 'destructive'
        });
      }
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
    try {
      // @ts-ignore
      const ethereum = window.ethereum;
      
      if (!ethereum || !ethereum.request) {
        toast({
          title: 'Web3 Wallet Not Found',
          description: 'Please install a Web3 wallet like MetaMask to switch networks',
          variant: 'destructive'
        });
        return;
      }
      
      try {
        // Try to switch to Polygon Amoy
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${POLYGON_AMOY_CHAIN_ID.toString(16)}` }],
        });
        
        toast({
          title: 'Network Switched',
          description: 'Successfully connected to Polygon Amoy',
          variant: 'default'
        });
      } catch (switchError: any) {
        // If the chain hasn't been added to MetaMask (error 4902), add it
        if (switchError.code === 4902) {
          toast({
            title: 'Adding Polygon Amoy Network',
            description: 'This network isn\'t in your wallet yet. Adding it now...',
            variant: 'default'
          });
          
          try {
            await ethereum.request({
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
            
            toast({
              title: 'Network Added',
              description: 'Polygon Amoy has been added to your wallet',
              variant: 'default'
            });
          } catch (addError: any) {
            console.error('Failed to add Polygon Amoy network:', addError);
            
            let errorMessage = 'Failed to add Polygon Amoy network to your wallet';
            if (addError.code === 4001) {
              errorMessage = 'You declined to add the Polygon Amoy network. Please try again.';
            }
            
            toast({
              title: 'Network Addition Failed',
              description: errorMessage,
              variant: 'destructive'
            });
          }
        } else if (switchError.code === 4001) {
          // User rejected the request
          toast({
            title: 'Network Switch Cancelled',
            description: 'You declined to switch networks. Please try again.',
            variant: 'destructive'
          });
        } else {
          console.error('Failed to switch to Polygon Amoy network:', switchError);
          toast({
            title: 'Network Switch Failed',
            description: switchError.message || 'Failed to switch to Polygon Amoy network',
            variant: 'destructive'
          });
        }
      }
    } catch (error: any) {
      console.error('Polygon Amoy connection error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to Polygon Amoy. Please check your wallet or try again later.',
        variant: 'destructive'
      });
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
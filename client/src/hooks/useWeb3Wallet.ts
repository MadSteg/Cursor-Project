import { useState, useEffect, useCallback } from 'react';

declare global {
  interface Window {
    ethereum: any;
  }
}

export function useWeb3Wallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize - check if already connected
  useEffect(() => {
    const checkConnection = async () => {
      setIsLoading(true);
      try {
        if (window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            
            // Get the current chain ID
            const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
            setChainId(parseInt(chainIdHex, 16));
          }
        }
      } catch (err: any) {
        console.error('Failed to check wallet connection:', err);
        setError('Failed to check wallet connection');
      } finally {
        setIsLoading(false);
      }
    };

    checkConnection();
  }, []);

  // Listen for account and chain changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setAddress(null);
        setIsConnected(false);
      } else {
        // User switched accounts
        setAddress(accounts[0]);
        setIsConnected(true);
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      setChainId(parseInt(chainIdHex, 16));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Function to connect wallet
  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('No ethereum wallet detected');
      }

      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        
        // Get the current chain ID
        const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
        setChainId(parseInt(chainIdHex, 16));
        
        return accounts[0];
      } else {
        throw new Error('No accounts returned from wallet');
      }
    } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      setError(err.message || 'Failed to connect wallet');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to disconnect wallet (note: MetaMask doesn't support programmatic disconnect)
  const disconnect = useCallback(() => {
    setAddress(null);
    setIsConnected(false);
    setChainId(null);
  }, []);

  // Function to switch networks
  const switchNetwork = useCallback(async (networkId: number) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('No ethereum wallet detected');
      }

      // Request switch to the desired network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${networkId.toString(16)}` }],
      });

      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(parseInt(chainIdHex, 16));
      
      return true;
    } catch (err: any) {
      // If the error code is 4902, the chain hasn't been added to MetaMask
      if (err.code === 4902) {
        setError('Please add this network to your wallet first');
      } else {
        console.error('Failed to switch network:', err);
        setError(err.message || 'Failed to switch network');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Format address for display (0x1234...5678)
  const shortAddress = useCallback((addr: string | null) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  }, []);

  // For ease of use, combine shortAddress with current address
  const shortDisplayAddress = address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';

  return {
    address,
    isConnected,
    chainId,
    isLoading,
    error,
    connect,
    disconnect,
    switchNetwork,
    shortAddress,
    shortDisplayAddress
  };
}
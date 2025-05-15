/**
 * useWalletConnect - React hook for handling Web3 wallet connections
 * 
 * This hook provides methods for connecting to both MetaMask and WalletConnect,
 * along with state management for the provider, signer, and wallet address.
 */
import { useState } from 'react';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';

export function useWalletConnect() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<boolean>(false);

  /**
   * Connect to MetaMask browser extension
   */
  const connectMetaMask = async () => {
    setConnecting(true);
    setConnectionError(null);
    
    try {
      if (window.ethereum) {
        const instance = new ethers.providers.Web3Provider(window.ethereum);
        
        // Request account access
        await instance.send("eth_requestAccounts", []);
        
        const signer = instance.getSigner();
        const address = await signer.getAddress();
        const network = await instance.getNetwork();
        
        setProvider(instance);
        setSigner(signer);
        setWalletAddress(address);
        setChainId(network.chainId);
        
        // Setup event listeners for account and chain changes
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            // User disconnected their wallet
            disconnectWallet();
          } else {
            setWalletAddress(accounts[0]);
          }
        });
        
        window.ethereum.on('chainChanged', (chainId: string) => {
          // Handle network change - force page refresh as recommended by MetaMask
          window.location.reload();
        });
      } else {
        setConnectionError("MetaMask not found. Please install the extension.");
      }
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      setConnectionError(error.message || "Failed to connect to MetaMask");
    } finally {
      setConnecting(false);
    }
  };

  /**
   * Connect using WalletConnect (for mobile wallets)
   */
  const connectWalletConnect = async () => {
    setConnecting(true);
    setConnectionError(null);
    
    try {
      // Initialize WalletConnect Provider
      const wcProvider = new WalletConnectProvider({
        rpc: {
          // Polygon Mainnet
          137: "https://polygon-rpc.com",
          // Polygon Amoy Testnet (if supported)
          80002: "https://polygon-amoy.g.alchemy.com/v2/demo"
        }
      });

      // Enable session (triggers QR Code modal)
      await wcProvider.enable();
      
      const instance = new ethers.providers.Web3Provider(wcProvider);
      const signer = instance.getSigner();
      const address = await signer.getAddress();
      const network = await instance.getNetwork();
      
      setProvider(instance);
      setSigner(signer);
      setWalletAddress(address);
      setChainId(network.chainId);
      
      // Setup disconnect listener
      wcProvider.on("disconnect", () => {
        disconnectWallet();
      });
      
      // Setup chain changed listener
      wcProvider.on("chainChanged", (chainId: number) => {
        setChainId(chainId);
      });
    } catch (error: any) {
      console.error("WalletConnect error:", error);
      setConnectionError(error.message || "Failed to connect with WalletConnect");
    } finally {
      setConnecting(false);
    }
  };

  /**
   * Disconnect the current wallet
   */
  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setWalletAddress(null);
    setChainId(null);
    setConnectionError(null);
    
    // Clear any stored connection data
    localStorage.removeItem('walletConnectType');
    
    // If using WalletConnect, we need to properly terminate the session
    if (provider && 'connection' in provider && 'disconnect' in provider.connection) {
      try {
        // @ts-ignore - WalletConnect has a disconnect method
        provider.connection.disconnect();
      } catch (e) {
        console.log("Error disconnecting WalletConnect", e);
      }
    }
  };

  /**
   * Get a shortened display version of the wallet address
   */
  const getShortAddress = () => {
    if (!walletAddress) return '';
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  };

  /**
   * Switch to Polygon Amoy Testnet
   */
  const switchToPolygonAmoy = async () => {
    if (!provider) {
      throw new Error("Wallet not connected");
    }
    
    try {
      // Polygon Amoy testnet
      const polygonAmoyChainId = "0x13882"; // 80002 in hex
      
      // Make sure we have ethereum access
      if (typeof window.ethereum === 'undefined') {
        throw new Error("MetaMask is not installed");
      }
      
      // Try to switch to Polygon Amoy
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: polygonAmoyChainId }],
      });
      
      return true;
    } catch (error: any) {
      // This error code indicates the chain has not been added to MetaMask
      if (error.code === 4902) {
        try {
          if (typeof window.ethereum === 'undefined') {
            throw new Error("MetaMask is not installed");
          }
          
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: "0x13882", // 80002 in hex
                chainName: 'Polygon Amoy Testnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18
                },
                rpcUrls: ['https://polygon-amoy.g.alchemy.com/v2/demo'],
                blockExplorerUrls: ['https://www.oklink.com/amoy'],
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error("Error adding Polygon Amoy chain", addError);
          return false;
        }
      }
      console.error("Error switching to Polygon Amoy", error);
      return false;
    }
  };

  /**
   * Sign a message for authentication
   */
  const signMessage = async (message: string) => {
    if (!signer) {
      throw new Error("Wallet not connected");
    }
    
    try {
      return await signer.signMessage(message);
    } catch (error: any) {
      console.error("Signature error:", error);
      throw new Error(error.message || "Failed to sign message");
    }
  };

  return {
    provider,
    signer,
    walletAddress,
    chainId,
    connecting,
    connectionError,
    connectMetaMask,
    connectWalletConnect,
    disconnectWallet,
    getShortAddress,
    switchToPolygonAmoy,
    signMessage,
    isConnected: !!walletAddress
  };
}

export default useWalletConnect;
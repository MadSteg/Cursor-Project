import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import useWalletConnect from '@/hooks/useWalletConnect';

// Define wallet context interface
interface WalletContextProps {
  walletAddress: string | null;
  chainId: number | null;
  isConnected: boolean;
  connecting: boolean;
  connectionError: string | null;
  connectMetaMask: () => Promise<void>;
  connectWalletConnect: () => Promise<void>;
  disconnectWallet: () => void;
  getShortAddress: () => string;
  switchToPolygonAmoy: () => Promise<void>;
  signMessage: (message: string) => Promise<string>;
}

// Create the context with a default undefined value
const WalletContext = createContext<WalletContextProps | undefined>(undefined);

// Create a provider component
export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const walletHook = useWalletConnect();
  const [initialized, setInitialized] = useState(false);

  // Try to reconnect from session storage on component mount
  useEffect(() => {
    const attemptReconnect = async () => {
      const connectedType = localStorage.getItem('walletConnectedType');
      
      if (connectedType === 'metamask') {
        try {
          await walletHook.connectMetaMask();
        } catch (error) {
          console.log('Failed to reconnect to MetaMask', error);
        }
      } else if (connectedType === 'walletconnect') {
        try {
          await walletHook.connectWalletConnect();
        } catch (error) {
          console.log('Failed to reconnect to WalletConnect', error);
        }
      }
      
      setInitialized(true);
    };
    
    attemptReconnect();
  }, []);

  // Wrapper for connectMetaMask that saves the connection type
  const connectMetaMask = async () => {
    await walletHook.connectMetaMask();
    if (walletHook.walletAddress) {
      localStorage.setItem('walletConnectedType', 'metamask');
    }
  };

  // Wrapper for connectWalletConnect that saves the connection type
  const connectWalletConnect = async () => {
    await walletHook.connectWalletConnect();
    if (walletHook.walletAddress) {
      localStorage.setItem('walletConnectedType', 'walletconnect');
    }
  };

  // Wrapper for disconnect that clears the connection type
  const disconnectWallet = () => {
    walletHook.disconnectWallet();
    localStorage.removeItem('walletConnectedType');
  };

  if (!initialized) {
    // Return a loading state or null if you're still trying to reconnect
    return null;
  }

  return (
    <WalletContext.Provider 
      value={{
        walletAddress: walletHook.walletAddress,
        chainId: walletHook.chainId,
        isConnected: walletHook.isConnected,
        connecting: walletHook.connecting,
        connectionError: walletHook.connectionError,
        connectMetaMask,
        connectWalletConnect,
        disconnectWallet,
        getShortAddress: walletHook.getShortAddress,
        switchToPolygonAmoy: walletHook.switchToPolygonAmoy,
        signMessage: walletHook.signMessage
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Create a custom hook to use the wallet context
export const useWallet = (): WalletContextProps => {
  const context = useContext(WalletContext);
  
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  
  return context;
};
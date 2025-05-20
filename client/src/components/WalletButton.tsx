import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

interface WalletButtonProps {
  className?: string;
}

const WalletButton: React.FC<WalletButtonProps> = ({ className = '' }) => {
  const { 
    walletAddress, 
    shortAddress, 
    balance, 
    status, 
    isConnected, 
    connect, 
    disconnect, 
    error 
  } = useWallet();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const handleConnect = async () => {
    try {
      await connect('metamask');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };
  
  const handleDisconnect = async () => {
    try {
      await disconnect();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };
  
  // If wallet is connected, show the connected state with dropdown
  if (isConnected && walletAddress) {
    return (
      <div className="relative">
        <button
          className={`flex items-center justify-between space-x-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors ${className}`}
          onClick={toggleDropdown}
        >
          <span className="flex items-center">
            <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
            <span className="font-medium">{shortAddress}</span>
          </span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        
        {isDropdownOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={closeDropdown}
            ></div>
            <div className="absolute right-0 mt-2 w-72 bg-card rounded-md shadow-lg border border-border z-20">
              <div className="p-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">Connected Address</span>
                    <span className="font-mono text-sm break-all">{walletAddress}</span>
                  </div>
                  
                  {balance && (
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground">Balance</span>
                      <span className="font-medium">{balance} MATIC</span>
                    </div>
                  )}
                  
                  <button
                    className="mt-2 w-full flex items-center justify-center px-4 py-2 border border-destructive/20 rounded-md text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={handleDisconnect}
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
  
  // If connecting, show loading state
  if (status === 'connecting' as string) {
    return (
      <button
        className={`flex items-center space-x-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/20 ${className}`}
        disabled
      >
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>Connecting...</span>
      </button>
    );
  }
  
  // Default state - not connected
  return (
    <div className="relative">
      <button
        className={`flex items-center space-x-2 px-4 py-2 rounded-md border text-white brand-gradient-bg hover:opacity-90 transition-opacity ${className}`}
        onClick={handleConnect}
        disabled={status === 'connecting'}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M14 12h4" />
          <path d="M6 12h4" />
        </svg>
        <span>Connect Wallet</span>
      </button>
      
      {error && (
        <div className="absolute right-0 mt-2 w-72 bg-card rounded-md shadow-lg border border-destructive p-3 z-20">
          <p className="text-sm text-destructive">{error}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Make sure MetaMask is installed and unlocked.
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletButton;
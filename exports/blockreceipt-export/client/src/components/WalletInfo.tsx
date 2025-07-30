import React from 'react';
import { useAuth } from '../contexts/WalletContext';

interface WalletInfoProps {
  className?: string;
}

const WalletInfo: React.FC<WalletInfoProps> = ({ className = '' }) => {
  const { 
    userEmail, 
    isLoggedIn, 
    login
  } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className={`p-6 border rounded-lg bg-card ${className}`}>
        <h2 className="text-xl font-medium mb-4">Account</h2>
        <p className="text-muted-foreground mb-4">
          Log in to view your account information and manage digital receipts.
        </p>
        <button
          onClick={() => login('user@example.com')}
          className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white brand-gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
            className="mr-2"
          >
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M14 12h4" />
            <path d="M6 12h4" />
          </svg>
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 border rounded-lg bg-card ${className}`}>
      <h2 className="text-xl font-medium mb-4">Wallet Details</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Connected Address</h3>
          <p className="mt-1 font-mono text-sm break-all">{walletAddress}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Network</h3>
          <div className="mt-1 flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {network.name || 'Unknown Network'}
            </span>
          </div>
        </div>
        
        {balance && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Balance</h3>
            <p className="mt-1 font-medium">{balance} MATIC</p>
          </div>
        )}
        
        <div className="pt-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            <a 
              href={`https://amoy.polygonscan.com/address/${walletAddress}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center px-3 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
            >
              View on Explorer
            </a>
            <a 
              href="/wallet/gallery" 
              className="inline-flex justify-center items-center px-3 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
            >
              View NFT Gallery
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletInfo;
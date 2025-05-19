import React from 'react';
import { Link, useLocation } from 'wouter';

interface HeaderProps {
  isConnected: boolean;
  walletAddress: string;
  connectWallet: () => void;
}

const Header: React.FC<HeaderProps> = ({ isConnected, walletAddress, connectWallet }) => {
  const [location] = useLocation();

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <a className="flex items-center">
                <span className="font-bold text-xl brand-gradient-text">BlockReceipt.ai</span>
              </a>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/">
                <a className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === '/' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Home
                </a>
              </Link>
              
              <Link href="/dashboard">
                <a className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Dashboard
                </a>
              </Link>
              
              <Link href="/wallet">
                <a className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === '/wallet' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Wallet
                </a>
              </Link>
              
              <Link href="/ocr-test">
                <a className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === '/ocr-test' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  OCR Test
                </a>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center bg-secondary text-secondary-foreground px-3 py-2 rounded-md text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span>{truncateAddress(walletAddress)}</span>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="brand-gradient-bg text-white text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
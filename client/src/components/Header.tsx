import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useWallet } from '../contexts/WalletContext';
import { useLanguage } from '../contexts/LanguageContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { isConnected, walletAddress, connect, disconnect } = useWallet();
  const { language, setLanguage, t } = useLanguage();
  
  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Navigation links
  const navLinks = [
    { name: t('nav.nftGallery'), path: '/nft-browser' },
    { name: t('nav.whyBlockReceipt'), path: '/why-blockreceipt' },
    { name: t('nav.forMerchants'), path: '/for-merchants' },
  ];
  
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full overflow-hidden brand-gradient-bg flex items-center justify-center">
              <span className="text-white font-bold text-lg">BR</span>
            </div>
            <span className="text-xl font-bold brand-gradient-text">BlockReceipt.ai</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* Wallet Connect (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Wallet Connect */}
            {isConnected && walletAddress ? (
              <div className="flex items-center">
                <div className="mr-4 px-4 py-2 bg-muted rounded-md">
                  <span className="text-sm font-medium">
                    {formatWalletAddress(walletAddress)}
                  </span>
                </div>
                <button
                  onClick={disconnect}
                  className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
                >
                  {t('common.disconnect')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => connect('metamask')}
                className="interactive-button px-4 py-2 rounded-md text-sm font-medium text-white brand-gradient-bg transition-colors"
              >
                {t('common.connectWallet')}
              </button>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:bg-muted"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden py-4 border-t animate-fade-in">
          <div className="container mx-auto px-4 space-y-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    location === link.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            {/* Wallet Connect Button (Mobile) */}
            <div className="pt-2 border-t">
              {isConnected && walletAddress ? (
                <div className="flex flex-col space-y-2">
                  <div className="px-4 py-2 bg-muted rounded-md">
                    <span className="text-sm font-medium">
                      {formatWalletAddress(walletAddress)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      disconnect();
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    connect('metamask');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 rounded-md text-sm font-medium text-white brand-gradient-bg"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
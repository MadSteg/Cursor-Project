import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';

const Header: React.FC = () => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const [isMerchantMenuOpen, setIsMerchantMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsWalletMenuOpen(false);
    setIsMerchantMenuOpen(false);
    setIsAdminMenuOpen(false);
  };

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-card shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="brand-gradient-text font-bold text-xl">
              BlockReceipt.ai
            </Link>
          </div>
          
          <div className="-mr-2 -my-2 md:hidden">
            <button
              type="button"
              className="rounded-md p-2 inline-flex items-center justify-center text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          
          <nav className="hidden md:flex space-x-10">
            <Link href="/" className={`text-base font-medium ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              Home
            </Link>
            
            <Link href="/dashboard" className={`text-base font-medium ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              Dashboard
            </Link>
            
            <div className="relative">
              <button
                type="button"
                className={`text-base font-medium inline-flex items-center ${isWalletMenuOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => {
                  setIsWalletMenuOpen(!isWalletMenuOpen);
                  setIsMerchantMenuOpen(false);
                  setIsAdminMenuOpen(false);
                }}
              >
                <span>Wallet</span>
                <svg
                  className={`ml-2 h-5 w-5 transition-transform ${isWalletMenuOpen ? 'transform rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              
              {isWalletMenuOpen && (
                <div className="absolute z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-2">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-6 bg-white p-6">
                      <Link 
                        href="/wallet"
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-muted"
                        onClick={closeAllMenus}
                      >
                        <div className="ml-4">
                          <p className="text-sm font-medium text-foreground">
                            Wallet Manager
                          </p>
                          <p className="text-xs text-muted-foreground">
                            View your connected wallets and NFTs
                          </p>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/ocr-test"
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-muted"
                        onClick={closeAllMenus}
                      >
                        <div className="ml-4">
                          <p className="text-sm font-medium text-foreground">
                            OCR Test
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Test the receipt OCR engines
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                type="button"
                className={`text-base font-medium inline-flex items-center ${isMerchantMenuOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => {
                  setIsMerchantMenuOpen(!isMerchantMenuOpen);
                  setIsWalletMenuOpen(false);
                  setIsAdminMenuOpen(false);
                }}
              >
                <span>Merchant Tools</span>
                <svg
                  className={`ml-2 h-5 w-5 transition-transform ${isMerchantMenuOpen ? 'transform rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              
              {isMerchantMenuOpen && (
                <div className="absolute z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-2">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-6 bg-white p-6">
                      <Link 
                        href="/merchant/register"
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-muted"
                        onClick={closeAllMenus}
                      >
                        <div className="ml-4">
                          <p className="text-sm font-medium text-foreground">
                            Merchant Registration
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Register as a merchant to issue receipts
                          </p>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/merchant/promo"
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-muted"
                        onClick={closeAllMenus}
                      >
                        <div className="ml-4">
                          <p className="text-sm font-medium text-foreground">
                            Promotion Management
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Create and manage promotions
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                type="button"
                className={`text-base font-medium inline-flex items-center ${isAdminMenuOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => {
                  setIsAdminMenuOpen(!isAdminMenuOpen);
                  setIsWalletMenuOpen(false);
                  setIsMerchantMenuOpen(false);
                }}
              >
                <span>Admin Tools</span>
                <svg
                  className={`ml-2 h-5 w-5 transition-transform ${isAdminMenuOpen ? 'transform rotate-180' : ''}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              
              {isAdminMenuOpen && (
                <div className="absolute z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-2">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-6 bg-white p-6">
                      <Link 
                        href="/admin/nft-pool"
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-muted"
                        onClick={closeAllMenus}
                      >
                        <div className="ml-4">
                          <p className="text-sm font-medium text-foreground">
                            NFT Pool Management
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Manage the NFT pool for receipts
                          </p>
                        </div>
                      </Link>
                      
                      <Link 
                        href="/admin/blockchain"
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-muted"
                        onClick={closeAllMenus}
                      >
                        <div className="ml-4">
                          <p className="text-sm font-medium text-foreground">
                            Blockchain Status
                          </p>
                          <p className="text-xs text-muted-foreground">
                            View blockchain network status
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>
          
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <Link 
              href="/upload" 
              className="inline-flex items-center justify-center h-10 px-4 py-2 brand-gradient-bg text-white rounded-md shadow-sm font-medium"
            >
              Upload Receipt
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-50">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-card divide-y-2 divide-muted">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="brand-gradient-text font-bold text-xl">
                    BlockReceipt.ai
                  </span>
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="rounded-md p-2 inline-flex items-center justify-center text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <Link 
                    href="/"
                    className="-m-3 p-3 flex items-center rounded-md hover:bg-muted"
                    onClick={closeAllMenus}
                  >
                    <span className="ml-3 text-base font-medium text-foreground">
                      Home
                    </span>
                  </Link>
                  
                  <Link 
                    href="/dashboard"
                    className="-m-3 p-3 flex items-center rounded-md hover:bg-muted"
                    onClick={closeAllMenus}
                  >
                    <span className="ml-3 text-base font-medium text-foreground">
                      Dashboard
                    </span>
                  </Link>
                  
                  <Link 
                    href="/wallet"
                    className="-m-3 p-3 flex items-center rounded-md hover:bg-muted"
                    onClick={closeAllMenus}
                  >
                    <span className="ml-3 text-base font-medium text-foreground">
                      Wallet Manager
                    </span>
                  </Link>
                  
                  <Link 
                    href="/ocr-test"
                    className="-m-3 p-3 flex items-center rounded-md hover:bg-muted"
                    onClick={closeAllMenus}
                  >
                    <span className="ml-3 text-base font-medium text-foreground">
                      OCR Test
                    </span>
                  </Link>
                  
                  <Link 
                    href="/upload"
                    className="-m-3 p-3 flex items-center rounded-md hover:bg-muted"
                    onClick={closeAllMenus}
                  >
                    <span className="ml-3 text-base font-medium text-foreground">
                      Upload Receipt
                    </span>
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
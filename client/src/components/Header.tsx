import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../contexts/WalletContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { isLoggedIn, userEmail, login, logout } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      login(emailInput.trim());
      setShowLoginForm(false);
      setEmailInput("");
    }
  };
  

  
  // Navigation links
  const navLinks = [
    { name: 'Why use BlockReceipt?', path: '/why-blockreceipt' },
    { name: 'Receipt Vault', path: '/nft-browser' },
    { name: 'POS Integration', path: '/pos-integration' },
    { name: 'Brand Engagement', path: '/brand-engagement' },
    { name: 'Mobile App', path: '/mobile' },
    { name: 'Merchant Signup', path: '/merchant-onboarding' },
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
            <span className="text-xl font-bold brand-gradient-text">BlockReceipt</span>
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
          
          {/* Login/Logout (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn && userEmail ? (
              <div className="flex items-center">
                <div className="mr-4 px-4 py-2 bg-muted rounded-md">
                  <span className="text-sm font-medium">
                    {userEmail}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowLoginForm(!showLoginForm)}
                  className="interactive-button px-4 py-2 rounded-md text-sm font-medium text-white brand-gradient-bg transition-colors"
                >
                  Login
                </button>
                {showLoginForm && (
                  <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-md shadow-lg p-4 min-w-64 z-50">
                    <form onSubmit={handleLogin}>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Enter your email"
                        required
                      />
                      <button
                        type="submit"
                        className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                      >
                        Login
                      </button>
                    </form>
                  </div>
                )}
              </div>
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
            
            {/* Login/Logout (Mobile) */}
            <div className="pt-2 border-t">
              {isLoggedIn && userEmail ? (
                <div className="mb-4">
                  <div className="mb-2 px-4 py-2 bg-muted rounded-md">
                    <span className="text-sm font-medium">
                      {userEmail}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="mb-4">
                  <form onSubmit={(e) => { handleLogin(e); setIsOpen(false); }}>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-3"
                      placeholder="Enter your email"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full px-4 py-2 rounded-md text-sm font-medium text-white brand-gradient-bg"
                    >
                      Login
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
import React, { Suspense, useEffect } from 'react';
import { Route, Switch } from 'wouter';
import Header from "./components/Header";
import { ErrorBoundary, LoadingFallback } from "./components/ErrorBoundary";
import { initGA } from './lib/analytics';
import { useAnalytics } from './hooks/use-analytics';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Wallet = React.lazy(() => import("./pages/Wallet"));
const Gallery = React.lazy(() => import("./pages/Gallery"));
const NFTBrowser = React.lazy(() => import("./pages/NFTBrowser"));
const NFTDetail = React.lazy(() => import("./pages/NFTDetail"));
const EnhancedNFTGallery = React.lazy(() => import("./pages/EnhancedNFTGallery"));
const NFTTutorial = React.lazy(() => import("./components/NFTTutorial"));
const Home = React.lazy(() => import("./pages/Home"));
const MerchantDemo = React.lazy(() => import("./pages/MerchantDemo"));
const Enterprise = React.lazy(() => import("./pages/Enterprise"));
const HowItWorks = React.lazy(() => import("./pages/HowItWorks"));
const WhyBlockReceipt = React.lazy(() => import("./pages/WhyBlockReceipt"));
const ForMerchants = React.lazy(() => import("./pages/ForMerchants"));
const PaymentTest = React.lazy(() => import("./pages/PaymentTest"));
const MerchantPortal = React.lazy(() => import("./pages/MerchantPortal"));
const LoyaltyRewards = React.lazy(() => import("./pages/LoyaltyRewards"));
const PREDemo = React.lazy(() => import("./pages/PREDemo"));

import { WalletProvider, useWallet } from './contexts/WalletContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './hooks/use-toast';

// Removed CloudStorage references

// Inner component that uses the wallet context
const AppContent: React.FC = () => {
  const { isConnected } = useWallet();
  
  // Track page views when routes change
  useAnalytics();

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      
      <main className="py-8 px-4 container mx-auto">
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback message="Loading page..." />}>
            <Switch>
          <Route path="/">
            <Home />
          </Route>
          
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          
          <Route path="/wallet">
            <Wallet />
          </Route>
          
          <Route path="/gallery">
            <Gallery />
          </Route>
          
          <Route path="/nft-browser">
            <NFTBrowser />
          </Route>
          
          <Route path="/nft/:id">
            <NFTDetail />
          </Route>
          
          <Route path="/why-blockreceipt">
            <WhyBlockReceipt />
          </Route>
          
          <Route path="/for-merchants">
            <ForMerchants />
          </Route>
          
          <Route path="/payment-test">
            <PaymentTest />
          </Route>
          
          <Route path="/merchant-portal">
            <MerchantPortal />
          </Route>
          
          <Route>
            <div className="max-w-md mx-auto text-center py-12">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-xl mb-8">Page not found</p>
              <a 
                href="/" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white brand-gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Back to Home
              </a>
            </div>
          </Route>
            </Switch>
          </Suspense>
        </ErrorBoundary>
      </main>
      
      <footer className="py-8 border-t border-slate-700">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-slate-400">
            © {new Date().getFullYear()} BlockReceipt.ai. All rights reserved.
          </p>
        </div>
      </footer>
      
      {/* Display the NFT Tutorial for logged-in users */}
      {isConnected && (
        <Suspense fallback={<LoadingFallback message="Loading tutorial..." />}>
          <NFTTutorial />
        </Suspense>
      )}
    </div>
  );
};

// Main App component that provides the wallet context
const App: React.FC = () => {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <LanguageProvider>
      <WalletProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </WalletProvider>
    </LanguageProvider>
  );
};

export default App;
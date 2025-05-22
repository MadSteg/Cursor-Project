import React from 'react';
import { Route, Switch } from 'wouter';
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import OCRTestPage from "./pages/OCRTestPage";
import Upload from "./pages/Upload";
import Gallery from "./pages/Gallery";
import NFTBrowser from "./pages/NFTBrowser";
import NFTDetail from "./pages/NFTDetail";
import NFTTutorial from "./components/NFTTutorial";
import Home from "./pages/Home";
import CloudStorageDemo from "./pages/CloudStorageDemo";
import CloudStorageExplorer from "./pages/CloudStorageExplorer";
import MerchantDemo from "./pages/MerchantDemo";
import Enterprise from "./pages/Enterprise";
import { WalletProvider, useWallet } from './contexts/WalletContext';

// Inner component that uses the wallet context
const AppContent: React.FC = () => {
  const { isConnected } = useWallet();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="py-8 px-4 container mx-auto">
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
          
          <Route path="/ocr-test">
            <OCRTestPage />
          </Route>
          
          <Route path="/upload">
            <Upload />
          </Route>
          
          <Route path="/cloud-storage">
            <CloudStorageDemo />
          </Route>
          
          <Route path="/cloud-explorer">
            <CloudStorageExplorer />
          </Route>
          
          <Route path="/merchant-demo">
            <MerchantDemo />
          </Route>
          
          <Route path="/enterprise">
            <Enterprise />
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
      </main>
      
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} BlockReceipt.ai. All rights reserved.
          </p>
        </div>
      </footer>
      
      {/* Display the NFT Tutorial for logged-in users */}
      {isConnected && <NFTTutorial />}
    </div>
  );
};

// Main App component that provides the wallet context
const App: React.FC = () => {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
};

export default App;
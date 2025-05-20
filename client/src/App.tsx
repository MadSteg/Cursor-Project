import React from 'react';
import { Route, Switch } from 'wouter';
import ReceiptUploader from "./components/ReceiptUploader";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import OCRTestPage from "./pages/OCRTestPage";
import Upload from "./pages/Upload";
import { WalletProvider, useWallet } from './contexts/WalletContext';

// Inner component that uses the wallet context
const AppContent: React.FC = () => {
  const { walletAddress } = useWallet();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="py-8 px-4 container mx-auto">
        <Switch>
          <Route path="/">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 brand-gradient-text">
                  BlockReceipt.ai
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Transform paper and email receipts into secure, verifiable NFTs with enhanced privacy controls.
                </p>
              </div>
              
              {walletAddress && <ReceiptUploader walletAddress={walletAddress} />}
              {!walletAddress && (
                <div className="text-center p-8 border border-dashed border-primary/20 rounded-lg">
                  <p className="mb-4 text-muted-foreground">
                    Connect your wallet to upload receipts and mint NFTs
                  </p>
                  <div className="flex justify-center">
                    {/* Wallet connection button will be in the Header */}
                  </div>
                </div>
              )}
            </div>
          </Route>
          
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          
          <Route path="/wallet">
            <Wallet />
          </Route>
          
          <Route path="/ocr-test">
            <OCRTestPage />
          </Route>
          
          <Route path="/upload">
            <Upload />
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
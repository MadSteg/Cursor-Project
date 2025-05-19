import React, { useState } from 'react';
import { Route, Switch } from 'wouter';
import ReceiptUploader from './components/ReceiptUploader';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import OCRTestPage from './pages/OCRTestPage';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // Simulating wallet connection
  const connectWallet = () => {
    const mockWalletAddress = '0x' + Math.random().toString(36).substring(2, 15);
    setWalletAddress(mockWalletAddress);
    setIsConnected(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isConnected={isConnected} 
        walletAddress={walletAddress} 
        connectWallet={connectWallet} 
      />
      
      <main className="container mx-auto px-4 py-8">
        <Switch>
          <Route path="/">
            <div className="max-w-5xl mx-auto">
              <section className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 brand-gradient-text">
                  Transform Receipts into Digital Assets
                </h1>
                <p className="text-xl text-muted-foreground">
                  Upload, categorize, and manage receipts with blockchain-powered security and privacy
                </p>
              </section>
              
              {isConnected ? (
                <ReceiptUploader walletAddress={walletAddress} />
              ) : (
                <div className="text-center p-12 border rounded-lg bg-card shadow-sm">
                  <h2 className="text-2xl font-semibold mb-4">Connect Your Wallet to Start</h2>
                  <p className="mb-6 text-muted-foreground">
                    To upload receipts and access your digital assets, you need to connect your wallet.
                  </p>
                  <button 
                    onClick={connectWallet}
                    className="brand-gradient-bg text-white font-medium px-6 py-3 rounded-md"
                  >
                    Connect Wallet
                  </button>
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
        </Switch>
      </main>
      
      <footer className="mt-16 py-8 bg-muted">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>BlockReceipt.ai - Secure and private receipt management on the blockchain</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
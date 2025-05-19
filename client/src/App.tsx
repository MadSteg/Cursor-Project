import React, { useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import ReceiptUploader from "./components/ReceiptUploader";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import OCRTestPage from "./pages/OCRTestPage";

const App: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="py-8 px-4 container mx-auto">
        <Switch>
          <Route path="/" exact>
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 brand-gradient-text">
                  BlockReceipt.ai
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Transform paper and email receipts into secure, verifiable NFTs with enhanced privacy controls.
                </p>
              </div>
              
              <ReceiptUploader walletAddress={walletAddress} />
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
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Upload Receipt</h1>
              <ReceiptUploader walletAddress={walletAddress} />
            </div>
          </Route>
          
          <Route>
            <div className="max-w-md mx-auto text-center py-12">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-lg text-muted-foreground mb-6">
                The page you're looking for doesn't exist.
              </p>
              <a
                href="/"
                className="inline-flex items-center justify-center h-10 px-4 py-2 brand-gradient-bg text-white rounded-md shadow-sm font-medium"
              >
                Go Home
              </a>
            </div>
          </Route>
        </Switch>
      </main>
      
      <footer className="bg-card border-t py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">BlockReceipt.ai</h3>
              <p className="text-sm text-muted-foreground">
                Transform your receipts into secure, verifiable, and private digital assets on the blockchain.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/" className="text-muted-foreground hover:text-primary transition">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="text-muted-foreground hover:text-primary transition">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/wallet" className="text-muted-foreground hover:text-primary transition">
                    Wallet
                  </a>
                </li>
                <li>
                  <a href="/ocr-test" className="text-muted-foreground hover:text-primary transition">
                    OCR Test
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-muted mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} BlockReceipt.ai. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
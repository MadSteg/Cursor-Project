/**
 * DevModeWalletButton - A component for simulating wallet connections in development
 * 
 * This component provides a simulated wallet connection for testing in environments
 * where MetaMask or other wallet extensions are not available.
 */
import { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { mockProvider, simulateWalletConnection, simulateWalletDisconnection } from '@/utils/mockWalletProvider';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface DevModeWalletButtonProps {
  onWalletConnected?: (address: string) => void;
  onWalletDisconnected?: () => void;
  className?: string;
}

export default function DevModeWalletButton({
  onWalletConnected,
  onWalletDisconnected,
  className = ''
}: DevModeWalletButtonProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  
  const connectDevWallet = async () => {
    try {
      // Set window.ethereum to our mock provider if in development mode
      Object.defineProperty(window, 'ethereum', {
        value: mockProvider,
        writable: true,
        configurable: true
      });
      
      // Create a provider from our mock
      const provider = new ethers.providers.Web3Provider(mockProvider);
      
      // Simulate a wallet connection
      const address = simulateWalletConnection();
      
      setWalletAddress(address);
      setIsConnected(true);
      
      if (onWalletConnected) {
        onWalletConnected(address);
      }
      
      console.log('[Dev Mode] Wallet connected:', address);
    } catch (error) {
      console.error('[Dev Mode] Error connecting wallet:', error);
    }
  };
  
  const disconnectDevWallet = () => {
    simulateWalletDisconnection();
    setWalletAddress(null);
    setIsConnected(false);
    
    if (onWalletDisconnected) {
      onWalletDisconnected();
    }
    
    console.log('[Dev Mode] Wallet disconnected');
  };
  
  // If connected, show the wallet address and disconnect option
  if (isConnected && walletAddress) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">Dev Wallet Connected</p>
            <p className="text-xs text-green-600">
              {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={disconnectDevWallet}
          className="w-full border-red-200 text-red-600 hover:bg-red-50"
        >
          Disconnect Dev Wallet
        </Button>
      </div>
    );
  }
  
  // If not connected, show the connect button
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-yellow-500" />
        <div>
          <p className="text-sm font-medium text-yellow-800">Development Mode</p>
          <p className="text-xs text-yellow-600">
            Connect using simulated wallet for testing
          </p>
        </div>
      </div>
      <Button 
        onClick={connectDevWallet}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
      >
        Connect Development Wallet
      </Button>
    </div>
  );
}
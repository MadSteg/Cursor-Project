import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet } from 'lucide-react';
import { connectWallet, isWalletConnected, getWalletAddress, WalletConnection } from '@/lib/blockchainService';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConnectWalletButtonProps {
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onConnect?: (walletInfo: WalletConnection) => void;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ 
  size = 'default',
  onConnect 
}) => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  // Check initial wallet connection on component mount
  useEffect(() => {
    const checkConnection = () => {
      const isConnected = isWalletConnected();
      setConnected(isConnected);
      
      if (isConnected) {
        const address = getWalletAddress();
        setWalletAddress(address);
      }
    };
    
    checkConnection();
  }, []);
  
  const handleConnect = async () => {
    setConnecting(true);
    
    try {
      const walletInfo = await connectWallet();
      setConnected(true);
      setWalletAddress(walletInfo.address);
      
      if (onConnect) {
        onConnect(walletInfo);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };
  
  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  return (
    <div>
      {!connected ? (
        <Button 
          onClick={handleConnect} 
          disabled={connecting}
          size={size}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {connecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </>
          )}
        </Button>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size={size}
                className="font-mono"
              >
                <Wallet className="mr-2 h-4 w-4 text-green-600" />
                {formatAddress(walletAddress)}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-mono text-xs">{walletAddress}</p>
              <p className="text-xs mt-1">Wallet connected to Polygon Amoy testnet</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default ConnectWalletButton;
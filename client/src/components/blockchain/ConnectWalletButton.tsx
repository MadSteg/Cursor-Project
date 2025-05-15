import React from 'react';
import { Button } from '@/components/ui/button';
import { useWeb3Wallet } from '../../hooks/useWeb3Wallet';
import { 
  Wallet, 
  LogOut, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

interface ConnectWalletButtonProps {
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ 
  size = 'default',
  className = ''
}) => {
  const { address, isConnected, connect, disconnect, shortDisplayAddress, isMockWallet } = useWeb3Wallet();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
      if (process.env.NODE_ENV === 'development') {
        toast({
          title: 'Development Mode',
          description: 'Connected with test wallet in development mode',
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to your wallet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      toast({
        title: 'Address Copied',
        description: 'Wallet address copied to clipboard',
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const viewOnExplorer = () => {
    if (address) {
      // Polygon Amoy explorer
      window.open(`https://amoy.polygonscan.com/address/${address}`, '_blank');
    }
  };

  if (isConnected && address) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size={size} 
            className={`flex items-center gap-2 px-3 ${className} ${isMockWallet ? 'border-amber-400 dark:border-amber-500' : ''}`}
          >
            <Wallet className={`h-4 w-4 ${isMockWallet ? 'text-amber-500' : ''}`} />
            <span className="font-medium">{shortDisplayAddress}</span>
            {isMockWallet && <span className="text-xs bg-amber-200 dark:bg-amber-900 px-1 rounded text-amber-800 dark:text-amber-200">TEST</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            {isMockWallet ? 'Test Wallet Connected' : 'Wallet Connected'}
            {isMockWallet && (
              <span className="block text-xs text-amber-600 dark:text-amber-400 mt-1">
                (Development Mode)
              </span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyAddress}>
            {copied ? (
              <Check className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={viewOnExplorer}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnect}>
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      onClick={handleConnect} 
      size={size} 
      className={`flex items-center gap-2 ${className}`}
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
};

export default ConnectWalletButton;
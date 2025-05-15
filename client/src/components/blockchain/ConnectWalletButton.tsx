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
  const { address, isConnected, connect, disconnect, shortDisplayAddress } = useWeb3Wallet();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    try {
      await connect();
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
            className={`flex items-center gap-2 px-3 ${className}`}
          >
            <Wallet className="h-4 w-4" />
            <span className="font-medium">{shortDisplayAddress}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Wallet Connected</DropdownMenuLabel>
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
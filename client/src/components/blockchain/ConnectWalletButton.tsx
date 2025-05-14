/**
 * Connect Web3 Wallet Button Component
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wallet, ChevronDown, ChevronUp, ExternalLink, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ConnectWalletButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  className?: string;
}

export default function ConnectWalletButton({ 
  variant = 'default', 
  size = 'default',
  className = ''
}: ConnectWalletButtonProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  // Format wallet address for display
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Connect to MetaMask wallet
  const connectMetaMask = async () => {
    setIsConnecting(true);
    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        try {
          // Request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          
          // Get the first account
          const address = accounts[0];
          setWalletAddress(address);
          setIsConnected(true);
          setSelectedWallet('MetaMask');
          
          toast({
            title: 'Wallet Connected',
            description: `Connected to MetaMask: ${formatAddress(address)}`,
          });
        } catch (error: any) {
          toast({
            title: 'Connection Failed',
            description: error.message || 'Could not connect to MetaMask',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'MetaMask Not Found',
          description: 'Please install MetaMask browser extension to connect',
          variant: 'destructive',
        });
        
        // Open MetaMask installation page
        window.open('https://metamask.io/download.html', '_blank');
      }
    } catch (error: any) {
      toast({
        title: 'Connection Error',
        description: error.message || 'An error occurred while connecting',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
      setIsOpen(false);
    }
  };

  // Connect to Coinbase wallet
  const connectCoinbaseWallet = async () => {
    setIsConnecting(true);
    try {
      // Mock implementation (would use actual Coinbase Wallet SDK in production)
      setTimeout(() => {
        const mockAddress = '0xD8f24D419153A6A1a98734F26e4E7C3CeE01CA0c';
        setWalletAddress(mockAddress);
        setIsConnected(true);
        setSelectedWallet('Coinbase');
        
        toast({
          title: 'Wallet Connected',
          description: `Connected to Coinbase Wallet: ${formatAddress(mockAddress)}`,
        });
        
        setIsConnecting(false);
        setIsOpen(false);
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Connection Error',
        description: error.message || 'An error occurred while connecting',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  // Connect to WalletConnect
  const connectWalletConnect = async () => {
    setIsConnecting(true);
    try {
      // Mock implementation (would use actual WalletConnect SDK in production)
      setTimeout(() => {
        const mockAddress = '0xA3f7BF5b1315e20Bb5F2B587125c24485257A435';
        setWalletAddress(mockAddress);
        setIsConnected(true);
        setSelectedWallet('WalletConnect');
        
        toast({
          title: 'Wallet Connected',
          description: `Connected via WalletConnect: ${formatAddress(mockAddress)}`,
        });
        
        setIsConnecting(false);
        setIsOpen(false);
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Connection Error',
        description: error.message || 'An error occurred while connecting',
        variant: 'destructive',
      });
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
    setSelectedWallet(null);
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected',
    });
  };

  // Display connected state or connect button
  if (isConnected && walletAddress) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={`${className} flex items-center gap-2 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800`}
            size={size}
          >
            <Check className="h-4 w-4 text-green-500" />
            <span>{formatAddress(walletAddress)}</span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Connected Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center justify-between" disabled>
            <span className="font-medium">{selectedWallet}</span>
            <Check className="h-4 w-4 text-green-500" />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1">
            <span className="text-xs text-muted-foreground">Address</span>
            <span className="font-mono text-xs">{walletAddress}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex items-center gap-2" onClick={() => window.open(`https://mumbai.polygonscan.com/address/${walletAddress}`, '_blank')}>
            <ExternalLink className="h-4 w-4" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-rose-500 focus:text-rose-500" onClick={disconnectWallet}>
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Display connect wallet dropdown
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          className={`${className} flex items-center gap-2`} 
          size={size}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </span>
          ) : (
            <>
              <Wallet className="h-4 w-4" />
              Connect Wallet
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Choose Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2" onClick={connectMetaMask}>
          <img src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg" alt="MetaMask" className="h-5 w-5" />
          MetaMask
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2" onClick={connectCoinbaseWallet}>
          <img src="https://uploads-ssl.webflow.com/6356a9e4137acd3c4ed087e2/6356aad990692e213973407b_cbw.svg" alt="Coinbase Wallet" className="h-5 w-5" />
          Coinbase Wallet
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center gap-2" onClick={connectWalletConnect}>
          <img src="https://1000logos.net/wp-content/uploads/2022/05/WalletConnect-Logo.png" alt="WalletConnect" className="h-5 w-5 object-contain" />
          WalletConnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Add window.ethereum type for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: {method: string}) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}
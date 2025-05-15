import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';
import { Wallet, AlertTriangle, ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';

interface ConnectWalletButtonProps {
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'link' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showBalance?: boolean;
  showNetwork?: boolean;
  className?: string;
}

/**
 * A button component that allows users to connect their MetaMask wallet
 * and switch to the Polygon Amoy network if needed.
 */
export default function ConnectWalletButton({
  variant = 'default',
  size = 'default',
  showBalance = false,
  showNetwork = false,
  className = '',
}: ConnectWalletButtonProps) {
  const { walletInfo, loading, connectWallet, disconnectWallet, switchToPolygonAmoy } = useWeb3Wallet();
  const { toast } = useToast();

  // Convert address to short display format (0x1234...5678)
  const shortAddress = walletInfo.address 
    ? `${walletInfo.address.substring(0, 6)}...${walletInfo.address.substring(38)}`
    : '';

  const handleNetworkSwitch = async () => {
    try {
      await switchToPolygonAmoy();
    } catch (error) {
      console.error('Failed to switch network:', error);
      toast({
        title: 'Network Switch Failed',
        description: 'Could not switch to Polygon Amoy network',
        variant: 'destructive'
      });
    }
  };

  // Not connected - show connect button
  if (!walletInfo.connected) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={connectWallet}
        disabled={loading}
        className={className}
      >
        {loading ? (
          <>
            <Spinner className="mr-2 h-4 w-4" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>
    );
  }

  // Connected but wrong network - show switch button
  if (!walletInfo.isCorrectNetwork) {
    return (
      <Button
        variant="destructive"
        size={size}
        onClick={handleNetworkSwitch}
        className={className}
      >
        <AlertTriangle className="mr-2 h-4 w-4" />
        Switch to Polygon Amoy
      </Button>
    );
  }

  // Connected and correct network - show address with dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`flex items-center ${className}`}
        >
          <Wallet className="mr-2 h-4 w-4" />
          <span>{shortAddress}</span>
          
          {showBalance && walletInfo.balance && (
            <Badge variant="outline" className="ml-2">
              {walletInfo.balance} MATIC
            </Badge>
          )}
          
          {showNetwork && (
            <Badge variant="secondary" className="ml-2">
              <Check className="h-3 w-3 mr-1" />
              Polygon Amoy
            </Badge>
          )}
          
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(walletInfo.address);
            toast({
              title: 'Address Copied',
              description: 'Wallet address copied to clipboard',
              variant: 'default'
            });
          }}
        >
          Copy Address
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => {
            window.open(`https://amoy.polygonscan.com/address/${walletInfo.address}`, '_blank');
          }}
        >
          View on Explorer
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={disconnectWallet}
          className="text-destructive"
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
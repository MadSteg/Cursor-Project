/**
 * WalletButton - A reusable component for wallet connection
 * 
 * This component provides UI buttons for connecting to MetaMask and WalletConnect,
 * as well as displaying the connected wallet address when connected.
 */
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, Plug, Loader2, LogOut, Shield, Check } from "lucide-react";
import { useWalletConnect } from '@/hooks/useWalletConnect';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WalletButtonProps {
  onWalletConnected?: (address: string) => void;
  onWalletDisconnected?: () => void;
  className?: string;
}

export default function WalletButton({ 
  onWalletConnected, 
  onWalletDisconnected,
  className = "" 
}: WalletButtonProps) {
  const { toast } = useToast();
  const { 
    walletAddress, 
    connectMetaMask, 
    connectWalletConnect, 
    disconnectWallet, 
    getShortAddress,
    connectionError,
    connecting,
    chainId
  } = useWalletConnect();
  
  // Track dropdown open state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle MetaMask connection
  const handleConnectMetaMask = async () => {
    try {
      await connectMetaMask();
      if (walletAddress && onWalletConnected) {
        onWalletConnected(walletAddress);
      }
      setDropdownOpen(false); // Close dropdown after connection
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Could not connect to MetaMask",
        variant: "destructive"
      });
    }
  };

  // Handle WalletConnect connection
  const handleConnectWalletConnect = async () => {
    try {
      await connectWalletConnect();
      if (walletAddress && onWalletConnected) {
        onWalletConnected(walletAddress);
      }
      setDropdownOpen(false); // Close dropdown after connection
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Could not connect with WalletConnect",
        variant: "destructive"
      });
    }
  };

  // Handle disconnect button
  const handleDisconnect = () => {
    disconnectWallet();
    if (onWalletDisconnected) {
      onWalletDisconnected();
    }
    setDropdownOpen(false); // Close dropdown after disconnection
  };

  // If we hit a connection error, show it
  if (connectionError) {
    toast({
      title: "Connection Error",
      description: connectionError,
      variant: "destructive"
    });
  }

  // If connected, show the wallet address and disconnect option
  if (walletAddress) {
    return (
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={`flex items-center gap-2 border border-purple-200 ${className}`}
          >
            <Plug className="h-4 w-4 text-green-500" />
            <span>{getShortAddress()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Wallet Connected</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-xs break-all p-2 bg-slate-50 text-slate-600"
            disabled
          >
            {walletAddress}
          </DropdownMenuItem>
          {chainId && (
            <DropdownMenuItem disabled className="text-xs text-slate-500">
              <Shield className="mr-2 h-4 w-4" />
              Chain ID: {chainId}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisconnect} className="text-red-500">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If we're connecting, show a loading button
  if (connecting) {
    return (
      <Button disabled className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        Connecting...
      </Button>
    );
  }

  // If not connected, show connect options
  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 ${className}`}
        >
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Choose Connection Method</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleConnectMetaMask}>
          <img 
            src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg" 
            alt="MetaMask" 
            className="h-4 w-4 mr-2" 
          />
          MetaMask
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleConnectWalletConnect}>
          <img 
            src="https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Icon/Blue%20(Default)/Icon.svg" 
            alt="WalletConnect" 
            className="h-4 w-4 mr-2" 
          />
          WalletConnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
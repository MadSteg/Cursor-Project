/**
 * ReceiptGallery.tsx - A component that shows the user's NFT receipts
 * 
 * This component provides a gallery view of the user's blockchain receipts,
 * allowing them to view, select, and interact with their receipt NFTs.
 */
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';
import NFTGallery from '@/components/nft/NFTGallery';
import { useWalletConnect } from '@/hooks/useWalletConnect';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function ReceiptGallery() {
  const { walletAddress, connectMetaMask, isConnected } = useWalletConnect();
  const [isLoading, setIsLoading] = useState(false);

  // Attempt to connect with mock wallet in development mode
  useEffect(() => {
    if (!isConnected && process.env.NODE_ENV === 'development') {
      const connectDevWallet = async () => {
        setIsLoading(true);
        try {
          await connectMetaMask();
        } catch (error) {
          console.error('Failed to connect development wallet:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      connectDevWallet();
    }
  }, [isConnected, connectMetaMask]);

  // Fetch NFTs from the gallery endpoint
  const { 
    data: nftData, 
    isLoading: nftsLoading, 
    error: nftsError 
  } = useQuery({
    queryKey: ['receipts', walletAddress],
    queryFn: async () => {
      if (!walletAddress) return { nfts: [] };
      
      const response = await apiRequest('GET', `/api/gallery/${walletAddress}`);
      return response.json();
    },
    enabled: !!walletAddress,
  });

  // Handle connection button click
  const handleConnectWallet = async () => {
    setIsLoading(true);
    try {
      await connectMetaMask();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!walletAddress) {
    return (
      <div className="p-6 border rounded-lg">
        <Alert className="mb-4">
          <AlertTitle>No wallet connected</AlertTitle>
          <AlertDescription>
            Please connect your wallet to view your receipt NFTs.
          </AlertDescription>
        </Alert>
        <Button 
          onClick={handleConnectWallet} 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            'Connect Wallet'
          )}
        </Button>
      </div>
    );
  }

  // Simply render the NFTGallery component with the wallet address
  return (
    <div className="receipt-gallery">
      <NFTGallery walletAddress={walletAddress} />
    </div>
  );
}
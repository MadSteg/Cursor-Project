import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Lock, Unlock, ShieldCheck, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';

interface NFTGalleryProps {
  walletAddress?: string;
  nfts?: NFT[];
}

interface NFT {
  tokenId: string;
  contractAddress?: string;
  name?: string;
  imageUrl: string;
  stampUri?: string; // Passport stamp URI
  isLocked: boolean;
  hasMetadata: boolean;
  preview?: any;
  createdAt?: string;
  ownerAddress: string;
}

export default function NFTGallery({ walletAddress, nfts }: NFTGalleryProps) {
  const { walletAddress: connectedAddress, isConnected } = useWallet();
  const [selectedNft, setSelectedNft] = useState<NFT | null>(null);
  const [decryptedData, setDecryptedData] = useState<any | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Use the passed wallet address or the connected wallet address
  const effectiveWalletAddress = walletAddress || connectedAddress;
  
  // Fetch NFTs for this wallet if not provided as prop
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['nfts', effectiveWalletAddress],
    queryFn: async () => {
      if (!effectiveWalletAddress) return { nfts: [] };
      
      const response = await apiRequest('GET', `/api/gallery/${effectiveWalletAddress}`);
      return response.json();
    },
    enabled: !!effectiveWalletAddress && !nfts, // Only fetch if nfts prop is not provided
  });
  
  // Mutation for unlocking encrypted metadata
  const unlockMutation = useMutation({
    mutationFn: async (tokenId: string) => {
      const response = await apiRequest('POST', `/api/gallery/unlock/${tokenId}`, {
        walletAddress: effectiveWalletAddress
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.metadata) {
        setDecryptedData(data.metadata);
        toast({
          title: 'Metadata Unlocked',
          description: 'The receipt details have been decrypted successfully.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Unlock Failed',
          description: data.message || 'Unable to unlock the metadata.',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Unlock Failed',
        description: error.message || 'An error occurred while unlocking the metadata.',
        variant: 'destructive',
      });
    }
  });
  
  // Handle NFT click - prompt for private metadata view
  const handleNftClick = (nft: NFT) => {
    if (nft.hasMetadata) {
      // If the NFT has private metadata, ask if the user wants to view it
      const viewPrivateData = window.confirm(
        "This BlockReceipt contains private merchant receipt metadata with potentially sensitive information. This data is protected with Threshold encryption (TACo PRE). Would you like to view this private data?"
      );
      
      if (!viewPrivateData) {
        // If user declines, show a toast message about respecting privacy
        toast({
          title: "Privacy Protected",
          description: "You chose not to view private merchant receipt data. Your privacy preference has been respected.",
        });
        
        // Navigate to the receipt detail without metadata focus
        navigate(`/nft-receipts/${nft.tokenId}`);
        return;
      }
      
      // If the data is locked and user wants to view it, unlock it first
      if (nft.isLocked) {
        handleUnlock(nft.tokenId);
      }
      
      // Navigate to the detail page with a query param to indicate metadata view
      navigate(`/nft-receipts/${nft.tokenId}?viewMetadata=true`);
    } else {
      // If no private metadata, just navigate to the detail page
      navigate(`/nft-receipts/${nft.tokenId}`);
    }
  };
  
  // Handle unlock button click
  const handleUnlock = (tokenId: string) => {
    unlockMutation.mutate(tokenId);
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-0">
                <Skeleton className="w-full h-40" />
              </CardHeader>
              <CardContent className="mt-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  // Render error state
  if (isError) {
    return (
      <div className="p-6 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Error Loading NFTs</h3>
        <p className="mt-2 text-sm text-red-700 dark:text-red-400">
          {error instanceof Error ? error.message : 'Failed to load NFT gallery.'}
        </p>
        {!isConnected && (
          <p className="mt-4 text-sm font-medium">Please connect your wallet to view your NFTs.</p>
        )}
      </div>
    );
  }
  
  // If no wallet is connected
  if (!effectiveWalletAddress) {
    return (
      <div className="p-6 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300">No Wallet Connected</h3>
        <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
          Please connect your wallet to view your NFT receipts.
        </p>
        <Button 
          className="mt-4"
          onClick={() => window.location.href = '/upload-receipt'}
        >
          Connect Wallet
        </Button>
      </div>
    );
  }
  
  // Use either provided nfts prop or data from the query
  const displayNfts = nfts || data?.nfts || [];
  
  // If there are no NFTs
  if (displayNfts.length === 0) {
    return (
      <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-center">
        <div className="mx-auto h-24 w-24 text-blue-500 mb-4">
          <img src="/nft-images/empty-receipt.svg" alt="No NFTs" className="w-full h-full" />
        </div>
        <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300">No NFT Receipts Found</h3>
        <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
          Upload receipts to get started with your NFT receipt collection.
        </p>
        <Button className="mt-4" variant="outline" onClick={() => window.location.href = '/upload-receipt'}>
          Upload Your First Receipt
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayNfts.map((nft: NFT) => (
          <Card 
            key={nft.tokenId} 
            className={`overflow-hidden transition-all cursor-pointer hover:shadow-lg ${selectedNft?.tokenId === nft.tokenId ? 'ring-2 ring-primary' : ''}`}
            onClick={() => handleNftClick(nft)}
          >
            <div className="relative">
              {/* Main receipt image */}
              <img 
                src={nft.imageUrl} 
                alt={nft.name || `NFT ${nft.tokenId}`} 
                className="w-full h-40 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/nft-images/default-receipt.svg';
                }}
              />
              
              {/* Passport stamp thumbnail if available */}
              {nft.stampUri && (
                <div className="absolute bottom-2 right-2 w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img 
                    src={nft.stampUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')} 
                    alt="Stamp" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/nft-images/default-stamp.svg';
                    }}
                  />
                </div>
              )}
              {nft.hasMetadata && (
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="flex items-center gap-1 bg-black/70 text-white">
                    {nft.isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    {nft.isLocked ? 'Encrypted' : 'Unlocked'}
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader className="py-3">
              <CardTitle className="text-lg">{nft.name || `BlockReceipt #${nft.tokenId.slice(0, 6)}`}</CardTitle>
              <CardDescription>
                {nft.preview?.merchantName || (nft.preview?.merchant) || 'Receipt NFT'}
              </CardDescription>
            </CardHeader>
            <CardContent className="py-0">
              <p className="text-sm">
                ${nft.preview?.total ? parseFloat(nft.preview.total).toFixed(2) : '0.00'}
              </p>
              <p className="text-xs text-muted-foreground">
                {nft.preview?.date ? new Date(nft.preview.date).toLocaleDateString() : 
                 nft.createdAt ? new Date(nft.createdAt).toLocaleDateString() : 'Unknown date'}
              </p>
            </CardContent>
            <CardFooter className="pt-3 pb-3">
              {nft.hasMetadata && nft.isLocked && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnlock(nft.tokenId);
                  }}
                  disabled={unlockMutation.isPending}
                >
                  {unlockMutation.isPending && selectedNft?.tokenId === nft.tokenId ? 
                    'Unlocking...' : 'Unlock Receipt Data'}
                </Button>
              )}
              {nft.hasMetadata && !nft.isLocked && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Already Unlocked
                </Button>
              )}
              {!nft.hasMetadata && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full" 
                  onClick={(e) => e.stopPropagation()}
                >
                  View Receipt
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Selected NFT Details */}
      {selectedNft && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Receipt Details</CardTitle>
            <CardDescription>
              {selectedNft.hasMetadata 
                ? 'This receipt has encrypted line items protected with TACo' 
                : 'Receipt information'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                {/* Display receipt image */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Receipt Image</h4>
                  <img 
                    src={selectedNft.imageUrl} 
                    alt={selectedNft.name || `NFT ${selectedNft.tokenId}`} 
                    className="w-full h-auto rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/nft-images/default-receipt.svg';
                    }}
                  />
                </div>
                
                {/* Display passport stamp if available */}
                {selectedNft.stampUri && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Passport Stamp</h4>
                    <img 
                      src={selectedNft.stampUri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')} 
                      alt="Receipt Passport Stamp" 
                      className="w-full h-auto rounded-md border border-muted"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/nft-images/default-stamp.svg';
                      }}
                    />
                  </div>
                )}
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Token ID:</span>
                    <span className="text-sm font-mono">{selectedNft.tokenId.substring(0, 10)}...</span>
                  </div>
                  {selectedNft.contractAddress && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Contract:</span>
                      <span className="text-sm font-mono">
                        {selectedNft.contractAddress.substring(0, 6)}...
                        {selectedNft.contractAddress.substring(selectedNft.contractAddress.length - 4)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold">{selectedNft.name || `BlockReceipt #${selectedNft.tokenId.slice(0, 6)}`}</h3>
                <p className="text-lg mt-2">{selectedNft.preview?.merchantName || selectedNft.preview?.merchant || 'Receipt'}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedNft.preview?.date 
                    ? new Date(selectedNft.preview.date).toLocaleDateString() 
                    : selectedNft.createdAt 
                      ? new Date(selectedNft.createdAt).toLocaleDateString() 
                      : 'Unknown date'}
                </p>
                <p className="text-xl font-bold mt-4">
                  ${selectedNft.preview?.total 
                    ? parseFloat(selectedNft.preview.total).toFixed(2) 
                    : '0.00'}
                </p>
                
                {decryptedData ? (
                  <div className="mt-6">
                    <h4 className="text-md font-medium mb-2">Decrypted Line Items</h4>
                    <div className="rounded-md border overflow-hidden">
                      <table className="min-w-full divide-y">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="py-2 px-4 text-left text-sm font-medium">Item</th>
                            <th className="py-2 px-4 text-right text-sm font-medium">Price</th>
                            <th className="py-2 px-4 text-left text-sm font-medium">Category</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {decryptedData.items?.map((item: any, index: number) => (
                            <tr key={index}>
                              <td className="py-2 px-4 text-sm">{item.name}</td>
                              <td className="py-2 px-4 text-sm text-right">${parseFloat(item.price).toFixed(2)}</td>
                              <td className="py-2 px-4 text-sm">{item.category}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-muted/50">
                          <tr>
                            <td className="py-2 px-4 text-sm font-medium">Total</td>
                            <td className="py-2 px-4 text-sm font-medium text-right">${decryptedData.total}</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ) : (
                  selectedNft.hasMetadata && selectedNft.isLocked && (
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                      <div className="flex gap-2 items-center">
                        <Lock className="h-5 w-5 text-yellow-500" />
                        <h4 className="text-md font-medium text-yellow-700 dark:text-yellow-400">Encrypted Line Items</h4>
                      </div>
                      <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-500">
                        This receipt's line items are encrypted with TACo threshold encryption.
                        Click the Unlock button to view the complete receipt details.
                      </p>
                      <Button 
                        className="mt-4 w-full sm:w-auto" 
                        onClick={() => handleUnlock(selectedNft.tokenId)}
                        disabled={unlockMutation.isPending}
                      >
                        {unlockMutation.isPending ? 'Unlocking...' : 'Unlock Receipt Data'}
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
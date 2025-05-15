import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useWeb3Wallet } from "@/hooks/useWeb3Wallet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { Lock, Unlock, ExternalLink } from "lucide-react";
import { UnlockMetadataButton } from "./UnlockMetadataButton";

interface NFTGalleryProps {
  walletAddress?: string;
}

interface NFTItem {
  id: number;
  tokenId: string;
  contractAddress: string;
  name: string;
  description: string;
  image: string;
  category: string;
  createdAt: string;
  owner: string;
  metadataLocked: boolean;
  lockStatus: 'locked' | 'unlocked';
  encryptionDetails?: {
    hasCapsule: boolean;
    policyId: string;
    capsuleId: string;
  } | null;
  total: string;
  items: Array<{
    name: string;
    price: string;
    quantity: number;
    category: string;
  }>;
}

export function NFTGallery({ walletAddress }: NFTGalleryProps) {
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { wallet, isConnected } = useWeb3Wallet();
  const { toast } = useToast();
  
  // Determine which wallet address to use
  const targetAddress = walletAddress || (isConnected ? wallet?.address : null);
  
  useEffect(() => {
    async function fetchNFTs() {
      if (!targetAddress) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/gallery/${targetAddress}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch NFTs');
        }
        
        if (data.success && data.nfts) {
          setNfts(data.nfts);
        } else {
          setNfts([]);
        }
      } catch (err) {
        console.error('Error fetching NFTs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load NFT gallery');
        toast({
          title: "Error loading NFTs",
          description: "Could not retrieve your NFT collection",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchNFTs();
  }, [targetAddress, toast]);
  
  const toggleExpand = (tokenId: string) => {
    setExpanded(expanded === tokenId ? null : tokenId);
  };
  
  const handleUnlockSuccess = (tokenId: string, unlockedData: any) => {
    // Update the NFT in the collection with the unlocked data
    setNfts(nfts.map(nft => {
      if (nft.tokenId === tokenId) {
        return {
          ...nft,
          metadataLocked: false,
          lockStatus: 'unlocked',
          items: unlockedData.metadata.items,
          total: unlockedData.metadata.total,
        };
      }
      return nft;
    }));
    
    toast({
      title: "Metadata Unlocked",
      description: "You now have access to the receipt details",
    });
  };
  
  const getExplorerLink = (contractAddress: string, tokenId: string) => {
    return `https://amoy.polygonscan.com/token/${contractAddress}?a=${tokenId}`;
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (!targetAddress) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
        <p className="mb-6 text-muted-foreground">
          Please connect your wallet to view your BlockReceipt NFT collection
        </p>
        <Button onClick={() => setLocation("/connect")} className="group">
          <span>Connect Wallet</span>
          <span className="ml-2 opacity-70 group-hover:translate-x-1 transition-transform">→</span>
        </Button>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading your NFT collection...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold mb-4 text-destructive">Error Loading NFTs</h2>
        <p className="mb-6">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }
  
  if (nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">No NFTs Found</h2>
        <p className="mb-6 text-muted-foreground">
          You don't have any BlockReceipt NFTs yet. Upload a receipt to get started.
        </p>
        <Button onClick={() => setLocation("/upload-receipt")} className="group">
          <span>Upload Receipt</span>
          <span className="ml-2 opacity-70 group-hover:translate-x-1 transition-transform">→</span>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Your BlockReceipt NFT Collection</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <Card key={nft.tokenId} className="overflow-hidden border-t-4 hover:shadow-lg transition-shadow" 
                style={{ borderTopColor: nft.metadataLocked ? '#ef4444' : '#22c55e' }}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{nft.name}</CardTitle>
                  <CardDescription>
                    {formatDate(nft.createdAt)}
                  </CardDescription>
                </div>
                <Badge variant={nft.metadataLocked ? "destructive" : "success"} className="flex items-center gap-1">
                  {nft.metadataLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                  {nft.lockStatus}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pb-0">
              <div className="aspect-square overflow-hidden rounded-md mb-4">
                <img 
                  src={nft.image.startsWith('http') ? nft.image : nft.image} 
                  alt={nft.name}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              </div>
              
              <div className="mb-2">
                <Badge variant="outline" className="mr-2 capitalize">{nft.category}</Badge>
                <Badge variant="secondary">Total: ${nft.total}</Badge>
              </div>
              
              {expanded === nft.tokenId && !nft.metadataLocked && nft.items && nft.items.length > 0 && (
                <div className="mt-4 border-t pt-3">
                  <h4 className="text-sm font-medium mb-2">Receipt Items:</h4>
                  <ScrollArea className="h-32">
                    <ul className="space-y-2">
                      {nft.items.map((item, idx) => (
                        <li key={idx} className="text-sm flex justify-between">
                          <span>{item.name}</span>
                          <span className="font-medium">${item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </div>
              )}
              
              {expanded === nft.tokenId && nft.metadataLocked && (
                <div className="mt-4 border-t pt-3">
                  <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
                    <Lock className="mb-2 text-muted-foreground" />
                    <p className="text-sm text-center mb-3">
                      This receipt's line items are encrypted with TACo privacy technology
                    </p>
                    <UnlockMetadataButton 
                      tokenId={nft.tokenId} 
                      walletAddress={targetAddress}
                      onUnlockSuccess={(data) => handleUnlockSuccess(nft.tokenId, data)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" size="sm" onClick={() => toggleExpand(nft.tokenId)}>
                {expanded === nft.tokenId ? 'Hide Details' : 'View Details'}
              </Button>
              
              <Button variant="ghost" size="sm" className="text-xs" asChild>
                <a 
                  href={getExplorerLink(nft.contractAddress, nft.tokenId)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <span className="mr-1">Explorer</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
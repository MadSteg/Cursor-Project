import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NFTMetadata } from '../../../shared/metadata/nft-collection';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface NFTCatalogProps {
  receiptData?: any;
  onSelectNFT?: (nft: NFTMetadata) => void;
  showMintButton?: boolean;
  defaultCategories?: string[];
}

const NFTCatalog: React.FC<NFTCatalogProps> = ({ 
  receiptData, 
  onSelectNFT, 
  showMintButton = true,
  defaultCategories = [] 
}) => {
  const [nfts, setNfts] = useState<NFTMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchNFTs();
  }, [receiptData, defaultCategories]);

  const fetchNFTs = async () => {
    setLoading(true);
    try {
      // Use the server endpoint to get NFTs based on receipt data
      let categories = defaultCategories;
      
      // If receipt data is provided, extract categories from items
      if (receiptData?.items) {
        const itemKeywords = receiptData.items.flatMap((item: any) => {
          const name = item.name || '';
          return name.toLowerCase().split(' ').filter((word: string) => word.length > 3);
        });
        
        categories = [...new Set([...defaultCategories, ...itemKeywords])];
      }
      
      // Determine tier from receipt data if available
      const tier = receiptData?.tier?.id || '';
      
      const response = await fetch('/api/nfts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categories,
          tier,
          receiptData
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setNfts(data.nfts);
      } else {
        // Use local data fallback
        const { NFT_COLLECTION } = await import('../../../shared/metadata/nft-collection');
        setNfts(NFT_COLLECTION);
      }
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      // Use local data fallback
      const { NFT_COLLECTION } = await import('../../../shared/metadata/nft-collection');
      setNfts(NFT_COLLECTION);
    } finally {
      setLoading(false);
    }
  };

  const handleMintNFT = async (nft: NFTMetadata) => {
    if (!receiptData) {
      toast({
        title: 'No Receipt Data',
        description: 'Please upload a receipt before minting an NFT.',
        variant: 'destructive',
      });
      return;
    }
    
    setMinting(nft.id);
    
    try {
      const response = await apiRequest('POST', '/api/select-nft', {
        selectedNft: nft,
        receiptData
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: 'NFT Minted Successfully',
          description: `Your "${nft.name}" has been minted to your wallet.`,
          variant: 'default',
        });
        
        if (onSelectNFT) {
          onSelectNFT(nft);
        }
      } else {
        throw new Error(result.message || 'Failed to mint NFT');
      }
    } catch (error: any) {
      console.error('Error minting NFT:', error);
      toast({
        title: 'Minting Failed',
        description: error.message || 'There was an error minting your NFT. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setMinting(null);
    }
  };

  const filteredNFTs = activeTab === 'all' 
    ? nfts 
    : nfts.filter(nft => nft.tier === activeTab.toUpperCase());

  const tierCount = {
    all: nfts.length,
    basic: nfts.filter(nft => nft.tier === 'BASIC').length,
    standard: nfts.filter(nft => nft.tier === 'STANDARD').length,
    premium: nfts.filter(nft => nft.tier === 'PREMIUM').length,
    luxury: nfts.filter(nft => nft.tier === 'LUXURY').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading NFT collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">
            All ({tierCount.all})
          </TabsTrigger>
          <TabsTrigger value="basic" disabled={tierCount.basic === 0}>
            Basic ({tierCount.basic})
          </TabsTrigger>
          <TabsTrigger value="standard" disabled={tierCount.standard === 0}>
            Standard ({tierCount.standard})
          </TabsTrigger>
          <TabsTrigger value="premium" disabled={tierCount.premium === 0}>
            Premium ({tierCount.premium})
          </TabsTrigger>
          <TabsTrigger value="luxury" disabled={tierCount.luxury === 0}>
            Luxury ({tierCount.luxury})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {filteredNFTs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-muted-foreground">No NFTs found in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredNFTs.map((nft) => (
                <Card key={nft.id} className="overflow-hidden flex flex-col">
                  <div className="relative aspect-square bg-black">
                    <img 
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-full object-contain p-2"
                    />
                    <Badge 
                      className="absolute top-2 right-2" 
                      variant={
                        nft.tier === 'BASIC' ? 'outline' :
                        nft.tier === 'STANDARD' ? 'default' :
                        nft.tier === 'PREMIUM' ? 'secondary' : 'destructive'
                      }
                    >
                      {nft.tier.charAt(0) + nft.tier.slice(1).toLowerCase()}
                    </Badge>
                  </div>
                  
                  <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-base truncate">{nft.name}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="p-3 pt-1 pb-0 flex-grow">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {nft.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {nft.categories.slice(0, 3).map((category, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  
                  {showMintButton && (
                    <CardFooter className="p-3">
                      <Button 
                        className="w-full" 
                        size="sm"
                        variant={
                          nft.tier === 'BASIC' ? 'outline' :
                          nft.tier === 'STANDARD' ? 'default' :
                          nft.tier === 'PREMIUM' ? 'secondary' : 'destructive'
                        }
                        onClick={() => handleMintNFT(nft)}
                        disabled={minting !== null}
                      >
                        {minting === nft.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Minting...
                          </>
                        ) : (
                          'Mint NFT'
                        )}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NFTCatalog;
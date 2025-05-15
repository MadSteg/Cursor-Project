import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import useWalletConnect from '@/hooks/useWalletConnect';

// Define the NFTMetadata interface locally
interface NFTMetadata {
  id: string;
  name: string;
  image: string;
  description: string;
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'LUXURY';
  categories: string[];
  attributes: {
    [key: string]: string | number;
  };
}

interface NFTCatalogProps {
  receiptData?: any;
  onSelectNFT?: (nft: NFTMetadata) => void;
  showMintButton?: boolean;
  defaultCategories?: string[];
}

// Fallback NFT data when API fails
const FALLBACK_NFTS: NFTMetadata[] = [
  {
    id: 'receipt-warrior',
    name: 'Receipt Warrior',
    image: '/nft-images/receipt-warrior.svg',
    description: 'A brave warrior ready to defend your purchase history with honor and pixels.',
    tier: 'PREMIUM',
    categories: ['entertainment', 'gaming', 'sports'],
    attributes: {
      rarity: 'Epic',
      power: 72,
      defense: 68,
      speed: 65
    }
  },
  {
    id: 'crypto-receipt',
    name: 'Crypto Receipt',
    image: '/nft-images/crypto-receipt.svg',
    description: 'Digital asset receipt secured with blockchain technology and pixel perfection.',
    tier: 'LUXURY',
    categories: ['tech', 'finance', 'cryptocurrency'],
    attributes: {
      rarity: 'Legendary',
      encryption: 92,
      decentralization: 88,
      volatility: 75
    }
  },
  {
    id: 'fashion-receipt',
    name: 'Fashion Couture Receipt',
    image: '/nft-images/fashion-receipt.svg',
    description: 'Stylish receipt that showcases your fashion-forward purchases with pixel elegance.',
    tier: 'PREMIUM',
    categories: ['fashion', 'clothing', 'accessories', 'retail'],
    attributes: {
      rarity: 'Rare',
      style: 85,
      trendiness: 79,
      exclusivity: 70
    }
  },
  {
    id: 'grocery-hero',
    name: 'Grocery Hero',
    image: '/nft-images/grocery-hero.svg',
    description: 'A super grocery receipt that saves the day by tracking all your essentials.',
    tier: 'STANDARD',
    categories: ['groceries', 'food', 'household'],
    attributes: {
      rarity: 'Uncommon',
      nutrition: 65,
      value: 60,
      sustainability: 70
    }
  },
  {
    id: 'restaurant-receipt',
    name: 'Dining Dazzler',
    image: '/nft-images/restaurant-receipt.svg',
    description: 'A culinary companion that preserves your gastronomic adventures in pixel perfection.',
    tier: 'PREMIUM',
    categories: ['restaurant', 'dining', 'food', 'entertainment'],
    attributes: {
      rarity: 'Rare',
      taste: 88,
      presentation: 90,
      atmosphere: 85
    }
  },
  {
    id: 'tech-receipt',
    name: 'Tech Titan Receipt',
    image: '/nft-images/tech-receipt.svg',
    description: 'The digital guardian of your tech purchases with circuit-board styling.',
    tier: 'LUXURY',
    categories: ['electronics', 'tech', 'gadgets', 'computers'],
    attributes: {
      rarity: 'Epic',
      processing: 95,
      innovation: 92,
      durability: 85
    }
  },
  {
    id: 'travel-receipt',
    name: 'Journey Journal',
    image: '/nft-images/travel-receipt.svg',
    description: 'Captures your travel expenses with adventurous pixel art styling.',
    tier: 'STANDARD',
    categories: ['travel', 'transportation', 'hotels', 'tourism'],
    attributes: {
      rarity: 'Uncommon',
      adventure: 80,
      discovery: 75,
      memory: 85
    }
  },
  {
    id: 'beauty-receipt',
    name: 'Beauty Buzz Receipt',
    image: '/nft-images/beauty-receipt.svg',
    description: 'Glamorous pixel art receipt for your beauty and personal care purchases.',
    tier: 'STANDARD',
    categories: ['beauty', 'cosmetics', 'personal care', 'salon'],
    attributes: {
      rarity: 'Uncommon',
      glamour: 78,
      style: 82,
      transformation: 75
    }
  }
];

const NFTCatalog: React.FC<NFTCatalogProps> = ({ 
  receiptData, 
  onSelectNFT, 
  showMintButton = true,
  defaultCategories = [] 
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [minting, setMinting] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Get wallet connection information
  const { walletAddress, isConnected, connectMetaMask } = useWalletConnect();

  // Use React Query for fetching NFTs
  const { data: nfts = FALLBACK_NFTS, isLoading } = useQuery({
    queryKey: ['nfts'],
    queryFn: async () => {
      try {
        const response = await apiRequest('POST', '/api/nfts', {
          categories: defaultCategories,
          tier: receiptData?.tier?.id || '',
          receiptData: receiptData || null
        });
        
        const data = await response.json();
        
        if (data.success) {
          return data.nfts;
        } else {
          console.warn('API returned error, using fallback data');
          return FALLBACK_NFTS;
        }
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        return FALLBACK_NFTS;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  // Mutation for minting an NFT
  const mintNFTMutation = useMutation({
    mutationFn: async (nft: NFTMetadata) => {
      if (!receiptData) {
        throw new Error('No receipt data provided');
      }
      
      // Include wallet address in the request for proper NFT minting
      const response = await apiRequest('POST', '/api/select-nft', {
        selectedNft: nft,
        receiptData,
        walletAddress: walletAddress || undefined
      });
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      if (data.success) {
        toast({
          title: 'NFT Minted Successfully',
          description: `Your "${variables.name}" has been minted to your wallet.`,
          variant: 'default',
        });
        
        if (onSelectNFT) {
          onSelectNFT(variables);
        }
      } else {
        throw new Error(data.message || 'Failed to mint NFT');
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Minting Failed',
        description: error.message || 'There was an error minting your NFT. Please try again.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setMinting(null);
    }
  });

  const handleMintNFT = async (nft: NFTMetadata) => {
    if (!receiptData) {
      toast({
        title: 'No Receipt Data',
        description: 'Please upload a receipt before minting an NFT.',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if wallet is connected
    if (!isConnected || !walletAddress) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first to mint this NFT.',
        variant: 'destructive',
      });
      
      // Try to connect MetaMask
      try {
        await connectMetaMask();
        // If connection succeeds, we'll try again in the next render
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        return;
      }
      return;
    }
    
    setMinting(nft.id);
    mintNFTMutation.mutate(nft);
  };

  const filteredNFTs = activeTab === 'all' 
    ? nfts 
    : nfts.filter(nft => nft.tier === activeTab.toUpperCase());

  // Count NFTs by tier
  const tierCount = {
    all: nfts.length,
    basic: nfts.filter(nft => nft.tier === 'BASIC').length,
    standard: nfts.filter(nft => nft.tier === 'STANDARD').length,
    premium: nfts.filter(nft => nft.tier === 'PREMIUM').length,
    luxury: nfts.filter(nft => nft.tier === 'LUXURY').length,
  };

  if (isLoading) {
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
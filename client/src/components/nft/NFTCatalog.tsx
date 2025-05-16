import React, { useState, useEffect } from 'react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Tag, ShoppingBag, Receipt, Gift, Coffee, Car, Home, Smartphone } from 'lucide-react';

// Sample NFT data for when API isn't available
const FALLBACK_NFTS = [
  {
    id: 'nft1',
    name: 'Receipt Guardian',
    description: 'A mystical guardian that protects your purchase history.',
    imageUrl: '/nft-images/receipt-guardian.svg',
    category: 'standard',
    tier: 'bronze',
    rarity: 'common',
  },
  {
    id: 'nft2',
    name: 'Digital Shopper',
    description: 'For the tech-savvy shopper who prefers digital receipts.',
    imageUrl: '/nft-images/digital-shopper.svg',
    category: 'electronics',
    tier: 'silver',
    rarity: 'uncommon',
  },
  {
    id: 'nft3',
    name: 'Luxury Receipt',
    description: 'For those special luxury purchases worth remembering.',
    imageUrl: '/nft-images/luxury-receipt.svg', 
    category: 'luxury',
    tier: 'gold',
    rarity: 'rare',
  },
  {
    id: 'nft4',
    name: 'Food Connoisseur',
    description: 'Celebrate your gourmet adventures with this foodie NFT.',
    imageUrl: '/nft-images/food-receipt.svg',
    category: 'food',
    tier: 'bronze',
    rarity: 'common',
  },
  {
    id: 'nft5',
    name: 'Travel Explorer',
    description: 'Commemorate your journeys and travel expenses.',
    imageUrl: '/nft-images/travel-receipt.svg',
    category: 'travel',
    tier: 'silver',
    rarity: 'uncommon',
  },
  {
    id: 'nft6',
    name: 'Purchase Proof',
    description: 'The ultimate verification for important purchases.',
    imageUrl: '/nft-images/purchase-proof.svg',
    category: 'standard',
    tier: 'platinum',
    rarity: 'legendary',
  },
  {
    id: 'nft7',
    name: 'Crypto Shopper',
    description: 'For the blockchain enthusiast who pays with crypto.',
    imageUrl: '/nft-images/crypto-shopper.svg',
    category: 'crypto',
    tier: 'gold',
    rarity: 'rare',
  }
];

interface NFTCatalogProps {
  receiptData?: any;
  onSelectNFT?: (nft: any) => void;
  showMintButton?: boolean;
  defaultCategories?: string[];
}

// Category icons mapping
const categoryIcons = {
  standard: <Receipt className="h-5 w-5" />,
  electronics: <Smartphone className="h-5 w-5" />,
  luxury: <Gift className="h-5 w-5" />,
  food: <Coffee className="h-5 w-5" />,
  travel: <Car className="h-5 w-5" />,
  crypto: <ShoppingBag className="h-5 w-5" />,
  home: <Home className="h-5 w-5" />,
};

// Helper function to get a random item from an array
const getRandomItem = (array: any[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

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
  const { walletAddress, isConnected, connectMetaMask } = useWallet();

  // Use React Query for fetching NFTs
  const { data: nfts = FALLBACK_NFTS, isLoading } = useQuery({
    queryKey: ['nfts'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/nfts', {
          categories: defaultCategories,
          tier: receiptData?.tier || '',
          receiptData: receiptData || null
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch NFTs');
        }
        
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

  // Mutation for minting NFTs
  const mintMutation = useMutation({
    mutationFn: async (nftId: string) => {
      if (!walletAddress) {
        throw new Error('No wallet connected');
      }
      
      const mintData = {
        nftId,
        walletAddress,
        receiptData: receiptData || { 
          merchantName: 'Test Merchant',
          date: new Date().toISOString().split('T')[0],
          total: 49.99,
          category: 'Test Purchase'
        }
      };
      
      const response = await apiRequest('POST', '/api/mint-test-nft', mintData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mint NFT');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'NFT Minted Successfully',
        description: `Your NFT ${data.name || 'receipt'} has been minted and added to your wallet.`,
        variant: 'default',
      });
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['nfts'] });
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      
      setMinting(null);
    },
    onError: (error: Error) => {
      toast({
        title: 'Minting Failed',
        description: error.message || 'Failed to mint NFT. Please try again.',
        variant: 'destructive',
      });
      
      setMinting(null);
    }
  });

  // Handle NFT selection
  const handleSelectNFT = (nft: any) => {
    if (onSelectNFT) {
      onSelectNFT(nft);
    }
  };

  // Handle NFT minting
  const handleMintNFT = async (nft: any) => {
    if (!isConnected) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your wallet to mint this NFT.',
        variant: 'default',
      });
      
      try {
        await connectMetaMask();
      } catch (error) {
        toast({
          title: 'Connection Failed',
          description: 'Failed to connect wallet. Please try again.',
          variant: 'destructive',
        });
        return;
      }
    }
    
    setMinting(nft.id);
    mintMutation.mutate(nft.id);
  };

  // Get categories from NFTs
  const categories = React.useMemo(() => {
    const categorySet = new Set(['all']);
    nfts.forEach(nft => {
      if (nft.category) {
        categorySet.add(nft.category);
      }
    });
    return Array.from(categorySet);
  }, [nfts]);

  // Filter NFTs by active category
  const filteredNFTs = React.useMemo(() => {
    if (activeTab === 'all') return nfts;
    return nfts.filter(nft => nft.category === activeTab);
  }, [nfts, activeTab]);

  // If still loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading NFTs...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Category tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="w-full max-w-xl mx-auto mb-4 overflow-x-auto flex justify-start md:justify-center p-1">
          {categories.map((category, idx) => (
            <TabsTrigger key={category} value={category} className="min-w-[100px] flex items-center">
              {category === 'all' ? (
                <Tag className="mr-2 h-4 w-4" />
              ) : (
                categoryIcons[category] || <ShoppingBag className="mr-2 h-4 w-4" />
              )}
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNFTs.map((nft) => (
            <Card 
              key={nft.id} 
              className="overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative h-48">
                <img 
                  src={nft.imageUrl || '/nft-images/default-nft.svg'} 
                  alt={nft.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/nft-images/default-nft.svg';
                  }}
                />
                {nft.tier && (
                  <Badge 
                    className={`absolute top-3 right-3 ${
                      nft.tier === 'platinum' ? 'bg-gradient-to-r from-blue-400 to-purple-500' :
                      nft.tier === 'gold' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                      nft.tier === 'silver' ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                      'bg-gradient-to-r from-amber-600 to-amber-800'
                    }`}
                  >
                    {nft.tier.charAt(0).toUpperCase() + nft.tier.slice(1)} Tier
                  </Badge>
                )}
              </div>
              
              <CardHeader>
                <CardTitle>{nft.name}</CardTitle>
                <div className="flex justify-between items-center">
                  <CardDescription>{nft.rarity}</CardDescription>
                  {nft.category && (
                    <Badge variant="outline" className="text-xs">
                      {nft.category}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {nft.description}
                </p>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                {showMintButton && (
                  <Button
                    onClick={() => handleMintNFT(nft)}
                    disabled={minting === nft.id}
                    className="w-full"
                  >
                    {minting === nft.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Minting...
                      </>
                    ) : (
                      'Mint as Test NFT'
                    )}
                  </Button>
                )}
                
                {onSelectNFT && (
                  <Button
                    variant="outline"
                    onClick={() => handleSelectNFT(nft)}
                    className="w-full"
                  >
                    Select
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default NFTCatalog;
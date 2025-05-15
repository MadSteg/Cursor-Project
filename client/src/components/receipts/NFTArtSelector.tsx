import { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardFooter, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { Info, Check, Crown, Sparkles, Gift, Gamepad2, Music2, Palette, Shapes, Diamond } from 'lucide-react';
import { NFTArtItem, ReceiptTier } from "@/types";
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

interface NFTArtSelectorProps {
  receiptTier: ReceiptTier;
  onSelectNFT: (nft: NFTArtItem) => void;
  selectedNFTId?: string;
  receiptData?: any;
}

// Helper function to get rarity color
const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'bg-slate-100 text-slate-800';
    case 'uncommon':
      return 'bg-green-100 text-green-800';
    case 'rare':
      return 'bg-blue-100 text-blue-800';
    case 'epic':
      return 'bg-purple-100 text-purple-800';
    case 'legendary':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-slate-100 text-slate-800';
  }
};

// Helper function to get type icon
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'game':
      return <Gamepad2 className="w-3.5 h-3.5" />;
    case 'music':
      return <Music2 className="w-3.5 h-3.5" />;
    case 'art':
      return <Palette className="w-3.5 h-3.5" />;
    case 'collectible':
      return <Gift className="w-3.5 h-3.5" />;
    case 'sports':
      return <Shapes className="w-3.5 h-3.5" />;
    case 'utility':
      return <Diamond className="w-3.5 h-3.5" />;
    default:
      return <Info className="w-3.5 h-3.5" />;
  }
};

// Helper function to get tier badge and style
const getTierBadge = (tier: ReceiptTier) => {
  switch (tier) {
    case 'STANDARD':
      return (
        <Badge variant="outline" className="gap-1 font-normal px-2">
          Standard
        </Badge>
      );
    case 'PREMIUM':
      return (
        <Badge variant="outline" className="gap-1 font-normal text-blue-600 border-blue-200 bg-blue-50 px-2">
          <Crown className="w-3 h-3" /> Premium
        </Badge>
      );
    case 'LUXURY':
      return (
        <Badge variant="outline" className="gap-1 font-normal text-purple-600 border-purple-200 bg-purple-50 px-2">
          <Crown className="w-3 h-3" /> Luxury
        </Badge>
      );
    case 'ULTRA':
      return (
        <Badge variant="outline" className="gap-1 font-normal text-amber-600 border-amber-200 bg-amber-50 px-2">
          <Sparkles className="w-3 h-3" /> Ultra
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="gap-1 font-normal px-2">
          Standard
        </Badge>
      );
  }
};

const NFTArtSelector = ({ receiptTier, onSelectNFT, selectedNFTId, receiptData }: NFTArtSelectorProps) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Fetch NFT options from API based on tier
  const { data: nftData, isLoading, error } = useQuery({
    queryKey: ['nft-options', receiptTier],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', `/api/nfts/pool?tier=${receiptTier.toLowerCase()}&count=9`);
        const data = await response.json();
        
        if (data.success) {
          return data.nfts.map((nft: any) => ({
            id: nft.id,
            name: nft.name,
            description: nft.description,
            imageUrl: nft.image || `https://placehold.co/400x400/png?text=${encodeURIComponent(nft.name)}`,
            collection: nft.category || 'BlockReceipt',
            tier: nft.tier.toUpperCase(),
            rarity: nft.rarity || 'common',
            type: nft.category || 'collectible',
            price: 0
          }));
        }
        throw new Error('Failed to fetch NFT options');
      } catch (error) {
        console.error('Error fetching NFT options:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
  
  // Effect to automatically select the first NFT when data is loaded
  useEffect(() => {
    if (nftData && nftData.length > 0 && !selectedNFTId) {
      onSelectNFT(nftData[0]);
    }
  }, [nftData, onSelectNFT, selectedNFTId]);
  
  // Filter NFTs by type based on active tab
  const filteredNFTs = activeTab === 'all' 
    ? nftData || [] 
    : nftData?.filter(nft => nft.type.toLowerCase() === activeTab.toLowerCase()) || [];

  // Define collection types for tabs - dynamically determine from available data
  const collectionTypes = nftData 
    ? Array.from(new Set(nftData.map(nft => nft.type.toLowerCase())))
    : ['game', 'utility', 'music', 'art', 'collectible', 'sports'];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading NFT options...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8 space-y-4">
        <p className="text-sm text-red-500">Failed to load NFT options. Please try again.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Select NFT Art</h3>
          <p className="text-sm text-muted-foreground">
            Choose from {nftData?.length || 0} options for your {receiptTier.toLowerCase()} receipt
          </p>
        </div>
        {getTierBadge(receiptTier)}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          {collectionTypes.map(type => (
            <TabsTrigger value={type} key={type} className="flex items-center gap-1">
              {getTypeIcon(type)}
              <span className="capitalize">{type}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          {filteredNFTs.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No NFT options available for this filter and tier.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredNFTs.map((nft) => (
                <TooltipProvider key={nft.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Card 
                        className={`overflow-hidden transition-all cursor-pointer hover:shadow-md ${
                          selectedNFTId === nft.id 
                            ? 'ring-2 ring-primary ring-offset-2' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => onSelectNFT(nft)}
                      >
                        <div className="aspect-square relative overflow-hidden bg-muted">
                          <img 
                            src={nft.imageUrl} 
                            alt={nft.name} 
                            className="object-cover w-full h-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/png?text=NFT';
                            }}
                          />
                          {selectedNFTId === nft.id && (
                            <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                            <div className="flex items-center justify-between gap-2">
                              <Badge 
                                variant="outline" 
                                className={`${getRarityColor(nft.rarity)} capitalize border-none text-xs font-medium`}
                              >
                                {nft.rarity}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className="bg-black/30 text-white border-none text-xs font-medium gap-1"
                              >
                                {getTypeIcon(nft.type)}
                                <span className="capitalize">{nft.type}</span>
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <CardHeader className="p-3 pb-1">
                          <CardTitle className="text-base">{nft.name}</CardTitle>
                          <CardDescription className="text-xs">Collection: {nft.collection}</CardDescription>
                        </CardHeader>
                        <CardFooter className="p-3 pt-0">
                          <div className="w-full">
                            <Separator className="my-2" />
                            <div className="text-xs text-muted-foreground truncate">
                              {nft.collection}
                            </div>
                          </div>
                        </CardFooter>
                      </Card>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-sm">
                      <div className="space-y-2">
                        <div className="font-medium">{nft.name}</div>
                        <p className="text-sm">{nft.description}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NFTArtSelector;
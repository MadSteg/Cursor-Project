import { useState, useEffect } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Info, Check, Crown, Sparkles, Gift, Gamepad2, Music2, Palette, Shapes, Diamond } from 'lucide-react';
import { collections } from "@/data/nftArtManifest";
import { NFTArtItem, ReceiptTier } from "@/types";

interface NFTArtSelectorProps {
  receiptTier: ReceiptTier;
  onSelectNFT: (nft: NFTArtItem) => void;
  selectedNFTId?: string;
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

const NFTArtSelector = ({ receiptTier, onSelectNFT, selectedNFTId }: NFTArtSelectorProps) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [availableNFTs, setAvailableNFTs] = useState<NFTArtItem[]>([]);
  
  // Local implementation of getNFTArtItemsByTier
  const getNFTArtItems = (tier: ReceiptTier): NFTArtItem[] => {
    // Mock data for NFT items - in a real app this would come from an API or database
    const mockNFTs: NFTArtItem[] = [
      {
        id: "nft-1",
        name: "Receipt Collector",
        description: "A beautiful NFT for your receipt collection",
        imageUrl: "https://placehold.co/400x400/png",
        collection: "block-receipt",
        tier: "STANDARD",
        rarity: "common",
        type: "collectible",
        price: 0
      },
      {
        id: "nft-2",
        name: "Premium Purchase",
        description: "A premium NFT for your valuable receipt",
        imageUrl: "https://placehold.co/400x400/png",
        collection: "block-receipt", 
        tier: "PREMIUM",
        rarity: "uncommon",
        type: "art",
        price: 0
      },
      {
        id: "nft-3",
        name: "Luxury Memento",
        description: "A luxury NFT for your high-value purchase",
        imageUrl: "https://placehold.co/400x400/png",
        collection: "luxury-brands",
        tier: "LUXURY",
        rarity: "rare",
        type: "utility",
        price: 0
      },
      {
        id: "nft-4",
        name: "Ultra Keepsake",
        description: "An ultra-rare NFT for your exceptional purchase",
        imageUrl: "https://placehold.co/400x400/png",
        collection: "luxury-brands",
        tier: "ULTRA",
        rarity: "epic",
        type: "game",
        price: 0
      }
    ];

    // Filter NFTs by tier
    return mockNFTs.filter(nft => nft.tier === tier);
  };

  // Load available NFTs for the current receipt tier
  useEffect(() => {
    const nfts = getNFTArtItems(receiptTier);
    setAvailableNFTs(nfts);
    
    // If there are NFTs and none is selected yet, select the first one
    if (nfts.length > 0 && !selectedNFTId) {
      onSelectNFT(nfts[0]);
    }
  }, [receiptTier, onSelectNFT, selectedNFTId]);
  
  // Filter NFTs by type based on active tab
  const filteredNFTs = activeTab === 'all' 
    ? availableNFTs 
    : availableNFTs.filter(nft => nft.type === activeTab);
  
  // Define collection types for tabs
  const collectionTypes = ['game', 'utility', 'music', 'art', 'collectible', 'sports'];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Select NFT Art</h3>
          <p className="text-sm text-muted-foreground">
            Choose from {availableNFTs.length} options for your {receiptTier.toLowerCase()} receipt
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
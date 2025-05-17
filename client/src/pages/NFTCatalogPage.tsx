import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import NFTCatalog from '@/components/nft/NFTCatalog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Book, Sparkles, Shield, Trophy, Star, LucideIcon } from 'lucide-react';

// Generate pixelated NFT collection data
const generateNFTCollection = () => {
  const categories = ['Food', 'Electronics', 'Fashion', 'Travel', 'Home', 'Entertainment', 'Luxury'];
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  const colorSchemes = [
    'from-blue-500 to-purple-500',
    'from-green-500 to-emerald-500',
    'from-amber-500 to-yellow-500',
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-500',
    'from-indigo-500 to-blue-500',
    'from-red-500 to-orange-500',
    'from-purple-500 to-pink-500',
    'from-emerald-500 to-teal-500',
    'from-teal-500 to-cyan-500',
  ];
  
  // Generate 100 NFTs as requested
  const collection = Array.from({ length: 100 }, (_, index) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    const colorScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    const owned = Math.random() > 0.7; // 30% chance to own the NFT
    
    return {
      id: `nft-${index + 1}`,
      name: `BlockReceipt #${index + 1}`,
      category,
      rarity,
      colorScheme,
      owned,
      animation: Math.random() > 0.5 ? 'float' : 'pulse',
    };
  });
  
  return collection;
};

// Create a collection of pixel art NFTs
const nftCollection = generateNFTCollection();

// Group NFTs by category
const groupByCategory = (collection) => {
  const grouped = {};
  collection.forEach(nft => {
    if (!grouped[nft.category]) {
      grouped[nft.category] = [];
    }
    grouped[nft.category].push(nft);
  });
  return grouped;
};

const categorizedNFTs = groupByCategory(nftCollection);

// Pixel Art NFT Component
const PixelNFT = ({ nft }) => (
  <div className={`relative group ${nft.owned ? '' : 'grayscale opacity-60'}`}>
    {/* Pixelated NFT artwork */}
    <div 
      className={`
        w-20 h-20 rounded-lg overflow-hidden border-2 
        ${nft.owned ? 'border-amber-500 shadow-md shadow-amber-200' : 'border-gray-400'}
        transition-all transform hover:scale-105 cursor-pointer
        bg-gradient-to-br ${nft.colorScheme}
      `}
    >
      {/* Generate a pixel art pattern */}
      <div className="w-full h-full grid grid-cols-5 grid-rows-5">
        {Array.from({ length: 25 }).map((_, i) => (
          <div 
            key={i} 
            className={`
              ${Math.random() > 0.7 ? 'bg-white/20' : 'bg-transparent'}
              ${nft.animation === 'pulse' ? 'animate-pulse' : ''}
            `}
            style={{
              animationDelay: `${Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>
      
      {/* NFT number badge */}
      <div className="absolute bottom-1 right-1 text-[8px] font-mono bg-black/50 text-white px-1 rounded">
        #{nft.id.split('-')[1]}
      </div>
    </div>
    
    {/* Owned indicator */}
    {nft.owned && (
      <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
        <div className="w-3 h-3 text-white flex items-center justify-center">
          ✓
        </div>
      </div>
    )}
    
    {/* Rarity indicator on hover */}
    <div className="absolute -bottom-7 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-center">
      <span className={`
        text-xs font-semibold px-2 py-0.5 rounded-full
        ${nft.rarity === 'Common' ? 'bg-gray-200 text-gray-700' : 
          nft.rarity === 'Uncommon' ? 'bg-green-200 text-green-800' :
          nft.rarity === 'Rare' ? 'bg-blue-200 text-blue-800' :
          nft.rarity === 'Epic' ? 'bg-purple-200 text-purple-800' :
          'bg-amber-200 text-amber-800'}
      `}>
        {nft.rarity}
      </span>
    </div>
  </div>
);

const NFTCatalogPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // Calculate collection stats
  const totalNFTs = nftCollection.length;
  const ownedNFTs = nftCollection.filter(nft => nft.owned).length;
  const completionPercentage = Math.round((ownedNFTs / totalNFTs) * 100);
  
  return (
    <div className="container mx-auto py-10 px-4">
      <Helmet>
        <title>NFT Collection | BlockReceipt.ai</title>
        <meta
          name="description"
          content="Explore our collection of receipt-themed NFTs. Each BlockReceipt NFT is a unique pixel art collectible that represents your shopping history."
        />
      </Helmet>
      
      {/* Collection book header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center">
              <Book className="h-8 w-8 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                BlockReceipt NFT Collection
                <span className="inline-block ml-2 align-middle">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </span>
              </h1>
              <p className="text-slate-300 text-sm">
                Your digital receipt collection with unique pixel art NFTs
              </p>
            </div>
          </div>
          
          <div className="bg-slate-800 p-3 rounded-lg border border-slate-700 min-w-[200px]">
            <div className="flex justify-between text-sm text-slate-300 mb-1">
              <span>Collection progress</span>
              <span>{ownedNFTs}/{totalNFTs}</span>
            </div>
            <Progress value={completionPercentage} className="h-2 mb-2" />
            <div className="flex justify-between text-xs text-slate-400">
              <span className="flex items-center">
                <Trophy className="h-3 w-3 mr-1 text-amber-500" />
                <span>Level {Math.floor(ownedNFTs / 10) + 1}</span>
              </span>
              <span>
                {completionPercentage}% complete
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="flex w-full overflow-x-auto justify-start md:justify-center p-1 mb-6">
          <TabsTrigger value="all">All NFTs</TabsTrigger>
          {Object.keys(categorizedNFTs).map(category => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-inner">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-slate-700 dark:text-slate-300" />
              <span>Collector's Album</span>
              <Badge variant="outline" className="ml-3 bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30">
                {ownedNFTs} owned
              </Badge>
            </h2>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-6 mb-6">
              {nftCollection.map(nft => (
                <PixelNFT key={nft.id} nft={nft} />
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                <Star className="h-4 w-4 mr-2" /> Mint New BlockReceipt
              </Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Category content tabs */}
        {Object.entries(categorizedNFTs).map(([category, nfts]) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="bg-gradient-to-br from-slate-100 to-white dark:from-slate-900 dark:to-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-inner">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-slate-700 dark:text-slate-300" />
                <span>{category} Collection</span>
                <Badge variant="outline" className="ml-3 bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30">
                  {nfts.filter(nft => nft.owned).length} owned
                </Badge>
              </h2>
              
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-6 mb-6">
                {nfts.map(nft => (
                  <PixelNFT key={nft.id} nft={nft} />
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Legacy NFT Catalog display */}
      <div className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-6">BlockReceipt NFT Templates</h2>
        <p className="text-muted-foreground max-w-2xl mb-8">
          These are the base NFT designs that can be minted when you create a BlockReceipt from your purchases.
          Each receipt generates a unique variation based on merchant, price, and category.
        </p>
        <NFTCatalog showMintButton={true} />
      </div>
    </div>
  );
}

export default NFTCatalogPage;
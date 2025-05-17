import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import NFTCatalog from '@/components/nft/NFTCatalog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Book, Sparkles, Shield, Trophy, Star, LucideIcon } from 'lucide-react';

// Generate pixelated city-themed NFT collection data
const generateNFTCollection = () => {
  // World cities grouped by region
  const cities = {
    'Asia': [
      'Tokyo', 'Shanghai', 'Hong Kong', 'Seoul', 'Bangkok', 
      'Singapore', 'Mumbai', 'Delhi', 'Kyoto', 'Jakarta', 
      'Beijing', 'Manila', 'Kuala Lumpur', 'Taipei', 'Dubai'
    ],
    'Europe': [
      'London', 'Paris', 'Rome', 'Barcelona', 'Amsterdam',
      'Venice', 'Prague', 'Vienna', 'Athens', 'Berlin', 
      'Madrid', 'Lisbon', 'Budapest', 'Istanbul', 'Copenhagen'
    ],
    'Americas': [
      'New York', 'San Francisco', 'Toronto', 'Chicago', 'Los Angeles', 
      'Mexico City', 'Rio de Janeiro', 'Buenos Aires', 'Vancouver', 'Miami',
      'Seattle', 'Montreal', 'São Paulo', 'Austin', 'Boston'
    ],
    'Africa': [
      'Cairo', 'Cape Town', 'Marrakech', 'Nairobi', 'Casablanca',
      'Lagos', 'Johannesburg', 'Accra', 'Zanzibar', 'Tunis'
    ],
    'Oceania': [
      'Sydney', 'Melbourne', 'Auckland', 'Wellington', 'Brisbane',
      'Perth', 'Queenstown', 'Gold Coast', 'Adelaide', 'Christchurch'
    ]
  };
  
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  
  // City-themed color schemes that reflect urban environments
  const colorSchemes = {
    'dawn': 'from-orange-400 to-pink-500', // Dawn city skyline
    'sunset': 'from-amber-500 to-red-600', // Sunset over skyscrapers
    'night': 'from-indigo-800 to-purple-900', // Night city with lights
    'dusk': 'from-blue-800 to-indigo-900', // Dusk with city lights beginning to shine
    'morning': 'from-blue-400 to-indigo-500', // Morning light on buildings
    'rainy': 'from-slate-400 to-slate-600', // Rainy urban scene
    'foggy': 'from-slate-300 to-slate-500', // Foggy cityscape
    'golden': 'from-amber-300 to-amber-500', // Golden hour city view
    'neon': 'from-pink-500 to-purple-600', // Neon lights district
    'cyberpunk': 'from-cyan-500 to-blue-700', // Futuristic cyberpunk city
  };
  
  // Building styles for pixel art representation
  const buildingStyles = ['Modern', 'Historical', 'Futuristic', 'Industrial', 'Cultural'];
  
  // Famous landmarks or features to include in the pixel art
  const landmarks = [
    'Tower', 'Bridge', 'Cathedral', 'Skyscraper', 'Market', 
    'Harbor', 'Park', 'Station', 'Museum', 'Stadium',
    'Palace', 'Temple', 'Castle', 'Square', 'Monument'
  ];
  
  // Flatten categories and cities into arrays
  const allCategories = Object.keys(cities);
  const allCities = Object.values(cities).flat();
  
  // Generate 100 city-themed NFTs
  const collection = Array.from({ length: 100 }, (_, index) => {
    const category = allCategories[Math.floor(Math.random() * allCategories.length)];
    const availableCities = cities[category];
    const city = availableCities[Math.floor(Math.random() * availableCities.length)];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    
    const timeOfDay = Object.keys(colorSchemes)[Math.floor(Math.random() * Object.keys(colorSchemes).length)];
    const colorScheme = colorSchemes[timeOfDay];
    
    const buildingStyle = buildingStyles[Math.floor(Math.random() * buildingStyles.length)];
    const cityLandmark = landmarks[Math.floor(Math.random() * landmarks.length)];
    
    const owned = Math.random() > 0.7; // 30% chance to own the NFT
    
    return {
      id: `nft-${index + 1}`,
      name: `${city} #${index + 1}`,
      description: `${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} in ${city} featuring ${buildingStyle} ${cityLandmark}`,
      category,
      city,
      rarity,
      colorScheme,
      timeOfDay,
      buildingStyle,
      landmark: cityLandmark,
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

// Pixel Art city NFT Component
const PixelNFT = ({ nft }) => {
  // Use nft properties to create a unique pixel art city
  const generateCityGrid = () => {
    const grid = [];
    const rows = 8;
    const cols = 8;
    
    // Create a skyline profile based on nft properties
    const skylineProfile = [];
    for (let col = 0; col < cols; col++) {
      // Generate a height for each column (building) in the skyline
      // Use the nft id to create deterministic but unique skylines
      const nftNum = parseInt(nft.id.split('-')[1]);
      const baseHeight = Math.max(2, Math.floor((nftNum % 7) * Math.sin(col) + 2));
      
      // Adjust height based on city name length and buildingStyle
      const heightMod = (nft.city.length % 5) + 
                     (nft.buildingStyle === 'Modern' ? 1 : 
                      nft.buildingStyle === 'Historical' ? 0 :
                      nft.buildingStyle === 'Futuristic' ? 2 : 0);
                      
      skylineProfile.push(baseHeight + heightMod);
    }
    
    // Generate grid with sky and buildings
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // For each cell, determine if it's a building or sky
        const isSky = row < rows - skylineProfile[col];
        
        // Landmark feature (like a tower, appearing in some locations)
        const hasLandmark = nft.landmark === 'Tower' && col === Math.floor(cols / 2) && row >= 1;
        
        // Generate specialized buildings based on styles
        const isModernBuilding = !isSky && nft.buildingStyle === 'Modern' && (col % 3 === 0);
        const isHistoricalBuilding = !isSky && nft.buildingStyle === 'Historical' && (col % 2 === 1);
        const isFuturisticBuilding = !isSky && nft.buildingStyle === 'Futuristic' && (row === rows - 2);
        
        // Add windows to buildings with different patterns based on time of day
        const hasWindow = !isSky && 
                        ((nft.timeOfDay === 'night' && Math.random() > 0.4) || 
                         (nft.timeOfDay !== 'night' && Math.random() > 0.7));
        
        // Add city-specific decorations
        const hasPalm = !isSky && row === rows - 1 && 
                     (nft.city === 'Miami' || nft.city === 'Dubai' || nft.city === 'Los Angeles');
                     
        const hasSnow = !isSky && row === rows - 1 && 
                     (nft.city === 'Moscow' || nft.city === 'Toronto' || nft.city === 'Oslo');
                     
        // Push the cell with its properties
        grid.push({
          row,
          col,
          isSky,
          hasLandmark,
          isModernBuilding,
          isHistoricalBuilding,
          isFuturisticBuilding,
          hasWindow,
          hasPalm,
          hasSnow
        });
      }
    }
    
    return grid;
  };
  
  // Get colors based on time of day
  const getSkyColor = (timeOfDay) => {
    switch(timeOfDay) {
      case 'dawn': return 'bg-orange-300';
      case 'morning': return 'bg-blue-300';
      case 'sunset': return 'bg-amber-300';
      case 'dusk': return 'bg-indigo-400';
      case 'night': return 'bg-indigo-900';
      case 'rainy': return 'bg-slate-400';
      case 'foggy': return 'bg-slate-300';
      case 'golden': return 'bg-amber-200';
      case 'neon': return 'bg-purple-900';
      case 'cyberpunk': return 'bg-blue-900';
      default: return 'bg-blue-300';
    }
  };
  
  const getBuildingColor = (timeOfDay, isSpecial = false) => {
    switch(timeOfDay) {
      case 'dawn': return isSpecial ? 'bg-pink-400' : 'bg-pink-700';
      case 'morning': return isSpecial ? 'bg-blue-600' : 'bg-blue-800';
      case 'sunset': return isSpecial ? 'bg-orange-500' : 'bg-orange-800';
      case 'dusk': return isSpecial ? 'bg-indigo-600' : 'bg-indigo-900';
      case 'night': return isSpecial ? 'bg-slate-700' : 'bg-slate-900';
      case 'rainy': return isSpecial ? 'bg-slate-600' : 'bg-slate-800';
      case 'foggy': return isSpecial ? 'bg-slate-500' : 'bg-slate-700';
      case 'golden': return isSpecial ? 'bg-amber-500' : 'bg-amber-700';
      case 'neon': return isSpecial ? 'bg-pink-600' : 'bg-purple-800';
      case 'cyberpunk': return isSpecial ? 'bg-cyan-600' : 'bg-blue-800';
      default: return isSpecial ? 'bg-gray-600' : 'bg-gray-800';
    }
  };
  
  const getWindowColor = (timeOfDay) => {
    switch(timeOfDay) {
      case 'night':
      case 'dusk':
      case 'neon':
      case 'cyberpunk': return 'bg-yellow-300';
      default: return 'bg-white/50';
    }
  };
  
  // Generate city grid
  const cityGrid = generateCityGrid();
  
  return (
    <div className={`relative group ${nft.owned ? '' : 'grayscale opacity-60'}`}>
      {/* Pixelated city NFT artwork */}
      <div 
        className={`
          w-20 h-20 rounded-lg overflow-hidden border-2 
          ${nft.owned ? 'border-amber-500 shadow-md shadow-amber-200' : 'border-gray-400'}
          transition-all transform hover:scale-105 cursor-pointer
        `}
      >
        {/* Generate a pixel art cityscape */}
        <div className={`w-full h-full grid grid-cols-8 grid-rows-8 ${getSkyColor(nft.timeOfDay)}`}>
          {cityGrid.map((cell, i) => (
            <div 
              key={i} 
              className={`
                ${cell.isSky ? 'transparent' : 
                 cell.hasLandmark ? getBuildingColor(nft.timeOfDay, true) :
                 cell.isModernBuilding ? 'bg-gray-800' :
                 cell.isHistoricalBuilding ? 'bg-amber-900' :
                 cell.isFuturisticBuilding ? 'bg-cyan-800' :
                 getBuildingColor(nft.timeOfDay)}
                ${cell.hasWindow ? 'relative' : ''}
                ${nft.animation === 'pulse' && cell.hasWindow ? 'animate-pulse' : ''}
              `}
              style={{
                animationDelay: cell.hasWindow ? `${(i % 5) * 0.5}s` : '',
              }}
            >
              {cell.hasWindow && (
                <div className={`absolute inset-[25%] ${getWindowColor(nft.timeOfDay)}`}></div>
              )}
              {cell.hasPalm && (
                <div className="absolute top-[-50%] left-[25%] w-1/2 h-1/2 bg-green-500"></div>
              )}
              {cell.hasSnow && (
                <div className="absolute top-0 left-[25%] w-1/2 h-1/4 bg-white"></div>
              )}
            </div>
          ))}
        </div>
        
        {/* City name badge */}
        <div className="absolute bottom-1 left-1 right-1 text-[7px] leading-tight font-mono bg-black/70 text-white px-1 rounded truncate">
          {nft.city}
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
};

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
      
      {/* City Explorer Section */}
      <div className="mt-12">
        <div className="bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-950 dark:to-blue-950 rounded-xl p-6 border border-indigo-200 dark:border-indigo-900">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Book className="h-6 w-6 mr-3 text-indigo-600 dark:text-indigo-400" />
            <span>BlockReceipt City Explorer</span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl mb-6">
            Each BlockReceipt NFT showcases a unique cityscape from around the world, rendered in beautiful pixel art. 
            Discover iconic skylines from all continents, with details that change based on each city's characteristics and time of day.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Rare Cities Showcase */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-indigo-100 dark:border-slate-800">
              <h3 className="font-medium text-lg mb-3 flex items-center">
                <Star className="h-5 w-5 mr-2 text-amber-500" /> 
                <span>Legendary Cities</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Find rare pixel cities with unique landmarks and special architectural features. 
                Only 5% of the BlockReceipt collection features these legendary cityscapes.
              </p>
              <div className="flex justify-center mb-2">
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">Only 5 of 100 NFTs</Badge>
              </div>
            </div>
            
            {/* Time of Day Features */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-indigo-100 dark:border-slate-800">
              <h3 className="font-medium text-lg mb-3 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" /> 
                <span>Dynamic Lighting</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Each city is captured at different times of day - from golden sunrise to neon-lit night. 
                The lighting and mood changes to create a unique cityscape experience.
              </p>
              <div className="flex justify-center gap-2 mb-2">
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">Dawn</Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Day</Badge>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">Sunset</Badge>
                <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">Night</Badge>
              </div>
            </div>
            
            {/* Collection Bonuses */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-indigo-100 dark:border-slate-800">
              <h3 className="font-medium text-lg mb-3 flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-purple-500" /> 
                <span>Collection Bonuses</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Complete continent collections to unlock special BlockReceipt bonuses and rewards.
                Each region completed provides boosted benefits for your receipt NFTs.
              </p>
              <div className="flex justify-center mb-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Star className="h-3.5 w-3.5 mr-1.5" /> View Collection Rewards
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTCatalogPage;
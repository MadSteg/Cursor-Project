import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import NFTCatalog from '@/components/nft/NFTCatalog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Book, Sparkles, Shield, Trophy, Star, Clock, LucideIcon } from 'lucide-react';

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
    'sunrise': 'from-amber-300 to-yellow-500', // Sunrise glow on buildings
    'morning': 'from-blue-400 to-indigo-500', // Morning light on buildings
    'day': 'from-blue-300 to-sky-500', // Bright day
    'sunset': 'from-amber-500 to-red-600', // Sunset over skyscrapers
    'golden': 'from-amber-300 to-amber-500', // Golden hour city view
    'dusk': 'from-blue-800 to-indigo-900', // Dusk with city lights beginning to shine
    'night': 'from-indigo-800 to-purple-900', // Night city with lights
    'neon': 'from-pink-500 to-purple-600', // Neon lights district
    'rainy': 'from-slate-400 to-slate-600', // Rainy urban scene
    'foggy': 'from-slate-300 to-slate-500', // Foggy cityscape
    'snowy': 'from-gray-100 to-blue-100', // Snowy urban landscape
    'cyberpunk': 'from-cyan-500 to-blue-700', // Futuristic cyberpunk city
    'retro': 'from-amber-400 to-red-700', // Retro-style city perception
    'vintage': 'from-sepia to-amber-700', // Vintage look
  };
  
  // Building styles for pixel art representation
  const buildingStyles = ['Modern', 'Historical', 'Futuristic', 'Industrial', 'Cultural', 'Commercial', 'Art Deco', 'Gothic', 'Neoclassical', 'Brutalist'];
  
  // Famous landmarks or features to include in the pixel art
  const landmarks = [
    'Tower', 'Bridge', 'Cathedral', 'Skyscraper', 'Market', 
    'Harbor', 'Park', 'Station', 'Museum', 'Stadium',
    'Palace', 'Temple', 'Castle', 'Square', 'Monument',
    'Opera House', 'River', 'Fountain', 'Arena', 'Memorial'
  ];
  
  // Weather conditions to apply to the city view
  const weatherConditions = ['Clear', 'Cloudy', 'Rainy', 'Snowy', 'Foggy', 'Stormy', 'Windy'];
  
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
    const weather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    const population = Math.floor(Math.random() * 20) + 1; // City density/population factor (1-20)
    const elevation = Math.floor(Math.random() * 10) + 1; // City terrain elevation factor (1-10)
    
    const owned = Math.random() > 0.7; // 30% chance to own the NFT
    const interactive = Math.random() > 0.7; // 30% chance to be interactive
    
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
      weather,
      population,
      elevation,
      owned,
      animation: Math.random() > 0.5 ? 'float' : 'pulse',
      interactive,
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

// Minimalistic Pixel Art City NFT Component
const PixelNFT = ({ nft }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [timeState, setTimeState] = useState(nft.timeOfDay);
  
  // Create a minimalistic city-themed pixel art (10x10 grid)
  const generateCityGrid = () => {
    const grid = [];
    const rows = 10;
    const cols = 10;
    
    // Get a seed from the NFT ID for deterministic but unique generation
    const nftNum = parseInt(nft.id.split('-')[1]);
    
    // Create a skyline profile based on nft properties
    const skylineProfile = [];
    
    // Generate a simple skyline
    for (let col = 0; col < cols; col++) {
      // Use a simpler algorithm for skyline heights
      const baseHeight = Math.floor(3 + 
                               2 * Math.sin(col + nftNum % 5) + 
                               (col === Math.floor(cols/2) ? 2 : 0)); // Make center taller
      
      // Adjust height based on city properties
      const heightMod = (nft.landmark === 'Skyscraper' && col === Math.floor(cols/2)) ? 2 : 0;
      
      const finalHeight = Math.min(rows - 2, baseHeight + heightMod);
      skylineProfile.push(finalHeight);
    }
    
    // Generate grid with sky and buildings
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // For each cell, determine what it represents
        
        // Sky area (above buildings)
        const isSky = row < rows - skylineProfile[col];
        
        // Ground/street level (below buildings)
        const isGround = row >= rows - 1;
        
        // Building area (between sky and ground)
        const isBuilding = !isSky && !isGround;
        
        // Windows should appear on buildings
        const isWindow = isBuilding && 
                       ((row % 2 === 0) && (col % 2 === 0)) && 
                       Math.random() > 0.5;
        
        // Create a special landmark in the center
        const isLandmark = (col === Math.floor(cols/2) || col === Math.floor(cols/2) - 1) && 
                         isBuilding && 
                         row <= rows - skylineProfile[col] + 3;
        
        // Create special features based on city
        const hasSpecialFeature = (nft.city === 'Paris' && col === 4 && row === 3) || // Eiffel Tower top
                               (nft.city === 'New York' && col === 5 && row === 2) || // Statue of Liberty
                               (nft.city === 'London' && col === 7 && row === 6) || // London Eye
                               (nft.city === 'Tokyo' && col === 6 && row === 3); // Tokyo Tower
        
        // Weather effects - simple and minimal
        const hasCloud = isSky && row < 3 && col % 3 === 0 && Math.random() > 0.7;
        
        // Interactive elements based on time of day
        const isNightTime = (timeState === 'night' || timeState === 'dusk');
        const isInteractive = nft.interactive && 
                           ((isWindow && isNightTime) || 
                            (hasSpecialFeature && nft.interactive));
                            
        // Push the cell with properties
        grid.push({
          row,
          col,
          isSky,
          isGround,
          isBuilding,
          isWindow,
          isLandmark,
          hasSpecialFeature,
          hasCloud,
          isInteractive,
        });
      }
    }
    
    return grid;
  };
  
  // Get color schemes based on time of day
  const getColorScheme = (timeOfDay) => {
    const schemes = {
      dawn: {
        sky: 'bg-gradient-to-b from-indigo-500 to-pink-300',
        building: 'bg-indigo-900',
        landmark: 'bg-indigo-700',
        ground: 'bg-indigo-950',
        window: 'bg-yellow-200',
        cloud: 'bg-pink-200',
        special: 'bg-pink-400'
      },
      day: {
        sky: 'bg-gradient-to-b from-blue-400 to-blue-200',
        building: 'bg-gray-700',
        landmark: 'bg-gray-600',
        ground: 'bg-gray-800',
        window: 'bg-blue-100',
        cloud: 'bg-white',
        special: 'bg-blue-300'
      },
      sunset: {
        sky: 'bg-gradient-to-b from-blue-400 to-orange-300',
        building: 'bg-gray-800',
        landmark: 'bg-gray-700',
        ground: 'bg-gray-900',
        window: 'bg-orange-200',
        cloud: 'bg-orange-200',
        special: 'bg-amber-400'
      },
      dusk: {
        sky: 'bg-gradient-to-b from-indigo-700 to-purple-500',
        building: 'bg-gray-900',
        landmark: 'bg-gray-800',
        ground: 'bg-gray-950',
        window: 'bg-yellow-300',
        cloud: 'bg-purple-300',
        special: 'bg-purple-400'
      },
      night: {
        sky: 'bg-gradient-to-b from-gray-900 to-indigo-900',
        building: 'bg-gray-950',
        landmark: 'bg-gray-900',
        ground: 'bg-black',
        window: 'bg-yellow-400',
        cloud: 'bg-gray-800',
        special: 'bg-indigo-400'
      },
      neon: {
        sky: 'bg-gradient-to-b from-gray-900 to-purple-900',
        building: 'bg-gray-950',
        landmark: 'bg-gray-900',
        ground: 'bg-black',
        window: 'bg-pink-500',
        cloud: 'bg-purple-800',
        special: 'bg-cyan-400'
      }
    };
    
    // Default to day if time not found
    return schemes[timeOfDay] || schemes.day;
  };
  
  // Animation class for interactive elements
  const getAnimationClass = (timeOfDay) => {
    switch(timeOfDay) {
      case 'neon': return 'animate-pulse';
      case 'night': return 'animate-pulse';
      default: return '';
    }
  };
  
  // Generate city grid
  const cityGrid = generateCityGrid();
  
  // Function to cycle through time periods when clicked
  const cycleTimePeriod = () => {
    if (!nft.interactive) return;
    
    const times = ['dawn', 'day', 'sunset', 'dusk', 'night', 'neon'];
    const currentIndex = times.indexOf(timeState);
    const nextIndex = (currentIndex + 1) % times.length;
    setTimeState(times[nextIndex]);
  };
  
  // Get current color scheme
  const colorScheme = getColorScheme(timeState);
  
  return (
    <div 
      className={`relative group ${nft.owned ? '' : 'grayscale opacity-60'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={cycleTimePeriod}
    >
      {/* Minimalistic pixelated city NFT artwork */}
      <div 
        className={`
          w-24 h-24 rounded-lg overflow-hidden border-2 
          ${nft.owned ? 'border-amber-500 shadow-md shadow-amber-200/50' : 'border-gray-400'}
          transition-all transform hover:scale-110 cursor-pointer
          ${nft.interactive ? 'hover:ring-2 hover:ring-purple-400' : ''}
        `}
      >
        {/* Sky background */}
        <div className={`w-full h-full ${colorScheme.sky}`}>
          {/* Pixel grid */}
          <div className="w-full h-full grid grid-cols-10 grid-rows-10">
            {cityGrid.map((cell, i) => (
              <div 
                key={i} 
                className={`
                  ${cell.isSky && !cell.hasCloud ? 'bg-transparent' : ''}
                  ${cell.isGround ? colorScheme.ground : ''}
                  ${cell.isBuilding && !cell.isLandmark ? colorScheme.building : ''}
                  ${cell.isLandmark ? colorScheme.landmark : ''}
                  ${cell.hasCloud ? colorScheme.cloud : ''}
                  ${cell.hasSpecialFeature ? colorScheme.special : ''}
                  ${cell.isInteractive ? getAnimationClass(timeState) : ''}
                  ${cell.isWindow ? 'relative' : ''}
                `}
              >
                {cell.isWindow && (
                  <div className={`absolute inset-[30%] ${colorScheme.window}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* City name badge */}
        <div className="absolute bottom-1 left-1 right-1 text-[8px] leading-tight font-mono bg-black/70 text-white px-1 rounded truncate">
          {nft.city}
        </div>
        
        {/* Time of day indicator when interactive */}
        {nft.interactive && isHovered && (
          <div className="absolute top-1 right-1 text-[7px] leading-tight font-mono bg-purple-900/80 text-white px-1 py-0.5 rounded-sm">
            <Clock className="h-2 w-2 inline-block mr-0.5" /> 
            {timeState.charAt(0).toUpperCase() + timeState.slice(1)}
          </div>
        )}
      </div>
      
      {/* Owned indicator */}
      {nft.owned && (
        <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 z-10">
          <div className="w-3 h-3 text-white flex items-center justify-center">
            ✓
          </div>
        </div>
      )}
      
      {/* Interactive badge */}
      {nft.interactive && (
        <div className="absolute -top-1 -left-1 bg-purple-500 rounded-full p-0.5 z-10">
          <div className="w-3 h-3 text-white flex items-center justify-center text-[6px]">
            ⚡
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
      

    </div>
  );
}

export default NFTCatalogPage;
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import NFTCatalog from '@/components/nft/NFTCatalog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Book, Sparkles, Shield, Trophy, Star, Clock, LucideIcon } from 'lucide-react';

// Generate pixelated receipt-themed NFT collection data
const generateNFTCollection = () => {
  // Receipt eras/styles categories
  const receiptTypes = {
    'Vintage': [
      '1950s Diner', 'General Store', 'Film Ticket', 'Telegram', 'Typewriter', 
      'Jukebox', 'Drive-In', 'Pharmacy', 'Radio Shop', 'Vinyl Record'
    ],
    'Retro': [
      'Arcade Token', 'VHS Rental', 'Cassette', 'Floppy Disk', 'Polaroid', 
      'Walkman', 'Game Cartridge', 'Neon Sign', 'Payphone', 'Vending Machine'
    ],
    'Digital': [
      'E-Commerce', 'App Store', 'Streaming', 'Cloud Service', 'Digital Download', 
      'Online Marketplace', 'Subscription', 'NFT Purchase', 'Digital Ticket', 'Virtual Good'
    ],
    'Future': [
      'Neural Interface', 'Holo-Purchase', 'Space Commerce', 'Quantum Credit', 'Thought Transaction', 
      'Biometric Payment', 'AI Generated', 'Reality Augment', 'Virtual World', 'Interplanetary'
    ],
    'Specialty': [
      'Luxury Brand', 'Artisan Market', 'Farmers Market', 'Festival Token', 'Museum Pass', 
      'Limited Edition', 'Collectible', 'Handmade', 'Auction House', 'Craft Fair'
    ]
  };
  
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];
  
  // Receipt paper types and color schemes
  const paperTypes = {
    'thermal': 'from-gray-100 to-gray-200', // Modern thermal paper
    'dotMatrix': 'from-blue-50 to-white', // Dot matrix printer paper with perf edges
    'carbon': 'from-indigo-100 to-purple-100', // Carbon copy receipts
    'parchment': 'from-amber-50 to-yellow-100', // Old parchment style
    'recycled': 'from-green-50 to-emerald-100', // Eco-friendly recycled paper
    'digital': 'from-cyan-100 to-blue-200', // Digital receipt glow
    'holographic': 'from-pink-100 to-purple-200', // Futuristic holographic display
    'ticker': 'from-yellow-50 to-amber-100', // Stock ticker tape style
    'glossy': 'from-sky-100 to-blue-50', // Glossy coated receipt
    'vintage': 'from-amber-100 to-yellow-200', // Aged vintage paper
  };
  
  // Receipt printing styles
  const printStyles = ['Inkjet', 'Thermal', 'Handwritten', 'Stamped', 'Embossed'];
  
  // Special features that might appear on receipts
  const specialFeatures = [
    'Logo', 'Barcode', 'QR Code', 'Loyalty Points', 'Coupon', 
    'Tax Info', 'Serial Number', 'Timestamp', 'Currency Symbol', 'Signature',
    'Return Policy', 'Survey Code', 'Cashier ID', 'Location', 'Membership'
  ];
  
  // Time periods for receipt styles
  const timePeriods = ['Dawn', 'Day', 'Dusk', 'Night', 'Retro', 'Future', 'Digital', 'Classic', 'Minimal', 'Maximalist'];
  
  // Flatten categories and receipt types into arrays
  const allCategories = Object.keys(receiptTypes);
  const allReceiptTypes = Object.values(receiptTypes).flat();
  
  // Generate 100 receipt-themed NFTs
  const collection = Array.from({ length: 100 }, (_, index) => {
    const category = allCategories[Math.floor(Math.random() * allCategories.length)];
    const availableTypes = receiptTypes[category];
    const receiptStyle = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    
    const timePeriod = timePeriods[Math.floor(Math.random() * timePeriods.length)];
    const paperType = Object.keys(paperTypes)[Math.floor(Math.random() * Object.keys(paperTypes).length)];
    const paperColor = paperTypes[paperType];
    
    const printStyle = printStyles[Math.floor(Math.random() * printStyles.length)];
    const feature = specialFeatures[Math.floor(Math.random() * specialFeatures.length)];
    
    // Generate a random year between 1950 and 2035
    const year = Math.floor(Math.random() * (2035 - 1950) + 1950);
    
    // Generate a random merchant name
    const merchantPrefix = ['Super', 'Mega', 'Ultra', 'Global', 'Royal', 'Prime', 'Elite', 'Express', 'Smart', 'Direct'];
    const merchantSuffix = ['Mart', 'Shop', 'Store', 'Market', 'Depot', 'Emporium', 'Bazaar', 'Corner', 'Outlet', 'Center'];
    const merchantName = `${merchantPrefix[Math.floor(Math.random() * merchantPrefix.length)]}${merchantSuffix[Math.floor(Math.random() * merchantSuffix.length)]}`;
    
    // Generate a random price between $0.99 and $999.99
    const price = (Math.random() * (999 - 0.99) + 0.99).toFixed(2);
    
    const owned = Math.random() > 0.7; // 30% chance to own the NFT
    
    return {
      id: `nft-${index + 1}`,
      name: `${receiptStyle} Receipt`,
      description: `${year} ${receiptStyle} receipt with ${feature} using ${printStyle} on ${paperType} paper`,
      category,
      receiptStyle,
      year,
      merchantName,
      price,
      rarity,
      paperColor,
      paperType,
      timePeriod,
      printStyle,
      feature,
      owned,
      animation: Math.random() > 0.5 ? 'float' : 'pulse',
      interactive: Math.random() > 0.7, // 30% chance to be interactive
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

// Pixel Art Receipt NFT Component
const PixelNFT = ({ nft }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [timeState, setTimeState] = useState(nft.timePeriod);
  
  // Create a receipt-themed pixel art
  const generateReceiptGrid = () => {
    const grid = [];
    const rows = 12; // Larger grid for more detail
    const cols = 10;
    
    // Generate a receipt shape and contents based on NFT properties
    // Base pattern will be determined by receipt type, era, and other factors
    
    // Get a seed from the NFT ID for deterministic but unique generation
    const nftNum = parseInt(nft.id.split('-')[1]);
    
    // Generate header height based on receipt style
    const headerHeight = Math.max(2, Math.min(4, nft.receiptStyle.length % 4 + 1));
    
    // Generate receipt content based on features and style
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Determine what each pixel represents
        
        // Paper texture/background (always present)
        const isPaper = true;
        
        // Header section of receipt (store name, logo, date, etc.)
        const isHeader = row < headerHeight;
        
        // Footer section (tax info, barcode, thank you message)
        const isFooter = row > rows - 3;
        
        // Text lines (items, prices, etc.) - appear in the middle
        const isTextLine = !isHeader && !isFooter && 
                          (row % 2 === 0 || (nft.printStyle === 'Dot Matrix' && row % 3 === 0));
        
        // Prices typically on the right side
        const isPrice = isTextLine && col > cols - 3;
        
        // Special feature elements (logo, barcode, QR code, etc.)
        const isSpecialFeature = (
          // Logo placement
          (nft.feature === 'Logo' && isHeader && col > 1 && col < cols - 2) ||
          // Barcode at bottom
          (nft.feature === 'Barcode' && isFooter && col % 2 === 0) ||
          // QR Code bottom right
          (nft.feature === 'QR Code' && isFooter && row > rows - 3 && col > cols - 4) ||
          // Coupon typically shown at the bottom with a dashed line
          (nft.feature === 'Coupon' && row === rows - 4 && col % 2 === 0) ||
          // Serial Number at the very bottom
          (nft.feature === 'Serial Number' && row === rows - 1 && col > 1 && col < cols - 1)
        );
        
        // Dotted separators between sections
        const isDivider = ((row === headerHeight || row === rows - 3) && col % 2 === 0) || 
                        (nft.feature === 'Coupon' && row === rows - 5 && col % 2 === 0);
        
        // Determine if this cell is a perforation (for certain receipt types)
        const isPerforation = (
          // Side perforation for continuous feed paper
          nft.paperType === 'dotMatrix' && (col === 0 || col === cols - 1) && row % 2 === 0
        );
        
        // Timestamp or date usually found at the top of receipt
        const isDate = isHeader && row === 1 && col > 1 && col < cols - 2;
        
        // Interactive elements that light up/animate based on time period
        const isInteractiveElement = nft.interactive && (
          // Interactive elements vary by receipt type
          (nft.category === 'Digital' && row % 3 === 0 && col % 3 === 0) ||
          (nft.category === 'Future' && row % 4 === 0 && col % 2 === 0) ||
          (isSpecialFeature && nft.category === 'Retro') ||
          (nft.feature === 'QR Code' && row > rows - 3 && col > cols - 4)
        );
        
        // Push all these cell properties
        grid.push({
          row,
          col,
          isPaper,
          isHeader,
          isFooter,
          isTextLine,
          isPrice,
          isSpecialFeature,
          isDivider,
          isPerforation,
          isDate,
          isInteractiveElement,
          // Randomize some pixels for texture
          noisy: Math.random() > 0.9
        });
      }
    }
    
    return grid;
  };
  
  // Get paper background based on paper type and time period
  const getPaperColor = (paperType, timePeriod) => {
    // Base colors
    switch(paperType) {
      case 'thermal': return timePeriod === 'Night' ? 'bg-gray-200' : 'bg-gray-100';
      case 'dotMatrix': return 'bg-blue-50';
      case 'carbon': return 'bg-indigo-100';
      case 'parchment': return timePeriod === 'Retro' ? 'bg-amber-100' : 'bg-amber-50';
      case 'recycled': return 'bg-green-50';
      case 'digital': return timePeriod === 'Night' ? 'bg-cyan-200' : 'bg-cyan-100';
      case 'holographic': return timePeriod === 'Night' ? 'bg-purple-200' : 'bg-pink-100';
      case 'ticker': return 'bg-yellow-50';
      case 'glossy': return 'bg-sky-100';
      case 'vintage': return timePeriod === 'Retro' ? 'bg-amber-200' : 'bg-amber-100';
      default: return 'bg-white';
    }
  };
  
  // Get text element color based on time period and type
  const getTextColor = (isSpecial, timePeriod) => {
    if (isSpecial) {
      switch(timePeriod) {
        case 'Dawn': return 'bg-amber-800';
        case 'Day': return 'bg-indigo-900';
        case 'Dusk': return 'bg-purple-900';
        case 'Night': return 'bg-indigo-800';
        case 'Retro': return 'bg-amber-900';
        case 'Future': return 'bg-cyan-800';
        case 'Digital': return 'bg-blue-800';
        default: return 'bg-gray-800';
      }
    } else {
      return 'bg-gray-900';
    }
  };
  
  // Get interactive element color (elements that light up)
  const getInteractiveColor = (timePeriod) => {
    switch(timePeriod) {
      case 'Dawn': return 'bg-amber-400';
      case 'Day': return 'bg-blue-400';
      case 'Dusk': return 'bg-purple-400';
      case 'Night': return 'bg-amber-300';
      case 'Retro': return 'bg-red-400';
      case 'Future': return 'bg-cyan-400';
      case 'Digital': return 'bg-emerald-400';
      default: return 'bg-white';
    }
  };
  
  // Animation class for interactive elements
  const getAnimationClass = (timePeriod) => {
    switch(timePeriod) {
      case 'Dawn': 
      case 'Dusk': return 'animate-pulse';
      case 'Night':
      case 'Digital': return 'animate-ping';
      case 'Future': return 'animate-bounce';
      case 'Retro': return 'animate-pulse';
      default: return 'animate-none';
    }
  };
  
  // Generate receipt grid
  const receiptGrid = generateReceiptGrid();
  
  // Function to cycle through time periods when interacting
  const cycleTimePeriod = () => {
    if (!nft.interactive) return;
    
    const periods = ['Dawn', 'Day', 'Dusk', 'Night', 'Retro', 'Future', 'Digital'];
    const currentIndex = periods.indexOf(timeState);
    const nextIndex = (currentIndex + 1) % periods.length;
    setTimeState(periods[nextIndex]);
  };
  
  return (
    <div 
      className={`relative group ${nft.owned ? '' : 'grayscale opacity-60'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={cycleTimePeriod}
    >
      {/* Larger pixelated receipt NFT artwork */}
      <div 
        className={`
          w-32 h-40 rounded-lg overflow-hidden border-2 
          ${nft.owned ? 'border-amber-500 shadow-lg shadow-amber-200/50' : 'border-gray-400'}
          transition-all transform hover:scale-105 cursor-pointer
          ${nft.interactive ? 'hover:ring-2 hover:ring-purple-400' : ''}
        `}
      >
        {/* Generate a pixel art receipt */}
        <div className={`w-full h-full grid grid-cols-10 grid-rows-12 ${getPaperColor(nft.paperType, timeState)}`}>
          {receiptGrid.map((cell, i) => (
            <div 
              key={i} 
              className={`
                ${cell.isPaper ? 'bg-opacity-100' : 'bg-opacity-0'}
                ${cell.isHeader && cell.isSpecialFeature ? getTextColor(true, timeState) : ''}
                ${cell.isTextLine && !cell.isPrice ? getTextColor(false, timeState) : ''}
                ${cell.isPrice ? 'bg-gray-800' : ''}
                ${cell.isDivider ? 'bg-gray-400' : ''}
                ${cell.isPerforation ? 'bg-white' : ''}
                ${cell.isSpecialFeature && !cell.isHeader ? 'bg-gray-700' : ''}
                ${cell.isDate ? 'bg-gray-600' : ''}
                ${cell.noisy && !cell.isInteractiveElement ? 'bg-opacity-10' : ''}
                ${cell.isInteractiveElement ? `${getInteractiveColor(timeState)} ${getAnimationClass(timeState)}` : ''}
                ${nft.interactive && cell.isInteractiveElement ? 'animate-duration-[1500ms]' : ''}
                relative
              `}
              style={{
                animationDelay: cell.isInteractiveElement ? `${(i % 7) * 0.2}s` : '',
              }}
            >
              {/* Add fine-grain texture and details */}
              {cell.isPerforation && (
                <div className="absolute inset-0 bg-gray-200 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Receipt style label */}
        <div className="absolute bottom-1 left-1 right-1 text-[8px] leading-tight font-mono bg-black/70 text-white px-1 rounded truncate flex justify-between items-center">
          <span>{nft.receiptStyle}</span>
          <span>${nft.price}</span>
        </div>
        
        {/* Time period indicator when interactive */}
        {nft.interactive && isHovered && (
          <div className="absolute top-1 right-1 text-[7px] leading-tight font-mono bg-purple-900/80 text-white px-1 py-0.5 rounded-sm">
            <Clock className="h-2 w-2 inline-block mr-0.5" /> {timeState}
          </div>
        )}
        
        {/* Year display */}
        <div className="absolute top-1 left-1 text-[7px] leading-tight font-mono bg-black/60 text-white px-1 rounded">
          {nft.year}
        </div>
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
      
      {/* Receipt Aesthetics Collection Section */}
      <div className="mt-12">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 rounded-xl p-6 border border-amber-200 dark:border-amber-900">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Book className="h-6 w-6 mr-3 text-amber-600 dark:text-amber-400" />
            <span>Receipt Aesthetics Collection</span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl mb-6">
            Each BlockReceipt NFT transforms transaction data into beautiful pixel art inspired by receipt designs across history.
            From vintage paper slips to futuristic holo-receipts, collect these financial artifacts in your digital vault.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Interactive NFTs */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-purple-100 dark:border-purple-900">
              <h3 className="font-medium text-lg mb-3 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-500" /> 
                <span>Interactive Receipts</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Special interactive NFTs respond to clicks and change their appearance based on time period.
                Click on any receipt with the ⚡ symbol to see it transform through different visual styles.
              </p>
              <div className="flex justify-center mb-2">
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">30% of Collection</Badge>
              </div>
            </div>
            
            {/* Time Period Features */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-blue-100 dark:border-blue-900">
              <h3 className="font-medium text-lg mb-3 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" /> 
                <span>Era-Spanning Designs</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Each receipt captures a different era of transaction history - from classic paper receipts to 
                futuristic digital interfaces and everything in between.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-2">
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">Vintage</Badge>
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">Retro</Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Digital</Badge>
                <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200">Future</Badge>
              </div>
            </div>
            
            {/* Rarity Tiers */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-amber-100 dark:border-amber-900">
              <h3 className="font-medium text-lg mb-3 flex items-center">
                <Star className="h-5 w-5 mr-2 text-amber-500" /> 
                <span>Receipt Rarities</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Collect special receipts with rare features like vintage telegram receipts, 
                limited edition event tickets, or futuristic neural interface transactions.
              </p>
              <div className="flex justify-center mb-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Trophy className="h-3.5 w-3.5 mr-1.5" /> View Rarity Guide
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
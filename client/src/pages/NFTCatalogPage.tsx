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

// High-resolution Pixel Art City NFT Component
const PixelNFT = ({ nft }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [timeState, setTimeState] = useState(nft.timeOfDay);
  
  // Create a detailed city-themed pixel art with 1000 pixels (32x32 grid)
  const generateCityGrid = () => {
    const grid = [];
    const rows = 32; // Larger grid for much more detail
    const cols = 32;
    
    // Get a seed from the NFT ID for deterministic but unique generation
    const nftNum = parseInt(nft.id.split('-')[1]);
    
    // Create a skyline profile based on nft properties
    const skylineProfile = [];
    
    // Generate a more varied and interesting skyline profile
    for (let col = 0; col < cols; col++) {
      // Use sine waves of different frequencies to create natural-looking skylines
      const baseHeight = Math.max(
        4, 
        Math.floor(
          8 + // Base height offset
          6 * Math.sin(col / 3 + nftNum % 5) + // Primary wave
          3 * Math.sin(col / 7 + nftNum % 3) + // Secondary wave
          2 * Math.cos(col / 2 + nftNum % 7)   // Tertiary wave
        )
      );
      
      // Adjust height based on city population and landmark
      const heightMod = Math.floor(nft.population / 4) + 
                      (nft.landmark === 'Skyscraper' ? 4 : 
                       nft.landmark === 'Tower' ? 3 :
                       nft.landmark === 'Cathedral' ? 2 : 0);
                       
      const finalHeight = Math.min(rows - 4, baseHeight + heightMod);
      skylineProfile.push(finalHeight);
    }
    
    // Find the landmark position (usually near the center with some variation)
    const landmarkPosition = Math.floor(cols / 2) + (nftNum % 7) - 3;
    
    // Add special height for the landmark
    if (nft.landmark === 'Tower' || nft.landmark === 'Skyscraper') {
      // Make the landmark taller
      for (let i = -2; i <= 2; i++) {
        const pos = landmarkPosition + i;
        if (pos >= 0 && pos < cols) {
          skylineProfile[pos] = Math.min(rows - 2, skylineProfile[pos] + 5 - Math.abs(i * 2));
        }
      }
    }
    
    // Generate grid with sky and buildings
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // For each cell, determine what it represents
        
        // Sky area (above buildings)
        const isSky = row < rows - skylineProfile[col];
        
        // Ground/street level (below buildings)
        const isGround = row >= rows - 2;
        
        // Building area (between sky and ground)
        const isBuilding = !isSky && !isGround;
        
        // Landmark feature
        const isLandmark = isBuilding && 
                        Math.abs(col - landmarkPosition) < 3 && 
                        row < rows - skylineProfile[col] + 5;
        
        // Generate specialized buildings based on styles
        const isModernBuilding = isBuilding && 
                               !isLandmark &&
                               nft.buildingStyle === 'Modern' && 
                               (col % 5 === 0 || col % 5 === 1);
        
        const isHistoricalBuilding = isBuilding && 
                                   !isLandmark &&
                                   nft.buildingStyle === 'Historical' && 
                                   (col % 4 === 0 || col % 4 === 1);
        
        const isFuturisticBuilding = isBuilding && 
                                   !isLandmark &&
                                   nft.buildingStyle === 'Futuristic' && 
                                   (col % 3 === 0 || col % 3 === 1);
        
        const isArtDecoBuilding = isBuilding && 
                                !isLandmark &&
                                nft.buildingStyle === 'Art Deco' && 
                                (col % 6 === 0 || col % 6 === 1);
        
        // Add windows to buildings with different patterns based on time of day
        // Windows appear more frequently at night
        const isNightTime = timeState === 'night' || timeState === 'dusk' || timeState === 'neon';
        const windowProbability = isNightTime ? 0.4 : 0.7;
        const hasWindow = isBuilding && 
                        !isGround && 
                        row % 3 === 1 && // Window rows
                        col % 2 === 1 && // Window columns
                        Math.random() > windowProbability;
        
        // Create special areas for different landmarks
        const hasBridge = isGround && 
                      nft.landmark === 'Bridge' && 
                      col > cols / 3 && 
                      col < 2 * cols / 3;
                      
        const hasFountain = isGround && 
                         nft.landmark === 'Fountain' && 
                         Math.abs(col - cols / 2) < 3;
                         
        const hasRiver = (row >= rows - 4) && 
                      nft.landmark === 'River' && 
                      row >= rows - 4 - Math.floor(Math.sin(col / 5) * 2);
                         
        // Weather effects
        const hasCloud = isSky && 
                     (nft.weather === 'Cloudy' || nft.weather === 'Rainy' || nft.weather === 'Stormy') && 
                     Math.random() > 0.8 &&
                     row > rows / 8 && row < rows / 2;
                     
        const hasRain = isSky && 
                     (nft.weather === 'Rainy' || nft.weather === 'Stormy') && 
                     Math.random() > 0.85 &&
                     col % 4 === (Math.floor(row / 2) % 4);
                     
        const hasSnow = (isSky || isGround) && 
                     nft.weather === 'Snowy' && 
                     Math.random() > 0.9;
                     
        const hasFog = isSky && 
                    nft.weather === 'Foggy' && 
                    row > rows / 3 &&
                    Math.random() > 0.7;
                    
        // Add city-specific decorations
        const hasPalm = isGround && 
                     (nft.city === 'Miami' || nft.city === 'Dubai' || nft.city === 'Los Angeles') &&
                     col % 7 === 0;
                     
        const hasSnowCap = isBuilding && 
                        (nft.weather === 'Snowy') &&
                        row === rows - skylineProfile[col];
                        
        // Interactive elements that change with time
        const isInteractiveElement = nft.interactive && (
          // Windows at night
          (isNightTime && hasWindow) ||
          // Neon signs
          (timeState === 'neon' && isBuilding && col % 5 === 0 && row % 4 === 0) ||
          // Landmark lighting
          (isLandmark && isNightTime)
        );
        
        // Push all these cell properties
        grid.push({
          row,
          col,
          isSky,
          isGround,
          isBuilding,
          isLandmark,
          isModernBuilding,
          isHistoricalBuilding,
          isFuturisticBuilding,
          isArtDecoBuilding,
          hasWindow,
          hasBridge,
          hasFountain,
          hasRiver,
          hasCloud,
          hasRain,
          hasSnow,
          hasFog,
          hasPalm,
          hasSnowCap,
          isInteractiveElement,
          // Randomize some pixels for details
          detail: Math.random()
        });
      }
    }
    
    return grid;
  };
  
  // Get sky color based on time of day
  const getSkyColor = (timeOfDay) => {
    switch(timeOfDay) {
      case 'dawn': return 'bg-gradient-to-b from-indigo-800 via-pink-400 to-orange-300';
      case 'sunrise': return 'bg-gradient-to-b from-indigo-500 via-orange-300 to-yellow-200';
      case 'morning': return 'bg-gradient-to-b from-blue-400 to-blue-200';
      case 'day': return 'bg-gradient-to-b from-blue-500 to-blue-300';
      case 'sunset': return 'bg-gradient-to-b from-blue-400 via-orange-400 to-red-500';
      case 'golden': return 'bg-gradient-to-b from-blue-300 via-amber-300 to-amber-400';
      case 'dusk': return 'bg-gradient-to-b from-indigo-800 via-purple-600 to-purple-900';
      case 'night': return 'bg-gradient-to-b from-gray-900 via-indigo-900 to-purple-900';
      case 'neon': return 'bg-gradient-to-b from-gray-900 via-purple-900 to-pink-900';
      case 'rainy': return 'bg-gradient-to-b from-gray-700 to-gray-500';
      case 'foggy': return 'bg-gradient-to-b from-gray-400 to-gray-300';
      case 'snowy': return 'bg-gradient-to-b from-gray-200 to-blue-100';
      case 'cyberpunk': return 'bg-gradient-to-b from-blue-900 via-purple-800 to-cyan-700';
      case 'retro': return 'bg-gradient-to-b from-amber-700 via-orange-600 to-red-700';
      case 'vintage': return 'bg-gradient-to-b from-sepia via-amber-700 to-amber-800';
      default: return 'bg-blue-400';
    }
  };
  
  // Get building color based on style and time of day
  const getBuildingColor = (buildingType, timeOfDay) => {
    // Base colors for different building types
    const styleBases = {
      landmark: {
        dawn: 'bg-amber-700',
        sunrise: 'bg-amber-600',
        morning: 'bg-amber-500',
        day: 'bg-amber-500',
        sunset: 'bg-amber-600',
        golden: 'bg-amber-500',
        dusk: 'bg-amber-800',
        night: 'bg-amber-900',
        neon: 'bg-amber-800',
        rainy: 'bg-amber-800',
        foggy: 'bg-amber-700',
        snowy: 'bg-amber-700',
        cyberpunk: 'bg-amber-700',
        retro: 'bg-amber-600',
        vintage: 'bg-amber-800',
      },
      modern: {
        dawn: 'bg-gray-700',
        sunrise: 'bg-gray-600',
        morning: 'bg-gray-500',
        day: 'bg-gray-400',
        sunset: 'bg-gray-500',
        golden: 'bg-gray-500',
        dusk: 'bg-gray-700',
        night: 'bg-gray-800',
        neon: 'bg-gray-800',
        rainy: 'bg-gray-700',
        foggy: 'bg-gray-600',
        snowy: 'bg-gray-400',
        cyberpunk: 'bg-gray-800',
        retro: 'bg-gray-600',
        vintage: 'bg-gray-700',
      },
      historical: {
        dawn: 'bg-stone-700',
        sunrise: 'bg-stone-600',
        morning: 'bg-stone-500',
        day: 'bg-stone-500',
        sunset: 'bg-stone-600',
        golden: 'bg-stone-600',
        dusk: 'bg-stone-700',
        night: 'bg-stone-800',
        neon: 'bg-stone-800',
        rainy: 'bg-stone-700',
        foggy: 'bg-stone-600',
        snowy: 'bg-stone-600',
        cyberpunk: 'bg-stone-700',
        retro: 'bg-stone-600',
        vintage: 'bg-stone-700',
      },
      futuristic: {
        dawn: 'bg-slate-700',
        sunrise: 'bg-slate-600',
        morning: 'bg-slate-500',
        day: 'bg-slate-400',
        sunset: 'bg-slate-500',
        golden: 'bg-slate-600',
        dusk: 'bg-slate-700',
        night: 'bg-slate-800',
        neon: 'bg-slate-900',
        rainy: 'bg-slate-700',
        foggy: 'bg-slate-600',
        snowy: 'bg-slate-500',
        cyberpunk: 'bg-slate-800',
        retro: 'bg-slate-600',
        vintage: 'bg-slate-700',
      },
      artDeco: {
        dawn: 'bg-amber-800',
        sunrise: 'bg-amber-700',
        morning: 'bg-amber-600',
        day: 'bg-amber-600',
        sunset: 'bg-amber-700',
        golden: 'bg-amber-600',
        dusk: 'bg-amber-800',
        night: 'bg-amber-900',
        neon: 'bg-amber-800',
        rainy: 'bg-amber-800',
        foggy: 'bg-amber-700',
        snowy: 'bg-amber-700',
        cyberpunk: 'bg-amber-800',
        retro: 'bg-amber-700',
        vintage: 'bg-amber-900',
      },
      default: {
        dawn: 'bg-gray-800',
        sunrise: 'bg-gray-700',
        morning: 'bg-gray-600',
        day: 'bg-gray-500',
        sunset: 'bg-gray-600',
        golden: 'bg-gray-600',
        dusk: 'bg-gray-700',
        night: 'bg-gray-900',
        neon: 'bg-gray-900',
        rainy: 'bg-gray-800',
        foggy: 'bg-gray-700',
        snowy: 'bg-gray-600',
        cyberpunk: 'bg-gray-900',
        retro: 'bg-gray-700',
        vintage: 'bg-gray-800',
      }
    };
    
    // Choose base style
    let style = styleBases.default;
    if (buildingType === 'landmark') style = styleBases.landmark;
    else if (buildingType === 'modern') style = styleBases.modern;
    else if (buildingType === 'historical') style = styleBases.historical;
    else if (buildingType === 'futuristic') style = styleBases.futuristic;
    else if (buildingType === 'artDeco') style = styleBases.artDeco;
    
    // Return color for current time of day
    return style[timeOfDay] || style.day;
  };
  
  // Get window color based on time of day
  const getWindowColor = (timeOfDay) => {
    switch(timeOfDay) {
      case 'dawn': return 'bg-orange-200';
      case 'sunrise': return 'bg-amber-100';
      case 'morning': return 'bg-white/70';
      case 'day': return 'bg-sky-100/70';
      case 'sunset': return 'bg-amber-200';
      case 'golden': return 'bg-amber-200';
      case 'dusk': return 'bg-amber-400';
      case 'night': return 'bg-yellow-300';
      case 'neon': return 'bg-pink-300';
      case 'rainy': return 'bg-yellow-100';
      case 'foggy': return 'bg-white/40';
      case 'snowy': return 'bg-white/70';
      case 'cyberpunk': return 'bg-cyan-300';
      case 'retro': return 'bg-amber-300';
      case 'vintage': return 'bg-amber-200';
      default: return 'bg-white/60';
    }
  };
  
  // Get color for special elements
  const getSpecialColor = (elementType, timeOfDay) => {
    const specialColors = {
      cloud: 'bg-white/70',
      rain: 'bg-blue-300/40',
      snow: 'bg-white',
      fog: 'bg-white/30',
      ground: {
        dawn: 'bg-gray-700',
        day: 'bg-gray-600',
        night: 'bg-gray-900',
        default: 'bg-gray-700'
      },
      river: {
        dawn: 'bg-blue-400',
        day: 'bg-blue-500',
        night: 'bg-blue-900',
        default: 'bg-blue-600'
      },
      fountain: {
        dawn: 'bg-blue-300',
        day: 'bg-blue-400',
        night: 'bg-blue-800',
        default: 'bg-blue-500'
      },
      bridge: {
        dawn: 'bg-stone-700',
        day: 'bg-stone-600',
        night: 'bg-stone-900',
        default: 'bg-stone-700'
      },
      palm: 'bg-green-600',
      snowCap: 'bg-white'
    };
    
    // Return appropriate color
    if (elementType === 'cloud') return specialColors.cloud;
    if (elementType === 'rain') return specialColors.rain;
    if (elementType === 'snow') return specialColors.snow;
    if (elementType === 'fog') return specialColors.fog;
    if (elementType === 'ground') {
      if (timeOfDay in specialColors.ground) {
        return specialColors.ground[timeOfDay];
      }
      return specialColors.ground.default;
    }
    if (elementType === 'river') {
      if (timeOfDay in specialColors.river) {
        return specialColors.river[timeOfDay];
      }
      return specialColors.river.default;
    }
    if (elementType === 'fountain') {
      if (timeOfDay in specialColors.fountain) {
        return specialColors.fountain[timeOfDay];
      }
      return specialColors.fountain.default;
    }
    if (elementType === 'bridge') {
      if (timeOfDay in specialColors.bridge) {
        return specialColors.bridge[timeOfDay];
      }
      return specialColors.bridge.default;
    }
    if (elementType === 'palm') return specialColors.palm;
    if (elementType === 'snowCap') return specialColors.snowCap;
    
    return 'bg-transparent';
  };
  
  // Animation class for interactive elements
  const getAnimationClass = (timeOfDay) => {
    switch(timeOfDay) {
      case 'neon': return 'animate-pulse';
      case 'cyberpunk': return 'animate-pulse';
      case 'night': return 'animate-pulse';
      case 'storm': return 'animate-ping';
      default: return 'animate-none';
    }
  };
  
  // Generate city grid
  const cityGrid = generateCityGrid();
  
  // Function to cycle through time periods when clicked
  const cycleTimePeriod = () => {
    if (!nft.interactive) return;
    
    const times = [
      'dawn', 'sunrise', 'morning', 'day', 
      'sunset', 'golden', 'dusk', 'night', 
      'neon', 'cyberpunk'
    ];
    const currentIndex = times.indexOf(timeState);
    const nextIndex = (currentIndex + 1) % times.length;
    setTimeState(times[nextIndex]);
  };
  
  return (
    <div 
      className={`relative group ${nft.owned ? '' : 'grayscale opacity-60'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={cycleTimePeriod}
    >
      {/* High-resolution pixelated city NFT artwork */}
      <div 
        className={`
          w-44 h-44 rounded-lg overflow-hidden border-2 
          ${nft.owned ? 'border-amber-500 shadow-lg shadow-amber-200/50' : 'border-gray-400'}
          transition-all transform hover:scale-105 cursor-pointer
          ${nft.interactive ? 'hover:ring-2 hover:ring-purple-400' : ''}
        `}
      >
        {/* Sky background */}
        <div className={`w-full h-full ${getSkyColor(timeState)}`}>
          {/* Pixel grid */}
          <div className="w-full h-full grid grid-cols-32 grid-rows-32">
            {cityGrid.map((cell, i) => (
              <div 
                key={i} 
                className={`
                  ${cell.isSky && !cell.hasCloud && !cell.hasRain && !cell.hasSnow && !cell.hasFog ? 'bg-transparent' : ''}
                  ${cell.isGround ? getSpecialColor('ground', timeState) : ''}
                  ${cell.isBuilding && !cell.isLandmark && !cell.isModernBuilding && !cell.isHistoricalBuilding && 
                    !cell.isFuturisticBuilding && !cell.isArtDecoBuilding ? 
                      getBuildingColor('default', timeState) : ''}
                  ${cell.isLandmark ? getBuildingColor('landmark', timeState) : ''}
                  ${cell.isModernBuilding ? getBuildingColor('modern', timeState) : ''}
                  ${cell.isHistoricalBuilding ? getBuildingColor('historical', timeState) : ''}
                  ${cell.isFuturisticBuilding ? getBuildingColor('futuristic', timeState) : ''}
                  ${cell.isArtDecoBuilding ? getBuildingColor('artDeco', timeState) : ''}
                  ${cell.hasWindow ? 'relative' : ''}
                  ${cell.hasCloud ? getSpecialColor('cloud', timeState) : ''}
                  ${cell.hasRain ? getSpecialColor('rain', timeState) : ''}
                  ${cell.hasSnow ? getSpecialColor('snow', timeState) : ''}
                  ${cell.hasFog ? getSpecialColor('fog', timeState) : ''}
                  ${cell.hasBridge ? getSpecialColor('bridge', timeState) : ''}
                  ${cell.hasFountain ? getSpecialColor('fountain', timeState) : ''}
                  ${cell.hasRiver ? getSpecialColor('river', timeState) : ''}
                  ${cell.hasPalm ? getSpecialColor('palm', timeState) : ''}
                  ${cell.hasSnowCap ? getSpecialColor('snowCap', timeState) : ''}
                  ${cell.isInteractiveElement ? getAnimationClass(timeState) : ''}
                  ${nft.interactive && cell.isInteractiveElement ? 'animate-duration-[1500ms]' : ''}
                `}
              >
                {/* Add window lights */}
                {cell.hasWindow && (
                  <div className={`absolute inset-[25%] ${getWindowColor(timeState)}`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* City name badge */}
        <div className="absolute bottom-1 left-1 right-1 text-[9px] leading-tight font-mono bg-black/70 text-white px-1 rounded truncate">
          {nft.city}
        </div>
        
        {/* Time of day indicator when interactive */}
        {nft.interactive && isHovered && (
          <div className="absolute top-1 right-1 text-[8px] leading-tight font-mono bg-purple-900/80 text-white px-1 py-0.5 rounded-sm">
            <Clock className="h-2.5 w-2.5 inline-block mr-0.5" /> 
            {timeState.charAt(0).toUpperCase() + timeState.slice(1)}
          </div>
        )}
        
        {/* Weather display */}
        <div className="absolute top-1 left-1 text-[8px] leading-tight font-mono bg-black/60 text-white px-1 rounded">
          {nft.weather}
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
      
      {/* City Explorer Section */}
      <div className="mt-12">
        <div className="bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-950 dark:to-blue-950 rounded-xl p-6 border border-indigo-200 dark:border-indigo-900">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Book className="h-6 w-6 mr-3 text-indigo-600 dark:text-indigo-400" />
            <span>BlockReceipt City Explorer</span>
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl mb-6">
            Each BlockReceipt NFT showcases a unique cityscape from around the world, rendered in beautiful ultra-detailed pixel art. 
            Discover iconic skylines from all continents with 1000-pixel resolution and interactive time-of-day effects.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Interactive Cities Feature */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-purple-100 dark:border-purple-900">
              <h3 className="font-medium text-lg mb-3 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-500" /> 
                <span>Interactive Cityscapes</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Special interactive NFTs change appearance based on time of day. Click on any city with the ⚡ symbol 
                to cycle through dawn, day, sunset, night and more unique lighting conditions.
              </p>
              <div className="flex justify-center mb-2">
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">30% of Collection</Badge>
              </div>
            </div>
            
            {/* Time of Day Features */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-blue-100 dark:border-blue-900">
              <h3 className="font-medium text-lg mb-3 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" /> 
                <span>Dynamic Lighting</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Each city is captured at different times of day - from sunrise to neon-lit night. 
                The lighting, mood, and animation changes to create a unique cityscape experience.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-2">
                <Badge className="bg-orange-100 text-orange-800 border-orange-200">Dawn</Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">Day</Badge>
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">Sunset</Badge>
                <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">Night</Badge>
                <Badge className="bg-pink-100 text-pink-800 border-pink-200">Neon</Badge>
              </div>
            </div>
            
            {/* World Cities Showcase */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-amber-100 dark:border-amber-900">
              <h3 className="font-medium text-lg mb-3 flex items-center">
                <Star className="h-5 w-5 mr-2 text-amber-500" /> 
                <span>Global Landmarks</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Collect cities with iconic landmarks from every continent. From towering skyscrapers to 
                historic monuments, each NFT captures the unique architecture and atmosphere of world-famous cities.
              </p>
              <div className="flex justify-center mb-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Trophy className="h-3.5 w-3.5 mr-1.5" /> View Collection Map
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
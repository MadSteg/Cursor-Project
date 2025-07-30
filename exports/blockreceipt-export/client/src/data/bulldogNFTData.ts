import { NFT } from '../types/nft';

// Create a mapping of bulldog traits based on the filename pattern
const getBulldogTraits = (filename: string) => {
  // Extract traits based on filename patterns
  if (filename.includes('3.16.35')) {
    return [
      { trait_type: 'Accessory', value: 'Monocle' },
      { trait_type: 'Hat', value: 'Top Hat' },
      { trait_type: 'Personality', value: 'Fancy' }
    ];
  } else if (filename.includes('3.16.40')) {
    return [
      { trait_type: 'Accessory', value: 'Tie' },
      { trait_type: 'Clothing', value: 'Casual' },
      { trait_type: 'Personality', value: 'Professional' }
    ];
  } else if (filename.includes('3.17.22')) {
    return [
      { trait_type: 'Hat', value: 'Police Cap' },
      { trait_type: 'Clothing', value: 'Uniform' },
      { trait_type: 'Personality', value: 'Authoritative' }
    ];
  } else if (filename.includes('3.17.28')) {
    return [
      { trait_type: 'Accessory', value: 'Beer' },
      { trait_type: 'Clothing', value: 'Casual' },
      { trait_type: 'Personality', value: 'Social' }
    ];
  } else if (filename.includes('3.18.02')) {
    return [
      { trait_type: 'Hat', value: 'Baseball Cap' },
      { trait_type: 'Clothing', value: 'Team Jersey' },
      { trait_type: 'Personality', value: 'Athletic' }
    ];
  } else if (filename.includes('3.18.08')) {
    return [
      { trait_type: 'Hat', value: 'Plaid Hat' },
      { trait_type: 'Clothing', value: 'Plaid Shirt' },
      { trait_type: 'Personality', value: 'Outdoorsy' }
    ];
  } else if (filename.includes('3.19.04')) {
    return [
      { trait_type: 'Accessory', value: 'Bow Tie' },
      { trait_type: 'Clothing', value: 'Formal' },
      { trait_type: 'Personality', value: 'Dapper' }
    ];
  } else if (filename.includes('3.20.09')) {
    return [
      { trait_type: 'Accessory', value: 'Sunglasses' },
      { trait_type: 'Clothing', value: 'Tourist Outfit' },
      { trait_type: 'Personality', value: 'Adventurous' }
    ];
  } else if (filename.includes('3.21.14')) {
    return [
      { trait_type: 'Accessory', value: 'Gold Chain' },
      { trait_type: 'Clothing', value: 'Italian Suit' },
      { trait_type: 'Personality', value: 'Powerful' }
    ];
  } else if (filename.includes('3.21.20')) {
    return [
      { trait_type: 'Accessory', value: 'Scarf' },
      { trait_type: 'Hat', value: 'Beret' },
      { trait_type: 'Personality', value: 'Artistic' }
    ];
  } else if (filename.includes('3.22.12')) {
    return [
      { trait_type: 'Accessory', value: 'Gold Chain' },
      { trait_type: 'Hat', value: 'Black Cap' },
      { trait_type: 'Personality', value: 'Cool' }
    ];
  } else if (filename.includes('3.22.18')) {
    return [
      { trait_type: 'Accessory', value: 'Sunglasses' },
      { trait_type: 'Hat', value: 'Safari Hat' },
      { trait_type: 'Personality', value: 'Explorer' }
    ];
  } else if (filename.includes('3.23.00')) {
    return [
      { trait_type: 'Accessory', value: 'Cigarette' },
      { trait_type: 'Hat', value: 'Green Cap' },
      { trait_type: 'Personality', value: 'Rebellious' }
    ];
  } else if (filename.includes('3.23.22')) {
    return [
      { trait_type: 'Accessory', value: 'Crown' },
      { trait_type: 'Clothing', value: 'Royal Garments' },
      { trait_type: 'Personality', value: 'Majestic' }
    ];
  }
  
  // Default traits for other images
  return [
    { trait_type: 'Style', value: 'Classic Bulldog' },
    { trait_type: 'Personality', value: 'Charismatic' }
  ];
};

// Get rarity based on some pattern in filename
const getRarityFromFilename = (filename: string): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' => {
  // Some logic to determine rarity based on filename
  if (filename.includes('3.23.22')) {
    return 'legendary'; // Crown bulldog is legendary
  } else if (filename.includes('3.22.12') || filename.includes('3.21.14')) {
    return 'epic'; // Rapper and Godfather are epic
  } else if (filename.includes('3.17.22') || filename.includes('3.20.09') || filename.includes('3.19.04')) {
    return 'rare'; // Police, Tourist, and Bowtie are rare
  } else if (filename.includes('3.18.08') || filename.includes('3.21.20') || filename.includes('3.22.18') || filename.includes('3.23.00')) {
    return 'uncommon'; // Several special ones are uncommon
  }
  return 'common'; // Default is common
};

// Get descriptive name for each bulldog based on traits
const getNameFromFilename = (filename: string): string => {
  if (filename.includes('3.16.35')) return 'Fancy Bulldog';
  if (filename.includes('3.16.40')) return 'Business Bulldog';
  if (filename.includes('3.17.22')) return 'Officer Bulldog';
  if (filename.includes('3.17.28')) return 'Social Bulldog';
  if (filename.includes('3.18.02')) return 'Baseball Bulldog';
  if (filename.includes('3.18.08')) return 'Outdoor Bulldog';
  if (filename.includes('3.19.04')) return 'Dapper Bulldog';
  if (filename.includes('3.20.09')) return 'Tourist Bulldog';
  if (filename.includes('3.21.14')) return 'Godfather Bulldog';
  if (filename.includes('3.21.20')) return 'Artistic Bulldog';
  if (filename.includes('3.22.12')) return 'Rapper Bulldog';
  if (filename.includes('3.22.18')) return 'Explorer Bulldog';
  if (filename.includes('3.23.00')) return 'Rebel Bulldog';
  if (filename.includes('3.23.22')) return 'King Bulldog';
  
  // Default to a generic name
  return 'Crypto Bulldog';
};

// Generate the NFT metadata for all bulldogs
export const generateBulldogNFTs = (filenames: string[]): NFT[] => {
  return filenames.map((filename, index) => {
    const rarity = getRarityFromFilename(filename);
    const name = getNameFromFilename(filename);
    const traits = getBulldogTraits(filename);
    
    // Create a placeholder image path that won't actually be used
    // This is just to satisfy the type system
    const imagePath = `/bulldogs/${filename}`;
    
    // For demonstration purposes, we'll use specific color backgrounds based on rarity
    // In a production environment, these would be actual NFT images
    const colorMap = {
      legendary: '#FFD700', // Gold for legendary
      epic: '#9932CC',      // Purple for epic
      rare: '#4169E1',      // Blue for rare
      uncommon: '#2E8B57',  // Green for uncommon
      common: '#777777'     // Gray for common
    };
    
    return {
      id: `bulldog-${index}`,
      name,
      description: `A unique ${rarity} BlockReceipt bulldog NFT with special traits.`,
      image: `/nft-bulldogs/${filename}`,
      rarity,
      attributes: traits
    };
  });
};
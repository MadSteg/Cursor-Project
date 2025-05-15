/**
 * NFT Art Selector Module
 * 
 * This module provides utilities for selecting NFT art options based on receipt tags
 * and purchase information.
 */

interface NFTOption {
  id: string;
  name: string;
  image: string;
  preview: string;
  description: string;
  rarity: string;
  tags: string[];
}

// Define receipt tiers
type ReceiptTier = 'BASIC' | 'STANDARD' | 'PREMIUM' | 'LUXURY';

// Placeholder NFT collection based on receipt tags
const nftCollection: { [key: string]: NFTOption[] } = {
  food: [
    {
      id: 'food-1',
      name: 'Culinary Excellence',
      image: '/nft-art/food-1.png',
      preview: '/nft-art/food-1-preview.png',
      description: 'A celebration of gastronomic delight',
      rarity: 'common',
      tags: ['food', 'restaurant', 'dining']
    },
    {
      id: 'food-2',
      name: 'Gourmet Memories',
      image: '/nft-art/food-2.png',
      preview: '/nft-art/food-2-preview.png',
      description: 'Preserving your fine dining experiences',
      rarity: 'uncommon',
      tags: ['food', 'gourmet', 'cuisine']
    }
  ],
  coffee: [
    {
      id: 'coffee-1',
      name: 'Café Collection',
      image: '/nft-art/coffee-1.png',
      preview: '/nft-art/coffee-1-preview.png',
      description: 'For the coffee connoisseur in you',
      rarity: 'common',
      tags: ['coffee', 'cafe', 'drink']
    },
    {
      id: 'coffee-2',
      name: 'Caffeine Chronicles',
      image: '/nft-art/coffee-2.png',
      preview: '/nft-art/coffee-2-preview.png',
      description: 'Capturing your daily caffeine ritual',
      rarity: 'uncommon',
      tags: ['coffee', 'espresso', 'beverage']
    }
  ],
  retail: [
    {
      id: 'retail-1',
      name: 'Retail Therapy',
      image: '/nft-art/retail-1.png',
      preview: '/nft-art/retail-1-preview.png',
      description: 'Commemorating your shopping adventures',
      rarity: 'common',
      tags: ['shopping', 'retail', 'store']
    },
    {
      id: 'retail-2',
      name: 'Fashion Forward',
      image: '/nft-art/retail-2.png',
      preview: '/nft-art/retail-2-preview.png',
      description: 'Style meets blockchain',
      rarity: 'uncommon',
      tags: ['fashion', 'clothing', 'apparel']
    }
  ],
  grocery: [
    {
      id: 'grocery-1',
      name: 'Pantry Memories',
      image: '/nft-art/grocery-1.png',
      preview: '/nft-art/grocery-1-preview.png',
      description: 'Commemorating your grocery hauls',
      rarity: 'common',
      tags: ['grocery', 'food', 'market']
    },
    {
      id: 'grocery-2',
      name: 'Fresh Finds',
      image: '/nft-art/grocery-2.png',
      preview: '/nft-art/grocery-2-preview.png',
      description: 'Celebrating farm-to-table moments',
      rarity: 'uncommon',
      tags: ['produce', 'organic', 'market']
    }
  ],
  tech: [
    {
      id: 'tech-1',
      name: 'Digital Explorer',
      image: '/nft-art/tech-1.png',
      preview: '/nft-art/tech-1-preview.png',
      description: 'Commemorating your tech investments',
      rarity: 'common',
      tags: ['technology', 'electronics', 'digital']
    },
    {
      id: 'tech-2',
      name: 'Innovation Collection',
      image: '/nft-art/tech-2.png',
      preview: '/nft-art/tech-2-preview.png',
      description: 'Celebrating cutting-edge purchases',
      rarity: 'uncommon',
      tags: ['gadget', 'innovation', 'electronics']
    }
  ],
  entertainment: [
    {
      id: 'entertainment-1',
      name: 'Entertainment Pass',
      image: '/nft-art/entertainment-1.png',
      preview: '/nft-art/entertainment-1-preview.png',
      description: 'Commemorating your leisure experiences',
      rarity: 'common',
      tags: ['movies', 'entertainment', 'leisure']
    },
    {
      id: 'entertainment-2',
      name: 'Blockbuster Memories',
      image: '/nft-art/entertainment-2.png',
      preview: '/nft-art/entertainment-2-preview.png',
      description: 'Your cinematic adventures preserved',
      rarity: 'uncommon',
      tags: ['cinema', 'movies', 'film']
    }
  ],
  travel: [
    {
      id: 'travel-1',
      name: 'Journey Chronicle',
      image: '/nft-art/travel-1.png',
      preview: '/nft-art/travel-1-preview.png',
      description: 'Commemorating your voyages',
      rarity: 'common',
      tags: ['travel', 'journey', 'transportation']
    },
    {
      id: 'travel-2',
      name: 'Wanderlust Collection',
      image: '/nft-art/travel-2.png',
      preview: '/nft-art/travel-2-preview.png',
      description: 'Your adventures immortalized on the blockchain',
      rarity: 'uncommon',
      tags: ['adventure', 'exploration', 'travel']
    }
  ],
  random: [
    {
      id: 'random-1',
      name: 'Quantum Receipt',
      image: '/nft-art/random-1.png',
      preview: '/nft-art/random-1-preview.png',
      description: 'A unique digital artifact of your transaction',
      rarity: 'common',
      tags: ['random', 'abstract', 'digital']
    },
    {
      id: 'random-2',
      name: 'Blockchain Memory',
      image: '/nft-art/random-2.png',
      preview: '/nft-art/random-2-preview.png',
      description: 'Preserving transactions in the digital realm',
      rarity: 'uncommon',
      tags: ['memory', 'digital', 'abstract']
    }
  ],
};

// Special rare NFTs for higher tiers
const rareTierNFTs: { [key in ReceiptTier]?: NFTOption[] } = {
  PREMIUM: [
    {
      id: 'premium-1',
      name: 'Premium Nexus',
      image: '/nft-art/premium-1.png',
      preview: '/nft-art/premium-1-preview.png',
      description: 'A distinguished digital asset for premium purchases',
      rarity: 'rare',
      tags: ['premium', 'exclusive', 'limited']
    }
  ],
  LUXURY: [
    {
      id: 'luxury-1',
      name: 'Luxury Pinnacle',
      image: '/nft-art/luxury-1.png',
      preview: '/nft-art/luxury-1-preview.png',
      description: 'The apex of digital receipt collection',
      rarity: 'legendary',
      tags: ['luxury', 'elite', 'masterpiece']
    }
  ]
};

// Category keywords for tag extraction
const categoryKeywords: { [key: string]: string[] } = {
  food: ['restaurant', 'cafe', 'diner', 'bistro', 'grill', 'eatery', 'kitchen', 'food', 'meal', 'dinner', 'lunch', 'breakfast', 'brunch'],
  coffee: ['coffee', 'espresso', 'latte', 'mocha', 'cappuccino', 'cafe', 'starbucks', 'peet', 'dunkin'],
  retail: ['store', 'shop', 'boutique', 'mall', 'outlet', 'market', 'retail', 'buy', 'purchase', 'clothing', 'apparel', 'fashion'],
  grocery: ['grocery', 'supermarket', 'market', 'foods', 'produce', 'organic', 'farm', 'vegetable', 'fruit', 'meat', 'dairy'],
  tech: ['electronics', 'technology', 'computer', 'laptop', 'phone', 'device', 'gadget', 'digital', 'software', 'hardware'],
  entertainment: ['cinema', 'movie', 'theater', 'ticket', 'show', 'concert', 'performance', 'entertainment', 'film', 'amusement'],
  travel: ['hotel', 'motel', 'inn', 'lodge', 'resort', 'vacation', 'travel', 'airline', 'flight', 'booking', 'reservation']
};

/**
 * Gets NFT art options based on receipt tags
 * 
 * @param tags - Array of tags extracted from the receipt
 * @param tier - The receipt tier (BASIC, STANDARD, PREMIUM, LUXURY)
 * @param count - Number of options to return (default: 6)
 * @returns Array of NFT art options
 */
export function getNFTArtByTags(
  tags: string[],
  tier: string = 'BASIC',
  count: number = 6
): NFTOption[] {
  // Normalize tier
  const normalizedTier = tier.toUpperCase() as ReceiptTier;
  
  // Initialize result array
  let options: NFTOption[] = [];
  
  // Add rare NFTs for premium/luxury tiers
  if (normalizedTier === 'PREMIUM' || normalizedTier === 'LUXURY') {
    const rareTierOptions = rareTierNFTs[normalizedTier] || [];
    options = [...rareTierOptions];
  }
  
  // Add options based on tags
  for (const tag of tags) {
    // Find all matching categories
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.includes(tag.toLowerCase()) && nftCollection[category]) {
        options = [...options, ...nftCollection[category]];
      }
    }
    
    // Direct category match
    if (nftCollection[tag.toLowerCase()]) {
      options = [...options, ...nftCollection[tag.toLowerCase()]];
    }
  }
  
  // If we don't have enough options, add random ones
  if (options.length < count) {
    options = [...options, ...nftCollection.random];
  }
  
  // Remove duplicates (by id)
  const uniqueOptions = options.filter((option, index, self) =>
    index === self.findIndex((o) => o.id === option.id)
  );
  
  // Shuffle options
  const shuffled = [...uniqueOptions].sort(() => 0.5 - Math.random());
  
  // Return requested number of options
  return shuffled.slice(0, count);
}

/**
 * Extract tags from a receipt based on merchant name and items
 * 
 * @param merchantName - Name of the merchant
 * @param items - Array of receipt items
 * @returns Array of extracted tags
 */
export function extractTagsFromReceipt(
  merchantName: string,
  items: { name: string; price: number }[]
): string[] {
  // Initialize a Set to store unique tags
  const tags = new Set<string>();
  
  // Extract tags from merchant name
  if (merchantName) {
    const normalizedMerchantName = merchantName.toLowerCase();
    
    // Check for category matches in merchant name
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      for (const keyword of keywords) {
        if (normalizedMerchantName.includes(keyword)) {
          tags.add(category);
          break;
        }
      }
    }
  }
  
  // Extract tags from items
  if (items && items.length > 0) {
    // Check first 5 items for category matches
    const itemsToCheck = items.slice(0, 5);
    
    for (const item of itemsToCheck) {
      const normalizedItemName = item.name.toLowerCase();
      
      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        for (const keyword of keywords) {
          if (normalizedItemName.includes(keyword)) {
            tags.add(category);
            break;
          }
        }
      }
    }
  }
  
  // Always include random as a fallback
  tags.add('random');
  
  return Array.from(tags);
}

/**
 * Generate NFT metadata for minting
 * 
 * @param receiptData - The receipt data
 * @param selectedArt - The selected NFT art
 * @returns NFT metadata object
 */
export function generateNFTMetadata(
  receiptData: any,
  selectedArt: NFTOption
): object {
  return {
    name: `${selectedArt.name}: ${receiptData.merchantName}`,
    description: `BlockReceipt from ${receiptData.merchantName} on ${receiptData.date}. ${selectedArt.description}`,
    external_url: `https://blockreceipt.ai/receipt/${receiptData.id}`,
    image: selectedArt.image,
    attributes: [
      {
        trait_type: 'Merchant',
        value: receiptData.merchantName
      },
      {
        trait_type: 'Date',
        value: receiptData.date
      },
      {
        trait_type: 'Total Amount',
        value: receiptData.total
      },
      {
        trait_type: 'Receipt Tier',
        value: receiptData.tier?.id || 'BASIC'
      },
      {
        display_type: 'boost_number',
        trait_type: 'Warranty Boost',
        value: receiptData.tier?.id === 'LUXURY' ? 12 : 
               receiptData.tier?.id === 'PREMIUM' ? 6 : 
               receiptData.tier?.id === 'STANDARD' ? 3 : 1
      },
      {
        trait_type: 'NFT Art',
        value: selectedArt.name
      },
      {
        trait_type: 'Rarity',
        value: selectedArt.rarity
      }
    ]
  };
}
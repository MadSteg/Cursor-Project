/**
 * NFT Art Selector Module
 * 
 * This module provides utilities for selecting NFT art options based on receipt tags
 * and purchase information.
 */

import fs from 'fs';
import path from 'path';

// Define the pool of NFT art organized by tags
// In production, this would be stored in a database or retrieved from a CDN
const nftArtPool: Record<string, string[]> = {
  food: [
    '/nft-art/food/burger1.png',
    '/nft-art/food/pizza2.png',
    '/nft-art/food/salad3.png',
    '/nft-art/food/cupcake4.png',
    '/nft-art/food/sushi5.png',
  ],
  grocery: [
    '/nft-art/grocery/cart1.png',
    '/nft-art/grocery/produce2.png',
    '/nft-art/grocery/basket3.png',
    '/nft-art/grocery/market4.png',
  ],
  fashion: [
    '/nft-art/fashion/shirt1.png',
    '/nft-art/fashion/shoes2.png',
    '/nft-art/fashion/handbag3.png',
    '/nft-art/fashion/jewelry4.png',
  ],
  technology: [
    '/nft-art/tech/laptop1.png',
    '/nft-art/tech/smartphone2.png',
    '/nft-art/tech/headphones3.png',
    '/nft-art/tech/gadget4.png',
  ],
  health: [
    '/nft-art/health/vitamins1.png',
    '/nft-art/health/medicine2.png',
    '/nft-art/health/firstaid3.png',
  ],
  beauty: [
    '/nft-art/beauty/makeup1.png',
    '/nft-art/beauty/skincare2.png',
    '/nft-art/beauty/haircare3.png',
  ],
  home: [
    '/nft-art/home/furniture1.png',
    '/nft-art/home/decor2.png',
    '/nft-art/home/kitchen3.png',
    '/nft-art/home/bath4.png',
  ],
  entertainment: [
    '/nft-art/entertainment/movie1.png',
    '/nft-art/entertainment/music2.png',
    '/nft-art/entertainment/gaming3.png',
  ],
  random: [
    '/nft-art/random/geometric1.png',
    '/nft-art/random/abstract2.png',
    '/nft-art/random/pattern3.png',
    '/nft-art/random/pixel4.png',
    '/nft-art/random/blocky5.png',
    '/nft-art/random/diamond6.png',
    '/nft-art/random/spiral7.png',
    '/nft-art/random/waves8.png',
  ],
};

// Define the tiers and styles associated with them
const tierStyles: Record<string, string[]> = {
  BASIC: ['simple', 'clean', 'minimal'],
  STANDARD: ['colorful', 'vibrant', 'detailed'],
  PREMIUM: ['premium', 'luxury', 'elegant', 'sophisticated'],
  LUXURY: ['exclusive', 'artsy', 'masterpiece', 'gem'],
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
  tags: string[] = [], 
  tier: string = 'BASIC',
  count: number = 6
): Array<{
  id: string;
  name: string;
  image: string;
  preview: string;
  description: string;
}> {
  // Ensure we have lowercase tags for matching
  const normalizedTags = tags.map(tag => tag.toLowerCase());
  
  // Collect all matching images based on tags
  const matches = new Set<string>();
  
  // Add matches from each tag
  normalizedTags.forEach(tag => {
    if (nftArtPool[tag]) {
      nftArtPool[tag].forEach(img => matches.add(img));
    }
  });
  
  // If we don't have enough matches, add some random options
  if (matches.size < count) {
    const randomCount = count - matches.size;
    const randomPool = nftArtPool.random;
    
    // Select random items without duplicates
    const randomSelections = [...randomPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, randomCount);
    
    randomSelections.forEach(img => matches.add(img));
  }
  
  // Get the tier style words for descriptions
  const styleWords = tierStyles[tier] || tierStyles.BASIC;
  
  // Convert to the expected format
  const result = Array.from(matches).slice(0, count).map((image, index) => {
    // Extract a name from the path
    const baseName = path.basename(image, path.extname(image));
    const nameWithoutNumber = baseName.replace(/\d+$/, ''); // Remove trailing numbers
    const formattedName = nameWithoutNumber
      .split(/[_-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Pick a random style word for the description
    const styleWord = styleWords[Math.floor(Math.random() * styleWords.length)];
    
    return {
      id: `nft-${index + 1}`,
      name: `${formattedName} BlockReceipt`,
      image: image,
      preview: image, // In a real implementation, this might be a different sized version
      description: `A ${styleWord} digital receipt collectible`,
    };
  });
  
  // Shuffle the results for variety
  return result.sort(() => Math.random() - 0.5);
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
  items: Array<{ name: string; price: number }>
): string[] {
  const tags = new Set<string>();
  
  // Check merchant name for specific types
  const merchantLower = merchantName.toLowerCase();
  
  if (merchantLower.includes('restaurant') || 
      merchantLower.includes('cafe') || 
      merchantLower.includes('diner')) {
    tags.add('food');
  }
  
  if (merchantLower.includes('market') || 
      merchantLower.includes('grocery') || 
      merchantLower.includes('store')) {
    tags.add('grocery');
  }
  
  if (merchantLower.includes('tech') || 
      merchantLower.includes('electronics')) {
    tags.add('technology');
  }
  
  if (merchantLower.includes('fashion') || 
      merchantLower.includes('clothing') || 
      merchantLower.includes('apparel')) {
    tags.add('fashion');
  }
  
  // Analyze items for keywords
  const allItemText = items.map(item => item.name.toLowerCase()).join(' ');
  
  const keywordMap: Record<string, string[]> = {
    food: ['food', 'meal', 'burger', 'pizza', 'salad', 'sandwich', 'sushi'],
    grocery: ['grocery', 'produce', 'vegetable', 'fruit', 'dairy', 'meat'],
    technology: ['computer', 'phone', 'laptop', 'tablet', 'headphone', 'charger', 'cable', 'tech'],
    fashion: ['shirt', 'pants', 'dress', 'jacket', 'shoe', 'handbag', 'accessory'],
    health: ['medicine', 'vitamin', 'supplement', 'bandage', 'first aid'],
    beauty: ['makeup', 'skincare', 'lotion', 'shampoo', 'conditioner', 'soap'],
    home: ['furniture', 'decor', 'kitchen', 'bathroom', 'bedroom', 'living room'],
    entertainment: ['movie', 'music', 'game', 'book', 'toy']
  };
  
  // Check for keywords in items
  Object.entries(keywordMap).forEach(([category, keywords]) => {
    if (keywords.some(keyword => allItemText.includes(keyword))) {
      tags.add(category);
    }
  });
  
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
  selectedArt: any
) {
  const metadata = {
    name: `${receiptData.merchantName} BlockReceipt`,
    description: `Purchase from ${receiptData.merchantName} on ${receiptData.date}. ${selectedArt.description}`,
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
        trait_type: 'Total',
        value: `$${receiptData.total.toFixed(2)}`
      },
      {
        trait_type: 'Tier',
        value: receiptData.tier?.id || 'BASIC'
      },
      {
        trait_type: 'Style',
        value: selectedArt.name.split(' ')[0]
      }
    ]
  };
  
  return metadata;
}
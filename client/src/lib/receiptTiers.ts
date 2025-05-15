/**
 * Receipt Tier Definitions
 * 
 * Utility functions for working with receipt tiers and categories.
 */

// Define the possible tiers for receipt NFTs
export type ReceiptTier = 'STANDARD' | 'PREMIUM' | 'LUXURY' | 'ULTRA';

/**
 * Determines the receipt tier based on the total amount
 * 
 * @param total - The total amount from the receipt
 * @returns The tier category (STANDARD, PREMIUM, LUXURY, or ULTRA)
 */
export function determineReceiptTier(total: number): ReceiptTier {
  if (total >= 500) {
    return 'ULTRA';
  } else if (total >= 200) {
    return 'LUXURY';
  } else if (total >= 50) {
    return 'PREMIUM';
  } else {
    return 'STANDARD';
  }
}

/**
 * Determines the eligible NFT categories based on receipt data
 * 
 * @param merchantName - The merchant name from receipt
 * @param total - The total amount
 * @param items - The line items from the receipt
 * @returns Array of category tags
 */
export function determineReceiptCategories(
  merchantName: string,
  total: number,
  items: any[]
): string[] {
  const categories = new Set<string>();
  
  // Check merchant name for categories
  const merchantNameLower = merchantName.toLowerCase();
  
  if (merchantNameLower.includes('restaurant') || 
      merchantNameLower.includes('cafe') || 
      merchantNameLower.includes('bar') ||
      merchantNameLower.includes('grill')) {
    categories.add('food');
    categories.add('dining');
  }
  
  if (merchantNameLower.includes('market') || 
      merchantNameLower.includes('grocery') || 
      merchantNameLower.includes('supermarket')) {
    categories.add('grocery');
  }
  
  if (merchantNameLower.includes('electronics') || 
      merchantNameLower.includes('tech') || 
      merchantNameLower.includes('digital') ||
      merchantNameLower.includes('computer')) {
    categories.add('electronics');
    categories.add('tech');
  }
  
  if (merchantNameLower.includes('apparel') || 
      merchantNameLower.includes('clothing') || 
      merchantNameLower.includes('fashion') ||
      merchantNameLower.includes('wear')) {
    categories.add('fashion');
    categories.add('clothing');
  }
  
  // Check based on total amount
  if (total >= 500) {
    categories.add('luxury');
  }
  
  // Add some default categories if none were determined
  if (categories.size === 0) {
    categories.add('receipt');
    categories.add('general');
  }
  
  return Array.from(categories);
}

export default {
  determineReceiptTier,
  determineReceiptCategories
};
/**
 * Receipt OCR and Processing Utilities
 * 
 * Functions for processing receipt data, determining NFT tiers, 
 * and other receipt-related helper functions.
 */

import { ReceiptTier, ReceiptData, ReceiptItem } from "@/types";

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
  items: ReceiptItem[]
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

/**
 * Processes a receipt image and extracts data
 * This is a mock implementation for development purposes
 * 
 * @param imageData - Base64 encoded image data
 * @returns ReceiptData object with extracted information
 */
export async function processReceiptImage(imageData: string): Promise<ReceiptData> {
  // This is a mock implementation that would normally call the server API
  // For development, we return a sample receipt
  
  // In production, this would call an API endpoint:
  // const response = await fetch('/api/ocr/process', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ image: imageData })
  // });
  // return await response.json();
  
  // Mock data for development
  return {
    merchantName: "Acme Supermarket",
    date: new Date().toISOString().split('T')[0],
    items: [
      { name: "Apples", price: 4.99, quantity: 1 },
      { name: "Bread", price: 3.49, quantity: 1 },
      { name: "Milk", price: 2.99, quantity: 2 }
    ],
    subtotal: 14.46,
    tax: 1.45,
    total: 15.91,
    category: "grocery",
    nftGift: {
      status: "eligible",
      message: "You're eligible for an NFT reward!",
      eligible: true
    }
  };
}

export default {
  determineReceiptTier,
  determineReceiptCategories,
  processReceiptImage
};
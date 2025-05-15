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
export function determineReceiptTier(total: number | undefined): ReceiptTier {
  const amount = total || 0;
  if (amount >= 500) {
    return 'ULTRA';
  } else if (amount >= 200) {
    return 'LUXURY';
  } else if (amount >= 50) {
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
  total: number | undefined,
  items: ReceiptItem[]
): string[] {
  const amount = total || 0;
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
  if (amount >= 500) {
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
 * 
 * @param imageData - File object or Base64 encoded image data
 * @returns ReceiptData object with extracted information
 */
export async function processReceiptImage(imageData: File | string): Promise<ReceiptData> {
  try {
    let base64Data: string;
    
    // Handle File objects by converting to base64
    if (imageData instanceof File) {
      const reader = new FileReader();
      base64Data = await new Promise((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          // Extract the base64 part if it's a data URL
          const base64 = result.includes('base64,') 
            ? result.split('base64,')[1] 
            : result;
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageData);
      });
    } else {
      // If it's already a string, use it directly
      base64Data = imageData.includes('base64,') 
        ? imageData.split('base64,')[1] 
        : imageData;
    }
    
    // Call the server API
    const response = await fetch('/api/ocr/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Data })
    });
    
    if (!response.ok) {
      throw new Error(`OCR processing failed: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to process receipt');
    }
    
    // Extract the data from the response
    const extractedData = result.data;
    
    // Convert categories to proper format
    const categories = Array.isArray(extractedData.category) 
      ? extractedData.category 
      : extractedData.category ? [extractedData.category] : [];
    
    // Apply additional categories based on merchant name and items
    const additionalCategories = determineReceiptCategories(
      extractedData.merchantName || '',
      extractedData.total || 0,
      extractedData.items || []
    );
    
    // Return the formatted receipt data
    return {
      merchantName: extractedData.merchantName || "Unknown Merchant",
      date: extractedData.date || new Date().toISOString().split('T')[0],
      items: (extractedData.items || []).map((item: any) => ({
        name: item.name || "Unknown Item",
        price: typeof item.price === 'number' ? item.price : 0,
        quantity: typeof item.quantity === 'number' ? item.quantity : 1
      })),
      subtotal: extractedData.subtotal || 0,
      tax: extractedData.tax || 0,
      total: extractedData.total || 0,
      // Combine categories from both sources
      category: Array.from(new Set([...categories, ...additionalCategories])).join(','),
      nftGift: {
        status: "eligible",
        message: "You're eligible for an NFT reward!",
        eligible: true
      }
    };
  } catch (error) {
    console.error('Receipt processing error:', error);
    
    // If API fails, use fallback logic
    return {
      merchantName: "Unknown Merchant",
      date: new Date().toISOString().split('T')[0],
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      category: "general",
      nftGift: {
        status: "eligible",
        message: "You're eligible for an NFT reward!",
        eligible: true
      }
    };
  }
}

/**
 * Processes a receipt image in base64 format
 * 
 * @param base64Data - Base64 encoded image data (without the data:image prefix)
 * @returns ReceiptData object with extracted information
 */
export async function processReceiptBase64(base64Data: string): Promise<ReceiptData> {
  try {
    // In production, this would call an API endpoint
    const response = await fetch('/api/ocr/process-base64', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image: base64Data })
    });
    
    if (!response.ok) {
      throw new Error(`OCR processing failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error processing receipt base64:', error);
    
    // Fall back to mock data for development
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
}

export default {
  determineReceiptTier,
  determineReceiptCategories,
  processReceiptImage,
  processReceiptBase64
};
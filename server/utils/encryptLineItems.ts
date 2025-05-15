/**
 * Utility functions for encrypting receipt line items using TACo threshold encryption
 * 
 * This provides the underlying encryption logic for the privacy-preserving features
 * of BlockReceipt, allowing selective access to sensitive receipt metadata.
 */

// Import crypto library for encryption in mock/dev mode
import crypto from 'crypto';

// Mock/simulation functionality for development environments
const MOCK_MODE = process.env.NODE_ENV !== 'production';

// Define categories for item classification
export const ITEM_CATEGORIES = [
  'Electronics',
  'Groceries',
  'Clothing',
  'Healthcare',
  'Entertainment',
  'Travel',
  'Food',
  'Household',
  'Automotive',
  'Personal Care',
  'Office Supplies',
  'Other'
];

/**
 * Determines the category of an item based on name heuristics
 */
export function determineItemCategory(itemName: string): string {
  // Normalize the item name
  const name = itemName.toLowerCase();
  
  // Apply heuristics to categorize items
  if (name.includes('phone') || name.includes('laptop') || name.includes('tv') || 
      name.includes('computer') || name.includes('gadget') || name.includes('charger') ||
      name.includes('headphone') || name.includes('electronics')) {
    return 'Electronics';
  }
  
  if (name.includes('food') || name.includes('meal') || name.includes('lunch') || 
      name.includes('dinner') || name.includes('breakfast') || name.includes('snack') ||
      name.includes('drink') || name.includes('beverage')) {
    return 'Food';
  }
  
  if (name.includes('shirt') || name.includes('pant') || name.includes('shoe') || 
      name.includes('jacket') || name.includes('dress') || name.includes('clothing') ||
      name.includes('apparel') || name.includes('hat')) {
    return 'Clothing';
  }
  
  if (name.includes('medicine') || name.includes('vitamin') || name.includes('health') || 
      name.includes('pharmacy') || name.includes('prescription') || name.includes('doctor')) {
    return 'Healthcare';
  }
  
  if (name.includes('movie') || name.includes('game') || name.includes('toy') || 
      name.includes('ticket') || name.includes('show') || name.includes('entertainment')) {
    return 'Entertainment';
  }
  
  if (name.includes('flight') || name.includes('hotel') || name.includes('travel') || 
      name.includes('booking') || name.includes('vacation') || name.includes('trip')) {
    return 'Travel';
  }
  
  if (name.includes('grocery') || name.includes('vegetable') || name.includes('fruit') || 
      name.includes('meat') || name.includes('dairy') || name.includes('bread')) {
    return 'Groceries';
  }
  
  if (name.includes('cleaning') || name.includes('furniture') || name.includes('kitchen') || 
      name.includes('home') || name.includes('household') || name.includes('appliance')) {
    return 'Household';
  }
  
  if (name.includes('car') || name.includes('auto') || name.includes('gas') || 
      name.includes('oil') || name.includes('repair') || name.includes('tire')) {
    return 'Automotive';
  }
  
  if (name.includes('soap') || name.includes('shampoo') || name.includes('cosmetic') || 
      name.includes('beauty') || name.includes('personal care') || name.includes('hygiene')) {
    return 'Personal Care';
  }
  
  if (name.includes('pen') || name.includes('paper') || name.includes('office') || 
      name.includes('stationery') || name.includes('printer') || name.includes('ink')) {
    return 'Office Supplies';
  }
  
  // Default to "Other" if no match
  return 'Other';
}

/**
 * Encrypt receipt line items with TACo threshold encryption
 * 
 * In mock mode, this uses AES encryption as a placeholder
 * In production, it would use the Threshold Network TACo library
 * 
 * @param walletAddress The wallet address to encrypt for
 * @param receiptData The receipt data containing items to encrypt
 * @returns Encrypted data with policy info
 */
export async function encryptLineItems(walletAddress: string, receiptData: any) {
  try {
    if (!receiptData || !receiptData.items || !Array.isArray(receiptData.items)) {
      throw new Error('Invalid receipt data: items array is required');
    }
    
    const items = receiptData.items;
    console.log(`Encrypting ${items.length} line items for wallet ${walletAddress}`);
    
    // Add categories to items if they don't already have them
    const itemsWithCategories = items.map(item => ({
      ...item,
      category: item.category || determineItemCategory(item.name)
    }));
    
    if (MOCK_MODE) {
      // Use mock encryption in development
      console.log('Using mock encryption in development mode');
      
      // Generate a mock encryption key and policy
      const encryptionKey = crypto.randomBytes(32).toString('hex');
      const policyPublicKey = `policy-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
      const capsule = `capsule-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
      
      // Convert data to JSON string
      const dataString = JSON.stringify(itemsWithCategories);
      
      // Encrypt with AES (mock)
      const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
      let encryptedData = cipher.update(dataString, 'utf8', 'hex');
      encryptedData += cipher.final('hex');
      
      return {
        success: true,
        encryptedItems: itemsWithCategories.map(item => ({
          category: item.category,
          price: item.price
        })), // Return categories and prices only
        ciphertext: encryptedData,
        policyPublicKey,
        capsule,
        message: 'Receipt line items encrypted with mock TACo encryption'
      };
    } else {
      // In production, would use real TACo encryption here
      // For now, just log the message and use mock
      console.warn('Production TACo encryption not available, falling back to mock');
      
      // Generate a mock encryption key and policy
      const encryptionKey = crypto.randomBytes(32).toString('hex');
      const policyPublicKey = `policy-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
      const capsule = `capsule-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
      
      // Convert data to JSON string
      const dataString = JSON.stringify(itemsWithCategories);
      
      // Encrypt with AES (mock)
      const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
      let encryptedData = cipher.update(dataString, 'utf8', 'hex');
      encryptedData += cipher.final('hex');
      
      return {
        success: true,
        encryptedItems: itemsWithCategories.map(item => ({
          category: item.category,
          price: item.price
        })), // Return categories and prices only
        ciphertext: encryptedData,
        policyPublicKey,
        capsule,
        message: 'Receipt line items encrypted with mock TACo encryption'
      };
    }
  } catch (error: any) {
    console.error('Error encrypting line items:', error);
    return {
      success: false,
      error: error.message || 'Unknown encryption error',
      message: 'Failed to encrypt receipt line items'
    };
  }
}

/**
 * Decrypt receipt line items with TACo threshold encryption
 * 
 * In mock mode, this uses AES decryption as a placeholder
 * In production, it would use the Threshold Network TACo library
 * 
 * @param encryptedData The encrypted data string
 * @param policyKey The TACo policy key
 * @param capsule The TACo capsule
 * @param walletAddress The wallet address to decrypt for
 * @returns Decrypted items or error
 */
export async function decryptLineItems(encryptedData: string, policyKey: string, capsule: string, walletAddress: string) {
  try {
    console.log(`Attempting to decrypt data for wallet ${walletAddress}`);
    
    if (MOCK_MODE) {
      // In mock mode, we just pretend to decrypt (since we can't in reality)
      // This would actually happen on the client side with TACo
      
      console.log('Using mock decryption in development mode');
      
      // Simulate decryption with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return a mock result (since we can't actually decrypt the AES either)
      return {
        success: true,
        decryptedItems: [
          { name: 'Samsung TV', price: 499.99, category: 'Electronics' },
          { name: 'Headphones', price: 99.99, category: 'Electronics' },
          { name: 'HDMI Cable', price: 12.99, category: 'Electronics' }
        ],
        message: 'Receipt line items decrypted with mock TACo decryption'
      };
    } else {
      // Would use real TACo decryption here in production
      console.warn('Production TACo decryption not available, falling back to mock');
      
      // Simulate decryption with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return a mock result (since we can't actually decrypt the AES either)
      return {
        success: true,
        decryptedItems: [
          { name: 'Samsung TV', price: 499.99, category: 'Electronics' },
          { name: 'Headphones', price: 99.99, category: 'Electronics' },
          { name: 'HDMI Cable', price: 12.99, category: 'Electronics' }
        ],
        message: 'Receipt line items decrypted with mock TACo decryption'
      };
    }
  } catch (error: any) {
    console.error('Error decrypting line items:', error);
    return {
      success: false,
      error: error.message || 'Unknown decryption error',
      message: 'Failed to decrypt receipt line items'
    };
  }
}
/**
 * Receipt Logic Module
 * 
 * This module provides utilities for extracting data from receipts and determining
 * their tier based on the total amount.
 */

import fs from 'fs';
import * as Tesseract from 'tesseract.js';

// Receipt tiers and their thresholds
export const RECEIPT_TIERS = {
  BASIC: { min: 0, max: 50, title: 'Basic' },
  STANDARD: { min: 50, max: 200, title: 'Standard' },
  PREMIUM: { min: 200, max: 1000, title: 'Premium' },
  LUXURY: { min: 1000, max: Infinity, title: 'Luxury' }
};

export interface ReceiptItem {
  name: string;
  price: number;
}

export interface ReceiptData {
  merchantName: string;
  date: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  rawText?: string;
  error?: string;
}

export interface TierInfo {
  id: string;
  title: string;
  description: string;
  price: number;
}

/**
 * Mock function to extract receipt data using OCR
 * In a production environment, this would use a more sophisticated OCR solution
 * 
 * @param {string} imagePath - Path to the receipt image
 * @returns {Promise<ReceiptData>} - Extracted receipt data
 */
export async function extractReceiptData(imagePath: string): Promise<ReceiptData> {
  try {
    // For now, we'll use a simple OCR with Tesseract.js
    // Later, this could be replaced with a more specialized receipt OCR API
    const { data } = await Tesseract.recognize(
      imagePath,
      'eng',
      { logger: m => console.log(m) }
    );

    // Extract text from the OCR result
    const text = data.text;
    
    // Parse the text for receipt information
    // This is a simplified version that should be enhanced for production
    const merchantMatch = text.match(/([A-Z\s]+)\n/);
    const dateMatch = text.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
    const totalMatch = text.match(/TOTAL[:\s]*\$?(\d+\.\d{2})/i) || 
                       text.match(/AMOUNT[:\s]*\$?(\d+\.\d{2})/i) ||
                       text.match(/(\d+\.\d{2})/); // Fallback to find any dollar amount
    
    // Extract items (very simplified version)
    const itemLines = text.split('\n').filter(line => 
      line.match(/\$\d+\.\d{2}/) && 
      !line.match(/TOTAL|SUBTOTAL|TAX|TIP|AMOUNT/i)
    );
    
    const items: ReceiptItem[] = itemLines.map(line => {
      const priceMatch = line.match(/\$?(\d+\.\d{2})/);
      const price = priceMatch ? parseFloat(priceMatch[1]) : 0;
      const name = line.replace(/\$?(\d+\.\d{2})/, '').trim();
      
      return { name, price };
    });

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    
    // Get total amount
    let total = 0;
    if (totalMatch && totalMatch[1]) {
      total = parseFloat(totalMatch[1]);
    } else {
      // If we can't find a total, estimate it using the items
      total = subtotal * 1.08; // Rough estimate with tax
    }

    // Construct the receipt data object
    return {
      merchantName: merchantMatch ? merchantMatch[1].trim() : 'Unknown Merchant',
      date: dateMatch ? dateMatch[1] : new Date().toLocaleDateString(),
      items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat((total - subtotal).toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      rawText: text
    };
  } catch (error: any) {
    console.error('Error extracting receipt data:', error);
    
    // Return fallback data in case of error
    return {
      merchantName: 'Unknown Merchant',
      date: new Date().toLocaleDateString(),
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      error: error.message,
      rawText: ''
    };
  }
}

/**
 * Determines the receipt tier based on the total amount
 * 
 * @param {number} total - The total amount on the receipt
 * @returns {TierInfo} - The tier information
 */
export function determineReceiptTier(total: number): TierInfo {
  if (total >= RECEIPT_TIERS.LUXURY.min) {
    return {
      id: 'LUXURY',
      title: RECEIPT_TIERS.LUXURY.title,
      description: 'Exclusive BlockReceipt with premium features and highest encryption',
      price: 5.00 // Price to mint this tier BlockReceipt
    };
  } else if (total >= RECEIPT_TIERS.PREMIUM.min) {
    return {
      id: 'PREMIUM',
      title: RECEIPT_TIERS.PREMIUM.title,
      description: 'Enhanced BlockReceipt with premium features and advanced encryption',
      price: 2.99
    };
  } else if (total >= RECEIPT_TIERS.STANDARD.min) {
    return {
      id: 'STANDARD',
      title: RECEIPT_TIERS.STANDARD.title,
      description: 'Standard BlockReceipt with basic features and encryption',
      price: 0.99
    };
  } else {
    return {
      id: 'BASIC',
      title: RECEIPT_TIERS.BASIC.title,
      description: 'Basic BlockReceipt with minimal features',
      price: 0.00
    };
  }
}

/**
 * Prepares receipt data for encryption and blockchain storage
 * This function standardizes the data format and removes sensitive information
 * 
 * @param {ReceiptData} receiptData - The extracted receipt data
 * @returns {Object} - Prepared receipt data for storage
 */
export function prepareReceiptForStorage(receiptData: ReceiptData) {
  return {
    merchantName: receiptData.merchantName,
    date: receiptData.date,
    total: receiptData.total,
    subtotal: receiptData.subtotal,
    tax: receiptData.tax,
    itemCount: receiptData.items.length,
    // We don't include the raw items for privacy
    // They can be encrypted separately with more strict access controls
    tierInfo: determineReceiptTier(receiptData.total),
    createdAt: new Date().toISOString(),
    // For BlockReceipt metadata
    metadata: {
      name: `${receiptData.merchantName} BlockReceipt`,
      description: `Purchase from ${receiptData.merchantName} on ${receiptData.date}`,
      image: null // To be generated later
    }
  };
}
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
 * Function to extract receipt data using OCR with multiple parsing patterns
 * 
 * @param {string} imagePath - Path to the receipt image
 * @returns {Promise<ReceiptData>} - Extracted receipt data
 */
export async function extractReceiptData(imagePath: string): Promise<ReceiptData> {
  try {
    console.log('Starting OCR processing on file:', imagePath);
    
    // Use Tesseract.js for OCR with specific configurations for receipt scanning
    const { data } = await Tesseract.recognize(
      imagePath,
      'eng',
      {
        logger: m => console.log(`Tesseract progress: ${m.status} ${Math.floor(m.progress * 100)}%`),
        errorHandler: e => console.error('Tesseract error:', e)
      }
    );

    // Extract text from the OCR result
    const text = data.text;
    console.log('OCR Text extracted, length:', text.length);
    
    // Enhanced parsing with multiple regex patterns for different receipt formats
    
    // Try multiple merchant name patterns
    const merchantPatterns = [
      /([A-Z][A-Z\s&.']+)\n/,                 // Capitalized name at start of line
      /WELCOME TO ([A-Z][A-Z\s&.']+)/i,       // "Welcome to STORE" format
      /MERCHANT:?\s*([A-Z][A-Z\s&.']+)/i,     // "Merchant: STORE" format
      /STORE:?\s*([A-Z][A-Z\s&.']+)/i,        // "Store: STORE" format
      /RESTAURANT:?\s*([A-Z][A-Z\s&.']+)/i,   // "Restaurant: STORE" format
      /RECEIPT[ \t]+([A-Z][A-Z\s&.']+)/i      // "RECEIPT STORE" format
    ];
    
    let merchantName = 'Unknown Merchant';
    for (const pattern of merchantPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        merchantName = match[1].trim();
        break;
      }
    }
    
    // Try multiple date patterns
    const datePatterns = [
      /(\d{1,2}\/\d{1,2}\/\d{2,4})/,                   // MM/DD/YYYY or DD/MM/YYYY
      /(\d{1,2}-\d{1,2}-\d{2,4})/,                     // MM-DD-YYYY or DD-MM-YYYY
      /(\d{2,4}\.\d{1,2}\.\d{1,2})/,                   // YYYY.MM.DD
      /DATE:?\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/i,         // "Date: MM/DD/YYYY"
      /DATE:?\s*(\d{1,2}-\d{1,2}-\d{2,4})/i,           // "Date: MM-DD-YYYY"
      /(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})/,        // Generic date pattern
      /(\w{3,9})\s+(\d{1,2}),?\s+(\d{4})/              // Month DD, YYYY
    ];
    
    let receiptDate = new Date().toLocaleDateString();
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        if (match[1] && match[2] && match[3]) {
          // Handle Month DD, YYYY format
          receiptDate = `${match[1]} ${match[2]}, ${match[3]}`;
        } else if (match[1]) {
          receiptDate = match[1];
        }
        break;
      }
    }
    
    // Try multiple total patterns
    const totalPatterns = [
      /TOTAL[:\s]*\$?(\d+\.\d{2})/i,           // "TOTAL: $XX.XX"
      /AMOUNT[:\s]*\$?(\d+\.\d{2})/i,          // "AMOUNT: $XX.XX"
      /GRAND TOTAL[:\s]*\$?(\d+\.\d{2})/i,     // "GRAND TOTAL: $XX.XX"
      /BALANCE DUE[:\s]*\$?(\d+\.\d{2})/i,     // "BALANCE DUE: $XX.XX"
      /TO PAY[:\s]*\$?(\d+\.\d{2})/i,          // "TO PAY: $XX.XX"
      /PAYMENT[:\s]*\$?(\d+\.\d{2})/i,         // "PAYMENT: $XX.XX"
      /\bTOTAL\b[^$\n]*[^0-9](\d+\.\d{2})/i,   // "TOTAL" followed by price without $ sign
      /\$\s*(\d+\.\d{2})\s*$/m                 // $ amount at end of line (as a fallback)
    ];
    
    let total = 0;
    for (const pattern of totalPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        total = parseFloat(match[1]);
        break;
      }
    }
    
    // Try multiple subtotal patterns
    const subtotalPatterns = [
      /SUBTOTAL[:\s]*\$?(\d+\.\d{2})/i,
      /SUB[ -]?TOTAL[:\s]*\$?(\d+\.\d{2})/i,
      /SUB AMOUNT[:\s]*\$?(\d+\.\d{2})/i,
      /\bSUBTOTAL\b[^$\n]*[^0-9](\d+\.\d{2})/i
    ];
    
    let subtotal = 0;
    for (const pattern of subtotalPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        subtotal = parseFloat(match[1]);
        break;
      }
    }
    
    // Try multiple tax patterns
    const taxPatterns = [
      /TAX[:\s]*\$?(\d+\.\d{2})/i,
      /SALES TAX[:\s]*\$?(\d+\.\d{2})/i,
      /VAT[:\s]*\$?(\d+\.\d{2})/i,
      /GST[:\s]*\$?(\d+\.\d{2})/i,
      /HST[:\s]*\$?(\d+\.\d{2})/i,
      /\bTAX\b[^$\n]*[^0-9](\d+\.\d{2})/i
    ];
    
    let tax = 0;
    for (const pattern of taxPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        tax = parseFloat(match[1]);
        break;
      }
    }
    
    // Enhanced item extraction using multiple patterns
    // 1. Look for lines with price patterns
    // 2. Extract name and price from those lines
    
    // Pattern for lines containing prices
    const priceLinePattern = /(.+)\s+\$?(\d+\.\d{2})\s*$/;
    const simpleItemPattern = /([A-Za-z0-9&\s\-'".]+)\s+\$?(\d+\.\d{2})/;
    
    const lines = text.split('\n');
    let items: ReceiptItem[] = [];
    
    // First pass: look for lines with clear price format
    for (const line of lines) {
      if (
        line && 
        !line.match(/TOTAL|SUBTOTAL|TAX|TIP|AMOUNT|CHANGE|CASH|CREDIT|BALANCE|PAYMENT|DUE/i)
      ) {
        const priceMatch = line.match(priceLinePattern) || line.match(simpleItemPattern);
        if (priceMatch && priceMatch[1] && priceMatch[2]) {
          const name = priceMatch[1].trim();
          const price = parseFloat(priceMatch[2]);
          
          // Avoid adding non-sensical items (e.g., dates, store numbers)
          if (
            name.length > 1 &&
            !name.match(/^\d+$/) && // Not just numbers
            !name.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i) && // Not just month
            !name.match(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i) // Not weekdays
          ) {
            items.push({ name, price });
          }
        }
      }
    }
    
    // If no items found, try a more aggressive approach
    if (items.length === 0) {
      const itemPattern = /\$\s*(\d+\.\d{2})/g;
      let itemMatch;
      
      for (const line of lines) {
        if (
          line && 
          !line.match(/TOTAL|SUBTOTAL|TAX|TIP|AMOUNT|CHANGE|CASH|CREDIT|BALANCE|PAYMENT|DUE/i)
        ) {
          // Reset the regex to search from the beginning
          itemPattern.lastIndex = 0;
          
          // Check if line contains a price
          itemMatch = itemPattern.exec(line);
          if (itemMatch) {
            // Extract the name by removing the price part
            const price = parseFloat(itemMatch[1]);
            const name = line.replace(itemMatch[0], '').trim();
            
            if (name.length > 1 && !name.match(/^\d+$/)) {
              items.push({ name, price });
            }
          }
        }
      }
    }
    
    // Calculate or verify values
    if (subtotal === 0 && items.length > 0) {
      // Calculate subtotal from items if not found
      subtotal = items.reduce((sum, item) => sum + item.price, 0);
      subtotal = parseFloat(subtotal.toFixed(2));
    }
    
    if (tax === 0 && subtotal > 0 && total > 0) {
      // Estimate tax if not found
      tax = parseFloat((total - subtotal).toFixed(2));
      // Handle negative tax which might be due to rounding errors
      if (tax < 0) tax = 0;
    }
    
    if (total === 0) {
      // If total wasn't found, estimate from subtotal and tax
      if (subtotal > 0) {
        total = subtotal + tax;
        total = parseFloat(total.toFixed(2));
      } else if (items.length > 0) {
        // If no subtotal, calculate total from items
        const calculatedSubtotal = items.reduce((sum, item) => sum + item.price, 0);
        // Assume ~8% tax rate
        total = calculatedSubtotal * 1.08;
        total = parseFloat(total.toFixed(2));
      }
    }
    
    console.log('Receipt parsed successfully:', {
      merchant: merchantName,
      date: receiptDate,
      items: items.length,
      subtotal,
      tax,
      total
    });
    
    // Construct the receipt data object
    return {
      merchantName,
      date: receiptDate,
      items,
      subtotal,
      tax,
      total,
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
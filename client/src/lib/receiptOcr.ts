/**
 * Receipt OCR Library
 * 
 * Provides utilities for receipt OCR processing and data classification
 */
import axios from 'axios';

/**
 * Receipt tier levels based on total amount
 */
export enum ReceiptTier {
  STANDARD = 'Standard',
  PREMIUM = 'Premium',
  LUXURY = 'Luxury',
  ULTRA = 'Ultra'
}

/**
 * Basic extracted receipt data structure
 */
export interface ExtractedReceiptData {
  merchantName: string;
  date: string;
  total: number;
  subtotal?: number;
  tax?: number;
  tip?: number;
  items: ReceiptItem[];
  category?: string;
  paymentMethod?: string;
  currencyCode?: string;
}

/**
 * Receipt item structure
 */
export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

/**
 * OCR receipt data with additional metadata
 */
export interface ReceiptData extends ExtractedReceiptData {
  id?: string;
  userId?: string;
  createdAt?: string;
  merchantDetails?: {
    name: string;
    address?: string;
    phone?: string;
    website?: string;
    email?: string;
  };
  transactionDetails?: {
    id?: string;
    date: string;
    time?: string;
    subtotal: number;
    tax: number;
    tip?: number;
    total: number;
    paymentMethod?: string;
    cardLast4?: string;
  };
  receiptType?: string;
  encryptionStatus?: 'encrypted' | 'unencrypted';
  metadataEncryptionKey?: string;
  hasSharedAccess?: boolean;
  accessGrantedTo?: string[];
}

/**
 * Upload a receipt image and get extracted data
 * 
 * @param imageBase64 Base64 encoded image
 * @returns Promise with extracted receipt data
 */
export async function uploadReceiptImage(imageBase64: string): Promise<ReceiptData> {
  try {
    const response = await axios.post('/api/ocr/process', {
      image: imageBase64
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Failed to extract receipt data');
    }
  } catch (error) {
    console.error('Receipt upload error:', error);
    throw error;
  }
}

/**
 * Determine the receipt tier based on the total amount
 * 
 * @param total Total receipt amount
 * @returns Receipt tier
 */
export function determineReceiptTier(total: number): ReceiptTier {
  if (total >= 300) {
    return ReceiptTier.ULTRA;
  } else if (total >= 100) {
    return ReceiptTier.LUXURY;
  } else if (total >= 20) {
    return ReceiptTier.PREMIUM;
  } else {
    return ReceiptTier.STANDARD;
  }
}

/**
 * Format a currency amount based on the currency code
 * 
 * @param amount Amount to format
 * @param currencyCode Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currencyCode = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

/**
 * Convert a file to base64 encoding
 * 
 * @param file File to convert
 * @returns Promise with base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data:image/*;base64, prefix
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Process a receipt image from a file
 * 
 * @param file Image file
 * @returns Promise with receipt data
 */
export async function processReceiptImage(file: File): Promise<ReceiptData> {
  try {
    const base64 = await fileToBase64(file);
    return await uploadReceiptImage(base64);
  } catch (error) {
    console.error('Process receipt image error:', error);
    throw error;
  }
}

/**
 * Process a receipt image from base64 string
 * 
 * @param base64 Base64 encoded image
 * @returns Promise with receipt data
 */
export async function processReceiptBase64(base64: string): Promise<ReceiptData> {
  try {
    return await uploadReceiptImage(base64);
  } catch (error) {
    console.error('Process receipt base64 error:', error);
    throw error;
  }
}

export default {
  uploadReceiptImage,
  determineReceiptTier,
  formatCurrency,
  fileToBase64,
  processReceiptImage,
  processReceiptBase64
};
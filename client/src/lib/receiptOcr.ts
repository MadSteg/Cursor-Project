import { apiRequest } from "./queryClient";

// Receipt OCR Types
export interface ReceiptItem {
  name: string;
  price: number; // in cents
  quantity: number;
}

export interface ReceiptData {
  merchantName: string;
  date: string;
  items: ReceiptItem[];
  subtotal: number; // in cents
  tax: number; // in cents
  total: number; // in cents
  category?: string;
  confidence: number;
  rawText?: string;
}

export enum ReceiptTier {
  STANDARD = "standard",
  PREMIUM = "premium",
  LUXURY = "luxury",
  ULTRA = "ultra"
}

/**
 * Determine receipt tier based on total amount
 * 
 * @param totalCents Total amount in cents
 * @returns Receipt tier
 */
export function getReceiptTier(totalCents: number): ReceiptTier {
  if (totalCents >= 30000) { // $300+
    return ReceiptTier.ULTRA;
  } else if (totalCents >= 10000) { // $100+
    return ReceiptTier.LUXURY;
  } else if (totalCents >= 2000) { // $20+
    return ReceiptTier.PREMIUM;
  } else {
    return ReceiptTier.STANDARD;
  }
}

/**
 * Convert a file to base64
 * 
 * @param file File to convert
 * @returns Promise resolving to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data URL prefix (e.g. "data:image/jpeg;base64,")
      const base64String = reader.result as string;
      const base64Content = base64String.split(",")[1];
      resolve(base64Content);
    };
    reader.onerror = error => reject(error);
  });
}

/**
 * Process a receipt image using OCR
 * 
 * @param imageFile Image file to process
 * @returns Promise resolving to extracted receipt data
 */
export async function processReceiptImage(imageFile: File): Promise<ReceiptData> {
  try {
    const formData = new FormData();
    formData.append('receipt', imageFile);
    
    const response = await fetch('/api/ocr/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to process receipt image');
    }
    
    return result.data;
  } catch (error) {
    console.error('Receipt processing error:', error);
    throw error;
  }
}

/**
 * Process a receipt image as base64 using OCR
 * 
 * @param base64Image Base64 encoded image data
 * @param fileName Optional file name
 * @returns Promise resolving to extracted receipt data
 */
export async function processReceiptBase64(base64Image: string, fileName?: string): Promise<ReceiptData> {
  try {
    const response = await fetch('/api/ocr/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        image: base64Image,
        fileName
      })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to process receipt image');
    }
    
    return result.data;
  } catch (error) {
    console.error('Receipt processing error:', error);
    throw error;
  }
}
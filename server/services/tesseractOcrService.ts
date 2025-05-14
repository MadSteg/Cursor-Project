/**
 * TesseractOCR Service
 * 
 * This service provides local OCR processing using Tesseract.js
 * It serves as a fallback when OpenAI API is unavailable or rate-limited
 */

import { createWorker } from 'tesseract.js';
import { ExtractedReceiptData } from './ocrService';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';

// Create a cache directory if it doesn't exist
const TESSERACT_CACHE_DIR = path.join(process.cwd(), 'cache', 'tesseract');
if (!fs.existsSync(TESSERACT_CACHE_DIR)) {
  fs.mkdirSync(TESSERACT_CACHE_DIR, { recursive: true });
}

/**
 * Preprocess the image to improve OCR accuracy
 * @param imageBuffer The image buffer to preprocess
 * @returns The processed image buffer
 */
async function preprocessImage(imageBuffer: Buffer): Promise<Buffer> {
  try {
    // Convert to grayscale, increase contrast, and sharpen the image
    return await sharp(imageBuffer)
      .grayscale()
      .normalize() // Normalize to improve contrast
      .sharpen()
      .toBuffer();
  } catch (error) {
    console.error('Image preprocessing error:', error);
    return imageBuffer; // Return original if processing fails
  }
}

/**
 * Extract structured data from receipt text using rules-based approach
 * @param text The extracted text from the receipt image
 * @returns Structured receipt data or null if extraction failed
 */
function parseReceiptText(text: string): ExtractedReceiptData | null {
  try {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    // Extract merchant name (usually at the top of receipt)
    const merchantName = lines[0].trim();
    
    // Find date using regex patterns
    const dateRegex = /(\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4})|(\d{4}[\/\.-]\d{1,2}[\/\.-]\d{1,2})/g;
    const dateMatches = text.match(dateRegex);
    let dateStr = dateMatches ? dateMatches[0] : new Date().toISOString().split('T')[0];
    
    // Format date to YYYY-MM-DD if possible
    try {
      const dateParts = dateStr.split(/[\/\.-]/);
      if (dateParts.length === 3) {
        // Check if year is first (YYYY-MM-DD)
        if (dateParts[0].length === 4) {
          dateStr = `${dateParts[0]}-${dateParts[1].padStart(2, '0')}-${dateParts[2].padStart(2, '0')}`;
        } 
        // Assume MM/DD/YYYY or DD/MM/YYYY (use MM/DD/YYYY for simplicity)
        else {
          const year = dateParts[2].length === 2 ? `20${dateParts[2]}` : dateParts[2];
          dateStr = `${year}-${dateParts[0].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}`;
        }
      }
    } catch (e) {
      console.warn('Date parsing error:', e);
      dateStr = new Date().toISOString().split('T')[0];
    }
    
    // Extract items, prices, subtotal, tax, and total
    const items: Array<{name: string, price: number, quantity: number}> = [];
    let subtotal = 0;
    let tax = 0;
    let total = 0;
    
    // Look for items with prices
    const itemRegex = /(.+?)\s+(\d+(?:\.\d{2})?)\s*$/;
    const qtyRegex = /(\d+)\s*[xX]\s*(.+)/;
    
    for (let i = 3; i < lines.length - 3; i++) {
      const line = lines[i].trim();
      
      // Skip headers, footers and non-item lines
      if (line.toLowerCase().includes('receipt') || 
          line.toLowerCase().includes('thank you') ||
          line.toLowerCase().includes('tel:') ||
          line.toLowerCase().includes('phone') ||
          line.toLowerCase().includes('invoice')) {
        continue;
      }
      
      // Extract item and price from the line
      const itemMatch = line.match(itemRegex);
      if (itemMatch) {
        let name = itemMatch[1].trim();
        const price = parseFloat(itemMatch[2]);
        let quantity = 1;
        
        // Check if the item name contains a quantity
        const qtyMatch = name.match(qtyRegex);
        if (qtyMatch) {
          quantity = parseInt(qtyMatch[1], 10);
          name = qtyMatch[2].trim();
        }
        
        items.push({ name, price, quantity });
      }
      
      // Look for subtotal, tax, and total
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('subtotal') || lowerLine.includes('sub total')) {
        const matches = line.match(/(\d+\.\d{2})/);
        if (matches) subtotal = parseFloat(matches[0]);
      } else if (lowerLine.includes('tax')) {
        const matches = line.match(/(\d+\.\d{2})/);
        if (matches) tax = parseFloat(matches[0]);
      } else if (lowerLine.includes('total')) {
        const matches = line.match(/(\d+\.\d{2})/);
        if (matches) total = parseFloat(matches[0]);
      }
    }
    
    // If subtotal is not found but we have items, calculate it from items
    if (subtotal === 0 && items.length > 0) {
      subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
    
    // If total is not found but we have subtotal and tax, calculate it
    if (total === 0 && (subtotal > 0 || tax > 0)) {
      total = subtotal + tax;
    }
    
    // If we have a total but no subtotal/tax, estimate them
    if (total > 0 && subtotal === 0) {
      subtotal = Math.round((total / 1.1) * 100) / 100; // Assume ~10% tax
      tax = total - subtotal;
    }
    
    // If total is the only value we have, use it
    if (total === 0 && items.length > 0) {
      total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
    
    // Convert prices to cents for storage
    return {
      merchantName: merchantName || "Unknown Merchant",
      date: dateStr,
      items: items.map(item => ({
        name: item.name,
        price: Math.round(item.price * 100),
        quantity: item.quantity
      })),
      subtotal: Math.round(subtotal * 100),
      tax: Math.round(tax * 100),
      total: Math.round(total * 100),
      confidence: 0.7, // Fixed confidence value for Tesseract OCR
      rawText: text,
      category: undefined // Will be inferred later
    };
  } catch (error) {
    console.error('Receipt parsing error:', error);
    return null;
  }
}

/**
 * Process a receipt image using Tesseract OCR
 * @param imageBase64 Base64 encoded image data
 * @returns Extracted receipt data or null if extraction failed
 */
export async function processTesseractOCR(imageBase64: string): Promise<ExtractedReceiptData | null> {
  // Generate a hash of the image for caching
  const imageHash = createHash('sha256')
    .update(imageBase64.substring(0, 5000))
    .digest('hex')
    .substring(0, 20);
  
  console.log(`Processing receipt with Tesseract OCR (ID: ${imageHash})...`);
  
  // Check if we have this image cached
  const cachePath = path.join(TESSERACT_CACHE_DIR, `${imageHash}.json`);
  if (fs.existsSync(cachePath)) {
    try {
      const cachedData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
      console.log(`Using cached Tesseract result for image ${imageHash}`);
      return cachedData;
    } catch (cacheError) {
      console.warn(`Failed to read Tesseract cache for ${imageHash}:`, cacheError);
    }
  }
  
  try {
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    
    // Preprocess the image
    const processedImage = await preprocessImage(imageBuffer);
    
    // Create Tesseract worker
    const worker = await createWorker('eng');
    
    // Recognize text in the image
    const { data: { text } } = await worker.recognize(processedImage);
    
    // Terminate the worker
    await worker.terminate();
    
    console.log('Tesseract OCR text extraction complete, parsing result...');
    console.log('Raw text sample:', text.substring(0, 200) + '...');
    
    // Parse the text into structured data
    const extractedData = parseReceiptText(text);
    
    if (extractedData) {
      // Cache the result
      try {
        fs.writeFileSync(cachePath, JSON.stringify(extractedData), 'utf8');
      } catch (cacheWriteError) {
        console.warn('Failed to write to Tesseract cache:', cacheWriteError);
      }
      
      console.log(`Successfully extracted receipt data for ${extractedData.merchantName} using Tesseract`);
      return extractedData;
    } else {
      console.warn('Failed to parse receipt text using Tesseract');
      return null;
    }
  } catch (error) {
    console.error('Tesseract OCR error:', error);
    return null;
  }
}

/**
 * Infer receipt category using simple keyword matching
 * @param merchantName The merchant name
 * @param items The items purchased
 * @returns Inferred category
 */
export function inferCategoryFromText(merchantName: string, items: Array<{name: string, price: number}>): string {
  const merchant = merchantName.toLowerCase();
  const itemText = items.map(item => item.name.toLowerCase()).join(' ');
  const fullText = `${merchant} ${itemText}`;
  
  const categoryKeywords: Record<string, string[]> = {
    'groceries': ['grocery', 'supermarket', 'market', 'food', 'produce', 'deli', 'bakery', 'organic'],
    'dining': ['restaurant', 'cafe', 'coffee', 'bar', 'grill', 'diner', 'bistro', 'eatery', 'pizza', 'burger'],
    'retail': ['store', 'mall', 'shop', 'outlet', 'clothing', 'apparel', 'fashion', 'department'],
    'electronics': ['electronics', 'computer', 'phone', 'tech', 'digital', 'apple', 'samsung', 'device'],
    'travel': ['airline', 'hotel', 'flight', 'booking', 'air', 'train', 'car rental', 'taxi', 'uber'],
    'entertainment': ['movie', 'cinema', 'theater', 'show', 'concert', 'game', 'event', 'ticket'],
    'utilities': ['electric', 'gas', 'water', 'power', 'energy', 'internet', 'phone', 'telecom'],
    'health': ['pharmacy', 'drug', 'health', 'medical', 'doctor', 'hospital', 'clinic', 'medicine'],
    'beauty': ['salon', 'spa', 'beauty', 'hair', 'nail', 'makeup', 'cosmetic', 'barber'],
    'home': ['hardware', 'home', 'furniture', 'garden', 'decor', 'improvement', 'tool', 'repair']
  };
  
  // Check for category matches
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (fullText.includes(keyword)) {
        return category;
      }
    }
  }
  
  return 'other';
}

export default {
  processTesseractOCR,
  inferCategoryFromText
};
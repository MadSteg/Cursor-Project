import vision from '@google-cloud/vision';
import { promises as fs } from 'fs';
import path from 'path';
import OpenAI from 'openai';

// Check if Google Cloud credentials are available
const useGoogleVision = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
                       (process.env.GOOGLE_CLOUD_PROJECT && process.env.GOOGLE_CLOUD_CREDENTIALS);

// Initialize the Google Vision client with fallback options
let client: vision.ImageAnnotatorClient | null = null;
try {
  if (useGoogleVision) {
    console.log('Initializing Google Cloud Vision API client...');
    client = new vision.ImageAnnotatorClient();
  } else {
    console.log('Google Cloud Vision credentials not found, will use OpenAI fallback if available');
  }
} catch (error) {
  console.error('Failed to initialize Google Cloud Vision client:', error);
}

// Initialize OpenAI as fallback
let openaiClient: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  try {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('OpenAI API client initialized for fallback OCR');
  } catch (error) {
    console.error('Failed to initialize OpenAI client:', error);
  }
}

export interface ReceiptItem {
  description: string;
  quantity: number;
  price: number;
}

export interface ReceiptData {
  merchant: string;
  date: string;
  total: number;
  items: ReceiptItem[];
  subtotal?: number;
  tax?: number;
}

/**
 * Extract data from receipt using Google Cloud Vision API
 * with OpenAI fallback if Vision API is not available
 * 
 * @param imageBuffer Buffer containing receipt image
 * @returns Structured receipt data
 */
export async function extractReceiptData(imageBuffer: Buffer): Promise<ReceiptData> {
  try {
    let fullText = '';
    
    // Try Google Vision if available
    if (client) {
      try {
        console.log('Using Google Cloud Vision API for OCR...');
        const [result] = await client.documentTextDetection(imageBuffer);
        fullText = result.fullTextAnnotation?.text || '';
        
        if (fullText) {
          console.log('Google Vision OCR successful');
        } else {
          console.warn('Google Vision returned empty result');
        }
      } catch (visionError) {
        console.error('Google Vision API error:', visionError);
        // Will fall back to OpenAI
      }
    }
    
    // Try OpenAI if Vision failed or is not available
    if (!fullText && openaiClient) {
      try {
        console.log('Falling back to OpenAI for OCR...');
        // Convert buffer to base64
        const base64Image = imageBuffer.toString('base64');
        
        // Use OpenAI to extract text from image
        const response = await openaiClient.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Extract all text from this receipt image, including store name, date, items purchased, prices, subtotal, tax, and total. Format the text exactly as shown in the image." },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 1000,
        });
        
        fullText = response.choices[0]?.message?.content || '';
        
        if (fullText) {
          console.log('OpenAI OCR successful');
        } else {
          console.warn('OpenAI returned empty result');
        }
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
      }
    }
    
    // Check if we have any text to parse
    if (!fullText) {
      throw new Error('No text could be extracted from the image using available OCR methods');
    }
    
    console.log('OCR Text:', fullText.substring(0, 200) + '...');
    
    // Parse the extracted text
    return parseReceiptText(fullText);
  } catch (error) {
    console.error('Receipt OCR extraction error:', error);
    throw new Error(`Failed to extract receipt data: ${error.message}`);
  }
}

/**
 * Extract structured receipt data from OCR text
 * @param text Raw OCR text from the receipt
 * @returns Structured receipt data
 */
function parseReceiptText(text: string): ReceiptData {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  
  // Default receipt data
  const receipt: ReceiptData = {
    merchant: 'Unknown Merchant',
    date: new Date().toLocaleDateString(),
    total: 0,
    items: [],
    subtotal: 0,
    tax: 0
  };
  
  // Extract merchant name (typically in the first few lines)
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    if (lines[i].length > 3 && !lines[i].match(/^(tel|phone|address|store|receipt|invoice)/i)) {
      receipt.merchant = lines[i];
      break;
    }
  }
  
  // Extract date
  const datePattern = /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})|(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/i;
  for (const line of lines) {
    const dateMatch = line.match(datePattern);
    if (dateMatch) {
      receipt.date = dateMatch[0];
      break;
    }
  }
  
  // Extract total amount
  const totalPattern = /total[\s:]*([$€£¥])?(\d+[.,]\d{2})/i;
  for (const line of lines) {
    const totalMatch = line.match(totalPattern);
    if (totalMatch) {
      receipt.total = parseFloat(totalMatch[2].replace(',', '.'));
      break;
    }
  }
  
  // Extract subtotal if available
  const subtotalPattern = /subtotal[\s:]*([$€£¥])?(\d+[.,]\d{2})/i;
  for (const line of lines) {
    const subtotalMatch = line.match(subtotalPattern);
    if (subtotalMatch) {
      receipt.subtotal = parseFloat(subtotalMatch[2].replace(',', '.'));
      break;
    }
  }
  
  // Extract tax if available
  const taxPattern = /(?:tax|vat|gst)[\s:]*([$€£¥])?(\d+[.,]\d{2})/i;
  for (const line of lines) {
    const taxMatch = line.match(taxPattern);
    if (taxMatch) {
      receipt.tax = parseFloat(taxMatch[2].replace(',', '.'));
      break;
    }
  }
  
  // Extract line items
  // This is trickier as item formats vary widely between receipts
  let inItemsSection = false;
  let currentItem: Partial<ReceiptItem> = {};
  
  const pricePattern = /([$€£¥])?(\d+[.,]\d{2})/;
  const quantityPattern = /(\d+)\s*[xX]/;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip header lines and total sections
    if (line.match(/subtotal|total|tax|amount|payment|card|cash|change/i)) {
      continue;
    }
    
    const priceMatch = line.match(pricePattern);
    if (priceMatch) {
      const price = parseFloat(priceMatch[2].replace(',', '.'));
      
      // If we have a price, let's try to extract the item details
      const lineParts = line.split(priceMatch[0]).map(part => part.trim());
      const description = lineParts[0];
      
      if (description && description.length > 1) {
        // Check for quantity
        const quantityMatch = description.match(quantityPattern);
        const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
        
        // Clean up description
        const cleanDescription = description.replace(quantityPattern, '').trim();
        
        receipt.items.push({
          description: cleanDescription || 'Unknown Item',
          quantity,
          price
        });
      }
    }
  }
  
  // If no items were found using pattern matching, try a simpler approach
  if (receipt.items.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const priceMatch = line.match(pricePattern);
      
      if (priceMatch && 
          !line.match(/subtotal|total|tax|amount|payment|card|cash|change/i)) {
        const price = parseFloat(priceMatch[2].replace(',', '.'));
        const description = line.replace(pricePattern, '').trim();
        
        if (description && price > 0) {
          receipt.items.push({
            description,
            quantity: 1,
            price
          });
        }
      }
    }
  }
  
  // If we still don't have items but have a total, create a single generic item
  if (receipt.items.length === 0 && receipt.total > 0) {
    receipt.items.push({
      description: 'Purchase',
      quantity: 1,
      price: receipt.total
    });
  }
  
  // If we have items but no total, calculate it
  if (receipt.total === 0 && receipt.items.length > 0) {
    receipt.total = receipt.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
  
  // If we have total but no subtotal, use total as subtotal if tax is 0
  if (receipt.subtotal === 0 && receipt.tax === 0) {
    receipt.subtotal = receipt.total;
  }
  
  return receipt;
}

/**
 * Process a receipt image file and extract its data
 * @param filePath Path to receipt image file
 * @returns Structured receipt data
 */
export async function processReceiptImage(filePath: string): Promise<ReceiptData> {
  try {
    const imageBuffer = await fs.readFile(filePath);
    return extractReceiptData(imageBuffer);
  } catch (error) {
    console.error('Error processing receipt image:', error);
    throw new Error(`Failed to process receipt image: ${error.message}`);
  }
}

/**
 * Uses AI to infer the category of a receipt based on the merchant and items
 * @param merchantName The name of the merchant/store
 * @param itemsText Text representation of the items on the receipt
 * @returns Inferred category string
 */
export async function inferReceiptCategory(merchantName: string, itemsText: string): Promise<string> {
  try {
    // List of common receipt categories
    const categories = [
      'groceries',
      'restaurant',
      'electronics',
      'clothing',
      'entertainment',
      'travel',
      'transportation',
      'healthcare',
      'home',
      'office',
      'pets',
      'gifts',
      'beauty',
      'sports',
      'other'
    ];
    
    // Basic category inference based on merchant name
    const merchantNameLower = merchantName.toLowerCase();
    
    // Restaurant detection
    if (merchantNameLower.includes('restaurant') || merchantNameLower.includes('café') || 
        merchantNameLower.includes('cafe') || merchantNameLower.includes('pizza') ||
        merchantNameLower.includes('grill') || merchantNameLower.includes('bar') ||
        merchantNameLower.includes('kitchen') || merchantNameLower.includes('bistro')) {
      return 'restaurant';
    }
    
    // Grocery detection
    if (merchantNameLower.includes('grocery') || merchantNameLower.includes('groceries') ||
        merchantNameLower.includes('market') || merchantNameLower.includes('food') ||
        merchantNameLower.includes('supermarket') || merchantNameLower.includes('mart')) {
      return 'groceries';
    }
    
    // Electronics detection
    if (merchantNameLower.includes('electronics') || merchantNameLower.includes('tech') ||
        merchantNameLower.includes('computer') || merchantNameLower.includes('digital') ||
        merchantNameLower.includes('mobile') || merchantNameLower.includes('phone')) {
      return 'electronics';
    }
    
    // Clothing detection
    if (merchantNameLower.includes('clothing') || merchantNameLower.includes('apparel') ||
        merchantNameLower.includes('fashion') || merchantNameLower.includes('wear') ||
        merchantNameLower.includes('boutique') || merchantNameLower.includes('dress')) {
      return 'clothing';
    }
    
    // If we can't determine from merchant name, try to infer from the items
    if (itemsText) {
      const itemsLower = itemsText.toLowerCase();
      
      if (itemsLower.includes('milk') || itemsLower.includes('bread') || 
          itemsLower.includes('egg') || itemsLower.includes('fruit') ||
          itemsLower.includes('vegetable') || itemsLower.includes('meat')) {
        return 'groceries';
      }
      
      if (itemsLower.includes('tv') || itemsLower.includes('phone') || 
          itemsLower.includes('computer') || itemsLower.includes('cable') ||
          itemsLower.includes('charger') || itemsLower.includes('laptop')) {
        return 'electronics';
      }
      
      if (itemsLower.includes('shirt') || itemsLower.includes('pant') || 
          itemsLower.includes('dress') || itemsLower.includes('sock') ||
          itemsLower.includes('shoe') || itemsLower.includes('jacket')) {
        return 'clothing';
      }
    }
    
    // Default category if we can't determine
    return 'other';
  } catch (error) {
    console.error('Error inferring receipt category:', error);
    return 'other';
  }
}
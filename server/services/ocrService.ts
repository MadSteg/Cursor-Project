/**
 * OCR Service for Receipt Scanning
 * 
 * This service handles the extraction of data from receipt images using OpenAI's
 * GPT-4o Vision API for advanced image recognition and data extraction.
 */

import OpenAI from 'openai';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';

// Initialize OpenAI client
if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY environment variable is missing. OCR will use fallback methods.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

// Create a cache directory if it doesn't exist
const CACHE_DIR = path.join(process.cwd(), 'cache');
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// LRU Cache for OCR results
interface CacheEntry {
  timestamp: number;
  data: ExtractedReceiptData;
}

const OCR_CACHE: Record<string, CacheEntry> = {}; 
const CACHE_MAX_SIZE = 100; // Maximum number of items in cache
const CACHE_TTL = 24 * 60 * 60 * 1000; // Cache TTL: 24 hours

// Function to clean up old cache entries
function cleanupCache() {
  const now = Date.now();
  const entries = Object.entries(OCR_CACHE);
  
  // Remove expired entries
  for (const [key, entry] of entries) {
    if (now - entry.timestamp > CACHE_TTL) {
      delete OCR_CACHE[key];
    }
  }
  
  // If we still have too many entries, remove oldest ones
  if (Object.keys(OCR_CACHE).length > CACHE_MAX_SIZE) {
    const sortedEntries = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toRemove = sortedEntries.slice(0, sortedEntries.length - CACHE_MAX_SIZE);
    
    for (const [key] of toRemove) {
      delete OCR_CACHE[key];
    }
  }
}

// Types
export interface ExtractedReceiptData {
  merchantName: string;
  date: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  category?: string;
  confidence: number;
  rawText?: string;
}

/**
 * Process a receipt image and extract structured data using OCR with caching
 * 
 * @param imageBase64 Base64 encoded image data
 * @returns Extracted receipt data or null if extraction failed
 */
export async function extractReceiptData(imageBase64: string): Promise<ExtractedReceiptData | null> {
  try {
    console.log('Starting receipt OCR processing...');
    
    // Generate a hash of the image for caching and logging
    const imageHash = createHash('sha256')
      .update(imageBase64.substring(0, 5000)) // Using first 5000 chars for better uniqueness
      .digest('hex')
      .substring(0, 20); // Use first 20 chars of hash for better uniqueness
    
    console.log(`Processing receipt image: ${imageHash}...`);
    
    // Clean up cache periodically
    cleanupCache();
    
    // Check if we have this image in the cache
    if (OCR_CACHE[imageHash]) {
      console.log(`Using cached OCR result for image ${imageHash}`);
      return OCR_CACHE[imageHash].data;
    }
    
    // Check if we have saved this to disk cache
    const cachePath = path.join(CACHE_DIR, `${imageHash}.json`);
    if (fs.existsSync(cachePath)) {
      try {
        const cachedData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        console.log(`Using disk-cached OCR result for image ${imageHash}`);
        
        // Update the in-memory cache
        OCR_CACHE[imageHash] = {
          timestamp: Date.now(),
          data: cachedData
        };
        
        return cachedData;
      } catch (cacheError) {
        console.warn(`Failed to read disk cache for ${imageHash}:`, cacheError);
        // Continue with API call if cache read fails
      }
    }
    
    // Function to process the receipt with OpenAI
    const processWithOpenAI = async (): Promise<ExtractedReceiptData | null> => {
      try {
        // The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert OCR system specialized in extracting structured data from receipt images. 
              Extract the following information from the receipt image:
              - Merchant name (store/business name)
              - Date of purchase (in ISO format YYYY-MM-DD if possible)
              - List of items purchased with name, price (in dollars), and quantity
              - Subtotal (before tax, in dollars)
              - Tax amount (in dollars)
              - Total amount (in dollars)
              - Merchant category (if identifiable)
              
              Respond with JSON only in this exact format:
              {
                "merchantName": "string",
                "date": "YYYY-MM-DD",
                "items": [
                  {
                    "name": "string",
                    "price": float,
                    "quantity": integer
                  }
                ],
                "subtotal": float,
                "tax": float,
                "total": float,
                "category": "string",
                "confidence": float (0.0-1.0),
                "rawText": "string (all text recognized from receipt)"
              }
              
              For fields you cannot determine, make reasonable estimations with lower confidence scores. For items, try to extract as many as visible.
              If total and tax are visible but subtotal is not, calculate subtotal = total - tax.
              Make sure all numeric values are in dollars (not cents).
              IMPORTANT: Respond ONLY with a JSON object, no prose.`
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyze this receipt image and extract the structured data as JSON."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 2000
        });
        
        // Extract the JSON response
        if (response.choices[0].message.content) {
          const result = JSON.parse(response.choices[0].message.content);
          return result;
        }
        return null;
      } catch (openaiError) {
        console.error('OpenAI API error:', openaiError);
        return null;
      }
    };
    
    // Attempt to process with OpenAI
    let result = null;
    
    if (process.env.OPENAI_API_KEY) {
      // Only attempt OpenAI if we have an API key
      console.log('Attempting to process receipt with OpenAI...');
      result = await processWithOpenAI();
      
      if (!result) {
        console.log('OpenAI OCR failed, falling back to alternative method');
        // We'd implement an alternative OCR here if needed
      }
    } else {
      console.log('No OpenAI API key available, skipping OpenAI processing');
    }
    
    // If result is null (API failed or no key), use Tesseract OCR as fallback
    if (!result) {
      console.log('OpenAI OCR failed, falling back to Tesseract OCR');
      
      try {
        // Dynamically import Tesseract OCR service to avoid circular dependency
        const { processTesseractOCR } = await import('./tesseractOcrService');
        result = await processTesseractOCR(imageBase64);
        
        if (result) {
          console.log('Successfully processed receipt with Tesseract OCR fallback');
        } else {
          console.warn('Tesseract OCR fallback also failed');
          return null;
        }
      } catch (fallbackError) {
        console.error('Error in Tesseract OCR fallback:', fallbackError);
        return null;
      }
    }
    
    // Validate and transform the data
    const extractedData: ExtractedReceiptData = {
      merchantName: result.merchantName || "Unknown Merchant",
      date: result.date || new Date().toISOString().split('T')[0],
      items: (result.items || []).map((item: any) => ({
        name: item.name || "Unknown Item",
        // Ensure price is a number and convert to cents
        price: typeof item.price === 'number' ? Math.round(item.price * 100) : 0,
        quantity: typeof item.quantity === 'number' ? item.quantity : 1
      })),
      // Convert dollar amounts to cents for storage
      subtotal: typeof result.subtotal === 'number' ? Math.round(result.subtotal * 100) : 0,
      tax: typeof result.tax === 'number' ? Math.round(result.tax * 100) : 0,
      total: typeof result.total === 'number' ? Math.round(result.total * 100) : 0,
      category: result.category || undefined,
      confidence: typeof result.confidence === 'number' ? Math.min(Math.max(result.confidence, 0), 1) : 0.5,
      rawText: result.rawText
    };
    
    // Calculate missing values if needed
    if (extractedData.total === 0 && extractedData.subtotal > 0) {
      extractedData.total = extractedData.subtotal + extractedData.tax;
    } else if (extractedData.subtotal === 0 && extractedData.total > 0 && extractedData.tax >= 0) {
      extractedData.subtotal = extractedData.total - extractedData.tax;
    }
    
    // Cache the result in memory
    OCR_CACHE[imageHash] = {
      timestamp: Date.now(),
      data: extractedData
    };
    
    // Cache to disk
    try {
      fs.writeFileSync(
        path.join(CACHE_DIR, `${imageHash}.json`),
        JSON.stringify(extractedData),
        'utf8'
      );
    } catch (cacheWriteError) {
      console.warn('Failed to write to disk cache:', cacheWriteError);
      // Continue even if cache write fails
    }
    
    console.log(`Successfully extracted receipt data for ${extractedData.merchantName} (${imageHash})`);
    return extractedData;
  } catch (error) {
    console.error('OCR extraction error:', error);
    return null;
  }
}

// Simple in-memory cache for category inference
const CATEGORY_CACHE: Record<string, string> = {};
const CATEGORY_CACHE_MAX_SIZE = 1000;

/**
 * Infer receipt category from items and merchant name with caching
 * 
 * @param merchantName Name of the merchant
 * @param items List of purchased items
 * @returns Inferred category or "other" if unable to determine
 */
export async function inferReceiptCategory(
  merchantName: string, 
  items: Array<{name: string; price: number}> | string
): Promise<string> {
  try {
    // Prepare the input text from merchant and items
    const itemDescriptions = items.map(item => item.name).join(', ');
    
    // Create a cache key from the merchant and items
    const cacheKey = createHash('md5')
      .update(`${merchantName}:${itemDescriptions}`)
      .digest('hex');
    
    // Check cache first
    if (CATEGORY_CACHE[cacheKey]) {
      console.log(`Using cached category for ${merchantName}: ${CATEGORY_CACHE[cacheKey]}`);
      return CATEGORY_CACHE[cacheKey];
    }
    
    // Trim cache if it's getting too large
    const cacheKeys = Object.keys(CATEGORY_CACHE);
    if (cacheKeys.length > CATEGORY_CACHE_MAX_SIZE) {
      // Remove 20% of the oldest entries
      const keysToRemove = Math.floor(CATEGORY_CACHE_MAX_SIZE * 0.2);
      for (let i = 0; i < keysToRemove; i++) {
        delete CATEGORY_CACHE[cacheKeys[i]];
      }
    }
    
    const validCategories = [
      'groceries', 'dining', 'retail', 'electronics', 'travel', 
      'entertainment', 'utilities', 'health', 'beauty', 'home', 
      'education', 'charity', 'other'
    ];
    
    let category = 'other';
    
    // Only attempt OpenAI if we have an API key
    if (process.env.OPENAI_API_KEY) {
      try {
        // Call the OpenAI API
        // The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a receipt categorization system. Based on the merchant name and items purchased, 
              classify the receipt into one of these categories:
              - groceries
              - dining
              - retail
              - electronics
              - travel
              - entertainment
              - utilities
              - health
              - beauty
              - home
              - education
              - charity
              - other
              
              Respond with just the category name in lowercase, no explanation.`
            },
            {
              role: "user",
              content: `Merchant: ${merchantName}\nItems: ${itemDescriptions}`
            }
          ],
          max_tokens: 20
        });
        
        category = response.choices[0].message.content?.trim().toLowerCase() || 'other';
        
        // Validate that the category is one of our allowed values
        if (!validCategories.includes(category)) {
          category = 'other';
        }
      } catch (openaiError) {
        console.error('OpenAI category inference error:', openaiError);
        // Fall back to rule-based categorization
        category = await fallbackCategorization(merchantName, itemDescriptions);
      }
    } else {
      // If no API key, use rule-based categorization
      category = await fallbackCategorization(merchantName, itemDescriptions);
    }
    
    // Cache the result
    CATEGORY_CACHE[cacheKey] = category;
    
    return category;
  } catch (error) {
    console.error('Category inference error:', error);
    return 'other';
  }
}

/**
 * Simple rule-based categorization as fallback when OpenAI is unavailable
 * @param merchantName The merchant name
 * @param itemDescriptions The item descriptions
 * @returns A category
 */
async function fallbackCategorization(merchantName: string, itemDescriptions: string): Promise<string> {
  try {
    // Try to use the more advanced Tesseract categorization algorithm
    const { inferCategoryFromText } = await import('./tesseractOcrService');
    
    // Convert string itemDescriptions to array of objects for Tesseract categorization
    const items = itemDescriptions.split(',').map(item => ({
      name: item.trim(),
      price: 0
    }));
    
    return inferCategoryFromText(merchantName, items);
  } catch (error) {
    console.warn('Error using Tesseract categorization, falling back to basic keywords', error);
    
    // Basic keyword-based categorization as final fallback
    const merchant = merchantName.toLowerCase();
    const items = itemDescriptions.toLowerCase();
    
    const keywords = {
      groceries: ['grocery', 'supermarket', 'food', 'mart', 'market', 'fresh', 'produce', 'deli'],
      dining: ['restaurant', 'cafe', 'coffee', 'bar', 'grill', 'eatery', 'bistro', 'kitchen', 'diner'],
      retail: ['store', 'shop', 'mall', 'boutique', 'outlet', 'clothing', 'apparel', 'fashion'],
      electronics: ['electronic', 'tech', 'computer', 'phone', 'device', 'gadget', 'digital', 'tv', 'appliance'],
      travel: ['airline', 'hotel', 'motel', 'flight', 'car rental', 'vacation', 'travel', 'booking', 'trip'],
      entertainment: ['movie', 'theater', 'cinema', 'concert', 'show', 'ticket', 'event', 'game', 'streaming'],
      utilities: ['electric', 'water', 'gas', 'power', 'internet', 'phone', 'telecom', 'utility', 'bill'],
      health: ['pharmacy', 'drug', 'medical', 'doctor', 'health', 'hospital', 'clinic', 'care'],
      beauty: ['salon', 'spa', 'cosmetic', 'beauty', 'nail', 'hair', 'makeup', 'barber'],
      home: ['hardware', 'furniture', 'home', 'garden', 'decor', 'improvement', 'repair', 'tool'],
      education: ['school', 'college', 'university', 'course', 'class', 'tuition', 'education', 'book', 'learning'],
      charity: ['donation', 'charity', 'foundation', 'nonprofit', 'fund', 'giving', 'support']
    };
    
    // Check merchant name first
    for (const [category, terms] of Object.entries(keywords)) {
      for (const term of terms) {
        if (merchant.includes(term)) {
          return category;
        }
      }
    }
    
    // Then check items
    for (const [category, terms] of Object.entries(keywords)) {
      for (const term of terms) {
        if (items.includes(term)) {
          return category;
        }
      }
    }
    
    return 'other';
  }
}

export default {
  extractReceiptData,
  inferReceiptCategory
};
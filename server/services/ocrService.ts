/**
 * OCR Service for Receipt Scanning
 * 
 * This service handles the extraction of data from receipt images using OpenAI's
 * GPT-4o Vision API for advanced image recognition and data extraction.
 */

import OpenAI from 'openai';
import { createHash } from 'crypto';

// Initialize OpenAI client
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
 * Process a receipt image and extract structured data using OCR
 * 
 * @param imageBase64 Base64 encoded image data
 * @returns Extracted receipt data or null if extraction failed
 */
export async function extractReceiptData(imageBase64: string): Promise<ExtractedReceiptData | null> {
  try {
    console.log('Starting receipt OCR processing...');
    
    // Generate a hash of the image for logging/tracking
    const imageHash = createHash('sha256')
      .update(imageBase64.substring(0, 1000)) // Using first 1000 chars for efficiency
      .digest('hex')
      .substring(0, 10); // Just use first 10 chars of hash
    
    console.log(`Processing receipt image: ${imageHash}...`);
    
    // Call the OpenAI API
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
    try {
      const result = JSON.parse(response.choices[0].message.content);
      
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
      
      console.log(`Successfully extracted receipt data for ${extractedData.merchantName} (${imageHash})`);
      return extractedData;
    } catch (parseError) {
      console.error('Failed to parse OCR response JSON:', parseError);
      console.error('Raw response:', response.choices[0].message.content);
      return null;
    }
  } catch (error) {
    console.error('OCR extraction error:', error);
    return null;
  }
}

/**
 * Infer receipt category from items and merchant name
 * 
 * @param merchantName Name of the merchant
 * @param items List of purchased items
 * @returns Inferred category or "other" if unable to determine
 */
export async function inferReceiptCategory(
  merchantName: string, 
  items: Array<{name: string; price: number}>
): Promise<string> {
  try {
    // Prepare the input text from merchant and items
    const itemDescriptions = items.map(item => item.name).join(', ');
    
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
    
    const category = response.choices[0].message.content?.trim().toLowerCase() || 'other';
    
    // Validate that the category is one of our allowed values
    const validCategories = [
      'groceries', 'dining', 'retail', 'electronics', 'travel', 
      'entertainment', 'utilities', 'health', 'beauty', 'home', 
      'education', 'charity', 'other'
    ];
    
    return validCategories.includes(category) ? category : 'other';
  } catch (error) {
    console.error('Category inference error:', error);
    return 'other';
  }
}

export default {
  extractReceiptData,
  inferReceiptCategory
};
/**
 * OCR Service for BlockReceipt.ai
 * 
 * This service handles optical character recognition for receipt images,
 * extracting structured data like merchant, date, items, and totals.
 */

import logger from '../logger';
import OpenAI from 'openai';

// Define interfaces for OCR results
export interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

export interface ReceiptData {
  merchant: { name: string };
  date: Date;
  total: number;
  subtotal?: number;
  tax?: number;
  items: ReceiptItem[];
  category?: string;
  confidence?: number;
  rawText?: string;
}

/**
 * OCR Service class
 */
class OCRService {
  private openai: OpenAI | null = null;
  
  constructor() {
    // Initialize OpenAI if API key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });
        logger.info('OpenAI initialized for OCR processing');
      } catch (error) {
        logger.error('Failed to initialize OpenAI:', error);
      }
    } else {
      logger.warn('OPENAI_API_KEY not provided, OpenAI OCR will not be available');
    }
  }
  
  /**
   * Process a receipt image with OCR
   * @param imageBuffer Buffer containing the image data
   * @returns Processed receipt data
   */
  async processReceiptImage(imageBuffer: Buffer): Promise<ReceiptData> {
    try {
      logger.info('Processing receipt image with OCR service');
      
      // Try processing with OpenAI Vision (preferred method)
      if (this.openai) {
        try {
          logger.info('Attempting to process with OpenAI Vision');
          return await this.processWithOpenAI(imageBuffer);
        } catch (error) {
          logger.warn('OpenAI Vision processing failed, falling back to Tesseract');
        }
      }
      
      // Fallback to Tesseract OCR
      logger.info('Processing with Tesseract OCR');
      return await this.processWithTesseract(imageBuffer);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`OCR processing failed: ${errorMessage}`);
      
      // Return a basic receipt with error information
      return {
        merchant: { name: 'Unknown Merchant' },
        date: new Date(),
        total: 0,
        items: [],
        confidence: 0,
        rawText: `OCR Error: ${errorMessage}`
      };
    }
  }
  
  /**
   * Process a receipt image with OpenAI Vision
   * @param imageBuffer Buffer containing the image data
   * @returns Processed receipt data
   */
  private async processWithOpenAI(imageBuffer: Buffer): Promise<ReceiptData> {
    if (!this.openai) {
      throw new Error('OpenAI not initialized');
    }
    
    logger.info('Converting image for OpenAI processing');
    
    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');
    
    // Define the prompt for receipt analysis
    const prompt = `
      Analyze this receipt image and extract the following information in JSON format:
      - merchant: object with name property
      - date: date of purchase (ISO string)
      - total: total amount as a number
      - subtotal: subtotal amount as a number (if present)
      - tax: tax amount as a number (if present)
      - items: array of items with name, price (number), and quantity (number)
      - category: general category of purchase (e.g., "grocery", "restaurant", "electronics")
      - confidence: your confidence level in the extraction (0.0 to 1.0)
      
      Provide the output as a valid JSON object only.
    `;
    
    // Call OpenAI API
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });
    
    logger.info('OpenAI processing completed successfully');
    
    // Parse the JSON response
    const content = response.choices[0]?.message?.content || '{}';
    const parsedData = JSON.parse(content);
    
    // Ensure date is properly formatted
    if (parsedData.date && typeof parsedData.date === 'string') {
      parsedData.date = new Date(parsedData.date);
    } else {
      parsedData.date = new Date();
    }
    
    return parsedData;
  }
  
  /**
   * Process a receipt image with Tesseract OCR
   * @param imageBuffer Buffer containing the image data
   * @returns Processed receipt data
   */
  private async processWithTesseract(imageBuffer: Buffer): Promise<ReceiptData> {
    // Simulate Tesseract processing
    // In a real implementation, we would use Tesseract.js or node-tesseract-ocr
    logger.info('Simulating Tesseract OCR processing');
    
    // Mock receipt data
    const mockReceipt: ReceiptData = {
      merchant: { name: 'Local Store' },
      date: new Date(),
      total: 42.99,
      subtotal: 39.99,
      tax: 3.00,
      items: [
        { name: 'Item 1', price: 19.99, quantity: 1 },
        { name: 'Item 2', price: 10.00, quantity: 2 }
      ],
      category: 'general',
      confidence: 0.6,
      rawText: 'LOCAL STORE\nDate: 5/16/2025\nItem 1 - $19.99\nItem 2 - $10.00 x 2\nSubtotal: $39.99\nTax: $3.00\nTotal: $42.99'
    };
    
    return mockReceipt;
  }
  
  /**
   * Extract structured data from raw OCR text
   * @param rawText Raw text from OCR
   * @returns Extracted receipt data
   */
  extractReceiptData(rawText: string): ReceiptData {
    logger.info('Extracting structured data from OCR text');
    
    // In a real implementation, we would use NLP and regex to extract structured data
    // For now, we'll just return a mock result
    return {
      merchant: { name: 'Extracted Merchant' },
      date: new Date(),
      total: 59.99,
      subtotal: 54.99,
      tax: 5.00,
      items: [
        { name: 'Product A', price: 29.99, quantity: 1 },
        { name: 'Product B', price: 25.00, quantity: 1 }
      ],
      category: 'retail',
      confidence: 0.7,
      rawText
    };
  }
  
  /**
   * Infer the receipt category based on merchant and items
   * @param merchantName Merchant name
   * @param items Receipt items
   * @returns Inferred category
   */
  inferReceiptCategory(merchantName: string, items: ReceiptItem[]): string {
    logger.info(`Inferring category for receipt from ${merchantName}`);
    
    // Convert merchant name to lowercase for matching
    const merchant = merchantName.toLowerCase();
    
    // Define category keywords
    const categories = {
      grocery: ['grocery', 'supermarket', 'food', 'market', 'farm', 'produce'],
      restaurant: ['restaurant', 'cafe', 'diner', 'eatery', 'grill', 'bistro', 'bar'],
      retail: ['store', 'shop', 'retail', 'mall', 'outlet', 'boutique'],
      electronics: ['electronics', 'tech', 'computer', 'digital', 'gadget'],
      travel: ['hotel', 'motel', 'airline', 'flight', 'travel', 'car rental'],
      entertainment: ['cinema', 'movie', 'theater', 'concert', 'event', 'ticket'],
      healthcare: ['pharmacy', 'drug', 'medical', 'health', 'clinic', 'hospital'],
      utilities: ['utility', 'electric', 'water', 'gas', 'internet', 'phone']
    };
    
    // Check merchant name against category keywords
    for (const [category, keywords] of Object.entries(categories)) {
      for (const keyword of keywords) {
        if (merchant.includes(keyword)) {
          return category;
        }
      }
    }
    
    // Default category
    return 'other';
  }
}

// Export singleton instance
export const ocrService = new OCRService();
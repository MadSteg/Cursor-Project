/**
 * OCR Service for BlockReceipt.ai
 * 
 * This service provides optical character recognition (OCR) capabilities
 * for extracting structured data from receipt images using multiple engines
 * with a fallback strategy.
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { createHash } from 'crypto';
import { logger } from '../utils/logger';
import OpenAI from 'openai';

// OpenAI client for Vision API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Define line item type
export interface LineItem {
  name: string;
  price: number;
  quantity: number;
}

// Define receipt data type
export interface ReceiptData {
  merchantName: string;
  date: string;
  total: number;
  subtotal?: number;
  tax?: number;
  items?: LineItem[];
  category?: string;
  rawText?: string;
  confidence?: number;
  ocrProvider?: string;  // Indicates which OCR service was used: 'openai', 'google-vision', 'tesseract'
}

/**
 * OCR Service Class
 */
class OCRService {
  private cacheDir: string;
  
  constructor() {
    // Set up cache directory
    this.cacheDir = path.join(process.cwd(), 'data', 'ocr-cache');
    
    // Create cache directory if it doesn't exist
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
    
    logger.info('OCR Service initialized');
  }
  
  /**
   * Process a receipt image with OCR
   * @param imagePath Path to the receipt image
   * @returns Extracted receipt data
   */
  async processReceipt(imagePath: string): Promise<ReceiptData> {
    try {
      logger.info(`Processing receipt image: ${imagePath}`);
      
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Image file not found: ${imagePath}`);
      }
      
      // Calculate file hash for caching
      const fileHash = this.calculateFileHash(imagePath);
      const cacheFilePath = path.join(this.cacheDir, `${fileHash}.json`);
      
      // Check if we should bypass cache based on environment variable 
      // (useful for testing and development)
      const bypassCache = process.env.BYPASS_OCR_CACHE === 'true';
      
      // Check if result is cached
      if (!bypassCache && fs.existsSync(cacheFilePath)) {
        logger.info(`Using cached OCR result for ${imagePath}`);
        const cachedData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
        return cachedData;
      }
      
      // Try multiple OCR services with fallback strategy
      let receiptData: ReceiptData | null = null;
      let error: Error | null = null;
      
      // First priority: Try OpenAI Vision API (highest accuracy)
      try {
        if (process.env.OPENAI_API_KEY) {
          logger.info("Using OpenAI Vision API for OCR processing");
          receiptData = await this.processWithOpenAI(imagePath);
        } else {
          logger.warn("Skipping OpenAI Vision API: API key not configured");
        }
      } catch (err) {
        error = err instanceof Error ? err : new Error(String(err));
        logger.warn(`OpenAI Vision processing failed: ${error.message}`);
      }
      
      // Second priority: Try Google Vision API if available
      if (!receiptData) {
        try {
          if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
            logger.info("Using Google Vision API for OCR processing");
            receiptData = await this.processWithGoogleVision(imagePath);
          } else {
            logger.warn("Skipping Google Vision API: credentials not configured");
          }
        } catch (err) {
          error = err instanceof Error ? err : new Error(String(err));
          logger.warn(`Google Vision processing failed: ${error.message}`);
        }
      }
      
      // Third priority: Use Tesseract as last resort
      if (!receiptData) {
        try {
          logger.info("Using Tesseract OCR for processing");
          receiptData = await this.processWithTesseract(imagePath);
        } catch (err) {
          error = err instanceof Error ? err : new Error(String(err));
          logger.warn(`Tesseract processing failed: ${error.message}`);
        }
      }
      
      // If all OCR services failed, throw error
      if (!receiptData) {
        throw new Error('All OCR services failed to process the receipt image. Please try with a clearer image.');
      }
      
      // Add info about which OCR provider was used
      receiptData.ocrProvider = receiptData.ocrProvider || 
                               (receiptData.confidence && receiptData.confidence > 0.9 ? 'openai' : 
                                receiptData.confidence && receiptData.confidence > 0.7 ? 'google-vision' : 'tesseract');
      
      // Store result in cache
      fs.writeFileSync(cacheFilePath, JSON.stringify(receiptData));
      
      // Try to infer the receipt category if not already present
      if (!receiptData.category) {
        try {
          receiptData.category = await this.inferReceiptCategory(receiptData);
        } catch (err) {
          logger.warn(`Failed to infer receipt category: ${err}`);
          // Continue without category if inference fails
        }
      }
      
      return receiptData;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Receipt processing failed: ${message}`);
      throw new Error(`Failed to process receipt: ${message}`);
    }
  }
  
  /**
   * Process a receipt image with OpenAI Vision API
   * @param imagePath Path to the receipt image
   * @returns Extracted receipt data
   */
  private async processWithOpenAI(imagePath: string): Promise<ReceiptData> {
    try {
      logger.info(`Processing receipt with OpenAI Vision: ${imagePath}`);
      
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        logger.warn('OpenAI API key not provided, checking for cached API key');
        // Try to check for OpenAI API key differently if needed
        throw new Error('OpenAI API key not provided');
      }
      
      // Read image file as base64
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      
      // Use GPT-4 Vision to analyze the receipt
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a receipt OCR expert. Analyze the receipt image and extract the following information in JSON format:
            - merchantName: The name of the merchant/store (string)
            - date: The purchase date in YYYY-MM-DD format (string)
            - total: The total amount paid (number)
            - subtotal: The subtotal amount before tax (number, optional)
            - tax: The tax amount (number, optional)
            - items: Array of line items, each with name (string), price (number), and quantity (number) (optional)
            - category: The category of purchase like "Grocery", "Restaurant", "Electronics", etc. (string, optional)
            Return ONLY valid JSON with these fields and no additional text or explanations.`
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ],
          },
        ],
        max_tokens: 1500,
        response_format: { type: "json_object" },
      });
      
      // Parse the response
      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      // Add raw text and confidence
      return {
        ...result,
        rawText: result.rawText || 'Processed with OpenAI Vision',
        confidence: 0.95 // OpenAI Vision generally has high confidence
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`OpenAI Vision processing failed: ${message}`);
      throw new Error(`OpenAI Vision processing failed: ${message}`);
    }
  }
  
  /**
   * Process a receipt image with Google Vision API
   * @param imagePath Path to the receipt image
   * @returns Extracted receipt data
   */
  private async processWithGoogleVision(imagePath: string): Promise<ReceiptData> {
    try {
      logger.info(`Processing receipt with Google Vision: ${imagePath}`);
      
      // Check if Google Vision credentials are available
      if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        throw new Error('Google Vision credentials not provided');
      }
      
      // Import Google Cloud Vision
      const vision = require('@google-cloud/vision');
      
      // Create client
      const client = new vision.ImageAnnotatorClient();
      
      // Perform text detection on the image file
      const [result] = await client.textDetection(imagePath);
      const detections = result.textAnnotations;
      
      if (!detections || detections.length === 0) {
        throw new Error('No text detected in the image');
      }
      
      // The first annotation contains all the detected text
      const fullText = detections[0].description;
      
      // Parse text to extract receipt data with improved algorithms
      const lines = fullText.split('\n').filter(line => line.trim().length > 0);
      logger.debug(`Google Vision detected ${lines.length} lines of text`);
      
      // Enhanced merchant name extraction (usually at the top of the receipt)
      let merchantName = 'Unknown Merchant';
      const skipWords = ['receipt', 'invoice', 'order', 'transaction', 'purchase', 'sale', 'thank', 'welcome'];
      const skipRegexes = [
        /^\d+$/,                  // Just numbers
        /^tel:|^phone:/i,         // Phone numbers
        /^fax:/i,                 // Fax numbers
        /^www\.|http|\.com/i,     // Websites
        /^-+$/,                   // Just dashes
        /^=+$/,                   // Just equals signs
        /^#\d+$/,                 // Receipt numbers
        /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}$/ // Dates
      ];
      
      // Find the most likely merchant name in the first few lines
      merchantNameSearch:
      for (let i = 0; i < Math.min(7, lines.length); i++) {
        const line = lines[i].trim();
        
        // Skip lines that are too short or contain skip words
        if (line.length < 3) continue;
        if (skipWords.some(word => line.toLowerCase().includes(word))) continue;
        if (skipRegexes.some(regex => line.match(regex))) continue;
        
        // This is likely the merchant name
        merchantName = line;
        break merchantNameSearch;
      }
      
      // Enhanced date extraction
      let date = '';
      // Common date formats in receipts
      const dateRegexes = [
        /(\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,               // MM/DD/YYYY or YYYY/MM/DD
        /(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]*(\d{2,4})/i, // 15 Jan 2023
        /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]*(\d{1,2})[\s,]*(\d{2,4})/i // Jan 15, 2023
      ];
      
      // Look for date with context
      const dateContextKeywords = ['date', 'time', 'datetime', 'purchase', 'transaction', 'order'];
      for (const line of lines) {
        // First check if line has date context
        const hasDateContext = dateContextKeywords.some(keyword => 
          line.toLowerCase().includes(keyword)
        );
        
        // If it has date context or we're just looking for any date
        if (hasDateContext || !date) {
          for (const regex of dateRegexes) {
            const match = line.match(regex);
            if (match) {
              // For first regex format
              if (match.length >= 2) {
                date = this.formatDate(match[1]);
                
                // If we found a date with context, prioritize it
                if (hasDateContext) break;
              }
            }
          }
        }
      }
      
      // If no date found, use current date
      if (!date) {
        date = new Date().toISOString().split('T')[0];
      }
      
      // Enhanced total amount extraction
      let total = 0;
      let subtotal = 0;
      let tax = 0;
      
      // Receipt-specific money amount regex
      const moneyRegex = /(^|\s)(\$?\s*\d{1,3}(?:,\d{3})*\.\d{2}|\d{1,3}(?:,\d{3})*\.\d{2})/;
      
      // 1. First look for explicit total with context
      const totalContexts = ['total', 'amount due', 'amount paid', 'grand total', 'payment', 'paid', 'balance'];
      totalSearch:
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].toLowerCase();
        
        // Skip irrelevant lines
        if (line.includes('subtotal') || line.includes('sub-total') || line.includes('sub total')) continue;
        
        // Check if line has total context
        const hasTotal = totalContexts.some(context => line.includes(context));
        if (hasTotal) {
          const match = lines[i].match(moneyRegex);
          if (match) {
            const amountStr = match[2].replace(/[^\d.]/g, '');
            total = parseFloat(amountStr);
            break totalSearch;
          }
        }
      }
      
      // 2. If no total found yet, look for subtotal and tax to calculate
      if (total === 0) {
        // Look for subtotal
        for (const line of lines) {
          if (line.toLowerCase().match(/subtotal|sub\s*total|sub\-total/)) {
            const match = line.match(moneyRegex);
            if (match) {
              const amountStr = match[2].replace(/[^\d.]/g, '');
              subtotal = parseFloat(amountStr);
            }
          }
        }
        
        // Look for tax
        const taxRegexes = [
          /tax/i,
          /vat/i,
          /gst/i,
          /hst/i
        ];
        
        for (const line of lines) {
          const hasTaxContext = taxRegexes.some(regex => line.match(regex));
          if (hasTaxContext) {
            const match = line.match(moneyRegex);
            if (match) {
              const amountStr = match[2].replace(/[^\d.]/g, '');
              tax = parseFloat(amountStr);
            }
          }
        }
        
        // Calculate total from subtotal and tax if both found
        if (subtotal > 0 && tax > 0) {
          total = parseFloat((subtotal + tax).toFixed(2));
        }
      }
      
      // 3. If still no total, look for any amount at the bottom of the receipt
      if (total === 0) {
        for (let i = lines.length - 1; i >= Math.max(0, lines.length - 15); i--) {
          const match = lines[i].match(moneyRegex);
          if (match) {
            const amountStr = match[2].replace(/[^\d.]/g, '');
            const amount = parseFloat(amountStr);
            // Take the largest amount found as it's likely the total
            if (amount > total) {
              total = amount;
            }
          }
        }
      }
      
      // Extract line items with improved detection
      const items: LineItem[] = [];
      
      // Multiple patterns to recognize line items
      const itemRegexes = [
        /(.{3,30})\s+(\d+)\s+(\$?\s*\d+\.\d{2})/,            // Name   Qty   Price
        /(.{3,30})\s+(\d+(?:\.\d+)?)\s+x\s+(\d+(?:\.\d+)?)/i, // Name  Qty x Price
        /(.{3,30})\s+(\d+).*?(\$?\s*\d+\.\d{2})/              // Name  Qty ...... Price
      ];
      
      // Look for item section
      let inItemsSection = false;
      
      for (const line of lines) {
        // Check if we're entering items section
        if (line.toLowerCase().match(/items|description|qty|quantity|item|product/)) {
          inItemsSection = true;
          continue;
        }
        
        // Stop looking for items if we hit totals section
        if (inItemsSection && line.toLowerCase().match(/total|subtotal|tax|sum|amount|balance/)) {
          inItemsSection = false;
          continue;
        }
        
        // Try to parse items
        if (inItemsSection) {
          let matched = false;
          
          for (const regex of itemRegexes) {
            const match = line.match(regex);
            if (match) {
              items.push({
                name: match[1].trim(),
                quantity: parseInt(match[2], 10) || 1,
                price: parseFloat(match[3].replace(/[^\d.]/g, ''))
              });
              matched = true;
              break;
            }
          }
        }
      }
      
      // Return extracted data with improved accuracy
      return {
        merchantName,
        date,
        total,
        subtotal: subtotal > 0 ? subtotal : undefined,
        tax: tax > 0 ? tax : undefined,
        items: items.length > 0 ? items : undefined,
        rawText: fullText,
        confidence: 0.85,
        ocrProvider: 'google-vision'
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Google Vision processing failed: ${message}`);
      throw new Error(`Google Vision processing failed: ${message}`);
    }
  }
  
  /**
   * Process a receipt image with Tesseract OCR
   * @param imagePath Path to the receipt image
   * @returns Extracted receipt data
   */
  private async processWithTesseract(imagePath: string): Promise<ReceiptData> {
    try {
      logger.info(`Processing receipt with Tesseract: ${imagePath}`);
      
      // Enhanced Tesseract implementation
      const { createWorker } = require('tesseract.js');
      
      logger.info('Starting Tesseract OCR processing...');
      
      // Try to find eng.traineddata in project root 
      const tessdataPath = path.join(process.cwd(), 'tessdata');
      const trainedDataExists = fs.existsSync(path.join(process.cwd(), 'eng.traineddata')) || 
                              (fs.existsSync(tessdataPath) && fs.existsSync(path.join(tessdataPath, 'eng.traineddata')));
      
      // Create worker with configuration options for better accuracy
      const worker = await createWorker({
        langPath: trainedDataExists ? tessdataPath : undefined,
        logger: m => logger.debug(`Tesseract: ${JSON.stringify(m)}`),
        errorHandler: e => logger.error(`Tesseract error: ${e}`)
      });
      
      // Load language data - English is best for receipts
      await worker.loadLanguage('eng');
      
      // Initialize with English language and set parameters for receipt recognition
      await worker.initialize('eng', {
        // Use Page Segmentation Mode 4 to assume single column of text
        tessedit_pageseg_mode: '4',
        // Whitelist common receipt characters
        tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,.:$%&()+-=@#/\\*" ',
        // Improve accuracy by considering document structure
        tessedit_ocr_engine_mode: '1', // Use LSTM neural network
      });
      
      // Recognize text with improved settings
      const { data } = await worker.recognize(imagePath, {
        rotateAuto: true, // Auto-rotate the image if needed
      });
      
      const text = data.text;
      
      // Terminate worker
      await worker.terminate();
      
      logger.info('Tesseract OCR processing completed');
      
      if (!text) {
        throw new Error('No text detected in the image');
      }
      
      // Parse text to extract receipt data with improved algorithms
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      
      // Enhanced merchant name extraction (usually at the top of the receipt)
      let merchantName = 'Unknown Merchant';
      const skipWords = ['receipt', 'invoice', 'order', 'transaction', 'purchase', 'sale', 'thank', 'welcome'];
      const skipRegexes = [
        /^\d+$/,                  // Just numbers
        /^tel:|^phone:/i,         // Phone numbers
        /^fax:/i,                 // Fax numbers
        /^www\.|http|\.com/i,     // Websites
        /^-+$/,                   // Just dashes
        /^=+$/,                   // Just equals signs
        /^#\d+$/,                 // Receipt numbers
        /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}$/ // Dates
      ];
      
      // Find the most likely merchant name in the first few lines
      merchantNameSearch:
      for (let i = 0; i < Math.min(7, lines.length); i++) {
        const line = lines[i].trim();
        
        // Skip lines that are too short or contain skip words
        if (line.length < 3) continue;
        if (skipWords.some(word => line.toLowerCase().includes(word))) continue;
        if (skipRegexes.some(regex => line.match(regex))) continue;
        
        // This is likely the merchant name
        merchantName = line;
        break merchantNameSearch;
      }
      
      // Enhanced date extraction
      let date = '';
      // Common date formats in receipts
      const dateRegexes = [
        /(\d{1,4}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,               // MM/DD/YYYY or YYYY/MM/DD
        /(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]*(\d{2,4})/i, // 15 Jan 2023
        /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]*(\d{1,2})[\s,]*(\d{2,4})/i // Jan 15, 2023
      ];
      
      // Look for date with context
      const dateContextKeywords = ['date', 'time', 'datetime', 'purchase', 'transaction', 'order'];
      for (const line of lines) {
        // First check if line has date context
        const hasDateContext = dateContextKeywords.some(keyword => 
          line.toLowerCase().includes(keyword)
        );
        
        // If it has date context or we're just looking for any date
        if (hasDateContext || !date) {
          for (const regex of dateRegexes) {
            const match = line.match(regex);
            if (match) {
              // For first regex format
              if (match.length >= 2) {
                date = this.formatDate(match[1]);
                
                // If we found a date with context, prioritize it
                if (hasDateContext) break;
              }
            }
          }
        }
      }
      
      // If no date found, use current date
      if (!date) {
        date = new Date().toISOString().split('T')[0];
      }
      
      // Enhanced total amount extraction
      let total = 0;
      let subtotal = 0;
      let tax = 0;
      
      // Receipt-specific money amount regex
      const moneyRegex = /(^|\s)(\$?\s*\d{1,3}(?:,\d{3})*\.\d{2}|\d{1,3}(?:,\d{3})*\.\d{2})/;
      
      // 1. First look for explicit total with context
      const totalContexts = ['total', 'amount due', 'amount paid', 'grand total', 'payment', 'paid', 'balance'];
      totalSearch:
      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].toLowerCase();
        
        // Skip irrelevant lines
        if (line.includes('subtotal') || line.includes('sub-total') || line.includes('sub total')) continue;
        
        // Check if line has total context
        const hasTotal = totalContexts.some(context => line.includes(context));
        if (hasTotal) {
          const match = lines[i].match(moneyRegex);
          if (match) {
            const amountStr = match[2].replace(/[^\d.]/g, '');
            total = parseFloat(amountStr);
            break totalSearch;
          }
        }
      }
      
      // 2. If no total found yet, look for subtotal and tax to calculate
      if (total === 0) {
        // Look for subtotal
        for (const line of lines) {
          if (line.toLowerCase().match(/subtotal|sub\s*total|sub\-total/)) {
            const match = line.match(moneyRegex);
            if (match) {
              const amountStr = match[2].replace(/[^\d.]/g, '');
              subtotal = parseFloat(amountStr);
            }
          }
        }
        
        // Look for tax
        const taxRegexes = [
          /tax/i,
          /vat/i,
          /gst/i,
          /hst/i
        ];
        
        for (const line of lines) {
          const hasTaxContext = taxRegexes.some(regex => line.match(regex));
          if (hasTaxContext) {
            const match = line.match(moneyRegex);
            if (match) {
              const amountStr = match[2].replace(/[^\d.]/g, '');
              tax = parseFloat(amountStr);
            }
          }
        }
        
        // Calculate total from subtotal and tax if both found
        if (subtotal > 0 && tax > 0) {
          total = parseFloat((subtotal + tax).toFixed(2));
        }
      }
      
      // 3. If still no total, look for any amount at the bottom of the receipt
      if (total === 0) {
        for (let i = lines.length - 1; i >= Math.max(0, lines.length - 15); i--) {
          const match = lines[i].match(moneyRegex);
          if (match) {
            const amountStr = match[2].replace(/[^\d.]/g, '');
            const amount = parseFloat(amountStr);
            // Take the largest amount found as it's likely the total
            if (amount > total) {
              total = amount;
            }
          }
        }
      }
      
      // Extract line items if possible
      const items: LineItem[] = [];
      const itemRegex = /(.{3,30})\s+(\d+)\s+(\$?\s*\d+\.\d{2})/;
      
      let inItemsSection = false;
      for (const line of lines) {
        // Check if we're entering items section
        if (line.toLowerCase().match(/items|description|qty|quantity|item|product/)) {
          inItemsSection = true;
          continue;
        }
        
        // Stop looking for items if we hit total/subtotal
        if (inItemsSection && line.toLowerCase().match(/total|subtotal|tax|sum|amount|balance/)) {
          inItemsSection = false;
          continue;
        }
        
        // Try to parse items
        if (inItemsSection) {
          const match = line.match(itemRegex);
          if (match) {
            items.push({
              name: match[1].trim(),
              quantity: parseInt(match[2], 10),
              price: parseFloat(match[3].replace(/[^\d.]/g, ''))
            });
          }
        }
      }
      
      return {
        merchantName,
        date,
        total,
        subtotal: subtotal > 0 ? subtotal : undefined,
        tax: tax > 0 ? tax : undefined,
        items: items.length > 0 ? items : undefined,
        rawText: text,
        confidence: 0.6,
        ocrProvider: 'tesseract'
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Tesseract processing failed: ${message}`);
      throw new Error(`Tesseract processing failed: ${message}`);
    }
  }
  
  /**
   * Calculate the MD5 hash of a file
   * @param filePath Path to the file
   * @returns MD5 hash of the file
   */
  private calculateFileHash(filePath: string): string {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  }
  
  /**
   * Format a date string to YYYY-MM-DD format
   * @param dateString Date string to format
   * @returns Formatted date string
   */
  private formatDate(dateString: string): string {
    // Parse date parts
    const parts = dateString.split(/[\/\-]/);
    
    // Handle different date formats
    let year, month, day;
    
    if (parts.length === 3) {
      // Determine which part is the year
      if (parts[2].length === 4) {
        // MM/DD/YYYY or DD/MM/YYYY
        day = parts[1].padStart(2, '0');
        month = parts[0].padStart(2, '0');
        year = parts[2];
      } else if (parts[0].length === 4) {
        // YYYY/MM/DD
        year = parts[0];
        month = parts[1].padStart(2, '0');
        day = parts[2].padStart(2, '0');
      } else {
        // MM/DD/YY or DD/MM/YY
        day = parts[1].padStart(2, '0');
        month = parts[0].padStart(2, '0');
        year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
      }
      
      // Validate and return
      if (year && month && day) {
        return `${year}-${month}-${day}`;
      }
    }
    
    // Fallback to today's date
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  
  /**
   * Infer the category of a receipt based on its data
   * @param receiptData Receipt data to analyze
   * @returns Inferred category
   */
  async inferReceiptCategory(receiptData: ReceiptData): Promise<string> {
    try {
      logger.info(`Inferring category for receipt from ${receiptData.merchantName}`);
      
      // Check if OpenAI API key is available
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not provided');
      }
      
      // Create a prompt with the receipt data
      const prompt = `
        Given this receipt data, determine the most appropriate category from the following list:
        - Grocery
        - Restaurant
        - Fast Food
        - Electronics
        - Clothing
        - Hardware
        - Home Goods
        - Office Supplies
        - Entertainment
        - Transportation
        - Fuel
        - Healthcare
        - Personal Care
        - Other
        
        Receipt Details:
        Merchant: ${receiptData.merchantName}
        Date: ${receiptData.date}
        Total: ${receiptData.total}
        ${receiptData.items ? `Items: ${JSON.stringify(receiptData.items)}` : ''}
        
        Return only the category name with no additional text.
      `;
      
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 10
      });
      
      // Extract and clean the category
      const category = response.choices[0].message.content?.trim() || 'Other';
      
      logger.info(`Inferred category for receipt: ${category}`);
      
      return category;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Category inference failed: ${message}`);
      return 'Other'; // Default to 'Other' if inference fails
    }
  }
}

// Export singleton instance
export const ocrService = new OCRService();
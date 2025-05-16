/**
 * OCR Routes for Receipt Processing
 * 
 * These routes handle receipt image uploads and OCR processing
 */

import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { extractReceiptData, inferReceiptCategory } from '../services/ocrService';

const router = Router();

// Configure multer for temporary in-memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Schema for base64 image upload
const base64UploadSchema = z.object({
  image: z.string().min(50), // Minimum length to ensure it's a valid base64 image
  fileName: z.string().optional(),
});

/**
 * Process a receipt image uploaded as multipart form data
 * POST /api/ocr/upload
 */
router.post('/upload', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No receipt image provided' });
    }
    
    // Process with our enhanced OCR pipeline (Google Vision or OpenAI fallback)
    console.log('Starting enhanced receipt OCR processing...');
    console.log('Processing receipt image with buffer size:', req.file.buffer.length);
    
    // Pass the buffer directly to the new OCR service
    const extractedData = await extractReceiptData(req.file.buffer);
    
    if (!extractedData) {
      console.error('All OCR methods failed. Unable to process receipt image.');
      return res.status(422).json({ 
        success: false,
        error: 'Failed to process receipt image. Please try again with a clearer image.'
      });
    }
    
    // If category was not identified, try to infer it
    if (!extractedData.category) {
      try {
        extractedData.category = await inferReceiptCategory(
          extractedData.merchantName,
          extractedData.items.map(item => item.name).join(', ')
        );
      } catch (categoryError) {
        console.warn('Failed to infer receipt category:', categoryError);
        extractedData.category = 'other';
      }
    }
    
    res.json({
      success: true,
      data: extractedData,
      source: extractedData.confidence > 0.8 ? 'openai' : 'tesseract'
    });
  } catch (error) {
    console.error('Receipt upload error:', error);
    res.status(500).json({ 
      error: 'Failed to process receipt image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Process a receipt image uploaded as base64
 * POST /api/ocr/process
 */
router.post('/process', async (req, res) => {
  try {
    // Validate the request body
    const validated = base64UploadSchema.safeParse(req.body);
    
    if (!validated.success) {
      return res.status(400).json({ 
        error: 'Invalid request body',
        details: validated.error.format()
      });
    }
    
    const { image } = validated.data;
    
    // Remove any data URL prefix if present
    const base64Image = image.includes('base64,') 
      ? image.split('base64,')[1] 
      : image;
    
    // Process with our robust OCR pipeline (includes both OpenAI and Tesseract with fallbacks)
    console.log('Starting receipt OCR processing...');
    console.log('Processing receipt image:', base64Image.substring(0, 20) + '...');
    
    const extractedData = await extractReceiptData(base64Image);
    
    if (!extractedData) {
      console.error('All OCR methods failed. Unable to process receipt image.');
      return res.status(422).json({ 
        success: false,
        error: 'Failed to process receipt image. Please try again with a clearer image.'
      });
    }
    
    // If category was not identified, try to infer it
    if (!extractedData.category) {
      try {
        extractedData.category = await inferReceiptCategory(
          extractedData.merchantName,
          extractedData.items.map(item => item.name).join(', ')
        );
      } catch (categoryError) {
        console.warn('Failed to infer receipt category:', categoryError);
        extractedData.category = 'other';
      }
    }
    
    res.json({
      success: true,
      data: extractedData,
      source: extractedData.confidence > 0.8 ? 'openai' : 'tesseract'
    });
  } catch (error) {
    console.error('Receipt processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process receipt image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
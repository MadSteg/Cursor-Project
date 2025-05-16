/**
 * Auto Process Receipt Route
 * 
 * This route handles automatic receipt processing without requiring wallet authentication.
 * It's intended for development and testing only.
 */

import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
// Import the new Google Cloud Vision OCR service instead of the old Tesseract-based one
import { processReceiptImage } from '../services/ocrService';
import { encryptLineItems } from '../utils/encryptLineItems';
import { createNFTPurchaseTask } from '../services/taskQueue';
import { metadataService } from '../services/metadataService';
import { tacoService } from '../services/tacoService';

const router = express.Router();

// Create uploads directory if it doesn't exist
const __filename = new URL(import.meta.url).pathname;
const projectRoot = path.resolve(path.dirname(__filename), '../../');
const uploadDir = path.join(projectRoot, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname) || '.jpg';
    cb(null, 'receipt-' + uniqueSuffix + extension);
  }
});

// Create multer upload handler
const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (_req, file, cb) => {
    // Accept only images and PDFs
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const mimeTypeValid = allowedTypes.test(file.mimetype);
    const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimeTypeValid && extValid) {
      return cb(null, true);
    }
    cb(new Error('Only .jpeg, .jpg, .png, .gif and .pdf files are allowed!'));
  }
}).single('receipt');

// Route for uploading and automatically processing receipt
router.post('/auto-process', (req: Request, res: Response) => {
  // Use multer to handle file upload
  uploadMiddleware(req, res, async (err) => {
    // Get the wallet address from request body or use a development fallback
    const walletAddress = req.body.walletAddress || '0xDEV000000000000000000000000000000000WALLET';
    
    // Handle file upload errors
    if (err) {
      console.error('File upload error:', err.message);
      return res.status(400).json({ 
        success: false, 
        message: `File upload error: ${err.message}` 
      });
    }

    try {
      // Validate file presence
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: 'No file uploaded'
        });
      }

      console.log(`Auto-processing receipt: ${req.file.originalname} (${req.file.size} bytes) saved as ${req.file.filename}`);

      // Extract data from receipt using Google Cloud Vision
      const visionReceiptData = await processReceiptImage(req.file.path);
      
      // Map the Google Vision receipt format to our application format
      const receiptData = {
        merchantName: visionReceiptData.merchant,
        date: visionReceiptData.date,
        items: visionReceiptData.items.map(item => ({
          name: item.description,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal: visionReceiptData.subtotal || 0,
        tax: visionReceiptData.tax || 0,
        total: visionReceiptData.total,
        rawText: '',
        confidence: 0.9 // Google Vision typically has high confidence
      };
      
      // Validate receipt data extraction
      if (!receiptData) {
        return res.status(400).json({
          success: false,
          message: "Failed to extract receipt data. Please try a clearer image."
        });
      }

      if (!receiptData.items || !Array.isArray(receiptData.items)) {
        return res.status(400).json({
          success: false,
          message: "Receipt items not detected. Please try a different receipt."
        });
      }

      // Generate receipt ID (simulated, would usually come from a database)
      const receiptId = Date.now().toString();
      
      // Create encrypted metadata for TACo
      let encryptedData = null;
      try {
        if (tacoService) {
          encryptedData = await tacoService.encryptReceiptMetadata({
            items: receiptData.items,
            merchantName: receiptData.merchantName,
            date: receiptData.date,
            total: receiptData.total,
            subtotal: receiptData.subtotal,
            tax: receiptData.tax
          });
        }
      } catch (encryptionError) {
        console.error('Error encrypting receipt data:', encryptionError);
        // Continue without encryption if it fails
      }
      
      // Format data for response
      const responseData = {
        id: receiptId,
        merchantName: receiptData.merchantName,
        date: receiptData.date,
        items: receiptData.items,
        total: receiptData.total,
        subtotal: receiptData.subtotal,
        tax: receiptData.tax,
        confidence: receiptData.confidence,
        imagePath: req.file.path,
        nftGift: null as any,
        encryptedMetadata: null as any
      };

      // Encrypt line items (for privacy)
      const encryptedItems = await encryptLineItems(walletAddress, receiptData);
      
      // Status for NFT gift - assume eligible
      let nftGiftStatus = {
        status: 'processing',
        message: 'Your NFT receipt is being processed and will be minted shortly.',
        eligible: true
      };
      
      // Prepare encrypted metadata
      const encryptedMetadataInfo = encryptedData ? {
        capsule: encryptedData.capsule,
        ciphertext: encryptedData.ciphertext
      } : undefined;
      
      // Create a task for processing the NFT
      const purchaseTask = createNFTPurchaseTask(
        walletAddress, 
        receiptId, 
        receiptData,
        encryptedMetadataInfo
      );
      
      // Update NFT gift status with task ID
      nftGiftStatus = {
        status: 'processing',
        message: 'Your NFT receipt is being processed automatically.',
        eligible: true
      };
      
      // Add task ID to the status object if available
      if (purchaseTask && purchaseTask.id) {
        (nftGiftStatus as any).taskId = purchaseTask.id;
      }
      
      // Add NFT gift status to response
      responseData.nftGift = nftGiftStatus;
      
      // Add encrypted metadata to response if available
      if (encryptedData) {
        responseData.encryptedMetadata = {
          available: true,
          encryptedItems
        };
      }
      
      // Return successful response
      res.status(200).json({
        success: true,
        message: 'Receipt processed successfully and NFT minting started',
        data: responseData
      });
      
    } catch (error: any) {
      console.error('Error processing receipt:', error);
      res.status(500).json({
        success: false,
        message: `Error processing receipt: ${error.message || 'Unknown error'}`,
      });
    }
  });
});

// Route for checking task status
router.get('/task/:taskId/status', async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    
    // In development/testing we'll just simulate a task status
    // This would normally come from a database or task queue service
    const mockStatus = {
      id: taskId,
      status: getTaskStatusByTime(taskId),
      progress: getTaskProgressByTime(taskId),
      result: getTaskResult(taskId),
      error: null
    };
    
    res.json({
      success: true,
      status: mockStatus.status,
      progress: mockStatus.progress,
      result: mockStatus.result,
      error: mockStatus.error
    });
  } catch (error: any) {
    console.error('Error getting task status:', error);
    res.status(500).json({
      success: false,
      message: `Error getting task status: ${error.message || 'Unknown error'}`
    });
  }
});

// Helper functions for mock task status in development
function getTaskStatusByTime(taskId: string): 'pending' | 'processing' | 'completed' | 'failed' {
  const now = Date.now();
  const taskCreationTime = parseInt(taskId.split('-')[0] || '0', 10);
  const timeDiff = now - taskCreationTime;
  
  // Task lifecycle: pending (0-5s) -> processing (5-15s) -> completed (15s+)
  if (timeDiff < 5000) return 'pending';
  if (timeDiff < 15000) return 'processing';
  return 'completed';
}

function getTaskProgressByTime(taskId: string): number {
  const now = Date.now();
  const taskCreationTime = parseInt(taskId.split('-')[0] || '0', 10);
  const timeDiff = now - taskCreationTime;
  
  // Calculate progress based on time elapsed (5-15s timeframe)
  if (timeDiff < 5000) return 0;
  if (timeDiff > 15000) return 100;
  
  // Map 5000-15000 to 0-100
  return Math.floor(((timeDiff - 5000) / 10000) * 100);
}

function getTaskResult(taskId: string): any {
  const now = Date.now();
  const taskCreationTime = parseInt(taskId.split('-')[0] || '0', 10);
  const timeDiff = now - taskCreationTime;
  
  // Only return result if task is completed
  if (timeDiff < 15000) return null;
  
  // Mock transaction hash and token ID from task ID
  return {
    transactionHash: `0x${taskId.slice(0, 40).padEnd(64, '0')}`,
    tokenId: parseInt(taskId.slice(0, 8), 16) % 1000,
    contractAddress: '0x1111111111111111111111111111111111111111'
  };
}

export default router;
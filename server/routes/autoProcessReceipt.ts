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
import { extractReceiptData } from '../../shared/utils/receiptLogic';
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
    // Use a fixed development wallet address - no real wallet needed
    const devWalletAddress = '0xDEV000000000000000000000000000000000WALLET';
    
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

      // Extract data from receipt
      const receiptData = await extractReceiptData(req.file.path);
      
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
      const receiptId = Date.now();
      
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
      const encryptedItems = encryptLineItems(receiptData.items);
      
      // Status for NFT gift - assume eligible
      let nftGiftStatus = {
        status: 'processing',
        message: 'Your NFT receipt is being processed and will be minted shortly.',
        eligible: true
      };
      
      // Prepare encrypted metadata
      const encryptedMetadataInfo = encryptedData ? {
        capsule: encryptedData.capsule,
        ciphertext: encryptedData.ciphertext,
        policyPublicKey: encryptedData.policyPublicKey
      } : undefined;
      
      // Create a task for processing the NFT
      const purchaseTask = createNFTPurchaseTask(
        devWalletAddress, 
        receiptId, 
        receiptData,
        encryptedMetadataInfo
      );
      
      // Update NFT gift status
      nftGiftStatus = {
        status: 'processing',
        message: 'Your NFT receipt is being processed automatically.',
        eligible: true,
        taskId: purchaseTask.id
      };
      
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
    const status = await createNFTPurchaseTask.getStatus(taskId);
    
    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      status: status.status,
      progress: status.progress,
      result: status.result,
      error: status.error
    });
  } catch (error: any) {
    console.error('Error getting task status:', error);
    res.status(500).json({
      success: false,
      message: `Error getting task status: ${error.message || 'Unknown error'}`
    });
  }
});

export default router;
/**
 * Unified Upload and Mint Route
 * 
 * This unified route handles the complete flow from receipt upload to NFT minting:
 * 1. Upload receipt image
 * 2. Process image with OCR
 * 3. Store data on IPFS
 * 4. Encrypt metadata (if requested)
 * 5. Mint NFT
 */

import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { ocrService } from '../../services/ocrService';
import { ipfsService } from '../../services/ipfsService';
import { tacoService } from '../../services/tacoService';
import { nftMintService } from '../../services/nftMintService';
import { taskQueueService, TaskStatus } from '../../services/taskQueueService';
import nftPurchaseHandler from '../../task-handlers/nftPurchaseHandler';
import logger from '../../logger';
import { validateReceipt } from '../../utils/receiptUtils';
import { requireAuth } from '../../middleware/auth';

// Setup multer for image uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads');
      
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and PDF files are allowed.'));
      return;
    }
    
    cb(null, true);
  }
});

const router = Router();

// Initialize task handler
taskQueueService.registerHandler('nft-purchase', nftPurchaseHandler);

/**
 * Route for uploading a receipt and minting an NFT
 * Flow: Upload → OCR → IPFS → Encrypt → Mint
 */
router.post(
  '/upload-and-mint',
  requireAuth,
  upload.single('receiptImage'),
  async (req, res) => {
    try {
      const { walletAddress, encryptMetadata } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({
          error: 'Wallet address is required'
        });
      }
      
      const file = req.file;
      if (!file) {
        return res.status(400).json({
          error: 'Receipt image is required'
        });
      }
      
      // Step 1: Extract receipt data using OCR
      logger.info(`Processing receipt image: ${file.filename}`);
      
      let receiptData;
      try {
        receiptData = await ocrService.processReceipt(file.path);
      } catch (ocrError) {
        logger.error(`OCR processing failed: ${ocrError}`);
        return res.status(500).json({
          error: 'Failed to process receipt image',
          details: ocrError instanceof Error ? ocrError.message : String(ocrError)
        });
      }
      
      if (!receiptData) {
        return res.status(422).json({
          error: 'Unable to extract data from receipt image'
        });
      }
      
      // Step 2: Validate receipt data
      const validation = validateReceipt(receiptData);
      if (!validation.valid) {
        return res.status(422).json({
          error: 'Invalid receipt data',
          details: validation.errors
        });
      }
      
      // Step 3: Upload receipt image to IPFS
      let imageCid = '';
      try {
        imageCid = await ipfsService.uploadFile(file.path);
      } catch (ipfsError) {
        logger.error(`IPFS upload failed: ${ipfsError}`);
        return res.status(500).json({
          error: 'Failed to upload receipt image to IPFS',
          details: ipfsError instanceof Error ? ipfsError.message : String(ipfsError)
        });
      }
      
      // Step 4: Add image CID to receipt data
      const receiptWithImage = {
        ...receiptData,
        imageCid,
        imageUrl: `ipfs://${imageCid}`
      };
      
      // Step 5: Encrypt metadata if requested
      let encryptedData = null;
      if (encryptMetadata === 'true' || encryptMetadata === true) {
        try {
          const publicKey = req.body.publicKey;
          
          if (!publicKey) {
            return res.status(400).json({
              error: 'Public key is required for metadata encryption'
            });
          }
          
          encryptedData = await tacoService.encryptReceiptMetadata(
            receiptWithImage,
            publicKey
          );
        } catch (encryptionError) {
          logger.error(`Metadata encryption failed: ${encryptionError}`);
          return res.status(500).json({
            error: 'Failed to encrypt receipt metadata',
            details: encryptionError instanceof Error ? encryptionError.message : String(encryptionError)
          });
        }
      }
      
      // Step 6: Create task for asynchronous NFT minting
      const uniqueId = uuidv4();
      const receipt = {
        id: uniqueId,
        ...receiptWithImage,
        // Store the image data for the task handler to use
        imageData: fs.readFileSync(file.path).toString('base64')
      };
      
      // Create task in queue for async processing
      const task = taskQueueService.createTask('nft-purchase', {
        receipt,
        wallet: walletAddress,
        publicKey: req.body.publicKey,
        encryptMetadata: encryptMetadata === 'true' || encryptMetadata === true
      });
      
      // Return task ID to client for status polling
      return res.status(202).json({
        message: 'Receipt processing initiated',
        taskId: task.id,
        receiptId: uniqueId,
        status: task.status
      });
    } catch (error) {
      logger.error('Upload and mint error:', error);
      
      if (error instanceof multer.MulterError) {
        return res.status(400).json({
          error: 'File upload error',
          details: error.message
        });
      } else if (error instanceof Error) {
        return res.status(500).json({
          error: 'Server error',
          details: error.message
        });
      } else {
        return res.status(500).json({
          error: 'Unknown error occurred'
        });
      }
    }
  }
);

/**
 * Route for checking the status of an NFT minting task
 */
router.get('/task/:taskId', requireAuth, async (req, res) => {
  const { taskId } = req.params;
  
  if (!taskId) {
    return res.status(400).json({
      error: 'Task ID is required'
    });
  }
  
  const task = taskQueueService.getTask(taskId);
  
  if (!task) {
    return res.status(404).json({
      error: 'Task not found'
    });
  }
  
  // Return task status and result if available
  return res.status(200).json({
    taskId: task.id,
    status: task.status,
    completed: task.status === TaskStatus.COMPLETED,
    failed: task.status === TaskStatus.FAILED,
    error: task.error,
    result: task.result,
    createdAt: task.createdAt,
    completedAt: task.completedAt
  });
});

export default router;
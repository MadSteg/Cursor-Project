/**
 * Consolidated Upload and Mint Route for BlockReceipt.ai
 * 
 * This route handles the entire process from receipt upload to NFT minting:
 * 1. Upload receipt image
 * 2. Process with OCR
 * 3. Encrypt sensitive data with TaCo
 * 4. Pin to IPFS
 * 5. Mint NFT on blockchain
 * 6. Store receipt information
 */
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ocrService } from '../../services/ocrService';
import { nftMintService } from '../../services/nftMintService';
import { ipfsService } from '../../services/ipfsService';
import { tacoService } from '../../services/tacoService';
import { determineReceiptTier } from '../../utils/receiptUtils';
import { taskQueueService } from '../../services/taskQueueService';

// Logger - fallback to console if imported logger is not available
let logger;
try {
  logger = require('../../logger').default;
} catch (error) {
  logger = console;
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use timestamp to ensure unique filenames
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `receipt-${uniqueSuffix}${ext}`);
  }
});

// Define file filter to only accept images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept image files only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Configure upload middleware
const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  }
});

const router = express.Router();

/**
 * Unified route to handle receipt upload and NFT minting
 * POST /unified/upload-and-mint
 */
router.post('/', upload.single('receipt'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No receipt image uploaded'
      });
    }
    
    // Get file path and wallet information
    const filePath = req.file.path;
    const { walletAddress, category, recipientPublicKey } = req.body;
    
    logger.info(`Processing receipt image: ${filePath} for wallet ${walletAddress || 'anonymous'}`);
    
    // Process receipt with OCR
    logger.info('Sending to OCR service...');
    let receiptData;
    try {
      receiptData = await ocrService.processReceiptImage(fs.readFileSync(filePath));
      logger.info('OCR processing successful');
    } catch (ocrError) {
      logger.error(`OCR processing failed: ${ocrError}`);
      return res.status(422).json({
        success: false,
        message: 'Failed to process receipt image. Please try with a clearer image.',
        error: ocrError.message
      });
    }
    
    // Enhance receipt data with additional fields
    const receiptId = `receipt-${Date.now()}`;
    const receipt = {
      id: receiptId,
      merchantName: receiptData.merchant?.name || 'Unknown Merchant',
      date: receiptData.date?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      total: receiptData.total || 0,
      subtotal: receiptData.subtotal,
      tax: receiptData.tax,
      items: receiptData.items || [],
      category: category || receiptData.category || 'general',
      confidence: receiptData.confidence || 0,
      imagePath: filePath
    };
    
    // Upload receipt image to IPFS if available
    let receiptImageCid = null;
    try {
      logger.info('Uploading receipt image to IPFS...');
      const imageBuffer = fs.readFileSync(filePath);
      const imageResult = await ipfsService.pinFile(imageBuffer, 'receipt-image.jpg');
      receiptImageCid = imageResult.cid || imageResult;
      receipt.imagePath = receiptImageCid;
      logger.info(`Receipt image pinned to IPFS: ${receiptImageCid}`);
    } catch (ipfsError) {
      logger.error(`IPFS image upload failed: ${ipfsError}`);
      // Continue without IPFS image, this is a non-blocking error
    }
    
    // Determine if encryption should be used
    const useEncryption = !!recipientPublicKey && !!walletAddress;
    let encryptedMetadata = { available: false };
    
    if (useEncryption) {
      try {
        logger.info('Encrypting receipt items with TaCo...');
        encryptedMetadata = await tacoService.encryptReceiptData(
          receipt.items,
          walletAddress,
          recipientPublicKey
        );
        logger.info('Receipt items encrypted successfully');
      } catch (encryptError) {
        logger.error(`Encryption failed: ${encryptError}`);
        // Continue without encryption, this is a non-blocking error
        encryptedMetadata = { available: false };
      }
    }
    
    // Set receipt tier
    const tier = determineReceiptTier(receipt.total);
    
    // Create a record of the receipt with encrypted items
    const receiptWithEncryption = {
      ...receipt,
      encrypted: encryptedMetadata.available,
      tier: tier.id
    };
    
    // If wallet address is provided, mint NFT
    if (walletAddress) {
      // Create a task to handle background NFT minting
      logger.info('Creating task for NFT minting in background...');
      const taskResult = taskQueueService.createTask(
        'nft_purchase', 
        { receiptDetails: receipt },
        walletAddress,
        receipt.id
      );
      
      const taskId = taskResult.id;
      logger.info(`Created NFT purchase task ${taskId} for wallet ${walletAddress}`);
      
      // Create encryption task if needed
      if (encryptedMetadata.available) {
        logger.info('Creating task for metadata encryption...');
        taskQueueService.createTask(
          'metadata_encryption', 
          { encryptedMetadata },
          walletAddress,
          receipt.id
        );
      }
      
      // Return response with task information
      return res.status(200).json({
        success: true,
        message: 'Receipt processed successfully and NFT minting started',
        data: receiptWithEncryption,
        task: {
          id: taskId,
          type: 'nft_purchase'
        },
        tier: tier.name
      });
    } else {
      // No wallet address provided, just return receipt data
      logger.info('No wallet address provided, skipping NFT minting');
      return res.status(200).json({
        success: true,
        message: 'Receipt processed successfully',
        data: receiptWithEncryption,
        tier: tier.name
      });
    }
  } catch (error) {
    logger.error(`Error in receipt processing: ${error}`);
    
    // Provide more specific error messages based on the type of failure
    let statusCode = 500;
    let errorMessage = 'Internal server error during receipt processing';
    
    if (error.message?.includes('OCR')) {
      statusCode = 422;
      errorMessage = 'Failed to process receipt image. Please try a clearer image.';
    } else if (error.message?.includes('IPFS')) {
      statusCode = 503;
      errorMessage = 'Temporary issue with metadata storage. Please try again shortly.';
    } else if (error.message?.includes('encrypt')) {
      statusCode = 422;
      errorMessage = 'Failed to encrypt receipt data. Please check your wallet connection.';
    }
    
    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: error.message
    });
  }
});

export default router;
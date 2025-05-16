import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { extractReceiptData } from '../services/ocrService';
import { encryptLineItems } from '../services/tacoService';
import { pinJSON } from '../services/ipfsService';
import { metadataService } from '../services/metadataService';
import { blockchainService } from '../services/blockchainService';
import { taskQueueService } from '../services/taskQueue';
import { determineReceiptTier } from '../utils/receiptUtils';
import { logger } from '../utils/logger';

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `receipt-${uniqueSuffix}${extension}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max size
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs
    const filetypes = /jpeg|jpg|png|gif|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed'));
    }
  }
}).single('receipt');

// Main unified upload and mint route
router.post('/', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      logger.error(`Upload error: ${err.message}`);
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      // Check for required parameters
      const walletAddress = req.body.walletAddress;
      if (!walletAddress) {
        return res.status(400).json({ 
          success: false, 
          message: 'Wallet address is required'
        });
      }

      // Log the upload request
      logger.info(`Processing receipt for wallet ${walletAddress}`);

      // Extract file path
      const file = req.file;
      if (!file) {
        return res.status(400).json({ 
          success: false, 
          message: 'No file uploaded'
        });
      }

      // Process receipt with OCR
      const receiptData = await extractReceiptData(file.path);
      if (!receiptData || !receiptData.total) {
        return res.status(400).json({ 
          success: false, 
          message: 'Failed to extract receipt data'
        });
      }

      // Determine receipt tier based on total
      const tier = determineReceiptTier(receiptData.total);
      
      // Create record in database before minting
      const receipt = {
        id: `${Date.now()}`,
        merchantName: receiptData.merchantName || 'Unknown Merchant',
        date: receiptData.date || new Date().toISOString().split('T')[0],
        items: receiptData.items || [],
        total: receiptData.total,
        subtotal: receiptData.subtotal || receiptData.total,
        tax: receiptData.tax || 0,
        confidence: receiptData.confidence || 0.8,
        imagePath: file.path,
        category: receiptData.category || 'default'
      };

      // Create a task to handle background processing
      const taskId = await taskQueueService.createTask('nft_purchase', {
        walletAddress,
        receiptId: receipt.id
      });

      logger.info(`Created NFT purchase task ${taskId} for wallet ${walletAddress}`);

      // Encrypt receipt metadata if wallet address is available
      let encryptedMetadata = null;
      if (walletAddress) {
        try {
          // Encrypt receipt line items
          const itemsToEncrypt = receipt.items.map(item => ({
            category: item.category || 'Other',
            price: item.price
          }));

          logger.info(`Encrypting ${itemsToEncrypt.length} line items for wallet ${walletAddress}`);
          const encryptedItems = await encryptLineItems(walletAddress, itemsToEncrypt);
          
          encryptedMetadata = {
            available: true,
            encryptedItems
          };
        } catch (encryptError) {
          logger.error(`Error encrypting metadata: ${encryptError}`);
          encryptedMetadata = {
            available: false,
            error: 'Failed to encrypt receipt metadata'
          };
        }
      }

      // Add encryption status to receipt
      const receiptWithEncryption = {
        ...receipt,
        isEncrypted: !!encryptedMetadata?.available,
        encryptedMetadata,
        nftGift: {
          status: 'processing',
          message: 'Your NFT receipt is being processed automatically.',
          eligible: true,
          taskId
        }
      };

      // Create encryption task if needed
      if (encryptedMetadata?.available) {
        await taskQueueService.createTask('metadata_encryption', {
          walletAddress,
          receiptId: receipt.id
        });
      }

      // Pin metadata to IPFS
      let metadataUri = null;
      try {
        // Create metadata JSON for IPFS
        const metadata = {
          name: `Receipt from ${receipt.merchantName}`,
          description: `Purchase of ${receipt.total} on ${receipt.date}`,
          image: `ipfs://placeholder-image-hash`, // Placeholder for now
          attributes: [
            { trait_type: 'Merchant', value: receipt.merchantName },
            { trait_type: 'Date', value: receipt.date },
            { trait_type: 'Total', value: receipt.total },
            { trait_type: 'Tier', value: tier.name }
          ]
        };

        // Pin to IPFS
        metadataUri = await pinJSON(metadata);
        logger.info(`Pinned receipt metadata to IPFS: ${metadataUri}`);
      } catch (ipfsError) {
        logger.error(`Error pinning to IPFS: ${ipfsError}`);
        // Continue even if IPFS fails, we'll use a mock URI
        metadataUri = `ipfs://mock-uri-${Date.now()}`;
      }

      // Return successful response even though minting happens in background
      return res.status(200).json({
        success: true,
        message: 'Receipt processed successfully and NFT minting started',
        data: receiptWithEncryption,
        metadataUri
      });
    } catch (error) {
      logger.error(`Error in receipt processing: ${error}`);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during receipt processing',
        error: error.message
      });
    }
  });
});

export default router;
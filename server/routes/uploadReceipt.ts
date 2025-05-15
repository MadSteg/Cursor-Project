import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { extractReceiptData, determineReceiptTier, type TierInfo } from '../../shared/utils/receiptLogic';
import { nftPurchaseBot } from '../services/nftPurchaseBot';
import { encryptLineItems } from '../utils/encryptLineItems';

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

// Create multer upload handler - moved out of route for stability
const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
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

// Route for uploading a receipt
router.post('/upload-receipt', (req: Request, res: Response) => {
  // Validate wallet address first
  const walletAddress = req.body.walletAddress;
  if (!walletAddress || !walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Valid wallet address is required'
    });
  }

  // Use multer as middleware
  uploadMiddleware(req, res, async (err) => {
    // Handle file upload errors from multer
    if (err) {
      console.error('File upload error:', err.message);
      return res.status(400).json({ 
        success: false, 
        message: `File upload error: ${err.message}` 
      });
    }

    try {
      // Validate file presence after multer processing
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: 'No file uploaded'
        });
      }

      console.log(`Processing receipt: ${req.file.originalname} (${req.file.size} bytes) saved as ${req.file.filename}`);

      // Extract data from the uploaded receipt using OCR
      const receiptData = await extractReceiptData(req.file.path);
      
      // Validate receipt data extraction
      if (!receiptData || !receiptData.items || receiptData.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Could not parse line items from receipt. Please try a clearer image."
        });
      }
      
      // Determine receipt tier based on the total amount
      const tier = determineReceiptTier(receiptData.total);
      
      // Attempt to encrypt the receipt's sensitive metadata using TACo
      // This uses the wallet address as a simple public key for demo purposes
      // In a production app, we would use the user's actual blockchain public key
      const encryptedData = await encryptLineItems(walletAddress, receiptData);
      
      // Define NFT gift status interface
      interface NFTGiftStatus {
        status: string;
        message: string;
        eligible: boolean;
        error?: string;
        nft?: {
          tokenId: string;
          contract: string;
          name: string;
          image: string;
          marketplace: string;
          price: number;
        };
        txHash?: string;
      }
      
      // Prepare response data
      const responseData: {
        [key: string]: any;
        tier: TierInfo;
        filePath: string;
        fileId: string;
        nftGift?: NFTGiftStatus;
      } = {
        ...receiptData,
        tier,
        filePath: req.file.path,
        fileId: req.file.filename
      };
      
      // Check if the receipt qualifies for an NFT gift ($5 or higher for basic tier)
      // Or automatically if premium or higher tier
      if (tier.title !== 'Basic' || receiptData.total >= 5.0) {
        try {
          // Get connected wallet address from request body or use test address
          const walletAddress = req.body.walletAddress || '0x0CC9bb224dA2cbe7764ab7513D493cB2b3BeA6FC';
          
          // Check if the user is eligible (hasn't claimed in the last 24h)
          const isEligible = await nftPurchaseBot.isUserEligible(walletAddress);
          
          if (isEligible) {
            console.log(`User ${walletAddress} is eligible for NFT gift. Starting purchase process...`);
            
            // Generate a unique receipt ID
            const receiptId = `receipt-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
            
            // Launch NFT purchase process in background without delaying response
            // We'll store the result in the database once completed
            nftPurchaseBot.purchaseAndTransferNFT(walletAddress, receiptId, receiptData)
              .then(result => {
                if (result.success) {
                  console.log(`Successfully purchased and transferred NFT to ${walletAddress}:`, result);
                  // Here we would update the receipt record with the NFT data
                } else {
                  console.log(`Failed to purchase NFT for ${walletAddress}:`, result.error);
                  // Try fallback minting if marketplace purchase fails
                  return nftPurchaseBot.mintFallbackNFT(walletAddress, receiptId, receiptData);
                }
              })
              .then(fallbackResult => {
                if (fallbackResult && fallbackResult.success) {
                  console.log(`Successfully minted fallback NFT for ${walletAddress}:`, fallbackResult);
                  // Here we would update the receipt record with the NFT data
                }
              })
              .catch(error => {
                console.error(`Error in NFT gift process for ${walletAddress}:`, error);
              });
            
            // Add NFT gift info to response
            responseData.nftGift = {
              status: 'processing',
              message: 'Your NFT gift is being processed and will be sent to your wallet shortly.',
              eligible: true
            };
          } else {
            // User has already claimed an NFT in the last 24 hours
            responseData.nftGift = {
              status: 'ineligible',
              message: 'You have already claimed an NFT gift in the last 24 hours.',
              eligible: false
            };
          }
        } catch (error: any) {
          console.error('Error with NFT gift process:', error);
          responseData.nftGift = {
            status: 'error',
            message: 'There was an error processing your NFT gift.',
            eligible: false,
            error: error.message
          };
        }
      } else {
        // Receipt doesn't qualify for NFT gift
        responseData.nftGift = {
          status: 'ineligible',
          message: 'This receipt doesn\'t qualify for an NFT gift. Receipts must be $5 or higher.',
          eligible: false
        };
      }
      
      // Return the parsed receipt data, assigned tier, and NFT gift status
      return res.status(200).json({ 
        success: true,
        data: responseData
      });
    } catch (error: any) {
      console.error('Error processing receipt:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to process receipt', 
        error: error.message || 'Unknown error'
      });
    }
  });
});

// Route for getting receipt data by ID
router.get('/receipt/:fileId', (req: Request, res: Response) => {
  try {
    const fileId = req.params.fileId;
    const filePath = path.join(uploadDir, fileId);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Receipt not found' });
    }
    
    // Serve the file
    return res.sendFile(filePath);
  } catch (error: any) {
    console.error('Error retrieving receipt:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to retrieve receipt', 
      error: error.message || 'Unknown error'
    });
  }
});

export default router;
import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { extractReceiptData, determineReceiptTier, type TierInfo } from '../../shared/utils/receiptLogic';
import { nftPurchaseBot } from '../services/nftPurchaseBot';
import { encryptLineItems, determineItemCategory } from '../utils/encryptLineItems';
import { createNFTPurchaseTask } from '../services/taskQueue';

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
      
      // Validate receipt data extraction - critical check for OCR success
      if (!receiptData) {
        return res.status(400).json({
          success: false,
          message: "Failed to extract receipt data. Please try a clearer image."
        });
      }
      
      // Validate that we have line items - critical for NFT metadata
      if (!receiptData.items || !Array.isArray(receiptData.items)) {
        return res.status(400).json({
          success: false,
          message: "Receipt items not detected. Please try a different receipt."
        });
      }
      
      // Check if we have at least one line item
      if (receiptData.items.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No line items found in receipt. Please try a clearer image."
        });
      }

      // Validate basic receipt structure
      if (!receiptData.merchantName || !receiptData.date || !receiptData.total) {
        return res.status(400).json({
          success: false,
          message: "Missing critical receipt information (merchant, date, or total)."
        });
      }
      
      // Classify items if not already done by OCR
      receiptData.items = receiptData.items.map(item => {
        // Create a new item object with a category field
        const itemWithCategory = {
          name: item.name,
          price: item.price,
          category: (item as any).category || determineItemCategory(item.name)
        };
        return itemWithCategory;
      });
      
      // Determine receipt tier based on the total amount
      const tier = determineReceiptTier(receiptData.total);
      
      // Web3 signature verification could go here (marked as optional in requirements)
      // const isSignatureValid = await verifyWalletSignature(walletAddress, signature);
      
      console.log(`Receipt validated successfully for ${walletAddress}. Encrypting with TACo...`);
      
      // Encrypt the receipt's sensitive metadata using TACo
      // This uses the wallet address as a public key for demo purposes
      // In a production app, we would use the user's actual blockchain public key
      const encryptedData = await encryptLineItems(walletAddress, receiptData);
      
      if (!encryptedData) {
        console.error('Error encrypting receipt data with TACo');
        // Continue without encryption rather than failing the whole flow
      } else {
        console.log('Receipt data encrypted successfully with TACo');
      }
      
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
        taskId?: string; // Added for task queue integration
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
      
      let nftGiftStatus: NFTGiftStatus = {
        status: 'checking',
        message: 'Checking receipt eligibility...',
        eligible: false
      };
      
      // Check if receipt qualifies for NFT gift based on tier or total amount
      // Premium tier or $25+ receipts are eligible (updated threshold)
      if (tier.title !== 'Basic' || receiptData.total >= 25.0) {
        try {
          // Check if the user is eligible (hasn't claimed in the last 24h)
          const isEligible = await nftPurchaseBot.isUserEligible(walletAddress);
          
          if (isEligible) {
            console.log(`User ${walletAddress} is eligible for NFT gift. Starting purchase process...`);
            
            // Generate a unique receipt ID
            const receiptId = `receipt-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
            
            try {
              // Create a task to purchase an NFT in the background
              console.log('Creating NFT purchase task in the task queue...');
              
              // Pass encrypted metadata to the task if available
              const encryptedMetadataInfo = encryptedData ? {
                policyId: encryptedData.policyPublicKey,
                capsuleId: encryptedData.capsule,
                ciphertext: encryptedData.ciphertext
              } : undefined;
              
              const purchaseTask = createNFTPurchaseTask(
                walletAddress, 
                receiptId, 
                receiptData,
                encryptedMetadataInfo
              );
              
              // Store a reference to the task ID
              const taskId = purchaseTask.id;
              console.log(`NFT purchase task ${taskId} created for wallet ${walletAddress}`);
              
              // Update NFT gift status to processing
              nftGiftStatus = {
                status: 'processing',
                message: 'Your NFT gift is being processed and will be sent to your wallet shortly.',
                eligible: true,
                taskId: purchaseTask.id
              };
            } catch (nftError: any) {
              console.error(`Error in NFT gift process for ${walletAddress}:`, nftError);
              nftGiftStatus = {
                status: 'error',
                message: 'There was a technical error processing your NFT gift.',
                eligible: true,
                error: nftError.message || 'Unknown error occurred'
              };
            }
          } else {
            // User has already claimed an NFT in the last 24 hours
            console.log(`User ${walletAddress} has already claimed an NFT in the last 24 hours`);
            nftGiftStatus = {
              status: 'ineligible',
              message: 'You have already claimed an NFT gift in the last 24 hours.',
              eligible: false
            };
          }
        } catch (eligibilityError: any) {
          // Error checking eligibility
          console.error('Error checking NFT claim eligibility:', eligibilityError);
          nftGiftStatus = {
            status: 'error',
            message: 'There was an error checking your NFT gift eligibility.',
            eligible: false,
            error: eligibilityError.message || 'Unknown error in eligibility check'
          };
        }
      } else {
        // Receipt doesn't qualify for NFT gift
        console.log(`Receipt total (${receiptData.total}) doesn't qualify for NFT gift. Minimum is $25.`);
        nftGiftStatus = {
          status: 'ineligible',
          message: 'This receipt doesn\'t qualify for an NFT gift. Receipts must be $25 or higher.',
          eligible: false
        };
      }
      
      // Add NFT gift status to the receipt data
      responseData.nftGift = nftGiftStatus;
      
      // Prepare final response with encrypted metadata if available
      if (encryptedData) {
        // Add encryption details to response
        responseData.encryptedMetadata = {
          isEncrypted: true,
          capsuleId: encryptedData.capsule || '', 
          policyId: encryptedData.policyPublicKey || '',
          nftTokenId: nftGiftStatus.nft?.tokenId || null, // Link encryption to NFT
          taskId: nftGiftStatus.taskId || null, // Add task ID for tracking
          encryptionStatus: 'success'
        };
        
        // Mark receipt data as having encrypted items
        responseData.isEncrypted = true;
        
        console.log('Receipt metadata encrypted with TACo and added to response');
        
        // Log the taskId for tracking
        if (nftGiftStatus.taskId) {
          console.log(`NFT task ID ${nftGiftStatus.taskId} included in response for tracking`);
        }
      } else {
        responseData.encryptedMetadata = {
          isEncrypted: false,
          taskId: nftGiftStatus.taskId || null, // Still include task ID even if encryption failed
          encryptionStatus: 'failed or skipped'
        };
        console.warn('TACo encryption failed - returning unencrypted receipt data');
      }
      
      // Return the parsed receipt data with all details
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
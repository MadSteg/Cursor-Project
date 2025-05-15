import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { extractReceiptData, determineReceiptTier } from '../../shared/utils/receiptLogic';

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
      
      // Determine receipt tier based on the total amount
      const tier = determineReceiptTier(receiptData.total);
      
      // Return the parsed receipt data and assigned tier
      return res.status(200).json({ 
        success: true,
        data: {
          ...receiptData,
          tier,
          filePath: req.file.path,
          fileId: req.file.filename
        }
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
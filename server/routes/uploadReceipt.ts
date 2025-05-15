import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { extractReceiptData, determineReceiptTier } from '../../shared/utils/receiptLogic';

const router = express.Router();

// Create uploads directory if it doesn't exist
// Use import.meta.url for ES modules instead of __dirname
const __filename = new URL(import.meta.url).pathname;
const projectRoot = path.resolve(path.dirname(__filename), '../../');
const uploadDir = path.join(projectRoot, 'uploads');

console.log('Upload directory path:', uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage configuration - using memory storage for debugging
const storage = multer.memoryStorage();

// Initialize multer with storage configuration
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept only images and PDFs
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const mimeTypeValid = allowedTypes.test(file.mimetype);
    const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimeTypeValid && extValid) {
      return cb(null, true);
    }
    cb(new Error('Only .jpeg, .jpg, .png, .gif and .pdf files are allowed!'));
  }
});

// Route for uploading a receipt
router.post('/upload-receipt', (req: Request, res: Response) => {
  // Debug logs
  console.log('------------------------------------------------------------');
  console.log('Receipt upload request received:');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body type:', typeof req.body);
  console.log('Files property exists:', req.files !== undefined);
  console.log('Request body:', req.body);
  console.log('------------------------------------------------------------');
  
  // Continue with multer middleware
  upload.single('receipt')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ success: false, message: `File upload error: ${err.message}` });
    }
    
    // Continue with the handler
    handleReceiptUpload(req, res);
  });
});

// Separated handler function
async function handleReceiptUpload(req: Request, res: Response) {
  try {
    console.log('Processing file:', req.file);
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // For memory storage, we need to write the file to disk first
    const fileExtension = path.extname(req.file.originalname) || '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'receipt-' + uniqueSuffix + fileExtension;
    const filePath = path.join(uploadDir, filename);
    
    console.log('Saving file to:', filePath);
    
    // Write buffer to file
    await fs.promises.writeFile(filePath, req.file.buffer);
    
    // Extract data from the uploaded receipt using OCR
    const receiptData = await extractReceiptData(filePath);
    
    // Determine receipt tier based on the total amount
    const tier = determineReceiptTier(receiptData.total);
    
    // Return the parsed receipt data and assigned tier
    return res.status(200).json({ 
      success: true,
      data: {
        ...receiptData,
        tier,
        filePath: filePath,
        fileId: filename
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
}

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
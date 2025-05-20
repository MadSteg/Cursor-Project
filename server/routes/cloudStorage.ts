/**
 * Cloud Storage API Routes
 * 
 * These routes handle access to images and other assets stored in Google Cloud Storage
 */
import { Router } from 'express';
import { z } from 'zod';
import { googleStorageService } from '../services/googleStorageService';
import { createLogger } from '../logger';

const router = Router();
const logger = createLogger('cloud-storage-api');

// Schema for file request validation
const fileRequestSchema = z.object({
  fileName: z.string().min(1),
  signed: z.boolean().optional().default(false)
});

// Schema for listing files validation
const listFilesSchema = z.object({
  prefix: z.string().optional()
});

/**
 * @route GET /api/storage/file
 * @desc Get a URL for a specific file in Google Cloud Storage
 * @access Public
 */
router.get('/file', async (req, res) => {
  try {
    const { fileName, signed } = fileRequestSchema.parse(req.query);
    
    if (!googleStorageService.isReady()) {
      return res.status(503).json({ 
        error: 'Cloud storage service not initialized',
        message: 'The server is not properly configured to access cloud storage.'
      });
    }
    
    if (signed) {
      // Get a signed URL (for private files)
      const url = await googleStorageService.getSignedUrl(fileName);
      if (!url) {
        return res.status(404).json({ 
          error: 'File not found',
          message: `Could not generate signed URL for file: ${fileName}`
        });
      }
      return res.json({ url });
    } else {
      // Get a public URL (for public files)
      const url = googleStorageService.getPublicUrl(fileName);
      return res.json({ url });
    }
  } catch (error) {
    logger.error('Error processing file request', error);
    return res.status(400).json({ 
      error: 'Invalid request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route GET /api/storage/list
 * @desc List files in storage bucket, optionally filtered by prefix
 * @access Public
 */
router.get('/list', async (req, res) => {
  try {
    const { prefix } = listFilesSchema.parse(req.query);
    
    if (!googleStorageService.isReady()) {
      return res.status(503).json({ 
        error: 'Cloud storage service not initialized',
        message: 'The server is not properly configured to access cloud storage.'
      });
    }
    
    const files = await googleStorageService.listFiles(prefix);
    return res.json({ files });
  } catch (error) {
    logger.error('Error listing files', error);
    return res.status(400).json({ 
      error: 'Invalid request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * @route GET /api/storage/nft-images
 * @desc Get a list of NFT images with their URLs
 * @access Public
 */
router.get('/nft-images', async (req, res) => {
  try {
    if (!googleStorageService.isReady()) {
      return res.status(503).json({ 
        error: 'Cloud storage service not initialized',
        message: 'The server is not properly configured to access cloud storage.'
      });
    }
    
    // Get all files in the bulldogs folder
    const files = await googleStorageService.listFiles('bulldogs/');
    
    // Generate URLs for each file
    const imageUrls = files.map(file => ({
      fileName: file,
      id: file.replace('bulldogs/', '').replace(/\.[^/.]+$/, ''), // Remove folder prefix and extension
      url: googleStorageService.getPublicUrl(file)
    }));
    
    return res.json({ images: imageUrls });
  } catch (error) {
    logger.error('Error getting NFT images', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
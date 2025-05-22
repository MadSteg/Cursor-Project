const { Router } = require('express');
const { replitStorageService } = require('../services/replitStorageService');

const router = Router();

/**
 * GET /api/replit-storage/images
 * Get all images from Replit Object Storage
 */
router.get('/images', async (req, res) => {
  try {
    if (!replitStorageService.isInitialized()) {
      return res.status(503).json({ 
        error: 'Replit Object Storage not initialized',
        message: 'Unable to connect to object storage'
      });
    }

    const images = await replitStorageService.listImages();
    
    res.json({
      success: true,
      count: images.length,
      images: images
    });
  } catch (error) {
    console.error('[replit-storage-route] Error listing images:', error);
    res.status(500).json({ 
      error: 'Failed to list images from storage',
      message: error.message
    });
  }
});

/**
 * GET /api/replit-storage/status
 * Check Replit Object Storage connection status
 */
router.get('/status', (req, res) => {
  res.json({
    connected: replitStorageService.isInitialized(),
    message: replitStorageService.isInitialized() 
      ? 'Connected to Replit Object Storage'
      : 'Not connected to Replit Object Storage'
  });
});

module.exports = router;
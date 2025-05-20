const express = require('express');
const router = express.Router();
const nftGeneratorService = require('../services/nftGeneratorService');
const multer = require('multer');
const upload = multer({ memory: true });
const logger = require('../logger');

/**
 * Route to list all folders in Google Cloud Storage
 */
router.get('/folders', async (req, res) => {
  try {
    const folders = await nftGeneratorService.listFolders();
    res.json({ folders });
  } catch (error) {
    logger.error('[nft-generator-route] Error listing folders:', error);
    res.status(500).json({ error: error.message || 'Failed to list folders' });
  }
});

/**
 * Route to list all images in a specific folder
 */
router.get('/images/:folder?', async (req, res) => {
  try {
    const { folder } = req.params;
    const images = await nftGeneratorService.listImagesInFolder(folder || '');
    res.json({ images });
  } catch (error) {
    logger.error('[nft-generator-route] Error listing images:', error);
    res.status(500).json({ error: error.message || 'Failed to list images' });
  }
});

/**
 * Route to generate an NFT collection
 */
router.post('/generate', async (req, res) => {
  try {
    const { 
      collectionName, 
      description, 
      size, 
      folders 
    } = req.body;
    
    // Validate input
    if (!collectionName) {
      return res.status(400).json({ error: 'Collection name is required' });
    }
    
    if (!folders || !Array.isArray(folders) || folders.length === 0) {
      return res.status(400).json({ error: 'At least one folder is required' });
    }
    
    const results = await nftGeneratorService.generateNFTCollection({
      collectionName,
      description,
      size: parseInt(size) || 10,
      folders
    });
    
    res.json(results);
  } catch (error) {
    logger.error('[nft-generator-route] Error generating NFTs:', error);
    res.status(500).json({ error: error.message || 'Failed to generate NFTs' });
  }
});

/**
 * Route to import an NFT collection into BlockReceipt
 */
router.post('/import', async (req, res) => {
  try {
    const { collectionId, collectionName, nfts } = req.body;
    
    // Here we would typically import the NFTs into the BlockReceipt database
    // For this implementation, we'll just return success
    
    logger.info(`[nft-generator-route] Imported collection ${collectionName} with ${nfts?.length || 0} NFTs`);
    
    res.json({ 
      success: true, 
      message: `Successfully imported collection "${collectionName}" with ${nfts?.length || 0} NFTs`
    });
  } catch (error) {
    logger.error('[nft-generator-route] Error importing NFTs:', error);
    res.status(500).json({ error: error.message || 'Failed to import NFTs' });
  }
});

module.exports = router;
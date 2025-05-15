import express from 'express';
import { getNFTArtByTags, extractTagsFromReceipt } from '../../shared/utils/nftArtSelector';

const router = express.Router();

// Route to get NFT options based on receipt data
router.post('/nft-options', (req, res) => {
  try {
    const { 
      tags = [], 
      merchantName = '', 
      items = [], 
      tier = 'BASIC',
      count = 6
    } = req.body;
    
    // If tags are provided, use them directly
    let tagsToUse = tags;
    
    // If no tags but we have merchant and items, extract tags
    if (tags.length === 0 && (merchantName || items.length > 0)) {
      tagsToUse = extractTagsFromReceipt(merchantName, items);
    }
    
    // Get NFT art options based on the tags and tier
    const options = getNFTArtByTags(tagsToUse, tier, count);
    
    res.json({ 
      success: true, 
      options,
      tags: tagsToUse
    });
  } catch (error: any) {
    console.error('Error generating NFT options:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate NFT options',
      error: error.message || 'Unknown error'
    });
  }
});

// Route to select and prepare an NFT for minting
router.post('/select-nft', (req, res) => {
  try {
    const { 
      selectedNft, 
      receiptData
    } = req.body;
    
    if (!selectedNft || !receiptData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required data: selectedNft or receiptData'
      });
    }
    
    // In a real implementation, this would prepare the NFT for minting
    // For now, we'll just return a success response
    res.json({
      success: true,
      message: 'NFT selected for minting',
      mintStatus: 'pending',
      expectedDelivery: new Date(Date.now() + 300000).toISOString(), // 5 minutes from now
      txHash: '0x' + Math.random().toString(16).substring(2, 34) // Mock transaction hash
    });
  } catch (error: any) {
    console.error('Error selecting NFT:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process NFT selection',
      error: error.message || 'Unknown error'
    });
  }
});

export default router;
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
    
    // Use user's wallet address for minting
    const walletAddress = '0x0CC9bb224dA2cbe7764ab7513D493cB2b3BeA6FC';
    
    // Generate a consistent token ID based on the timestamp and a random number
    const tokenId = Date.now().toString().substring(6) + Math.floor(Math.random() * 1000).toString();
    
    // Mock transaction hash that would come from the blockchain
    const txHash = '0x7c9e6b6a88c9e9e9d9d9d9d9d9d9d9d9d9d9d9d9d9d9d9d9d9d9d9d9d9d9d9d';
    
    // In a real implementation, this would call the blockchain service to mint
    // For testing purposes, we'll create a successful mock response
    res.json({
      success: true,
      message: 'NFT minted to ' + walletAddress,
      mintStatus: 'completed',
      expectedDelivery: new Date(Date.now() + 10000).toISOString(), // 10 seconds from now
      txHash: txHash,
      walletAddress: walletAddress,
      tokenId: tokenId,
      nftMetadata: {
        name: selectedNft.name,
        description: selectedNft.description,
        merchant: receiptData.merchantName,
        date: receiptData.date,
        total: receiptData.total,
        tier: receiptData.tier.id
      }
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
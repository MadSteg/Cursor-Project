import express from 'express';
import { 
  NFT_COLLECTION, 
  getFilteredNFTs, 
  getNFTsFromReceiptItems 
} from '../../shared/metadata/nft-collection';

const router = express.Router();

// Route to get all NFTs or filtered by categories/tier
router.post('/nfts', (req, res) => {
  try {
    const { categories = [], tier = '', receiptData = null } = req.body;
    
    let nfts = NFT_COLLECTION;
    
    // If receipt data is provided, use it to filter NFTs
    if (receiptData && receiptData.items && receiptData.items.length > 0) {
      nfts = getNFTsFromReceiptItems(receiptData.items);
      
      // If no matches found, fallback to all NFTs
      if (nfts.length === 0) {
        nfts = NFT_COLLECTION;
      }
    }
    
    // Apply additional category/tier filters if provided
    if (categories.length > 0 || tier) {
      nfts = getFilteredNFTs(categories, tier);
      
      // If still no matches, return all NFTs
      if (nfts.length === 0) {
        nfts = NFT_COLLECTION;
      }
    }
    
    // Return the NFTs
    res.json({
      success: true,
      nfts,
      count: nfts.length,
      filters: {
        categories,
        tier
      }
    });
  } catch (error: any) {
    console.error('Error getting NFTs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching NFT data',
      error: error.message
    });
  }
});

// Route to get a specific NFT by ID
router.get('/nfts/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const nft = NFT_COLLECTION.find(n => n.id === id);
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        message: `NFT with ID ${id} not found`
      });
    }
    
    res.json({
      success: true,
      nft
    });
  } catch (error: any) {
    console.error('Error getting NFT by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching NFT data',
      error: error.message
    });
  }
});

export default router;
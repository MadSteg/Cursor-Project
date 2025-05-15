import express, { Request, Response } from 'express';
import { nftPoolRepository } from '../repositories/nftPoolRepository';
import { nftPurchaseBot } from '../services/nftPurchaseBot';
import { marketplaceService } from '../services/marketplaceService';

const router = express.Router();

/**
 * Get random NFTs from the pool by receipt tier
 * GET /api/nfts/pool?receiptTier=premium
 */
router.get('/pool', async (req: Request, res: Response) => {
  try {
    const { receiptTier = 'basic', count = '5' } = req.query;
    
    // Convert tier to our database format (lowercase)
    const tier = String(receiptTier).toLowerCase();
    const numCount = parseInt(String(count), 10) || 5;
    
    // Validate tier
    if (!['basic', 'premium', 'luxury'].includes(tier)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid receipt tier. Must be one of: basic, premium, luxury'
      });
    }
    
    // Get random NFTs for the tier
    const nfts = await nftPoolRepository.getRandomNftsByTier(tier, numCount);
    
    // If we don't have enough NFTs in the database, fetch some from simulation
    if (nfts.length < numCount) {
      console.log(`Not enough NFTs in pool for tier ${tier}, using simulation data`);
      
      // Determine budget based on tier
      const tierBudgetMap = {
        'basic': 0.03,
        'premium': 0.08,
        'luxury': 0.10
      };
      
      const budget = tierBudgetMap[tier as keyof typeof tierBudgetMap];
      
      // Get simulated NFTs
      const simulatedNfts = await marketplaceService.fetchMarketplaceNFTs({
        maxPrice: budget,
        limit: numCount - nfts.length
      });
      
      // Convert marketplace NFTs to our format
      const convertedNfts = simulatedNfts.map(nft => ({
        id: 0, // Will be assigned by DB
        nftId: nft.id,
        name: nft.name,
        image: nft.imageUrl,
        description: nft.description,
        tier: tier,
        metadataUri: nft.url || `ipfs://metadata/${nft.id}`,
        categories: ['simulated'],
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }));
      
      // Return combined NFTs
      return res.status(200).json({
        success: true,
        tier: tier,
        nfts: [...nfts, ...convertedNfts].slice(0, numCount)
      });
    }
    
    return res.status(200).json({
      success: true,
      tier: tier,
      nfts: nfts
    });
  } catch (error: any) {
    console.error('Error getting NFT pool:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve NFTs from pool',
      error: error.message || 'Unknown error'
    });
  }
});

/**
 * Mint an NFT from the pool to a user
 * POST /api/nfts/mint
 * Body: { walletAddress, nftId }
 */
router.post('/mint', async (req: Request, res: Response) => {
  try {
    const { walletAddress, nftId } = req.body;
    
    // Validate required fields
    if (!walletAddress || !walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid wallet address' 
      });
    }
    
    if (!nftId) {
      return res.status(400).json({ 
        success: false, 
        message: 'NFT ID is required' 
      });
    }
    
    // Check if user is eligible for an NFT
    const isEligible = await nftPurchaseBot.isUserEligible(walletAddress);
    
    if (!isEligible) {
      return res.status(403).json({
        success: false,
        message: 'User has already claimed an NFT recently'
      });
    }
    
    // Get the NFT from the pool
    const nft = await nftPoolRepository.getNftById(nftId);
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        message: 'NFT not found in pool'
      });
    }
    
    if (!nft.enabled) {
      return res.status(400).json({
        success: false,
        message: 'This NFT is no longer available'
      });
    }
    
    // Purchase and transfer NFT to user (or mint a new one)
    // If it's a simulated NFT (starting with 'sim-'), use marketplace purchase
    if (nftId.startsWith('sim-')) {
      // Get the NFT from marketplace service
      const marketplaceNfts = await marketplaceService.fetchMarketplaceNFTs({
        maxPrice: 0.10,
        limit: 10
      });
      
      const marketplaceNft = marketplaceNfts.find(n => n.id === nftId);
      
      if (!marketplaceNft) {
        return res.status(404).json({
          success: false,
          message: 'Marketplace NFT not found'
        });
      }
      
      // Purchase the NFT
      const purchaseResult = await marketplaceService.purchaseMarketplaceNFT(
        marketplaceNft,
        walletAddress
      );
      
      if (!purchaseResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Failed to purchase NFT',
          error: purchaseResult.error
        });
      }
      
      // Return success
      return res.status(200).json({
        success: true,
        message: 'NFT purchased and transferred successfully',
        nft: nft,
        transaction: purchaseResult
      });
    } else {
      // It's an internal NFT, mint it directly
      const mintResult = await nftPurchaseBot.mintFallbackNFT(
        walletAddress,
        nft.name,
        nft.description
      );
      
      if (!mintResult.success) {
        return res.status(500).json({
          success: false,
          message: 'Failed to mint NFT',
          error: mintResult.error
        });
      }
      
      // Disable the NFT in the pool so it can't be minted again
      await nftPoolRepository.disableNft(nftId);
      
      // Return success
      return res.status(200).json({
        success: true,
        message: 'NFT minted successfully',
        nft: nft,
        transaction: mintResult
      });
    }
  } catch (error: any) {
    console.error('Error minting NFT:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mint NFT',
      error: error.message || 'Unknown error'
    });
  }
});

/**
 * Add NFT to the pool (admin only)
 * POST /api/nfts/add
 * Body: { nftData }
 */
router.post('/add', async (req: Request, res: Response) => {
  try {
    const { nftData } = req.body;
    
    // Validate required fields
    if (!nftData || !nftData.nftId || !nftData.name || !nftData.image || 
        !nftData.description || !nftData.tier || !nftData.metadataUri) {
      return res.status(400).json({
        success: false,
        message: 'Invalid NFT data. All fields are required.'
      });
    }
    
    // Check if NFT with this ID already exists
    const existingNft = await nftPoolRepository.getNftById(nftData.nftId);
    
    if (existingNft) {
      return res.status(409).json({
        success: false,
        message: 'An NFT with this ID already exists'
      });
    }
    
    // Add NFT to pool
    const nft = await nftPoolRepository.addNftToPool(nftData);
    
    return res.status(201).json({
      success: true,
      message: 'NFT added to pool successfully',
      nft: nft
    });
  } catch (error: any) {
    console.error('Error adding NFT to pool:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to add NFT to pool',
      error: error.message || 'Unknown error'
    });
  }
});

export default router;
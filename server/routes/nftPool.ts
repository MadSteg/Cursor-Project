/**
 * NFT Pool Routes
 * 
 * Provides endpoints for accessing the NFT pool collection
 * These routes are mounted at /api/nfts
 */

import { Router, Request, Response } from 'express';
import { nftPoolRepository } from '../repositories/nftPoolRepository';

const router = Router();

/**
 * Get random NFTs from the pool by receipt tier
 * GET /api/nfts/pool?tier=premium&count=5
 */
router.get('/pool', async (req: Request, res: Response) => {
  try {
    const tier = (req.query.tier as string) || 'basic';
    const count = parseInt(req.query.count as string) || 5;
    
    // Validate tier
    if (!['basic', 'premium', 'luxury'].includes(tier)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid tier. Must be one of: basic, premium, luxury' 
      });
    }
    
    // Get random NFTs for the specified tier
    const nfts = await nftPoolRepository.getRandomNftsByTier(tier, count);
    
    return res.json({
      success: true,
      nfts,
      count: nfts.length,
      tier
    });
  } catch (error) {
    console.error('Error fetching NFTs from pool:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch NFTs from pool' 
    });
  }
});

/**
 * Get NFT details by ID
 * GET /api/nfts/details/:nftId
 */
router.get('/details/:nftId', async (req: Request, res: Response) => {
  try {
    const { nftId } = req.params;
    
    const nft = await nftPoolRepository.getNftById(nftId);
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        message: 'NFT not found'
      });
    }
    
    return res.json({
      success: true,
      nft
    });
  } catch (error) {
    console.error('Error fetching NFT details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch NFT details'
    });
  }
});

/**
 * Select an NFT from the pool
 * POST /api/nfts/select
 * Body: { nftId, walletAddress }
 */
router.post('/select', async (req: Request, res: Response) => {
  try {
    const { nftId, walletAddress } = req.body;
    
    if (!nftId || !walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: nftId, walletAddress'
      });
    }
    
    // Get the NFT from the pool
    const nft = await nftPoolRepository.getNftById(nftId);
    
    if (!nft) {
      return res.status(404).json({
        success: false,
        message: 'NFT not found'
      });
    }
    
    // Disable the NFT in the pool so it can't be selected again
    await nftPoolRepository.disableNft(nftId);
    
    // Return success response - the actual NFT minting will happen in the NFT Purchase Bot service
    return res.json({
      success: true,
      message: 'NFT selected successfully',
      nft,
      walletAddress
    });
  } catch (error) {
    console.error('Error selecting NFT:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to select NFT'
    });
  }
});

/**
 * Get available NFT counts by tier
 * GET /api/nfts/counts
 */
router.get('/counts', async (req: Request, res: Response) => {
  try {
    const counts = await nftPoolRepository.getNftCounts();
    
    return res.json({
      success: true,
      counts
    });
  } catch (error) {
    console.error('Error fetching NFT counts:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch NFT counts'
    });
  }
});

export default router;
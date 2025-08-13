import { Router } from 'express';
import { z } from 'zod';
import { LoyaltyRewardsService } from '../services/loyaltyRewardsService';
// Database temporarily disabled - using mock data
// import { db } from '../db';
// import { merchantRewardPools, merchants, nftPool, loyaltyPoints } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

const router = Router();

/**
 * GET /api/loyalty/points/:userId/:merchantId
 * Get user's loyalty points balance for a specific merchant
 */
router.get('/points/:userId/:merchantId', async (req, res) => {
  try {
    const { userId, merchantId } = req.params;
    
    const balance = await LoyaltyRewardsService.getUserPointsBalance(
      parseInt(userId),
      parseInt(merchantId)
    );
    
    res.json({
      success: true,
      data: {
        userId: parseInt(userId),
        merchantId: parseInt(merchantId),
        pointsBalance: balance
      }
    });
  } catch (error) {
    console.error('Error fetching points balance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch points balance'
    });
  }
});

/**
 * GET /api/loyalty/history/:userId
 * Get user's reward history across all merchants
 */
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { merchantId } = req.query;
    
    const history = await LoyaltyRewardsService.getUserRewardHistory(
      parseInt(userId),
      merchantId ? parseInt(merchantId as string) : undefined
    );
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching reward history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reward history'
    });
  }
});

/**
 * POST /api/loyalty/redeem
 * Redeem loyalty points for rewards
 */
router.post('/redeem', async (req, res) => {
  try {
    const schema = z.object({
      userId: z.number(),
      merchantId: z.number(),
      pointsToRedeem: z.number().min(1),
      redemptionType: z.string().default('discount')
    });
    
    const data = schema.parse(req.body);
    
    const result = await LoyaltyRewardsService.redeemPoints(
      data.userId,
      data.merchantId,
      data.pointsToRedeem,
      data.redemptionType
    );
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        data: {
          discountAmount: result.discountAmount,
          pointsRedeemed: data.pointsToRedeem
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Error redeeming points:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to redeem points'
    });
  }
});

/**
 * GET /api/loyalty/merchant/:merchantId/pool
 * Get merchant's reward pool information
 */
router.get('/merchant/:merchantId/pool', async (req, res) => {
  try {
    const { merchantId } = req.params;
    
    // Mock response since database is temporarily disabled
    const mockPool = {
      id: 1,
      merchantId: parseInt(merchantId),
      name: 'Demo Reward Pool',
      description: 'Demo reward pool for testing',
      totalFunded: 1000,
      totalMinted: 5,
      ourCommissionRate: 10,
      isActive: true,
      startDate: new Date(),
      endDate: null,
      createdAt: new Date()
    };
    
    const mockNFTs = [
      { id: 1, merchantId: parseInt(merchantId), tier: 'basic', enabled: true },
      { id: 2, merchantId: parseInt(merchantId), tier: 'premium', enabled: true },
      { id: 3, merchantId: parseInt(merchantId), tier: 'luxury', enabled: true }
    ];
    
    res.json({
      success: true,
      data: {
        pool: mockPool,
        availableNFTs: mockNFTs.length,
        nftsByTier: {
          basic: mockNFTs.filter(n => n.tier === 'basic').length,
          premium: mockNFTs.filter(n => n.tier === 'premium').length,
          luxury: mockNFTs.filter(n => n.tier === 'luxury').length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching merchant pool:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch merchant reward pool'
    });
  }
});

/**
 * POST /api/loyalty/merchant/pool
 * Create a new merchant reward pool
 */
router.post('/merchant/pool', async (req, res) => {
  try {
    const schema = z.object({
      merchantId: z.number(),
      name: z.string().min(1),
      description: z.string().optional(),
      totalFunded: z.number().min(0), // In cents
      ourCommissionRate: z.number().min(0).max(100).default(10),
      endDate: z.string().optional()
    });
    
    const data = schema.parse(req.body);
    
    // Mock response since database is temporarily disabled
    const newPool = {
      id: Math.floor(Math.random() * 1000),
      merchantId: data.merchantId,
      name: data.name,
      description: data.description,
      totalFunded: data.totalFunded,
      ourCommissionRate: data.ourCommissionRate,
      endDate: data.endDate ? new Date(data.endDate) : null,
      isActive: true,
      startDate: new Date(),
      createdAt: new Date()
    };
    
    res.json({
      success: true,
      message: 'Reward pool created successfully',
      data: newPool
    });
  } catch (error) {
    console.error('Error creating reward pool:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create reward pool'
    });
  }
});

/**
 * POST /api/loyalty/merchant/nft
 * Add NFT to merchant's pool
 */
router.post('/merchant/nft', async (req, res) => {
  try {
    const schema = z.object({
      merchantId: z.number(),
      nftId: z.string(),
      name: z.string().min(1),
      image: z.string().url(),
      description: z.string(),
      tier: z.enum(['basic', 'premium', 'luxury']),
      metadataUri: z.string(),
      categories: z.array(z.string())
    });
    
    const data = schema.parse(req.body);
    
    // Mock response since database is temporarily disabled
    const newNFT = { 
      id: Math.floor(Math.random() * 1000),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    res.json({
      success: true,
      message: 'NFT added to merchant pool successfully',
      data: newNFT
    });
  } catch (error) {
    console.error('Error adding NFT to pool:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: error.errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to add NFT to pool'
    });
  }
});

export default router;
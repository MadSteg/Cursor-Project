import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { loyaltyService } from '../services/loyaltyService';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Validation schemas
const userIdSchema = z.object({
  userId: z.string().min(1)
});

const merchantIdSchema = z.object({
  merchantId: z.string().min(1)
});

const earnPointsSchema = z.object({
  userId: z.string().min(1),
  merchantId: z.string().min(1),
  amount: z.number().positive()
});

const redeemRewardSchema = z.object({
  userId: z.string().min(1),
  rewardId: z.string().min(1)
});

const createRewardSchema = z.object({
  merchantId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  pointsCost: z.number().positive(),
  category: z.enum(['discount', 'free_item', 'cashback', 'exclusive', 'early_access']),
  discount: z.number().optional(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
  isActive: z.boolean(),
  maxRedemptions: z.number().positive().optional()
});

/**
 * GET /api/loyalty/user/:userId
 * Get all loyalty programs for a user
 */
router.get('/user/:userId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { userId } = userIdSchema.parse({
      userId: req.params.userId
    });
    
    const loyaltyPrograms = await loyaltyService.getUserLoyaltyPrograms(userId);
    
    res.json({
      success: true,
      data: loyaltyPrograms
    });
  } catch (error) {
    console.error('Error fetching user loyalty programs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch loyalty programs'
    });
  }
});

/**
 * GET /api/loyalty/user/:userId/merchant/:merchantId
 * Get user's loyalty status for a specific merchant
 */
router.get('/user/:userId/merchant/:merchantId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { userId, merchantId } = z.object({
      userId: req.params.userId,
      merchantId: req.params.merchantId
    }).parse(req.params);
    
    const loyalty = await loyaltyService.getUserLoyalty(userId, merchantId);
    
    if (!loyalty) {
      return res.status(404).json({
        success: false,
        error: 'No loyalty program found for this merchant'
      });
    }
    
    res.json({
      success: true,
      data: loyalty
    });
  } catch (error) {
    console.error('Error fetching user loyalty:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch loyalty status'
    });
  }
});

/**
 * POST /api/loyalty/earn-points
 * Earn points for a purchase
 */
router.post('/earn-points', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { userId, merchantId, amount } = earnPointsSchema.parse(req.body);
    
    const result = await loyaltyService.earnPoints(userId, merchantId, amount);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error earning points:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to earn points'
    });
  }
});

/**
 * POST /api/loyalty/redeem-reward
 * Redeem a reward
 */
router.post('/redeem-reward', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { userId, rewardId } = redeemRewardSchema.parse(req.body);
    
    const result = await loyaltyService.redeemReward(userId, rewardId);
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error redeeming reward:', error);
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to redeem reward'
    });
  }
});

/**
 * GET /api/loyalty/merchant/:merchantId/rewards
 * Get available rewards for a merchant
 */
router.get('/merchant/:merchantId/rewards', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { merchantId } = merchantIdSchema.parse({
      merchantId: req.params.merchantId
    });
    
    const { userPoints } = z.object({
      userPoints: z.number().min(0).optional().default(0)
    }).parse(req.query);
    
    const rewards = await loyaltyService.getAvailableRewards(merchantId, userPoints);
    
    res.json({
      success: true,
      data: rewards
    });
  } catch (error) {
    console.error('Error fetching merchant rewards:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rewards'
    });
  }
});

/**
 * GET /api/loyalty/merchant/:merchantId/stats
 * Get merchant loyalty statistics
 */
router.get('/merchant/:merchantId/stats', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { merchantId } = merchantIdSchema.parse({
      merchantId: req.params.merchantId
    });
    
    const stats = await loyaltyService.getMerchantLoyaltyStats(merchantId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching merchant loyalty stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch loyalty statistics'
    });
  }
});

/**
 * POST /api/loyalty/merchant/:merchantId/rewards
 * Create a new reward for a merchant
 */
router.post('/merchant/:merchantId/rewards', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { merchantId } = merchantIdSchema.parse({
      merchantId: req.params.merchantId
    });
    
    const rewardData = createRewardSchema.parse({
      ...req.body,
      merchantId
    });
    
    const newReward = await loyaltyService.createReward(merchantId, rewardData);
    
    res.json({
      success: true,
      data: newReward
    });
  } catch (error) {
    console.error('Error creating reward:', error);
    res.status(400).json({
      success: false,
      error: 'Failed to create reward'
    });
  }
});

/**
 * GET /api/loyalty/tiers
 * Get all loyalty tiers
 */
router.get('/tiers', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const tiers = loyaltyService.getLoyaltyTiers();
    
    res.json({
      success: true,
      data: tiers
    });
  } catch (error) {
    console.error('Error fetching loyalty tiers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch loyalty tiers'
    });
  }
});

/**
 * GET /api/loyalty/user/:userId/summary
 * Get loyalty summary for a user
 */
router.get('/user/:userId/summary', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { userId } = userIdSchema.parse({
      userId: req.params.userId
    });
    
    const loyaltyPrograms = await loyaltyService.getUserLoyaltyPrograms(userId);
    
    const summary = {
      totalPrograms: loyaltyPrograms.length,
      totalPoints: loyaltyPrograms.reduce((sum, program) => sum + program.currentPoints, 0),
      totalSpent: loyaltyPrograms.reduce((sum, program) => sum + program.totalSpent, 0),
      averageTier: loyaltyPrograms.length > 0 
        ? loyaltyPrograms.reduce((sum, program) => sum + program.tier.level, 0) / loyaltyPrograms.length 
        : 0,
      topMerchant: loyaltyPrograms.length > 0 
        ? loyaltyPrograms.reduce((max, program) => 
            program.currentPoints > max.currentPoints ? program : max
          )
        : null
    };
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching loyalty summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch loyalty summary'
    });
  }
});

/**
 * GET /api/loyalty/merchant/:merchantId/top-customers
 * Get top customers for a merchant
 */
router.get('/merchant/:merchantId/top-customers', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { merchantId } = merchantIdSchema.parse({
      merchantId: req.params.merchantId
    });
    
    const stats = await loyaltyService.getMerchantLoyaltyStats(merchantId);
    
    res.json({
      success: true,
      data: {
        merchantId,
        topCustomers: stats.topSpenders
      }
    });
  } catch (error) {
    console.error('Error fetching top customers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top customers'
    });
  }
});

/**
 * GET /api/loyalty/user/:userId/merchant/:merchantId/history
 * Get loyalty transaction history
 */
router.get('/user/:userId/merchant/:merchantId/history', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { userId, merchantId } = z.object({
      userId: req.params.userId,
      merchantId: req.params.merchantId
    }).parse(req.params);
    
    // Mock transaction history
    const history = [
      {
        id: 'TXN-001',
        type: 'earned',
        points: 150,
        amount: 150.00,
        description: 'Purchase at Starbucks',
        timestamp: new Date('2024-01-15T10:30:00Z')
      },
      {
        id: 'TXN-002',
        type: 'redeemed',
        points: -75,
        amount: 0,
        description: 'Redeemed 50% off pastry',
        timestamp: new Date('2024-01-14T15:45:00Z')
      },
      {
        id: 'TXN-003',
        type: 'earned',
        points: 89,
        amount: 89.99,
        description: 'Purchase at Starbucks',
        timestamp: new Date('2024-01-13T09:15:00Z')
      }
    ];
    
    res.json({
      success: true,
      data: {
        userId,
        merchantId,
        history
      }
    });
  } catch (error) {
    console.error('Error fetching loyalty history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch loyalty history'
    });
  }
});

/**
 * GET /api/loyalty/user/current
 * Get loyalty status for the currently authenticated user
 */
router.get('/user/current', isAuthenticated, async (req: Request, res: Response) => {
  try {
    // In a real app, you'd get the user ID from the authenticated session
    const userId = req.user?.id || 'current-user';
    
    const loyalty = await loyaltyService.getUserLoyalty(userId);
    
    res.json({
      success: true,
      data: loyalty
    });
  } catch (error) {
    console.error('Error fetching user loyalty:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user loyalty'
    });
  }
});

export default router; 
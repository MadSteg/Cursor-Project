import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { analyticsService } from '../services/analyticsService';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Validation schemas
const timeRangeSchema = z.object({
  timeRange: z.enum(['7d', '30d', '90d']).optional().default('30d')
});

const merchantIdSchema = z.object({
  merchantId: z.string().min(1)
});

const userIdSchema = z.object({
  userId: z.string().min(1)
});

/**
 * GET /api/analytics/merchant/:merchantId
 * Get comprehensive analytics for a specific merchant
 */
router.get('/merchant/:merchantId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { merchantId } = merchantIdSchema.parse({
      merchantId: req.params.merchantId
    });
    
    const { timeRange } = timeRangeSchema.parse(req.query);
    
    const analytics = await analyticsService.getMerchantAnalytics(merchantId, timeRange);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching merchant analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch merchant analytics'
    });
  }
});

/**
 * GET /api/analytics/customer/:userId
 * Get customer spending analytics
 */
router.get('/customer/:userId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { userId } = userIdSchema.parse({
      userId: req.params.userId
    });
    
    const analytics = await analyticsService.getCustomerAnalytics(userId);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer analytics'
    });
  }
});

/**
 * GET /api/analytics/insights/:userId
 * Get spending insights and recommendations
 */
router.get('/insights/:userId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { userId } = userIdSchema.parse({
      userId: req.params.userId
    });
    
    const insights = await analyticsService.getSpendingInsights(userId);
    
    res.json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Error fetching spending insights:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch spending insights'
    });
  }
});

/**
 * POST /api/analytics/merchant-comparison
 * Compare multiple merchants' performance
 */
router.post('/merchant-comparison', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { merchantIds } = z.object({
      merchantIds: z.array(z.string().min(1)).min(1)
    }).parse(req.body);
    
    const comparison = await analyticsService.getMerchantComparison(merchantIds);
    
    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    console.error('Error comparing merchants:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to compare merchants'
    });
  }
});

/**
 * GET /api/analytics/customer/current
 * Get analytics for the currently authenticated user
 */
router.get('/customer/current', isAuthenticated, async (req: Request, res: Response) => {
  try {
    // In a real app, you'd get the user ID from the authenticated session
    const userId = req.user?.id || 'current-user';
    
    const analytics = await analyticsService.getCustomerAnalytics(userId);
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching customer analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer analytics'
    });
  }
});

/**
 * GET /api/analytics/dashboard
 * Get comprehensive dashboard data for the current user
 */
router.get('/dashboard', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id || 'current-user';
    
    // Get comprehensive dashboard data
    const [customerAnalytics, spendingInsights] = await Promise.all([
      analyticsService.getCustomerAnalytics(userId),
      analyticsService.getSpendingInsights(userId)
    ]);
    
    // Transform data for dashboard
    const dashboardData = {
      totalReceipts: customerAnalytics.totalReceipts || 0,
      totalSpent: customerAnalytics.totalSpent || 0,
      averageReceipt: customerAnalytics.averageReceipt || 0,
      receiptsThisMonth: customerAnalytics.receiptsThisMonth || 0,
      spendingThisMonth: customerAnalytics.spendingThisMonth || 0,
      monthlyGrowth: customerAnalytics.monthlyGrowth || 0,
      recentReceipts: customerAnalytics.recentReceipts || [],
      spendingByCategory: customerAnalytics.spendingByCategory || [],
      monthlyTrends: customerAnalytics.monthlyTrends || [],
      insights: spendingInsights
    };
    
    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard data'
    });
  }
});

/**
 * GET /api/analytics/revenue-trend/:merchantId
 * Get revenue trend over time
 */
router.get('/revenue-trend/:merchantId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { merchantId } = merchantIdSchema.parse({
      merchantId: req.params.merchantId
    });
    
    const { timeRange } = timeRangeSchema.parse(req.query);
    
    // Mock revenue trend data
    const revenueTrend = [
      { month: 'Jan', revenue: 45000 },
      { month: 'Feb', revenue: 52000 },
      { month: 'Mar', revenue: 48000 },
      { month: 'Apr', revenue: 61000 },
      { month: 'May', revenue: 55000 },
      { month: 'Jun', revenue: 67000 }
    ];
    
    res.json({
      success: true,
      data: {
        merchantId,
        timeRange,
        trend: revenueTrend
      }
    });
  } catch (error) {
    console.error('Error fetching revenue trend:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch revenue trend'
    });
  }
});

/**
 * GET /api/analytics/customer-segments/:merchantId
 * Get customer segmentation data
 */
router.get('/customer-segments/:merchantId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { merchantId } = merchantIdSchema.parse({
      merchantId: req.params.merchantId
    });
    
    // Mock customer segments
    const segments = [
      {
        segment: 'High Value',
        count: 150,
        percentage: 15,
        averageSpend: 250.00,
        retention: 85
      },
      {
        segment: 'Medium Value',
        count: 450,
        percentage: 45,
        averageSpend: 120.00,
        retention: 65
      },
      {
        segment: 'Low Value',
        count: 400,
        percentage: 40,
        averageSpend: 45.00,
        retention: 35
      }
    ];
    
    res.json({
      success: true,
      data: {
        merchantId,
        segments
      }
    });
  } catch (error) {
    console.error('Error fetching customer segments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch customer segments'
    });
  }
});

/**
 * GET /api/analytics/product-performance/:merchantId
 * Get product performance analytics
 */
router.get('/product-performance/:merchantId', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const { merchantId } = merchantIdSchema.parse({
      merchantId: req.params.merchantId
    });
    
    // Mock product performance data
    const products = [
      {
        name: 'Product A',
        revenue: 25000,
        units: 1500,
        margin: 0.25,
        growth: 12.5
      },
      {
        name: 'Product B',
        revenue: 18000,
        units: 1200,
        margin: 0.30,
        growth: 8.3
      },
      {
        name: 'Product C',
        revenue: 14250,
        units: 950,
        margin: 0.20,
        growth: 15.7
      }
    ];
    
    res.json({
      success: true,
      data: {
        merchantId,
        products
      }
    });
  } catch (error) {
    console.error('Error fetching product performance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product performance'
    });
  }
});

export default router; 
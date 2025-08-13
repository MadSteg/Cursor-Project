import { db } from '../db';
import { receipts, users, merchants } from '../../shared/schema';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';

export interface AnalyticsData {
  totalRevenue: number;
  monthlyGrowth: number;
  totalCustomers: number;
  customerGrowth: number;
  totalReceipts: number;
  receiptGrowth: number;
  averageTransactionValue: number;
  topCategories: Array<{ name: string; value: number; percentage: number }>;
  recentTransactions: Array<{
    id: string;
    customer: string;
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
  }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
}

export interface MerchantAnalytics {
  merchantId: string;
  totalRevenue: number;
  totalTransactions: number;
  averageOrderValue: number;
  customerCount: number;
  topProducts: Array<{ name: string; quantity: number; revenue: number }>;
  customerRetention: number;
  revenueGrowth: number;
}

export class AnalyticsService {
  /**
   * Get comprehensive analytics for a merchant
   */
  async getMerchantAnalytics(merchantId: string, timeRange: '7d' | '30d' | '90d' = '30d'): Promise<MerchantAnalytics> {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
    }

    // Get current period data
    const currentReceipts = await db
      .select()
      .from(receipts)
      .where(
        and(
          eq(receipts.merchantId, merchantId),
          gte(receipts.createdAt, startDate),
          lte(receipts.createdAt, now)
        )
      );

    // Get previous period data for growth calculation
    const previousStartDate = new Date(startDate);
    const previousEndDate = new Date(startDate);
    const periodLength = now.getTime() - startDate.getTime();
    previousStartDate.setTime(previousStartDate.getTime() - periodLength);
    previousEndDate.setTime(previousEndDate.getTime() - periodLength);

    const previousReceipts = await db
      .select()
      .from(receipts)
      .where(
        and(
          eq(receipts.merchantId, merchantId),
          gte(receipts.createdAt, previousStartDate),
          lte(receipts.createdAt, previousEndDate)
        )
      );

    // Calculate metrics
    const totalRevenue = currentReceipts.reduce((sum, receipt) => sum + (receipt.total || 0), 0);
    const previousRevenue = previousReceipts.reduce((sum, receipt) => sum + (receipt.total || 0), 0);
    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    const totalTransactions = currentReceipts.length;
    const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    // Get unique customers
    const uniqueCustomers = new Set(currentReceipts.map(r => r.userId)).size;

    // Calculate customer retention (simplified)
    const customerRetention = uniqueCustomers > 0 ? (uniqueCustomers / totalTransactions) * 100 : 0;

    // Mock top products (in real implementation, you'd analyze receipt items)
    const topProducts = [
      { name: 'Product A', quantity: 150, revenue: 2500 },
      { name: 'Product B', quantity: 120, revenue: 1800 },
      { name: 'Product C', quantity: 95, revenue: 1425 }
    ];

    return {
      merchantId,
      totalRevenue,
      totalTransactions,
      averageOrderValue,
      customerCount: uniqueCustomers,
      topProducts,
      customerRetention,
      revenueGrowth
    };
  }

  /**
   * Get comprehensive analytics for a customer
   */
  async getCustomerAnalytics(userId: string): Promise<any> {
    try {
      // Get user's receipts
      const userReceipts = await db
        .select()
        .from(receipts)
        .where(eq(receipts.userId, userId))
        .orderBy(desc(receipts.createdAt));

      if (userReceipts.length === 0) {
        return {
          totalReceipts: 0,
          totalSpent: 0,
          averageReceipt: 0,
          receiptsThisMonth: 0,
          spendingThisMonth: 0,
          monthlyGrowth: 0,
          recentReceipts: [],
          spendingByCategory: [],
          monthlyTrends: []
        };
      }

      // Calculate basic metrics
      const totalReceipts = userReceipts.length;
      const totalSpent = userReceipts.reduce((sum, receipt) => sum + (receipt.total || 0), 0);
      const averageReceipt = totalReceipts > 0 ? totalSpent / totalReceipts : 0;

      // Calculate monthly metrics
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const receiptsThisMonth = userReceipts.filter(r => 
        new Date(r.createdAt) >= startOfMonth
      ).length;

      const spendingThisMonth = userReceipts
        .filter(r => new Date(r.createdAt) >= startOfMonth)
        .reduce((sum, receipt) => sum + (receipt.total || 0), 0);

      const spendingLastMonth = userReceipts
        .filter(r => {
          const date = new Date(r.createdAt);
          return date >= lastMonthStart && date <= lastMonthEnd;
        })
        .reduce((sum, receipt) => sum + (receipt.total || 0), 0);

      const monthlyGrowth = spendingLastMonth > 0 
        ? ((spendingThisMonth - spendingLastMonth) / spendingLastMonth) * 100 
        : 0;

      // Get recent receipts (last 5)
      const recentReceipts = userReceipts.slice(0, 5).map(receipt => ({
        id: receipt.id,
        merchantName: receipt.merchantName || 'Unknown Merchant',
        date: receipt.createdAt.toISOString(),
        amount: receipt.total || 0,
        category: receipt.category || 'Other',
        loyaltyTier: 'Gold' // This would come from loyalty service
      }));

      // Calculate spending by category
      const categoryMap = new Map<string, { amount: number; count: number }>();
      userReceipts.forEach(receipt => {
        const category = receipt.category || 'Other';
        const existing = categoryMap.get(category) || { amount: 0, count: 0 };
        existing.amount += receipt.total || 0;
        existing.count += 1;
        categoryMap.set(category, existing);
      });

      const spendingByCategory = Array.from(categoryMap.entries()).map(([category, data]) => ({
        category,
        amount: data.amount,
        percentage: (data.amount / totalSpent) * 100,
        count: data.count
      })).sort((a, b) => b.amount - a.amount);

      // Calculate monthly trends (last 6 months)
      const monthlyTrends = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        
        const monthReceipts = userReceipts.filter(r => {
          const date = new Date(r.createdAt);
          return date >= monthStart && date <= monthEnd;
        });

        const monthSpending = monthReceipts.reduce((sum, receipt) => sum + (receipt.total || 0), 0);
        
        monthlyTrends.push({
          month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
          spending: monthSpending,
          receipts: monthReceipts.length
        });
      }

      return {
        totalReceipts,
        totalSpent,
        averageReceipt,
        receiptsThisMonth,
        spendingThisMonth,
        monthlyGrowth,
        recentReceipts,
        spendingByCategory,
        monthlyTrends
      };
    } catch (error) {
      console.error('Error getting customer analytics:', error);
      throw error;
    }
  }

  /**
   * Get spending insights and recommendations
   */
  async getSpendingInsights(userId: string): Promise<{
    insights: string[];
    recommendations: string[];
    spendingPatterns: Array<{ category: string; amount: number; percentage: number }>;
  }> {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const userReceipts = await db
      .select()
      .from(receipts)
      .where(
        and(
          eq(receipts.userId, userId),
          gte(receipts.createdAt, thirtyDaysAgo)
        )
      );

    const totalSpent = userReceipts.reduce((sum, receipt) => sum + (receipt.total || 0), 0);
    const avgSpending = totalSpent / userReceipts.length;

    // Mock insights based on spending patterns
    const insights = [
      `You spend an average of $${avgSpending.toFixed(2)} per transaction`,
      'Your top spending category is Food & Beverage',
      'You make most purchases on weekends',
      'Consider setting up automatic savings for large purchases'
    ];

    const recommendations = [
      'Set up spending alerts for categories over $100',
      'Consider bulk purchases for household items',
      'Look into loyalty programs for your frequent merchants',
      'Review your subscriptions monthly'
    ];

    const spendingPatterns = [
      { category: 'Food & Beverage', amount: totalSpent * 0.4, percentage: 40 },
      { category: 'Electronics', amount: totalSpent * 0.3, percentage: 30 },
      { category: 'Transportation', amount: totalSpent * 0.2, percentage: 20 },
      { category: 'Other', amount: totalSpent * 0.1, percentage: 10 }
    ];

    return {
      insights,
      recommendations,
      spendingPatterns
    };
  }

  /**
   * Get merchant performance comparison
   */
  async getMerchantComparison(merchantIds: string[]): Promise<Array<{
    merchantId: string;
    merchantName: string;
    revenue: number;
    transactions: number;
    averageOrder: number;
    customerCount: number;
  }>> {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const results = await Promise.all(
      merchantIds.map(async (merchantId) => {
        const merchantReceipts = await db
          .select()
          .from(receipts)
          .where(
            and(
              eq(receipts.merchantId, merchantId),
              gte(receipts.createdAt, thirtyDaysAgo)
            )
          );

        const revenue = merchantReceipts.reduce((sum, receipt) => sum + (receipt.total || 0), 0);
        const transactions = merchantReceipts.length;
        const averageOrder = transactions > 0 ? revenue / transactions : 0;
        const customerCount = new Set(merchantReceipts.map(r => r.userId)).size;

        // Get merchant name
        const merchant = await db
          .select()
          .from(merchants)
          .where(eq(merchants.id, merchantId))
          .limit(1);

        return {
          merchantId,
          merchantName: merchant[0]?.name || 'Unknown Merchant',
          revenue,
          transactions,
          averageOrder,
          customerCount
        };
      })
    );

    return results;
  }

  /**
   * Get real-time analytics dashboard data
   */
  async getDashboardData(merchantId?: string): Promise<{
    totalRevenue: number;
    totalTransactions: number;
    activeCustomers: number;
    averageOrderValue: number;
    topMerchants: Array<{ name: string; revenue: number }>;
    recentActivity: Array<{ type: string; description: string; timestamp: Date }>;
  }> {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const whereClause = merchantId 
      ? and(
          eq(receipts.merchantId, merchantId),
          gte(receipts.createdAt, thirtyDaysAgo)
        )
      : gte(receipts.createdAt, thirtyDaysAgo);

    const allReceipts = await db
      .select()
      .from(receipts)
      .where(whereClause)
      .orderBy(desc(receipts.createdAt));

    const totalRevenue = allReceipts.reduce((sum, receipt) => sum + (receipt.total || 0), 0);
    const totalTransactions = allReceipts.length;
    const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    const activeCustomers = new Set(allReceipts.map(r => r.userId)).size;

    // Mock top merchants
    const topMerchants = [
      { name: 'Starbucks', revenue: totalRevenue * 0.3 },
      { name: 'Best Buy', revenue: totalRevenue * 0.25 },
      { name: 'Target', revenue: totalRevenue * 0.2 },
      { name: 'Shell', revenue: totalRevenue * 0.15 },
      { name: 'Other', revenue: totalRevenue * 0.1 }
    ];

    // Mock recent activity
    const recentActivity = [
      { type: 'receipt', description: 'New receipt from Starbucks', timestamp: new Date() },
      { type: 'loyalty', description: 'Points earned at Best Buy', timestamp: new Date(Date.now() - 3600000) },
      { type: 'reward', description: 'Reward redeemed at Target', timestamp: new Date(Date.now() - 7200000) }
    ];

    return {
      totalRevenue,
      totalTransactions,
      activeCustomers,
      averageOrderValue,
      topMerchants,
      recentActivity
    };
  }
}

export const analyticsService = new AnalyticsService(); 
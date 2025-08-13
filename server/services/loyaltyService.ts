import { db } from '../db';
import { receipts, users, merchants } from '../../shared/schema';
import { eq, and, gte, lte, desc } from 'drizzle-orm';

export interface LoyaltyTier {
  id: string;
  name: string;
  level: number;
  minPoints: number;
  maxPoints: number;
  benefits: string[];
  color: string;
  multiplier: number; // Points multiplier for this tier
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  merchantId: string;
  category: 'discount' | 'free_item' | 'cashback' | 'exclusive' | 'early_access';
  discount?: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  maxRedemptions?: number;
  currentRedemptions: number;
}

export interface UserLoyalty {
  userId: string;
  merchantId: string;
  currentPoints: number;
  totalPointsEarned: number;
  totalPointsSpent: number;
  tier: LoyaltyTier;
  visits: number;
  totalSpent: number;
  lastVisit: Date;
  availableRewards: Reward[];
}

export class LoyaltyService {
  private readonly defaultTiers: LoyaltyTier[] = [
    {
      id: 'bronze',
      name: 'Bronze',
      level: 1,
      minPoints: 0,
      maxPoints: 500,
      benefits: ['5% off on birthday', 'Basic rewards'],
      color: '#CD7F32',
      multiplier: 1.0
    },
    {
      id: 'silver',
      name: 'Silver',
      level: 2,
      minPoints: 500,
      maxPoints: 1000,
      benefits: ['10% off on birthday', 'Free shipping', 'Priority support'],
      color: '#C0C0C0',
      multiplier: 1.2
    },
    {
      id: 'gold',
      name: 'Gold',
      level: 3,
      minPoints: 1000,
      maxPoints: 2000,
      benefits: ['15% off on birthday', 'Free shipping', 'Priority support', 'Exclusive offers'],
      color: '#FFD700',
      multiplier: 1.5
    },
    {
      id: 'platinum',
      name: 'Platinum',
      level: 4,
      minPoints: 2000,
      maxPoints: 5000,
      benefits: ['20% off on birthday', 'Free shipping', 'Priority support', 'Exclusive offers', 'VIP events'],
      color: '#E5E4E2',
      multiplier: 2.0
    },
    {
      id: 'diamond',
      name: 'Diamond',
      level: 5,
      minPoints: 5000,
      maxPoints: Infinity,
      benefits: ['25% off on birthday', 'Free shipping', 'Priority support', 'Exclusive offers', 'VIP events', 'Personal concierge'],
      color: '#B9F2FF',
      multiplier: 2.5
    }
  ];

  /**
   * Get user's loyalty status for a merchant
   */
  async getUserLoyalty(userId: string, merchantId: string): Promise<UserLoyalty | null> {
    // Get user's receipts for this merchant
    const userReceipts = await db
      .select()
      .from(receipts)
      .where(
        and(
          eq(receipts.userId, userId),
          eq(receipts.merchantId, merchantId)
        )
      )
      .orderBy(desc(receipts.createdAt));

    if (userReceipts.length === 0) {
      return null;
    }

    // Calculate points (1 point per $1 spent)
    const totalSpent = userReceipts.reduce((sum, receipt) => sum + (receipt.total || 0), 0);
    const totalPointsEarned = Math.floor(totalSpent);
    const totalPointsSpent = 0; // Would be calculated from reward redemptions
    const currentPoints = totalPointsEarned - totalPointsSpent;

    // Determine tier
    const tier = this.getTierForPoints(currentPoints);
    const visits = userReceipts.length;
    const lastVisit = userReceipts[0]?.createdAt || new Date();

    // Get available rewards
    const availableRewards = await this.getAvailableRewards(merchantId, currentPoints);

    return {
      userId,
      merchantId,
      currentPoints,
      totalPointsEarned,
      totalPointsSpent,
      tier,
      visits,
      totalSpent,
      lastVisit,
      availableRewards
    };
  }

  /**
   * Get all loyalty programs for a user
   */
  async getUserLoyaltyPrograms(userId: string): Promise<UserLoyalty[]> {
    // Get all unique merchants the user has receipts from
    const userReceipts = await db
      .select()
      .from(receipts)
      .where(eq(receipts.userId, userId));

    const merchantIds = [...new Set(userReceipts.map(r => r.merchantId))];
    
    const loyaltyPrograms = await Promise.all(
      merchantIds.map(merchantId => this.getUserLoyalty(userId, merchantId))
    );

    return loyaltyPrograms.filter(Boolean) as UserLoyalty[];
  }

  /**
   * Earn points for a purchase
   */
  async earnPoints(userId: string, merchantId: string, amount: number): Promise<{
    pointsEarned: number;
    newTotal: number;
    tierUpgrade?: LoyaltyTier;
  }> {
    const currentLoyalty = await this.getUserLoyalty(userId, merchantId);
    const basePoints = Math.floor(amount);
    const tier = currentLoyalty?.tier || this.defaultTiers[0];
    const pointsEarned = Math.floor(basePoints * tier.multiplier);
    const newTotal = (currentLoyalty?.currentPoints || 0) + pointsEarned;

    // Check for tier upgrade
    const newTier = this.getTierForPoints(newTotal);
    const tierUpgrade = newTier.level > tier.level ? newTier : undefined;

    // In a real implementation, you'd save this to the database
    // await db.insert(loyaltyTransactions).values({
    //   userId,
    //   merchantId,
    //   points: pointsEarned,
    //   type: 'earned',
    //   amount,
    //   createdAt: new Date()
    // });

    return {
      pointsEarned,
      newTotal,
      tierUpgrade
    };
  }

  /**
   * Redeem a reward
   */
  async redeemReward(userId: string, rewardId: string): Promise<{
    success: boolean;
    pointsSpent: number;
    newBalance: number;
    reward: Reward;
  }> {
    // Get the reward
    const reward = await this.getRewardById(rewardId);
    if (!reward || !reward.isActive) {
      throw new Error('Reward not available');
    }

    // Get user's current loyalty
    const loyalty = await this.getUserLoyalty(userId, reward.merchantId);
    if (!loyalty || loyalty.currentPoints < reward.pointsCost) {
      throw new Error('Insufficient points');
    }

    // Check if reward is still valid
    const now = new Date();
    if (now < reward.validFrom || now > reward.validUntil) {
      throw new Error('Reward expired or not yet available');
    }

    // Check redemption limits
    if (reward.maxRedemptions && reward.currentRedemptions >= reward.maxRedemptions) {
      throw new Error('Reward redemption limit reached');
    }

    // Process redemption
    const newBalance = loyalty.currentPoints - reward.pointsCost;

    // In a real implementation, you'd save this to the database
    // await db.insert(rewardRedemptions).values({
    //   userId,
    //   rewardId,
    //   pointsSpent: reward.pointsCost,
    //   redeemedAt: new Date()
    // });

    return {
      success: true,
      pointsSpent: reward.pointsCost,
      newBalance,
      reward
    };
  }

  /**
   * Get available rewards for a merchant
   */
  async getAvailableRewards(merchantId: string, userPoints: number): Promise<Reward[]> {
    // Mock rewards - in real implementation, these would come from database
    const mockRewards: Reward[] = [
      {
        id: 'RWD-001',
        name: 'Free Drink',
        description: 'Any size, any drink',
        pointsCost: 150,
        merchantId,
        category: 'free_item',
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        isActive: true,
        currentRedemptions: 0
      },
      {
        id: 'RWD-002',
        name: '50% Off Pastry',
        description: 'Any pastry item',
        pointsCost: 75,
        merchantId,
        category: 'discount',
        discount: 50,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        isActive: true,
        currentRedemptions: 0
      },
      {
        id: 'RWD-003',
        name: 'Free Shipping',
        description: 'Free shipping on next order',
        pointsCost: 100,
        merchantId,
        category: 'exclusive',
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        isActive: true,
        currentRedemptions: 0
      }
    ];

    return mockRewards.filter(reward => 
      reward.isActive && 
      userPoints >= reward.pointsCost &&
      new Date() >= reward.validFrom &&
      new Date() <= reward.validUntil
    );
  }

  /**
   * Get merchant loyalty statistics
   */
  async getMerchantLoyaltyStats(merchantId: string): Promise<{
    totalMembers: number;
    activeMembers: number;
    totalPointsIssued: number;
    totalPointsRedeemed: number;
    averageTier: number;
    topSpenders: Array<{ userId: string; points: number; tier: string }>;
  }> {
    // Get all receipts for this merchant
    const merchantReceipts = await db
      .select()
      .from(receipts)
      .where(eq(receipts.merchantId, merchantId));

    const uniqueUsers = new Set(merchantReceipts.map(r => r.userId));
    const totalMembers = uniqueUsers.size;

    // Calculate points for each user
    const userPoints = new Map<string, number>();
    merchantReceipts.forEach(receipt => {
      const current = userPoints.get(receipt.userId) || 0;
      userPoints.set(receipt.userId, current + Math.floor(receipt.total || 0));
    });

    const totalPointsIssued = Array.from(userPoints.values()).reduce((sum, points) => sum + points, 0);
    const totalPointsRedeemed = 0; // Would be calculated from redemptions
    const averageTier = 2.5; // Mock average tier

    // Get top spenders
    const topSpenders = Array.from(userPoints.entries())
      .map(([userId, points]) => ({
        userId,
        points,
        tier: this.getTierForPoints(points).name
      }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);

    return {
      totalMembers,
      activeMembers: totalMembers, // Simplified
      totalPointsIssued,
      totalPointsRedeemed,
      averageTier,
      topSpenders
    };
  }

  /**
   * Create a new reward for a merchant
   */
  async createReward(merchantId: string, rewardData: Omit<Reward, 'id' | 'currentRedemptions'>): Promise<Reward> {
    const newReward: Reward = {
      ...rewardData,
      id: `RWD-${Date.now()}`,
      currentRedemptions: 0
    };

    // In real implementation, save to database
    // await db.insert(rewards).values(newReward);

    return newReward;
  }

  /**
   * Get tier for given points
   */
  private getTierForPoints(points: number): LoyaltyTier {
    return this.defaultTiers.find(tier => 
      points >= tier.minPoints && points < tier.maxPoints
    ) || this.defaultTiers[0];
  }

  /**
   * Get reward by ID
   */
  private async getRewardById(rewardId: string): Promise<Reward | null> {
    // Mock implementation - in real app, query database
    const mockRewards: Reward[] = [
      {
        id: 'RWD-001',
        name: 'Free Drink',
        description: 'Any size, any drink',
        pointsCost: 150,
        merchantId: 'starbucks',
        category: 'free_item',
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-12-31'),
        isActive: true,
        currentRedemptions: 0
      }
    ];

    return mockRewards.find(r => r.id === rewardId) || null;
  }

  /**
   * Get loyalty tiers
   */
  getLoyaltyTiers(): LoyaltyTier[] {
    return this.defaultTiers;
  }
}

export const loyaltyService = new LoyaltyService(); 
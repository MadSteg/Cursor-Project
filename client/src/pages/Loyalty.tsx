import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/WalletContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { 
  Star, 
  Award, 
  Gift, 
  TrendingUp, 
  Users, 
  Calendar,
  Zap,
  Crown,
  Gem,
  Trophy,
  Target,
  RefreshCw
} from 'lucide-react';

interface LoyaltyData {
  userProfile: {
    currentTier: string;
    currentPoints: number;
    pointsToNextTier: number;
    nextTier: string;
    tierMultiplier: number;
    totalPointsEarned: number;
    totalPointsRedeemed: number;
    memberSince: string;
    achievements: Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      unlocked: boolean;
      unlockedAt?: string;
    }>;
  };
  availableRewards: Array<{
    id: string;
    name: string;
    description: string;
    pointsCost: number;
    category: string;
    available: boolean;
    expiresAt?: string;
    image?: string;
  }>;
  recentTransactions: Array<{
    id: string;
    type: 'earned' | 'redeemed' | 'bonus' | 'expired';
    amount: number;
    description: string;
    date: string;
    merchant?: string;
  }>;
  tierBenefits: Array<{
    tier: string;
    pointsMultiplier: number;
    benefits: Array<string>;
    color: string;
    icon: React.ReactNode;
  }>;
}

const Loyalty: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    fetchLoyaltyData();
  }, [isLoggedIn]);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      
      // Fetch loyalty data
      const response = await fetch('/api/loyalty/user/current');
      
      if (response.ok) {
        const data = await response.json();
        setLoyaltyData(transformLoyaltyData(data.data));
      } else {
        // Fallback to mock data
        setLoyaltyData(getMockLoyaltyData());
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error);
      setLoyaltyData(getMockLoyaltyData());
    } finally {
      setLoading(false);
    }
  };

  const transformLoyaltyData = (data: any): LoyaltyData => {
    // Transform API data to our format
    return {
      userProfile: data.userProfile || {},
      availableRewards: data.availableRewards || [],
      recentTransactions: data.recentTransactions || [],
      tierBenefits: data.tierBenefits || []
    };
  };

  const getMockLoyaltyData = (): LoyaltyData => ({
    userProfile: {
      currentTier: 'Gold',
      currentPoints: 2847,
      pointsToNextTier: 1153,
      nextTier: 'Platinum',
      tierMultiplier: 2,
      totalPointsEarned: 4500,
      totalPointsRedeemed: 1653,
      memberSince: '2024-03-15',
      achievements: [
        { id: '1', name: 'First Purchase', description: 'Made your first purchase', icon: '🎯', unlocked: true, unlockedAt: '2024-03-15' },
        { id: '2', name: 'Silver Tier', description: 'Reached Silver tier', icon: '🥈', unlocked: true, unlockedAt: '2024-06-20' },
        { id: '3', name: 'Gold Tier', description: 'Reached Gold tier', icon: '🥇', unlocked: true, unlockedAt: '2024-09-15' },
        { id: '4', name: '100 Receipts', description: 'Uploaded 100 receipts', icon: '📄', unlocked: true, unlockedAt: '2024-11-30' },
        { id: '5', name: 'Platinum Tier', description: 'Reach Platinum tier', icon: '💎', unlocked: false },
        { id: '6', name: '500 Receipts', description: 'Upload 500 receipts', icon: '📚', unlocked: false },
        { id: '7', name: 'Diamond Tier', description: 'Reach Diamond tier', icon: '👑', unlocked: false }
      ]
    },
    availableRewards: [
      { id: '1', name: '$10 Starbucks Gift Card', description: 'Redeem for your favorite coffee', pointsCost: 1000, category: 'Food & Beverage', available: true, expiresAt: '2025-02-28' },
      { id: '2', name: '$25 Amazon Gift Card', description: 'Shop millions of products', pointsCost: 2500, category: 'Shopping', available: true, expiresAt: '2025-03-31' },
      { id: '3', name: 'Free Movie Ticket', description: 'Enjoy a night at the movies', pointsCost: 1500, category: 'Entertainment', available: true, expiresAt: '2025-02-15' },
      { id: '4', name: '50% Off Next Purchase', description: 'Save big on your next shopping trip', pointsCost: 3000, category: 'Discount', available: true, expiresAt: '2025-01-31' },
      { id: '5', name: 'Premium Support', description: 'Priority customer support for 30 days', pointsCost: 500, category: 'Service', available: true, expiresAt: '2025-04-30' }
    ],
    recentTransactions: [
      { id: '1', type: 'earned', amount: 150, description: 'Purchase at Target', date: '2025-01-15', merchant: 'Target' },
      { id: '2', type: 'earned', amount: 89, description: 'Purchase at Whole Foods', date: '2025-01-12', merchant: 'Whole Foods' },
      { id: '3', type: 'redeemed', amount: -1000, description: 'Redeemed Starbucks Gift Card', date: '2025-01-10', merchant: 'Starbucks' },
      { id: '4', type: 'bonus', amount: 50, description: 'Weekly bonus points', date: '2025-01-08' },
      { id: '5', type: 'earned', amount: 299, description: 'Purchase at Best Buy', date: '2025-01-05', merchant: 'Best Buy' }
    ],
    tierBenefits: [
      { tier: 'Bronze', pointsMultiplier: 1, benefits: ['Basic rewards', 'Standard support'], color: 'bg-amber-500', icon: <Star className="w-5 h-5" /> },
      { tier: 'Silver', pointsMultiplier: 1.5, benefits: ['50% more points', 'Priority support', 'Exclusive offers'], color: 'bg-gray-400', icon: <Trophy className="w-5 h-5" /> },
      { tier: 'Gold', pointsMultiplier: 2, benefits: ['Double points', 'VIP support', 'Early access to rewards', 'Birthday bonus'], color: 'bg-yellow-500', icon: <Award className="w-5 h-5" /> },
      { tier: 'Platinum', pointsMultiplier: 2.5, benefits: ['2.5x points', 'Concierge support', 'Exclusive events', 'Free shipping', 'Premium rewards'], color: 'bg-blue-500', icon: <Gem className="w-5 h-5" /> },
      { tier: 'Diamond', pointsMultiplier: 3, benefits: ['Triple points', 'Personal account manager', 'Invitation-only events', 'Custom rewards', 'Priority everything'], color: 'bg-purple-500', icon: <Crown className="w-5 h-5" /> }
    ]
  });

  const handleRedeemReward = async (rewardId: string) => {
    try {
      const response = await fetch('/api/loyalty/redeem-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId })
      });

      if (response.ok) {
        // Refresh data after successful redemption
        fetchLoyaltyData();
        setSelectedReward(null);
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Loyalty Program</h1>
          <p className="text-muted-foreground mb-6">
            Connect your account to view your loyalty status and available rewards
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mr-2" />
          <span>Loading loyalty program...</span>
        </div>
      </div>
      );
  }

  if (!loyaltyData) return null;

  const { userProfile, availableRewards, recentTransactions, tierBenefits } = loyaltyData;
  const progressToNextTier = userProfile.pointsToNextTier > 0 
    ? ((userProfile.totalPointsEarned - userProfile.totalPointsRedeemed - userProfile.pointsToNextTier) / (userProfile.totalPointsEarned - userProfile.totalPointsRedeemed)) * 100
    : 100;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Loyalty Program</h1>
          <p className="text-muted-foreground">Earn points, unlock rewards, and climb the tiers</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={fetchLoyaltyData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* User Profile Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Your Loyalty Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Tier */}
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{userProfile.currentTier}</div>
              <Badge variant="outline" className="text-sm">
                {userProfile.tierMultiplier}x Points Multiplier
              </Badge>
            </div>

            {/* Points Progress */}
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{userProfile.currentPoints.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mb-2">Current Points</div>
              {userProfile.pointsToNextTier > 0 && (
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">
                    {userProfile.pointsToNextTier.toLocaleString()} points to {userProfile.nextTier}
                  </div>
                  <Progress value={progressToNextTier} className="w-full" />
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="text-center">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium text-green-600">{userProfile.totalPointsEarned.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Earned</div>
                </div>
                <div>
                  <div className="font-medium text-blue-600">{userProfile.totalPointsRedeemed.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Redeemed</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Member since {new Date(userProfile.memberSince).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Available Rewards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gift className="w-5 h-5" />
              <span>Available Rewards</span>
            </CardTitle>
            <CardDescription>Redeem your points for amazing rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableRewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{reward.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{reward.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">{reward.category}</Badge>
                      {reward.expiresAt && (
                        <Badge variant="secondary" className="text-xs">
                          Expires {new Date(reward.expiresAt).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-primary">{reward.pointsCost.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground mb-2">points</div>
                    <Button 
                      size="sm" 
                      onClick={() => handleRedeemReward(reward.id)}
                      disabled={!reward.available || userProfile.currentPoints < reward.pointsCost}
                    >
                      {userProfile.currentPoints >= reward.pointsCost ? 'Redeem' : 'Not Enough Points'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Recent Transactions</span>
            </CardTitle>
            <CardDescription>Your latest points activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'earned' ? 'bg-green-100 text-green-600' :
                      transaction.type === 'redeemed' ? 'bg-red-100 text-red-600' :
                      transaction.type === 'bonus' ? 'bg-blue-100 text-blue-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {transaction.type === 'earned' ? <TrendingUp className="w-4 h-4" /> :
                       transaction.type === 'redeemed' ? <Gift className="w-4 h-4" /> :
                       transaction.type === 'bonus' ? <Zap className="w-4 h-4" /> :
                       <Calendar className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.description}</div>
                      {transaction.merchant && (
                        <div className="text-sm text-muted-foreground">{transaction.merchant}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Benefits */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Tier Benefits</span>
          </CardTitle>
          <CardDescription>Unlock more benefits as you climb the tiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {tierBenefits.map((tier) => (
              <div key={tier.tier} className={`text-center p-4 rounded-lg border ${
                userProfile.currentTier === tier.tier ? 'border-primary bg-primary/5' : 'border-border'
              }`}>
                <div className={`w-12 h-12 ${tier.color} rounded-full flex items-center justify-center mx-auto mb-3 text-white`}>
                  {tier.icon}
                </div>
                <h4 className="font-medium mb-2">{tier.tier}</h4>
                <div className="text-sm text-muted-foreground mb-2">
                  {tier.pointsMultiplier}x Points
                </div>
                <div className="space-y-1 text-xs">
                  {tier.benefits.slice(0, 2).map((benefit, index) => (
                    <div key={index} className="text-muted-foreground">• {benefit}</div>
                  ))}
                  {tier.benefits.length > 2 && (
                    <div className="text-muted-foreground">+{tier.benefits.length - 2} more</div>
                  )}
                </div>
                {userProfile.currentTier === tier.tier && (
                  <Badge className="mt-2" variant="default">Current Tier</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Achievements</span>
          </CardTitle>
          <CardDescription>Track your progress and unlock special badges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {userProfile.achievements.map((achievement) => (
              <div key={achievement.id} className={`text-center p-4 rounded-lg border ${
                achievement.unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
              }`}>
                <div className={`text-3xl mb-2 ${achievement.unlocked ? 'opacity-100' : 'opacity-30'}`}>
                  {achievement.icon}
                </div>
                <h4 className="font-medium mb-1">{achievement.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                {achievement.unlocked ? (
                  <div className="space-y-1">
                    <Badge variant="default" className="text-xs">Unlocked</Badge>
                    {achievement.unlockedAt && (
                      <div className="text-xs text-muted-foreground">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <Badge variant="outline" className="text-xs">Locked</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Loyalty;

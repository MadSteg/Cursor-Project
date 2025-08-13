import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Gift, 
  Target, 
  TrendingUp, 
  Crown,
  Zap,
  Award,
  Users,
  ShoppingBag,
  Calendar,
  Sparkles,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  merchantId: string;
  merchantName: string;
  category: 'discount' | 'free_item' | 'cashback' | 'exclusive' | 'early_access';
  discount?: number;
  validUntil: string;
  isRedeemed: boolean;
  isAvailable: boolean;
}

interface LoyaltyTier {
  name: string;
  level: number;
  minPoints: number;
  maxPoints: number;
  currentPoints: number;
  benefits: string[];
  color: string;
  icon: React.ComponentType<any>;
}

interface MerchantLoyalty {
  merchantId: string;
  merchantName: string;
  logo: string;
  currentPoints: number;
  tier: LoyaltyTier;
  totalSpent: number;
  visits: number;
  rewards: Reward[];
  nextReward: number;
}

export default function AdvancedLoyaltyProgram() {
  const [loyaltyData, setLoyaltyData] = useState<MerchantLoyalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoyaltyData = async () => {
      setLoading(true);
      
      const mockLoyaltyData: MerchantLoyalty[] = [
        {
          merchantId: 'starbucks',
          merchantName: 'Starbucks',
          logo: '/images/starbucks-logo.png',
          currentPoints: 1250,
          tier: {
            name: 'Gold',
            level: 3,
            minPoints: 1000,
            maxPoints: 2000,
            currentPoints: 1250,
            benefits: [
              'Free drink every 12 visits',
              '50% off pastries',
              'Free birthday drink',
              'Priority ordering'
            ],
            color: '#FFD700',
            icon: Crown
          },
          totalSpent: 456.78,
          visits: 23,
          rewards: [
            {
              id: 'RWD-001',
              name: 'Free Venti Drink',
              description: 'Any size, any drink',
              pointsCost: 150,
              merchantId: 'starbucks',
              merchantName: 'Starbucks',
              category: 'free_item',
              validUntil: '2024-02-15',
              isRedeemed: false,
              isAvailable: true
            },
            {
              id: 'RWD-002',
              name: '50% Off Pastry',
              description: 'Any pastry item',
              pointsCost: 75,
              merchantId: 'starbucks',
              merchantName: 'Starbucks',
              category: 'discount',
              discount: 50,
              validUntil: '2024-02-10',
              isRedeemed: false,
              isAvailable: true
            }
          ],
          nextReward: 150
        },
        {
          merchantId: 'bestbuy',
          merchantName: 'Best Buy',
          logo: '/images/bestbuy-logo.png',
          currentPoints: 3200,
          tier: {
            name: 'Elite Plus',
            level: 4,
            minPoints: 3000,
            maxPoints: 5000,
            currentPoints: 3200,
            benefits: [
              'Free shipping on all orders',
              'Extended return policy',
              'Exclusive member pricing',
              'Early access to sales'
            ],
            color: '#1E40AF',
            icon: Trophy
          },
          totalSpent: 1245.67,
          visits: 8,
          rewards: [
            {
              id: 'RWD-003',
              name: '$50 Store Credit',
              description: 'Use on any purchase',
              pointsCost: 500,
              merchantId: 'bestbuy',
              merchantName: 'Best Buy',
              category: 'cashback',
              validUntil: '2024-03-01',
              isRedeemed: false,
              isAvailable: true
            },
            {
              id: 'RWD-004',
              name: 'Free Geek Squad Service',
              description: 'One-time setup or consultation',
              pointsCost: 200,
              merchantId: 'bestbuy',
              merchantName: 'Best Buy',
              category: 'exclusive',
              validUntil: '2024-02-28',
              isRedeemed: false,
              isAvailable: true
            }
          ],
          nextReward: 500
        },
        {
          merchantId: 'target',
          merchantName: 'Target',
          logo: '/images/target-logo.png',
          currentPoints: 850,
          tier: {
            name: 'Silver',
            level: 2,
            minPoints: 500,
            maxPoints: 1000,
            currentPoints: 850,
            benefits: [
              '5% off with RedCard',
              'Free shipping on orders $35+',
              'Birthday coupon'
            ],
            color: '#6B7280',
            icon: Star
          },
          totalSpent: 234.56,
          visits: 12,
          rewards: [
            {
              id: 'RWD-005',
              name: '20% Off Household',
              description: 'All household items',
              pointsCost: 100,
              merchantId: 'target',
              merchantName: 'Target',
              category: 'discount',
              discount: 20,
              validUntil: '2024-02-20',
              isRedeemed: false,
              isAvailable: true
            }
          ],
          nextReward: 100
        }
      ];

      setTimeout(() => {
        setLoyaltyData(mockLoyaltyData);
        setLoading(false);
      }, 1000);
    };

    fetchLoyaltyData();
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'discount': return TrendingUp;
      case 'free_item': return Gift;
      case 'cashback': return DollarSign;
      case 'exclusive': return Crown;
      case 'early_access': return Clock;
      default: return Award;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'discount': return 'bg-green-100 text-green-800';
      case 'free_item': return 'bg-blue-100 text-blue-800';
      case 'cashback': return 'bg-purple-100 text-purple-800';
      case 'exclusive': return 'bg-yellow-100 text-yellow-800';
      case 'early_access': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 animate-pulse" />
          <h2 className="text-2xl font-bold">Loyalty Programs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Trophy className="h-6 w-6 text-yellow-600" />
        <h2 className="text-2xl font-bold">Loyalty Programs</h2>
        <Badge variant="secondary" className="ml-2">
          <Sparkles className="h-3 w-3 mr-1" />
          Active Programs
        </Badge>
      </div>

      {/* Merchant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loyaltyData.map((merchant) => {
          const TierIcon = merchant.tier.icon;
          const progressToNext = ((merchant.currentPoints - merchant.tier.minPoints) / 
            (merchant.tier.maxPoints - merchant.tier.minPoints)) * 100;
          
          return (
            <Card 
              key={merchant.merchantId} 
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                selectedMerchant === merchant.merchantId ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedMerchant(merchant.merchantId)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{merchant.merchantName}</CardTitle>
                      <CardDescription>{merchant.visits} visits</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TierIcon className="h-5 w-5" style={{ color: merchant.tier.color }} />
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ borderColor: merchant.tier.color, color: merchant.tier.color }}
                    >
                      {merchant.tier.name}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Points Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Points</span>
                    <span className="font-medium">{merchant.currentPoints.toLocaleString()}</span>
                  </div>
                  <Progress value={progressToNext} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {merchant.tier.maxPoints - merchant.currentPoints} points to next tier
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Benefits</span>
                  <div className="space-y-1">
                    {merchant.tier.benefits.slice(0, 2).map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                    {merchant.tier.benefits.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{merchant.tier.benefits.length - 2} more benefits
                      </div>
                    )}
                  </div>
                </div>

                {/* Available Rewards */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Available Rewards</span>
                  <div className="space-y-1">
                    {merchant.rewards.filter(r => r.isAvailable).slice(0, 2).map((reward) => (
                      <div key={reward.id} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground truncate">{reward.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {reward.pointsCost} pts
                        </Badge>
                      </div>
                    ))}
                    {merchant.rewards.filter(r => r.isAvailable).length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{merchant.rewards.filter(r => r.isAvailable).length - 2} more rewards
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed View for Selected Merchant */}
      {selectedMerchant && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <span>
                {loyaltyData.find(m => m.merchantId === selectedMerchant)?.merchantName} - Rewards
              </span>
            </CardTitle>
            <CardDescription>
              Available rewards and redemption options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loyaltyData
                .find(m => m.merchantId === selectedMerchant)
                ?.rewards.filter(r => r.isAvailable)
                .map((reward) => {
                  const CategoryIcon = getCategoryIcon(reward.category);
                  return (
                    <Card key={reward.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CategoryIcon className="h-4 w-4 text-blue-600" />
                          <Badge 
                            className={`text-xs ${getCategoryColor(reward.category)}`}
                          >
                            {reward.category.replace('_', ' ')}
                          </Badge>
                        </div>
                        <CardTitle className="text-sm">{reward.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {reward.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{reward.pointsCost} points</span>
                          </div>
                          <Button size="sm" className="text-xs">
                            Redeem
                          </Button>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Valid until {new Date(reward.validUntil).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Loyalty Summary</CardTitle>
          <CardDescription>
            Your loyalty program performance across all merchants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {loyaltyData.length}
              </div>
              <div className="text-sm text-muted-foreground">Active Programs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {loyaltyData.reduce((sum, m) => sum + m.currentPoints, 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {loyaltyData.reduce((sum, m) => sum + m.rewards.filter(r => r.isAvailable).length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Available Rewards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                ${loyaltyData.reduce((sum, m) => sum + m.totalSpent, 0).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
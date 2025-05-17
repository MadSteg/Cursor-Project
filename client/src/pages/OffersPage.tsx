/**
 * OffersPage.tsx
 * 
 * Page for displaying time-limited promotional offers 
 * and coupons attached to NFT receipts
 */

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import CouponCard from '../components/coupons/CouponCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, Info, Sparkles, Gift, Clock, Calendar, Trophy, Zap, BadgePercent, Ticket } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// Define NFT type with coupon data to fix TypeScript errors
interface NFT {
  id: string;
  tokenId: string;
  name: string;
  imageUrl?: string;
  dateCreated?: string;
  metadata: {
    merchantName?: string;
    date?: string;
    total?: number;
    coupon?: {
      capsule: string;
      ciphertext: string;
      policyId: string;
      validUntil: number;
      tier?: string;       // Premium, Gold, Silver, etc.
      pointValue?: number; // Reward points earned for using this coupon
      rarity?: string;     // Common, Rare, Epic, Legendary
    }
  }
}

// Mock reward tiers and gamification data
interface RewardStats {
  totalPoints: number;
  level: number;
  couponsRedeemed: number;
  nextLevelPoints: number;
  tier: string;
  specialRewards: {
    name: string;
    unlocked: boolean;
    description: string;
    icon: React.ReactNode;
  }[];
}

const OffersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  
  // Mock user reward stats for gamification
  const [rewardStats, setRewardStats] = useState<RewardStats>({
    totalPoints: 575,
    level: 3,
    couponsRedeemed: 7,
    nextLevelPoints: 750,
    tier: "Silver",
    specialRewards: [
      {
        name: "Early Access",
        unlocked: true,
        description: "Get early access to new store promotions",
        icon: <Clock className="h-5 w-5 text-blue-500" />
      },
      {
        name: "Double Points",
        unlocked: true,
        description: "Earn 2x points on weekend purchases",
        icon: <BadgePercent className="h-5 w-5 text-green-500" />
      },
      {
        name: "Premium Offers",
        unlocked: false,
        description: "Unlock exclusive premium discounts",
        icon: <Trophy className="h-5 w-5 text-amber-500" />
      }
    ]
  });
  
  // Animation for newly unlocked rewards
  const [showAnimation, setShowAnimation] = useState(false);
  const [streakCount, setStreakCount] = useState(3);
  const [dailyBonus, setDailyBonus] = useState(false);

  // Fetch NFTs with coupons
  const { data: nfts, isLoading, error } = useQuery<NFT[]>({
    queryKey: ['/api/nfts/with-coupons'],
    retry: 1,
  });

  // Filter NFTs by active/expired and add rarity/tier/points
  const now = Date.now();
  const activeOffers = nfts?.filter(
    (nft: NFT) => nft.metadata?.coupon?.validUntil && now < nft.metadata.coupon.validUntil
  ).map(nft => ({
    ...nft,
    metadata: {
      ...nft.metadata,
      coupon: {
        ...nft.metadata.coupon!,
        tier: ['Silver', 'Gold', 'Premium', 'Platinum'][Math.floor(Math.random() * 4)],
        pointValue: Math.floor(Math.random() * 50) + 25,
        rarity: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'][Math.floor(Math.random() * 5)]
      }
    }
  })) || [];
  
  const expiredOffers = nfts?.filter(
    (nft: NFT) => nft.metadata?.coupon?.validUntil && now >= nft.metadata.coupon.validUntil
  ).map(nft => ({
    ...nft,
    metadata: {
      ...nft.metadata,
      coupon: {
        ...nft.metadata.coupon!,
        tier: ['Silver', 'Gold', 'Premium'][Math.floor(Math.random() * 3)],
        pointValue: Math.floor(Math.random() * 30) + 15,
        rarity: ['Common', 'Uncommon', 'Rare'][Math.floor(Math.random() * 3)]
      }
    }
  })) || [];
  
  // Handle daily check-in bonus
  const claimDailyBonus = () => {
    setRewardStats(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + 25
    }));
    setDailyBonus(true);
    setStreakCount(prev => prev + 1);
    toast({
      title: "Daily Bonus Claimed!",
      description: `You earned 25 points. Current streak: ${streakCount + 1} days`,
    });
    
    // Show animation for 3 seconds
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 3000);
  };
  
  // The enhanced offers with gamification elements
  const enhancedOffers = [...activeOffers];

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <Helmet>
        <title>Exclusive Offers & Coupons | BlockReceipt.ai</title>
        <meta 
          name="description" 
          content="View your exclusive time-limited offers and promotional coupons from your receipts on BlockReceipt.ai" 
        />
      </Helmet>
      
      {/* Main Header with Animation */}
      <div className="relative mb-8">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-500/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-orange-500/10 rounded-full blur-xl"></div>
        
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500 mb-3 flex items-center">
          <Gift className="h-8 w-8 mr-3 text-amber-500" /> 
          Exclusive Offers
          {showAnimation && (
            <span className="ml-3 animate-bounce">
              <Sparkles className="h-6 w-6 text-amber-400" />
            </span>
          )}
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Special discounts and promotional offers attached to your receipts. 
          These offers are encrypted and time-limited - they can only be revealed during their validity period.
        </p>
      </div>
      
      {/* Rewards Dashboard */}
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700 text-white shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-600/30 to-orange-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-400" /> Rewards Dashboard
              </CardTitle>
              <Badge variant="outline" className="bg-slate-700/50 border-slate-600 text-amber-300 px-3 py-1 font-semibold">
                {rewardStats.tier} Tier
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400 text-sm">Total Points</span>
                  <Badge variant="secondary" className="bg-amber-600/20 text-amber-300 border-amber-700">
                    Level {rewardStats.level}
                  </Badge>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold text-amber-400">{rewardStats.totalPoints}</span>
                  <span className="text-slate-400 text-xs">/ {rewardStats.nextLevelPoints}</span>
                </div>
                <Progress 
                  className="h-2 mt-2" 
                  value={(rewardStats.totalPoints / rewardStats.nextLevelPoints) * 100} 
                />
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <div className="text-slate-400 text-sm mb-1">Daily Streak</div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center mx-0.5 
                        ${i < streakCount ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                        {i < streakCount ? (i + 1) : ''}
                      </div>
                    ))}
                  </div>
                  {!dailyBonus && (
                    <Button 
                      size="sm" 
                      onClick={claimDailyBonus}
                      className="ml-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                      <Zap className="h-4 w-4 mr-1" /> Claim Bonus
                    </Button>
                  )}
                  {dailyBonus && (
                    <Badge className="ml-auto bg-green-600/30 text-green-300 border-green-700">
                      Claimed Today
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <div className="text-slate-400 text-sm mb-1">Special Rewards</div>
                <div className="flex flex-wrap gap-2">
                  {rewardStats.specialRewards.map((reward, i) => (
                    <Badge 
                      key={i} 
                      variant={reward.unlocked ? "default" : "outline"}
                      className={`flex items-center gap-1 border ${reward.unlocked 
                        ? 'bg-emerald-600/20 text-emerald-300 border-emerald-700' 
                        : 'bg-slate-700/20 text-slate-400 border-slate-700'}`}
                    >
                      {reward.icon}
                      {reward.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-0 pb-4 text-xs text-slate-400">
            <span>Coupons Redeemed: {rewardStats.couponsRedeemed}</span>
            <span>Next reward in 175 points</span>
          </CardFooter>
        </Card>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-60 bg-slate-100 dark:bg-slate-800/20 rounded-xl">
          <Loader2 className="h-10 w-10 animate-spin text-amber-500 mb-4" />
          <p className="text-slate-500 animate-pulse">Loading your exclusive offers...</p>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load offers. Please try again later.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {!nfts || nfts.length === 0 ? (
            <Card className="p-6 text-center border-dashed border-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300">
                  <Info className="h-5 w-5" />
                  No Offers Available
                </CardTitle>
                <CardDescription>
                  You don't have any promotional offers attached to your receipts yet. 
                  New offers will appear here after processing receipts.
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-center">
                <Button variant="outline" className="mt-2">
                  <ShoppingBag className="h-4 w-4 mr-2" /> Upload a Receipt
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              {/* Featured Collection - New section */}
              <div className="mb-8">
                <h2 className="text-xl font-medium flex items-center mb-4">
                  <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
                  Featured Offers
                </h2>
                
                <div className="bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-900 dark:to-sky-900/30 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <Badge className="bg-blue-600/20 text-blue-500 border-blue-700 mb-2">Limited Time</Badge>
                      <h3 className="text-lg font-semibold mb-1">Weekend Special</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-3">Complete your collection of receipts from premium stores to unlock exclusive weekend offers with 2x points.</p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <BadgePercent className="h-3.5 w-3.5" />
                          2x Points
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          This Weekend
                        </Badge>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center justify-center">
                      <Button className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600">
                        View Collection
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            
              {/* Tabs with Offers */}
              <Tabs 
                defaultValue="all" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="mb-6 p-1 bg-slate-100 dark:bg-slate-800/50">
                  <TabsTrigger value="all" className="relative data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950">
                    All Offers
                    {nfts && nfts.length > 0 && (
                      <span className="ml-2 text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                        {nfts.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="active" className="relative data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950">
                    Active
                    {activeOffers.length > 0 && (
                      <span className="ml-2 text-xs bg-green-500/10 px-2 py-0.5 rounded-full text-green-600 dark:text-green-400">
                        {activeOffers.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="expired" className="relative data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950">
                    Expired
                    {expiredOffers.length > 0 && (
                      <span className="ml-2 text-xs bg-gray-500/10 px-2 py-0.5 rounded-full text-gray-500">
                        {expiredOffers.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enhancedOffers.map((nft: NFT) => (
                      <div key={nft.id} className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition"></div>
                        <CouponCard nft={nft} />
                        <div className="absolute top-3 right-3">
                          <Badge className={`
                            ${nft.metadata.coupon?.rarity === 'Common' ? 'bg-slate-600' : ''}
                            ${nft.metadata.coupon?.rarity === 'Uncommon' ? 'bg-green-600' : ''}
                            ${nft.metadata.coupon?.rarity === 'Rare' ? 'bg-blue-600' : ''}
                            ${nft.metadata.coupon?.rarity === 'Epic' ? 'bg-purple-600' : ''}
                            ${nft.metadata.coupon?.rarity === 'Legendary' ? 'bg-amber-600' : ''}
                          `}>
                            {nft.metadata.coupon?.rarity}
                          </Badge>
                        </div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-1">
                          <Badge variant="outline" className="bg-white/80 dark:bg-black/50">
                            <Ticket className="h-3 w-3 mr-1 text-amber-500" />
                            {nft.metadata.coupon?.pointValue} Points
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="active" className="mt-0">
                  {activeOffers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-slate-100 dark:bg-slate-800/20 rounded-xl">
                      <Gift className="h-12 w-12 mx-auto text-slate-400 mb-3" />
                      <p className="text-lg font-medium mb-1">No active offers available</p>
                      <p className="text-sm">Check back soon for new promotions!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeOffers.map((nft: NFT) => (
                        <div key={nft.id} className="relative group">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition"></div>
                          <CouponCard nft={nft} />
                          <div className="absolute top-3 right-3">
                            <Badge className={`
                              ${nft.metadata.coupon?.rarity === 'Common' ? 'bg-slate-600' : ''}
                              ${nft.metadata.coupon?.rarity === 'Uncommon' ? 'bg-green-600' : ''}
                              ${nft.metadata.coupon?.rarity === 'Rare' ? 'bg-blue-600' : ''}
                              ${nft.metadata.coupon?.rarity === 'Epic' ? 'bg-purple-600' : ''}
                              ${nft.metadata.coupon?.rarity === 'Legendary' ? 'bg-amber-600' : ''}
                            `}>
                              {nft.metadata.coupon?.rarity}
                            </Badge>
                          </div>
                          <div className="absolute bottom-3 left-3 flex items-center gap-1">
                            <Badge variant="outline" className="bg-white/80 dark:bg-black/50">
                              <Ticket className="h-3 w-3 mr-1 text-amber-500" />
                              {nft.metadata.coupon?.pointValue} Points
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="expired" className="mt-0">
                  {expiredOffers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-slate-100 dark:bg-slate-800/20 rounded-xl">
                      <Clock className="h-12 w-12 mx-auto text-slate-400 mb-3" />
                      <p>No expired offers</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {expiredOffers.map((nft: NFT) => (
                        <div key={nft.id} className="opacity-70">
                          <CouponCard nft={nft} />
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default OffersPage;
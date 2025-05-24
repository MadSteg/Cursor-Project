import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Star, Coins, Trophy, Receipt, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RewardSimulation {
  transactionAmount: number;
  tier: 'basic' | 'premium' | 'luxury';
  pointsAwarded: number;
  nftChance: number;
  wonNFT: boolean;
  nftName?: string;
}

export default function LoyaltyRewards() {
  const [transactionAmount, setTransactionAmount] = useState('25.00');
  const [simulation, setSimulation] = useState<RewardSimulation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const calculateRewards = (amount: number): RewardSimulation => {
    let tier: 'basic' | 'premium' | 'luxury';
    let pointsAwarded: number;
    let nftChance: number;

    if (amount >= 100) {
      tier = 'luxury';
      pointsAwarded = Math.floor(amount * 2);
      nftChance = 25;
    } else if (amount >= 25) {
      tier = 'premium';
      pointsAwarded = Math.floor(amount * 1.5);
      nftChance = 15;
    } else {
      tier = 'basic';
      pointsAwarded = Math.floor(amount);
      nftChance = 8;
    }

    // Simulate NFT win
    const wonNFT = Math.random() * 100 <= nftChance;
    const nftNames = {
      basic: ['Coffee Cat', 'Shopping Bear', 'Happy Owl'],
      premium: ['Golden Robot', 'Crystal Wizard', 'Space Explorer'],
      luxury: ['Diamond Phoenix', 'Legendary Dragon', 'Royal Unicorn']
    };

    return {
      transactionAmount: amount,
      tier,
      pointsAwarded,
      nftChance,
      wonNFT,
      nftName: wonNFT ? nftNames[tier][Math.floor(Math.random() * nftNames[tier].length)] : undefined
    };
  };

  const simulateReceipt = async () => {
    setIsProcessing(true);
    const amount = parseFloat(transactionAmount);
    
    // Simulate processing delay like a real receipt
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = calculateRewards(amount);
    setSimulation(result);
    setIsProcessing(false);

    if (result.wonNFT) {
      toast({
        title: "🎉 Bonus NFT Awarded!",
        description: `You won a ${result.tier} tier NFT: ${result.nftName}!`,
      });
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'luxury': return 'text-purple-600 bg-purple-100';
      case 'premium': return 'text-blue-600 bg-blue-100';
      case 'basic': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'luxury': return <Trophy className="w-5 h-5" />;
      case 'premium': return <Star className="w-5 h-5" />;
      case 'basic': return <Gift className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Loyalty Rewards System</h1>
        <p className="text-gray-600">See how rewards are automatically distributed with every purchase</p>
        <p className="text-sm text-purple-600 mt-2">Just like coupons printed on CVS receipts - instant and automatic!</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Transaction Simulator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Simulate a Purchase
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Transaction Amount</Label>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-lg font-medium">$</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={transactionAmount}
                  onChange={(e) => setTransactionAmount(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <Button 
              onClick={simulateReceipt} 
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? 'Processing Receipt...' : 'Complete Purchase & Get Rewards'}
            </Button>

            <div className="bg-blue-50 p-4 rounded-lg text-sm">
              <h4 className="font-medium text-blue-800 mb-2">Reward Tiers:</h4>
              <div className="space-y-1 text-blue-700">
                <div>• $0-24: Basic (1x points, 8% NFT chance)</div>
                <div>• $25-99: Premium (1.5x points, 15% NFT chance)</div>
                <div>• $100+: Luxury (2x points, 25% NFT chance)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reward Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Your Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!simulation ? (
              <div className="text-center py-8 text-gray-500">
                <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Complete a purchase to see your automatic rewards!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Transaction Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Transaction Amount:</span>
                    <span className="font-medium">${simulation.transactionAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Reward Tier:</span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getTierColor(simulation.tier)}`}>
                      {getTierIcon(simulation.tier)}
                      {simulation.tier.charAt(0).toUpperCase() + simulation.tier.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Points Awarded */}
                <div className="border-2 border-green-200 bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Coins className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-800">Points Earned</div>
                      <div className="text-2xl font-bold text-green-600">{simulation.pointsAwarded}</div>
                      <div className="text-sm text-green-600">Ready to redeem at this merchant</div>
                    </div>
                  </div>
                </div>

                {/* NFT Result */}
                {simulation.wonNFT ? (
                  <div className="border-2 border-purple-200 bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-purple-800">Bonus NFT Won! 🎉</div>
                        <div className="text-lg font-bold text-purple-600">{simulation.nftName}</div>
                        <div className="text-sm text-purple-600">Added to your collection</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-gray-200 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
                        <Gift className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-600">No NFT This Time</div>
                        <div className="text-sm text-gray-500">
                          You had a {simulation.nftChance}% chance - better luck next time!
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  onClick={() => setSimulation(null)}
                  className="w-full"
                >
                  Try Another Purchase
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How Automatic Rewards Work</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Make Purchase</h3>
              <p className="text-sm text-gray-600">
                Complete your transaction normally at any participating merchant
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Coins className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">2. Auto Rewards</h3>
              <p className="text-sm text-gray-600">
                Points and possible NFTs are instantly awarded based on your spending
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Redeem & Collect</h3>
              <p className="text-sm text-gray-600">
                Use points for discounts and build your NFT collection over time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
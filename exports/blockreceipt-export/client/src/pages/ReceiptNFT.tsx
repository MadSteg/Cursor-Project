import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Wallet, 
  Gift, 
  Star, 
  CheckCircle, 
  Coffee, 
  ShoppingBag,
  Zap,
  Receipt,
  Award,
  Smartphone
} from 'lucide-react';

export default function ReceiptNFT() {
  const [loading, setLoading] = useState(false);
  const [mintResult, setMintResult] = useState<any>(null);
  const [customerPhone, setCustomerPhone] = useState('+1234567890');
  const [merchantId, setMerchantId] = useState('coffee-shop-1');
  const { toast } = useToast();

  const handleMintReceipt = async () => {
    setLoading(true);
    try {
      // Sample receipt data based on merchant
      const receiptData = merchantId === 'coffee-shop-1' 
        ? {
            merchantId: 'coffee-shop-1',
            merchantName: 'Downtown Coffee Co.',
            customerPhone,
            totalAmount: 15.75,
            items: [
              { name: 'Specialty Latte', price: 5.50 },
              { name: 'Breakfast Sandwich', price: 7.25 },
              { name: 'Chocolate Donut', price: 3.00 }
            ],
            transactionId: `demo_${Date.now()}`
          }
        : {
            merchantId: 'grocery-1',
            merchantName: 'Fresh Market',
            customerPhone,
            totalAmount: 42.50,
            items: [
              { name: 'Organic Bananas', price: 4.50 },
              { name: 'Store Brand Pasta', price: 2.25 },
              { name: 'Weekly Special Cheese', price: 8.75 },
              { name: 'Free Range Eggs', price: 6.00 },
              { name: 'Organic Spinach', price: 3.50 }
            ],
            transactionId: `demo_${Date.now()}`
          };

      const response = await apiRequest('POST', '/api/pos/mint-receipt', receiptData);
      const result = await response.json();

      if (result.success) {
        setMintResult(result.data);
        toast({
          title: "BlockReceipt NFT Minted! 🎉",
          description: `Earned ${result.data.rewardPoints} points with your new NFT!`,
        });
      } else {
        throw new Error(result.error || 'Failed to mint NFT');
      }
    } catch (error) {
      toast({
        title: "Mint Failed",
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          BlockReceipt NFT System
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The simple "third receipt option" - customers select "Mint BlockReceipt" at checkout, 
          automatically creating wallets and earning points like Fetch, but with blockchain NFTs and encrypted receipt data.
        </p>
      </div>

      {/* How It Works */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="text-center">
          <CardContent className="pt-6">
            <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">1. Select at POS</h3>
            <p className="text-sm text-gray-600">Customer chooses "Mint BlockReceipt" alongside email/paper receipt</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Wallet className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">2. Auto Wallet</h3>
            <p className="text-sm text-gray-600">System creates wallet automatically using phone/email</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Receipt className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">3. Mint NFT</h3>
            <p className="text-sm text-gray-600">Receipt becomes NFT with encrypted metadata and random image</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <Award className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">4. Earn Points</h3>
            <p className="text-sm text-gray-600">Smart tracking calculates rewards like Fetch app for special items</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Demo Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-600" />
              Try the POS Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customerPhone">Customer Phone</Label>
              <Input
                id="customerPhone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+1234567890"
              />
            </div>

            <div>
              <Label htmlFor="merchant">Select Merchant</Label>
              <select
                id="merchant"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="coffee-shop-1">Downtown Coffee Co.</option>
                <option value="grocery-1">Fresh Market</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Sample Receipt Items:</h4>
              {merchantId === 'coffee-shop-1' ? (
                <ul className="text-sm space-y-1">
                  <li>• Specialty Latte - $5.50 (special item!)</li>
                  <li>• Breakfast Sandwich - $7.25 (bonus points!)</li>
                  <li>• Chocolate Donut - $3.00</li>
                  <li className="font-semibold text-green-600">Total: $15.75</li>
                </ul>
              ) : (
                <ul className="text-sm space-y-1">
                  <li>• Organic Bananas - $4.50 (triple points!)</li>
                  <li>• Store Brand Pasta - $2.25 (bonus!)</li>
                  <li>• Weekly Special Cheese - $8.75 (featured!)</li>
                  <li>• Free Range Eggs - $6.00</li>
                  <li>• Organic Spinach - $3.50 (triple points!)</li>
                  <li className="font-semibold text-green-600">Total: $42.50</li>
                </ul>
              )}
            </div>

            <Button 
              onClick={handleMintReceipt} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Minting NFT...' : 'Mint BlockReceipt NFT'}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-green-600" />
              {mintResult ? 'NFT Minted Successfully!' : 'Waiting for Mint...'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mintResult ? (
              <div className="space-y-4">
                {/* NFT Image */}
                <div className="text-center">
                  <img 
                    src={mintResult.nftImageUrl} 
                    alt="Receipt NFT" 
                    className="w-32 h-32 mx-auto rounded-lg border-2 border-gray-200"
                  />
                  <p className="text-sm text-gray-600 mt-2">Your Receipt NFT</p>
                </div>

                {/* Wallet Info */}
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Wallet Created
                  </h4>
                  <p className="text-sm font-mono text-blue-700 break-all">
                    {mintResult.walletAddress}
                  </p>
                </div>

                {/* Rewards Summary */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Points Earned
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base Points:</span>
                      <span className="font-medium">{mintResult.basePoints}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bonus Points:</span>
                      <span className="font-medium text-green-600">+{mintResult.bonusPoints}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total Points:</span>
                      <span className="text-green-600">{mintResult.rewardPoints}</span>
                    </div>
                  </div>
                </div>

                {/* Qualifying Offers */}
                {mintResult.qualifyingOffers && mintResult.qualifyingOffers.length > 0 && (
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Special Offers Earned
                    </h4>
                    <div className="space-y-2">
                      {mintResult.qualifyingOffers.map((offer: any, index: number) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-medium">{offer.itemName}</span>
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {offer.offerDescription}
                            </Badge>
                          </div>
                          <span className="font-semibold text-orange-600">+{offer.pointsEarned}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transaction Details */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Transaction Details</h4>
                  <div className="text-sm space-y-1">
                    <div>NFT Token: <span className="font-mono">{mintResult.nftTokenId}</span></div>
                    <div>Merchant: {mintResult.receiptData.merchantName}</div>
                    <div>Amount: ${mintResult.receiptData.amount}</div>
                    <div>Time: {new Date(mintResult.receiptData.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  Click "Mint BlockReceipt NFT" to see the magic happen!
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  This simulates the customer experience at point-of-sale
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Benefits Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Why BlockReceipt?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <Coffee className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Cost Savings for Merchants</h3>
            <p className="text-sm text-gray-600">
              $0.005 per NFT vs $0.08 for paper receipts. Massive savings for high-volume stores.
            </p>
          </div>
          
          <div className="text-center">
            <ShoppingBag className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Better Than Fetch</h3>
            <p className="text-sm text-gray-600">
              Earn points immediately at purchase, with encrypted receipt data and NFT ownership.
            </p>
          </div>
          
          <div className="text-center">
            <Zap className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Privacy with TACo</h3>
            <p className="text-sm text-gray-600">
              Receipt metadata encrypted with threshold cryptography - only wallet owner can access details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
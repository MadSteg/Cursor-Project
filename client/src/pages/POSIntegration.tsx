import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Smartphone, 
  Wallet, 
  Receipt, 
  Award, 
  Zap,
  CheckCircle,
  Clock,
  DollarSign,
  ShoppingCart
} from 'lucide-react';

export default function POSIntegration() {
  const [customerPhone, setCustomerPhone] = useState('+1234567890');
  const [selectedMerchant, setSelectedMerchant] = useState('coffee-shop');
  const [processing, setProcessing] = useState(false);
  const [receiptResult, setReceiptResult] = useState<any>(null);
  const { toast } = useToast();

  const merchantScenarios = {
    'coffee-shop': {
      name: 'Downtown Coffee Co.',
      items: [
        { name: 'Specialty Latte', price: 5.50, special: true },
        { name: 'Breakfast Sandwich', price: 7.25, special: true },
        { name: 'Chocolate Donut', price: 3.00, special: false }
      ],
      total: 15.75
    },
    'grocery': {
      name: 'Fresh Market',
      items: [
        { name: 'Organic Bananas', price: 4.50, special: true },
        { name: 'Store Brand Pasta', price: 2.25, special: true },
        { name: 'Weekly Special Cheese', price: 8.75, special: true },
        { name: 'Free Range Eggs', price: 6.00, special: false }
      ],
      total: 21.50
    },
    'restaurant': {
      name: 'Italian Bistro',
      items: [
        { name: 'Pasta Carbonara', price: 18.50, special: false },
        { name: 'House Wine', price: 12.00, special: true },
        { name: 'Tiramisu', price: 8.50, special: false }
      ],
      total: 39.00
    }
  };

  const handleMintReceipt = async () => {
    setProcessing(true);
    
    try {
      const scenario = merchantScenarios[selectedMerchant as keyof typeof merchantScenarios];
      
      // Simulate the "Mint BlockReceipt" POS option being selected
      const receiptData = {
        merchantId: selectedMerchant,
        merchantName: scenario.name,
        customerPhone,
        totalAmount: scenario.total,
        items: scenario.items,
        transactionId: `pos_${Date.now()}`
      };

      const response = await apiRequest('POST', '/api/pos/mint-receipt', receiptData);
      const result = await response.json();

      if (result.success) {
        setReceiptResult(result.data);
        toast({
          title: "Digital Receipt Created Successfully!",
          description: `Customer earned ${result.data.rewardPoints} points`,
        });
      } else {
        throw new Error(result.error || 'Failed to mint receipt');
      }
    } catch (error) {
      toast({
        title: "Minting Failed",
        description: error instanceof Error ? error.message : 'Something went wrong',
      });
    } finally {
      setProcessing(false);
    }
  };

  const scenario = merchantScenarios[selectedMerchant as keyof typeof merchantScenarios];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 brand-gradient-text">
            POS Integration Demo
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Experience the future of receipts. Customers simply select "Create Digital Receipt" at checkout 
            for instant digital rewards and encrypted receipt storage.
          </p>
        </div>

        {/* Process Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 text-center">
              <ShoppingCart className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">1. Customer Checkout</h3>
              <p className="text-sm text-slate-400">Complete purchase at participating merchant</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 text-center">
              <Smartphone className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">2. Select Digital Receipt</h3>
              <p className="text-sm text-slate-400">Choose "Create Digital Receipt" alongside email/paper option</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 text-center">
              <Wallet className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">3. Auto Account Creation</h3>
              <p className="text-sm text-slate-400">System creates secure account using phone/email</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 text-center">
              <Award className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">4. Instant Rewards</h3>
              <p className="text-sm text-slate-400">Earn points automatically with encrypted digital receipt</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* POS Terminal Simulation */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Zap className="h-5 w-5 text-blue-400" />
                POS Terminal Simulation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="merchant" className="text-slate-300">Select Merchant Type</Label>
                <select
                  id="merchant"
                  value={selectedMerchant}
                  onChange={(e) => setSelectedMerchant(e.target.value)}
                  className="w-full p-3 mt-1 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="coffee-shop">Coffee Shop</option>
                  <option value="grocery">Grocery Store</option>
                  <option value="restaurant">Restaurant</option>
                </select>
              </div>

              <div>
                <Label htmlFor="customerPhone" className="text-slate-300">Customer Phone</Label>
                <Input
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>

              {/* Receipt Preview */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-white">{scenario.name}</h4>
                <div className="space-y-2">
                  {scenario.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-300">{item.name}</span>
                        {item.special && (
                          <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                            Special Item
                          </Badge>
                        )}
                      </div>
                      <span className="text-white">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-slate-600 pt-2 flex justify-between font-semibold text-white">
                    <span>Total:</span>
                    <span>${scenario.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Receipt Options */}
              <div className="bg-slate-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-3 text-white">Receipt Options:</h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-slate-300">
                    <input type="checkbox" className="rounded" />
                    <span>Email Receipt</span>
                  </label>
                  <label className="flex items-center space-x-2 text-slate-300">
                    <input type="checkbox" className="rounded" />
                    <span>Print Paper Receipt</span>
                  </label>
                  <label className="flex items-center space-x-2 text-white font-medium">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-blue-400" />
                      Mint BlockReceipt NFT
                    </span>
                  </label>
                </div>
              </div>

              <Button 
                onClick={handleMintReceipt}
                disabled={processing}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  'Complete Transaction'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Display */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Receipt className="h-5 w-5 text-green-400" />
                {receiptResult ? 'BlockReceipt Created!' : 'Transaction Results'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {receiptResult ? (
                <div className="space-y-6">
                  {/* Success Message */}
                  <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="font-semibold text-green-400">Transaction Complete</span>
                    </div>
                    <p className="text-sm text-green-300">
                      BlockReceipt NFT minted successfully with encrypted receipt data
                    </p>
                  </div>

                  {/* NFT Preview */}
                  <div className="text-center">
                    <img 
                      src={receiptResult.nftImageUrl} 
                      alt="Receipt NFT" 
                      className="w-32 h-32 mx-auto rounded-lg border-2 border-slate-600"
                    />
                    <p className="text-sm text-slate-400 mt-2">Your Receipt NFT</p>
                  </div>

                  {/* Wallet Info */}
                  <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-400 mb-2">Wallet Created</h4>
                    <p className="text-xs font-mono text-blue-300 break-all">
                      {receiptResult.walletAddress}
                    </p>
                  </div>

                  {/* Points Earned */}
                  <div className="bg-purple-900/30 border border-purple-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-3">Points Earned</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Base Points:</span>
                        <span className="text-white">{receiptResult.basePoints}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Bonus Points:</span>
                        <span className="text-green-400">+{receiptResult.bonusPoints}</span>
                      </div>
                      <div className="border-t border-slate-600 pt-2 flex justify-between font-semibold">
                        <span className="text-white">Total Points:</span>
                        <span className="text-purple-400">{receiptResult.rewardPoints}</span>
                      </div>
                    </div>
                  </div>

                  {/* Special Offers */}
                  {receiptResult.qualifyingOffers && receiptResult.qualifyingOffers.length > 0 && (
                    <div className="bg-orange-900/30 border border-orange-700 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-400 mb-3">Special Offers Earned</h4>
                      <div className="space-y-2">
                        {receiptResult.qualifyingOffers.map((offer: any, index: number) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-orange-300">{offer.offerDescription}</span>
                            <span className="font-semibold text-orange-400">+{offer.pointsEarned}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Receipt className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-2">
                    Complete a transaction to see BlockReceipt in action
                  </p>
                  <p className="text-sm text-slate-500">
                    Demonstrates instant wallet creation and NFT minting at POS
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Value Proposition */}
        <div className="mt-12 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">Why Merchants Choose BlockReceipt</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <DollarSign className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">Cost Savings</h3>
              <p className="text-sm text-slate-300">
                $0.005 per NFT vs $0.08 for paper receipts. Massive savings for high-volume stores.
              </p>
            </div>
            
            <div className="text-center">
              <Zap className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">Instant Engagement</h3>
              <p className="text-sm text-slate-300">
                Customers earn rewards immediately at purchase with no apps to download or receipts to scan.
              </p>
            </div>
            
            <div className="text-center">
              <Award className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">Privacy First</h3>
              <p className="text-sm text-slate-300">
                Receipt data encrypted with threshold cryptography. Only customers control access to their purchase history.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
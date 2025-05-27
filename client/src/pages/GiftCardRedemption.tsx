import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Gift, 
  Star, 
  CheckCircle, 
  CreditCard,
  Award,
  Coins,
  ShoppingBag,
  Copy,
  ExternalLink
} from 'lucide-react';

interface GiftCardBrand {
  id: string;
  name: string;
  denominations: number[];
  minPoints: number;
  description: string;
  minValue: number;
}

interface UserBalance {
  points: number;
  dollarValue: number;
  formatted: string;
}

interface GiftCardCode {
  brand: string;
  value: number;
  code: string;
  pin?: string;
  redemptionUrl?: string;
  expirationDate?: string;
  issuedAt: string;
}

export default function GiftCardRedemption() {
  const [brands, setBrands] = useState<GiftCardBrand[]>([]);
  const [userBalance, setUserBalance] = useState<UserBalance | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedDenomination, setSelectedDenomination] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [redeemedGiftCard, setRedeemedGiftCard] = useState<GiftCardCode | null>(null);
  const { toast } = useToast();

  // Mock user ID for demo (in production, would come from auth)
  const userId = 'customer_user123';

  useEffect(() => {
    loadGiftCardBrands();
    loadUserBalance();
  }, []);

  const loadGiftCardBrands = async () => {
    try {
      const response = await apiRequest('GET', '/api/gift-cards/brands');
      const result = await response.json();
      if (result.success) {
        setBrands(result.brands);
      }
    } catch (error) {
      console.error('Error loading gift card brands:', error);
    }
  };

  const loadUserBalance = async () => {
    try {
      const response = await apiRequest('GET', `/api/gift-cards/balance/${userId}`);
      const result = await response.json();
      if (result.success) {
        setUserBalance(result.balance);
      }
    } catch (error) {
      console.error('Error loading user balance:', error);
    }
  };

  const handleRedemption = async () => {
    if (!selectedBrand || !selectedDenomination) {
      toast({
        title: "Selection Required",
        description: "Please select a gift card brand and amount",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/gift-cards/redeem', {
        userId,
        giftCardBrand: selectedBrand,
        denomination: selectedDenomination
      });

      const result = await response.json();

      if (result.success) {
        setRedeemedGiftCard(result.giftCard);
        setUserBalance(prev => prev ? {
          ...prev,
          points: result.remainingBalance,
          dollarValue: result.remainingBalance / 100,
          formatted: `$${(result.remainingBalance / 100).toFixed(2)}`
        } : null);
        
        toast({
          title: "Gift Card Redeemed! 🎉",
          description: `You got a $${selectedDenomination} ${selectedBrand} gift card!`,
        });
      } else {
        toast({
          title: "Redemption Failed",
          description: result.error || 'Something went wrong',
        });
      }
    } catch (error) {
      toast({
        title: "Redemption Failed",
        description: error instanceof Error ? error.message : 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Gift card code copied to clipboard",
    });
  };

  const selectedBrandInfo = brands.find(b => b.id === selectedBrand);
  const requiredPoints = selectedDenomination * 100; // 100 points = $1
  const canAfford = userBalance ? userBalance.points >= requiredPoints : false;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Gift Card Redemption
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Turn your BlockReceipt points into real gift cards! Earn points from every receipt NFT and redeem them for your favorite brands.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Balance */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-600" />
              Your Points Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userBalance ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {userBalance.points.toLocaleString()}
                  </div>
                  <div className="text-lg text-gray-600">
                    points = {userBalance.formatted}
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Conversion Rate</h4>
                  <p className="text-sm text-blue-700">100 points = $1.00</p>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">How to Earn More</h4>
                  <p className="text-sm text-green-700">Mint BlockReceipt NFTs when you shop to earn points automatically!</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Coins className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Loading balance...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gift Card Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-purple-600" />
              Choose Your Gift Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            {brands.length > 0 ? (
              <div className="space-y-6">
                {/* Brand Selection */}
                <div>
                  <h3 className="font-semibold mb-3">Select Brand</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {brands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => {
                          setSelectedBrand(brand.id);
                          setSelectedDenomination(0);
                        }}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          selectedBrand === brand.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium">{brand.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          Min: {brand.minPoints} pts
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Denomination Selection */}
                {selectedBrandInfo && (
                  <div>
                    <h3 className="font-semibold mb-3">Select Amount</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {selectedBrandInfo.denominations.map((amount) => {
                        const pointsNeeded = amount * 100;
                        const affordable = userBalance ? userBalance.points >= pointsNeeded : false;
                        
                        return (
                          <button
                            key={amount}
                            onClick={() => setSelectedDenomination(amount)}
                            disabled={!affordable}
                            className={`p-3 border rounded-lg text-center transition-colors ${
                              selectedDenomination === amount
                                ? 'border-green-500 bg-green-50'
                                : affordable
                                ? 'border-gray-200 hover:border-gray-300'
                                : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                            }`}
                          >
                            <div className="font-medium">${amount}</div>
                            <div className="text-xs text-gray-500">
                              {pointsNeeded.toLocaleString()} pts
                            </div>
                            {!affordable && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                Need more points
                              </Badge>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Redemption Summary */}
                {selectedBrand && selectedDenomination > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Redemption Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Gift Card:</span>
                        <span className="font-medium">{selectedBrandInfo?.name} ${selectedDenomination}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Points Required:</span>
                        <span className="font-medium">{requiredPoints.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Your Balance:</span>
                        <span className={userBalance && userBalance.points >= requiredPoints ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                          {userBalance?.points.toLocaleString() || 0}
                        </span>
                      </div>
                      {canAfford && (
                        <div className="flex justify-between text-green-600">
                          <span>Remaining After:</span>
                          <span className="font-medium">
                            {((userBalance?.points || 0) - requiredPoints).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Redeem Button */}
                <Button 
                  onClick={handleRedemption}
                  disabled={!canAfford || loading || !selectedDenomination}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Processing...' : `Redeem ${selectedBrandInfo?.name} Gift Card`}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Loading available gift cards...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Redeemed Gift Card Display */}
      {redeemedGiftCard && (
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Gift Card Redeemed Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{redeemedGiftCard.brand} ${redeemedGiftCard.value} Gift Card</h3>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Gift Card Code</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 p-2 bg-gray-100 rounded font-mono text-sm">
                        {redeemedGiftCard.code}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(redeemedGiftCard.code)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {redeemedGiftCard.pin && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">PIN</label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 p-2 bg-gray-100 rounded font-mono text-sm">
                          {redeemedGiftCard.pin}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(redeemedGiftCard.pin!)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {redeemedGiftCard.redemptionUrl && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Redeem Online</label>
                      <div className="mt-1">
                        <a
                          href={redeemedGiftCard.redemptionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                          Visit Redemption Site
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Issued: {new Date(redeemedGiftCard.issuedAt).toLocaleString()}
                    {redeemedGiftCard.expirationDate && (
                      <> • Expires: {new Date(redeemedGiftCard.expirationDate).toLocaleDateString()}</>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
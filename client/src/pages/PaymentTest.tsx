import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, CreditCard, Coins } from 'lucide-react';

export default function PaymentTest() {
  const [amount, setAmount] = useState('25.99');
  const [merchant, setMerchant] = useState('Demo Store');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTestPayment = async () => {
    setLoading(true);
    try {
      // Create payment intent with metadata for NFT minting
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency: 'usd',
          metadata: {
            merchantName: merchant,
            items: JSON.stringify([
              { name: 'Test Product', quantity: 1, price: parseFloat(amount) }
            ]),
            category: 'Demo',
            walletAddress: '0x1234567890123456789012345678901234567890',
            customerEmail: 'demo@blockreceipt.ai'
          }
        }),
      });

      const { clientSecret } = await response.json();
      
      // Simulate successful payment for demo
      setTimeout(() => {
        toast({
          title: "Payment Successful! 🎉",
          description: `Receipt NFT is being minted for your $${amount} purchase from ${merchant}. Check your wallet soon!`,
        });
        setLoading(false);
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "Unable to process payment. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Stripe Payment Test</h1>
          <p className="text-gray-600">
            Test automatic NFT minting when payments succeed through Stripe webhooks
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
            <CardDescription>
              Configure your test payment to see NFT minting in action
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="merchant">Merchant Name</Label>
              <Input
                id="merchant"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="Demo Store"
              />
            </div>
            
            <div>
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="25.99"
              />
            </div>

            <Button 
              onClick={handleTestPayment}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Test Payment & NFT Minting
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              How It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                <div>
                  <h4 className="font-semibold">Payment Processing</h4>
                  <p className="text-sm text-gray-600">Customer makes a purchase through Stripe</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                <div>
                  <h4 className="font-semibold">Webhook Trigger</h4>
                  <p className="text-sm text-gray-600">Stripe sends webhook to /api/webhook when payment succeeds</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                <div>
                  <h4 className="font-semibold">Automatic NFT Minting</h4>
                  <p className="text-sm text-gray-600">Receipt NFT is automatically minted with purchase metadata</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                <div>
                  <h4 className="font-semibold">Receipt Available</h4>
                  <p className="text-sm text-gray-600">Customer receives NFT receipt in their wallet</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
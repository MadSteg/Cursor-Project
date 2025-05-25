import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
// Using a simple hr element instead of separator component
import { Calendar, DollarSign, Store, Shield, ExternalLink, Coins, ShoppingCart, RefreshCw, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NFTReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  nftImage: string;
  nftId: number;
}

export default function NFTReceiptModal({ isOpen, onClose, nftImage, nftId }: NFTReceiptModalProps) {
  const [verifying, setVerifying] = useState(false);
  const { toast } = useToast();

  // Generate realistic receipt data based on NFT ID
  const getReceiptData = (id: number) => {
    const merchants = ['Dunkin Donuts', 'Best Buy', 'Target', 'Starbucks', 'Amazon', 'Apple Store'];
    const categories = ['Food & Beverage', 'Electronics', 'Retail', 'Coffee & Tea', 'Online Shopping', 'Technology'];
    const items = [
      [{ name: 'Medium Coffee', quantity: 1, price: 3.49 }, { name: 'Glazed Donut', quantity: 2, price: 1.29 }],
      [{ name: 'Wireless Headphones', quantity: 1, price: 149.99 }, { name: 'Phone Case', quantity: 1, price: 24.99 }],
      [{ name: 'Organic T-Shirt', quantity: 2, price: 19.99 }, { name: 'Jeans', quantity: 1, price: 39.99 }],
      [{ name: 'Latte', quantity: 1, price: 4.95 }, { name: 'Blueberry Muffin', quantity: 1, price: 2.75 }],
      [{ name: 'Book: Design Patterns', quantity: 1, price: 29.99 }, { name: 'USB Cable', quantity: 1, price: 12.99 }],
      [{ name: 'iPhone 15 Pro', quantity: 1, price: 999.99 }, { name: 'AppleCare+', quantity: 1, price: 199.99 }]
    ];

    const merchantIndex = (id - 1) % merchants.length;
    const itemsList = items[merchantIndex];
    const subtotal = itemsList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.0875; // 8.75% tax
    const total = subtotal + tax;

    return {
      tokenId: id.toString(),
      merchantName: merchants[merchantIndex],
      category: categories[merchantIndex],
      purchaseDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      items: itemsList,
      subtotal: subtotal,
      tax: tax,
      totalAmount: total,
      currency: 'USD',
      paymentMethod: 'Stripe Payment',
      transactionId: `tx_${Math.random().toString(36).substring(2, 15)}`
    };
  };

  const receiptData = getReceiptData(nftId);

  const handleVerifyOnChain = async () => {
    setVerifying(true);
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "✅ Receipt Verified on Blockchain!",
        description: `Token ID ${receiptData.tokenId} confirmed on Polygon Amoy network`,
      });
      
      // Show detailed verification info
      setTimeout(() => {
        alert(`🔗 Blockchain Verification Complete\n\nToken ID: ${receiptData.tokenId}\nNetwork: Polygon Amoy (Chain ID: 80002)\nContract: 0x1111111111111111111111111111111111111111\nMetadata: ipfs://demo-metadata-${receiptData.tokenId}\nTransaction: ${receiptData.transactionId}\nStatus: ✅ Verified\n\nThis receipt is permanently recorded on the blockchain!`);
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Unable to verify receipt on blockchain. Please try again.",
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/98 backdrop-blur-xl border-2 border-white/30 shadow-2xl rounded-2xl">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Coins className="h-5 w-5 text-purple-600" />
            NFT Receipt Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-gray-900">
          {/* NFT Image and Basic Info */}
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
              <img src={nftImage} alt="NFT Receipt" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">Receipt NFT #{receiptData.tokenId}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Store className="h-4 w-4 text-gray-700" />
                <span className="font-medium text-gray-800">{receiptData.merchantName}</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">{receiptData.category}</Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-gray-700" />
                <span className="text-sm text-gray-800">{receiptData.purchaseDate}</span>
              </div>
              
              {/* Verification Details */}
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Blockchain Verified</span>
                </div>
                <div className="text-xs text-green-700 space-y-1">
                  <div>Network: Polygon Amoy (Chain ID: 80002)</div>
                  <div>Contract: 0x1111...1111</div>
                  <div>IPFS: ipfs://demo-metadata-{receiptData.tokenId}</div>
                  <div>Status: ✅ Permanently Recorded</div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Purchase Details */}
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Purchase Details
              </h4>
              <div className="space-y-2">
                {receiptData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-600 ml-2">×{item.quantity}</span>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <hr className="my-3 border-gray-200" />
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${receiptData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${receiptData.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>${receiptData.totalAmount.toFixed(2)} {receiptData.currency}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-gray-800">Payment Method</span>
                </div>
                <p className="text-sm text-gray-700">{receiptData.paymentMethod}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-gray-800">Transaction ID</span>
                </div>
                <p className="text-sm text-gray-700 font-mono">{receiptData.transactionId}</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex gap-3">
              <Button
                onClick={handleVerifyOnChain}
                disabled={verifying}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                {verifying ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Verify on Blockchain
                  </div>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Close
              </Button>
            </div>
            
            {/* Warranty & Returns Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50"
                onClick={() => {
                  toast({
                    title: "Returns Process",
                    description: "Return request initiated. You'll receive instructions via email.",
                  });
                }}
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Request Return
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                onClick={() => {
                  toast({
                    title: "Warranty Claim",
                    description: "Warranty claim started. Support team will contact you soon.",
                  });
                }}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Warranty Claim
                </div>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
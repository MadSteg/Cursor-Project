import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { NFTReceiptTier } from '@shared/products';

interface CryptoCheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: {
    receiptId: number;
    deliveryEmail?: string;
    deliveryWallet: string;
    deliveryPreference: 'email' | 'wallet' | 'both';
  }) => void;
  productName: string;
  productPrice: number;
  nftTier: string;
  nftPrice: number;
  totalPrice: number;
}

export default function CryptoCheckoutModal({
  open,
  onClose,
  onSuccess,
  productName,
  productPrice,
  nftTier,
  nftPrice,
  totalPrice
}: CryptoCheckoutModalProps) {
  const { toast } = useToast();
  const [paymentStep, setPaymentStep] = useState<'details' | 'paying' | 'confirming' | 'complete'>('details');
  const [walletAddress, setWalletAddress] = useState('');
  const [email, setEmail] = useState('');
  const [deliveryPreference, setDeliveryPreference] = useState<'email' | 'wallet' | 'both'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptId, setReceiptId] = useState<number | null>(null);

  // Process payment
  const handlePayment = async () => {
    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast({
        title: "Invalid Wallet Address",
        description: "Please enter a valid Ethereum wallet address",
        variant: "destructive",
      });
      return;
    }

    if (deliveryPreference === 'email' || deliveryPreference === 'both') {
      if (!email || !email.includes('@')) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return;
      }
    }

    setIsProcessing(true);
    setPaymentStep('paying');

    // Simulate payment processing
    setTimeout(() => {
      // Move to confirming step
      setPaymentStep('confirming');
      
      // Simulate blockchain confirmation
      setTimeout(() => {
        // Generate receipt ID
        const mockReceiptId = Math.floor(100000 + Math.random() * 900000);
        setReceiptId(mockReceiptId);
        setPaymentStep('complete');
        setIsProcessing(false);
      }, 3000);
    }, 3000);
  };

  const handleDeliveryPreferenceChange = (preference: 'email' | 'wallet' | 'both') => {
    setDeliveryPreference(preference);
  };

  const handleComplete = () => {
    if (receiptId) {
      onSuccess({
        receiptId,
        deliveryEmail: deliveryPreference === 'email' || deliveryPreference === 'both' ? email : undefined,
        deliveryWallet: walletAddress,
        deliveryPreference
      });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cryptocurrency Payment</DialogTitle>
          <DialogDescription>
            Pay with cryptocurrency and receive your NFT receipt
          </DialogDescription>
        </DialogHeader>

        {paymentStep === 'details' && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="wallet">Your Wallet Address</Label>
              <Input
                id="wallet"
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This is where you'll receive your NFT receipt
              </p>
            </div>

            <div className="space-y-2">
              <Label>Receipt Delivery Preference</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="wallet-delivery" 
                    checked={deliveryPreference === 'wallet' || deliveryPreference === 'both'} 
                    onCheckedChange={(checked) => {
                      if (checked) {
                        if (deliveryPreference === 'email') setDeliveryPreference('both');
                        else setDeliveryPreference('wallet');
                      } else {
                        if (deliveryPreference === 'both') setDeliveryPreference('email');
                        else setDeliveryPreference('email'); // Default to email if unchecking wallet
                      }
                    }}
                  />
                  <Label htmlFor="wallet-delivery" className="text-sm">Deliver to my wallet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="email-delivery" 
                    checked={deliveryPreference === 'email' || deliveryPreference === 'both'} 
                    onCheckedChange={(checked) => {
                      if (checked) {
                        if (deliveryPreference === 'wallet') setDeliveryPreference('both');
                        else setDeliveryPreference('email');
                      } else {
                        if (deliveryPreference === 'both') setDeliveryPreference('wallet');
                        else setDeliveryPreference('wallet'); // Default to wallet if unchecking email
                      }
                    }}
                  />
                  <Label htmlFor="email-delivery" className="text-sm">Email me a receipt summary</Label>
                </div>
              </div>
            </div>

            {(deliveryPreference === 'email' || deliveryPreference === 'both') && (
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-2 pt-2">
              <h3 className="font-medium">Payment Summary</h3>
              <div className="rounded-md border p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">{productName}</span>
                  <span className="text-sm">${productPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">NFT Receipt ({nftTier})</span>
                  <span className="text-sm">${nftPrice.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handlePayment}>Proceed to Payment</Button>
            </DialogFooter>
          </div>
        )}

        {paymentStep === 'paying' && (
          <div className="space-y-4 py-4">
            <div className="flex justify-center pb-6">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
            <h3 className="text-center font-medium">Processing Payment</h3>
            <p className="text-center text-sm text-muted-foreground">
              Please wait while we process your payment. This may take a few moments.
            </p>
          </div>
        )}

        {paymentStep === 'confirming' && (
          <div className="space-y-4 py-4">
            <div className="flex justify-center pb-6">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
            <h3 className="text-center font-medium">Confirming on Blockchain</h3>
            <p className="text-center text-sm text-muted-foreground">
              Your payment has been received. We're now waiting for blockchain confirmation.
            </p>
          </div>
        )}

        {paymentStep === 'complete' && (
          <div className="space-y-4 py-4">
            <div className="flex justify-center pb-6 text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-center font-medium">Payment Complete!</h3>
            <p className="text-center text-sm text-muted-foreground">
              Your NFT receipt has been generated and will be delivered to your wallet.
            </p>
            
            <div className="rounded-md border p-4 mt-4">
              <p className="text-center font-medium">Receipt ID: #{receiptId}</p>
              {deliveryPreference === 'email' || deliveryPreference === 'both' ? (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  A receipt summary has been sent to {email}
                </p>
              ) : null}
              <p className="text-center text-sm text-muted-foreground mt-2">
                NFT Receipt has been sent to {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              </p>
            </div>

            <DialogFooter className="pt-4">
              <Button onClick={handleComplete}>View Receipt</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
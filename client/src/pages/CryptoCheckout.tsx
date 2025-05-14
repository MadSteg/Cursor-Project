/**
 * Cryptocurrency checkout page for processing crypto payments
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cryptoPaymentService, formatCryptoAddress, formatCryptoAmount } from '@/lib/cryptoPaymentService';
import { Loader2, CheckCircle2, CreditCard, Receipt, AlertCircle, Shield, BadgeCheck, Smartphone, Wallet, Bitcoin, Copy } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

// Available payment states in the crypto checkout flow
type CheckoutState = 
  | "initial"          // First state when loading the component
  | "processing"       // When creating payment intent
  | "awaitingPayment"  // When showing payment instructions
  | "verifyingPayment" // When checking if payment is complete 
  | "paymentConfirmed" // When payment is confirmed
  | "error";           // When an error occurs

export default function CryptoCheckout() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // URL parameters
  const [amount, setAmount] = useState<number>(0);
  const [receiptId, setReceiptId] = useState<number | undefined>(undefined);
  const [mintNFT, setMintNFT] = useState(false);
  const [nftTheme, setNftTheme] = useState('default');
  
  // Payment state
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("initial");
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  
  // Payment details
  const [paymentAddress, setPaymentAddress] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  
  // Parse URL parameters on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    
    const amountParam = searchParams.get('amount');
    if (amountParam) {
      setAmount(parseFloat(amountParam));
    }
    
    const receiptParam = searchParams.get('receipt');
    if (receiptParam) {
      setReceiptId(parseInt(receiptParam));
    }
    
    const mintNftParam = searchParams.get('mintNFT');
    if (mintNftParam) {
      setMintNFT(mintNftParam === 'true');
    }
    
    const themeParam = searchParams.get('nftTheme');
    if (themeParam) {
      setNftTheme(themeParam);
    }
  }, []);
  
  // Create a crypto payment intent when component loads
  useEffect(() => {
    if (amount > 0 && checkoutState === "initial") {
      createCryptoPayment();
    }
  }, [amount]);
  
  // Create a crypto payment intent
  const createCryptoPayment = async () => {
    try {
      setCheckoutState("processing");
      
      // Add NFT metadata if option is selected
      const metadata: Record<string, string> = {};
      if (mintNFT) {
        metadata.mintNFT = 'true';
        metadata.nftTheme = nftTheme;
      }
      
      // Call API to create payment intent
      const paymentIntent = await cryptoPaymentService.createPaymentIntent(
        amount,
        'MATIC'
      );
      
      if (paymentIntent.success) {
        setPaymentAddress(paymentIntent.paymentAddress);
        setPaymentAmount(paymentIntent.amount.toString());
        setPaymentId(paymentIntent.paymentId);
        
        setCheckoutState("awaitingPayment");
        
        // Start polling for payment status
        startPaymentStatusPolling(paymentIntent.paymentId);
      } else {
        setError(paymentIntent.error || "Failed to create payment intent");
        setCheckoutState("error");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred creating the payment");
      setCheckoutState("error");
    }
  };
  
  // Poll for payment status
  const startPaymentStatusPolling = (paymentId: string) => {
    // In a real implementation, this would poll the server
    // for payment status updates
    
    // Mock implementation for demo purposes
    setTimeout(() => {
      setCheckoutState("verifyingPayment");
      
      // Mock successful payment after 3 seconds
      setTimeout(() => {
        completePayment("0x123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef");
      }, 3000);
    }, 5000);
  };
  
  // Handle payment completion
  const completePayment = async (txHash: string) => {
    try {
      setTransactionHash(txHash);
      
      // In a real implementation, verify payment on the blockchain
      const verifyResult = await cryptoPaymentService.verifyPayment(
        paymentId!,
        txHash
      );
      
      if (verifyResult.success) {
        setCheckoutState("paymentConfirmed");
        
        // Save receipt if receipt ID provided
        if (receiptId) {
          // Update receipt with payment information
          // This would be handled by the server in a real implementation
          
          // Refresh receipt data
          queryClient.invalidateQueries({queryKey: ['/api/receipts']});
          queryClient.invalidateQueries({queryKey: ['/api/receipts/recent']});
        }
        
        toast({
          title: "Payment Confirmed",
          description: "Your cryptocurrency payment has been verified on the blockchain.",
          variant: "default",
        });
      } else {
        setError("Payment verification failed");
        setCheckoutState("error");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred verifying the payment");
      setCheckoutState("error");
    }
  };
  
  // Handle copying payment address to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The payment address has been copied to your clipboard.",
        variant: "default",
      });
    });
  };
  
  // Render different UI based on checkout state
  const renderCheckoutContent = () => {
    switch (checkoutState) {
      case "initial":
      case "processing":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">
              {checkoutState === "initial" ? "Initializing payment..." : "Creating payment..."}
            </p>
          </div>
        );
        
      case "awaitingPayment":
        return (
          <div className="space-y-6">
            <div className="rounded-lg border p-4 bg-muted/30">
              <div className="flex flex-col items-center mb-4">
                <Bitcoin className="h-12 w-12 text-primary mb-2" />
                <p className="text-lg font-medium">Send exactly:</p>
                <p className="text-2xl font-bold text-primary">{formatCryptoAmount(paymentAmount!, 'MATIC')}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">To this address:</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 gap-1"
                    onClick={() => paymentAddress && copyToClipboard(paymentAddress)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </Button>
                </div>
                <div className="p-3 bg-muted rounded-md font-mono text-xs break-all">
                  {paymentAddress || 'Generating address...'}
                </div>
              </div>
              
              <Alert className="mt-4 bg-amber-50 text-amber-800 border-amber-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Send only MATIC on the Polygon network. Sending other tokens may result in permanent loss.
                </AlertDescription>
              </Alert>
            </div>
            
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              <span className="text-sm text-muted-foreground">Waiting for payment confirmation...</span>
            </div>
          </div>
        );
        
      case "verifyingPayment":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <div>
                  <h3 className="font-medium text-blue-800">Verifying Transaction</h3>
                  <p className="text-sm text-blue-700">
                    We're confirming your transaction on the blockchain. This may take a moment.
                  </p>
                </div>
              </div>
            </div>
            
            {transactionHash && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Transaction Hash:</p>
                <div className="p-2 bg-muted rounded-md font-mono text-xs break-all">
                  {transactionHash}
                </div>
              </div>
            )}
          </div>
        );
        
      case "paymentConfirmed":
        return (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-800">Payment Confirmed</h3>
                  <p className="text-sm text-green-700">
                    Your crypto payment has been successfully verified on the blockchain.
                  </p>
                </div>
              </div>
            </div>
            
            {mintNFT && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-800">Blockchain Receipt</h3>
                    <p className="text-sm text-blue-700">
                      Your NFT receipt is being minted. This process may take a few minutes to complete.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {transactionHash && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Transaction Hash:</p>
                <div className="p-2 bg-muted rounded-md font-mono text-xs break-all">
                  {transactionHash}
                </div>
              </div>
            )}
          </div>
        );
        
      case "error":
        return (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Payment Error</AlertTitle>
              <AlertDescription>
                {error || "An unexpected error occurred during the payment process."}
              </AlertDescription>
            </Alert>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setCheckoutState("initial");
                setError(null);
                createCryptoPayment();
              }}
            >
              Try Again
            </Button>
          </div>
        );
    }
  };
  
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card className="w-full">
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Crypto Checkout</CardTitle>
              <CardDescription>Pay with cryptocurrency</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-xl font-semibold">${amount.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-1 bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                <Bitcoin className="h-3.5 w-3.5" />
                MATIC
              </div>
            </div>
            
            <Separator />
            
            {renderCheckoutContent()}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t bg-muted/20 p-4">
          <Button variant="ghost" onClick={() => navigate('/checkout')}>
            Back to Payment Options
          </Button>
          
          {checkoutState === "paymentConfirmed" && (
            <Button onClick={() => navigate('/')}>
              Return to Dashboard
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
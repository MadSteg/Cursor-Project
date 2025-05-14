/**
 * Checkout page for processing payments
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { checkPaymentStatus, createPaymentIntent, createMockPayment } from '@/lib/payments';
import { Loader2, CheckCircle2, CreditCard, Receipt, AlertCircle, Shield, BadgeCheck, Smartphone, Bitcoin, Wallet } from 'lucide-react';
import MobileWalletPreview from '@/components/blockchain/MobileWalletPreview';
import { useQueryClient } from '@tanstack/react-query';

export default function Checkout() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Payment state
  const [amount, setAmount] = useState('29.99');
  const [receiptId, setReceiptId] = useState<number | undefined>(undefined);
  const [paymentStatus, setPaymentStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  
  // NFT receipt options
  const [mintNFT, setMintNFT] = useState(true); // Default to selected
  const NFT_RECEIPT_FEE = 0.99;
  const [nftTheme, setNftTheme] = useState('default');
  
  // Payment method selection
  const [paymentMethod, setPaymentMethod] = useState('credit-card'); // 'credit-card' or 'crypto'
  
  // Get URL search params (if any)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const receiptParam = searchParams.get('receipt');
    const amountParam = searchParams.get('amount');
    
    if (receiptParam) {
      setReceiptId(parseInt(receiptParam));
    }
    
    if (amountParam) {
      setAmount(amountParam);
    }
    
    // Check payment system status
    checkPaymentStatus().then(status => {
      setPaymentStatus(status);
    });
  }, []);
  
  // Calculate total amount with NFT fee if selected
  const calculateTotal = () => {
    const baseAmount = parseFloat(amount);
    return mintNFT ? baseAmount + NFT_RECEIPT_FEE : baseAmount;
  };
  
  // Handle mock payment submission
  // Handle adding the receipt to mobile wallet
  const handleAddToWallet = () => {
    toast({
      title: "Added to Mobile Wallet",
      description: "Your digital receipt has been added to your mobile wallet. You can now view it on your Apple Watch or iPhone.",
      variant: "default",
    });
    
    // In a real implementation, this would generate a wallet pass file
    // and download it or send it to the user's device
  };
  
  const handleMockPayment = async () => {
    try {
      setIsLoading(true);
      
      // Calculate total with optional NFT fee
      const totalAmount = calculateTotal();
      
      // Add NFT metadata if option is selected
      const metadata: Record<string, string> = {};
      if (mintNFT) {
        metadata.mintNFT = 'true';
        metadata.nftTheme = nftTheme;
        metadata.nftFee = NFT_RECEIPT_FEE.toString();
      }
      
      const paymentResult = await createMockPayment(
        totalAmount,
        receiptId,
        metadata
      );
      
      if (paymentResult.success) {
        setIsSuccess(true);
        setPaymentInfo({
          ...paymentResult,
          mintNFT: mintNFT,
          nftTheme: nftTheme
        });
        
        toast({
          title: "Payment Successful",
          description: mintNFT 
            ? "Your payment has been processed and blockchain receipt will be created."
            : "Your payment has been processed successfully.",
        });
        
        // Invalidate receipt queries to refresh data
        queryClient.invalidateQueries({queryKey: ['/api/receipts']});
        queryClient.invalidateQueries({queryKey: ['/api/receipts/recent']});
        
        // If receipt ID is provided, redirect to receipt page after payment
        if (receiptId) {
          setTimeout(() => {
            navigate(`/receipts/${receiptId}`);
          }, 2000);
        }
      } else {
        toast({
          title: "Payment Failed",
          description: paymentResult.error || "There was an error processing your payment.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "There was an error processing your payment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle real payment (with Stripe or redirect to crypto) - will use mock functionality when keys aren't available
  const handleRealPayment = async () => {
    try {
      // If crypto payment is selected, redirect to crypto checkout page
      if (paymentMethod === 'crypto') {
        // Calculate total with optional NFT fee
        const totalAmount = calculateTotal();
        
        // Build the search params for the crypto checkout page
        const searchParams = new URLSearchParams();
        if (receiptId) {
          searchParams.set('receipt', receiptId.toString());
        }
        searchParams.set('amount', totalAmount.toString());
        searchParams.set('mintNFT', mintNFT ? 'true' : 'false');
        searchParams.set('nftTheme', nftTheme);
        
        // Redirect to crypto checkout page
        navigate(`/crypto-checkout?${searchParams.toString()}`);
        return;
      }
      
      // Regular Stripe payment flow
      setIsLoading(true);
      
      // Calculate total with optional NFT fee
      const totalAmount = calculateTotal();
      
      // Add NFT metadata if option is selected
      const metadata: Record<string, string> = {};
      if (mintNFT) {
        metadata.mintNFT = 'true';
        metadata.nftTheme = nftTheme;
        metadata.nftFee = NFT_RECEIPT_FEE.toString();
      }
      
      // Create payment intent
      const paymentIntent = await createPaymentIntent(
        totalAmount,
        receiptId,
        metadata
      );
      
      if (paymentIntent.success) {
        // In non-mock mode, this would usually redirect to Stripe
        // But since we're in mock mode, we can simulate a successful payment
        if (paymentIntent.mockMode) {
          setIsSuccess(true);
          setPaymentInfo({
            ...paymentIntent,
            mintNFT: mintNFT,
            nftTheme: nftTheme
          });
          
          toast({
            title: "Payment Intent Created",
            description: mintNFT 
              ? "Payment intent created and blockchain receipt will be minted."
              : "Payment intent created successfully.",
          });
          
          // Invalidate receipt queries to refresh data
          queryClient.invalidateQueries({queryKey: ['/api/receipts']});
          queryClient.invalidateQueries({queryKey: ['/api/receipts/recent']});
        } else {
          // This would integrate with Stripe Elements in real implementation
          alert('Real Stripe integration would happen here');
        }
      } else {
        toast({
          title: "Payment Failed",
          description: paymentIntent.error || "There was an error creating payment intent.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "There was an error processing your payment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // If success state is active, show success view
  if (isSuccess) {
    return (
      <div className="container mx-auto max-w-3xl py-8">
        <Card className="w-full">
          <CardHeader className="bg-green-50 border-b border-green-100">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <div>
                <CardTitle className="text-green-700">Payment Successful</CardTitle>
                <CardDescription>
                  {paymentInfo?.mintNFT
                    ? "Your payment has been processed and blockchain receipt is being minted"
                    : "Your payment has been processed successfully"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Amount</Label>
                  <p className="text-lg font-semibold">
                    ${calculateTotal().toFixed(2)}
                    {paymentInfo?.mintNFT && <span className="text-xs text-muted-foreground ml-1">(includes NFT fee)</span>}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Payment ID</Label>
                  <p className="text-lg font-mono text-sm">{paymentInfo?.paymentId || 'mock-payment'}</p>
                </div>
                {receiptId && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Receipt ID</Label>
                    <p className="text-lg">{receiptId}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <p className="text-lg text-green-600 font-semibold">Completed</p>
                </div>
                
                {paymentInfo?.mintNFT && (
                  <div className="col-span-2 bg-blue-50 p-3 rounded-md mt-2">
                    <div className="flex items-start gap-3">
                      <BadgeCheck className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium text-blue-800">Blockchain Receipt</p>
                        <p className="text-sm text-blue-700">
                          Your verified receipt is being minted on the blockchain. This process may take a few minutes to complete.
                        </p>
                        
                        <div className="mt-3 pt-3 border-t border-blue-100">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-blue-600" />
                            <p className="text-sm font-medium text-blue-800">Mobile Wallet Ready</p>
                          </div>
                          <p className="text-xs text-blue-600 mt-1">
                            Your receipt will be available to add to Apple Wallet or Google Pay from your receipt details page.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {paymentInfo?.receiptUrl && (
                <div className="pt-4 flex gap-2">
                  <Button variant="outline" className="gap-2" onClick={() => window.open(paymentInfo.receiptUrl, '_blank')}>
                    <Receipt className="h-4 w-4" />
                    View Receipt
                  </Button>
                  
                  {paymentInfo?.mintNFT && (
                    <Button 
                      variant="default" 
                      className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700"
                      onClick={handleAddToWallet}
                    >
                      <Smartphone className="h-4 w-4" />
                      Add to Wallet
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t bg-muted/20 p-4">
            <Button variant="ghost" onClick={() => navigate('/')}>Return to Dashboard</Button>
            {receiptId && (
              <Button onClick={() => navigate(`/receipts/${receiptId}`)}>
                View Receipt
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card className="w-full">
        <CardHeader className="border-b">
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Complete your payment</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="card" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Credit Card
              </TabsTrigger>
              <TabsTrigger value="mock" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Test Payment
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="card" className="space-y-4 pt-4">
              {paymentStatus && paymentStatus.mockMode && (
                <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md flex items-start gap-2 text-sm mb-4">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Mock Mode Active</p>
                    <p>Stripe API keys are not configured. Real payments cannot be processed.</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input 
                      id="amount" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-7"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="name">Name on Card</Label>
                  <Input id="name" placeholder="John Smith" disabled={isLoading} />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="4242 4242 4242 4242" disabled={isLoading} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" disabled={isLoading} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" disabled={isLoading} />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                {/* Payment Method Selection */}
                <div className="space-y-2 mb-4">
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="flex flex-col space-y-1"
                    disabled={isLoading}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        Credit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="crypto" id="crypto" />
                      <Label htmlFor="crypto" className="flex items-center gap-2 cursor-pointer">
                        <Bitcoin className="h-4 w-4 text-muted-foreground" />
                        Cryptocurrency
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {paymentMethod === 'crypto' && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm text-blue-800 flex items-start gap-2">
                      <Wallet className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Web3 Payment</p>
                        <p className="text-blue-700">Pay with MATIC on the Polygon network. You'll be redirected to connect your crypto wallet.</p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="nft-receipt"
                        checked={mintNFT}
                        onCheckedChange={(checked) => setMintNFT(checked as boolean)}
                        disabled={isLoading}
                      />
                      <div className="grid gap-1.5">
                        <Label
                          htmlFor="nft-receipt"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Add Blockchain Receipt (+${NFT_RECEIPT_FEE.toFixed(2)})
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get a permanent, verified proof of purchase on the blockchain
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {mintNFT && (
                    <div className="rounded-md border p-4 bg-slate-50">
                      <div className="flex space-x-4 items-start">
                        <Shield className="h-10 w-10 text-primary flex-shrink-0" />
                        <div className="space-y-2">
                          <h4 className="font-semibold">Blockchain Receipt Benefits</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            <li>Permanent proof of purchase that can't be lost</li>
                            <li>Verify authenticity of your purchase anytime</li>
                            <li><span className="font-medium text-blue-600">Display on Apple Watch & iPhone</span></li>
                            <li>Enhanced warranty and return claim support</li>
                            <li>Access to exclusive rewards and benefits</li>
                          </ul>
                          
                          <div className="text-xs text-muted-foreground bg-blue-50 border border-blue-100 rounded p-2 flex items-start">
                            <Smartphone className="h-4 w-4 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>Your NFT receipt will be compatible with Apple Wallet and Google Pay for easy access.</span>
                          </div>
                          
                          <div className="pt-2">
                            <Label htmlFor="nft-theme" className="text-sm font-medium mb-1.5 block">Receipt Theme</Label>
                            <RadioGroup 
                              id="nft-theme" 
                              value={nftTheme}
                              onValueChange={setNftTheme}
                              className="flex flex-wrap gap-2"
                              disabled={isLoading}
                            >
                              <div className="flex items-center space-x-2 border rounded-md p-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5">
                                <RadioGroupItem value="default" id="theme-default" />
                                <Label htmlFor="theme-default" className="cursor-pointer">Default</Label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-md p-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5">
                                <RadioGroupItem value="dark" id="theme-dark" />
                                <Label htmlFor="theme-dark" className="cursor-pointer">Dark</Label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-md p-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5">
                                <RadioGroupItem value="light" id="theme-light" />
                                <Label htmlFor="theme-light" className="cursor-pointer">Light</Label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-md p-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5">
                                <RadioGroupItem value="colorful" id="theme-colorful" />
                                <Label htmlFor="theme-colorful" className="cursor-pointer">Colorful</Label>
                              </div>
                            </RadioGroup>
                            
                            <div className="mt-4 bg-white rounded-lg p-3 border">
                              <MobileWalletPreview theme={nftTheme as any} amount={`$${parseFloat(amount).toFixed(2)}`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="mock" className="pt-4">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="mock-amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input 
                      id="mock-amount" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-7"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                {receiptId ? (
                  <div className="grid gap-2">
                    <Label>Connected Receipt</Label>
                    <div className="bg-muted p-3 rounded-md flex justify-between items-center">
                      <span>Receipt #{receiptId}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setReceiptId(undefined)}
                        disabled={isLoading}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="receiptId">Receipt ID (Optional)</Label>
                    <Input 
                      id="receiptId" 
                      type="number"
                      placeholder="Enter receipt ID to connect payment" 
                      value={receiptId || ''}
                      onChange={(e) => setReceiptId(e.target.value ? parseInt(e.target.value) : undefined)}
                      disabled={isLoading}
                    />
                  </div>
                )}
                
                <div className="bg-muted p-4 rounded-md text-sm">
                  <p className="font-medium">Test Payment</p>
                  <p className="text-muted-foreground">This option simulates a payment for testing purposes. No real charges will be made.</p>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="mock-nft-receipt"
                        checked={mintNFT}
                        onCheckedChange={(checked) => setMintNFT(checked as boolean)}
                        disabled={isLoading}
                      />
                      <div className="grid gap-1.5">
                        <Label
                          htmlFor="mock-nft-receipt"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Add Blockchain Receipt (+${NFT_RECEIPT_FEE.toFixed(2)})
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get a permanent, verified proof of purchase on the blockchain
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {mintNFT && (
                    <div className="rounded-md border p-4 bg-slate-50">
                      <div className="flex space-x-4 items-start">
                        <BadgeCheck className="h-10 w-10 text-primary flex-shrink-0" />
                        <div className="space-y-2">
                          <h4 className="font-semibold">Blockchain Receipt Benefits</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                            <li>Permanent proof of purchase that can't be lost</li>
                            <li>Verify authenticity of your purchase anytime</li>
                            <li>Enhanced warranty and return claim support</li>
                            <li>Access to exclusive rewards and benefits</li>
                          </ul>
                          
                          <div className="pt-2">
                            <Label htmlFor="mock-nft-theme" className="text-sm font-medium mb-1.5 block">Receipt Theme</Label>
                            <RadioGroup 
                              id="mock-nft-theme" 
                              value={nftTheme}
                              onValueChange={setNftTheme}
                              className="flex flex-wrap gap-2"
                              disabled={isLoading}
                            >
                              <div className="flex items-center space-x-2 border rounded-md p-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5">
                                <RadioGroupItem value="default" id="mock-theme-default" />
                                <Label htmlFor="mock-theme-default" className="cursor-pointer">Default</Label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-md p-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5">
                                <RadioGroupItem value="dark" id="mock-theme-dark" />
                                <Label htmlFor="mock-theme-dark" className="cursor-pointer">Dark</Label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-md p-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5">
                                <RadioGroupItem value="light" id="mock-theme-light" />
                                <Label htmlFor="mock-theme-light" className="cursor-pointer">Light</Label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-md p-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary/5">
                                <RadioGroupItem value="colorful" id="mock-theme-colorful" />
                                <Label htmlFor="mock-theme-colorful" className="cursor-pointer">Colorful</Label>
                              </div>
                            </RadioGroup>
                            
                            <div className="mt-4 bg-white rounded-lg p-3 border">
                              <MobileWalletPreview theme={nftTheme as any} amount={`$${parseFloat(amount).toFixed(2)}`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-muted/20 p-4">
          <Button variant="ghost" onClick={() => navigate('/')} disabled={isLoading}>Cancel</Button>
          <Button 
            onClick={() => {
              if (paymentMethod === 'crypto') {
                // Redirect to crypto checkout page with necessary parameters
                const searchParams = new URLSearchParams();
                searchParams.set('amount', calculateTotal().toString());
                if (nftReceipt) {
                  searchParams.set('mintNFT', 'true');
                  searchParams.set('nftTheme', nftTheme);
                }
                navigate(`/crypto-checkout?${searchParams.toString()}`);
              } else {
                // Use regular Stripe checkout
                const selectedTab = document.querySelector('[role="tablist"] [data-state="active"]')?.getAttribute('value');
                if (selectedTab === 'mock') {
                  handleMockPayment();
                } else {
                  handleRealPayment();
                }
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {paymentMethod === 'crypto' ? (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Pay with Crypto (${calculateTotal().toFixed(2)})
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay ${calculateTotal().toFixed(2)}
                  </>
                )}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
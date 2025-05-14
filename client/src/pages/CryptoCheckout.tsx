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
import { CryptoCurrency, cryptoPaymentService, formatCryptoAddress, formatCryptoAmount } from '@/lib/cryptoPaymentService';
import { Loader2, CheckCircle2, CreditCard, Receipt, AlertCircle, Shield, BadgeCheck, Smartphone, Wallet, Bitcoin, Copy, Coins, FileText, Search } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
  const [nftTier, setNftTier] = useState('standard'); // 'standard', 'premium', or 'luxury'
  
  // NFT tiered pricing structure
  type NFTTierType = 'standard' | 'premium' | 'luxury';
  
  const NFT_RECEIPT_TIERS: Record<NFTTierType, {
    name: string;
    price: number;
    appleWalletSupport: boolean;
  }> = {
    standard: { name: 'Standard', price: 0.99, appleWalletSupport: false },
    premium: { name: 'Premium', price: 2.99, appleWalletSupport: false },
    luxury: { name: 'Luxury', price: 5.00, appleWalletSupport: true },
  };
  
  // Payment state
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("initial");
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  
  // Payment details
  const [paymentAddress, setPaymentAddress] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  
  // Cryptocurrency options
  const [availableCurrencies, setAvailableCurrencies] = useState<CryptoCurrency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('MATIC');
  const [selectedCurrencyDetails, setSelectedCurrencyDetails] = useState<CryptoCurrency | null>(null);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  
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
    
    const tierParam = searchParams.get('nftTier');
    if (tierParam && ['standard', 'premium', 'luxury'].includes(tierParam)) {
      setNftTier(tierParam);
    }
    
    // Load available cryptocurrencies
    loadCurrencies();
  }, []);
  
  // Load available cryptocurrencies
  const loadCurrencies = async () => {
    try {
      setLoadingCurrencies(true);
      const currencies = await cryptoPaymentService.getAvailableCurrencies();
      setAvailableCurrencies(currencies);
      
      // Set default currency (MATIC) or first available
      if (currencies.length > 0) {
        const defaultCurrency = currencies.find(c => c.code === 'MATIC') || currencies[0];
        setSelectedCurrency(defaultCurrency.code);
        setSelectedCurrencyDetails(defaultCurrency);
      }
      
      setLoadingCurrencies(false);
    } catch (error) {
      console.error('Error loading currencies:', error);
      setLoadingCurrencies(false);
      
      // If we fail to load currencies, don't block the flow, just use MATIC as fallback
      const fallbackCurrency = {
        code: 'MATIC',
        name: 'Polygon MATIC',
        network: 'polygon-mumbai',
        enabled: true,
        color: '#8247E5'
      };
      setSelectedCurrencyDetails(fallbackCurrency);
    }
  };
  
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
        metadata.nftTier = nftTier;
        metadata.nftFee = NFT_RECEIPT_TIERS[nftTier].price.toString();
        metadata.appleWalletSupport = NFT_RECEIPT_TIERS[nftTier].appleWalletSupport.toString();
      }
      
      // Add receipt ID to metadata if available
      if (receiptId) {
        metadata.receiptId = receiptId.toString();
      }
      
      // Call API to create payment intent with selected currency
      const paymentIntent = await cryptoPaymentService.createPaymentIntent(
        amount,
        selectedCurrency,
        metadata
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
    // Create polling interval to check payment status
    const pollInterval = setInterval(async () => {
      try {
        // Call the API to get payment status
        const paymentStatus = await cryptoPaymentService.getPaymentStatus(paymentId);
        
        // Handle different payment statuses
        if (paymentStatus.status === 'completed' && paymentStatus.txHash) {
          clearInterval(pollInterval);
          setCheckoutState("verifyingPayment");
          completePayment(paymentStatus.txHash);
        } else if (paymentStatus.status === 'expired') {
          clearInterval(pollInterval);
          setError("Payment window expired. Please try again.");
          setCheckoutState("error");
        } else if (paymentStatus.status === 'failed') {
          clearInterval(pollInterval);
          setError("Payment failed. Please try again.");
          setCheckoutState("error");
        }
        // Continue polling if status is still 'pending'
      } catch (err) {
        console.error("Error polling payment status:", err);
        // Don't stop polling on error, just continue trying
      }
    }, 5000); // Poll every 5 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(pollInterval);
  };
  
  // Handle payment completion
  const completePayment = async (txHash: string) => {
    try {
      setTransactionHash(txHash);
      
      // Verify payment on the blockchain with the selected cryptocurrency
      const verifyResult = await cryptoPaymentService.verifyPayment(
        paymentId!,
        txHash,
        selectedCurrency // Pass the currency for proper verification
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
        return (
          <div className="space-y-6">
            <div className="flex flex-col space-y-4">
              <h3 className="text-lg font-medium">Select payment currency</h3>
              
              {loadingCurrencies ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                  <p className="text-muted-foreground">Loading available currencies...</p>
                </div>
              ) : (
                <RadioGroup 
                  value={selectedCurrency} 
                  onValueChange={(value) => {
                    setSelectedCurrency(value);
                    const currencyDetails = availableCurrencies.find(c => c.code === value);
                    setSelectedCurrencyDetails(currencyDetails || null);
                  }}
                  className="space-y-3"
                >
                  {availableCurrencies.map(currency => {
                    const getCurrencyIcon = (code: string) => {
                      switch (code) {
                        case 'BTC':
                          return <Bitcoin className="h-5 w-5 text-amber-500" />;
                        case 'ETH':
                          return (
                            <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                              <path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
                            </svg>
                          );
                        case 'MATIC':
                          return (
                            <svg className="h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.4 33.5">
                              <path fill="currentColor" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3 c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7 c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1 L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
                            </svg>
                          );
                        case 'SOL':
                          return (
                            <svg className="h-5 w-5 text-[#14F195]" viewBox="0 0 397 311" xmlns="http://www.w3.org/2000/svg">
                              <path fill="currentColor" d="M64.6 237.9c2.1-2.1 5-3.3 7.9-3.3h324.2c4.7 0 7.1 5.7 3.7 9l-64.6 64c-2.1 2.1-4.9 3.3-7.9 3.3H3.7c-4.7 0-7.1-5.7-3.7-9l64.6-64zm0-164.8c2.1-2.1 5-3.3 7.9-3.3h324.2c4.7 0 7.1 5.7 3.7 9l-64.6 64c-2.1 2.1-4.9 3.3-7.9 3.3H3.7c-4.7 0-7.1-5.7-3.7-9l64.6-64zm328-64c-2.1-2.1-4.9-3.3-7.9-3.3H60.5c-4.7 0-7.1 5.7-3.7 9l64.6 64c2.1 2.1 5 3.3 7.9 3.3h324.2c4.7 0 7.1-5.7 3.7-9l-64.6-64z" />
                            </svg>
                          );
                        case 'USDC':
                          return (
                            <svg className="h-5 w-5 text-blue-500" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg">
                              <path fill="currentColor" d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000z"/>
                              <path fill="white" d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 120.83-137.5 120.83c-108.34 0-145.84-45.83-158.34-108.33-4.16-16.67-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.16c16.66 104.17 83.33 179.17 220.83 200v100c0 16.67 12.5 29.17 33.34 33.34h62.5c16.66 0 29.16-12.5 33.33-33.34v-100c125-20.83 208.33-108.33 208.33-220.83z"/>
                              <path fill="white" d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zM1229.17 295.83c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z"/>
                            </svg>
                          );
                        default:
                          return <Coins className="h-5 w-5 text-white" />;
                      }
                    };
                    
                    const getNetworkBadgeColor = (network: string) => {
                      switch (network.toLowerCase()) {
                        case 'bitcoin': return 'bg-amber-100 text-amber-700 border-amber-200';
                        case 'ethereum': return 'bg-blue-100 text-blue-700 border-blue-200';
                        case 'polygon': 
                        case 'mumbai': return 'bg-purple-100 text-purple-700 border-purple-200';
                        case 'solana': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
                        default: return 'bg-gray-100 text-gray-700 border-gray-200';
                      }
                    };
                    
                    return (
                      <div 
                        key={currency.code} 
                        className={`flex items-center space-x-3 rounded-md border p-4 cursor-pointer transition-all
                        ${selectedCurrency === currency.code 
                          ? 'border-primary/50 bg-primary/5 shadow-sm' 
                          : 'hover:bg-muted/50'}`}
                      >
                        <RadioGroupItem value={currency.code} id={`currency-${currency.code}`} />
                        <Label htmlFor={`currency-${currency.code}`} className="flex flex-1 items-center cursor-pointer">
                          <div className="flex items-center space-x-3 flex-1">
                            <div 
                              className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                selectedCurrency === currency.code 
                                  ? 'bg-gradient-to-br from-primary/80 to-primary shadow-inner' 
                                  : 'bg-gradient-to-br from-gray-100 to-gray-200'
                              }`}
                            >
                              {getCurrencyIcon(currency.code)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-base flex items-center gap-2">
                                {currency.name}
                                <span className={`text-xs px-2 py-0.5 rounded border ${getNetworkBadgeColor(currency.network)}`}>
                                  {currency.network}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {currency.code === 'BTC' ? 'Native Bitcoin network' : 
                                  currency.code === 'ETH' ? 'Ethereum Mainnet' : 
                                  currency.code === 'MATIC' ? 'Polygon Network' :
                                  currency.code === 'SOL' ? 'Solana Network' :
                                  currency.code === 'USDC' ? 'Available on multiple networks' :
                                  `${currency.network} network`}
                              </div>
                            </div>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              )}
              
              <Button 
                className="mt-4" 
                disabled={loadingCurrencies || !selectedCurrency}
                onClick={createCryptoPayment}
              >
                Continue with {selectedCurrency}
              </Button>
            </div>
          </div>
        );
        
      case "processing":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-center text-muted-foreground">
              Creating payment...
            </p>
          </div>
        );
        
      case "awaitingPayment":
        return (
          <div className="space-y-6">
            <div className="rounded-lg border p-6 bg-gradient-to-b from-white to-gray-50">
              <div className="flex flex-col items-center mb-6">
                {selectedCurrency === 'BTC' ? (
                  <Bitcoin className="h-16 w-16 text-amber-500 mb-3" />
                ) : selectedCurrency === 'ETH' ? (
                  <svg className="h-16 w-16 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
                  </svg>
                ) : selectedCurrency === 'MATIC' ? (
                  <svg className="h-16 w-16 text-purple-600 mb-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.4 33.5">
                    <path fill="currentColor" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3 c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7 c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1 L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
                  </svg>
                ) : selectedCurrency === 'SOL' ? (
                  <svg className="h-16 w-16 text-[#14F195] mb-3" viewBox="0 0 397 311" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M64.6 237.9c2.1-2.1 5-3.3 7.9-3.3h324.2c4.7 0 7.1 5.7 3.7 9l-64.6 64c-2.1 2.1-4.9 3.3-7.9 3.3H3.7c-4.7 0-7.1-5.7-3.7-9l64.6-64zm0-164.8c2.1-2.1 5-3.3 7.9-3.3h324.2c4.7 0 7.1 5.7 3.7 9l-64.6 64c-2.1 2.1-4.9 3.3-7.9 3.3H3.7c-4.7 0-7.1-5.7-3.7-9l64.6-64zm328-64c-2.1-2.1-4.9-3.3-7.9-3.3H60.5c-4.7 0-7.1 5.7-3.7 9l64.6 64c2.1 2.1 5 3.3 7.9 3.3h324.2c4.7 0 7.1-5.7 3.7-9l-64.6-64z" />
                  </svg>
                ) : selectedCurrency === 'USDC' ? (
                  <svg className="h-16 w-16 text-blue-500 mb-3" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000z"/>
                    <path fill="white" d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 120.83-137.5 120.83c-108.34 0-145.84-45.83-158.34-108.33-4.16-16.67-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.16c16.66 104.17 83.33 179.17 220.83 200v100c0 16.67 12.5 29.17 33.34 33.34h62.5c16.66 0 29.16-12.5 33.33-33.34v-100c125-20.83 208.33-108.33 208.33-220.83z"/>
                    <path fill="white" d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zM1229.17 295.83c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z"/>
                  </svg>
                ) : (
                  <Coins className="h-16 w-16 text-primary mb-3" />
                )}
                
                <div className="text-center">
                  <p className="text-lg font-medium text-muted-foreground">Send exactly</p>
                  <p className="text-3xl font-bold text-primary bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                    {formatCryptoAmount(paymentAmount!, selectedCurrency)}
                  </p>
                  <div className="flex items-center justify-center mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full border ${
                      selectedCurrency === 'BTC' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      selectedCurrency === 'ETH' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      selectedCurrency === 'MATIC' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      selectedCurrency === 'SOL' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {selectedCurrencyDetails?.network || 'Network'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">To this address:</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-1"
                    onClick={() => paymentAddress && copyToClipboard(paymentAddress)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </Button>
                </div>
                <div className="p-3 bg-muted/70 rounded-md font-mono text-xs break-all border border-muted-foreground/10">
                  {paymentAddress || 'Generating address...'}
                </div>
              </div>
              
              <Alert className="mt-5 bg-amber-50 text-amber-800 border-amber-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Send only {selectedCurrencyDetails?.name || selectedCurrency} on the {selectedCurrencyDetails?.network || 'correct'} network. 
                  Sending other tokens may result in permanent loss.
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
          <div className="space-y-6">
            <div className="rounded-lg border p-6 bg-gradient-to-b from-white to-blue-50">
              <div className="flex flex-col items-center text-center space-y-4 py-6">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-blue-400 to-indigo-500 p-4 rounded-full shadow-md">
                    <Loader2 className="h-12 w-12 animate-spin text-white" />
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Verifying Your Payment
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mt-2">
                    We're confirming your transaction on the blockchain network. This may take a moment depending on network conditions.
                  </p>
                </div>
              </div>
            </div>
            
            {transactionHash && (
              <div className="space-y-2 border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Transaction Hash</p>
                </div>
                <div className="p-3 bg-white rounded-md font-mono text-xs break-all border border-muted">
                  {transactionHash}
                </div>
                <p className="text-xs text-muted-foreground italic">You can use this hash to verify the transaction on a blockchain explorer</p>
              </div>
            )}
          </div>
        );
        
      case "paymentConfirmed":
        return (
          <div className="space-y-5">
            <div className="rounded-lg border-2 border-green-200 p-6 bg-gradient-to-br from-green-50 to-green-100/50">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-full shadow-sm">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Payment Confirmed
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Your cryptocurrency payment has been successfully verified on the blockchain. Thank you for your purchase!
                  </p>
                </div>
              </div>
            </div>
            
            {mintNFT && (
              <div className="rounded-lg border-2 border-indigo-200 p-6 bg-gradient-to-br from-blue-50 to-indigo-50/50">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-full shadow-sm mt-0.5">
                    <BadgeCheck className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {NFT_RECEIPT_TIERS[nftTier].name} NFT Receipt Being Minted
                    </h3>
                    <p className="text-sm text-indigo-700 mt-1">
                      Your blockchain-verified {NFT_RECEIPT_TIERS[nftTier].name.toLowerCase()} NFT receipt is now being minted. This creates a permanent, tamper-proof record of your purchase that you'll be able to access anytime.
                      {NFT_RECEIPT_TIERS[nftTier].appleWalletSupport && (
                        <span className="block mt-1 text-green-600 flex items-center">
                          <Smartphone className="h-3 w-3 mr-1" />
                          Includes Apple Watch/iPhone wallet integration
                        </span>
                      )}
                    </p>
                    <div className="mt-3 flex items-center text-xs text-indigo-600">
                      <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                      This process typically takes 1-3 minutes to complete
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {mintNFT && checkoutState === "paymentConfirmed" && (
              <div className="space-y-2 border rounded-lg p-4 bg-white">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-indigo-600" />
                  <p className="text-sm font-medium text-indigo-700">NFT Receipt Details</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-md text-xs border border-indigo-100">
                  <div className="font-medium text-indigo-700">NFT Receipt Tier: <span className="text-indigo-800">{NFT_RECEIPT_TIERS[nftTier].name}</span></div>
                  <div className="mt-1 text-indigo-700">Fee: <span className="font-medium">${NFT_RECEIPT_TIERS[nftTier].price.toFixed(2)}</span></div>
                  <div className="mt-1 text-indigo-700">Style: <span className="font-medium capitalize">{nftTheme}</span></div>
                  {NFT_RECEIPT_TIERS[nftTier].appleWalletSupport && (
                    <div className="mt-2 text-green-600 flex items-center">
                      <Smartphone className="h-3 w-3 mr-1" />
                      <span className="font-medium">Apple Watch/iPhone wallet integration included</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {transactionHash && (
              <div className="space-y-2 border rounded-lg p-4 bg-white">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <p className="text-sm font-medium text-green-700">Blockchain Transaction Record</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-md font-mono text-xs break-all border border-green-100">
                  {transactionHash}
                </div>
                <div className="flex items-center gap-2 text-xs text-green-600">
                  <Search className="h-3 w-3" />
                  <span>This transaction hash is your proof of payment on the blockchain</span>
                </div>
              </div>
            )}
          </div>
        );
        
      case "error":
        return (
          <div className="space-y-5">
            <div className="rounded-lg border-2 border-red-200 p-6 bg-gradient-to-br from-red-50 to-red-100/50">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-full shadow-sm">
                  <AlertCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                    Payment Error
                  </h3>
                  <p className="text-sm text-red-700 mt-1">
                    {error || "An unexpected error occurred while processing your cryptocurrency payment."}
                  </p>
                  <p className="text-xs text-red-600 mt-3">
                    This could be due to network issues or insufficient funds in your wallet.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                className="px-8 py-6 rounded-lg border-2 border-primary/30 hover:bg-primary/5 transition-all"
                onClick={() => {
                  setCheckoutState("initial");
                  setError(null);
                  createCryptoPayment();
                }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-base font-medium">Try Again</span>
                  <span className="text-xs text-muted-foreground mt-1">Return to payment selection</span>
                </div>
              </Button>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card className="w-full">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="flex flex-row gap-1 px-2 py-1 bg-white/50 rounded-full border border-gray-100">
              {availableCurrencies.length > 0 ? (
                <>
                  {availableCurrencies.some(c => c.code === 'BTC') && (
                    <Bitcoin className="h-5 w-5 text-amber-500" />
                  )}
                  {availableCurrencies.some(c => c.code === 'ETH') && (
                    <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                      <path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
                    </svg>
                  )}
                  {availableCurrencies.some(c => c.code === 'MATIC') && (
                    <svg className="h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.4 33.5">
                      <path fill="currentColor" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3 c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7 c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1 L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
                    </svg>
                  )}
                </>
              ) : (
                <>
                  <Bitcoin className="h-5 w-5 text-amber-500" />
                  <Coins className="h-5 w-5 text-blue-500" />
                </>
              )}
            </div>
            <div>
              <CardTitle className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Multi-Chain Crypto Checkout</CardTitle>
              <CardDescription>Pay with any supported cryptocurrency across multiple blockchains</CardDescription>
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
                {selectedCurrency === 'BTC' && <Bitcoin className="h-3.5 w-3.5 text-amber-500" />}
                {selectedCurrency === 'ETH' && (
                  <svg className="h-3.5 w-3.5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
                  </svg>
                )}
                {selectedCurrency === 'MATIC' && (
                  <svg className="h-3.5 w-3.5 text-purple-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38.4 33.5">
                    <path fill="currentColor" d="M29,10.2c-0.7-0.4-1.6-0.4-2.4,0L21,13.5l-3.8,2.1l-5.5,3.3c-0.7,0.4-1.6,0.4-2.4,0L5,16.3 c-0.7-0.4-1.2-1.2-1.2-2.1v-5c0-0.8,0.4-1.6,1.2-2.1l4.3-2.5c0.7-0.4,1.6-0.4,2.4,0L16,7.2c0.7,0.4,1.2,1.2,1.2,2.1v3.3l3.8-2.2V7 c0-0.8-0.4-1.6-1.2-2.1l-8-4.7c-0.7-0.4-1.6-0.4-2.4,0L1.2,5C0.4,5.4,0,6.2,0,7v9.4c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l5.5-3.2l3.8-2.2l5.5-3.2c0.7-0.4,1.6-0.4,2.4,0l4.3,2.5c0.7,0.4,1.2,1.2,1.2,2.1v5c0,0.8-0.4,1.6-1.2,2.1 L29,28.8c-0.7,0.4-1.6,0.4-2.4,0l-4.3-2.5c-0.7-0.4-1.2-1.2-1.2-2.1V21l-3.8,2.2v3.3c0,0.8,0.4,1.6,1.2,2.1l8.1,4.7 c0.7,0.4,1.6,0.4,2.4,0l8.1-4.7c0.7-0.4,1.2-1.2,1.2-2.1V17c0-0.8-0.4-1.6-1.2-2.1L29,10.2z"/>
                  </svg>
                )}
                {selectedCurrency === 'SOL' && (
                  <svg className="h-3.5 w-3.5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397.7 311.7">
                    <path fill="currentColor" d="M64.6,237.9c2.4-2.4,5.7-3.8,9.2-3.8h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5 c-5.8,0-8.7-7-4.6-11.1L64.6,237.9z"/>
                    <path fill="currentColor" d="M64.6,3.8C67.1,1.4,70.4,0,73.8,0h317.4c5.8,0,8.7,7,4.6,11.1l-62.7,62.7c-2.4,2.4-5.7,3.8-9.2,3.8H6.5 c-5.8,0-8.7-7-4.6-11.1L64.6,3.8z"/>
                    <path fill="currentColor" d="M333.1,120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8,0-8.7,7-4.6,11.1l62.7,62.7c2.4,2.4,5.7,3.8,9.2,3.8h317.4 c5.8,0,8.7-7,4.6-11.1L333.1,120.1z"/>
                  </svg>
                )}
                {selectedCurrency === 'USDC' && (
                  <svg className="h-3.5 w-3.5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000">
                    <path fill="currentColor" d="M1000,0c552.3,0,1000,447.7,1000,1000s-447.7,1000-1000,1000S0,1552.3,0,1000S447.7,0,1000,0z"/>
                    <path fill="white" d="M1275,1158.3c0-145-87.5-241.7-262.5-266.7V750h-125v141.7c-31.3,0-64.5,0-125,0v-141.7h-125v141.7 c-108.3,0-125,0-125,0v125c0,0,62.5,0,116.7,0c31.3,0,41.7,18.8,41.7,31.3v250c0,0-20.8,125-125,125v125c108.3,0,125,0,125,0 v141.7h125v-141.7h125v141.7h125v-141.7c175-25,262.5-125,262.5-270.8v-145.8H1275z M1150,1304.2c0,83.3-87.5,125-175,125v-250 C1062.5,1179.2,1150,1220.8,1150,1304.2z M887.5,1179.2v-250c-87.5,0-175,41.7-175,125C712.5,1137.5,800,1179.2,887.5,1179.2z"/>
                  </svg>
                )}
                {!['BTC', 'ETH', 'MATIC', 'SOL', 'USDC'].includes(selectedCurrency) && (
                  <Coins className="h-3.5 w-3.5" />
                )}
                {selectedCurrency}
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
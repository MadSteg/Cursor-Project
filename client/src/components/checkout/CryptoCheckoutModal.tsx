import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'wouter';
import { queryClient } from "@/lib/queryClient";

interface CryptoPaymentInfo {
  id: string;
  amount: string;
  walletAddress: string;
  currency: string;
  paymentState: 'pending' | 'confirmed' | 'failed';
  expiresAt: string;
}

interface CryptoCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  merchantId: string;
  merchantName: string;
  price: number;
  availableCurrencies: string[];
  onCompleted?: (receiptId: number) => void;
}

export default function CryptoCheckoutModal({
  open,
  onOpenChange,
  productId,
  productName,
  merchantId,
  merchantName,
  price,
  availableCurrencies,
  onCompleted
}: CryptoCheckoutModalProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>(availableCurrencies[0] || 'MATIC');
  const [paymentInfo, setPaymentInfo] = useState<CryptoPaymentInfo | null>(null);
  const [step, setStep] = useState<'select' | 'pay' | 'confirm' | 'receipt'>('select');
  const [timer, setTimer] = useState<number>(300); // 5 minute countdown
  const [nftTier, setNftTier] = useState<'standard' | 'premium' | 'luxury'>('standard');
  const [processing, setProcessing] = useState<boolean>(false);
  const [receiptId, setReceiptId] = useState<number | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (open) {
      setStep('select');
      setSelectedCurrency(availableCurrencies[0] || 'MATIC');
      setPaymentInfo(null);
      setTimer(300);
      setProcessing(false);
      setReceiptId(null);
    }
  }, [open, availableCurrencies]);
  
  // Handle timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (step === 'pay' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    
    if (timer === 0 && step === 'pay') {
      // Payment expired
      toast({
        title: "Payment Expired",
        description: "The payment time has expired. Please try again.",
        variant: "destructive",
      });
      handleCloseModal();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timer, toast]);
  
  // Format time remaining
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Step 1: Initialize a crypto payment
  const handleInitiatePayment = useCallback(async () => {
    try {
      setProcessing(true);
      
      // API call to create a crypto payment
      const response = await fetch('/api/payments/crypto/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          amount: price,
          currency: selectedCurrency,
          walletAddress: walletAddress || undefined, // Optional wallet address
          nftTier,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment');
      }
      
      const data = await response.json();
      setPaymentInfo(data);
      setStep('pay');
    } catch (error) {
      toast({
        title: 'Payment Initialization Failed',
        description: error instanceof Error ? error.message : 'Failed to create payment',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  }, [productId, price, selectedCurrency, nftTier, walletAddress, toast]);
  
  // Step 2: Check payment status
  const checkPaymentStatus = useCallback(async () => {
    if (!paymentInfo?.id) return;
    
    try {
      setProcessing(true);
      
      // API call to check payment status
      const response = await fetch(`/api/payments/crypto/${paymentInfo.id}/status`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check payment status');
      }
      
      const data = await response.json();
      
      if (data.status === 'confirmed') {
        setStep('confirm');
        // Once payment is confirmed, create NFT receipt
        await createNFTReceipt(data.transactionHash);
      } else if (data.status === 'failed') {
        toast({
          title: 'Payment Failed',
          description: 'The payment could not be processed. Please try again.',
          variant: 'destructive',
        });
        setStep('select');
      }
    } catch (error) {
      toast({
        title: 'Status Check Failed',
        description: error instanceof Error ? error.message : 'Failed to check payment status',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  }, [paymentInfo, toast]);
  
  // Step 3: Create NFT receipt after payment confirmation
  const createNFTReceipt = async (transactionHash: string) => {
    try {
      setProcessing(true);
      
      // API call to create NFT receipt
      const response = await fetch('/api/nft-receipts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          productName,
          merchantId,
          merchantName,
          amount: price,
          tier: nftTier,
          transactionHash,
          paymentMethod: 'crypto',
          currency: selectedCurrency,
          email: email || undefined, // Optional email for receipt
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create NFT receipt');
      }
      
      const data = await response.json();
      setReceiptId(data.receiptId);
      setStep('receipt');
      
      // Send receipt email if email is provided
      if (email) {
        await sendReceiptEmail(data.receiptId);
      }
      
      // Invalidate any relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/receipts'] });
      
      if (onCompleted) {
        onCompleted(data.receiptId);
      }
    } catch (error) {
      toast({
        title: 'NFT Receipt Creation Failed',
        description: error instanceof Error ? error.message : 'Failed to create NFT receipt',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };
  
  // Send receipt email
  const sendReceiptEmail = async (receiptId: number) => {
    if (!email) return;
    
    try {
      const response = await fetch('/api/email/send-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiptId,
          email,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send receipt email');
      }
    } catch (error) {
      console.error('Failed to send receipt email:', error);
      // Don't show a toast for email failures as it's not critical
    }
  };
  
  // View receipt
  const handleViewReceipt = () => {
    if (receiptId) {
      setLocation(`/nft-receipts/${receiptId}`);
      handleCloseModal();
    }
  };
  
  // Close modal
  const handleCloseModal = () => {
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'select' && 'Crypto Payment'}
            {step === 'pay' && 'Make Payment'}
            {step === 'confirm' && 'Confirming Payment'}
            {step === 'receipt' && 'Payment Successful'}
          </DialogTitle>
          <DialogDescription>
            {step === 'select' && 'Select cryptocurrency and receipt options'}
            {step === 'pay' && 'Please send the exact amount to complete your purchase'}
            {step === 'confirm' && 'Your payment is being confirmed on the blockchain'}
            {step === 'receipt' && 'Your NFT receipt has been created'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Step 1: Select Currency and Options */}
          {step === 'select' && (
            <>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Product Details</h4>
                <div className="rounded border p-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Product:</span>
                    <span className="text-sm font-medium">{productName}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-muted-foreground">Merchant:</span>
                    <span className="text-sm">{merchantName}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-muted-foreground">Price:</span>
                    <span className="text-sm font-medium">${price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cryptocurrency">Select Cryptocurrency</Label>
                <Select 
                  value={selectedCurrency} 
                  onValueChange={setSelectedCurrency}
                >
                  <SelectTrigger id="cryptocurrency">
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCurrencies.map((currency) => (
                      <SelectItem key={currency} value={currency}>
                        {currency}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nftTier">NFT Receipt Tier</Label>
                <Select 
                  value={nftTier} 
                  onValueChange={(value: any) => setNftTier(value)}
                >
                  <SelectTrigger id="nftTier">
                    <SelectValue placeholder="Select NFT tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">
                      Standard - Basic receipt ($0.01)
                    </SelectItem>
                    <SelectItem value="premium">
                      Premium - Enhanced receipt with perks ($0.01)
                    </SelectItem>
                    <SelectItem value="luxury">
                      Luxury - Animated receipt with exclusive benefits ($0.01)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wallet">Your Wallet Address (Optional)</Label>
                <input
                  id="wallet"
                  placeholder="0x..."
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email for Receipt (Optional)</Label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </>
          )}
          
          {/* Step 2: Payment Information */}
          {step === 'pay' && paymentInfo && (
            <>
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-secondary">
                  <div className="text-center mb-4">
                    <span className="text-sm text-muted-foreground">Send exactly</span>
                    <div className="text-2xl font-bold">{paymentInfo.amount} {paymentInfo.currency}</div>
                    <span className="text-sm text-muted-foreground">to</span>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="bg-muted p-3 rounded text-sm break-all">
                      {paymentInfo.walletAddress}
                    </div>
                    <button
                      className="text-xs text-muted-foreground hover:text-primary mt-1"
                      onClick={() => {
                        navigator.clipboard.writeText(paymentInfo.walletAddress);
                        toast({
                          title: "Address Copied",
                          description: "The wallet address has been copied to your clipboard.",
                        });
                      }}
                    >
                      Copy Address
                    </button>
                  </div>
                  
                  <div className="text-center text-sm">
                    <div className="mb-2">Time remaining: <span className="font-medium">{formatTimeRemaining()}</span></div>
                    <Progress value={(timer / 300) * 100} />
                  </div>
                </div>
                
                <div className="text-center text-sm">
                  <p>After sending the payment, click "Check Payment Status" below.</p>
                </div>
                
                <div className="text-center">
                  <Button 
                    onClick={checkPaymentStatus} 
                    disabled={processing}
                    className="w-full"
                  >
                    {processing ? 'Checking...' : 'Check Payment Status'}
                  </Button>
                </div>
              </div>
            </>
          )}
          
          {/* Step 3: Confirming Payment */}
          {step === 'confirm' && (
            <div className="text-center space-y-4">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-sm">
                Your payment has been received and we're confirming it on the blockchain. 
                This might take a minute...
              </p>
            </div>
          )}
          
          {/* Step 4: Receipt Created */}
          {step === 'receipt' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Purchase Complete!</h3>
                <p className="text-sm text-muted-foreground">
                  Your NFT receipt has been created and is now available in your account.
                </p>
              </div>
              
              {email && (
                <p className="text-sm">
                  A confirmation email has been sent to <span className="font-medium">{email}</span>
                </p>
              )}
              
              <div className="rounded-md border p-4">
                <div className="text-sm">
                  <div className="font-medium">Receipt #{receiptId}</div>
                  <div>{productName}</div>
                  <div className="text-muted-foreground">Purchased from {merchantName}</div>
                  <div className="mt-2 flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">${price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          {step === 'select' && (
            <>
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleInitiatePayment} disabled={processing}>
                {processing ? 'Creating Payment...' : 'Continue to Payment'}
              </Button>
            </>
          )}
          
          {step === 'pay' && (
            <Button variant="outline" onClick={handleCloseModal} className="w-full">
              Cancel Payment
            </Button>
          )}
          
          {step === 'receipt' && (
            <>
              <Button variant="outline" onClick={handleCloseModal}>
                Close
              </Button>
              <Button onClick={handleViewReceipt}>
                View NFT Receipt
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
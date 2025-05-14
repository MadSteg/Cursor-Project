/**
 * Encrypted Checkout Component
 * 
 * This component provides a checkout experience with threshold encryption
 * to enhance privacy and security for blockchain receipts.
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Lock, Shield, CreditCard, Receipt } from 'lucide-react';
import { tacoThresholdCrypto } from '../../lib/thresholdCrypto';
import MobileWalletPreview from './MobileWalletPreview';

// Mock user ID for demo purposes
const DEMO_USER_ID = 1;

interface EncryptedCheckoutProps {
  amount: number;
  receiptId?: number;
  onPaymentComplete?: (paymentId: string) => void;
}

export function EncryptedCheckout({ amount, receiptId, onPaymentComplete }: EncryptedCheckoutProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [addNFT, setAddNFT] = useState(true);
  const [nftId, setNftId] = useState<string | null>(null);
  const [nftPrice, setNftPrice] = useState(0.99);
  const [cardDetails, setCardDetails] = useState({
    number: '4242 4242 4242 4242',
    expiry: '12/25',
    cvc: '123',
    name: 'Demo Customer'
  });
  const [encryptionLevel, setEncryptionLevel] = useState<'standard' | 'enhanced'>('enhanced');
  const [walletTheme, setWalletTheme] = useState<'default' | 'luxury' | 'minimal'>('default');
  const [encryptedData, setEncryptedData] = useState<string | null>(null);
  const [sharedKey, setSharedKey] = useState<string | null>(null);

  // Process payment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get or generate user keys
      // Get user's encryption keys from the server
      const response = await fetch('/api/encryption-keys');
      const keys = await response.json();
      const userKeys = keys.filter(key => key.keyType === 'taco-threshold');
      
      // If no keys found, we'll need to create one
      if (userKeys.length === 0) {
        console.log("No Taco encryption keys found, using mock mode");
      }
      
      // Create receipt data to encrypt
      const receiptData = JSON.stringify({
        merchant: "Memory Chain Store",
        amount: addNFT ? (amount + nftPrice).toFixed(2) : amount.toFixed(2),
        date: new Date().toISOString(),
        paymentMethod: paymentMethod,
        items: [
          { name: "Premium Product", price: amount.toFixed(2), quantity: 1 }
        ],
        ...(addNFT && { nftReceipt: true })
      });
      
      // Encrypt the receipt data using threshold encryption
      let encrypted = '';
      let sharedKeyData = '';
      
      // For demonstration purposes, we'll create a mock encrypted receipt using Taco
      if (userKeys && userKeys.length > 0) {
        try {
          // Use the first Taco key to encrypt the receipt data
          encrypted = await tacoThresholdCrypto.encrypt(
            receiptData, 
            userKeys[0].publicKey
          );
          sharedKeyData = 'taco-threshold-shared-key-' + Date.now();
          console.log("Receipt encrypted with Taco threshold encryption");
        } catch (error) {
          console.error("Failed to encrypt with Taco:", error);
          // Fallback to mock data
          encrypted = `mock-encrypted-data-${Date.now()}`;
          sharedKeyData = `mock-shared-key-${Date.now()}`;
        }
      } else {
        console.log("Using mock encryption mode - no Taco keys available");
        encrypted = `mock-encrypted-data-${Date.now()}`;
        sharedKeyData = `mock-shared-key-${Date.now()}`;
      }
      
      setEncryptedData(encrypted);
      if (sharedKeyData) {
        setSharedKey(sharedKeyData);
      }
      
      // Simulate payment processing delay
      setTimeout(() => {
        // Mock successful payment
        const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 15)}`;
        setPaymentId(mockPaymentId);
        setSuccess(true);
        setLoading(false);
        
        if (addNFT) {
          // Mock NFT generation
          const mockNftId = `nft_${Math.random().toString(36).substring(2, 10)}`;
          setNftId(mockNftId);
        }
        
        // Notify parent component if callback provided
        if (onPaymentComplete) {
          onPaymentComplete(mockPaymentId);
        }
        
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed securely with threshold encryption.",
          variant: "default",
        });
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error);
      setLoading(false);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {!success ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5 text-blue-500" />
              Encrypted Checkout
            </CardTitle>
            <CardDescription>
              Your payment and receipt data will be encrypted using threshold proxy re-encryption.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Payment Method</h3>
                <RadioGroup 
                  defaultValue="card" 
                  onValueChange={setPaymentMethod} 
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Credit Card
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber" 
                        value={cardDetails.number} 
                        readOnly 
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        value={cardDetails.expiry} 
                        readOnly 
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input 
                        id="cvc" 
                        value={cardDetails.cvc} 
                        readOnly 
                        className="bg-gray-50"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="name">Name on Card</Label>
                      <Input 
                        id="name" 
                        value={cardDetails.name} 
                        readOnly 
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>This is a demo. No real payment will be processed.</p>
                  </div>
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox 
                    id="addNFT" 
                    checked={addNFT} 
                    onCheckedChange={(checked) => setAddNFT(checked as boolean)}
                  />
                  <Label htmlFor="addNFT" className="text-sm">
                    Add blockchain NFT receipt (+${nftPrice.toFixed(2)})
                  </Label>
                </div>
                
                {addNFT && (
                  <div className="ml-6 space-y-3">
                    <Tabs defaultValue="enhanced">
                      <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger 
                          value="standard" 
                          onClick={() => setEncryptionLevel('standard')}
                        >
                          Standard
                        </TabsTrigger>
                        <TabsTrigger 
                          value="enhanced" 
                          onClick={() => setEncryptionLevel('enhanced')}
                        >
                          Enhanced Security
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="standard" className="space-y-2">
                        <div className="text-sm">
                          <p className="font-medium">Standard NFT Receipt</p>
                          <p className="text-muted-foreground text-xs">
                            Basic blockchain verification for your purchase record.
                          </p>
                        </div>
                      </TabsContent>
                      <TabsContent value="enhanced" className="space-y-2">
                        <div className="text-sm">
                          <p className="font-medium flex items-center">
                            <Shield className="h-4 w-4 mr-1 text-blue-500" />
                            Enhanced Security
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Adds threshold encryption for privacy and selective sharing.
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Receipt Theme</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <Button 
                          type="button" 
                          variant={walletTheme === 'default' ? 'default' : 'outline'} 
                          size="sm" 
                          onClick={() => setWalletTheme('default')}
                          className="h-auto py-1"
                        >
                          Default
                        </Button>
                        <Button 
                          type="button" 
                          variant={walletTheme === 'luxury' ? 'default' : 'outline'} 
                          size="sm" 
                          onClick={() => setWalletTheme('luxury')}
                          className="h-auto py-1"
                        >
                          Luxury
                        </Button>
                        <Button 
                          type="button" 
                          variant={walletTheme === 'minimal' ? 'default' : 'outline'} 
                          size="sm" 
                          onClick={() => setWalletTheme('minimal')}
                          className="h-auto py-1"
                        >
                          Minimal
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
                {addNFT && (
                  <div className="flex justify-between text-sm mt-1">
                    <span>NFT Receipt</span>
                    <span>${nftPrice.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t my-2"></div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${addNFT ? (amount + nftPrice).toFixed(2) : amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? "Processing..." : `Pay $${addNFT ? (amount + nftPrice).toFixed(2) : amount.toFixed(2)}`}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <Card>
          <CardHeader className="bg-green-50 border-b border-green-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-700 flex items-center">
                <div className="bg-green-100 rounded-full p-1 mr-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3337 4.5L6.00033 11.8333L2.66699 8.5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                Payment Successful
              </CardTitle>
              <span className="text-sm text-green-700 font-medium">
                ${addNFT ? (amount + nftPrice).toFixed(2) : amount.toFixed(2)}
              </span>
            </div>
            <CardDescription className="text-green-600">
              Your encrypted receipt has been generated
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-1 mt-0.5 flex-shrink-0">
                  <Lock className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Encrypted with Threshold Cryptography</h3>
                  <p className="text-muted-foreground text-xs">
                    Your receipt data is securely encrypted and stored on the blockchain
                  </p>
                </div>
              </div>
              
              <div className="border rounded-md p-3 bg-gray-50">
                <h4 className="text-xs font-medium mb-1">Payment Details</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment ID</span>
                    <span className="font-mono text-xs">{paymentId}</span>
                  </div>
                  {nftId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">NFT Receipt ID</span>
                      <span className="font-mono text-xs">{nftId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Receipt Preview</h3>
                <MobileWalletPreview 
                  merchant="Memory Chain Store"
                  amount={addNFT ? amount + nftPrice : amount}
                  date={new Date()}
                  theme={walletTheme}
                  nftTokenId={nftId || undefined}
                  encrypted={encryptionLevel === 'enhanced'}
                  encryptedData={encryptedData || undefined}
                  sharedKey={sharedKey || undefined}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-end sm:space-y-0 sm:space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
            >
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
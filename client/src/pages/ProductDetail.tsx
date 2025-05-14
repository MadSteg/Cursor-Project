import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { NFTReceiptTier, calculateNFTReceiptPrice, calculateTotalPrice, type Product } from "@shared/products";
import CryptoCheckoutModal from "@/components/checkout/CryptoCheckoutModal";

export default function ProductDetail() {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedTier, setSelectedTier] = useState<string>(NFTReceiptTier.STANDARD);
  const [walletAddress, setWalletAddress] = useState("");
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCryptoCheckout, setShowCryptoCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'card'>('crypto');
  const [createdReceiptId, setCreatedReceiptId] = useState<number | null>(null);

  // Fetch product detail
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: [`/api/products/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return response.json();
    }
  });

  // Fetch merchant info
  const { data: merchant, isLoading: merchantLoading } = useQuery({
    queryKey: [`/api/products/${id}/merchant`],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}/merchant`);
      if (!response.ok) {
        throw new Error('Failed to fetch merchant information');
      }
      return response.json();
    },
    enabled: !!product
  });

  // Fetch related products
  const { data: relatedProducts } = useQuery({
    queryKey: [`/api/products/${id}/related`],
    queryFn: async () => {
      const response = await fetch(`/api/products/${id}/related`);
      if (!response.ok) {
        throw new Error('Failed to fetch related products');
      }
      return response.json();
    },
    enabled: !!product
  });

  // Mutation for creating NFT receipt
  const createReceipt = useMutation({
    mutationFn: async ({ productId, customerWalletAddress, tier }: { 
      productId: string; 
      customerWalletAddress: string; 
      tier: string;
    }) => {
      const response = await fetch('/api/nft-receipts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          customerWalletAddress,
          tier,
          paymentMethod: 'crypto',
          paymentId: `payment-${Date.now()}`
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create NFT receipt');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setCreatedReceiptId(data.receiptId);
      setShowConfirmation(true);
      toast({
        title: "NFT Receipt Created!",
        description: `Successfully minted NFT receipt #${data.receiptId} with ${selectedTier} tier.`,
      });
      queryClient.invalidateQueries({ queryKey: [`/api/nft-receipts/by-wallet/${walletAddress}`] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Create Receipt",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle purchase initiation
  const handlePurchase = () => {
    if (!product) return;
    
    if (paymentMethod === 'crypto') {
      setShowCryptoCheckout(true);
    } else {
      // For card payments, we still need a wallet for NFT delivery
      if (!walletAddress) {
        setShowWalletDialog(true);
        return;
      }
      
      createReceipt.mutate({
        productId: product.id,
        customerWalletAddress: walletAddress,
        tier: selectedTier
      });
    }
  };
  
  // Handle crypto payment success
  const handleCryptoPaymentSuccess = (data: {
    receiptId: number;
    deliveryEmail?: string;
    deliveryWallet: string;
    deliveryPreference: 'email' | 'wallet' | 'both';
  }) => {
    setCreatedReceiptId(data.receiptId);
    setWalletAddress(data.deliveryWallet);
    
    // Create receipt in system
    if (product) {
      createReceipt.mutate({
        productId: product.id,
        customerWalletAddress: data.deliveryWallet,
        tier: selectedTier
      }, {
        onSuccess: () => {
          // Use the provided receipt ID
          setCreatedReceiptId(data.receiptId);
          
          // Show confirmation
          setShowConfirmation(true);
          
          // Send email if needed
          if (data.deliveryEmail && (data.deliveryPreference === 'email' || data.deliveryPreference === 'both')) {
            // Call email delivery endpoint here if needed
            console.log(`Sending email summary to ${data.deliveryEmail}`);
          }
        }
      });
    }
  };

  // Handle wallet connection
  const handleConnectWallet = () => {
    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast({
        title: "Invalid Wallet Address",
        description: "Please enter a valid Ethereum wallet address",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Wallet Connected",
      description: `Connected to wallet: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
    });
    
    setShowWalletDialog(false);
    
    // Initiate purchase flow
    handlePurchase();
  };

  const isLoading = productLoading || merchantLoading;

  if (isLoading) {
    return (
      <main className="container py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-1/3 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-square bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-muted rounded"></div>
              <div className="h-6 w-1/2 bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-2/3 bg-muted rounded"></div>
              <div className="h-10 w-1/3 bg-muted rounded mt-6"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container py-10">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or may have been removed.</p>
          <Button onClick={() => setLocation("/products")}>
            Back to Products
          </Button>
        </div>
      </main>
    );
  }

  const receiptPrice = calculateNFTReceiptPrice(product, selectedTier as any);
  const totalPrice = calculateTotalPrice(product, selectedTier as any);
  
  return (
    <main className="container py-10">
      <Button 
        variant="ghost" 
        onClick={() => setLocation("/products")}
        className="mb-6"
      >
        ← Back to Products
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="aspect-square bg-muted rounded-lg overflow-hidden border">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/600x600?text=Product';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground">No image available</span>
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="capitalize">{product.category}</Badge>
            <Badge variant="outline" className="capitalize">{merchant?.name || 'Unknown Merchant'}</Badge>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="text-2xl font-semibold text-primary mb-4">
            ${product.price.toFixed(2)}
          </div>
          
          <p className="text-muted-foreground mb-6">{product.description}</p>
          
          <div className="border rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">NFT Receipt Options</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get a blockchain-verified NFT receipt with your purchase for enhanced security and proof of ownership.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="tier-select" className="text-sm font-medium block mb-1.5">
                  Select NFT Receipt Tier
                </label>
                <Select value={selectedTier} onValueChange={setSelectedTier}>
                  <SelectTrigger id="tier-select">
                    <SelectValue placeholder="Select Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.nftReceipt.availableTiers.map((tier: any) => (
                      <SelectItem key={tier} value={tier}>
                        {tier.charAt(0).toUpperCase() + tier.slice(1)} (${calculateNFTReceiptPrice(product, tier).toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Product Price:</span>
                <span>${product.price.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>NFT Receipt ({selectedTier}):</span>
                <span>${receiptPrice.toFixed(2)}</span>
              </div>
              
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-3">Payment Method</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={paymentMethod === 'crypto' ? 'default' : 'outline'}
                  className="flex items-center justify-center gap-1"
                  onClick={() => setPaymentMethod('crypto')}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 4.5H15M12 4.5V19.5M12 19.5H7.5M12 19.5H16.5M4.5 9H19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Cryptocurrency
                </Button>
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  className="flex items-center justify-center gap-1"
                  onClick={() => setPaymentMethod('card')}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 10H2M2 8.2L2 15.8C2 16.9201 2 17.4802 2.21799 17.908C2.40973 18.2843 2.71569 18.5903 3.09202 18.782C3.51984 19 4.07989 19 5.2 19L18.8 19C19.9201 19 20.4802 19 20.908 18.782C21.2843 18.5903 21.5903 18.2843 21.782 17.908C22 17.4802 22 16.9201 22 15.8V8.2C22 7.0799 22 6.51984 21.782 6.09202C21.5903 5.7157 21.2843 5.40974 20.908 5.21799C20.4802 5 19.9201 5 18.8 5L5.2 5C4.0799 5 3.51984 5 3.09202 5.21799C2.7157 5.40973 2.40974 5.71569 2.21799 6.09202C2 6.51984 2 7.07989 2 8.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Credit Card
                </Button>
              </div>
            </div>
            
            <Button 
              className="w-full"
              size="lg"
              onClick={handlePurchase}
              disabled={createReceipt.isPending}
            >
              {createReceipt.isPending ? "Processing..." : 
                paymentMethod === 'crypto' ? "Pay with Cryptocurrency" : "Pay with Card"}
            </Button>
            
            {walletAddress && (
              <p className="text-sm text-center text-muted-foreground mt-2">
                Using wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <Tabs defaultValue="details" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="receipt-features">NFT Receipt Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="border rounded-lg p-6 mt-4">
          <h3 className="text-lg font-semibold mb-4">About this product</h3>
          <div className="text-muted-foreground">
            <p className="mb-4">{product.description}</p>
            <p>This product is sold by {merchant?.name}, who has been verified on our platform. Each purchase comes with the option for a blockchain-verified NFT receipt that provides proof of ownership and authenticity.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="specifications" className="border rounded-lg p-6 mt-4">
          <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(product.metadata).map(([key, value]) => {
              // Skip arrays or objects
              if (typeof value === 'object') return null;
              
              return (
                <div key={key} className="border-b pb-2">
                  <div className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  <div className="text-muted-foreground">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</div>
                </div>
              );
            })}
            
            <div className="border-b pb-2">
              <div className="text-sm font-medium">SKU</div>
              <div className="text-muted-foreground">{product.sku}</div>
            </div>
            
            {product.serialNumber && (
              <div className="border-b pb-2">
                <div className="text-sm font-medium">Serial Number</div>
                <div className="text-muted-foreground">{product.serialNumber}</div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="receipt-features" className="border rounded-lg p-6 mt-4">
          <h3 className="text-lg font-semibold mb-4">NFT Receipt Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Standard</CardTitle>
                <CardDescription>$0.01</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Basic blockchain verification</li>
                  <li>Proof of purchase</li>
                  <li>Basic product details</li>
                  <li>Transaction history</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={selectedTier === NFTReceiptTier.STANDARD ? "default" : "outline"} 
                  className="w-full"
                  onClick={() => setSelectedTier(NFTReceiptTier.STANDARD as string)}
                  disabled={!product.nftReceipt.availableTiers.includes(NFTReceiptTier.STANDARD)}
                >
                  {selectedTier === NFTReceiptTier.STANDARD ? "Selected" : "Select"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Premium</CardTitle>
                <CardDescription>$0.01</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Enhanced verification</li>
                  <li>Product specifications</li>
                  <li>Warranty information</li>
                  <li>High quality visual design</li>
                  <li>Transfer rights</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={selectedTier === NFTReceiptTier.PREMIUM ? "default" : "outline"} 
                  className="w-full"
                  onClick={() => setSelectedTier(NFTReceiptTier.PREMIUM as string)}
                  disabled={!product.nftReceipt.availableTiers.includes(NFTReceiptTier.PREMIUM)}
                >
                  {selectedTier === NFTReceiptTier.PREMIUM ? "Selected" : "Select"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Luxury</CardTitle>
                <CardDescription>$0.01</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>All Premium features</li>
                  <li>Animated visual design</li>
                  <li>Apple Wallet integration</li>
                  <li>VIP service access</li>
                  <li>Priority support</li>
                  <li>Exclusive merchant benefits</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant={selectedTier === NFTReceiptTier.LUXURY ? "default" : "outline"} 
                  className="w-full"
                  onClick={() => setSelectedTier(NFTReceiptTier.LUXURY as string)}
                  disabled={!product.nftReceipt.availableTiers.includes(NFTReceiptTier.LUXURY)}
                >
                  {selectedTier === NFTReceiptTier.LUXURY ? "Selected" : "Select"}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-6 text-sm text-muted-foreground">
            <p>All NFT receipts utilize Threshold Pre-Encryption (TPRE) technology via the Taco library to ensure your receipt data remains private and secure while still being blockchain-verified. Only you and authorized parties (like the merchant) can access the encrypted data.</p>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Related Products */}
      {relatedProducts && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          
          {relatedProducts.sameCategory && relatedProducts.sameCategory.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Similar Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProducts.sameCategory.map((relatedProduct: Product) => (
                  <Card 
                    key={relatedProduct.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setLocation(`/product/${relatedProduct.id}`)}
                  >
                    <div className="aspect-video bg-muted">
                      {relatedProduct.images && relatedProduct.images[0] ? (
                        <img
                          src={relatedProduct.images[0]}
                          alt={relatedProduct.name}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Product';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-3 pb-0">
                      <CardTitle className="text-base">{relatedProduct.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-1">
                      <p className="font-medium">${relatedProduct.price.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {relatedProducts.sameMerchant && relatedProducts.sameMerchant.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4">More from {merchant?.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {relatedProducts.sameMerchant.map((relatedProduct: Product) => (
                  <Card 
                    key={relatedProduct.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setLocation(`/product/${relatedProduct.id}`)}
                  >
                    <div className="aspect-video bg-muted">
                      {relatedProduct.images && relatedProduct.images[0] ? (
                        <img
                          src={relatedProduct.images[0]}
                          alt={relatedProduct.name}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Product';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-muted-foreground">No image</span>
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-3 pb-0">
                      <CardTitle className="text-base">{relatedProduct.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-1">
                      <p className="font-medium">${relatedProduct.price.toFixed(2)}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Connect Wallet Dialog */}
      <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Your Wallet</DialogTitle>
            <DialogDescription>
              Enter your wallet address to purchase this product with an NFT receipt.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-2">
              Enter your Ethereum wallet address to receive the NFT receipt.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWalletDialog(false)}>Cancel</Button>
            <Button onClick={handleConnectWallet}>Connect & Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Purchase Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Purchase Successful!</DialogTitle>
            <DialogDescription>
              Your NFT receipt has been created and will be transferred to your wallet.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="p-4 border rounded-lg bg-muted/50 text-center">
              <p className="text-sm text-muted-foreground">NFT Receipt ID</p>
              <p className="text-xl font-semibold mt-1">#{createdReceiptId}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Product:</span>
                <span className="text-sm font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Price:</span>
                <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">NFT Receipt ({selectedTier}):</span>
                <span className="text-sm font-medium">${receiptPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-sm font-medium">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setLocation(`/nft-receipts/${createdReceiptId}`)}>
              View Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Crypto Checkout Modal */}
      {product && (
        <CryptoCheckoutModal
          open={showCryptoCheckout}
          onClose={() => setShowCryptoCheckout(false)}
          onSuccess={handleCryptoPaymentSuccess}
          productName={product.name}
          productPrice={product.price}
          nftTier={selectedTier}
          nftPrice={calculateNFTReceiptPrice(product, selectedTier as any)}
          totalPrice={calculateTotalPrice(product, selectedTier as any)}
        />
      )}
    </main>
  );
}
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  ReceiptText, 
  Tag, 
  ShoppingBag, 
  Share2,
  Eye,
  ArrowLeft,
  LucideIcon,
  CircleAlertIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useWallet } from '@/contexts/WalletContext';
import NFTReceiptCard from '@/components/receipts/NFTReceiptCard';

export default function NFTReceiptDetail() {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { walletAddress, isConnected } = useWallet();
  const [activeTab, setActiveTab] = useState("overview");
  const [decryptedData, setDecryptedData] = useState<any>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showCouponDetails, setShowCouponDetails] = useState(false);
  const receiptId = id || '0';

  // Fetch receipt details
  const { data: receipt, isLoading, error } = useQuery({
    queryKey: [`/api/nfts/${receiptId}`],
    queryFn: async () => {
      if (!receiptId) return null;
      const response = await apiRequest('GET', `/api/nfts/${receiptId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch NFT receipt details');
      }
      return response.json();
    },
    enabled: !!receiptId
  });
  
  // Fetch coupons associated with this NFT
  const { data: coupons = [], isLoading: couponsLoading } = useQuery({
    queryKey: [`/api/nfts/${receiptId}/coupons`],
    queryFn: async () => {
      if (!receiptId) return [];
      const response = await apiRequest('GET', `/api/nfts/${receiptId}/coupons`);
      if (!response.ok) {
        console.error('Failed to fetch coupons');
        return [];
      }
      return response.json();
    },
    enabled: !!receiptId
  });
  
  // Mutation for decrypting metadata
  const decryptMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/nfts/${receiptId}/decrypt`, {
        walletAddress
      });
      if (!response.ok) {
        throw new Error('Failed to decrypt receipt metadata');
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.metadata) {
        setDecryptedData(data.metadata);
        toast({
          title: "Metadata Decrypted",
          description: "Receipt details have been successfully decrypted.",
        });
      } else {
        toast({
          title: "Decryption Failed",
          description: data.message || "Failed to decrypt receipt metadata.",
          variant: "destructive",
        });
      }
      setIsDecrypting(false);
    },
    onError: (error) => {
      toast({
        title: "Decryption Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
      setIsDecrypting(false);
    }
  });
  
  // Mutation for claiming a coupon
  const claimCouponMutation = useMutation({
    mutationFn: async (couponId: string) => {
      const response = await apiRequest('POST', `/api/coupons/claim/${couponId}`, {
        walletAddress,
        nftId: receiptId
      });
      if (!response.ok) {
        throw new Error('Failed to claim coupon');
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Coupon Claimed",
          description: data.message || "Coupon has been successfully claimed.",
        });
        // Invalidate coupons query to refresh the list
        queryClient.invalidateQueries({ queryKey: [`/api/nfts/${receiptId}/coupons`] });
      } else {
        toast({
          title: "Claim Failed",
          description: data.message || "Failed to claim coupon.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Claim Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  // Handle decrypt metadata
  const handleDecrypt = () => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to decrypt this metadata.",
        variant: "destructive",
      });
      return;
    }
    
    setIsDecrypting(true);
    decryptMutation.mutate();
  };
  
  // Handle claim coupon
  const handleClaimCoupon = (couponId: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to claim this coupon.",
        variant: "destructive",
      });
      return;
    }
    
    claimCouponMutation.mutate(couponId);
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="container py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-1/3 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="aspect-square bg-muted rounded col-span-1"></div>
            <div className="space-y-4 col-span-2">
              <div className="h-8 w-3/4 bg-muted rounded"></div>
              <div className="h-6 w-1/2 bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-2/3 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !receipt) {
    return (
      <main className="container py-10">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Receipt Not Found</h1>
          <p className="text-muted-foreground mb-6">The NFT receipt you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => setLocation("/")}>
            Back to Dashboard
          </Button>
        </div>
      </main>
    );
  }

  // View on block explorer
  const handleViewOnBlockExplorer = () => {
    if (!receipt?.transactionHash) return;
    // Polygon Amoy explorer URL
    const explorerUrl = `https://amoy.polygonscan.com/tx/${receipt.transactionHash}`;
    window.open(explorerUrl, '_blank');
  };
  
  // Handle sharing NFT details
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `BlockReceipt NFT #${receiptId}`,
        text: `Check out my BlockReceipt NFT from ${receipt?.merchantName || 'a merchant'}`,
        url: window.location.href
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "NFT link copied to clipboard!",
      });
    }
  };

  // Generate display data from receipt or fallback to defaults
  const displayData = receipt ? {
    id: receiptId,
    transactionHash: receipt.transactionHash || 'Not available',
    tokenId: receipt.tokenId || receiptId,
    // Tier removed as per requirement
    merchantName: receipt.merchantName || 'Unknown Merchant',
    purchaseDate: receipt.createdAt || new Date().toISOString(),
    totalAmount: receipt.amount || receipt.total || 0,
    ipfsHash: receipt.ipfsHash || 'Not available',
    imageUrl: receipt.imageUrl || '/placeholder-receipt.jpg',
    stampUrl: receipt.stampUrl || '/placeholder-stamp.svg'
  } : null;

  return (
    <main className="container py-10">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => setLocation("/receipt-gallery")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Gallery
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" /> Share
          </Button>
          {receipt?.transactionHash && (
            <Button variant="outline" onClick={handleViewOnBlockExplorer} className="flex items-center gap-2">
              <Eye className="h-4 w-4" /> View on Explorer
            </Button>
          )}
        </div>
      </div>

      {displayData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* NFT Receipt Card and Stamp */}
          <div className="lg:col-span-1 space-y-6">
            {/* NFT Image */}
            <Card>
              <CardContent className="pt-6">
                <div className="aspect-square rounded-lg overflow-hidden border bg-background/50 relative">
                  <img 
                    src={displayData.imageUrl} 
                    alt={`Receipt from ${displayData.merchantName}`}
                    className="object-cover w-full h-full"
                  />
                  {/* No tier badge displayed as per user request */}
                </div>
                
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold">
                    Receipt #{displayData.id}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Token ID: {displayData.tokenId}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                {/* Passport Stamp */}
                {displayData.stampUrl && (
                  <div className="w-1/2 mx-auto">
                    <img
                      src={displayData.stampUrl}
                      alt="NFT Passport Stamp"
                      className="w-full"
                    />
                  </div>
                )}
              </CardFooter>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start gap-2"
                  onClick={handleDecrypt}
                  disabled={isDecrypting || !!decryptedData}
                >
                  {decryptedData ? (
                    <><Unlock className="h-4 w-4 text-green-500" /> Metadata Unlocked</>
                  ) : (
                    <><Lock className="h-4 w-4" /> {isDecrypting ? "Decrypting..." : "Decrypt Metadata"}</>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start gap-2"
                  onClick={() => setActiveTab("coupons")}
                >
                  <Tag className="h-4 w-4" /> View Available Coupons
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" /> Share Receipt
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-start gap-2"
                  onClick={handleViewOnBlockExplorer}
                  disabled={!receipt?.transactionHash}
                >
                  <Eye className="h-4 w-4" /> View on Blockchain
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Receipt Details Tabs */}
          <div className="lg:col-span-2">
            <Tabs 
              defaultValue="overview" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="metadata">Receipt Data</TabsTrigger>
                <TabsTrigger value="coupons">Offers & Coupons</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="pt-4">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <CardTitle className="text-2xl">{displayData.merchantName}</CardTitle>
                        <CardDescription>
                          {new Date(displayData.purchaseDate).toLocaleDateString()} at {' '}
                          {new Date(displayData.purchaseDate).toLocaleTimeString()}
                        </CardDescription>
                      </div>
                      <Badge className="w-fit capitalize">BlockReceipt NFT</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-medium mb-2">Receipt Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Merchant</p>
                          <p className="font-medium">{displayData.merchantName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="font-medium">${typeof displayData.totalAmount === 'number' ? displayData.totalAmount.toFixed(2) : '0.00'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Purchase Date</p>
                          <p className="font-medium">{new Date(displayData.purchaseDate).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Receipt ID</p>
                          <p className="font-medium">#{displayData.id}</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Blockchain Information */}
                    <div>
                      <h3 className="text-lg font-medium mb-2">Blockchain Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Network</p>
                          <p className="font-medium">Polygon Amoy (Testnet)</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Token ID</p>
                          <p className="font-medium">{displayData.tokenId}</p>
                        </div>
                        {displayData.transactionHash && displayData.transactionHash !== 'Not available' && (
                          <div>
                            <p className="text-sm text-muted-foreground">Transaction Hash</p>
                            <p className="font-medium text-sm break-all">{displayData.transactionHash}</p>
                          </div>
                        )}
                        {displayData.ipfsHash && displayData.ipfsHash !== 'Not available' && (
                          <div>
                            <p className="text-sm text-muted-foreground">IPFS Data</p>
                            <p className="font-medium text-sm break-all">{displayData.ipfsHash}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Receipt Features */}
                    <div>
                      <h3 className="text-lg font-medium mb-2">Receipt Features</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="border rounded-md p-3 flex flex-col items-center justify-center text-center space-y-1">
                          <ShieldCheck className="h-6 w-6 text-green-500" />
                          <p className="text-sm font-medium">Authenticity Verification</p>
                        </div>
                        <div className="border rounded-md p-3 flex flex-col items-center justify-center text-center space-y-1">
                          <ReceiptText className="h-6 w-6 text-green-500" />
                          <p className="text-sm font-medium">Transferable</p>
                        </div>
                        <div className="border rounded-md p-3 flex flex-col items-center justify-center text-center space-y-1">
                          <ShoppingBag className="h-6 w-6 text-green-500" />
                          <p className="text-sm font-medium">IPFS Storage</p>
                        </div>
                        <div className="border rounded-md p-3 flex flex-col items-center justify-center text-center space-y-1">
                          <Lock className="h-6 w-6 text-green-500" />
                          <p className="text-sm font-medium">Encrypted Data</p>
                        </div>
                        <div className="border rounded-md p-3 flex flex-col items-center justify-center text-center space-y-1">
                          <Tag className="h-6 w-6 text-green-500" />
                          <p className="text-sm font-medium">Promotional Coupons</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Metadata Tab */}
              <TabsContent value="metadata" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Receipt Metadata</CardTitle>
                    <CardDescription>
                      {decryptedData 
                        ? "Your receipt data has been decrypted and is visible below"
                        : "This data is encrypted for privacy. Click 'Decrypt Metadata' to view."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!decryptedData ? (
                      <div className="text-center py-8 space-y-4">
                        <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="text-lg font-medium">Encrypted Receipt Data</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          Your receipt data is securely encrypted using Threshold Encryption. 
                          Only you can decrypt and view this information.
                        </p>
                        <Button 
                          onClick={handleDecrypt} 
                          className="mt-4"
                          disabled={isDecrypting}
                        >
                          {isDecrypting ? "Decrypting..." : "Decrypt Metadata"}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Receipt Items */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Receipt Items</h3>
                          
                          {decryptedData.items && decryptedData.items.length > 0 ? (
                            <div className="rounded-md border">
                              <div className="grid grid-cols-12 p-3 bg-muted text-sm font-medium">
                                <div className="col-span-6">Item</div>
                                <div className="col-span-2 text-right">Quantity</div>
                                <div className="col-span-2 text-right">Price</div>
                                <div className="col-span-2 text-right">Total</div>
                              </div>
                              <div className="divide-y">
                                {decryptedData.items.map((item: any, index: number) => (
                                  <div key={index} className="grid grid-cols-12 p-3 text-sm">
                                    <div className="col-span-6">{item.name || 'Unknown Item'}</div>
                                    <div className="col-span-2 text-right">{item.quantity || 1}</div>
                                    <div className="col-span-2 text-right">${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}</div>
                                    <div className="col-span-2 text-right">${typeof item.total === 'number' ? item.total.toFixed(2) : (typeof item.price === 'number' && typeof item.quantity === 'number' ? (item.price * item.quantity).toFixed(2) : '0.00')}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No itemized receipt data available</p>
                          )}
                        </div>
                        
                        {/* Receipt Totals */}
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium">Receipt Totals</h3>
                          <div className="rounded-md border p-4 space-y-2">
                            {decryptedData.subtotal !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-sm">Subtotal:</span>
                                <span className="font-medium">${typeof decryptedData.subtotal === 'number' ? decryptedData.subtotal.toFixed(2) : '0.00'}</span>
                              </div>
                            )}
                            {decryptedData.tax !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-sm">Tax:</span>
                                <span className="font-medium">${typeof decryptedData.tax === 'number' ? decryptedData.tax.toFixed(2) : '0.00'}</span>
                              </div>
                            )}
                            {decryptedData.tip !== undefined && (
                              <div className="flex justify-between">
                                <span className="text-sm">Tip:</span>
                                <span className="font-medium">${typeof decryptedData.tip === 'number' ? decryptedData.tip.toFixed(2) : '0.00'}</span>
                              </div>
                            )}
                            <Separator />
                            <div className="flex justify-between font-bold">
                              <span>Total:</span>
                              <span>${typeof decryptedData.total === 'number' ? decryptedData.total.toFixed(2) : (typeof displayData.totalAmount === 'number' ? displayData.totalAmount.toFixed(2) : '0.00')}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Additional Metadata */}
                        {(decryptedData.notes || decryptedData.category || decryptedData.paymentMethod) && (
                          <div className="space-y-2">
                            <h3 className="text-lg font-medium">Additional Information</h3>
                            <div className="rounded-md border p-4 space-y-3">
                              {decryptedData.category && (
                                <div>
                                  <span className="text-sm text-muted-foreground block">Category:</span>
                                  <span>{decryptedData.category}</span>
                                </div>
                              )}
                              {decryptedData.paymentMethod && (
                                <div>
                                  <span className="text-sm text-muted-foreground block">Payment Method:</span>
                                  <span>{decryptedData.paymentMethod}</span>
                                </div>
                              )}
                              {decryptedData.notes && (
                                <div>
                                  <span className="text-sm text-muted-foreground block">Notes:</span>
                                  <span>{decryptedData.notes}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Coupons Tab */}
              <TabsContent value="coupons" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Coupons & Promotions</CardTitle>
                    <CardDescription>
                      Exclusive offers available with this receipt
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {couponsLoading ? (
                      <div className="animate-pulse space-y-4">
                        <div className="h-16 bg-muted rounded-md"></div>
                        <div className="h-16 bg-muted rounded-md"></div>
                        <div className="h-16 bg-muted rounded-md"></div>
                      </div>
                    ) : coupons.length === 0 ? (
                      <div className="text-center py-8 space-y-4">
                        <Tag className="h-12 w-12 mx-auto text-muted-foreground" />
                        <h3 className="text-lg font-medium">No Coupons Available</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          There are no promotional offers available for this receipt at this time.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {coupons.map((coupon: any) => (
                          <div key={coupon.id} className="border rounded-md p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-bold text-lg">{coupon.code || coupon.name}</h3>
                              {coupon.validUntil && (
                                <Badge variant="outline">
                                  Expires: {new Date(coupon.validUntil * 1000).toLocaleDateString()}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm mb-3">{coupon.description || `${coupon.percentOff || 0}% off your next purchase`}</p>
                            
                            <div className="flex items-center gap-2 mt-3">
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleClaimCoupon(coupon.id)}
                                disabled={coupon.claimed}
                              >
                                {coupon.claimed ? "Already Claimed" : "Claim Coupon"}
                              </Button>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="secondary" className="flex-shrink-0">
                                    Details
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>{coupon.code || coupon.name}</DialogTitle>
                                    <DialogDescription>
                                      {coupon.description || `${coupon.percentOff || 0}% off your next purchase`}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    {coupon.terms && (
                                      <div>
                                        <h4 className="font-medium mb-1">Terms & Conditions</h4>
                                        <p className="text-sm text-muted-foreground">{coupon.terms}</p>
                                      </div>
                                    )}
                                    
                                    <div className="flex flex-col gap-2">
                                      {coupon.validUntil && (
                                        <div className="flex justify-between">
                                          <span className="text-sm">Valid Until:</span>
                                          <span className="font-medium">{new Date(coupon.validUntil * 1000).toLocaleDateString()}</span>
                                        </div>
                                      )}
                                      {coupon.minimumPurchase && (
                                        <div className="flex justify-between">
                                          <span className="text-sm">Minimum Purchase:</span>
                                          <span className="font-medium">${coupon.minimumPurchase}</span>
                                        </div>
                                      )}
                                      {coupon.percentOff && (
                                        <div className="flex justify-between">
                                          <span className="text-sm">Discount:</span>
                                          <span className="font-medium">{coupon.percentOff}% off</span>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <Alert>
                                      <CircleAlertIcon className="h-4 w-4" />
                                      <AlertTitle>Important</AlertTitle>
                                      <AlertDescription>
                                        This coupon is linked to your NFT Receipt and can only be redeemed once.
                                      </AlertDescription>
                                    </Alert>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="default"
                                      onClick={() => handleClaimCoupon(coupon.id)}
                                      disabled={coupon.claimed}
                                    >
                                      {coupon.claimed ? "Already Claimed" : "Claim Coupon"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </main>
  );
}
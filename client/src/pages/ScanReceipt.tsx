import React, { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Upload, 
  Camera, 
  ScanLine, 
  FileText, 
  ShieldCheck, 
  Info, 
  Check, 
  Loader2, 
  Tag,
  ShoppingBag,
  CalendarDays,
  DollarSign,
  ListChecks,
  Package,
  Wallet
} from 'lucide-react';
import ConnectWalletButton from '@/components/blockchain/ConnectWalletButton';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ReceiptTier } from "@/types";

// For compatibility, support both uppercase and lowercase variants
type ReceiptType = ReceiptTier | 'standard' | 'premium' | 'luxury' | 'ultra';

// Define receipt data type locally
interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

interface ReceiptData {
  id?: string | number;
  merchantName: string;
  date: string;
  items: ReceiptItem[];
  subtotal?: number;
  tax?: number;
  total: number;
  category?: string;
  nftGift?: {
    status: string;
    message: string;
    eligible: boolean;
    taskId?: string;
  };
}

type ScanMethod = 'upload' | 'camera' | 'manual';
type ScanState = 'idle' | 'scanning' | 'processing' | 'completed' | 'error';

interface ScannedItemProps {
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

const ScannedItem: React.FC<ScannedItemProps> = ({ name, price, quantity, category = 'Uncategorized' }) => {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div className="flex flex-col">
        <span className="font-medium">{name}</span>
        <div className="flex items-center text-sm text-muted-foreground">
          <Tag className="h-3 w-3 mr-1" />
          <span>{category}</span>
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-sm text-muted-foreground mr-3">
          {quantity} × ${price.toFixed(2)}
        </span>
        <span className="font-medium">${(quantity * price).toFixed(2)}</span>
      </div>
    </div>
  );
};

export const ScanReceipt: React.FC = () => {
  const [scanMethod, setScanMethod] = useState<ScanMethod>('upload');
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [progress, setProgress] = useState(0);
  const [enableEncryption, setEnableEncryption] = useState(true);
  const [receiptType, setReceiptType] = useState<ReceiptType>('standard');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Use the imported ReceiptData type
  const [scannedReceipt, setScannedReceipt] = useState<ReceiptData | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processReceipt(file);
    }
  };
  
  const handleCapture = () => {
    // In a real app, this would capture from the camera and convert to a file/blob
    // For this demo, we'll create a mock file to simulate camera capture
    setScanState('scanning');
    
    // Create a mock file from a blank canvas
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    canvas.getContext('2d')?.fillRect(0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.png', { type: 'image/png' });
        processReceipt(file);
      } else {
        setScanState('error');
        toast({
          title: "Camera Capture Failed",
          description: "Failed to capture an image from the camera. Please try again or use the upload option.",
          variant: "destructive",
        });
      }
    });
  };
  
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process manually entered receipt data
    setScanState('scanning');
    
    // Create a fake file to process - in a real app this would use form data directly
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'manual-entry.png', { type: 'image/png' });
        processReceipt(file);
      } else {
        setScanState('error');
      }
    });
  };
  
  // State for tracking receipt minting
  const [mintingState, setMintingState] = useState<{
    inProgress: boolean;
    tokenId?: string;
    txHash?: string;
    error?: string;
  }>({
    inProgress: false
  });
  
  // Process the receipt image using OCR
  const processReceipt = async (file: File) => {
    setScanState('scanning');
    setProgress(0);
    
    try {
      // Import the receipt OCR processing function
      const { processReceiptImage } = await import('@/lib/receiptOcr');
      
      // Simulate processing progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      // Process the image with OCR
      const receiptData = await processReceiptImage(file);
      
      // Clear the progress interval and set progress to 100%
      clearInterval(progressInterval);
      setProgress(100);
      
      if (receiptData) {
        // Set the receipt data
        setScannedReceipt(receiptData);
        setScanState('completed');
      } else {
        // Handle OCR failure
        setScanState('error');
        toast({
          title: "Receipt Processing Failed",
          description: "We couldn't extract the receipt data from your image. Please try again with a clearer image.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error processing receipt:', error);
      setScanState('error');
      toast({
        title: "Receipt Processing Error",
        description: "An error occurred while processing your receipt. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Mint the NFT receipt on the blockchain
  const mintNFTReceipt = async () => {
    if (!scannedReceipt) return;
    
    setMintingState({ inProgress: true });
    setScanState('processing');
    setProgress(0);
    
    try {
      // Import the necessary functions
      const { isWalletConnected, connectWallet, mintReceiptNft } = await import('@/lib/blockchainService');
      
      // Check if wallet is connected
      if (!isWalletConnected()) {
        // Connect wallet if not already connected
        const walletInfo = await connectWallet();
        if (!walletInfo.isConnected) {
          throw new Error('Failed to connect wallet');
        }
      }
      
      // Simulate progress during minting process
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 2;
        });
      }, 100);
      
      // Mint the NFT receipt
      const result = await mintReceiptNft(scannedReceipt, "user_wallet_address");
      
      // Clear the progress interval and set progress to 100%
      clearInterval(progressInterval);
      setProgress(100);
      
      if (result.success) {
        // Update minting state with token ID and transaction hash
        setMintingState({
          inProgress: false,
          tokenId: result.tokenId,
          txHash: result.txHash
        });
        
        // Show success toast
        toast({
          title: "Receipt NFT Minted Successfully",
          description: `Your receipt from ${scannedReceipt.merchant} has been transformed into an NFT with token ID #${result.tokenId}`,
          variant: "default",
        });
        
        // Navigate to wallet after successful minting
        setTimeout(() => {
          setLocation('/nft-wallet');
        }, 2000);
      } else {
        // Handle minting failure
        setMintingState({
          inProgress: false,
          error: result.error || 'Unknown error occurred during minting'
        });
        
        toast({
          title: "Minting Failed",
          description: result.error || "Failed to mint your receipt as an NFT. Please try again.",
          variant: "destructive",
        });
        
        setScanState('completed');
      }
    } catch (error) {
      console.error('Error minting NFT receipt:', error);
      
      setMintingState({
        inProgress: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      
      toast({
        title: "Minting Error",
        description: "An error occurred while minting your receipt NFT. Please try again.",
        variant: "destructive",
      });
      
      setScanState('completed');
    }
  };
  
  const resetScan = () => {
    setScanState('idle');
    setProgress(0);
    setScannedReceipt(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold">Transform Receipt to NFT</h1>
          <p className="text-muted-foreground mt-2">
            Convert your paper receipts into verifiable digital NFTs for permanent record-keeping
          </p>
        </div>

        <Tabs defaultValue={scanMethod} onValueChange={(v) => setScanMethod(v as ScanMethod)}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="upload" disabled={scanState !== 'idle'}>
              <Upload className="h-4 w-4 mr-2" /> Upload Receipt
            </TabsTrigger>
            <TabsTrigger value="camera" disabled={scanState !== 'idle'}>
              <Camera className="h-4 w-4 mr-2" /> Use Camera
            </TabsTrigger>
            <TabsTrigger value="manual" disabled={scanState !== 'idle'}>
              <FileText className="h-4 w-4 mr-2" /> Manual Entry
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            {scanState === 'idle' && (
              <>
                <TabsContent value="upload" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Upload Receipt Image</CardTitle>
                      <CardDescription>
                        Upload a clear photo or scan of your paper receipt
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                        <Upload className="h-10 w-10 text-gray-400 mb-4" />
                        <h3 className="font-medium mb-1">Upload Receipt Image</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Drag and drop or click to upload (JPG, PNG, PDF)
                        </p>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*,.pdf"
                          className="hidden"
                          id="receipt-upload"
                        />
                        <Button onClick={() => fileInputRef.current?.click()}>
                          Choose File
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="camera" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Capture Receipt with Camera</CardTitle>
                      <CardDescription>
                        Take a clear photo of your receipt
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden relative flex items-center justify-center">
                          <video
                            ref={cameraRef}
                            className="w-full h-full hidden"
                            autoPlay
                            playsInline
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                            <Camera className="h-10 w-10 text-gray-400 mb-4" />
                            <h3 className="font-medium mb-1">Camera Access Required</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Click the button below to enable camera access and take a photo
                            </p>
                          </div>
                          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
                          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-green-500 to-transparent opacity-50" />
                          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
                          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-green-500 to-transparent opacity-50" />
                        </div>
                        <Button onClick={handleCapture}>
                          <Camera className="h-4 w-4 mr-2" /> Capture Receipt
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="manual" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Manual Receipt Entry</CardTitle>
                      <CardDescription>
                        Enter receipt details manually
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleManualSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="merchant">Merchant Name</Label>
                            <Input id="merchant" placeholder="e.g., Whole Foods Market" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="date">Purchase Date</Label>
                            <Input id="date" type="date" required />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="subtotal">Subtotal</Label>
                            <Input id="subtotal" type="number" step="0.01" min="0" placeholder="0.00" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tax">Tax</Label>
                            <Input id="tax" type="number" step="0.01" min="0" placeholder="0.00" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="total">Total Amount</Label>
                            <Input id="total" type="number" step="0.01" min="0" placeholder="0.00" required />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>
                            Receipt Items <span className="text-sm text-muted-foreground">(optional)</span>
                          </Label>
                          <Textarea placeholder="Enter items, one per line. Format: Item name, price, quantity" rows={4} />
                        </div>
                        
                        <Button type="submit" className="w-full">
                          Scan Receipt
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
            
            {(scanState === 'scanning' || scanState === 'processing') && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {scanState === 'scanning' ? 'Scanning Receipt' : 'Processing Receipt Data'}
                  </CardTitle>
                  <CardDescription>
                    {scanState === 'scanning' 
                      ? 'Reading and analyzing receipt contents...' 
                      : 'Extracting items, totals, and merchant information...'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10 space-y-6">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    {scanState === 'scanning' ? (
                      <>
                        <ScanLine className="h-12 w-12 text-blue-500 animate-pulse" />
                        <div className="absolute inset-0 border-2 border-blue-200 rounded-full" />
                        <div 
                          className="absolute inset-0 border-2 border-blue-500 rounded-full" 
                          style={{ 
                            clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`
                          }}
                        />
                      </>
                    ) : (
                      <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                    )}
                  </div>
                  <Progress value={progress} className="w-64" />
                  <p className="text-sm text-muted-foreground">{progress}% complete</p>
                </CardContent>
              </Card>
            )}
            
            {scanState === 'completed' && scannedReceipt && (
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2 border-b">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{scannedReceipt.merchant}</CardTitle>
                        <CardDescription>
                          {new Date(scannedReceipt.date).toLocaleDateString()}
                        </CardDescription>
                        {scannedReceipt.merchantDetails?.address && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {scannedReceipt.merchantDetails.address}, 
                            {scannedReceipt.merchantDetails.city && ` ${scannedReceipt.merchantDetails.city},`}
                            {scannedReceipt.merchantDetails.state && ` ${scannedReceipt.merchantDetails.state}`}
                            {scannedReceipt.merchantDetails.zip && ` ${scannedReceipt.merchantDetails.zip}`}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${scannedReceipt.total.toFixed(2)}</div>
                        <CardDescription>Total Amount</CardDescription>
                        {scannedReceipt.transactionDetails?.transactionId && (
                          <div className="text-xs text-muted-foreground mt-1 font-mono">
                            TX: {scannedReceipt.transactionDetails.transactionId}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                          <ShoppingBag className="h-5 w-5 text-gray-500 mb-1" />
                          <span className="text-xs text-muted-foreground">Merchant</span>
                          <span className="font-medium text-sm truncate max-w-full">{scannedReceipt.merchant}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                          <CalendarDays className="h-5 w-5 text-gray-500 mb-1" />
                          <span className="text-xs text-muted-foreground">Date</span>
                          <span className="font-medium text-sm">{new Date(scannedReceipt.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                          <ListChecks className="h-5 w-5 text-gray-500 mb-1" />
                          <span className="text-xs text-muted-foreground">Items</span>
                          <span className="font-medium text-sm">{scannedReceipt.items.length}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg">
                          <DollarSign className="h-5 w-5 text-gray-500 mb-1" />
                          <span className="text-xs text-muted-foreground">Total</span>
                          <span className="font-medium text-sm">${scannedReceipt.total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="font-medium flex items-center">
                          <Package className="h-4 w-4 mr-2" />
                          Receipt Items
                        </h3>
                        <ScrollArea className="h-64 rounded-md border">
                          <div className="p-4">
                            {scannedReceipt.items.map((item, idx) => (
                              <ScannedItem key={idx} {...item} />
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                      
                      <div className="space-y-2 pt-2">
                        <h3 className="font-medium">Receipt Summary</h3>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>${scannedReceipt.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tax</span>
                          <span>${scannedReceipt.tax.toFixed(2)}</span>
                        </div>
                        {scannedReceipt.tip !== undefined && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tip</span>
                            <span>${scannedReceipt.tip.toFixed(2)}</span>
                          </div>
                        )}
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>${scannedReceipt.total.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      {/* Additional receipt details when available */}
                      {(scannedReceipt.merchantDetails || scannedReceipt.transactionDetails) && (
                        <div className="pt-4 mt-4 border-t border-gray-100 space-y-4">
                          {scannedReceipt.merchantDetails && (
                            <div className="space-y-2">
                              <h3 className="font-medium text-sm text-muted-foreground">Merchant Details</h3>
                              <div className="text-sm space-y-1 text-gray-700">
                                {scannedReceipt.merchantDetails.address && (
                                  <p>{scannedReceipt.merchantDetails.address}</p>
                                )}
                                {scannedReceipt.merchantDetails.city && (
                                  <p>
                                    {scannedReceipt.merchantDetails.city}
                                    {scannedReceipt.merchantDetails.state && `, ${scannedReceipt.merchantDetails.state}`}
                                    {scannedReceipt.merchantDetails.zip && ` ${scannedReceipt.merchantDetails.zip}`}
                                  </p>
                                )}
                                {scannedReceipt.merchantDetails.phone && (
                                  <p>Phone: {scannedReceipt.merchantDetails.phone}</p>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {scannedReceipt.transactionDetails && (
                            <div className="space-y-2">
                              <h3 className="font-medium text-sm text-muted-foreground">Transaction Details</h3>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                {scannedReceipt.transactionDetails.transactionId && (
                                  <>
                                    <span className="text-gray-500">Transaction ID:</span>
                                    <span className="font-mono">{scannedReceipt.transactionDetails.transactionId}</span>
                                  </>
                                )}
                                {scannedReceipt.transactionDetails.orderId && (
                                  <>
                                    <span className="text-gray-500">Order ID:</span>
                                    <span className="font-mono">{scannedReceipt.transactionDetails.orderId}</span>
                                  </>
                                )}
                                {scannedReceipt.transactionDetails.type && (
                                  <>
                                    <span className="text-gray-500">Payment Type:</span>
                                    <span>{scannedReceipt.transactionDetails.type}</span>
                                  </>
                                )}
                                {scannedReceipt.transactionDetails.cardType && (
                                  <>
                                    <span className="text-gray-500">Card Type:</span>
                                    <span>{scannedReceipt.transactionDetails.cardType}</span>
                                  </>
                                )}
                                {scannedReceipt.transactionDetails.lastFour && (
                                  <>
                                    <span className="text-gray-500">Card Number:</span>
                                    <span>XXXX-XXXX-XXXX-{scannedReceipt.transactionDetails.lastFour}</span>
                                  </>
                                )}
                                {scannedReceipt.transactionDetails.approvalCode && (
                                  <>
                                    <span className="text-gray-500">Approval Code:</span>
                                    <span className="font-mono">{scannedReceipt.transactionDetails.approvalCode}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>NFT Receipt Options</CardTitle>
                    <CardDescription>
                      Your receipt will be minted as an NFT on the Polygon blockchain
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Assigned tier based on total amount */}
                    <div className="space-y-2">
                      <Label className="text-base">Receipt Tier</Label>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {scannedReceipt?.receiptType === 'luxury' ? (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mr-3">
                                Luxury
                              </Badge>
                            ) : scannedReceipt?.receiptType === 'premium' ? (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 mr-3">
                                Premium
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mr-3">
                                Standard
                              </Badge>
                            )}
                            <span className="text-sm font-medium">
                              {scannedReceipt?.receiptType === 'luxury' 
                                ? 'Luxury Tier ($100+ receipts)' 
                                : scannedReceipt?.receiptType === 'premium'
                                  ? 'Premium Tier ($50-99.99 receipts)'
                                  : 'Standard Tier (Under $50 receipts)'}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            Based on total: ${scannedReceipt?.total.toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="mt-4 space-y-2">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Tier Benefits</div>
                            <ul className="text-sm pl-5 space-y-1 list-disc">
                              {scannedReceipt?.receiptType === 'luxury' ? (
                                <>
                                  <li>Premium holographic NFT design with special effects</li>
                                  <li>Extended warranty tracking (up to 5 years)</li>
                                  <li>Priority blockchain verification</li>
                                  <li>Unlimited access grants for third parties</li>
                                </>
                              ) : scannedReceipt?.receiptType === 'premium' ? (
                                <>
                                  <li>Enhanced NFT design with animated elements</li>
                                  <li>Extended warranty tracking (up to 3 years)</li>
                                  <li>Up to 10 access grants for third parties</li>
                                </>
                              ) : (
                                <>
                                  <li>Standard NFT design</li>
                                  <li>Basic warranty tracking (up to 1 year)</li>
                                  <li>Up to 3 access grants for third parties</li>
                                </>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* TACo Encryption Options */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">TACo Encryption</Label>
                          <p className="text-sm text-muted-foreground">
                            Secure sensitive receipt data with Threshold Network encryption
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Switch 
                            checked={enableEncryption} 
                            onCheckedChange={setEnableEncryption}
                          />
                        </div>
                      </div>
                      
                      {enableEncryption && (
                        <div className="ml-6 pl-2 border-l-2 border-blue-200">
                          <div className="bg-blue-50 p-3 rounded-md flex items-start">
                            <ShieldCheck className="h-5 w-5 text-blue-500 mt-0.5 mr-2 shrink-0" />
                            <div className="space-y-2">
                              <p className="text-sm text-blue-700">
                                Your receipt data will be encrypted with Threshold Network TACo, giving you complete control over who can access your sensitive purchase information.
                              </p>
                              <p className="text-sm text-blue-700">
                                You'll be able to grant and revoke access to specific wallets or applications through your NFT Wallet.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Optional Additional Information */}
                    <div className="space-y-2">
                      <Label htmlFor="add-data">Additional Information</Label>
                      <Textarea 
                        id="add-data" 
                        placeholder="Add any notes or additional information (optional)"
                        rows={3}
                      />
                    </div>
                    
                    {/* Wallet Connection Reminder */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Wallet className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 shrink-0" />
                        <div className="space-y-2">
                          <p className="text-sm text-yellow-700 font-medium">
                            Wallet Connection Required
                          </p>
                          <p className="text-sm text-yellow-700">
                            You'll need to connect your wallet before minting your NFT receipt. 
                            The receipt will be minted to your connected wallet address.
                          </p>
                          <div className="pt-2">
                            <ConnectWalletButton size="sm" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-6">
                    <Button variant="outline" onClick={resetScan}>
                      Scan Another
                    </Button>
                    <Button 
                      onClick={mintNFTReceipt} 
                      disabled={mintingState.inProgress}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {mintingState.inProgress ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Minting...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Create NFT Receipt
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}
            
            {scanState === 'error' && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Error Processing Receipt</CardTitle>
                  <CardDescription>
                    We couldn't properly process the receipt. Please try again.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    <p>The receipt could not be processed due to one of the following:</p>
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>The image quality was too low</li>
                      <li>The receipt format wasn't recognized</li>
                      <li>There was an error during processing</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={resetScan} className="w-full">
                    Try Again
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </Tabs>
        
        <Tabs defaultValue="benefits">
          <TabsList className="mb-4">
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="technology">How It Works</TabsTrigger>
          </TabsList>
          
          <TabsContent value="benefits">
            <div className="text-sm text-muted-foreground bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Info className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                <div>
                  <p className="mb-2">
                    Transforming your paper receipts into NFTs helps you:
                  </p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>Maintain permanent, tamper-proof records of your purchases</li>
                    <li>Easily access purchase history for returns or warranty claims</li>
                    <li>Share receipt access with specified third parties (e.g., accountants)</li>
                    <li>Protect sensitive financial data with blockchain encryption</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="technology">
            <div className="text-sm text-muted-foreground bg-blue-50 p-4 rounded-lg">
              <div className="space-y-4">
                <h3 className="font-medium text-blue-800">How Receipt Scanning Works</h3>
                <div className="space-y-2">
                  <p className="text-blue-700">
                    In a production environment, our application uses advanced OCR (Optical Character Recognition) to accurately extract data from your paper receipts:
                  </p>
                  
                  <ol className="list-decimal ml-5 space-y-2 text-blue-700">
                    <li>
                      <span className="font-medium">Image Preprocessing:</span> We enhance image quality through cropping, rotation correction, and contrast improvement to prepare for accurate text extraction.
                    </li>
                    <li>
                      <span className="font-medium">Text Recognition:</span> Using specialized OCR algorithms optimized for receipt formats, we extract all text while preserving its layout and structure.
                    </li>
                    <li>
                      <span className="font-medium">Data Parsing:</span> AI models identify key receipt elements (merchant name, date, items, prices) by analyzing text positioning and contextual patterns.
                    </li>
                    <li>
                      <span className="font-medium">Verification:</span> The extracted data is validated against expected formats, with anomalies flagged for review.
                    </li>
                    <li>
                      <span className="font-medium">Blockchain Integration:</span> The verified receipt data is transformed into a digital asset and minted as an NFT on the Polygon blockchain.
                    </li>
                    <li>
                      <span className="font-medium">Encryption (Optional):</span> TACo encryption secures sensitive receipt data, allowing you to selectively grant and revoke access.
                    </li>
                  </ol>
                  
                  <p className="text-blue-700 mt-2">
                    This combination of OCR technology and blockchain ensures your receipt data is accurate, accessible, and secure.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScanReceipt;
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
  Package
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ReceiptType } from '@/components/receipts/EnhancedNFTReceiptCard';

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
  
  // Mock data for scanned receipt
  const [scannedReceipt, setScannedReceipt] = useState<{
    merchant: string;
    date: string;
    total: number;
    subtotal: number;
    tax: number;
    items: ScannedItemProps[];
  } | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processReceipt(file);
    }
  };
  
  const handleCapture = () => {
    // In a real app, this would capture from the camera and convert to a file/blob
    // For this demo, we'll simulate it
    setScanState('scanning');
    
    // Simulate processing time
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setScanState('processing');
        simulateReceiptData();
      }
    }, 100);
  };
  
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Would process manually entered receipt data
    // For demo, simulate processing
    setScanState('processing');
    simulateReceiptData();
  };
  
  const processReceipt = (file: File) => {
    setScanState('scanning');
    
    // Simulate upload and processing progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setScanState('processing');
        simulateReceiptData();
      }
    }, 100);
  };
  
  const simulateReceiptData = () => {
    // In a real application, this would be the result of OCR or manual entry
    setTimeout(() => {
      setScannedReceipt({
        merchant: "Whole Foods Market",
        date: "2025-05-14",
        total: 84.32,
        subtotal: 78.45,
        tax: 5.87,
        items: [
          { name: "Organic Banana", price: 0.89, quantity: 5, category: "Produce" },
          { name: "Almond Milk", price: 4.99, quantity: 1, category: "Dairy Alternatives" },
          { name: "Whole Grain Bread", price: 3.49, quantity: 2, category: "Bakery" },
          { name: "Chicken Breast", price: 12.99, quantity: 1, category: "Meat" },
          { name: "Spinach", price: 3.99, quantity: 2, category: "Produce" },
          { name: "Avocado", price: 1.29, quantity: 3, category: "Produce" },
          { name: "Greek Yogurt", price: 5.49, quantity: 2, category: "Dairy" },
          { name: "Olive Oil", price: 15.99, quantity: 1, category: "Pantry" },
          { name: "Mixed Nuts", price: 8.99, quantity: 1, category: "Snacks" },
        ]
      });
      setScanState('completed');
    }, 2000);
  };
  
  const mintNFTReceipt = () => {
    setScanState('processing');
    setProgress(0);
    
    // Simulate minting process
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 4;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        
        toast({
          title: "Receipt Minted Successfully",
          description: "Your receipt has been transformed into an NFT and added to your wallet",
          variant: "default",
        });
        
        // Navigate to wallet after successful minting
        setTimeout(() => {
          setLocation('/nft-wallet');
        }, 1500);
      }
    }, 100);
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
                          Process Receipt
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
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${scannedReceipt.total.toFixed(2)}</div>
                        <CardDescription>Total Amount</CardDescription>
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
                        <Separator className="my-2" />
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>${scannedReceipt.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>NFT Receipt Options</CardTitle>
                    <CardDescription>
                      Customize your blockchain receipt before minting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                            <p className="text-sm text-blue-700">
                              Your receipt data will be encrypted with Threshold Network TACo, giving you complete control over who can access your sensitive purchase information.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="receipt-type">Receipt Tier</Label>
                      <Select 
                        value={receiptType} 
                        onValueChange={(value) => setReceiptType(value as ReceiptType)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select receipt tier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800">
                                Standard
                              </Badge>
                              <span className="text-sm">Basic receipt with verification</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="premium">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800">
                                Premium
                              </Badge>
                              <span className="text-sm">Enhanced design with warranty tracking</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="luxury">
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800">
                                Luxury
                              </Badge>
                              <span className="text-sm">Special effect design with full features</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="add-data">Additional Information</Label>
                      <Textarea 
                        id="add-data" 
                        placeholder="Add any notes or additional information (optional)"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-6">
                    <Button variant="outline" onClick={resetScan}>
                      Scan Another
                    </Button>
                    <Button onClick={mintNFTReceipt}>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Create NFT Receipt
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
      </div>
    </div>
  );
};

export default ScanReceipt;
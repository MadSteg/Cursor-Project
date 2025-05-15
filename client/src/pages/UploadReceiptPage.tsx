import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { LucideFileUp, Camera, Receipt, CheckCircle, AlertCircle } from 'lucide-react';
import { useRef, useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

// Define the tier colors for visualization
const tierColors = {
  BASIC: 'bg-gray-200',
  STANDARD: 'bg-blue-200',
  PREMIUM: 'bg-purple-200',
  LUXURY: 'bg-amber-200',
};

// Define the tier details
const tierDetails = {
  BASIC: { 
    title: 'Basic', 
    description: 'Basic BlockReceipt with minimal features', 
    color: 'gray',
    price: 'Free'
  },
  STANDARD: { 
    title: 'Standard', 
    description: 'Standard BlockReceipt with basic features and encryption', 
    color: 'blue',
    price: '$0.99'
  },
  PREMIUM: { 
    title: 'Premium', 
    description: 'Enhanced BlockReceipt with premium features and advanced encryption', 
    color: 'purple',
    price: '$2.99'
  },
  LUXURY: { 
    title: 'Luxury', 
    description: 'Exclusive BlockReceipt with premium features and highest encryption', 
    color: 'amber',
    price: '$5.00'
  }
};

interface ReceiptData {
  merchantName: string;
  date: string;
  total: number;
  subtotal: number;
  tax: number;
  items: {
    name: string;
    price: number;
  }[];
  rawText?: string;
  tier?: {
    id: string;
    title: string;
    description: string;
    price: number;
  };
  filePath?: string;
  fileId?: string;
}

export default function UploadReceiptPage() {
  const [activeTab, setActiveTab] = useState('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset states
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setReceiptData(null);

    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('receipt', file);

    // Simulate progress with interval reference
    let progressInterval: NodeJS.Timeout | null = null;
    
    try {
      // Start progress simulation
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const increment = Math.random() * 10;
          const newProgress = Math.min(prev + increment, 90);
          return newProgress;
        });
      }, 300);

      // Send the file to our API
      const response = await apiRequest(
        'POST',
        '/api/upload-receipt',
        formData
      );
      
      // Clear the interval when done
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      
      const result = await response.json();
      
      if (result.success) {
        setUploadProgress(100);
        setReceiptData(result.data);
        setActiveTab('review');
        
        toast({
          title: 'Receipt Uploaded Successfully',
          description: `We've processed your receipt from ${result.data.merchantName}.`,
          variant: 'default',
        });
      } else {
        throw new Error(result.message || 'Failed to upload receipt');
      }
    } catch (err: any) {
      // Make sure interval is cleared on error
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      setError(err.message || 'An error occurred while uploading the receipt');
      setUploadProgress(0);
      
      toast({
        title: 'Upload Failed',
        description: err.message || 'Failed to upload receipt. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    
    const file = event.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      
      // Trigger the onChange event manually
      const changeEvent = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(changeEvent);
    }
  };

  const mintReceiptNFT = async () => {
    if (!receiptData) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // For progress simulation
    let progressInterval: NodeJS.Timeout | null = null;
    
    try {
      // Simulate progress
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const increment = Math.random() * 5;
          const newProgress = Math.min(prev + increment, 95);
          return newProgress;
        });
      }, 500);
      
      // Here we would send the receipt data to a mint NFT endpoint
      // For now, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      
      setUploadProgress(100);
      
      toast({
        title: 'BlockReceipt Minted',
        description: 'Your receipt has been successfully minted as a blockchain-secured BlockReceipt.',
        variant: 'default',
      });
      
      // Navigate to the wallet page (would do this in a real implementation)
    } catch (err: any) {
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      
      setError(err.message || 'Failed to mint BlockReceipt');
      
      toast({
        title: 'Minting Failed',
        description: err.message || 'Failed to mint BlockReceipt. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setReceiptData(null);
    setError(null);
    setUploadProgress(0);
    setActiveTab('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Mint BlockReceipt</h1>
        <p className="text-muted-foreground mt-2">
          Transform your receipts into secure, private BlockReceipts on the blockchain
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" disabled={isUploading}>
            <LucideFileUp className="mr-2 h-4 w-4" />
            Upload Image
          </TabsTrigger>
          <TabsTrigger value="review" disabled={!receiptData}>
            <Receipt className="mr-2 h-4 w-4" />
            Review & Mint
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Receipt Image</CardTitle>
              <CardDescription>
                Upload a photo or scan of your receipt to create a BlockReceipt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center ${
                  isUploading ? 'bg-muted/50 border-primary/20' : 'hover:border-primary/50 border-muted'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  {isUploading ? (
                    <div className="w-full max-w-md">
                      <Label className="text-sm text-muted-foreground mb-2 block">Uploading and processing receipt...</Label>
                      <Progress value={uploadProgress} className="h-2 w-full" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {uploadProgress < 30
                          ? 'Uploading receipt...'
                          : uploadProgress < 70
                          ? 'Analyzing receipt with OCR...'
                          : uploadProgress < 95
                          ? 'Determining receipt tier...'
                          : 'Finalizing...'}
                      </p>
                    </div>
                  ) : error ? (
                    <div className="text-destructive flex flex-col items-center">
                      <AlertCircle className="h-10 w-10 mb-2" />
                      <p>{error}</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={resetUpload}
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="bg-primary/5 p-4 rounded-full">
                        <Camera className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Drag & drop your receipt here</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          or click to browse files (JPG, PNG, PDF accepted)
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Button 
                        variant="default" 
                        className="mt-2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        Select Receipt
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="review" className="mt-6">
          {receiptData && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Receipt Details</CardTitle>
                    <CardDescription>
                      Review your receipt data before minting
                    </CardDescription>
                  </div>
                  <div className={`${
                    tierColors[receiptData.tier?.id as keyof typeof tierColors] || 'bg-gray-100'
                  } px-3 py-1 rounded-full text-sm font-medium`}>
                    {receiptData.tier?.title || 'Basic'} Tier
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm text-muted-foreground">Merchant</Label>
                    <p className="text-xl font-medium">{receiptData.merchantName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Date</Label>
                    <p className="text-xl font-medium">{receiptData.date}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Items</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {receiptData.items.length > 0 ? (
                      receiptData.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span className="font-medium">${item.price.toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No items could be extracted</p>
                    )}
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Subtotal</Label>
                    <p className="text-lg">${receiptData.subtotal.toFixed(2)}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Tax</Label>
                    <p className="text-lg">${receiptData.tax.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-medium">Total Amount</Label>
                  <p className="text-xl font-bold">${receiptData.total.toFixed(2)}</p>
                </div>
                
                <Separator />
                
                <div className="bg-primary/5 p-4 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-full ${
                      tierColors[receiptData.tier?.id as keyof typeof tierColors] || 'bg-gray-100'
                    }`}>
                      <Receipt className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">
                        {tierDetails[receiptData.tier?.id as keyof typeof tierDetails]?.title || 'Basic'} Tier BlockReceipt
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {tierDetails[receiptData.tier?.id as keyof typeof tierDetails]?.description || 'Basic BlockReceipt with minimal features'}
                      </p>
                      <div className="mt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Minting Price</span>
                          <span className="font-medium">
                            {tierDetails[receiptData.tier?.id as keyof typeof tierDetails]?.price || 'Free'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={resetUpload}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={mintReceiptNFT}
                    disabled={isUploading}
                    className="relative"
                  >
                    {isUploading ? (
                      <>
                        <span className="opacity-0">Mint BlockReceipt</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="ml-2 text-xs">{Math.round(uploadProgress)}%</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mint BlockReceipt
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
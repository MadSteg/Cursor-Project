import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { LucideFileUp, Camera, Receipt, CheckCircle, AlertCircle, FileImage } from 'lucide-react';
import { useRef, useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import NFTArtPicker from '@/components/receipts/NFTArtPicker';

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
  const [showNftPicker, setShowNftPicker] = useState(false);
  const [selectedNft, setSelectedNft] = useState<any>(null);
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

    // Simulate progress with interval reference for UI feedback
    let progressInterval: NodeJS.Timeout | null = null;
    
    try {
      // Start progress simulation for better UX
      progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const increment = Math.random() * 10;
          const newProgress = Math.min(prev + increment, 90);
          return newProgress;
        });
      }, 300);

      console.log('Uploading file:', file.name, file.type, file.size);
      
      // Make the actual API call to upload and process the receipt
      // Using XMLHttpRequest for better file upload handling and progress tracking
      const xhr = new XMLHttpRequest();
      
      // Create a promise to handle the XHR response
      const uploadPromise = new Promise<any>((resolve, reject) => {
        xhr.open('POST', '/api/upload-receipt', true);
        
        // Track upload progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.min(90, (event.loaded / event.total) * 100);
            setUploadProgress(percentComplete);
          }
        };
        
        // Handle response
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (err) {
              reject(new Error('Invalid server response'));
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject(new Error(errorData.message || `Error: ${xhr.status}`));
            } catch (err) {
              reject(new Error(`Request failed with status ${xhr.status}`));
            }
          }
        };
        
        // Handle network errors
        xhr.onerror = () => {
          reject(new Error('Network error occurred'));
        };
        
        // Send the form data
        xhr.send(formData);
      });
      
      // Wait for the upload to complete
      const resultData = await uploadPromise;
      
      // Clear the interval when response received
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      
      // Check if the upload was successful
      if (!resultData.success) {
        throw new Error(resultData.message || 'Failed to process receipt');
      }
      
      const receiptResult = resultData.data;
      
      setUploadProgress(100);
      setReceiptData(receiptResult);
      setActiveTab('review');
      
      toast({
        title: 'Receipt Uploaded Successfully',
        description: `We've processed your receipt from ${receiptResult.merchantName}.`,
        variant: 'default',
      });
    } catch (err: any) {
      console.error('Error processing receipt:', err);
      
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

  const handleStartNFTSelection = () => {
    if (!receiptData) return;
    setShowNftPicker(true);
  };
  
  const handleNFTSelected = async (nft: any) => {
    setSelectedNft(nft);
    await mintWithSelectedNFT(nft);
  };
  
  const handleCancelNFTSelection = () => {
    setShowNftPicker(false);
    setSelectedNft(null);
  };
  
  const mintWithSelectedNFT = async (nft: any) => {
    if (!receiptData) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setShowNftPicker(false);
    
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
      
      // Send the receipt data and selected NFT for minting
      const response = await apiRequest('POST', '/api/select-nft', {
        selectedNft: nft,
        receiptData
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to mint BlockReceipt');
      }
      
      if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
      }
      
      setUploadProgress(100);
      
      toast({
        title: 'BlockReceipt Minted',
        description: `Your receipt has been successfully minted as a "${nft.name}" blockchain-secured BlockReceipt to wallet address 0x0CC9bb224dA2cbe7764ab7513D493cB2b3BeA6FC.`,
        variant: 'default',
        duration: 7000,
      });
      
      // Additional info toast
      setTimeout(() => {
        toast({
          title: 'Transaction Confirmed',
          description: `Transaction hash: ${result.txHash}. NFT TokenID: ${result.tokenId}`,
          variant: 'default',
          duration: 7000,
        });
      }, 1500);
      
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
  
  // Original function now just shows the NFT picker
  const mintReceiptNFT = () => {
    if (!receiptData) return;
    handleStartNFTSelection();
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
                      <div className="bg-primary/10 p-6 rounded-full mb-2">
                        <FileImage className="h-12 w-12 text-primary" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-medium">Upload Your Receipt Image Here</h3>
                        <p className="text-sm text-muted-foreground mt-2 mb-4">
                          Take a photo or scan of your receipt to create a BlockReceipt
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                        <Button 
                          variant="default" 
                          size="lg"
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          <FileImage className="mr-2 h-5 w-5" />
                          Choose Receipt Image
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                          JPG, PNG, PDF files accepted
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="review" className="mt-6">
          {receiptData && !showNftPicker && !isUploading && (
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
                
                <div className="bg-muted p-4 rounded-md flex justify-between items-center">
                  <div>
                    <Label className="text-sm font-medium">Total Amount</Label>
                    <p className="text-2xl font-bold">${receiptData.total.toFixed(2)}</p>
                  </div>
                  
                  <div className="text-right">
                    <Label className="text-sm text-muted-foreground">BlockReceipt Tier</Label>
                    <p className={`text-lg font-medium text-${tierDetails[receiptData.tier?.id as keyof typeof tierDetails]?.color || 'gray'}-700`}>
                      {receiptData.tier?.title || 'Basic'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tierDetails[receiptData.tier?.id as keyof typeof tierDetails]?.price || 'Free'}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-center pt-4">
                  <Button 
                    className="w-full max-w-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    size="lg"
                    onClick={mintReceiptNFT}
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Mint as BlockReceipt NFT
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {showNftPicker && receiptData && (
            <NFTArtPicker 
              receiptData={receiptData}
              onSelect={handleNFTSelected}
              onCancel={handleCancelNFTSelection}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
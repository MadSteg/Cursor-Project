import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LucideFileUp, Camera, Receipt, FileImage, Wallet, Lock, Loader2 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import NFTArtPicker from '@/components/receipts/NFTArtPicker';
import NFTGiftStatus from '@/components/nft/NFTGiftStatus';
import { useWeb3Wallet } from '../hooks/useWeb3Wallet';
import TaskStatusMessage from '@/components/nft/TaskStatusMessage';
import UploadSuccessMessage from '@/components/nft/UploadSuccessMessage';

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

interface NFTGiftInfo {
  status: string;
  message: string;
  eligible: boolean;
  error?: string;
  nft?: {
    tokenId: string;
    contract: string;
    name: string;
    image: string;
    marketplace: string;
    price: number;
  };
  txHash?: string;
  taskId?: string; // Added for task queue integration
}

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
  nftGift?: NFTGiftInfo;
}

export default function UploadReceiptPage() {
  const [activeTab, setActiveTab] = useState('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showNftPicker, setShowNftPicker] = useState(false);
  const [selectedNft, setSelectedNft] = useState<any>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [nftTokenId, setNftTokenId] = useState<string | null>(null);
  const [nftMintingStatus, setNftMintingStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Get wallet info
  const { walletInfo, connectWallet } = useWeb3Wallet();
  const address = walletInfo.address;
  const isConnected = walletInfo.connected;
  
  // Enhanced file upload handler with better error handling
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if wallet is connected
    if (!isConnected || !address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet before uploading a receipt",
        variant: "destructive",
      });
      
      // Try to connect wallet
      try {
        await connectWallet();
        // Check again after connection attempt
        if (!walletInfo.connected || !walletInfo.address) {
          setIsUploading(false);
          return;
        }
      } catch (err) {
        console.error("Wallet connection failed:", err);
        setIsUploading(false);
        return;
      }
    }

    // Reset states
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setReceiptData(null);

    console.log(`Uploading file: ${file.name} (${file.size} bytes, type: ${file.type})`);

    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append('receipt', file);
    // Add wallet address to form data
    if (address) {
      formData.append('walletAddress', address);
      console.log('Adding wallet address to form data:', address);
    } else {
      console.error('No wallet address available for upload');
    }

    // Progress simulation interval
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + Math.random() * 5, 90));
    }, 300);

    try {
      // Use fetch API for the upload
      const response = await fetch('/api/upload-receipt', {
        method: 'POST',
        body: formData, // Browser automatically sets correct Content-Type with boundary
      });

      console.log(`Server responded with status: ${response.status}`);

      // Parse response data
      const responseData = await response.json();

      // Clear progress interval
      clearInterval(progressInterval);

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || `Upload failed with status ${response.status}`);
      }

      // Success path
      setUploadProgress(100);
      setReceiptData(responseData.data);
      setActiveTab('review');
      
      // Store taskId if provided in the response
      if (responseData.data.nftGift && responseData.data.nftGift.taskId) {
        setTaskId(responseData.data.nftGift.taskId);
        setNftMintingStatus('processing');
      }

      toast({
        title: 'Receipt Uploaded Successfully',
        description: `We've processed your receipt from ${responseData.data.merchantName}.`,
        variant: 'default',
      });
      
      // Show immediate feedback about NFT minting process
      setTimeout(() => {
        toast({
          title: '✅ Receipt Processing Started',
          description: "Your NFT is being minted – we'll update you when it's ready.",
          variant: 'default',
        });
      }, 1500);
      
    } catch (error) {
      console.error("Error uploading receipt:", error);
      // Clear progress interval
      clearInterval(progressInterval);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setUploadProgress(0);
      setIsUploading(false);
      setError(errorMessage);
      
      toast({
        title: 'Upload Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Poll for task status updates
  useEffect(() => {
    if (!taskId || nftMintingStatus !== 'processing') return;

    const checkTaskStatus = async () => {
      try {
        const response = await fetch(`/api/task/${taskId}/status`);
        const data = await response.json();
        
        console.log("Task status update:", data);
        
        if (data.status === 'completed' && data.result) {
          setNftMintingStatus('completed');
          setNftTokenId(data.result.tokenId);
          
          toast({
            title: '🎉 NFT Created Successfully',
            description: `Your receipt is now securely stored on the blockchain!`,
            variant: 'default',
          });
          
        } else if (data.status === 'failed') {
          setNftMintingStatus('failed');
          setError(data.error || 'Failed to create NFT');
          
          toast({
            title: 'NFT Creation Failed',
            description: data.error || 'There was a problem creating your NFT',
            variant: 'destructive',
          });
        }
      } catch (err) {
        console.error("Error checking task status:", err);
      }
    };

    // Initial check
    checkTaskStatus();
    
    // Set up polling interval
    const interval = setInterval(checkTaskStatus, 5000);
    
    // Clean up
    return () => clearInterval(interval);
  }, [taskId, nftMintingStatus, toast]);

  const handleCameraClick = () => {
    // Mobile device camera access
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.setAttribute("accept", "image/*");
      fileInputRef.current.click();
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute("capture");
      fileInputRef.current.setAttribute("accept", "image/*,.pdf");
      fileInputRef.current.click();
    }
  };

  const handleNFTSelected = async (nft: any) => {
    setSelectedNft(nft);
    setShowNftPicker(false);
    
    // Here you would typically send this selection to your API
    // to associate the NFT with the receipt
    toast({
      title: "NFT Style Selected",
      description: `Your receipt will use the "${nft.name}" style.`,
    });
  };

  const handleCancelNFTSelection = () => {
    setShowNftPicker(false);
  };

  return (
    <div className="container py-8">
      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Receipt</TabsTrigger>
          <TabsTrigger value="review" disabled={!receiptData}>Review Receipt</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="mt-6">
          {!isUploading && (
            <Card>
              <CardHeader>
                <CardTitle>Upload a Receipt</CardTitle>
                <CardDescription>
                  Take a photo of your receipt or upload an image file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2" onClick={handleCameraClick}>
                        <Camera className="h-8 w-8" />
                        <span className="text-sm font-medium">Take Photo</span>
                      </Button>
                    </div>
                    <div>
                      <Button variant="outline" className="w-full h-32 flex flex-col items-center justify-center gap-2" onClick={handleBrowseClick}>
                        <FileImage className="h-8 w-8" />
                        <span className="text-sm font-medium">Browse Files</span>
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Upload Formats: JPEG, PNG, PDF (max 10MB)
                    </Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {isConnected ? (
                          <span className="text-green-600">Wallet Connected: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}</span>
                        ) : (
                          <span className="text-amber-600">Wallet Not Connected (required for BlockReceipt creation)</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">All receipts are encrypted by default</span>
                    </div>
                  </div>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                  />
                </div>
              </CardContent>
            </Card>
          )}
          
          {isUploading && (
            <Card>
              <CardHeader>
                <CardTitle>Processing Receipt</CardTitle>
                <CardDescription>
                  Please wait while we process your receipt
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  </div>
                  <h3 className="text-lg font-medium text-center mb-1">Analyzing Receipt</h3>
                  <p className="text-sm text-center text-muted-foreground mb-4">
                    {uploadProgress < 30 && "Uploading image..."}
                    {uploadProgress >= 30 && uploadProgress < 60 && "Scanning text..."}
                    {uploadProgress >= 60 && uploadProgress < 90 && "Extracting merchant and pricing data..."}
                    {uploadProgress >= 90 && "Finalizing..."}
                  </p>
                  <div className="w-full max-w-md mb-2">
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    {Math.round(uploadProgress)}% complete
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="review" className="mt-6">
          {receiptData && !showNftPicker && !isUploading && (
            <div>
              {nftMintingStatus !== 'idle' && <UploadSuccessMessage />}
              
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Receipt Details</CardTitle>
                      <CardDescription>
                        Review your receipt information
                      </CardDescription>
                    </div>
                    {receiptData.tier && (
                      <Badge className={`${tierColors[receiptData.tier.id as keyof typeof tierColors]} text-gray-800`}>
                        {tierDetails[receiptData.tier.id as keyof typeof tierDetails].title}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-medium">{receiptData.merchantName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(receiptData.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium">${receiptData.total.toFixed(2)}</p>
                        {receiptData.subtotal && (
                          <p className="text-sm text-muted-foreground">
                            Subtotal: ${receiptData.subtotal.toFixed(2)}
                          </p>
                        )}
                        {receiptData.tax && (
                          <p className="text-sm text-muted-foreground">
                            Tax: ${receiptData.tax.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="font-medium mb-2">Items</h4>
                      <div className="space-y-2">
                        {receiptData.items.map((item, i) => (
                          <div key={i} className="flex justify-between">
                            <span className="text-sm">{item.name}</span>
                            <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <TaskStatusMessage 
                      status={nftMintingStatus}
                      tokenId={nftTokenId || undefined}
                      error={error || undefined}
                    />
                    
                    {receiptData.nftGift && receiptData.nftGift.eligible && (
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <Receipt className="h-8 w-8 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-blue-800">
                              NFT Gift Eligible
                            </h3>
                            <p className="text-sm text-blue-700 mt-1">
                              Your purchase qualifies for a free NFT gift! We're creating it for you automatically.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
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
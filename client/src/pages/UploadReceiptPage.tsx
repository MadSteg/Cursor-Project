import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LucideFileUp, Camera, Receipt, CheckCircle, AlertCircle, FileImage, Wallet, Lock } from 'lucide-react';
import { useRef, useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import NFTArtPicker from '@/components/receipts/NFTArtPicker';
import NFTGiftStatus from '@/components/nft/NFTGiftStatus';
import NFTTaskStatus from '@/components/nft/NFTTaskStatus';
import { useWeb3Wallet } from '../hooks/useWeb3Wallet';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Get wallet info
  const { address, isConnected, connect } = useWeb3Wallet();
  
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
        await connect();
        // If connection fails, return early
        if (!isConnected) {
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

      toast({
        title: 'Receipt Uploaded Successfully',
        description: `We've processed your receipt from ${responseData.data.merchantName}.`,
        variant: 'default',
      });
    } catch (err: any) {
      console.error('Error uploading receipt:', err);
      
      // Clear interval
      clearInterval(progressInterval);
      
      // Show error
      setError(err.message || 'Failed to upload receipt');
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
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + Math.random() * 5, 95));
    }, 500);
    
    try {
      // Send the receipt data and selected NFT for minting
      const response = await apiRequest('POST', '/api/select-nft', {
        selectedNft: nft,
        receiptData
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to mint BlockReceipt');
      }
      
      clearInterval(progressInterval);
      
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
      clearInterval(progressInterval);
      
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
          {!isConnected ? (
            <Card>
              <CardHeader>
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>A wallet connection is required to mint BlockReceipt NFTs</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-center mb-6 text-muted-foreground max-w-md">
                  Connect your Ethereum wallet to upload and store receipts as verifiable NFTs.
                  Your wallet address is used to securely encrypt your receipt data.
                </p>
                <Button onClick={connect} className="gap-2">
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          ) : (
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
                          Select Receipt to Immortalize
                        </Button>
                        <p className="text-xs text-center text-muted-foreground">
                          JPG, PNG, PDF files accepted
                        </p>
                        <p className="text-xs text-center text-muted-foreground mt-1">
                          <span className="inline-block px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] mr-1">PRIVACY</span>
                          Receipt details are encrypted with Threshold TACo technology
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          )}
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
                  <ul className="space-y-2">
                    {receiptData.items?.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.name}</span>
                        <span className="font-medium">${item.price.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${receiptData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${receiptData.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${receiptData.total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* NFT Gift Status Display */}
                {receiptData.nftGift && (
                  <div className="mb-4">
                    {receiptData.nftGift.status === 'processing' && receiptData.nftGift.taskId ? (
                      <NFTTaskStatus 
                        taskId={receiptData.nftGift.taskId}
                        walletAddress={connected ? wallet?.address || '' : ''}
                        onComplete={(result) => {
                          // Update the NFT gift status when the task completes
                          if (receiptData && receiptData.nftGift) {
                            setReceiptData({
                              ...receiptData,
                              nftGift: {
                                ...receiptData.nftGift,
                                status: 'completed',
                                nft: {
                                  tokenId: result.tokenId || 'unknown',
                                  contract: result.contractAddress || '',
                                  name: result.name || 'BlockReceipt Gift NFT',
                                  image: result.imageUrl || '/nft-images/receipt-default.svg',
                                  marketplace: result.marketplace || 'OpenSea',
                                  price: result.price || 0.00
                                },
                                txHash: result.txHash
                              }
                            });
                          }
                        }}
                      />
                    ) : (
                      <NFTGiftStatus nftGift={receiptData.nftGift} />
                    )}
                  </div>
                )}
                
                {/* Encryption Notice */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-4">
                  <div className="flex items-start">
                    <Lock className="h-4 w-4 text-blue-600 mt-0.5 mr-2" />
                    <div>
                      <h4 className="text-sm font-medium text-slate-900">Receipt Data Protection</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        When minted, this receipt's line items will be encrypted with Threshold TACo 
                        technology. Only you will have access to unlock the details in your NFT wallet.
                      </p>
                      <div className="flex items-center mt-2">
                        <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                          PRIVATE
                        </Badge>
                        <span className="text-[10px] text-slate-500 ml-2">Powered by TACo proxy re-encryption</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    size="lg"
                    onClick={mintReceiptNFT}
                  >
                    Mint as BlockReceipt NFT
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Create a permanent, encrypted blockchain receipt
                  </p>
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
};
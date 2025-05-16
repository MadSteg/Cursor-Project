import React, { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { toast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FileImage, 
  Loader2, 
  Upload, 
  FileX, 
  RefreshCw, 
  Check, 
  X, 
  AlertCircle, 
  Receipt,
  Tag,
  Clock,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TaskStatusMessage from '../nft/TaskStatusMessage';
import { ReceiptEncryptionToggle } from '../receipt/ReceiptEncryptionToggle';
import { usePublicKey } from '@/hooks/usePublicKey';
import { receiptEncryptionClient } from '@/lib/receiptEncryptionClient';
import { useWalletConnect } from '@/hooks/useWalletConnect';

// Define receipt tiers locally to avoid import issues
type ReceiptTier = 'STANDARD' | 'PREMIUM' | 'LUXURY' | 'ULTRA';

// Local implementation of determineReceiptTier to avoid import issues
function determineReceiptTier(total: number): ReceiptTier {
  if (total >= 500) {
    return 'ULTRA';
  } else if (total >= 200) {
    return 'LUXURY';
  } else if (total >= 50) {
    return 'PREMIUM';
  } else {
    return 'STANDARD';
  }
}

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
  isEncrypted?: boolean;
  nftGift?: {
    status: string;
    message: string;
    eligible: boolean;
    taskId?: string;
  };
}

type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

/**
 * Improved Receipt Uploader Component
 * 
 * This component provides a cleaner, more intuitive receipt uploading experience.
 * It handles the full upload, OCR processing, and NFT minting workflow with clear
 * visual feedback at each step.
 */
export function ImprovedReceiptUploader() {
  // State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Encryption is always enabled with TaCo Proxy Re-Encryption
  const encryptionEnabled = true;
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [_, navigate] = useLocation();
  
  // Get user's TaCo public key for encryption
  const { publicKey, isLoading: keyLoading } = usePublicKey();
  
  // Get wallet connection
  const { walletAddress, connectMetaMask, isConnected } = useWalletConnect();

  /**
   * Handle file selection from input
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Reset states
    setErrorMessage(null);
    setReceiptData(null);
    setTaskId(null);
    
    // Set the selected file
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
      setActiveTab('preview');
    };
    reader.readAsDataURL(file);
  };

  /**
   * Handle file drop event
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
          setActiveTab('preview');
        };
        reader.readAsDataURL(file);
        
        // Set the file
        setSelectedFile(file);
        setErrorMessage(null);
        setReceiptData(null);
        setTaskId(null);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image (JPEG, PNG, GIF) or PDF file.",
          variant: "destructive",
        });
      }
    }
  };

  /**
   * Prevent default behavior for drag events
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * Process the receipt (OCR and analysis)
   */
  const processReceipt = async () => {
    if (!selectedFile) return;
    
    setUploadStatus('uploading');
    setUploadProgress(0);
    setErrorMessage(null);
    
    try {
      // Check if wallet is connected
      if (!isConnected && !walletAddress) {
        try {
          // Attempt to connect wallet first
          await connectMetaMask();
          // If connection fails or still no wallet address, show error
          if (!walletAddress) {
            throw new Error("Please connect your wallet before uploading receipts");
          }
        } catch (walletError) {
          console.error("Wallet connection error:", walletError);
          setUploadStatus('error');
          setErrorMessage("Please connect your wallet before uploading receipts");
          
          toast({
            title: "Wallet Required",
            description: "Please connect your wallet to mint NFT receipts",
            variant: "destructive",
          });
          
          return; // Exit early if wallet connection failed
        }
      }
      
      const formData = new FormData();
      formData.append('receipt', selectedFile);
      
      // Add encryption flag to the form data
      formData.append('encryptData', encryptionEnabled ? 'true' : 'false');
      
      // If encryption is enabled, add the public key to the form data
      if (encryptionEnabled && publicKey) {
        formData.append('publicKey', publicKey);
      }
      
      // Attach wallet address to the form data
      if (walletAddress) {
        formData.append('walletAddress', walletAddress);
        console.log('Including wallet address in upload:', walletAddress);
      }
      
      // Create XHR for progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/auto-process');
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress < 95 ? progress : 95); // Cap at 95% until processing completes
        }
      });
      
      // Set timeout for requests
      xhr.timeout = 60000; // 60 seconds
      
      // Handle completion
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadProgress(100);
          setUploadStatus('success');
          
          try {
            const response = JSON.parse(xhr.responseText);
            console.log('Receipt processed:', response);
            
            if (response.success) {
              // Store receipt data, with flag indicating if it's encrypted
              const receiptDataWithEncryptionFlag = {
                ...response.data,
                isEncrypted: encryptionEnabled
              };
              
              setReceiptData(receiptDataWithEncryptionFlag);
              setActiveTab('result');
              
              // Store task ID if available
              if (response.data.nftGift?.taskId) {
                setTaskId(response.data.nftGift.taskId);
              }
              
              toast({
                title: 'Receipt Processed Successfully',
                description: 'Your receipt data has been extracted and is being processed.',
              });
            } else {
              setUploadStatus('error');
              setErrorMessage(response.message || 'Failed to process receipt');
              
              toast({
                title: 'Processing Error',
                description: response.message || 'Failed to process receipt',
                variant: 'destructive',
              });
            }
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
            setUploadStatus('error');
            setErrorMessage('Invalid response from server');
            
            toast({
              title: 'Processing Error',
              description: 'Failed to understand server response',
              variant: 'destructive',
            });
          }
        } else {
          setUploadStatus('error');
          setErrorMessage(`Server error: ${xhr.statusText}`);
          
          toast({
            title: 'Upload Failed',
            description: `Error: ${xhr.statusText}`,
            variant: 'destructive',
          });
        }
      };
      
      // Handle errors
      xhr.onerror = () => {
        console.error('Network error during upload');
        setUploadStatus('error');
        setErrorMessage('Network error: Failed to connect to the server');
        
        toast({
          title: 'Network Error',
          description: 'Failed to connect to the server',
          variant: 'destructive',
        });
      };
      
      // Handle timeout
      xhr.ontimeout = () => {
        console.error('Request timed out');
        setUploadStatus('error');
        setErrorMessage('Request timed out. Please try again with a smaller image or check your connection.');
        
        toast({
          title: 'Request Timed Out',
          description: 'The request took too long to complete. Try again with a smaller image.',
          variant: 'destructive',
        });
      };
      
      // Send the request
      xhr.send(formData);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
      
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    }
  };

  /**
   * Reset the component state
   */
  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setReceiptData(null);
    setTaskId(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setErrorMessage(null);
    setActiveTab('upload');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Navigate to wallet to view NFTs
   */
  const viewNFTWallet = () => {
    navigate('/nft-wallet');
  };

  /**
   * Render status badge based on upload state
   */
  const renderStatusBadge = () => {
    switch (uploadStatus) {
      case 'uploading':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Uploading
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case 'success':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <X className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  /**
   * Render tier badge based on receipt total
   */
  const renderTierBadge = (total: number) => {
    const tier = determineReceiptTier(total);
    
    if (tier === 'ULTRA') {
      return (
        <Badge className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:bg-gradient-to-r hover:from-purple-700 hover:to-indigo-600">
          Ultra
        </Badge>
      );
    } else if (tier === 'LUXURY') {
      return (
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600">
          Luxury
        </Badge>
      );
    } else if (tier === 'PREMIUM') {
      return (
        <Badge className="bg-blue-600 hover:bg-blue-700">
          Premium
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline">
          Standard
        </Badge>
      );
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              <span>Upload Receipt</span>
            </CardTitle>
            <CardDescription>
              Upload a receipt image to create an NFT receipt with blockchain verification
            </CardDescription>
          </div>
          {renderStatusBadge()}
        </div>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="preview" disabled={!previewUrl}>Preview</TabsTrigger>
          <TabsTrigger value="result" disabled={!receiptData}>Result</TabsTrigger>
        </TabsList>
        
        {/* Upload Tab */}
        <TabsContent value="upload" className="p-0">
          <CardContent className="pt-6">
            <div 
              className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="p-4 bg-blue-50 rounded-full">
                  <FileImage className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Upload Receipt Image</h3>
                  <p className="text-gray-500 text-sm">
                    Drag and drop your receipt image here, or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Supported formats: JPEG, PNG, GIF, PDF
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        {/* Preview Tab */}
        <TabsContent value="preview" className="p-0">
          <CardContent className="pt-6">
            {previewUrl && (
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-full max-w-sm mx-auto">
                  {previewUrl.startsWith('data:image') ? (
                    <img 
                      src={previewUrl} 
                      alt="Receipt preview" 
                      className="w-full h-auto rounded-lg border shadow-sm object-contain"
                      style={{ maxHeight: '400px' }}
                    />
                  ) : (
                    <div className="w-full h-64 rounded-lg border shadow-sm flex items-center justify-center bg-gray-50">
                      <div className="flex flex-col items-center justify-center">
                        <FileImage className="h-16 w-16 text-gray-400 mb-2" />
                        <p className="text-gray-500">{selectedFile?.name}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {errorMessage && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
                
                {uploadStatus === 'uploading' && (
                  <div className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Uploading...</span>
                      <span className="text-sm font-medium">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                <div className="space-y-4 w-full">
                  {/* TaCo Encryption Indicator (always enabled) */}
                  <div className="flex justify-center w-full">
                    <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md mb-2 w-full">
                      <div className="flex-shrink-0 mr-3">
                        <Lock className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Protected with Threshold TaCo</p>
                        <p className="text-sm text-green-700">Your receipt data is secured with advanced proxy re-encryption</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="outline" onClick={resetUpload} disabled={uploadStatus === 'uploading'}>
                      Upload Different Image
                    </Button>
                    <Button 
                      onClick={processReceipt} 
                      disabled={uploadStatus === 'uploading' || !selectedFile}
                      className="flex items-center gap-2"
                    >
                      {uploadStatus === 'uploading' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          Process Receipt
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </TabsContent>
        
        {/* Result Tab */}
        <TabsContent value="result" className="p-0">
          <CardContent className="pt-6">
            {receiptData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column: Receipt data */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Receipt Details</h3>
                    {renderTierBadge(receiptData.total)}
                  </div>
                  
                  {/* Encryption Status */}
                  {receiptData.isEncrypted && (
                    <div className="mb-4">
                      <Alert className="bg-green-50 border-green-200">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <AlertTitle className="text-green-700">Encrypted Receipt</AlertTitle>
                        <AlertDescription className="text-green-600">
                          This receipt's metadata is secured with TaCo threshold encryption
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                  
                  {/* Merchant and Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Merchant</p>
                      <p className="font-medium">{receiptData.merchantName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{receiptData.date}</p>
                    </div>
                  </div>
                  
                  {/* Items */}
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Items</p>
                    <div className="max-h-60 overflow-y-auto border rounded-md">
                      <div className="divide-y">
                        {receiptData.items.length > 0 ? (
                          receiptData.items.map((item, index) => (
                            <div key={index} className="flex justify-between p-2">
                              <div className="flex flex-col">
                                <span className="font-medium">{item.name}</span>
                                {item.category && (
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Tag className="h-3 w-3 mr-1" />
                                    <span>{item.category}</span>
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-medium">${item.price.toFixed(2)}</div>
                                {item.quantity > 1 && (
                                  <div className="text-xs text-gray-500">
                                    Qty: {item.quantity}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-4">No items detected</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Totals */}
                  <div className="border rounded-md p-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-gray-500">Subtotal:</div>
                      <div className="text-right font-medium">
                        ${receiptData.subtotal?.toFixed(2) || "0.00"}
                      </div>
                      <div className="text-sm text-gray-500">Tax:</div>
                      <div className="text-right font-medium">
                        ${receiptData.tax?.toFixed(2) || "0.00"}
                      </div>
                      <div className="text-sm font-medium pt-2 border-t">Total:</div>
                      <div className="text-right font-semibold pt-2 border-t">
                        ${receiptData.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right column: NFT status */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="text-center space-y-4">
                    <h3 className="text-lg font-semibold">NFT Receipt Status</h3>
                    
                    {taskId ? (
                      <div className="border rounded-lg bg-white p-4">
                        <TaskStatusMessage taskId={taskId} />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 gap-3">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <Clock className="h-6 w-6 text-blue-600" />
                        </div>
                        <h4 className="font-medium">Waiting for processing</h4>
                        <p className="text-sm text-gray-500">
                          Your receipt is queued for processing
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      onClick={viewNFTWallet}
                      className="w-full" 
                    >
                      View NFT Wallet
                    </Button>
                    
                    <p className="text-xs text-gray-500">
                      Your NFT receipt will appear in your wallet after processing is complete
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={resetUpload} disabled={uploadStatus === 'uploading'}>
          Reset
        </Button>
        {activeTab === 'result' && receiptData && (
          <Button variant="outline" size="sm" onClick={() => navigate('/upload-receipt')}>
            Upload Another Receipt
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ImprovedReceiptUploader;
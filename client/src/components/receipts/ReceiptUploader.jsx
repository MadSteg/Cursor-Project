import { useState, useRef } from 'react';
import { useNavigate } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Receipt, 
  Upload, 
  Image as ImageIcon, 
  Camera, 
  FileText, 
  RefreshCw, 
  CheckCircle,
  Star, 
  Sparkle
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

/**
 * Receipt Uploader Component
 * 
 * This component allows users to upload receipt images for processing and NFT minting.
 * It supports drag-and-drop or file selection, shows a preview of the uploaded image,
 * displays the parsed receipt data, and allows the user to select the NFT tier.
 */
export default function ReceiptUploader() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Component state
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('upload');
  
  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };
  
  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };
  
  // Prevent default behavior for drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  // Handle the file once selected or dropped
  const handleFileSelection = (file) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPEG, PNG, etc.)',
        variant: 'destructive',
      });
      return;
    }
    
    // Create a preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
    setUploadedFile(file);
    setActiveTab('preview');
    setReceiptData(null); // Clear any previous receipt data
  };
  
  // Process the uploaded receipt
  const processReceipt = async () => {
    if (!uploadedFile) return;
    
    setIsProcessing(true);
    setUploadProgress(0);
    
    try {
      // Create FormData object to send the file
      const formData = new FormData();
      formData.append('receipt', uploadedFile);
      
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) clearInterval(progressInterval);
          return Math.min(prev + 10, 90);
        });
      }, 200);
      
      // Send the file to the backend
      const response = await apiRequest('POST', '/api/upload-receipt', formData, {
        headers: {
          // Don't set Content-Type, let the browser set it with the boundary parameter
        }
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReceiptData(data.data);
          setActiveTab('result');
          toast({
            title: 'Receipt processed',
            description: 'Your receipt has been successfully processed.',
          });
        } else {
          throw new Error(data.message || 'Failed to process receipt');
        }
      } else {
        throw new Error(`HTTP error ${response.status}`);
      }
    } catch (error) {
      console.error('Error processing receipt:', error);
      toast({
        title: 'Processing failed',
        description: error.message || 'An error occurred while processing your receipt.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Mint the NFT receipt
  const mintNftReceipt = async () => {
    if (!receiptData) return;
    
    try {
      toast({
        title: 'Initiating NFT minting',
        description: 'Preparing to mint your receipt as an NFT...',
      });
      
      // In a real app, this would call the NFT minting endpoint
      // For now, we'll just navigate to the NFT wallet page
      setTimeout(() => {
        navigate('/nft-wallet');
      }, 2000);
    } catch (error) {
      console.error('Error minting NFT receipt:', error);
      toast({
        title: 'Minting failed',
        description: error.message || 'An error occurred while minting your NFT receipt.',
        variant: 'destructive',
      });
    }
  };
  
  // Reset the component state
  const resetUpload = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setUploadedFile(null);
    setPreviewUrl(null);
    setReceiptData(null);
    setUploadProgress(0);
    setActiveTab('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Render tier badge based on the assigned tier
  const renderTierBadge = (tierId) => {
    switch(tierId) {
      case 'LUXURY':
        return (
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Sparkle className="h-3.5 w-3.5 mr-1" />
            Luxury
          </Badge>
        );
      case 'PREMIUM':
        return (
          <Badge className="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600">
            <Star className="h-3.5 w-3.5 mr-1" />
            Premium
          </Badge>
        );
      case 'STANDARD':
        return (
          <Badge className="bg-blue-600 hover:bg-blue-700">
            Standard
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Basic
          </Badge>
        );
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          <span>Upload Receipt</span>
        </CardTitle>
        <CardDescription>
          Upload a receipt image to create an NFT receipt with blockchain verification
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="preview" disabled={!uploadedFile}>Preview</TabsTrigger>
          <TabsTrigger value="result" disabled={!receiptData}>Result</TabsTrigger>
        </TabsList>
        
        {/* Upload Tab */}
        <TabsContent value="upload">
          <CardContent className="p-6">
            <div 
              className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="p-4 bg-blue-50 rounded-full">
                  <Upload className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Upload Receipt Image</h3>
                  <p className="text-gray-500 text-sm">
                    Drag and drop your receipt image here, or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Supported formats: JPEG, PNG, WebP
                  </p>
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        {/* Preview Tab */}
        <TabsContent value="preview">
          <CardContent className="p-6">
            {previewUrl && (
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-full max-w-sm mx-auto">
                  <img 
                    src={previewUrl} 
                    alt="Receipt preview" 
                    className="w-full h-auto rounded-lg border shadow-sm object-contain"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
                <div className="space-y-2 w-full">
                  <h3 className="text-center font-medium">Ready to process this receipt?</h3>
                  <div className="w-full flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="outline" onClick={resetUpload}>
                      Upload Different Image
                    </Button>
                    <Button 
                      onClick={processReceipt} 
                      disabled={isProcessing}
                      className="flex items-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Processing ({uploadProgress}%)
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4" />
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
        <TabsContent value="result">
          <CardContent className="p-6">
            {receiptData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left column: Receipt data */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Receipt Details</h3>
                    {renderTierBadge(receiptData.tier.id)}
                  </div>
                  
                  {/* Merchant and Date */}
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm text-gray-500">Merchant</Label>
                      <p className="font-medium">{receiptData.merchantName}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Date</Label>
                      <p>{receiptData.date}</p>
                    </div>
                  </div>
                  
                  {/* Items */}
                  <div>
                    <Label className="text-sm text-gray-500">Items</Label>
                    <div className="max-h-60 overflow-y-auto mt-1 border rounded-md">
                      <div className="p-2 space-y-1">
                        {receiptData.items.length > 0 ? (
                          receiptData.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm border-b pb-1 last:border-b-0 last:pb-0">
                              <span className="truncate" title={item.name}>{item.name}</span>
                              <span className="font-medium">${item.price.toFixed(2)}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-2">No items detected</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Totals */}
                  <div className="border rounded-md p-3 bg-slate-50 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${receiptData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${receiptData.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                      <span>Total</span>
                      <span>${receiptData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Right column: NFT tier and minting */}
                <div className="border rounded-lg p-4 bg-gradient-to-b from-gray-50 to-white">
                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">Ready to Mint Your NFT</h3>
                      <p className="text-sm text-gray-500">
                        Your receipt qualifies for the following NFT tier:
                      </p>
                    </div>
                    
                    {/* NFT Tier Card */}
                    <div className={`p-4 rounded-lg ${
                      receiptData.tier.id === 'LUXURY' 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : receiptData.tier.id === 'PREMIUM'
                          ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white'
                          : receiptData.tier.id === 'STANDARD'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                      <div className="flex justify-center mb-2">
                        {receiptData.tier.id === 'LUXURY' ? (
                          <Sparkle className="h-10 w-10 text-yellow-300" />
                        ) : receiptData.tier.id === 'PREMIUM' ? (
                          <Star className="h-10 w-10 text-yellow-200" />
                        ) : (
                          <CheckCircle className="h-10 w-10 text-white" />
                        )}
                      </div>
                      <h4 className="text-xl font-bold mb-1">{receiptData.tier.title} Tier</h4>
                      <p className="text-sm mb-3 opacity-90">{receiptData.tier.description}</p>
                      <div className="text-center font-bold text-2xl mb-2">
                        ${receiptData.tier.price.toFixed(2)}
                      </div>
                      <p className="text-xs opacity-80">
                        This includes blockchain transaction fees and permanent storage
                      </p>
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="w-full" 
                      onClick={mintNftReceipt}
                    >
                      Mint NFT Receipt
                    </Button>
                    
                    <p className="text-xs text-gray-500">
                      By minting, you confirm this is a legitimate receipt 
                      and you have the right to create an NFT from it.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" onClick={resetUpload}>
          Reset
        </Button>
        <div className="text-xs text-gray-400">
          Your receipts are encrypted and secured by advanced threshold cryptography
        </div>
      </CardFooter>
    </Card>
  );
}
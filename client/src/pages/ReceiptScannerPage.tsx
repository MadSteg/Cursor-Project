import { useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, FileText, Check, X, Coins } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

/**
 * Interface for receipt data structure
 */
interface ReceiptData {
  merchantName: string;
  date: string;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  category?: string;
  confidence: number;
  rawText?: string;
}

/**
 * Component for scanning and processing receipt images
 */
export default function ReceiptScannerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  /**
   * Handle file selection
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProcessingError(null);
    setReceiptData(null);
    
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.includes('image/')) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);

    // Generate image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Process the selected receipt image
   */
  const processReceipt = async () => {
    if (!selectedFile) {
      toast({
        title: "No image selected",
        description: "Please select a receipt image to process",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingError(null);

      // Create form data
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Send request to OCR service
      const response = await apiRequest('POST', '/api/ocr/upload', formData, true);
      const data = await response.json();
      
      // Update state with response data
      if (data.success && data.data) {
        setReceiptData(data.data);
        toast({
          title: "Receipt processed",
          description: `Successfully processed receipt from ${data.data.merchantName}`,
          variant: "default"
        });
      } else {
        throw new Error(data.error || 'Failed to process receipt');
      }
    } catch (error) {
      console.error('Receipt processing error:', error);
      setProcessingError(error instanceof Error ? error.message : 'Unknown error occurred');
      toast({
        title: "Processing failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Clear the selected file and results
   */
  const handleClear = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setReceiptData(null);
    setProcessingError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Format currency amount from cents to dollars
   */
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  /**
   * Render receipt item list
   */
  const renderItems = () => {
    if (!receiptData?.items?.length) return null;

    return (
      <div className="mt-4">
        <h3 className="font-medium mb-2">Items</h3>
        <div className="space-y-1">
          {receiptData.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <div className="flex-1">
                <span>{item.name}</span>
                {item.quantity > 1 && <span className="text-gray-500 ml-2">x{item.quantity}</span>}
              </div>
              <div className="font-medium">{formatCurrency(item.price)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
        Receipt Scanner
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column: Image upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Receipt</CardTitle>
            <CardDescription>
              Upload a photo of your receipt to extract its details
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="mb-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
            
            {imagePreview && (
              <div className="mt-4 relative">
                <img 
                  src={imagePreview} 
                  alt="Receipt preview" 
                  className="max-h-96 mx-auto object-contain border rounded"
                />
                <button 
                  onClick={handleClear}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
            <Button 
              onClick={processReceipt} 
              disabled={!selectedFile || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Process Receipt
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Right column: Results */}
        <Card>
          <CardHeader>
            <CardTitle>Receipt Data</CardTitle>
            <CardDescription>
              {receiptData ? 'Extracted information from your receipt' : 'Upload and process a receipt to see results'}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {processingError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                <div className="flex items-center">
                  <X className="mr-2 h-5 w-5 text-red-500" />
                  <span className="font-medium">Processing failed:</span>
                </div>
                <p className="text-sm mt-1">{processingError}</p>
              </div>
            )}
            
            {receiptData ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">{receiptData.merchantName}</h2>
                  <span className="text-gray-600">{receiptData.date}</span>
                </div>
                
                {receiptData.category && (
                  <div className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm">
                    {receiptData.category}
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  {renderItems()}
                  
                  <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span className="font-medium">{formatCurrency(receiptData.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span className="font-medium">{formatCurrency(receiptData.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(receiptData.total)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mt-4">
                  <div className="flex items-center">
                    <Check className="mr-1 h-3 w-3 text-green-500" />
                    <span>OCR confidence: {Math.round(receiptData.confidence * 100)}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                <FileText className="h-12 w-12 mb-4 text-gray-300" />
                <p>No receipt data yet</p>
                <p className="text-sm mt-2">Upload a receipt image and click "Process Receipt"</p>
              </div>
            )}
          </CardContent>
          
          {receiptData && (
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Check className="mr-2 h-4 w-4" />
                Save Receipt
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
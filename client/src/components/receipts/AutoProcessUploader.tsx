import React, { useState } from 'react';
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
import { FileImage, Loader2, Upload, FileX } from 'lucide-react';
import TaskStatusMessage from '@/components/nft/TaskStatusMessage';

/**
 * Auto Process Receipt Uploader Component
 * This component allows users to upload and automatically process receipts
 * without requiring wallet connection.
 */
export function AutoProcessUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [_, navigate] = useLocation();

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Set the selected file
    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Auto-trigger upload when a file is selected
    handleUpload(file);
  };

  // Handle receipt upload
  const handleUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('receipt', file);
      
      // Make fetch request with progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/auto-process');
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });
      
      // Handle completion
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          console.log('Receipt processed:', response);
          
          if (response.success) {
            setReceiptData(response.data);
            
            // Store task ID if available
            if (response.data.nftGift?.taskId) {
              setTaskId(response.data.nftGift.taskId);
            }
            
            toast({
              title: 'Receipt Processed',
              description: 'Your receipt has been automatically processed.',
            });
          } else {
            toast({
              title: 'Processing Error',
              description: response.message || 'Failed to process receipt',
              variant: 'destructive',
            });
          }
        } else {
          console.error('Upload error:', xhr.statusText);
          toast({
            title: 'Upload Failed',
            description: `Error: ${xhr.statusText}`,
            variant: 'destructive',
          });
        }
        setIsUploading(false);
      };
      
      // Handle errors
      xhr.onerror = () => {
        console.error('Network error during upload');
        toast({
          title: 'Network Error',
          description: 'Failed to connect to the server',
          variant: 'destructive',
        });
        setIsUploading(false);
      };
      
      // Send the request
      xhr.send(formData);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  };

  // Clear the file and reset state
  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setReceiptData(null);
    setTaskId(null);
    setUploadProgress(0);
  };

  // View receipt details
  const viewReceiptDetails = () => {
    if (receiptData?.id) {
      navigate(`/receipts/${receiptData.id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left Column: Receipt Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Receipt</CardTitle>
          <CardDescription>
            Upload a receipt image to automatically scan and mint as an NFT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!selectedFile && (
              <label
                htmlFor="auto-receipt-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileImage className="w-12 h-12 mb-4 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF or PDF (MAX 100MB)
                  </p>
                </div>
                <input
                  id="auto-receipt-upload"
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/gif,application/pdf"
                  onChange={handleFileChange}
                />
              </label>
            )}

            {previewUrl && (
              <div className="relative">
                <div className="relative rounded-lg overflow-hidden bg-gray-100 h-64 flex items-center justify-center">
                  {previewUrl.startsWith('data:image') ? (
                    <img
                      src={previewUrl}
                      alt="Receipt Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <FileImage className="w-16 h-16 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        {selectedFile?.name}
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 rounded-full"
                  onClick={handleClear}
                  disabled={isUploading}
                >
                  <FileX className="h-4 w-4" />
                </Button>
              </div>
            )}

            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleClear} disabled={!selectedFile || isUploading}>
            Clear
          </Button>
          <Button
            onClick={() => selectedFile && handleUpload(selectedFile)}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Auto-Process
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Right Column: Result */}
      <Card>
        <CardHeader>
          <CardTitle>Scan Results</CardTitle>
          <CardDescription>
            Receipt information will appear here after processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {receiptData ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Merchant</p>
                  <p className="text-lg font-semibold">{receiptData.merchantName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-lg font-semibold">{receiptData.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-lg font-semibold">
                    ${receiptData.total.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Tax</p>
                  <p className="text-lg font-semibold">
                    ${receiptData.tax?.toFixed(2) || "0.00"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Items</p>
                <div className="max-h-40 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {receiptData.items.map((item: any, index: number) => (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                            ${item.price.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {taskId && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">NFT Status</p>
                  <TaskStatusMessage taskId={taskId} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
              <FileImage className="h-12 w-12 mb-4 text-gray-300" />
              <p>No receipt data yet</p>
              <p className="text-sm mt-2">Upload a receipt image to see results here</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            disabled={!receiptData}
            onClick={viewReceiptDetails}
          >
            View Receipt Details
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
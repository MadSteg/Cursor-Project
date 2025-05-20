import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import UploadDropzone from './UploadDropzone';
import JSConfetti from 'js-confetti';

interface ReceiptData {
  merchantName: string;
  date: string;
  total: string;
  subtotal?: string;
  tax?: string;
  category?: string;
  items?: { name: string; price: string; quantity: number }[];
}

// Set up confetti instance
let jsConfetti: JSConfetti | null = null;
if (typeof window !== 'undefined') {
  jsConfetti = new JSConfetti();
}

const EnhancedReceiptUploader: React.FC = () => {
  const { walletAddress, isConnected } = useWallet();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState<'idle' | 'uploading' | 'processing' | 'minting' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  
  // Handle file upload
  const handleUpload = async (uploadedFile: File) => {
    // Reset state
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStep('uploading');
    setUploadError(null);
    setReceiptData(null);
    setTokenId(null);
    setPreviewUrl(URL.createObjectURL(uploadedFile));
    setFile(uploadedFile);
    
    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('receipt', uploadedFile);
      formData.append('walletAddress', walletAddress || '');
      
      // Upload file and get receipt data
      setUploadProgress(25);
      setUploadStep('processing');
      
      const uploadResponse = await fetch('/api/upload-and-mint', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Failed to upload receipt');
      }
      
      setUploadProgress(75);
      setUploadStep('minting');
      
      // Get response data
      const responseData = await uploadResponse.json();
      
      // Update receipt data
      setReceiptData({
        merchantName: responseData.merchantName || 'Unknown Merchant',
        date: responseData.date || new Date().toLocaleDateString(),
        total: responseData.total ? `$${responseData.total.toFixed(2)}` : 'N/A',
        subtotal: responseData.subtotal ? `$${responseData.subtotal.toFixed(2)}` : undefined,
        tax: responseData.tax ? `$${responseData.tax.toFixed(2)}` : undefined,
        category: responseData.category,
        items: responseData.items?.map((item: any) => ({
          name: item.name,
          price: `$${item.price.toFixed(2)}`,
          quantity: item.quantity || 1,
        })),
      });
      
      // Set token ID
      setTokenId(responseData.tokenId || null);
      
      // Update progress and step
      setUploadProgress(100);
      setUploadStep('success');
    } catch (error: any) {
      console.error('Error uploading receipt:', error);
      setUploadError(error.message || 'An error occurred while processing your receipt');
      setUploadStep('error');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle retry
  const handleRetry = () => {
    setUploadStep('idle');
    setUploadError(null);
    setReceiptData(null);
    setTokenId(null);
    setPreviewUrl(null);
    setFile(null);
  };
  
  // Set up a timeout to move to the next step if processing takes too long
  useEffect(() => {
    let timeoutId: number;
    
    if (uploadStep === 'processing') {
      // Add a timeout that moves to minting step after 10 seconds if still processing
      timeoutId = window.setTimeout(() => {
        if (uploadStep === 'processing') {
          setUploadProgress(75);
          setUploadStep('minting');
        }
      }, 10000); // 10 seconds
    }
    
    // Show confetti when upload is successful
    if (uploadStep === 'success' && jsConfetti) {
      jsConfetti.addConfetti({
        confettiColors: ['#7C3AED', '#4F46E5', '#3B82F6', '#3730A3', '#8B5CF6'],
        confettiRadius: 6,
        confettiNumber: 200,
      });
    }
    
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [uploadStep]);

  // Render upload progress
  const renderUploadProgress = () => {
    return (
      <div className="w-full max-w-md mx-auto p-4 bg-card rounded-lg border shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-foreground mb-2">
            {uploadStep === 'uploading' && 'Uploading Receipt...'}
            {uploadStep === 'processing' && 'Processing Receipt with OCR...'}
            {uploadStep === 'minting' && 'Encrypting & Minting NFT Receipt...'}
            {uploadStep === 'success' && 'Receipt Successfully Processed!'}
            {uploadStep === 'error' && 'Error Processing Receipt'}
          </h3>
          
          {uploadStep !== 'error' && (
            <div className="w-full bg-secondary rounded-full h-2.5 mb-2">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground">
            {uploadStep === 'uploading' && 'Uploading your receipt... Please wait.'}
            {uploadStep === 'processing' && (
              <>Our OCR engine is analyzing your receipt. This typically takes 5-10 seconds.</>
            )}
            {uploadStep === 'minting' && (
              <>Encrypting receipt data with TACo PRE technology and creating your NFT on the blockchain. Only you will have access to the original receipt data.</>
            )}
            {uploadStep === 'success' && 'Your receipt has been converted to an NFT with TACo PRE encryption. Only you control who can access your receipt data!'}
            {uploadStep === 'error' && uploadError}
          </p>
        </div>
        
        {previewUrl && (
          <div className="mb-4 border rounded-lg overflow-hidden">
            <img
              src={previewUrl}
              alt="Receipt preview"
              className="w-full object-contain max-h-48"
            />
          </div>
        )}
        
        {receiptData && uploadStep === 'success' && (
          <div className="mb-4 border rounded-lg p-4 bg-background">
            <h4 className="font-medium mb-2">{receiptData.merchantName}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Date:</p>
                <p>{receiptData.date}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total:</p>
                <p className="font-bold">{receiptData.total}</p>
              </div>
              {receiptData.category && (
                <div>
                  <p className="text-muted-foreground">Category:</p>
                  <p>{receiptData.category}</p>
                </div>
              )}
              {tokenId && (
                <div>
                  <p className="text-muted-foreground">Token ID:</p>
                  <p className="font-mono text-xs truncate">{tokenId}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-center space-x-2">
          {uploadStep === 'success' && (
            <>
              <a
                href="/wallet/gallery"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white brand-gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                View in Gallery
              </a>
              <button
                onClick={handleRetry}
                className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Upload Another
              </button>
            </>
          )}
          
          {uploadStep === 'error' && (
            <button
              onClick={handleRetry}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      {(uploadStep === 'idle' || !isConnected) ? (
        <UploadDropzone 
          onUpload={handleUpload} 
          isUploading={isUploading}
          className="mb-8"
        />
      ) : (
        renderUploadProgress()
      )}
    </div>
  );
};

export default EnhancedReceiptUploader;
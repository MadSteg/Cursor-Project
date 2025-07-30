import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import NFTRewardPreview from '../components/NFTRewardPreview';

interface UploadProgressProps {
  step: 'uploading' | 'processing' | 'minting' | 'success' | 'error';
  progress: number;
  error: string | null;
  previewUrl: string | null;
  receipt: any;
  onRetry: () => void;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ 
  step, 
  progress, 
  error, 
  previewUrl,
  receipt,
  onRetry
}) => {
  return (
    <div className="mt-6 p-6 border rounded-lg bg-card">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">
          {step === 'uploading' && 'Uploading Receipt...'}
          {step === 'processing' && 'Processing Receipt...'}
          {step === 'minting' && 'Minting NFT Receipt...'}
          {step === 'success' && 'Receipt NFT Created!'}
          {step === 'error' && 'Error Processing Receipt'}
        </h3>

        {step !== 'error' && (
          <div className="w-full bg-secondary rounded-full h-2.5 mb-2">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          {step === 'uploading' && 'Uploading your receipt... Please wait.'}
          {step === 'processing' && 'Analyzing receipt with OCR and extracting data...'}
          {step === 'minting' && 'Creating your NFT receipt on the blockchain...'}
          {step === 'success' && 'Your receipt has been successfully converted to an NFT!'}
          {step === 'error' && error}
        </p>
      </div>

      {previewUrl && (
        <div className="mb-4 flex justify-center">
          <div className="border rounded-lg overflow-hidden max-w-xs">
            <img src={previewUrl} alt="Receipt preview" className="max-h-64 object-contain" />
          </div>
        </div>
      )}

      {receipt && step === 'success' && (
        <div className="mb-4 p-4 border rounded-lg bg-background">
          <h4 className="font-medium mb-2">{receipt.merchantName || 'Merchant'}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Date:</p>
              <p>{receipt.date || new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total:</p>
              <p className="font-bold">${receipt.total?.toFixed(2) || '0.00'}</p>
            </div>
            {receipt.category && (
              <div>
                <p className="text-muted-foreground">Category:</p>
                <p>{receipt.category}</p>
              </div>
            )}
            {receipt.tokenId && (
              <div>
                <p className="text-muted-foreground">Token ID:</p>
                <p className="font-mono text-xs truncate">{receipt.tokenId}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-center space-x-3">
        {step === 'success' && (
          <>
            <a
              href="/wallet/gallery"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white brand-gradient-bg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              View in Gallery
            </a>
            <button
              onClick={onRetry}
              className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Upload Another
            </button>
          </>
        )}

        {step === 'error' && (
          <button
            onClick={onRetry}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

// Dropzone Component
const Dropzone: React.FC<{ onUpload: (file: File) => void; isConnected: boolean }> = ({ 
  onUpload, 
  isConnected 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };
  
  if (!isConnected) {
    return (
      <div className="mt-6 p-6 border-2 border-dashed rounded-lg border-primary/20 bg-card flex flex-col items-center justify-center">
        <div className="text-center py-10">
          <svg 
            className="mx-auto h-12 w-12 text-muted-foreground" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M14 12h4" />
            <path d="M6 12h4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium">Connect your wallet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Please connect your wallet to upload receipts
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className={`mt-6 p-6 border-2 border-dashed rounded-lg ${isDragging ? 'border-primary bg-primary/5' : 'border-primary/20'} transition-colors`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center py-10">
        <svg 
          className="mx-auto h-12 w-12 text-muted-foreground" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium">Drag and drop your receipt</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          PNG, JPG, JPEG or PDF up to 10MB
        </p>
        <div className="mt-4">
          <label htmlFor="file-upload" className="relative cursor-pointer bg-primary text-white px-4 py-2 rounded-md font-medium hover:bg-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
            <span>Immortalize Receipt</span>
            <input 
              id="file-upload" 
              name="file-upload" 
              type="file" 
              className="sr-only" 
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

const Upload: React.FC = () => {
  const { isConnected, walletAddress } = useWallet();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<'idle' | 'uploading' | 'processing' | 'minting' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handle file upload
  const handleUpload = async (file: File) => {
    if (!isConnected || !walletAddress) {
      return;
    }

    // Reset state
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setReceipt(null);
    setUploadStep('uploading');
    setPreviewUrl(URL.createObjectURL(file));

    // Create form data
    const formData = new FormData();
    formData.append('receipt', file);
    formData.append('walletAddress', walletAddress);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      // Set processing step after simulated upload
      setTimeout(() => {
        setUploadStep('processing');
      }, 1500);

      // Actual upload
      const response = await fetch('/api/upload-and-mint', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload receipt');
      }

      // Simulate minting step
      setUploadStep('minting');
      setUploadProgress(95);

      // Get response data
      const data = await response.json();
      setReceipt(data);

      // Success!
      setUploadProgress(100);
      setUploadStep('success');
    } catch (error: any) {
      console.error('Upload error:', error);
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
    setReceipt(null);
    setPreviewUrl(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 brand-gradient-text">Upload Receipt</h1>
      
      <div className="bg-card shadow-sm rounded-lg p-6 border mb-8 animate-fade-in">
        <h2 className="text-xl font-semibold mb-4">Receipt Security & Privacy</h2>
        <p className="text-muted-foreground mb-6">
          BlockReceipt.ai uses OCR technology to extract information from your receipts and 
          securely stores them as NFTs on the Polygon blockchain. We prioritize your privacy 
          with advanced encryption, giving you complete control over your financial data.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 border rounded-lg bg-background hover:shadow-md transition-shadow">
            <h3 className="font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              TACo PRE Privacy Protection
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Your receipt data is encrypted using Threshold Network's TACo PRE (Threshold Access Control Proxy Re-Encryption) technology. 
              Only you can decrypt and view your complete receipt details.
            </p>
            <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
              <li>Access control tied directly to your wallet</li>
              <li>Encrypted data stored on IPFS and blockchain</li>
              <li>Selective disclosure for warranty claims</li>
            </ul>
          </div>
          
          <div className="p-4 border rounded-lg bg-background hover:shadow-md transition-shadow">
            <h3 className="font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17h6m-3-3v6" />
              </svg>
              Automatic Categorization
            </h3>
            <p className="text-sm text-muted-foreground">
              Our OCR technology extracts and categorizes receipt data while keeping your sensitive information private. The extracted data is encrypted before being stored on the blockchain.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg bg-background hover:shadow-md transition-shadow">
            <h3 className="font-medium mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              How TACo Protects Your Data
            </h3>
            <p className="text-sm text-muted-foreground">
              1. Your receipt data is encrypted with keys only you control
              <br />
              2. A secure policy is created linking to your wallet address
              <br />
              3. Only you can decrypt and access the full receipt details
            </p>
          </div>
        </div>
        
        {/* Expanded Privacy Explainer */}
        <div className="p-5 mb-6 border border-indigo-200 dark:border-indigo-800/30 rounded-lg bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-900/10 dark:to-blue-900/10">
          <h3 className="text-lg font-medium mb-3 text-center brand-gradient-text">How Your Data Stays Private</h3>
          <p className="text-sm text-muted-foreground mb-4">
            BlockReceipt.ai uses Threshold Network's TACo PRE technology to ensure that your receipt data remains private,
            even though it's stored on a public blockchain. Here's how it works:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/80 dark:bg-gray-900/60 p-3 rounded-lg">
              <h4 className="font-medium mb-2 text-sm">What makes TACo PRE special?</h4>
              <p className="text-xs text-muted-foreground">
                Unlike traditional encryption where data can only be accessed by the original key holder,
                TACo's Proxy Re-Encryption allows for <strong>selective, controlled access</strong> to your encrypted data without
                ever exposing your private keys. This means you remain in complete control of who can view your receipt details.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-900/60 p-3 rounded-lg">
              <h4 className="font-medium mb-2 text-sm flex items-center">
                Public vs. Private Data
                <span className="ml-2 relative group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="absolute left-full ml-2 top-0 w-48 p-2 bg-black/90 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    Why is this metadata locked? Your data is protected by Threshold TACo technology for maximum privacy.
                  </span>
                </span>
              </h4>
              <p className="text-xs text-muted-foreground">
                When you mint a receipt NFT, only basic metadata like the timestamp and merchant name are visible publicly.
                The detailed receipt contents, purchase information, item details, and financial data remain
                encrypted and are only accessible to you as the NFT's minter and owner.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-3/5">
          {uploadStep === 'idle' ? (
            <Dropzone onUpload={handleUpload} isConnected={isConnected} />
          ) : (
            <UploadProgress 
              step={uploadStep}
              progress={uploadProgress}
              error={uploadError}
              previewUrl={previewUrl}
              receipt={receipt}
              onRetry={handleRetry}
            />
          )}
        </div>
        
        <div className="lg:w-2/5">
          {isConnected && (
            <div className="animate-slide-up">
              <NFTRewardPreview 
                merchantName={receipt?.merchantName} 
                category={receipt?.category} 
                total={receipt?.total || 0} 
              />
            </div>
          )}
          
          {/* Show completed collection progress when connected */}
          {isConnected && (
            <div className="mt-6 p-6 border rounded-lg bg-card animate-fade-in">
              <h3 className="text-lg font-semibold mb-4">Collection Progress</h3>
              <div className="flex items-center mb-4">
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div className="brand-gradient-bg h-2.5 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <span className="ml-2 text-sm font-medium">35%</span>
              </div>
              <p className="text-sm text-muted-foreground">
                You've collected 7 out of 20 Bulldog NFTs in this collection!
              </p>
              <div className="mt-3">
                <a href="/nft-browser" className="text-sm text-primary hover:underline">
                  View your collection →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
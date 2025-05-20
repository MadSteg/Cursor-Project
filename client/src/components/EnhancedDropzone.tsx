import React, { useState, useCallback } from 'react';
import { useWallet } from '../contexts/WalletContext';

interface EnhancedDropzoneProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
  className?: string;
}

const EnhancedDropzone: React.FC<EnhancedDropzoneProps> = ({ 
  onUpload, 
  isUploading,
  className = '' 
}) => {
  const { isConnected } = useWallet();
  const [dragActive, setDragActive] = useState(false);
  
  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);
  
  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  }, [onUpload]);
  
  // Handle file input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  }, [onUpload]);
  
  // If not connected, show connect wallet message
  if (!isConnected) {
    return (
      <div className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg border-primary/20 bg-card ${className}`}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="h-10 w-10 text-muted-foreground mb-3"
          >
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M14 12h4" />
            <path d="M6 12h4" />
          </svg>
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">Connect your wallet</span> to upload receipts
          </p>
        </div>
      </div>
    );
  }
  
  // If uploading, show progress
  if (isUploading) {
    return (
      <div className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg border-primary/20 bg-card ${className}`}>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-3"></div>
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">Uploading...</span>
          </p>
          <p className="text-xs text-muted-foreground">
            This may take a moment
          </p>
        </div>
      </div>
    );
  }
  
  // Default dropzone
  return (
    <div
      className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors ${
        dragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-primary/20 bg-card hover:bg-card/80'
      } ${className}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-10 h-10 mb-3 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="mb-2 text-sm text-muted-foreground">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, or PDF (MAX. 10MB)
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleChange}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default EnhancedDropzone;
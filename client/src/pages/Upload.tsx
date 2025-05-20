import React from 'react';
import EnhancedReceiptUploader from '../components/EnhancedReceiptUploader';

const Upload: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Receipt</h1>
      
      <div className="bg-card shadow-sm rounded-lg p-6 border mb-8">
        <h2 className="text-xl font-semibold mb-4">Converting Receipts to NFTs</h2>
        <p className="text-muted-foreground mb-6">
          BlockReceipt.ai uses OCR technology to extract information from your receipts and 
          securely stores them as NFTs on the Polygon blockchain. Your receipt data is encrypted
          using Threshold Network's TACo PRE technology, giving you complete control over who can access your information.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 border rounded-lg bg-background">
            <h3 className="font-medium mb-2">Privacy Protection</h3>
            <p className="text-sm text-muted-foreground">
              Your receipt data is encrypted and secure. Only you control who can access it.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg bg-background">
            <h3 className="font-medium mb-2">Automatic Categorization</h3>
            <p className="text-sm text-muted-foreground">
              We automatically categorize your purchases for easy tracking and analysis.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg bg-background">
            <h3 className="font-medium mb-2">Warranty Management</h3>
            <p className="text-sm text-muted-foreground">
              Keep track of warranties with blockchain verification for your important purchases.
            </p>
          </div>
        </div>
      </div>
      
      <EnhancedReceiptUploader />
    </div>
  );
};

export default Upload;
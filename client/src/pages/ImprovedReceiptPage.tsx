import React from 'react';
import { Helmet } from 'react-helmet';
import ImprovedReceiptUploader from '@/components/receipts/ImprovedReceiptUploader';

// Ensure the component doesn't directly import from receiptOcr.ts
// which seems to be causing issues

/**
 * Improved Receipt Upload Page
 * 
 * This page provides a streamlined, user-friendly experience for uploading
 * receipt images, extracting data with OCR, and creating blockchain NFT receipts.
 */
const ImprovedReceiptPage: React.FC = () => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Helmet>
        <title>Upload Receipt - BlockReceipt.ai</title>
        <meta 
          name="description" 
          content="Upload your receipts securely and create blockchain-based NFT receipts with privacy controls."
        />
      </Helmet>
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Create Your BlockReceipt
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Upload your receipt image and our advanced system will automatically extract the data, 
          create a blockchain-based NFT receipt, and offer you a collectible NFT reward.
        </p>
      </div>
      
      <ImprovedReceiptUploader />
      
      <div className="mt-12 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Why Use BlockReceipt.ai?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-medium">Privacy-First</h3>
            <p className="text-sm text-gray-600">Your data is encrypted and you control who can access it.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 rounded-full mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-medium">Verifiable & Secure</h3>
            <p className="text-sm text-gray-600">Blockchain-based receipts are tamper-proof and always accessible.</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 p-3 rounded-full mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-8 0v7H4a2 2 0 00-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 00-2-2h-1v-5a4 4 0 00-8 0v5" />
              </svg>
            </div>
            <h3 className="font-medium">Collectible Rewards</h3>
            <p className="text-sm text-gray-600">Earn exclusive NFT artwork based on your receipt contents.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedReceiptPage;
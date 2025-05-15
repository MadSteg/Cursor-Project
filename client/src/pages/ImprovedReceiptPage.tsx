import React from 'react';
import { Helmet } from 'react-helmet';
import ImprovedReceiptUploader from '@/components/receipts/ImprovedReceiptUploader';

/**
 * Improved Receipt Upload Page
 * 
 * This page provides a streamlined, user-friendly experience for uploading
 * receipt images, extracting data with OCR, and creating blockchain NFT receipts.
 */
export default function ImprovedReceiptPage() {
  return (
    <>
      <Helmet>
        <title>Upload Receipt | BlockReceipt.ai</title>
        <meta 
          name="description" 
          content="Transform your paper and digital receipts into secure, verifiable NFTs on the blockchain" 
        />
      </Helmet>

      <div className="container py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Receipt to NFT</h1>
            <p className="text-muted-foreground mt-2">
              Transform your receipts into secure, verifiable NFTs stored on the blockchain with privacy controls
            </p>
          </div>

          <div className="py-6">
            <ImprovedReceiptUploader />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex flex-col h-full">
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-blue-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Digitize Any Receipt</h3>
                <p className="text-gray-500 text-sm flex-grow">
                  Upload receipts from any retailer, restaurant, or service provider. Our advanced OCR technology extracts and categorizes transaction data.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex flex-col h-full">
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-purple-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Encrypted Privacy</h3>
                <p className="text-gray-500 text-sm flex-grow">
                  Your receipt data is encrypted using advanced cryptography. Only you can view sensitive information, with optional selective access grants.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex flex-col h-full">
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-green-100 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                    <path d="M19.3 14.8C19.3 14.8 18.3 19.5 13.7 19.5C9.2 19.5 5.7 15.7 5.7 12C5.7 8.3 9.2 4.5 13.7 4.5C15.3 4.5 16.7 5 17.9 5.8" />
                    <path d="M20.5 9.5 19.3 14.8 14 13.6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Automatic Processing</h3>
                <p className="text-gray-500 text-sm flex-grow">
                  No wallet setup needed. We handle the blockchain part for you, automatically minting your receipt as a beautiful, collectible NFT.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
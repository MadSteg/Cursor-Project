import React from 'react';
import { Helmet } from 'react-helmet';
import { PageHeader } from '@/components/layout/PageHeader';
import { AutoProcessUploader } from '@/components/receipts/AutoProcessUploader';

/**
 * Auto Process Receipt Page
 * This page is for testing and development only and uses the server-side
 * auto-processing flow that doesn't require a wallet connection.
 */
export default function AutoProcessReceiptPage() {
  return (
    <>
      <Helmet>
        <title>Auto-Process Receipt | BlockReceipt.ai</title>
        <meta 
          name="description" 
          content="Upload and automatically process receipts without requiring a wallet connection" 
        />
      </Helmet>

      <div className="container py-8 max-w-7xl">
        <PageHeader 
          title="Auto-Process Receipt" 
          description="Upload and automatically process receipts without requiring a wallet connection. For testing purposes only."
        />

        <div className="py-6">
          <AutoProcessUploader />
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Development Mode</h3>
          <p className="text-yellow-700">
            This feature is only available in development mode and uses a testing wallet address. No real blockchain transactions will be executed.
          </p>
        </div>
      </div>
    </>
  );
}
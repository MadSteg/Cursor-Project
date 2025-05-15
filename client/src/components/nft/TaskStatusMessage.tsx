import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Loader2, Clock } from 'lucide-react';

interface TaskStatusMessageProps {
  status: 'idle' | 'processing' | 'completed' | 'failed';
  tokenId?: string;
  error?: string;
}

export default function TaskStatusMessage({ status, tokenId, error }: TaskStatusMessageProps) {
  if (status === 'idle') {
    return null;
  }
  
  return (
    <div className="mb-6">
      {status === 'processing' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                <Badge className="bg-blue-500 text-white">Processing</Badge> Your NFT is being minted
              </h3>
              <div className="mt-2 mb-1 text-sm text-blue-700">
                <p>This process takes about 15 seconds to complete.</p>
              </div>
              <Progress value={60} className="h-1.5 max-w-sm" />
            </div>
          </div>
        </div>
      )}
      
      {status === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                <Badge className="bg-green-500 text-white">Complete</Badge> NFT Successfully Minted
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Your receipt has been permanently stored on the blockchain.</p>
                {tokenId && (
                  <p className="mt-1 font-semibold">
                    Token ID: {tokenId}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {status === 'failed' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                <Badge className="bg-red-500 text-white">Failed</Badge> NFT Minting Issue
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>There was a problem creating your NFT.</p>
                {error && (
                  <p className="mt-1 text-xs">
                    Error: {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
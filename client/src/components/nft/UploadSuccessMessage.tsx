import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function UploadSuccessMessage() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">
            <Badge className="bg-green-500 text-white">Success</Badge> Receipt Uploaded Successfully
          </h3>
          <div className="mt-2 text-sm text-green-700">
            <p>Your receipt has been processed, and your NFT is being created.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
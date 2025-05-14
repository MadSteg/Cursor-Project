import React from 'react';
import ReceiptVerification from '@/components/receipts/ReceiptVerification';
import { FileCheck, ExternalLink, ShieldCheck, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const VerifyReceipt: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold flex items-center">
            <FileCheck className="mr-3 h-8 w-8 text-primary" />
            Verify Receipt Authenticity
          </h1>
          <p className="text-xl text-muted-foreground">
            Confirm the validity of any blockchain receipt
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <ReceiptVerification />
          </div>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5" />
                Why Verify Receipts?
              </h3>
              <p className="text-blue-700 text-sm">
                BlockReceipt verification provides tamper-proof confirmation that a receipt exists on the blockchain and hasn't been altered or falsified.
              </p>
              <ul className="mt-3 text-blue-700 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Prove authenticity for returns or warranty claims</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Verify purchase history for expense reports</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Confirm legitimate receipts for tax purposes</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-purple-50 border border-purple-100 rounded-lg p-5">
              <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Privacy Protected
              </h3>
              <p className="text-purple-700 text-sm">
                Even when verifying receipts, your sensitive purchase data remains protected through our TACo encryption technology.
              </p>
              <div className="mt-4">
                <Link href="/encryption-settings">
                  <Button variant="outline" size="sm" className="w-full text-purple-700 border-purple-200 bg-purple-50 hover:bg-purple-100">
                    Manage Privacy Settings
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="rounded-lg border p-5">
              <h3 className="font-semibold mb-2">Other Verification Options</h3>
              <div className="space-y-3">
                <Link href="/scan-receipt">
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    Scan Physical Receipt
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/nft-wallet">
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    View Your NFT Receipts
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <a href="https://polygonscan.com/" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    Polygon Explorer
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyReceipt;
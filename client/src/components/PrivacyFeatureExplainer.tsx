import React from 'react';
import { Shield, Lock, Eye, Key, UserCheck } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';

/**
 * PrivacyFeatureExplainer Component
 * 
 * This component explains the TACo PRE (Threshold Access Control Proxy Re-Encryption)
 * technology used in BlockReceipt.ai to ensure that only the NFT minter has access
 * to the OCR data extracted from receipts.
 */
const PrivacyFeatureExplainer: React.FC = () => {
  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <div>
            <CardTitle className="text-2xl">Privacy-First Receipt Storage</CardTitle>
            <CardDescription>
              How BlockReceipt.ai protects your financial data
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold flex items-center mb-2">
              <Lock className="mr-2 h-5 w-5 text-blue-500" />
              What is TACo PRE?
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              TACo PRE (Threshold Access Control Proxy Re-Encryption) is an advanced cryptographic
              technology that ensures your receipt data remains private even when stored on a public
              blockchain. Unlike traditional encryption, TACo PRE creates a cryptographic policy
              that lets <strong>only you</strong> access your full receipt data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-md font-semibold flex items-center mb-2">
                <Key className="mr-2 h-5 w-5 text-emerald-500" />
                Your Keys, Your Data
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                When you upload a receipt, the sensitive data is encrypted with keys only you control.
                Without your wallet's private key, nobody else can read the complete receipt details.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-md font-semibold flex items-center mb-2">
                <Eye className="mr-2 h-5 w-5 text-amber-500" />
                Public vs. Private Data
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Only basic metadata (like timestamp and merchant name) is visible publicly.
                The detailed receipt contents, purchase information, and financial data remain
                encrypted and private.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
              <h3 className="text-md font-semibold flex items-center mb-2">
                <UserCheck className="mr-2 h-5 w-5 text-purple-500" />
                Selective Disclosure
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Need to share proof of purchase for a warranty? TACo PRE lets you grant temporary access
                to specific information without revealing your entire purchase history.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-slate-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">How Your Receipt Data Stays Private</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 dark:text-slate-300">
              <li>You upload a receipt image and our OCR extracts the data</li>
              <li>The extracted data is encrypted using TACo PRE technology</li>
              <li>A unique "policy" is created that only your wallet can access</li>
              <li>The encrypted data is stored with your NFT on IPFS and the blockchain</li>
              <li>Only you can decrypt and view the complete receipt details</li>
            </ol>
          </div>
        </div>
      </CardContent>
      
      <Separator className="my-2" />
      
      <CardFooter className="flex justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Powered by Threshold Network's TACo PRE technology
        </p>
        <Button variant="outline" size="sm" className="text-sm">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PrivacyFeatureExplainer;
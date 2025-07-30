import React from 'react';

/**
 * PrivacyFeatureExplainer Component
 * 
 * This component explains the TACo PRE (Threshold Access Control Proxy Re-Encryption)
 * technology used in BlockReceipt.ai to ensure that only the NFT minter has access
 * to the OCR data extracted from receipts.
 */
const PrivacyFeatureExplainer: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-2 border-b border-indigo-200 dark:border-indigo-800/30">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 brand-gradient-bg rounded-full flex items-center justify-center text-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold brand-gradient-text">Privacy-First Receipt Storage</h2>
            <p className="text-muted-foreground">
              How BlockReceipt.ai protects your financial data
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="bg-white dark:bg-gray-900/60 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold flex items-center mb-2">
            <div className="h-6 w-6 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            What is TACo PRE?
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            TACo PRE (Threshold Access Control Proxy Re-Encryption) is an advanced cryptographic
            technology that ensures your receipt data remains private even when stored on a public
            blockchain. Unlike traditional encryption, TACo PRE creates a cryptographic policy
            that lets <strong>only you</strong> access your full receipt data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-900/60 p-4 rounded-lg shadow-sm">
            <h3 className="text-md font-semibold flex items-center mb-2">
              <div className="h-5 w-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              Your Keys, Your Data
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              When you upload a receipt, the sensitive data is encrypted with keys only you control.
              Without your wallet's private key, nobody else can read the complete receipt details.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-900/60 p-4 rounded-lg shadow-sm">
            <h3 className="text-md font-semibold flex items-center mb-2">
              <div className="h-5 w-5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              Public vs. Private Data
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Only basic metadata (like timestamp and merchant name) is visible publicly.
              The detailed receipt contents, purchase information, and financial data remain
              encrypted and private.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-900/60 p-4 rounded-lg shadow-sm">
            <h3 className="text-md font-semibold flex items-center mb-2">
              <div className="h-5 w-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Selective Disclosure
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Need to share proof of purchase for a warranty? TACo PRE lets you grant temporary access
              to specific information without revealing your entire purchase history.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">How Your Receipt Data Stays Private</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>You upload a receipt image and our OCR extracts the data</li>
            <li>The extracted data is encrypted using TACo PRE technology</li>
            <li>A unique "policy" is created that only your wallet can access</li>
            <li>The encrypted data is stored with your NFT on IPFS and the blockchain</li>
            <li>Only you can decrypt and view the complete receipt details</li>
          </ol>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-indigo-200 dark:border-indigo-800/30 flex justify-between items-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Powered by Threshold Network's TACo PRE technology
        </p>
        <a href="#" className="text-sm px-4 py-2 border border-indigo-300 dark:border-indigo-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
          Learn More
        </a>
      </div>
    </div>
  );
};

export default PrivacyFeatureExplainer;
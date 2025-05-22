import React from 'react';
import { Link } from 'wouter';

const HowItWorks: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-center brand-gradient-text">How BlockReceipt Works</h1>
      <p className="text-xl text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
        A seamless experience for both customers and merchants
      </p>

      {/* How It Works Process Section */}
      <div className="bg-card rounded-xl p-8 mb-16 shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border">
            <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3">Check Out</h3>
            <p className="text-muted-foreground">
              Customer chooses "Digital Receipt" option at checkout
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border">
            <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3">Mint Receipt</h3>
            <p className="text-muted-foreground">
              POS system automatically mints an NFT receipt to customer's wallet
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border">
            <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3">Receive Rewards</h3>
            <p className="text-muted-foreground">
              Customer earns loyalty points and special NFT collectibles
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-sm border">
            <div className="bg-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              4
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Returns</h3>
            <p className="text-muted-foreground">
              Scan wallet for verified proof of purchase in seconds
            </p>
          </div>
        </div>
        
        <div className="flex justify-center mt-10">
          <Link to="/upload" className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
            Try It Now
          </Link>
        </div>
      </div>

      {/* Security & Privacy Section */}
      <h2 className="text-2xl font-bold mb-6">Security & Privacy</h2>
      <p className="text-lg mb-8">
        BlockReceipt.ai uses OCR technology to extract information from your receipts and securely stores them as
        NFTs on the Polygon blockchain. We prioritize your privacy with advanced encryption, giving you complete
        control over your financial data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-card p-6 rounded-xl border">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full text-purple-600 dark:text-purple-400 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">TACo PRE Privacy Protection</h3>
          </div>
          
          <p className="mb-4">
            Your receipt data is encrypted using Threshold Network's TACo PRE (Threshold Access Control
            Proxy Re-Encryption) technology. Only you can decrypt and view your complete receipt details.
          </p>
          
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Access control tied directly to your wallet
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Encrypted data stored on IPFS and blockchain
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              Selective disclosure for warranty claims
            </li>
          </ul>
        </div>

        <div className="bg-card p-6 rounded-xl border">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Automatic Categorization</h3>
          </div>
          
          <p className="mb-4">
            Our OCR technology extracts and categorizes receipt data while keeping your sensitive information private. The extracted data is encrypted before being stored on the blockchain.
          </p>
        </div>

        <div className="bg-card p-6 rounded-xl border">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600 dark:text-green-400 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">How TACo Protects Your Data</h3>
          </div>
          
          <ol className="space-y-2 list-decimal pl-5">
            <li>Your receipt data is encrypted with keys only you control</li>
            <li>A secure policy is created linking to your wallet address</li>
            <li>Only you can decrypt and access the full receipt details</li>
          </ol>
        </div>
      </div>

      {/* How Your Data Stays Private */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-8 mb-16">
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-600 dark:text-purple-400">How Your Data Stays Private</h2>
        
        <p className="text-lg mb-8">
          BlockReceipt.ai uses Threshold Network's TACo PRE technology to ensure that your receipt data
          remains private, even though it's stored on a public blockchain. Here's how it works:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">
            <h3 className="text-xl font-semibold mb-3">What makes TACo PRE special?</h3>
            <p>
              Unlike traditional encryption where data can only be accessed by the original key holder,
              TACo's Proxy Re-Encryption allows for <strong>selective, controlled access</strong> to your
              encrypted data without ever exposing your private keys. This means you remain in
              complete control of who can view your receipt details.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">
            <h3 className="text-xl font-semibold mb-3">Public vs. Private Data</h3>
            <p>
              When you mint a receipt NFT, only basic metadata like the timestamp and merchant
              name are visible publicly. The detailed receipt contents, purchase information, item details,
              and financial data remain encrypted and are only accessible to you as the NFT's minter and
              owner.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy First Receipt Storage */}
      <div className="bg-card rounded-xl p-8 border mb-16">
        <h2 className="text-2xl font-bold mb-2 text-center">Your Privacy, Your Control, Our Priority</h2>
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Privacy-First Receipt Storage</h3>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            What is TACo PRE?
          </h3>
          <p className="text-muted-foreground">
            TACo PRE (Threshold Access Control Proxy Re-Encryption) is an advanced cryptographic technology
            that ensures your receipt data remains private even when stored on a public blockchain. Unlike
            traditional encryption, TACo PRE creates a cryptographic policy that lets <strong>only you</strong> access your full
            receipt data.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              Your Keys, Your Data
            </h3>
            <p className="text-sm text-muted-foreground">
              When you upload a receipt, the sensitive data is encrypted with keys only you control. Without your wallet's
              private key, nobody else can read the complete receipt details.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-400 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
              Public vs. Private Data
            </h3>
            <p className="text-sm text-muted-foreground">
              Only basic metadata (like timestamp and merchant name) is visible publicly. The detailed receipt contents,
              purchase information, and financial data remain encrypted and private.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              Selective Disclosure
            </h3>
            <p className="text-sm text-muted-foreground">
              Need to share proof of purchase for a warranty? TACo PRE lets you grant temporary access to specific
              information without revealing your entire purchase history.
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border">
          <h3 className="text-xl font-semibold mb-4">How Your Receipt Data Stays Private</h3>
          
          <ol className="space-y-3">
            <li className="flex items-start">
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 w-7 h-7 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">1</span>
              <p>You upload a receipt image and our OCR extracts the data</p>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 w-7 h-7 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">2</span>
              <p>The extracted data is encrypted using TACo PRE technology</p>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 w-7 h-7 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">3</span>
              <p>A unique "policy" is created that only your wallet can access</p>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 w-7 h-7 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">4</span>
              <p>The encrypted data is stored with your NFT on IPFS and the blockchain</p>
            </li>
            <li className="flex items-start">
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 w-7 h-7 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">5</span>
              <p>Only you can decrypt and view the complete receipt details</p>
            </li>
          </ol>
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Powered by Threshold Network's TACo PRE technology
        </div>
      </div>

      {/* Character NFT Rarity Levels */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-8 border mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Character NFT Rarity Levels</h2>
        <p className="text-lg text-center mb-8 max-w-3xl mx-auto">
          Discover our exclusive character NFTs with unique traits and varying rarity levels that you can earn by using BlockReceipt.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center">
              <span className="w-4 h-4 bg-amber-500 rounded-full mr-2"></span>
              Legendary (Very Rare)
            </h3>
            <p className="text-sm text-muted-foreground">
              The rarest NFTs with special traits and unique accessories. 
              Only a small percentage of mints result in Legendary characters.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center">
              <span className="w-4 h-4 bg-purple-600 rounded-full mr-2"></span>
              Epic (Rare)
            </h3>
            <p className="text-sm text-muted-foreground">
              Distinctive NFTs with uncommon traits and special appearances.
              A lucky mint might reward you with these special characters.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center">
              <span className="w-4 h-4 bg-blue-600 rounded-full mr-2"></span>
              Rare
            </h3>
            <p className="text-sm text-muted-foreground">
              Somewhat uncommon NFTs with interesting traits and accessories.
              These have a moderate chance of appearing in your collection.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center">
              <span className="w-4 h-4 bg-green-600 rounded-full mr-2"></span>
              Uncommon
            </h3>
            <p className="text-sm text-muted-foreground">
              Less common NFTs with distinct features that set them apart.
              You'll find these moderately often in your minting journey.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center">
              <span className="w-4 h-4 bg-gray-600 rounded-full mr-2"></span>
              Common
            </h3>
            <p className="text-sm text-muted-foreground">
              The most frequently encountered NFTs. Though common, each still has 
              its own personality and unique look.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border shadow-sm flex items-center justify-center">
            <Link to="/nft-browser" className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium">
              View All NFTs
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">Ready to Experience Privacy-First Digital Receipts?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Start using BlockReceipt.ai today and take control of your purchase data while enjoying 
          the benefits of blockchain-powered digital receipts.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/upload" className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            Mint a BlockReceipt
          </Link>
          <Link to="/nft-browser" className="px-6 py-3 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
            Browse NFT Gallery
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
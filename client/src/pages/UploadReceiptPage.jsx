import { Helmet } from 'react-helmet';
import ReceiptUploader from '@/components/receipts/ReceiptUploader';

/**
 * Upload Receipt Page
 * 
 * This page presents the receipt upload interface where users can
 * upload receipt images to be processed and minted as NFTs.
 */
export default function UploadReceiptPage() {
  return (
    <>
      <Helmet>
        <title>Upload Receipt | BlockReceipt.ai</title>
        <meta name="description" content="Upload your receipt to create a verified NFT receipt with blockchain-powered security" />
      </Helmet>
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Upload Receipt</h1>
          <p className="text-muted-foreground max-w-3xl">
            Transform your paper or digital receipts into secure, verifiable NFT receipts 
            with advanced encryption and blockchain verification.
          </p>
        </div>
        
        <div className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-4xl mx-auto">
            <div className="space-y-2">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-700 text-xl font-bold">1</span>
              </div>
              <h3 className="font-medium">Upload Receipt</h3>
              <p className="text-sm text-muted-foreground">Upload your receipt image or PDF</p>
            </div>
            
            <div className="space-y-2">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-700 text-xl font-bold">2</span>
              </div>
              <h3 className="font-medium">Review Data</h3>
              <p className="text-sm text-muted-foreground">Our AI extracts and verifies the receipt details</p>
            </div>
            
            <div className="space-y-2">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                <span className="text-blue-700 text-xl font-bold">3</span>
              </div>
              <h3 className="font-medium">Mint NFT</h3>
              <p className="text-sm text-muted-foreground">Create your blockchain-secured NFT receipt</p>
            </div>
          </div>
        </div>
        
        <ReceiptUploader />
        
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Why Create NFT Receipts?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Secure & Private</h3>
              <p className="text-sm text-gray-600">
                Your receipt data is encrypted with threshold encryption technology, 
                ensuring only you can access your data. Even our system administrators 
                cannot see your private information.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Verifiable Proof</h3>
              <p className="text-sm text-gray-600">
                Blockchain-verified receipts provide immutable proof of purchase,
                which can be used for warranty claims, returns, expense tracking,
                and more.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Selective Sharing</h3>
              <p className="text-sm text-gray-600">
                Grant access to specific parts of your receipt to third parties like
                accountants or warranty providers without revealing unnecessary details.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Environmental Benefits</h3>
              <p className="text-sm text-gray-600">
                Replace wasteful paper receipts with digital, blockchain-powered receipts
                that never fade, get lost, or end up in landfills.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
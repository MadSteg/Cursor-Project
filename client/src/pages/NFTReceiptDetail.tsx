import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from '@/hooks/use-toast';
import NFTReceiptCard from '@/components/receipts/NFTReceiptCard';

export default function NFTReceiptDetail() {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const receiptId = parseInt(id || '0');

  // Fetch receipt details
  const { data: receipt, isLoading, error } = useQuery({
    queryKey: [`/api/nft-receipts/${receiptId}`],
    queryFn: async () => {
      if (!receiptId) return null;
      const response = await fetch(`/api/nft-receipts/${receiptId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch receipt details');
      }
      return response.json();
    },
    enabled: !!receiptId && receiptId > 0
  });

  // Loading state
  if (isLoading) {
    return (
      <main className="container py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-1/3 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="aspect-square bg-muted rounded col-span-1"></div>
            <div className="space-y-4 col-span-2">
              <div className="h-8 w-3/4 bg-muted rounded"></div>
              <div className="h-6 w-1/2 bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-full bg-muted rounded"></div>
              <div className="h-4 w-2/3 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !receipt) {
    return (
      <main className="container py-10">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Receipt Not Found</h1>
          <p className="text-muted-foreground mb-6">The NFT receipt you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => setLocation("/")}>
            Back to Dashboard
          </Button>
        </div>
      </main>
    );
  }

  // Mock data for development - will be replaced with real data from backend
  const mockData = {
    receiptId: receiptId,
    transactionHash: receipt.transactionHash || '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    nftId: receipt.tokenId || `NFT-${Date.now()}`,
    tier: receipt.tier || 'standard',
    productName: receipt.productName || 'Example Product',
    merchantName: receipt.merchantName || 'Example Merchant',
    purchaseDate: receipt.createdAt || new Date().toISOString(),
    totalAmount: receipt.amount || 0.01,
    ipfsHash: receipt.ipfsHash || 'ipfs://QmExampleHashGoesHere',
    nftImageUrl: receipt.imageUrl || '/products/receipt-placeholder.jpg'
  };

  // View on block explorer
  const handleViewOnBlockExplorer = () => {
    // Polygon Amoy explorer URL
    const explorerUrl = `https://amoy.polygonscan.com/tx/${mockData.transactionHash}`;
    window.open(explorerUrl, '_blank');
  };

  return (
    <main className="container py-10">
      <Button
        variant="ghost"
        onClick={() => setLocation("/")}
        className="mb-6"
      >
        ← Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* NFT Receipt Card */}
        <div className="lg:col-span-1">
          <NFTReceiptCard
            receiptId={mockData.receiptId}
            transactionHash={mockData.transactionHash}
            nftId={mockData.nftId}
            tier={mockData.tier}
            productName={mockData.productName}
            merchantName={mockData.merchantName}
            purchaseDate={mockData.purchaseDate}
            totalAmount={mockData.totalAmount}
            ipfsHash={mockData.ipfsHash}
            nftImageUrl={mockData.nftImageUrl}
            onViewOnBlockExplorer={handleViewOnBlockExplorer}
          />
        </div>

        {/* Receipt Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Receipt #{mockData.receiptId}</CardTitle>
                  <CardDescription>
                    Purchased on {new Date(mockData.purchaseDate).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className="capitalize">{mockData.tier} Tier</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Product Details */}
              <div>
                <h3 className="text-lg font-medium mb-2">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Product Name</p>
                    <p className="font-medium">{mockData.productName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Merchant</p>
                    <p className="font-medium">{mockData.merchantName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purchase Date</p>
                    <p className="font-medium">{new Date(mockData.purchaseDate).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-medium">${mockData.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Blockchain Details */}
              <div>
                <h3 className="text-lg font-medium mb-2">Blockchain Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Network</p>
                    <p className="font-medium">Polygon Amoy (Testnet)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NFT ID</p>
                    <p className="font-medium">{mockData.nftId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction Hash</p>
                    <p className="font-medium text-sm break-all">{mockData.transactionHash}</p>
                  </div>
                  {mockData.ipfsHash && (
                    <div>
                      <p className="text-sm text-muted-foreground">IPFS Data</p>
                      <p className="font-medium text-sm break-all">{mockData.ipfsHash}</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Receipt Features */}
              <div>
                <h3 className="text-lg font-medium mb-2">Receipt Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-3 flex flex-col items-center justify-center text-center space-y-1">
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p className="text-sm font-medium">Authenticity Verification</p>
                  </div>
                  <div className="border rounded-md p-3 flex flex-col items-center justify-center text-center space-y-1">
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    <p className="text-sm font-medium">Transferable</p>
                  </div>
                  <div className="border rounded-md p-3 flex flex-col items-center justify-center text-center space-y-1">
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                    </svg>
                    <p className="text-sm font-medium">IPFS Storage</p>
                  </div>
                  <div className="border rounded-md p-3 flex flex-col items-center justify-center text-center space-y-1">
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-sm font-medium">Encrypted Data</p>
                  </div>
                  <div className="border rounded-md p-3 flex flex-col items-center justify-center text-center space-y-1">
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <p className="text-sm font-medium">Purchase Proof</p>
                  </div>
                  <div className="border rounded-md p-3 flex flex-col items-center justify-center text-center space-y-1">
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    <p className="text-sm font-medium">Transaction History</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NFTReceiptTier } from "@shared/products";
import { useState } from "react";

interface NFTReceiptCardProps {
  receiptId: number;
  transactionHash: string;
  nftId: string;
  tier: string;
  productName: string;
  merchantName: string;
  purchaseDate: string;
  totalAmount: number;
  ipfsHash?: string;
  nftImageUrl: string;
  onViewOnBlockExplorer?: () => void;
}

export default function NFTReceiptCard({
  receiptId,
  transactionHash,
  nftId,
  tier,
  productName,
  merchantName,
  purchaseDate,
  totalAmount,
  ipfsHash,
  nftImageUrl,
  onViewOnBlockExplorer
}: NFTReceiptCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const getTierColorClass = () => {
    switch(tier) {
      case NFTReceiptTier.STANDARD:
        return "bg-blue-50 border-blue-200";
      case NFTReceiptTier.PREMIUM:
        return "bg-purple-50 border-purple-200";
      case NFTReceiptTier.LUXURY:
        return "bg-amber-50 border-amber-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };
  
  const getTierBadgeClass = () => {
    switch(tier) {
      case NFTReceiptTier.STANDARD:
        return "bg-blue-100 text-blue-800";
      case NFTReceiptTier.PREMIUM:
        return "bg-purple-100 text-purple-800";
      case NFTReceiptTier.LUXURY:
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="perspective">
      <div 
        className={`relative transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.6s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front of the card */}
        <Card className={`w-full ${getTierColorClass()} border-2 absolute backface-hidden`} 
          style={{
            backfaceVisibility: 'hidden',
            position: isFlipped ? 'absolute' : 'relative'
          }}>
          <CardHeader className="relative">
            <div className="absolute top-4 right-4">
              <Badge className={getTierBadgeClass()}>
                {tier.toUpperCase()} NFT
              </Badge>
            </div>
            <CardTitle className="text-xl font-bold">Digital Receipt</CardTitle>
            <CardDescription>NFT ID: {nftId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md overflow-hidden border">
              <img 
                src={nftImageUrl || "/images/receipt-placeholder.jpg"} 
                alt="NFT Receipt"
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Product:</span>
                <span className="text-sm">{productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Merchant:</span>
                <span className="text-sm">{merchantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Purchase Date:</span>
                <span className="text-sm">{new Date(purchaseDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Total Amount:</span>
                <span className="text-sm">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={handleFlip}>
              View Details
            </Button>
            {onViewOnBlockExplorer && (
              <Button variant="ghost" size="sm" onClick={onViewOnBlockExplorer}>
                View on Chain
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Back of the card */}
        <Card className={`w-full ${getTierColorClass()} border-2 absolute backface-hidden rotate-y-180`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: isFlipped ? 'relative' : 'absolute'
          }}>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Technical Details</CardTitle>
            <CardDescription>Blockchain verification information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="space-y-1">
                <span className="text-sm font-medium">Receipt ID:</span>
                <span className="block text-sm overflow-hidden text-ellipsis">{receiptId}</span>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium">Transaction Hash:</span>
                <span className="block text-sm overflow-hidden text-ellipsis">{transactionHash}</span>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium">NFT ID:</span>
                <span className="block text-sm overflow-hidden text-ellipsis">{nftId}</span>
              </div>
              {ipfsHash && (
                <div className="space-y-1">
                  <span className="text-sm font-medium">IPFS Data:</span>
                  <span className="block text-sm overflow-hidden text-ellipsis">{ipfsHash}</span>
                </div>
              )}
              <div className="space-y-1">
                <span className="text-sm font-medium">Blockchain:</span>
                <span className="block text-sm">Polygon Amoy</span>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium">Token Standard:</span>
                <span className="block text-sm">ERC-1155</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={handleFlip}>
              View Receipt
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.open(`https://ipfs.io/ipfs/${ipfsHash}`, '_blank')}
              disabled={!ipfsHash}
            >
              View IPFS Data
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
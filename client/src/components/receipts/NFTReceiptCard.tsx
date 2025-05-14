import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export interface NFTReceiptCardProps {
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
  
  // Format receipt date
  const formattedDate = new Date(purchaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Format receipt time
  const formattedTime = new Date(purchaseDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Convert tier string to proper case
  const formattedTier = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();

  // Generate gradient background based on tier
  const getTierGradient = () => {
    switch (tier.toLowerCase()) {
      case 'standard':
        return 'from-blue-400 to-blue-600';
      case 'premium':
        return 'from-purple-400 to-purple-600';
      case 'luxury':
        return 'from-yellow-400 to-amber-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  // Generate tier-specific effects and styling
  const getTierEffects = () => {
    const baseEffects = 'transition-all duration-700 ease-in-out transform';
    
    switch (tier.toLowerCase()) {
      case 'standard':
        return `${baseEffects} hover:scale-105`;
      case 'premium':
        return `${baseEffects} hover:scale-105 hover:shadow-lg hover:shadow-purple-200/50`;
      case 'luxury':
        return `${baseEffects} hover:scale-105 hover:shadow-xl hover:shadow-amber-200/50 animate-shine`;
      default:
        return baseEffects;
    }
  };

  // Define a color for the tier badge
  const getTierBadgeColor = () => {
    switch (tier.toLowerCase()) {
      case 'standard':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'premium':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'luxury':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      default:
        return '';
    }
  };
  
  // Handle card flip
  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="perspective-1000 w-full">
      <div className={`relative transition-all duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front of card */}
        <div className={`${isFlipped ? 'hidden' : 'block'}`}>
          <Card className={`overflow-hidden ${getTierEffects()}`}>
            {/* Card Header with gradient */}
            <div className={`bg-gradient-to-r ${getTierGradient()} p-6 text-white`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">NFT Receipt #{receiptId}</h3>
                  <p className="text-sm opacity-90">{merchantName}</p>
                </div>
                <Badge 
                  className={`${getTierBadgeColor()} text-xs font-semibold px-2.5 py-0.5 rounded`}
                >
                  {formattedTier} NFT
                </Badge>
              </div>
            </div>
            
            {/* Receipt Image */}
            <div className="relative aspect-[4/3] w-full bg-gray-100">
              <img 
                src={nftImageUrl} 
                alt={`Receipt for ${productName}`}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to a placeholder if image fails to load
                  (e.target as HTMLImageElement).src = '/products/receipt-placeholder.jpg';
                }}
              />
              
              {/* Pokemon-style holographic effect for luxury tier */}
              {tier.toLowerCase() === 'luxury' && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-amber-300/20 to-yellow-400/20 mix-blend-overlay pointer-events-none" />
              )}
              
              {/* Watermark for authenticity */}
              <div className="absolute bottom-2 right-2 text-white text-xs bg-black/30 px-2 py-1 rounded">
                Blockchain Verified
              </div>
            </div>

            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-bold truncate">{productName}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p>{formattedDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time</p>
                    <p>{formattedTime}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total</p>
                    <p>${totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">NFT ID</p>
                    <p className="truncate">{nftId.substring(0, 10)}...</p>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleFlip}
              >
                View Details
              </Button>
              {onViewOnBlockExplorer && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onViewOnBlockExplorer}
                >
                  View on Chain
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        
        {/* Back of card with blockchain details */}
        <div className={`${isFlipped ? 'block' : 'hidden'} absolute top-0 w-full`}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Blockchain Details</CardTitle>
              <CardDescription>
                NFT Receipt #{receiptId} - {formattedTier} Tier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Transaction Hash</h4>
                <p className="text-xs break-all bg-muted p-2 rounded">{transactionHash}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">NFT ID</h4>
                <p className="text-sm bg-muted p-2 rounded">{nftId}</p>
              </div>
              
              {ipfsHash && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">IPFS Hash</h4>
                  <p className="text-xs break-all bg-muted p-2 rounded">{ipfsHash}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Network</h4>
                <p className="text-sm">Polygon Amoy (Testnet)</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Contract Type</h4>
                <p className="text-sm">ERC-1155</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleFlip}
              >
                View Receipt
              </Button>
              {onViewOnBlockExplorer && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={onViewOnBlockExplorer}
                      >
                        Verify on Chain
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View this transaction on Polygon Amoy Explorer</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Pokemon-style shiny effect for luxury tier */}
      {tier.toLowerCase() === 'luxury' && (
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shine {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          
          .animate-shine {
            background: linear-gradient(
              45deg, 
              rgba(255,215,0,0) 0%, 
              rgba(255,215,0,0.1) 25%, 
              rgba(255,255,255,0.2) 50%, 
              rgba(255,215,0,0.1) 75%, 
              rgba(255,215,0,0) 100%
            );
            background-size: 200% 200%;
            animation: shine 3s ease infinite;
          }
          
          .rotate-y-180 {
            transform: rotateY(180deg);
          }
          
          .perspective-1000 {
            perspective: 1000px;
          }
        `}} />
      )}
    </div>
  );
}
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Gift, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NFTGiftStatusProps {
  nftGift: {
    status: string;
    message: string;
    eligible: boolean;
    error?: string;
    nft?: {
      tokenId: string;
      contract: string;
      name: string;
      image: string;
      marketplace: string;
      price: number;
    };
    txHash?: string;
  } | null;
}

const NFTGiftStatus: React.FC<NFTGiftStatusProps> = ({ nftGift }) => {
  if (!nftGift) return null;

  const { status, message, eligible, error, nft, txHash } = nftGift;

  // Function to get the appropriate icon based on status
  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-10 w-10 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-10 w-10 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-10 w-10 text-red-500" />;
      case 'ineligible':
        return <Gift className="h-10 w-10 text-gray-400" />;
      default:
        return <Gift className="h-10 w-10 text-blue-500" />;
    }
  };

  // Function to get the Polygon explorer URL for the transaction
  const getExplorerUrl = () => {
    if (!txHash) return '';
    return `https://polygonscan.com/tx/${txHash}`;
  };
  
  return (
    <Card className="mt-4 relative overflow-hidden">
      {/* Background glow effect for eligible receipts */}
      {eligible && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 opacity-75 blur-sm rounded-lg" />
      )}
      
      <div className="relative bg-card rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <Gift className="mr-2 h-5 w-5" />
            NFT Gift
          </CardTitle>
          <CardDescription>
            Automatically find and mint NFTs for every receipt
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center space-x-4">
            <div>
              {getStatusIcon()}
            </div>
            
            <div className="flex-1">
              <p className="font-medium">{message}</p>
              
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
              
              {nft && (
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {nft.image && (
                      <img 
                        src={nft.image.startsWith('http') ? nft.image : `${window.location.origin}${nft.image}`}
                        alt={nft.name}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium">{nft.name}</p>
                      <p className="text-xs text-gray-500">From {nft.marketplace}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {txHash && (
                <div className="mt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(getExplorerUrl(), '_blank')}
                          className="text-xs flex items-center"
                        >
                          View Transaction <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View blockchain transaction details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default NFTGiftStatus;
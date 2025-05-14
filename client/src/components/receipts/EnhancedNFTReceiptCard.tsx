import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Share2, Info, Eye, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type ReceiptType = 'standard' | 'premium' | 'luxury';

export interface EnhancedNFTReceiptCardProps {
  id: number;
  merchant: { name: string; logo: string };
  purchaseDate: string;
  amount: number;
  currencySymbol: string;
  items: number;
  receiptType: ReceiptType;
  tokenId: number;
  contractAddress: string;
  revoked?: boolean;
}

export const EnhancedNFTReceiptCard: React.FC<EnhancedNFTReceiptCardProps> = ({
  merchant,
  purchaseDate,
  amount,
  currencySymbol,
  receiptType,
  tokenId,
  revoked,
}) => {
  // Define styles based on receipt type
  const receiptStyles = {
    standard: {
      gradientBg: 'bg-gradient-to-br from-gray-100 to-blue-100',
      border: 'border-gray-200',
      headerBg: 'bg-white/70',
      icon: '🧾',
      badgeColor: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
    },
    premium: {
      gradientBg: 'bg-gradient-to-br from-indigo-100 to-purple-100',
      border: 'border-indigo-200',
      headerBg: 'bg-white/70',
      icon: '🏆',
      badgeColor: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
    },
    luxury: {
      gradientBg: 'bg-gradient-to-br from-amber-100 to-yellow-100',
      border: 'border-amber-200',
      headerBg: 'bg-white/80',
      icon: '✨',
      badgeColor: 'bg-amber-100 text-amber-800 hover:bg-amber-200'
    }
  };

  const style = receiptStyles[receiptType];
  const formattedDate = new Date(purchaseDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className={`overflow-hidden ${style.border} hover:shadow-md transition-shadow ${revoked ? 'opacity-60' : ''}`}>
      <div className={`relative ${style.gradientBg} p-4`}>
        {/* Merchant info */}
        <div className={`flex justify-between items-center ${style.headerBg} p-3 rounded-lg mb-3`}>
          <div className="flex items-center">
            <div className="text-2xl mr-2">{style.icon}</div>
            <div>
              <h3 className="font-bold">{merchant.name}</h3>
              <div className="text-xs text-gray-500">{formattedDate}</div>
            </div>
          </div>
          <Badge variant="outline" className={style.badgeColor}>
            {receiptType.charAt(0).toUpperCase() + receiptType.slice(1)}
          </Badge>
        </div>

        {/* NFT Card Content */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold">{currencySymbol}{amount.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Token #{tokenId}</div>
          </div>
          
          {/* NFT Visual representation - simulated for this mock */}
          <div className={`w-full aspect-square rounded-lg mb-4 flex items-center justify-center 
                        bg-white/50 border ${style.border} overflow-hidden`}>
            {revoked ? (
              <div className="flex flex-col items-center text-gray-400">
                <Lock size={48} />
                <span className="mt-2 font-medium">Revoked Receipt</span>
              </div>
            ) : (
              <div className="text-6xl">{style.icon}</div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between pt-2">
          <div className="flex space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View Details</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download Receipt</TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex space-x-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View on Blockchain</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share Receipt</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </Card>
  );
};
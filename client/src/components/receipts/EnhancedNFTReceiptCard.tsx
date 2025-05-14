import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ShieldCheck, 
  Lock, 
  ShoppingBag, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  Key, 
  Eye, 
  EyeOff,
  Truck
} from 'lucide-react';
import { Link } from 'wouter';

export type ReceiptType = 'standard' | 'premium' | 'luxury';

export interface NFTReceiptProps {
  id: string;
  merchantName: string;
  date: string;
  total: number;
  items: number;
  txHash?: string;
  isEncrypted: boolean;
  hasGrantedAccess?: boolean;
  grantedTo?: string[];
  tokenId?: string;
  receiptType?: ReceiptType;
  status?: 'confirmed' | 'pending' | 'failed';
  warranty?: {
    expiryDate: string;
    duration: string;
    isActive: boolean;
  };
}

const getReceiptStyles = (receiptType: ReceiptType = 'standard') => {
  switch (receiptType) {
    case 'luxury':
      return {
        cardClass: 'bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 border-amber-200 shadow-lg hover:shadow-xl transition-all',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
        headerClass: 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white rounded-t-lg',
        buttonClass: 'bg-amber-600 hover:bg-amber-700 text-white',
        specialEffect: 'luxury-card', // Additional class for special effects
      };
    case 'premium':
      return {
        cardClass: 'bg-gradient-to-br from-purple-50 via-white to-purple-50 border-purple-200 shadow-md hover:shadow-lg transition-all',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
        headerClass: 'bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-t-lg',
        buttonClass: 'bg-purple-600 hover:bg-purple-700 text-white',
        specialEffect: '',
      };
    default: // standard
      return {
        cardClass: 'bg-white border-blue-200 hover:border-blue-300 transition-all',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
        headerClass: 'border-b border-gray-100',
        buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
        specialEffect: '',
      };
  }
};

const EnhancedNFTReceiptCard: React.FC<NFTReceiptProps> = ({
  id,
  merchantName,
  date,
  total,
  items,
  txHash,
  isEncrypted,
  hasGrantedAccess = false,
  grantedTo = [],
  tokenId,
  receiptType = 'standard',
  status = 'confirmed',
  warranty,
}) => {
  const styles = getReceiptStyles(receiptType);
  
  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  // Status badge color
  const getStatusBadge = () => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Card className={`overflow-hidden ${styles.cardClass} ${styles.specialEffect}`}>
      <CardHeader className={styles.headerClass}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <ShoppingBag className="h-4 w-4 mr-2" /> 
              {merchantName}
            </CardTitle>
            <CardDescription className={receiptType === 'standard' ? 'text-gray-500' : 'text-white/80'}>
              {formattedDate}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline" className={styles.badgeClass}>
              {receiptType.charAt(0).toUpperCase() + receiptType.slice(1)}
            </Badge>
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 flex items-center mb-1">
              <Clock className="h-3.5 w-3.5 mr-1" /> Date
            </span>
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 flex items-center mb-1">
              <DollarSign className="h-3.5 w-3.5 mr-1" /> Total
            </span>
            <span className="font-medium text-lg">${total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-2 border-t border-b border-gray-100">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Items:</span>
            <Badge variant="outline" className="bg-gray-100">
              {items}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            {warranty && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`flex items-center ${warranty.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                      <Truck className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">
                        {warranty.isActive ? 'Warranty Active' : 'Warranty Expired'}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {warranty.isActive 
                        ? `Warranty valid for ${warranty.duration} (expires ${new Date(warranty.expiryDate).toLocaleDateString()})` 
                        : `Warranty expired on ${new Date(warranty.expiryDate).toLocaleDateString()}`
                      }
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {isEncrypted && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="text-yellow-600 flex items-center">
                      <Lock className="h-4 w-4 mr-1" />
                      <span className="text-xs font-medium">Encrypted</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Receipt data is encrypted with TACo technology</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {isEncrypted && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`flex items-center ${hasGrantedAccess ? 'text-green-600' : 'text-red-500'}`}>
                      {hasGrantedAccess ? (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">Viewable</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">Locked</span>
                        </>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {hasGrantedAccess 
                        ? `You have access to view this encrypted receipt${grantedTo.length > 0 ? `. Shared with ${grantedTo.length} others.` : ''}` 
                        : 'You need to be granted access to view this encrypted receipt'
                      }
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        
        {tokenId && (
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center">
              <ShieldCheck className="h-4 w-4 mr-1 text-green-500" />
              <span>Token ID: {tokenId}</span>
            </div>
            {txHash && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <Key className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">TX Hash</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs font-mono max-w-xs break-all">
                      {txHash.slice(0, 10)}...{txHash.slice(-8)}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 p-3 flex justify-between">
        <Link href={`/nft-receipts/${id}`}>
          <Button size="sm" className={styles.buttonClass}>
            View Details <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
        
        {isEncrypted && !hasGrantedAccess && (
          <Button size="sm" variant="outline" className="border-yellow-400 text-yellow-700 hover:bg-yellow-50">
            <Key className="h-4 w-4 mr-1" /> Grant Access
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EnhancedNFTReceiptCard;
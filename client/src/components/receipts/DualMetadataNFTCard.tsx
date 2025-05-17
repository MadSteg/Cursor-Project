import React, { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Lock, Star, Gift, Clock, ShieldCheck, CreditCard, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Type for NFT with dual metadata
interface DualMetadataNFT {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  merchant: string;
  date: string;
  total: number;
  transactionHash?: string;
  blockExplorer?: string;
  userData: {
    capsule: string;
    ciphertext: string;
    policyId: string;
  };
  promoData?: {
    capsule: string;
    ciphertext: string;
    policyId: string;
    expiresAt: number;
  };
  unencryptedPreview?: any;
}

interface DualMetadataNFTCardProps {
  nft: DualMetadataNFT;
  onViewTransaction?: (txHash: string) => void;
}

export const DualMetadataNFTCard: React.FC<DualMetadataNFTCardProps> = ({
  nft,
  onViewTransaction
}) => {
  const [isDecryptingUserData, setIsDecryptingUserData] = useState(false);
  const [isDecryptingPromoData, setIsDecryptingPromoData] = useState(false);
  const [decryptedUserData, setDecryptedUserData] = useState<any>(null);
  const [decryptedPromoData, setDecryptedPromoData] = useState<any>(null);
  const { toast } = useToast();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Check if promo data is expired
  const isPromoExpired = nft.promoData?.expiresAt 
    ? nft.promoData.expiresAt * 1000 < Date.now() 
    : false;

  // Format expiration time
  const formatExpirationTime = (expiresAt: number) => {
    // Convert seconds to milliseconds for date-fns
    const expiresAtDate = new Date(expiresAt * 1000);
    return formatDistanceToNow(expiresAtDate, { addSuffix: true });
  };

  // Handle reveal of user data (receipt details)
  const handleRevealUserData = async () => {
    if (isDecryptingUserData) return;
    
    setIsDecryptingUserData(true);
    try {
      const response = await apiRequest('POST', '/api/nfts/decrypt', {
        tokenId: nft.tokenId,
        dataType: 'userData'
      });
      
      if (!response.ok) {
        throw new Error('Failed to decrypt user data');
      }
      
      const result = await response.json();
      setDecryptedUserData(result.data);
      toast({
        title: 'Receipt Details',
        description: 'Your receipt details have been revealed',
      });
    } catch (error) {
      console.error('Error decrypting user data:', error);
      toast({
        title: 'Decryption failed',
        description: 'Could not reveal receipt details',
        variant: 'destructive',
      });
    } finally {
      setIsDecryptingUserData(false);
    }
  };

  // Handle reveal of promotion data
  const handleRevealPromoData = async () => {
    if (isDecryptingPromoData || isPromoExpired) return;
    
    setIsDecryptingPromoData(true);
    try {
      const response = await apiRequest('POST', '/api/nfts/decrypt', {
        tokenId: nft.tokenId,
        dataType: 'promoData'
      });
      
      if (!response.ok) {
        throw new Error('Failed to decrypt promotion data');
      }
      
      const result = await response.json();
      setDecryptedPromoData(result.data);
      toast({
        title: 'Promotion Revealed',
        description: 'Your exclusive promotion has been revealed',
      });
    } catch (error) {
      console.error('Error decrypting promo data:', error);
      toast({
        title: 'Decryption failed',
        description: 'Could not reveal promotion',
        variant: 'destructive',
      });
    } finally {
      setIsDecryptingPromoData(false);
    }
  };

  return (
    <Card className="w-full overflow-hidden border shadow-lg transition-all hover:shadow-xl">
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={nft.image} 
          alt={nft.name} 
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
        
        {/* Merchant badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="font-medium">
            <CreditCard className="mr-1 h-3 w-3" />
            {nft.merchant}
          </Badge>
        </div>
        
        {/* Promotion badge if available and not expired */}
        {nft.promoData && !isPromoExpired && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
              <Gift className="mr-1 h-3 w-3" />
              Promotion
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{nft.name}</CardTitle>
          <div className="text-right">
            <span className="text-lg font-bold">{formatCurrency(nft.total)}</span>
          </div>
        </div>
        <CardDescription>{nft.date}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        {/* User Data Section */}
        {decryptedUserData ? (
          <div className="space-y-3 border-b pb-3">
            <h4 className="font-medium flex items-center">
              <ShieldCheck className="mr-2 h-4 w-4 text-blue-500" />
              Receipt Details
            </h4>
            
            <div className="space-y-2">
              {decryptedUserData.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.name} {item.quantity > 1 ? `(${item.quantity}x)` : ''}</span>
                  <span className="font-medium">{formatCurrency(item.price)}</span>
                </div>
              ))}
              
              <div className="flex justify-between pt-1 text-sm">
                <span className="font-medium">Subtotal</span>
                <span>{formatCurrency(decryptedUserData.subtotal || 0)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="font-medium">Tax</span>
                <span>{formatCurrency(decryptedUserData.tax || 0)}</span>
              </div>
              
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(decryptedUserData.total)}</span>
              </div>
            </div>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full mb-3 flex items-center justify-center"
            onClick={handleRevealUserData}
            disabled={isDecryptingUserData}
          >
            {isDecryptingUserData ? (
              <>
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Decrypting...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Reveal Receipt Details
              </>
            )}
          </Button>
        )}
        
        {/* Promotion Data Section */}
        {nft.promoData && (
          isPromoExpired ? (
            <div className="mt-3 rounded-md bg-gray-100 dark:bg-gray-800 p-3 text-center text-sm text-gray-500">
              <Clock className="inline-block mr-1 h-4 w-4" />
              Promotion expired {formatExpirationTime(nft.promoData.expiresAt)}
            </div>
          ) : decryptedPromoData ? (
            <div className="mt-3 space-y-3">
              <h4 className="font-medium flex items-center">
                <Gift className="mr-2 h-4 w-4 text-orange-500" />
                Exclusive Promotion
              </h4>
              
              <div className="rounded-md bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 border border-amber-200 dark:border-amber-800">
                <div className="text-center mb-2">
                  <div className="text-lg font-bold text-orange-700 dark:text-orange-400">
                    {decryptedPromoData.message || 'Special Offer'}
                  </div>
                  
                  <div className="mt-1 text-2xl font-extrabold bg-gradient-to-r from-amber-600 to-orange-600 inline-block text-transparent bg-clip-text">
                    {decryptedPromoData.type === 'PERCENT' ? `${decryptedPromoData.discount}% OFF` :
                     decryptedPromoData.type === 'FIXED' ? `${formatCurrency(decryptedPromoData.discount)} OFF` :
                     decryptedPromoData.type === 'BOGO' ? 'BUY ONE GET ONE FREE' :
                     'FREE ITEM'}
                  </div>
                  
                  <div className="mt-3 font-medium text-orange-700 dark:text-orange-400">
                    Promo Code: <span className="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded border border-amber-200 dark:border-amber-800">{decryptedPromoData.promotionCode}</span>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Valid until {new Date(nft.promoData.expiresAt * 1000).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full mt-3 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 dark:from-amber-950 dark:to-orange-950 dark:hover:from-amber-900 dark:hover:to-orange-900 border-amber-200 dark:border-amber-800 flex items-center justify-center"
              onClick={handleRevealPromoData}
              disabled={isDecryptingPromoData}
            >
              {isDecryptingPromoData ? (
                <>
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Revealing Offer...
                </>
              ) : (
                <>
                  <Gift className="mr-2 h-4 w-4 text-orange-500" />
                  Reveal Special Offer
                </>
              )}
            </Button>
          )
        )}
      </CardContent>
      
      <CardFooter className="pt-2">
        {nft.transactionHash && onViewTransaction && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onViewTransaction(nft.transactionHash!)}
            className="text-xs w-full flex items-center justify-center"
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            View on Blockchain
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DualMetadataNFTCard;
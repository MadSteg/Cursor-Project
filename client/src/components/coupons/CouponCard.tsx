/**
 * CouponCard.tsx
 * 
 * Component for displaying time-limited coupons that use Threshold PRE encryption
 * for secure, time-bound access.
 */

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, LockOpen, Tag, Clock, Gift } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface CouponCardProps {
  nft: {
    id: string;
    tokenId: string;
    name: string;
    metadata: {
      coupon?: {
        capsule: string;
        ciphertext: string;
        policyId: string;
        validUntil: number;
      }
    }
  }
}

const CouponCard: React.FC<CouponCardProps> = ({ nft }) => {
  const [coupon, setCoupon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const now = Date.now();
  const hasExpired = nft.metadata.coupon?.validUntil 
    ? now > nft.metadata.coupon.validUntil 
    : false;
  
  const formattedDate = nft.metadata.coupon?.validUntil 
    ? new Date(nft.metadata.coupon.validUntil).toLocaleDateString() 
    : 'Unknown';
  
  const handleRevealCoupon = async () => {
    if (!nft.metadata.coupon) {
      setError('No coupon available for this receipt');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { capsule, ciphertext, policyId } = nft.metadata.coupon;
      
      const response = await fetch('/api/coupons/decrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ capsule, ciphertext, policyId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCoupon(result.couponCode);
        toast({
          title: 'Coupon revealed!',
          description: `Your coupon code is ${result.couponCode}`,
        });
      } else {
        setError(result.message || 'Failed to reveal coupon');
        toast({
          title: 'Error',
          description: result.message || 'Failed to reveal coupon',
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Error revealing coupon:', err);
      setError('Failed to communicate with server');
      toast({
        title: 'Error',
        description: 'Network error while revealing coupon',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!nft.metadata.coupon) {
    return null; // Don't render if no coupon exists
  }
  
  return (
    <Card className="w-full shadow-md transition-all hover:shadow-lg">
      <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950 dark:to-amber-950">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="h-5 w-5 text-orange-500" />
            Special Offer
          </CardTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Expires: {formattedDate}
          </div>
        </div>
        <CardDescription>
          Exclusive offer from your receipt at {nft.name}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4 pb-2">
        {coupon ? (
          <Alert className="bg-green-50 dark:bg-green-950">
            <div className="flex flex-col items-center w-full px-3 py-2">
              <AlertTitle className="text-xl font-bold text-center text-green-800 dark:text-green-300 mb-2">
                {coupon}
              </AlertTitle>
              <AlertDescription className="text-center text-sm">
                Use this code for your next purchase!
                Save this code - it cannot be revealed again if it expires.
              </AlertDescription>
            </div>
          </Alert>
        ) : error ? (
          <Alert variant="destructive" className="text-sm">
            <AlertTitle>Could not reveal offer</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3 py-6">
            <div className="text-center space-y-2">
              {hasExpired ? (
                <>
                  <p className="text-muted-foreground font-medium">This offer has expired</p>
                  <p className="text-xs text-muted-foreground">Offers can only be redeemed within their validity period</p>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground font-medium">This receipt contains a special offer</p>
                  <p className="text-xs text-muted-foreground">Click below to reveal your discount code</p>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center pt-2 pb-4">
        {!coupon && !hasExpired && (
          <Button 
            onClick={handleRevealCoupon}
            disabled={isLoading || hasExpired}
            className="w-full max-w-xs"
            variant="default"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Revealing...
              </>
            ) : (
              <>
                <LockOpen className="mr-2 h-4 w-4" /> Reveal Coupon
              </>
            )}
          </Button>
        )}
        
        {hasExpired && !coupon && (
          <Button
            disabled
            variant="outline"
            className="w-full max-w-xs opacity-70"
          >
            Offer Expired
          </Button>
        )}
        
        {coupon && (
          <Button
            variant="outline"
            className="w-full max-w-xs"
            onClick={() => {
              navigator.clipboard.writeText(coupon);
              toast({
                title: 'Copied!',
                description: 'Coupon code copied to clipboard',
              });
            }}
          >
            <Tag className="mr-2 h-4 w-4" /> Copy Code
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CouponCard;
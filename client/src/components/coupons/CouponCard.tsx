/**
 * CouponCard.tsx
 * 
 * Component for displaying time-limited coupons that use Threshold PRE encryption
 * for secure, time-bound access.
 */

import React, { useState, useEffect } from 'react';
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
import { 
  Loader2, LockOpen, Tag, Clock, Gift, Sparkles, 
  BadgePercent, ShoppingBag, Trophy, Ticket, Zap 
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface CouponCardProps {
  nft: {
    id: string;
    tokenId: string;
    name: string;
    metadata: {
      merchantName?: string;
      coupon?: {
        capsule: string;
        ciphertext: string;
        policyId: string;
        validUntil: number;
        tier?: string;
        pointValue?: number;
        rarity?: string;
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
  
  // Animation effects for the card
  const [showSparkle, setShowSparkle] = useState(false);
  
  useEffect(() => {
    // Show sparkle animation periodically for active coupons
    if (!hasExpired && !coupon) {
      const interval = setInterval(() => {
        setShowSparkle(true);
        setTimeout(() => setShowSparkle(false), 2000);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [hasExpired, coupon]);

  // Determine merchant name for display
  const merchantName = nft.metadata.merchantName || nft.name;
  
  // Tier badge colors
  const getTierColor = (tier?: string) => {
    switch(tier) {
      case 'Silver': return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'Gold': return 'bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'Premium': return 'bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Platinum': return 'bg-cyan-200 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300';
      default: return 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  // Generate a random discount between 10-50% for demo purposes
  const discountPercent = nft.id ? (parseInt(nft.id.substring(0, 2), 16) % 40 + 10) : 25;
  
  return (
    <Card className="w-full bg-white dark:bg-slate-900 shadow-md transition-all hover:shadow-lg relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-amber-50/20 dark:to-amber-900/10 z-0"></div>
      
      {/* Tier indicator ribbon */}
      {nft.metadata.coupon?.tier && (
        <div className="absolute -right-12 top-7 transform rotate-45 z-10">
          <div className={`w-40 py-1 text-center text-xs font-semibold ${getTierColor(nft.metadata.coupon.tier)}`}>
            {nft.metadata.coupon.tier} Tier
          </div>
        </div>
      )}
      
      <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 relative z-0">
        {/* Animated sparkles */}
        {showSparkle && !hasExpired && !coupon && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 right-0 p-2"
          >
            <Sparkles className="h-6 w-6 text-amber-500" />
          </motion.div>
        )}
        
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <Gift className="h-4 w-4" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400">
              {discountPercent}% OFF
            </span>
          </CardTitle>
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-white/50 dark:bg-black/20 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3" />
            {hasExpired ? 'Expired' : 'Valid until'}: {formattedDate}
          </div>
        </div>
        <CardDescription className="flex items-center justify-between">
          <div>
            From <span className="font-medium">{merchantName}</span>
          </div>
          {nft.metadata.coupon?.pointValue && (
            <Badge variant="outline" className="bg-amber-100/50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800">
              <Ticket className="h-3 w-3 mr-1 text-amber-500" />
              {nft.metadata.coupon.pointValue} points
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 pb-4 relative z-0">
        {coupon ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
              <div className="flex flex-col items-center w-full px-3 py-3">
                <div className="absolute -top-3 -right-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: 2, ease: "linear" }}
                  >
                    <BadgePercent className="h-6 w-6 text-green-500" />
                  </motion.div>
                </div>
                <AlertTitle className="text-2xl font-bold text-center text-green-800 dark:text-green-300 mb-2 font-mono tracking-wider">
                  {coupon}
                </AlertTitle>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: "reverse", 
                        duration: 1.5,
                        delay: i * 0.3
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-amber-500" />
                    </motion.div>
                  ))}
                </div>
                <AlertDescription className="text-center text-sm">
                  Use this code for your next purchase! Valid for {discountPercent}% off.
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Save this code - it cannot be revealed again if it expires.
                  </div>
                </AlertDescription>
              </div>
            </Alert>
          </motion.div>
        ) : error ? (
          <Alert variant="destructive" className="text-sm">
            <AlertTitle>Could not reveal offer</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            {hasExpired ? (
              <div className="text-center space-y-2">
                <div className="bg-gray-100 dark:bg-gray-800 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-muted-foreground font-medium">This offer has expired</p>
                <p className="text-xs text-muted-foreground">
                  Offers can only be redeemed within their validity period
                </p>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <div className="relative">
                  <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-3 p-6">
                    <ShoppingBag className="h-12 w-12 text-amber-500" />
                  </div>
                  {showSparkle && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="absolute -right-2 -top-2"
                    >
                      <Badge className="bg-amber-500">
                        <Zap className="h-3 w-3 mr-1" />
                        {discountPercent}% OFF
                      </Badge>
                    </motion.div>
                  )}
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  Exclusive Offer from {merchantName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Reveal to unlock your special discount
                </p>
                <div className="pt-2">
                  <Badge variant="outline" className="mx-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Limited Time
                  </Badge>
                  {nft.metadata.coupon?.rarity && (
                    <Badge variant="outline" className="mx-1">
                      <Trophy className="h-3 w-3 mr-1" />
                      {nft.metadata.coupon.rarity}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center pt-2 pb-4 relative z-0">
        {!coupon && !hasExpired && (
          <Button 
            onClick={handleRevealCoupon}
            disabled={isLoading || hasExpired}
            className="w-full max-w-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
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
          <div className="w-full flex flex-col gap-2 items-center">
            <Button
              variant="default"
              className="w-full max-w-xs bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
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
            {nft.metadata.coupon?.pointValue && (
              <div className="text-xs text-center text-muted-foreground">
                Redeem for {nft.metadata.coupon.pointValue} loyalty points!
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CouponCard;
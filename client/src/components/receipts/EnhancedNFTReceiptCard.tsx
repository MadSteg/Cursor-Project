import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, ArrowRight, Calendar, CreditCard, Download, Eye, Share2, ShoppingBag, Tag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReceiptVerification } from './ReceiptVerification';

// NFT receipt types with corresponding styling
const receiptStyles = {
  standard: {
    borderColor: 'border-blue-400',
    gradientFrom: 'from-blue-50',
    gradientTo: 'to-white',
    shadow: 'shadow-blue-100',
    badgeColor: 'bg-blue-100 text-blue-800',
    iconColor: 'text-blue-500'
  },
  premium: {
    borderColor: 'border-purple-400',
    gradientFrom: 'from-purple-50',
    gradientTo: 'to-pink-50',
    shadow: 'shadow-purple-100',
    badgeColor: 'bg-purple-100 text-purple-800',
    iconColor: 'text-purple-500'
  },
  luxury: {
    borderColor: 'border-amber-400',
    gradientFrom: 'from-amber-50',
    gradientTo: 'to-yellow-100',
    shadow: 'shadow-amber-100',
    badgeColor: 'bg-amber-100 text-amber-800',
    iconColor: 'text-amber-500',
    shimmer: 'animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent'
  }
};

interface EnhancedNFTReceiptCardProps {
  id: number;
  merchant: {
    name: string;
    logo?: string;
  };
  purchaseDate: string; // ISO date string
  amount: number;
  currencySymbol?: string;
  items: number;
  receiptType: 'standard' | 'premium' | 'luxury';
  tokenId: number;
  contractAddress: string;
  imageUrl?: string;
  onViewDetails?: (id: number) => void;
  revoked?: boolean;
}

export function EnhancedNFTReceiptCard({
  id,
  merchant,
  purchaseDate,
  amount,
  currencySymbol = '$',
  items,
  receiptType = 'standard',
  tokenId,
  contractAddress,
  imageUrl,
  onViewDetails,
  revoked = false
}: EnhancedNFTReceiptCardProps) {
  const { toast } = useToast();
  const style = receiptStyles[receiptType];
  const [hovering, setHovering] = useState(false);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format timestamp for verification component
  const getTimestamp = (dateString: string) => {
    return Math.floor(new Date(dateString).getTime() / 1000);
  };

  // Handle share action
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Receipt from ${merchant.name}`,
        text: `Check out my receipt for ${currencySymbol}${amount.toFixed(2)} from ${merchant.name}`,
        url: window.location.href
      }).catch(error => {
        toast({
          title: "Sharing failed",
          description: "Could not share receipt.",
          variant: "destructive",
        });
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Receipt link copied to clipboard.",
      });
    }
  };
  
  // Handle download action
  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF or image of the receipt
    toast({
      title: "Download started",
      description: "Your receipt is being prepared for download.",
    });
  };

  return (
    <Card 
      className={`w-full max-w-sm relative overflow-hidden border-2 ${style.borderColor} ${style.shadow} transition-all duration-300 ease-in-out ${
        hovering ? 'scale-[1.02]' : ''
      } ${receiptType === 'luxury' ? 'bg-gradient-to-br from-amber-50 to-yellow-100' : `bg-gradient-to-b ${style.gradientFrom} ${style.gradientTo}`}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Shimmer effect for luxury cards */}
      {receiptType === 'luxury' && (
        <div className="absolute inset-0 mask-shimmer overflow-hidden">
          <div className="absolute inset-0 translate-x-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
      )}
      
      {/* Revoked badge */}
      {revoked && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Revoked
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold">{merchant.name}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Calendar className={`h-3 w-3 ${style.iconColor}`} />
              {formatDate(purchaseDate)}
            </CardDescription>
          </div>
          
          <Badge variant="outline" className={`${style.badgeColor} capitalize`}>
            {receiptType}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="py-2">
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold">
            {currencySymbol}{amount.toFixed(2)}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <ShoppingBag className={`h-3 w-3 mr-1 ${style.iconColor}`} />
            {items} item{items !== 1 ? 's' : ''}
          </div>
        </div>
        
        {imageUrl && (
          <div className="w-full mb-4 rounded-md overflow-hidden">
            <img 
              src={imageUrl} 
              alt={`Receipt for ${merchant.name}`} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        <div className="flex items-center text-xs text-muted-foreground mt-2">
          <Tag className={`h-3 w-3 mr-1 ${style.iconColor}`} />
          Token ID: {tokenId}
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <CreditCard className={`h-3 w-3 mr-1 ${style.iconColor}`} />
          <span className="font-mono truncate" title={contractAddress}>
            Contract: {contractAddress.substring(0, 6)}...{contractAddress.substring(contractAddress.length - 4)}
          </span>
        </div>
      </CardContent>
      
      <Separator />
      
      <CardFooter className="flex justify-between py-3">
        <Button 
          variant="ghost" 
          size="sm"
          className={`${style.iconColor} hover:bg-opacity-10 hover:bg-black`}
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className={`${style.iconColor} hover:bg-opacity-10 hover:bg-black`}
          onClick={handleDownload}
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`${style.iconColor} hover:bg-opacity-10 hover:bg-black`}
            >
              <Eye className="h-4 w-4 mr-1" />
              Verify
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <ReceiptVerification
              receiptId={id}
              contractAddress={contractAddress}
              tokenId={tokenId}
              receiptType={receiptType}
              revoked={!!revoked}
              timestamp={getTimestamp(purchaseDate)}
              network="amoy"
            />
          </DialogContent>
        </Dialog>
        
        {onViewDetails && (
          <Button 
            variant="ghost" 
            size="sm"
            className={`${style.iconColor} hover:bg-opacity-10 hover:bg-black`}
            onClick={() => onViewDetails(id)}
          >
            Details 
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
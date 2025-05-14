/**
 * Enhanced NFT Receipt Card Component
 * 
 * This component displays an NFT receipt with tier-based styling and
 * privacy controls for access to sensitive metadata.
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NftArtOption, NftArtTier, determineReceiptTier } from '@/data/nftArtManifest';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Icons
import { Lock, Unlock, Eye, Share, Copy, Info, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface FullReceiptData {
  id: number;
  tokenId: string;
  merchantId: number;
  merchant: {
    id: number;
    name: string;
    category?: string;
    logoUrl?: string;
  };
  date: string;
  subtotal: number;
  tax: number;
  total: number;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  blockchainTxHash?: string;
  blockchainVerified: boolean;
  blockNumber?: number;
  nftArt?: NftArtOption;
  artId?: string; // ID of the selected NFT art
}

interface AccessControl {
  granted: boolean;
  isOwner: boolean;
  accessGrantedTo: Array<{
    address: string;
    name?: string;
    date: string;
  }>;
}

interface EnhancedNFTReceiptCardProps {
  receipt: FullReceiptData;
  accessControl: AccessControl;
  onGrantAccess?: (address: string) => Promise<boolean>;
  onRevokeAccess?: (address: string) => Promise<boolean>;
  onViewMetadata?: () => void;
  className?: string;
}

export const EnhancedNFTReceiptCard: React.FC<EnhancedNFTReceiptCardProps> = ({
  receipt,
  accessControl,
  onGrantAccess,
  onRevokeAccess,
  onViewMetadata,
  className = ''
}) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [newAccessAddress, setNewAccessAddress] = useState('');
  const [isGranting, setIsGranting] = useState(false);
  const [isRevoking, setIsRevoking] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  // Determine tier based on receipt total
  const tier = receipt.nftArt?.tier || determineReceiptTier(receipt.total);
  
  // Helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100); // Convert cents to dollars
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get tier-based styling
  const getTierStyling = (tier: NftArtTier) => {
    switch (tier) {
      case 'standard':
        return 'bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900';
      case 'premium':
        return 'bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-700 dark:to-slate-900';
      case 'luxury':
        return 'bg-gradient-to-br from-amber-100 to-amber-300 dark:from-amber-700 dark:to-amber-950';
      case 'ultra':
        return 'bg-gradient-to-br from-violet-100 to-purple-300 dark:from-violet-700 dark:to-purple-950';
      default:
        return 'bg-white dark:bg-gray-800';
    }
  };
  
  // Handle granting access
  const handleGrantAccess = async () => {
    if (!newAccessAddress || !onGrantAccess) return;
    
    setIsGranting(true);
    try {
      const success = await onGrantAccess(newAccessAddress);
      if (success) {
        toast({
          title: "Access Granted",
          description: `Access to receipt metadata granted to ${newAccessAddress.substring(0, 6)}...`,
        });
        setNewAccessAddress('');
        setIsShareDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: "Failed to grant access. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while granting access.",
        variant: "destructive"
      });
    } finally {
      setIsGranting(false);
    }
  };
  
  // Handle revoking access
  const handleRevokeAccess = async (address: string) => {
    if (!onRevokeAccess) return;
    
    setIsRevoking(prev => ({ ...prev, [address]: true }));
    try {
      const success = await onRevokeAccess(address);
      if (success) {
        toast({
          title: "Access Revoked",
          description: `Access to receipt metadata revoked from ${address.substring(0, 6)}...`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to revoke access. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while revoking access.",
        variant: "destructive"
      });
    } finally {
      setIsRevoking(prev => ({ ...prev, [address]: false }));
    }
  };
  
  // Handle copy blockchain hash
  const handleCopyHash = () => {
    if (receipt.blockchainTxHash) {
      navigator.clipboard.writeText(receipt.blockchainTxHash);
      toast({
        title: "Copied!",
        description: "Transaction hash copied to clipboard",
      });
    }
  };
  
  return (
    <Card className={`relative overflow-hidden ${className} ${getTierStyling(tier)}`}>
      {/* Tier Badge */}
      <div className="absolute top-2 right-2">
        <Badge variant={
          tier === 'standard' ? 'default' :
          tier === 'premium' ? 'secondary' :
          tier === 'luxury' ? 'destructive' : 'outline'
        }>
          {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier
        </Badge>
      </div>
      
      {/* NFT Art Image */}
      <div className="p-4 pt-12 flex justify-center">
        <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-lg overflow-hidden">
          {receipt.nftArt ? (
            <img 
              src={receipt.nftArt.imageUrl} 
              alt={receipt.nftArt.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <span className="text-gray-500 dark:text-gray-400">No Art Selected</span>
            </div>
          )}
          
          {/* Verification Status */}
          <div className="absolute bottom-2 right-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-black/60 text-white p-1 rounded-full">
                    {receipt.blockchainVerified ? (
                      <ShieldCheck className="h-5 w-5 text-green-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {receipt.blockchainVerified 
                    ? "Verified on blockchain" 
                    : "Not verified on blockchain"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Lock/Unlock Status */}
          <div className="absolute bottom-2 left-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-black/60 text-white p-1 rounded-full">
                    {accessControl.granted ? (
                      <Unlock className="h-5 w-5 text-green-400" />
                    ) : (
                      <Lock className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {accessControl.granted 
                    ? "You have access to detailed metadata" 
                    : "Encrypted metadata - access required"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={receipt.merchant.logoUrl || ''} />
            <AvatarFallback>{receipt.merchant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{receipt.merchant.name}</CardTitle>
            <CardDescription>{formatDate(receipt.date)}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Receipt Summary */}
        <div className="space-y-4">
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatCurrency(receipt.total)}</span>
          </div>
          
          {accessControl.granted ? (
            <>
              <div className="border-t pt-2 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(receipt.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatCurrency(receipt.tax)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span>Items</span>
                  <span>{receipt.items.length} item(s)</span>
                </div>
              </div>
              
              {/* Blockchain Info */}
              {receipt.blockchainTxHash && (
                <div className="border-t pt-2">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>TX:</span>
                    <div className="flex items-center gap-1">
                      <span>{`${receipt.blockchainTxHash.substring(0, 6)}...${receipt.blockchainTxHash.substring(receipt.blockchainTxHash.length - 4)}`}</span>
                      <button onClick={handleCopyHash} className="p-1">
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  {receipt.blockNumber && (
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Block:</span>
                      <span>{receipt.blockNumber}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 flex flex-col items-center justify-center space-y-2">
              <Lock className="h-5 w-5 text-gray-400" />
              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                Detailed receipt information is encrypted
              </p>
              {accessControl.isOwner ? (
                <p className="text-xs text-center text-gray-400">
                  As the owner, you can grant access to others
                </p>
              ) : (
                <p className="text-xs text-center text-gray-400">
                  Request access from the owner to view details
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <div className="w-full flex flex-wrap gap-2">
          {/* View Metadata Button */}
          {accessControl.granted && onViewMetadata && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={onViewMetadata}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
          )}
          
          {/* Share/Grant Access Button */}
          {accessControl.isOwner && (
            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                >
                  <Share className="mr-2 h-4 w-4" />
                  Share Access
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Grant Access to Receipt Metadata</DialogTitle>
                  <DialogDescription>
                    Enter a wallet address to grant access to the encrypted metadata for this receipt.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="wallet-address">Wallet Address</Label>
                    <Input 
                      id="wallet-address" 
                      placeholder="0x..."
                      value={newAccessAddress}
                      onChange={(e) => setNewAccessAddress(e.target.value)}
                    />
                  </div>
                  
                  {accessControl.accessGrantedTo.length > 0 && (
                    <div className="space-y-2">
                      <Label>Current Access List</Label>
                      <div className="max-h-40 overflow-y-auto border rounded-md divide-y">
                        {accessControl.accessGrantedTo.map(access => (
                          <div key={access.address} className="p-2 flex justify-between items-center">
                            <div>
                              <div className="font-mono text-sm">
                                {access.address.substring(0, 6)}...{access.address.substring(access.address.length - 4)}
                              </div>
                              {access.name && <div className="text-xs text-gray-500">{access.name}</div>}
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              disabled={isRevoking[access.address]}
                              onClick={() => handleRevokeAccess(access.address)}
                            >
                              Revoke
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleGrantAccess}
                    disabled={!newAccessAddress || isGranting}
                  >
                    {isGranting ? "Granting..." : "Grant Access"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        {/* Token ID */}
        {receipt.tokenId && (
          <div className="w-full text-xs text-center text-gray-500 dark:text-gray-400">
            Token ID: {receipt.tokenId}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default EnhancedNFTReceiptCard;
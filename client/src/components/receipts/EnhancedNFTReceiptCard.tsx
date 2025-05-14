import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Share2, Info, Eye, Lock, KeyRound, ShieldCheck, ShieldOff, AlertTriangle } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  // TACo encryption related fields
  isEncrypted?: boolean;
  hasEncryptedMetadata?: boolean;
  grantedAccessTo?: string[];
}

export const EnhancedNFTReceiptCard: React.FC<EnhancedNFTReceiptCardProps> = ({
  merchant,
  purchaseDate,
  amount,
  currencySymbol,
  receiptType,
  tokenId,
  revoked,
  isEncrypted = true, // Default to true for demo
  hasEncryptedMetadata = true, // Default to true for demo
  grantedAccessTo = [], // Empty array by default
}) => {
  const [accessAddress, setAccessAddress] = useState('');
  const [isGranting, setIsGranting] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [showGrantAccessDialog, setShowGrantAccessDialog] = useState(false);
  const [showManageAccessDialog, setShowManageAccessDialog] = useState(false);
  
  const handleGrantAccess = async () => {
    setIsGranting(true);
    try {
      // Simulate API call to TACo service
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Granting access to ${accessAddress} for token ${tokenId}`);
      // In a real implementation, we would call our backend API:
      // await fetch('/api/grant-access', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ tokenId, address: accessAddress })
      // });
      setShowGrantAccessDialog(false);
      setAccessAddress('');
    } catch (error) {
      console.error("Error granting access:", error);
    } finally {
      setIsGranting(false);
    }
  };
  
  const handleRevokeAccess = async (address: string) => {
    setIsRevoking(true);
    try {
      // Simulate API call to TACo service
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Revoking access for ${address} to token ${tokenId}`);
      // In a real implementation, we would call our backend API:
      // await fetch('/api/revoke-access', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ tokenId, address })
      // });
    } catch (error) {
      console.error("Error revoking access:", error);
    } finally {
      setIsRevoking(false);
    }
  };
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
          <div className="flex items-center space-x-2">
            {isEncrypted && (
              <Tooltip>
                <TooltipTrigger>
                  <div className="text-blue-600">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Encrypted with TACo</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Badge variant="outline" className={style.badgeColor}>
              {receiptType.charAt(0).toUpperCase() + receiptType.slice(1)}
            </Badge>
          </div>
        </div>

        {/* NFT Card Content */}
        <div className="flex flex-col items-center justify-center py-4">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold">{currencySymbol}{amount.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Token #{tokenId}</div>
          </div>
          
          {/* NFT Visual representation - simulated for this mock */}
          <div className={`w-full aspect-square rounded-lg mb-4 flex items-center justify-center 
                        bg-white/50 border ${style.border} overflow-hidden relative`}>
            {revoked ? (
              <div className="flex flex-col items-center text-gray-400">
                <Lock size={48} />
                <span className="mt-2 font-medium">Revoked Receipt</span>
              </div>
            ) : (
              <div className="text-6xl">{style.icon}</div>
            )}
            
            {/* TACo encryption badge */}
            {hasEncryptedMetadata && !revoked && (
              <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium flex items-center">
                <KeyRound className="h-3 w-3 mr-1" />
                TACo Protected
              </div>
            )}
          </div>
          
          {/* TACo metadata access controls */}
          {hasEncryptedMetadata && !revoked && (
            <div className="w-full mb-4 px-2">
              <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
                <div className="flex items-start">
                  <ShieldCheck className="h-4 w-4 text-blue-700 mt-0.5 mr-2" />
                  <div>
                    <p className="text-xs text-blue-800 font-medium">Private Receipt Data</p>
                    <p className="text-xs text-blue-700 mt-1">Sensitive details are encrypted with Threshold Network TACo. You control who can access this data.</p>
                    
                    <div className="flex mt-2 space-x-2">
                      <Dialog open={showGrantAccessDialog} onOpenChange={setShowGrantAccessDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            <KeyRound className="h-3 w-3 mr-1" />
                            Grant Access
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Grant Access to Receipt Data</DialogTitle>
                            <DialogDescription>
                              Enter a blockchain address to grant access to the encrypted data on this receipt.
                              The recipient will be able to view warranty information, serial numbers, and other private details.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="address">Recipient Address</Label>
                              <Input
                                id="address"
                                placeholder="0x..."
                                value={accessAddress}
                                onChange={(e) => setAccessAddress(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit" onClick={handleGrantAccess} disabled={isGranting || !accessAddress}>
                              {isGranting ? "Granting Access..." : "Grant Access"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={showManageAccessDialog} onOpenChange={setShowManageAccessDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 text-xs">
                            <ShieldOff className="h-3 w-3 mr-1" />
                            Manage Access
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage Data Access</DialogTitle>
                            <DialogDescription>
                              Control which addresses can access the encrypted data on this receipt.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            {grantedAccessTo.length === 0 ? (
                              <div className="text-center py-4 text-sm text-gray-500">
                                No access has been granted yet.
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {grantedAccessTo.map((address, index) => (
                                  <div key={index} className="flex justify-between items-center border-b pb-2">
                                    <div className="font-mono text-sm truncate max-w-[200px]">
                                      {address}
                                    </div>
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => handleRevokeAccess(address)}
                                      disabled={isRevoking}
                                    >
                                      Revoke
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
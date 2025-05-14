import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, ExternalLink, Clock, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReceiptVerificationProps {
  receiptId: number;
  contractAddress: string;
  tokenId: number;
  receiptType: string;
  revoked: boolean;
  timestamp: number;
  network: 'amoy' | 'mumbai' | 'polygon' | 'ethereum';
}

export function ReceiptVerification({
  receiptId,
  contractAddress,
  tokenId,
  receiptType,
  revoked,
  timestamp,
  network = 'amoy'
}: ReceiptVerificationProps) {
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(false);

  // Get the explorer URL based on the network
  const getExplorerUrl = () => {
    switch (network) {
      case 'amoy':
        return `https://www.oklink.com/amoy/address/${contractAddress}?tokenId=${tokenId}`;
      case 'mumbai':
        return `https://mumbai.polygonscan.com/token/${contractAddress}?a=${tokenId}`;
      case 'polygon':
        return `https://polygonscan.com/token/${contractAddress}?a=${tokenId}`;
      case 'ethereum':
        return `https://etherscan.io/token/${contractAddress}?a=${tokenId}`;
      default:
        return `https://www.oklink.com/amoy/address/${contractAddress}`;
    }
  };

  // Get network display name
  const getNetworkName = () => {
    switch (network) {
      case 'amoy':
        return 'Polygon Amoy Testnet';
      case 'mumbai':
        return 'Polygon Mumbai Testnet';
      case 'polygon':
        return 'Polygon';
      case 'ethereum':
        return 'Ethereum';
      default:
        return 'Polygon Amoy Testnet';
    }
  };

  // Format timestamp
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Verify on blockchain (simulated for UI demo)
  const verifyOnBlockchain = async () => {
    setVerifying(true);
    try {
      // This would be an actual blockchain call in production using ethers.js
      // For now, we'll simulate a network delay and success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Receipt Verified",
        description: `Receipt #${receiptId} was successfully verified on the blockchain.`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Could not verify the receipt. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-2 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Receipt Verification</CardTitle>
          {revoked ? (
            <Badge variant="destructive" className="ml-2 flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" /> Revoked
            </Badge>
          ) : (
            <Badge variant="default" className="ml-2 flex items-center gap-1 bg-green-600">
              <CheckCircle className="h-3 w-3" /> Valid
            </Badge>
          )}
        </div>
        <CardDescription>
          Verify receipt authenticity on the blockchain
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="font-medium">Receipt ID:</div>
          <div>{receiptId}</div>
          
          <div className="font-medium">Token ID:</div>
          <div>{tokenId}</div>
          
          <div className="font-medium">Receipt Type:</div>
          <div className="capitalize">{receiptType}</div>
          
          <div className="font-medium">Network:</div>
          <div>{getNetworkName()}</div>
          
          <div className="font-medium">Timestamp:</div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {formatDate(timestamp)}
          </div>
          
          <div className="font-medium">Status:</div>
          <div>
            {revoked ? (
              <span className="text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> Revoked
              </span>
            ) : (
              <span className="text-green-500 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Valid
              </span>
            )}
          </div>
        </div>
        
        <div className="pt-2">
          <div className="text-xs text-muted-foreground mt-2">
            Contract Address: <span className="font-mono text-xs break-all">{contractAddress}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          className="w-full" 
          disabled={verifying}
          onClick={verifyOnBlockchain}
        >
          {verifying ? "Verifying..." : "Verify on Blockchain"}
        </Button>
        
        <a 
          href={getExplorerUrl()} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full"
        >
          <Button variant="outline" className="w-full flex items-center gap-2">
            <ExternalLink className="h-4 w-4" /> View on {network === 'amoy' ? 'OKLink' : network === 'ethereum' ? 'Etherscan' : 'Polygonscan'}
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
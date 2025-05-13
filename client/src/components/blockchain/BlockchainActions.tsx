import React, { useState } from "react";
import { Database, CheckCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface BlockchainStatusResponse {
  available: boolean;
  networkName?: string;
  chainId?: number;
  contractAddress?: string;
  message?: string;
}

interface BlockchainActionsProps {
  receiptId: number;
  blockchainVerified: boolean;
  blockchainTxHash?: string;
  blockNumber?: number;
  nftTokenId?: string;
  onMintSuccess?: () => void;
}

export function BlockchainActions({
  receiptId,
  blockchainVerified,
  blockchainTxHash,
  blockNumber,
  nftTokenId,
  onMintSuccess
}: BlockchainActionsProps) {
  const [loading, setLoading] = useState(false);
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState<BlockchainStatusResponse | null>(null);
  const { toast } = useToast();

  // Check blockchain status
  const checkBlockchainStatus = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('/api/blockchain/status');
      setStatus(response as BlockchainStatusResponse);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check blockchain status",
        variant: "destructive",
      });
      setStatus({ available: false, message: "Failed to connect to blockchain service" });
    } finally {
      setLoading(false);
    }
  };

  // Mint receipt as NFT
  const mintReceiptAsNFT = async () => {
    if (!receiptId) return;

    setMinting(true);
    try {
      const response = await apiRequest(`/api/blockchain/mint/${receiptId}`, {
        method: 'POST',
      } as RequestInit);

      toast({
        title: "Success",
        description: "Receipt minted as NFT successfully",
      });

      // Store encryption key securely (this is just for demo)
      if (response && typeof response === 'object' && 'encryptionKey' in response) {
        localStorage.setItem(`receipt_key_${receiptId}`, response.encryptionKey as string);
      }

      if (onMintSuccess) {
        onMintSuccess();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mint receipt as NFT",
        variant: "destructive",
      });
    } finally {
      setMinting(false);
    }
  };

  // Format blockchain explorer URL
  const getExplorerUrl = (txHash?: string) => {
    if (!txHash) return '#';
    // Using Mumbai Polygonscan
    return `https://mumbai.polygonscan.com/tx/${txHash}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Database className="mr-2 h-5 w-5 text-primary" />
          Blockchain Verification
        </CardTitle>
        <CardDescription>
          Permanently store your receipt on the blockchain as an NFT
        </CardDescription>
      </CardHeader>

      <CardContent>
        {blockchainVerified ? (
          <div className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">Verified on Blockchain</span>
              <Badge className="ml-auto" variant="outline">Polygon Mumbai</Badge>
            </div>

            <div className="space-y-2 text-sm">
              {nftTokenId && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">NFT Token ID:</span>
                  <span className="font-mono">{nftTokenId}</span>
                </div>
              )}
              
              {blockNumber && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Block Number:</span>
                  <span className="font-mono">{blockNumber}</span>
                </div>
              )}
              
              {blockchainTxHash && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction Hash:</span>
                  <span className="font-mono truncate max-w-[180px]">
                    {blockchainTxHash.substring(0, 10)}...{blockchainTxHash.substring(blockchainTxHash.length - 8)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : status === null ? (
          <div className="space-y-3 py-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-5/6" />
          </div>
        ) : !status.available ? (
          <div className="flex items-center text-amber-600">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>Blockchain integration not configured</span>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network:</span>
              <span>{status.networkName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Chain ID:</span>
              <span className="font-mono">{status.chainId}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract:</span>
              <span className="font-mono truncate max-w-[180px]">{status.contractAddress}</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        {blockchainVerified ? (
          <a 
            href={getExplorerUrl(blockchainTxHash)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Blockchain Explorer
          </a>
        ) : status === null ? (
          <Button onClick={checkBlockchainStatus} disabled={loading} className="w-full">
            {loading ? "Checking..." : "Check Blockchain Status"}
          </Button>
        ) : status.available ? (
          <Button onClick={mintReceiptAsNFT} disabled={minting} className="w-full">
            {minting ? "Minting..." : "Mint Receipt as NFT"}
          </Button>
        ) : (
          <Button disabled className="w-full">
            Blockchain Not Available
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
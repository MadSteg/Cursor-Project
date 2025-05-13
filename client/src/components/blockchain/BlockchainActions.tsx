import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BlockchainStatus {
  available: boolean;
  network: string;
  chainId: number;
  contractAddress: string;
  walletAddress: string;
  mockMode: boolean;
}

interface BlockchainActionsProps {
  receiptId: number;
}

export function BlockchainActions({ receiptId }: BlockchainActionsProps) {
  const [status, setStatus] = useState<BlockchainStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [minting, setMinting] = useState<boolean>(false);
  const [mintResult, setMintResult] = useState<any>(null);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch blockchain status on mount
    fetchBlockchainStatus();
  }, []);

  const fetchBlockchainStatus = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('GET', '/api/blockchain/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Error fetching blockchain status:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blockchain status",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const mintReceipt = async () => {
    setMinting(true);
    try {
      const response = await apiRequest('POST', `/api/blockchain/mint/${receiptId}`);
      const data = await response.json();
      setMintResult(data);
      toast({
        title: "Success",
        description: "Receipt minted successfully"
      });
    } catch (error) {
      console.error('Error minting receipt:', error);
      toast({
        title: "Error",
        description: "Failed to mint receipt",
        variant: "destructive"
      });
    } finally {
      setMinting(false);
    }
  };

  const verifyReceipt = async () => {
    if (!mintResult?.receipt?.blockchain?.tokenId) {
      toast({
        title: "Error",
        description: "No token ID available. Please mint the receipt first.",
        variant: "destructive"
      });
      return;
    }

    setVerifying(true);
    try {
      const tokenId = mintResult.receipt.blockchain.tokenId;
      const response = await apiRequest('GET', `/api/blockchain/verify/${tokenId}`);
      const data = await response.json();
      setVerifyResult(data);
      toast({
        title: data.verified ? "Verified" : "Not Verified",
        description: data.verified 
          ? "Receipt verified successfully on blockchain" 
          : "Receipt could not be verified on blockchain",
        variant: data.verified ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Error verifying receipt:', error);
      toast({
        title: "Error",
        description: "Failed to verify receipt",
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Blockchain Status</CardTitle>
          <CardDescription>Checking blockchain connection...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!status?.available) {
    return (
      <Card className="w-full border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Blockchain Unavailable
          </CardTitle>
          <CardDescription>
            Could not connect to blockchain network
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please check your network connection and try again.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={fetchBlockchainStatus} variant="outline">
            Retry Connection
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Blockchain Actions</CardTitle>
          <Badge variant={status.mockMode ? "outline" : "default"}>
            {status.mockMode ? "Mock Mode" : status.network}
          </Badge>
        </div>
        <CardDescription>
          Store and verify receipt information on blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status.mockMode && (
          <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
            <p className="text-sm text-yellow-700">
              Running in mock mode - no actual blockchain transactions will be made
            </p>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="font-medium">Network Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Network</div>
            <div>{status.network}</div>
            <div className="text-muted-foreground">Chain ID</div>
            <div>{status.chainId}</div>
            <div className="text-muted-foreground">Contract</div>
            <div className="truncate">{status.contractAddress}</div>
          </div>
        </div>

        {mintResult && (
          <div className="space-y-2 bg-green-50 p-4 rounded-md border border-green-200">
            <h4 className="font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Receipt Minted
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">Token ID</div>
              <div>{mintResult.receipt.blockchain.tokenId}</div>
              <div className="text-muted-foreground">Transaction</div>
              <div className="truncate">{mintResult.receipt.blockchain.transactionHash}</div>
              <div className="text-muted-foreground">Block #</div>
              <div>{mintResult.receipt.blockchain.blockNumber}</div>
              <div className="text-muted-foreground">Receipt Hash</div>
              <div className="truncate">{mintResult.receipt.blockchain.receiptHash}</div>
            </div>
          </div>
        )}

        {verifyResult && (
          <div className={`space-y-2 p-4 rounded-md border ${
            verifyResult.verified 
              ? "bg-green-50 border-green-200" 
              : "bg-red-50 border-red-200"
          }`}>
            <h4 className="font-medium flex items-center gap-2">
              {verifyResult.verified ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Receipt Verified
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  Verification Failed
                </>
              )}
            </h4>
            {verifyResult.verified && (
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Owner</div>
                <div className="truncate">{verifyResult.receipt.blockchain.owner}</div>
                <div className="text-muted-foreground">URI</div>
                <div className="truncate">{verifyResult.receipt.blockchain.uri}</div>
                <div className="text-muted-foreground">Receipt Hash</div>
                <div className="truncate">{verifyResult.receipt.blockchain.receiptHash}</div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          onClick={mintReceipt} 
          disabled={minting || mintResult !== null}
        >
          {minting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mintResult ? "Receipt Minted" : "Mint Receipt"}
        </Button>
        <Button
          onClick={verifyReceipt}
          disabled={verifying || !mintResult}
          variant="outline"
        >
          {verifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify Receipt
        </Button>
      </CardFooter>
    </Card>
  );
}
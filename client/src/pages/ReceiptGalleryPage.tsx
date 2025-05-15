import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import NFTGallery from "@/components/nft/NFTGallery";
import { useWeb3Wallet } from "@/hooks/useWeb3Wallet";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ReceiptGalleryPage() {
  const { address } = useParams<{ address?: string }>();
  const [, setLocation] = useLocation();
  const { isConnected, address: connectedAddress } = useWeb3Wallet();
  const [viewingAddress, setViewingAddress] = useState<string | undefined>(undefined);
  
  // Determine which address to use for the gallery
  useEffect(() => {
    if (address) {
      // If an address was provided in the URL, use that one
      setViewingAddress(address);
    } else if (isConnected && connectedAddress) {
      // Otherwise use the connected wallet address if available
      setViewingAddress(connectedAddress);
    } else {
      // No address available
      setViewingAddress(undefined);
    }
  }, [address, isConnected, connectedAddress]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <Button 
            onClick={() => setLocation("/")} 
            variant="ghost" 
            size="sm" 
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Receipt Gallery</h1>
        </div>
        
        {!isConnected && (
          <Button 
            onClick={() => setLocation("/connect")}
            variant="outline"
          >
            Connect Wallet
          </Button>
        )}
      </div>
      
      <div className="mb-6">
        <p className="text-muted-foreground">
          View your blockchain-verified receipts with TACo encryption. Each receipt is represented as an NFT with verifiable data.
        </p>
      </div>
      
      {/* The actual gallery component */}
      <NFTGallery walletAddress={viewingAddress} />
    </div>
  );
}
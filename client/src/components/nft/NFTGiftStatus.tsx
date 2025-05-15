import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, GiftIcon, AlertCircle, CheckCircle2, ExternalLink } from "lucide-react";

interface NFTGiftProps {
  nftGift: {
    status: string;
    message: string;
    eligible: boolean;
    error?: string;
    nft?: {
      tokenId: string;
      contract: string;
      name: string;
      image: string;
      marketplace: string;
      price: number;
    };
    txHash?: string;
  };
}

export default function NFTGiftStatus({ nftGift }: NFTGiftProps) {
  const statusColors = {
    pending: "bg-yellow-500",
    processing: "bg-blue-500",
    completed: "bg-green-500",
    failed: "bg-red-500",
    ineligible: "bg-gray-500"
  };
  
  // Get appropriate color for status badge
  const getStatusColor = () => {
    if (nftGift.status === 'pending' || nftGift.status === 'checking') return statusColors.pending;
    if (nftGift.status === 'processing' || nftGift.status === 'purchasing') return statusColors.processing;
    if (nftGift.status === 'completed' || nftGift.status === 'success') return statusColors.completed;
    if (nftGift.status === 'failed' || nftGift.status === 'error') return statusColors.failed;
    if (nftGift.status === 'ineligible') return statusColors.ineligible;
    return statusColors.pending;
  };
  
  // Get appropriate icon for status
  const getStatusIcon = () => {
    if (nftGift.status === 'pending' || nftGift.status === 'checking' || 
        nftGift.status === 'processing' || nftGift.status === 'purchasing') {
      return <Loader2 className="h-4 w-4 animate-spin mr-2" />;
    }
    if (nftGift.status === 'completed' || nftGift.status === 'success') {
      return <CheckCircle2 className="h-4 w-4 mr-2" />;
    }
    if (nftGift.status === 'failed' || nftGift.status === 'error' || nftGift.status === 'ineligible') {
      return <AlertCircle className="h-4 w-4 mr-2" />;
    }
    return <GiftIcon className="h-4 w-4 mr-2" />;
  };
  
  // Get block explorer URL for the transaction
  const getExplorerUrl = () => {
    if (!nftGift.txHash) return null;
    // Polygon (Mumbai and Amoy) explorer URLs
    return `https://amoy.polygonscan.com/tx/${nftGift.txHash}`;
  };
  
  return (
    <Card className="border-dashed border-2 bg-gradient-to-br from-violet-50 to-indigo-50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <GiftIcon className="h-5 w-5 mr-2 text-purple-500" />
            <CardTitle className="text-lg">NFT Gift</CardTitle>
          </div>
          <Badge className={`${getStatusColor()} text-white`}>
            <div className="flex items-center">
              {getStatusIcon()}
              <span className="capitalize">{nftGift.status}</span>
            </div>
          </Badge>
        </div>
        <CardDescription>
          {nftGift.message || "Processing your BlockReceipt NFT gift..."}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {nftGift.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-3 text-sm text-red-700">
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
              <p>{nftGift.error}</p>
            </div>
          </div>
        )}
        
        {nftGift.nft && (
          <div className="flex items-center space-x-4">
            {nftGift.nft.image && (
              <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-md">
                <img 
                  src={nftGift.nft.image} 
                  alt={nftGift.nft.name || "NFT"} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <p className="font-medium">{nftGift.nft.name || "Unknown NFT"}</p>
              <p className="text-sm text-muted-foreground">
                {nftGift.nft.marketplace ? `From: ${nftGift.nft.marketplace}` : "Custom NFT"}
              </p>
              {nftGift.nft.price && (
                <p className="text-sm">
                  <span className="text-purple-600 font-medium">${nftGift.nft.price.toFixed(2)} USD value</span>
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      {nftGift.txHash && (
        <CardFooter className="pt-0">
          <a 
            href={getExplorerUrl() || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button variant="outline" className="w-full text-xs">
              View Transaction <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </a>
        </CardFooter>
      )}
    </Card>
  );
}
import React, { useState } from 'react';
import NFTCatalog from '@/components/nft/NFTCatalog';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isWalletConnected, getWalletAddress } from '@/lib/blockchainService';
import ConnectWalletButton from '@/components/blockchain/ConnectWalletButton';
import { Separator } from '@/components/ui/separator';

const NFTCatalogPage: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { toast } = useToast();
  
  // Example receipt data for standalone page - this would typically come from uploaded receipt
  const mockReceiptData = {
    merchantName: "Friday Beers Ltd",
    date: "05/15/2025",
    items: [
      { name: "Pixel Art Guide", price: 19.99 },
      { name: "Digital Assets Bundle", price: 29.99 },
      { name: "NFT Creation Toolkit", price: 49.99 }
    ],
    subtotal: 99.97,
    tax: 8.0,
    total: 107.97,
    tier: {
      id: "STANDARD",
      title: "Standard",
      description: "Standard BlockReceipt with basic features and encryption",
      price: 0.99
    }
  };

  const handleNFTMinted = (nft: any) => {
    toast({
      title: 'NFT Minted Successfully',
      description: `${nft.name} has been minted to your wallet: ${getWalletAddress()}`,
      duration: 5000,
    });
  };

  return (
    <div className="container max-w-7xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">BlockReceipt NFT Catalog</h1>
          <p className="text-muted-foreground mt-2">
            Browse our collection of pixel art receipt-themed NFTs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Status</CardTitle>
                <CardDescription>
                  Connect your wallet to mint NFTs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isWalletConnected() ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Connected Wallet</p>
                    <p className="text-xs text-muted-foreground break-all">
                      {getWalletAddress()}
                    </p>
                    <p className="text-sm mt-4 text-green-600">Ready to mint NFTs</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Connect your wallet to mint NFTs from our catalog
                    </p>
                    <ConnectWalletButton />
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>About These NFTs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">
                  Our BlockReceipt NFTs feature pixel art designs inspired by the Friday Beers NFT collection style.
                </p>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-2">NFT Tiers</h4>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>Basic - Free receipts with basic features</li>
                    <li>Standard - Enhanced receipts with more details</li>
                    <li>Premium - Feature-rich receipts with unique art</li>
                    <li>Luxury - Exclusive high-value receipts</li>
                  </ul>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  All NFTs are minted on Polygon Amoy testnet
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <NFTCatalog 
              receiptData={mockReceiptData}
              onSelectNFT={handleNFTMinted}
              defaultCategories={selectedCategories}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTCatalogPage;
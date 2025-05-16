import React, { useState } from 'react';
import TestNFTMinter from '@/components/nft/TestNFTMinter';
import NFTGallery from '@/components/nft/NFTGallery';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';

const TestNFTPage: React.FC = () => {
  const { walletAddress, connectMetaMask, isConnected, connecting } = useWallet();
  const [activeTab, setActiveTab] = useState('mint');

  // Function to handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          BlockReceipt Testing Environment
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Test NFT minting and view your NFT gallery in development mode
        </p>

        {!isConnected ? (
          <Card className="mb-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Connect Your Wallet</CardTitle>
              <CardDescription className="text-slate-300">
                You need to connect your wallet to interact with the testing environment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={connectMetaMask} 
                disabled={connecting}
                size="lg"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              >
                {connecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect Wallet'
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="bg-card rounded-lg p-4 mb-6 border border-border">
              <p className="text-sm font-medium">Connected Wallet</p>
              <p className="font-mono text-primary text-sm">
                {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Unknown'}
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
              <TabsList className="w-full">
                <TabsTrigger value="mint" className="flex-1">Mint Test NFT</TabsTrigger>
                <TabsTrigger value="gallery" className="flex-1">NFT Gallery</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mint" className="pt-6">
                <TestNFTMinter />
              </TabsContent>
              
              <TabsContent value="gallery" className="pt-6">
                {walletAddress && (
                  <NFTGallery 
                    walletAddress={walletAddress}
                  />
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
        
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mt-10">
          <h3 className="text-amber-800 dark:text-amber-300 font-medium">Development Environment Notice</h3>
          <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
            This environment is for testing NFT functionality only. No actual blockchain transactions are made.
            Minted NFTs exist only in this development environment and are not stored on any real blockchain.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestNFTPage;
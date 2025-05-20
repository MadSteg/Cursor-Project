import React from 'react';
import NFTCollection from '../components/NFTCollection';
import { sampleNFTs, getSampleMintedNFTs } from '../data/nftData';

const NFTBrowser: React.FC = () => {
  // Get sample minted NFT IDs for demonstration
  const mintedNFTIds = getSampleMintedNFTs();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 brand-gradient-text">Bulldog NFT Collection</h1>
      <p className="text-muted-foreground mb-8 max-w-3xl">
        Discover our exclusive Bulldog character NFTs - each with unique traits and varying rarity levels.
        Upload receipts for a chance to mint these collectible characters to your wallet.
      </p>
      
      <div className="mb-8 p-6 bg-card rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">About Rarity Levels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <span className="w-4 h-4 bg-amber-500 rounded-full mr-2"></span>
              Legendary (Very Rare)
            </h3>
            <p className="text-sm text-muted-foreground">
              The rarest Bulldogs with special traits and unique accessories. 
              Only a small percentage of mints result in Legendary characters.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <span className="w-4 h-4 bg-purple-600 rounded-full mr-2"></span>
              Epic (Rare)
            </h3>
            <p className="text-sm text-muted-foreground">
              Distinctive Bulldogs with uncommon traits and special appearances.
              A lucky mint might reward you with these special characters.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <span className="w-4 h-4 bg-blue-600 rounded-full mr-2"></span>
              Rare
            </h3>
            <p className="text-sm text-muted-foreground">
              Somewhat uncommon Bulldogs with interesting traits and accessories.
              These have a moderate chance of appearing in your collection.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <span className="w-4 h-4 bg-gray-600 rounded-full mr-2"></span>
              Common
            </h3>
            <p className="text-sm text-muted-foreground">
              The most frequently encountered Bulldogs. Though common, each still has 
              its own personality and unique look.
            </p>
          </div>
        </div>
      </div>
      
      <NFTCollection nfts={sampleNFTs} mintedNFTs={mintedNFTIds} />
    </div>
  );
};

export default NFTBrowser;
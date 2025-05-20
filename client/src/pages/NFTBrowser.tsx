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
        Explore and collect unique Bulldog character NFTs by uploading receipts from different 
        merchant categories. Each Bulldog has special traits based on your spending habits!
      </p>
      <NFTCollection nfts={sampleNFTs} mintedNFTs={mintedNFTIds} />
    </div>
  );
};

export default NFTBrowser;
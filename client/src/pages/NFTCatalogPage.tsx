import React from 'react';
import { Helmet } from 'react-helmet';
import NFTCatalog from '@/components/nft/NFTCatalog';

const NFTCatalogPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <Helmet>
        <title>NFT Catalog | BlockReceipt.ai</title>
        <meta
          name="description"
          content="Explore our collection of receipt-themed NFTs. Each BlockReceipt NFT design represents different purchase categories with unique pixel art styles."
        />
      </Helmet>
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">BlockReceipt NFT Catalog</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse our collection of receipt-themed NFTs. Each design is unique and can be minted when you create a BlockReceipt from your purchases.
        </p>
      </div>
      
      <NFTCatalog showMintButton={true} />
    </div>
  );
}

export default NFTCatalogPage;
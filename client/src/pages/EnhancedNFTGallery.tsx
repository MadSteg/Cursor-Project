import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useWallet } from '../contexts/WalletContext';
import { NFT } from '../types/nft';
import { sampleNFTs } from '../data/nftData';

// Rarity levels for display
const rarityLevels = [
  { name: 'common', color: 'gray-600' },
  { name: 'uncommon', color: 'green-600' },
  { name: 'rare', color: 'blue-600' },
  { name: 'epic', color: 'purple-600' },
  { name: 'legendary', color: 'amber-500' }
];

const EnhancedNFTGallery: React.FC = () => {
  const { isConnected } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [mintedNFTs, setMintedNFTs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    // Use our pre-defined sample NFT data
    setNfts(sampleNFTs);
    
    // Randomly mark some as minted (for demo purposes)
    const randomMinted = sampleNFTs
      .slice()
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(sampleNFTs.length * 0.3)) // About 30% are minted
      .map((nft: NFT) => nft.id);
    
    setMintedNFTs(randomMinted);
    setLoading(false);
  }, []);
  
  // Filter NFTs based on rarity
  const filteredNFTs = filter === 'all' 
    ? nfts 
    : nfts.filter(nft => nft.rarity === filter);
  
  const handleMint = (id: string) => {
    if (isConnected) {
      setMintedNFTs(prev => [...prev, id]);
      alert(`Successfully minted NFT: ${nfts.find(nft => nft.id === id)?.name}`);
    } else {
      alert('Please connect your wallet to mint NFTs');
    }
  };
  
  // Get rarity color
  const getRarityColor = (rarity: string): string => {
    const level = rarityLevels.find(r => r.name === rarity);
    return level ? level.color : 'gray-600';
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden border shadow-sm">
                <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
        Discover our exclusive Bulldog character NFTs - each with unique traits and varying rarity levels.
        Mint these collectible characters to your wallet or earn them by uploading receipts.
      </p>
      
      {/* Rarity Guide */}
      <div className="mb-8 p-6 bg-card rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">About Rarity Levels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <span className="w-4 h-4 bg-amber-500 rounded-full mr-2"></span>
              Legendary (Very Rare)
            </h3>
            <p className="text-sm text-muted-foreground">
              The rarest NFTs with special traits and unique accessories. 
              Only a small percentage of mints result in Legendary characters.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <span className="w-4 h-4 bg-purple-600 rounded-full mr-2"></span>
              Epic (Rare)
            </h3>
            <p className="text-sm text-muted-foreground">
              Distinctive NFTs with uncommon traits and special appearances.
              A lucky mint might reward you with these special characters.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <span className="w-4 h-4 bg-blue-600 rounded-full mr-2"></span>
              Rare
            </h3>
            <p className="text-sm text-muted-foreground">
              Somewhat uncommon NFTs with interesting traits and accessories.
              These have a moderate chance of appearing in your collection.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <span className="w-4 h-4 bg-green-600 rounded-full mr-2"></span>
              Uncommon
            </h3>
            <p className="text-sm text-muted-foreground">
              Less common NFTs with distinct features that set them apart.
              You'll find these moderately often in your minting journey.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2 flex items-center">
              <span className="w-4 h-4 bg-gray-600 rounded-full mr-2"></span>
              Common
            </h3>
            <p className="text-sm text-muted-foreground">
              The most frequently encountered NFTs. Though common, each still has 
              its own personality and unique look.
            </p>
          </div>
        </div>
      </div>
      
      {/* Filter Controls */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-foreground'}`}
        >
          All
        </button>
        {rarityLevels.map(level => {
          // Get background color for rarity
          const bgColor = level.name === 'legendary' ? '#ffd700' : 
                          level.name === 'epic' ? '#9932cc' :
                          level.name === 'rare' ? '#4169e1' :
                          level.name === 'uncommon' ? '#2e8b57' : '#777777';
          
          return (
            <button 
              key={level.name}
              onClick={() => setFilter(level.name)}
              className={`px-4 py-2 rounded-full flex items-center ${filter === level.name ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-foreground'}`}
            >
              <span 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: bgColor }}
              ></span>
              {level.name.charAt(0).toUpperCase() + level.name.slice(1)}
            </button>
          );
        })}
      </div>
      
      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredNFTs.map((nft) => {
          const isMinted = mintedNFTs.includes(nft.id);
          return (
            <div key={nft.id} className="bg-card rounded-xl overflow-hidden border shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={nft.image} 
                  alt={nft.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  onError={(e) => {
                    // If image fails to load, show a default color background
                    const fallbackColor = nft.rarity === 'legendary' ? '#ffd700' : 
                                         nft.rarity === 'epic' ? '#9932cc' :
                                         nft.rarity === 'rare' ? '#4169e1' :
                                         nft.rarity === 'uncommon' ? '#2e8b57' : '#777777';
                    
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.style.backgroundColor = fallbackColor;
                      e.currentTarget.style.display = 'none';
                    }
                  }}
                />
                <div className="absolute top-0 right-0 p-2">
                  <div className={`text-white text-xs font-bold px-2 py-1 rounded-full`}
                    style={{
                      backgroundColor: nft.rarity === 'legendary' ? '#ffd700' : 
                                       nft.rarity === 'epic' ? '#9932cc' :
                                       nft.rarity === 'rare' ? '#4169e1' :
                                       nft.rarity === 'uncommon' ? '#2e8b57' : '#777777'
                    }}>
                    {nft.rarity.toUpperCase()}
                  </div>
                </div>
                {isMinted && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="bg-green-600 text-white font-bold px-4 py-2 rounded-full">MINTED</div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{nft.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {nft.attributes.slice(0, 3).map((attr, idx) => (
                    <span 
                      key={idx}
                      className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded"
                    >
                      {attr.value}
                    </span>
                  ))}
                  {nft.attributes.length > 3 && (
                    <span className="bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded">+{nft.attributes.length - 3} more</span>
                  )}
                </div>
                
                {isMinted ? (
                  <Link href={`/nft/${nft.id}`}>
                    <button className="w-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-semibold py-2 rounded-lg transition-colors">
                      View Details
                    </button>
                  </Link>
                ) : (
                  <button 
                    onClick={() => handleMint(nft.id)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg transition-all"
                  >
                    Mint This NFT
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredNFTs.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold mb-2">No NFTs Found</h3>
          <p className="text-muted-foreground">Try selecting a different rarity filter</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedNFTGallery;
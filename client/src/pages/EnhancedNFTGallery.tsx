import { useState, useEffect } from 'react';
import { sampleNFTs, rarityLevels } from '../data/nftData';
import { NFT } from '../types/nft';
import { useWallet } from '../contexts/WalletContext';
import { useLanguage } from '../contexts/LanguageContext';

const EnhancedNFTGallery = () => {
  const { isConnected } = useWallet();
  const { language, setLanguage, t } = useLanguage();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [mintedNFTs, setMintedNFTs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [merchantFilter, setMerchantFilter] = useState('all');
  
  useEffect(() => {
    // Use the pre-defined sample NFTs
    setNfts(sampleNFTs);
    
    // Simulate some minted NFTs
    const randomMinted = sampleNFTs
      .filter(() => Math.random() > 0.7)
      .map((nft: NFT) => nft.id);
    
    setMintedNFTs(randomMinted);
    setLoading(false);
  }, []);
  
  // Filter NFTs based on rarity and merchant
  const filteredNFTs = nfts.filter(nft => {
    const rarityMatch = filter === 'all' || nft.rarity === filter;
    const merchantMatch = merchantFilter === 'all' || nft.merchant === merchantFilter;
    return rarityMatch && merchantMatch;
  });
  
  const handleMint = (id: string) => {
    if (isConnected) {
      setMintedNFTs(prev => [...prev, id]);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">


        <p className="text-xl text-gray-300 mb-8 max-w-3xl">
          {t('gallery.description')}
        </p>
        
        {/* Merchant Filter Controls */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-white">{t('gallery.filterByMerchant')}</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setMerchantFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                merchantFilter === 'all' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              {t('gallery.allMerchants')}
            </button>
            <button 
              onClick={() => setMerchantFilter('dunkin')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                merchantFilter === 'dunkin' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              🍩 Dunkin'
            </button>
            <button 
              onClick={() => setMerchantFilter('cvs')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                merchantFilter === 'cvs' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
            >
              💊 CVS
            </button>
          </div>
        </div>

        {/* Rarity Filter Controls */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3 text-white">{t('gallery.filterByRarity')}</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}`}
            >
              {t('gallery.allRarities')}
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
        </div>
        
        {/* NFT Grid - Trading Card Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredNFTs.map((nft) => {
            const isMinted = mintedNFTs.includes(nft.id);
            
            // Define card color schemes based on rarity
            const rarityColors = {
              legendary: 'border-yellow-400 shadow-yellow-400/50',
              epic: 'border-purple-400 shadow-purple-400/50',
              rare: 'border-blue-400 shadow-blue-400/50',
              uncommon: 'border-green-400 shadow-green-400/50',
              common: 'border-gray-400 shadow-gray-400/50'
            };
            
            const cardColorClass = rarityColors[nft.rarity as keyof typeof rarityColors] || 'border-gray-400 shadow-gray-400/50';
            
            return (
              <div
                key={nft.id}
                className={`relative group cursor-pointer transition-all duration-300 hover:scale-105 ${cardColorClass}`}
              >
                {/* Trading Card Container */}
                <div className={`bg-gradient-to-br from-card via-card to-muted rounded-xl overflow-hidden border-2 shadow-lg hover:shadow-2xl transition-all duration-300 ${cardColorClass}`}>
                  
                  {/* Card Header with Rarity Badge */}
                  <div className="relative p-4 pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-white leading-tight">{nft.name}</h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-semibold bg-${getRarityColor(nft.rarity)} text-white`}>
                        {nft.rarity.toUpperCase()}
                      </div>
                    </div>
                    
                    {/* Merchant Badge */}
                    {nft.merchant && (
                      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-white">
                        {nft.merchant === 'dunkin' ? '🍩 Dunkin\'' : nft.merchant === 'cvs' ? '💊 CVS' : nft.merchant}
                      </div>
                    )}
                  </div>
                  
                  {/* NFT Image */}
                  <div className="relative px-4 pb-4">
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300/9CA3AF/FFFFFF?text=NFT';
                        }}
                      />
                    </div>
                    
                    {/* Holographic Effect Overlay */}
                    <div className="absolute inset-4 rounded-lg bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {nft.description}
                    </p>
                    
                    {/* Attributes */}
                    <div className="space-y-1 mb-4">
                      {nft.attributes.slice(0, 2).map((attr, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-gray-400">{attr.trait_type}:</span>
                          <span className="font-medium text-white">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Action Button */}
                    {isMinted ? (
                      <div className="w-full py-2 px-4 rounded-lg font-medium text-sm bg-green-600 text-white text-center">
                        {t('gallery.minted')}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMint(nft.id)}
                        className="w-full py-3 px-4 rounded-lg font-bold text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200 border border-blue-500"
                      >
                        {t('gallery.mintThisNft')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredNFTs.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold mb-2 text-white">{t('gallery.noNftsFound')}</h3>
            <p className="text-gray-400">{t('gallery.tryDifferentFilter')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedNFTGallery;
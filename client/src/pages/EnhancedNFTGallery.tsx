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
  const [merchantFilter, setMerchantFilter] = useState('all');
  
  useEffect(() => {
    // Use the pre-defined sample NFTs
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
  
  // Filter NFTs based on rarity and merchant
  const filteredNFTs = nfts.filter(nft => {
    const rarityMatch = filter === 'all' || nft.rarity === filter;
    const merchantMatch = merchantFilter === 'all' || nft.merchant === merchantFilter;
    return rarityMatch && merchantMatch;
  });
  
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
        Discover our exclusive character NFTs - each with unique traits and varying rarity levels.
        Mint these collectible characters to your wallet or earn them by uploading receipts.
      </p>
      
      {/* Merchant Filter Controls */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Filter by Merchant</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setMerchantFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              merchantFilter === 'all' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-foreground hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            All Merchants
          </button>
          <button 
            onClick={() => setMerchantFilter('dunkin')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              merchantFilter === 'dunkin' 
                ? 'bg-orange-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-foreground hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            🍩 Dunkin'
          </button>
          <button 
            onClick={() => setMerchantFilter('cvs')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              merchantFilter === 'cvs' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-foreground hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            💊 CVS
          </button>
        </div>
      </div>

      {/* Rarity Filter Controls */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Filter by Rarity</h3>
        <div className="flex flex-wrap gap-2">
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
      
      {/* NFT Grid - Trading Card Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredNFTs.map((nft) => {
          const isMinted = mintedNFTs.includes(nft.id);
          
          // Define card color schemes based on rarity
          const getCardStyle = (rarity: string) => {
            switch (rarity) {
              case 'legendary':
                return {
                  borderColor: 'border-yellow-400',
                  bgGradient: 'from-yellow-600 via-orange-500 to-red-500',
                  cardBg: 'from-yellow-900/30 via-orange-900/30 to-red-900/30',
                  textColor: 'text-yellow-200',
                  buttonGradient: 'from-yellow-500 to-orange-600'
                };
              case 'epic':
                return {
                  borderColor: 'border-purple-400',
                  bgGradient: 'from-purple-600 via-pink-500 to-purple-600',
                  cardBg: 'from-purple-900/30 via-pink-900/30 to-purple-900/30',
                  textColor: 'text-purple-200',
                  buttonGradient: 'from-purple-500 to-pink-600'
                };
              case 'rare':
                return {
                  borderColor: 'border-blue-400',
                  bgGradient: 'from-blue-600 via-cyan-500 to-blue-600',
                  cardBg: 'from-blue-900/30 via-cyan-900/30 to-blue-900/30',
                  textColor: 'text-blue-200',
                  buttonGradient: 'from-blue-500 to-cyan-600'
                };
              case 'uncommon':
                return {
                  borderColor: 'border-green-400',
                  bgGradient: 'from-green-600 via-emerald-500 to-green-600',
                  cardBg: 'from-green-900/30 via-emerald-900/30 to-green-900/30',
                  textColor: 'text-green-200',
                  buttonGradient: 'from-green-500 to-emerald-600'
                };
              default:
                return {
                  borderColor: 'border-gray-400',
                  bgGradient: 'from-gray-600 via-gray-500 to-gray-600',
                  cardBg: 'from-gray-900/30 via-gray-800/30 to-gray-900/30',
                  textColor: 'text-gray-200',
                  buttonGradient: 'from-gray-500 to-gray-600'
                };
            }
          };
          
          const cardStyle = getCardStyle(nft.rarity);
          
          return (
            <div 
              key={nft.id} 
              className={`relative bg-gray-900 rounded-2xl p-4 ${cardStyle.borderColor} border-4 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 group overflow-hidden`}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cardStyle.cardBg} opacity-80`}></div>
              
              {/* Header with brand */}
              <div className="relative z-10 flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-black text-sm tracking-wider">BLOCKRECEIPT</span>
                  <span className={`${cardStyle.textColor} font-bold text-xs`}>NFT</span>
                </div>
                <div className={`text-white text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${cardStyle.bgGradient} shadow-lg`}>
                  {nft.rarity.toUpperCase()}
                </div>
              </div>
              
              {/* Main image area with neon border */}
              <div className={`relative rounded-xl mb-4 overflow-hidden bg-gradient-to-br ${cardStyle.bgGradient} p-0.5 group-hover:p-1 transition-all duration-300`}>
                <div className="bg-gray-900 rounded-xl overflow-hidden">
                  <div className="aspect-square relative">
                    <img 
                      src={nft.image} 
                      alt={nft.name}
                      className={`w-full h-full object-cover transition-all duration-500 ${isMinted ? 'grayscale opacity-60' : 'group-hover:scale-110'}`}
                      onError={(e) => {
                        const fallbackGradient = cardStyle.bgGradient;
                        if (e.currentTarget.parentElement) {
                          e.currentTarget.parentElement.className += ` bg-gradient-to-br ${fallbackGradient}`;
                          e.currentTarget.style.display = 'none';
                        }
                      }}
                    />
                    {isMinted && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <div className="bg-green-500 text-white font-bold px-4 py-2 rounded-full text-sm animate-pulse">MINTED</div>
                      </div>
                    )}
                    {/* Holographic shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
                  </div>
                </div>
              </div>
              
              {/* NFT Name with bold styling */}
              <div className="relative z-10 text-center mb-3">
                <h3 className="text-white font-black text-lg tracking-wide uppercase">{nft.name}</h3>
              </div>
              
              {/* Serial number style like Dunkin' cards */}
              <div className="relative z-10 flex justify-between items-center text-xs font-mono mb-4">
                <span className={cardStyle.textColor}>0001</span>
                <div className="flex space-x-1">
                  {Array.from({length: 16}).map((_, i) => (
                    <span key={i} className="text-gray-600">•</span>
                  ))}
                </div>
                <span className={cardStyle.textColor}>0000</span>
              </div>
              
              {/* Action button */}
              <div className="relative z-10">
                {isMinted ? (
                  <Link href={`/nft/${nft.id}`}>
                    <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all duration-300 text-sm uppercase tracking-wider shadow-lg">
                      View Details
                    </button>
                  </Link>
                ) : (
                  <button 
                    onClick={() => handleMint(nft.id)}
                    className={`w-full bg-gradient-to-r ${cardStyle.buttonGradient} text-white font-bold py-3 rounded-lg hover:shadow-xl transition-all duration-300 text-sm uppercase tracking-wider transform hover:scale-105 shadow-lg`}
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
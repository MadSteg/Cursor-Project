import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

// Define the NFT type structure
interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

// Collection of Bulldog NFTs
const bulldogNFTs: NFT[] = [
  {
    id: 'bulldog-cowboy',
    name: 'Cowboy Bulldog',
    description: 'A cool cowboy bulldog with a stylish hat and plaid shirt.',
    image: '/src/assets/Screenshot 2025-05-20 at 12.26.19 AM.png',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Outfit', value: 'Cowboy' },
      { trait_type: 'Hat', value: 'Cowboy Hat' },
      { trait_type: 'Personality', value: 'Adventurous' }
    ]
  },
  {
    id: 'bulldog-hoodie',
    name: 'Hoodie Bulldog',
    description: 'A relaxed bulldog wearing a comfortable green hoodie.',
    image: '/src/assets/Screenshot 2025-05-20 at 12.26.25 AM.png',
    rarity: 'common',
    attributes: [
      { trait_type: 'Outfit', value: 'Hoodie' },
      { trait_type: 'Hat', value: 'Hood' },
      { trait_type: 'Personality', value: 'Chill' }
    ]
  },
  {
    id: 'bulldog-tophat',
    name: 'Dapper Bulldog',
    description: 'An elegant bulldog with a top hat and bow tie.',
    image: '/src/assets/Screenshot 2025-05-20 at 12.26.32 AM.png',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Outfit', value: 'Striped Shirt' },
      { trait_type: 'Hat', value: 'Top Hat' },
      { trait_type: 'Accessory', value: 'Bow Tie' },
      { trait_type: 'Personality', value: 'Sophisticated' }
    ]
  },
  {
    id: 'bulldog-angel',
    name: 'Angel Bulldog',
    description: 'A heavenly bulldog with angel wings and a halo.',
    image: '/src/assets/Screenshot 2025-05-20 at 12.27.03 AM.png',
    rarity: 'legendary',
    attributes: [
      { trait_type: 'Outfit', value: 'Striped Shirt' },
      { trait_type: 'Accessory', value: 'Angel Wings' },
      { trait_type: 'Accessory', value: 'Halo' },
      { trait_type: 'Personality', value: 'Pure' }
    ]
  },
  {
    id: 'bulldog-cow',
    name: 'Cow Bulldog',
    description: 'A bulldog with cow spots and small horns.',
    image: '/src/assets/Screenshot 2025-05-20 at 12.26.43 AM.png',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Outfit', value: 'Casual' },
      { trait_type: 'Pattern', value: 'Cow Spots' },
      { trait_type: 'Accessory', value: 'Horns' },
      { trait_type: 'Personality', value: 'Playful' }
    ]
  },
  {
    id: 'bulldog-newsboy',
    name: 'Newsboy Bulldog',
    description: 'A vintage-styled bulldog with a classic newsboy cap.',
    image: '/src/assets/Screenshot 2025-05-20 at 12.26.49 AM.png',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Outfit', value: 'Jacket' },
      { trait_type: 'Hat', value: 'Newsboy Cap' },
      { trait_type: 'Personality', value: 'Classic' }
    ]
  },
  {
    id: 'bulldog-beer',
    name: 'Social Bulldog',
    description: 'A friendly bulldog enjoying a cold beer.',
    image: '/src/assets/Screenshot 2025-05-20 at 12.26.53 AM.png',
    rarity: 'common',
    attributes: [
      { trait_type: 'Outfit', value: 'Jersey' },
      { trait_type: 'Accessory', value: 'Beer Mug' },
      { trait_type: 'Personality', value: 'Social' }
    ]
  },
  {
    id: 'bulldog-stripes',
    name: 'Striped Bulldog',
    description: 'A sporty bulldog in a green and white striped jersey.',
    image: '/src/assets/Screenshot 2025-05-20 at 12.25.54 AM.png',
    rarity: 'common',
    attributes: [
      { trait_type: 'Outfit', value: 'Striped Jersey' },
      { trait_type: 'Team', value: 'Green Stars' },
      { trait_type: 'Personality', value: 'Sporty' }
    ]
  },
  {
    id: 'bulldog-soccer',
    name: 'Soccer Bulldog',
    description: 'A sporty bulldog with a soccer ball and athletic jersey.',
    image: '/src/assets/Screenshot 2025-05-20 at 12.26.00 AM.png',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Outfit', value: 'Soccer Jersey' },
      { trait_type: 'Hat', value: 'Cap' },
      { trait_type: 'Accessory', value: 'Soccer Ball' },
      { trait_type: 'Personality', value: 'Athletic' }
    ]
  },
  {
    id: 'bulldog-casual',
    name: 'Urban Bulldog',
    description: 'A city-dwelling bulldog with a casual blue outfit.',
    image: '/src/assets/Screenshot 2025-05-20 at 12.26.06 AM.png',
    rarity: 'common',
    attributes: [
      { trait_type: 'Outfit', value: 'Blue Sweater' },
      { trait_type: 'Hat', value: 'Beanie' },
      { trait_type: 'Personality', value: 'Urban' }
    ]
  },
  {
    id: 'bulldog-captain',
    name: 'Captain Bulldog',
    description: 'A distinguished bulldog in a naval captain uniform.',
    image: '/src/assets/Screenshot 2025-05-20 at 12.26.57 AM.png',
    rarity: 'epic',
    attributes: [
      { trait_type: 'Outfit', value: 'Naval Uniform' },
      { trait_type: 'Hat', value: 'Captain Hat' },
      { trait_type: 'Rank', value: 'Captain' },
      { trait_type: 'Personality', value: 'Authoritative' }
    ]
  },
  {
    id: 'bulldog-dad',
    name: 'Daddy Bulldog',
    description: 'A caring bulldog dad with his bulldog teddy.',
    image: '/src/assets/Screenshot 2025-05-20 at 12.26.12 AM.png',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Outfit', value: 'Striped Jersey' },
      { trait_type: 'Accessory', value: 'Teddy Bear' },
      { trait_type: 'Personality', value: 'Caring' }
    ]
  },
];

// Get rarity color
const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-500';
    case 'uncommon':
      return 'bg-green-500';
    case 'rare':
      return 'bg-blue-500';
    case 'epic':
      return 'bg-purple-500';
    case 'legendary':
      return 'bg-amber-500';
    default:
      return 'bg-gray-500';
  }
};

// Component for NFT card
const NFTCard: React.FC<{ nft: NFT; onClick: () => void }> = ({ nft, onClick }) => {
  return (
    <div 
      className="bg-card rounded-lg overflow-hidden border border-border shadow-sm nft-card cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={nft.image}
          alt={nft.name}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)} text-white text-xs font-bold px-2 py-1 rounded-md`}>
          {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{nft.description}</p>
        <div className="flex flex-wrap gap-1">
          {nft.attributes.slice(0, 2).map((attr, index) => (
            <span key={index} className="inline-block bg-primary/10 text-primary text-xs rounded-full px-2 py-1">
              {attr.value}
            </span>
          ))}
          {nft.attributes.length > 2 && (
            <span className="inline-block bg-secondary/10 text-secondary text-xs rounded-full px-2 py-1">
              +{nft.attributes.length - 2} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// NFT Detail Modal
const NFTDetailModal: React.FC<{ nft: NFT; onClose: () => void; onMint: () => void }> = ({ 
  nft, 
  onClose,
  onMint
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-card rounded-lg shadow-xl max-w-lg w-full overflow-hidden animate-slide-up">
        <div className="relative">
          <img 
            src={nft.image} 
            alt={nft.name} 
            className="w-full h-64 object-contain bg-black"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className={`absolute top-4 left-4 ${getRarityColor(nft.rarity)} text-white text-xs font-bold px-2 py-1 rounded-md`}>
            {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2">{nft.name}</h3>
          <p className="text-muted-foreground mb-4">{nft.description}</p>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Attributes</h4>
            <div className="grid grid-cols-2 gap-2">
              {nft.attributes.map((attr, index) => (
                <div key={index} className="bg-secondary/10 rounded-md p-2 text-sm">
                  <div className="text-xs text-muted-foreground">{attr.trait_type}</div>
                  <div className="font-medium">{attr.value}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onMint}
              className="px-4 py-2 brand-gradient-bg text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Mint This NFT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main NFT Collection Component
const NFTCollection: React.FC = () => {
  const { isConnected } = useWallet();
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mintingNFT, setMintingNFT] = useState<string | null>(null);
  const [mintedNFTs, setMintedNFTs] = useState<string[]>([]);
  
  // Filter NFTs based on criteria
  const filteredNFTs = bulldogNFTs.filter(nft => {
    const matchesFilter = filter === 'all' || nft.rarity === filter;
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         nft.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.attributes.some(attr => attr.value.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });
  
  // Handle minting an NFT
  const handleMint = (nftId: string) => {
    setMintingNFT(nftId);
    
    // Simulate minting process
    setTimeout(() => {
      setMintedNFTs(prev => [...prev, nftId]);
      setMintingNFT(null);
      setSelectedNFT(null);
      
      // Show confetti for successful mint
      triggerConfetti();
    }, 2000);
  };
  
  // Create and animate confetti elements
  const triggerConfetti = () => {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);
    
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      const leftPos = Math.random() * 100;
      const fallDuration = (Math.random() * 3) + 2;
      const shakeDuration = (Math.random() * 0.5) + 0.5;
      const shakeDistance = (Math.random() * 15) - 7.5;
      
      confetti.style.setProperty('--color', color);
      confetti.style.setProperty('--fall-duration', `${fallDuration}s`);
      confetti.style.setProperty('--shake-duration', `${shakeDuration}s`);
      confetti.style.setProperty('--shake-distance', `${shakeDistance}px`);
      confetti.style.left = `${leftPos}%`;
      
      container.appendChild(confetti);
    }
    
    setTimeout(() => {
      document.body.removeChild(container);
    }, 5000);
  };
  
  // Not connected
  if (!isConnected) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6 brand-gradient-text">Bulldog NFT Collection</h1>
          
          <div className="bg-card shadow-sm rounded-lg p-8 border animate-pulse-custom">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M14 12h4" />
              <path d="M6 12h4" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Please connect your wallet to browse and mint from our exclusive Bulldog NFT collection
            </p>
            <button
              onClick={() => {}}
              className="interactive-button px-4 py-2 rounded-md text-sm font-medium text-white brand-gradient-bg"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold brand-gradient-text">Bulldog NFT Collection</h1>
            <p className="text-muted-foreground mt-1">Exclusive digital collectibles for BlockReceipt users</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNFTs.map((nft) => (
            <div key={nft.id} className="relative">
              <NFTCard nft={nft} onClick={() => setSelectedNFT(nft)} />
              {mintedNFTs.includes(nft.id) && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                  Minted
                </div>
              )}
            </div>
          ))}
        </div>
        
        {filteredNFTs.length === 0 && (
          <div className="bg-card shadow-sm rounded-lg p-8 border text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No NFTs Found</h2>
            <p className="text-muted-foreground mb-6">
              No NFTs match your current search criteria. Try adjusting your filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              className="interactive-button px-4 py-2 rounded-md text-sm font-medium text-white brand-gradient-bg"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
      
      {selectedNFT && (
        <NFTDetailModal 
          nft={selectedNFT} 
          onClose={() => setSelectedNFT(null)} 
          onMint={() => handleMint(selectedNFT.id)}
        />
      )}
      
      {mintingNFT && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg shadow-xl p-6 max-w-md w-full text-center">
            <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-bold mb-2">Minting Your NFT</h3>
            <p className="text-muted-foreground">
              Please wait while we mint your NFT on the blockchain...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTCollection;
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import Confetti from '../components/Confetti';

// Define NFT type structure
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
  mintedAt?: string;
  tokenId?: string;
  owner?: string;
  txHash?: string;
}

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

// Sample NFTs
const bulldogNFTs: Record<string, NFT> = {
  'bulldog-cowboy': {
    id: 'bulldog-cowboy',
    name: 'Cowboy Bulldog',
    description: 'A cool cowboy bulldog with a stylish hat and plaid shirt. This rare collectible has a unique Western style.',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.19 AM.png',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Outfit', value: 'Cowboy' },
      { trait_type: 'Hat', value: 'Cowboy Hat' },
      { trait_type: 'Personality', value: 'Adventurous' },
      { trait_type: 'Collection', value: 'BlockReceipt Buddies' },
      { trait_type: 'Series', value: 'Fashion Series' }
    ],
    mintedAt: '2025-05-15T14:34:21Z',
    tokenId: '123456',
    owner: '0x1234...7890',
    txHash: '0xabcd...ef01'
  },
  'bulldog-angel': {
    id: 'bulldog-angel',
    name: 'Angel Bulldog',
    description: 'A heavenly bulldog with angel wings and a halo. This legendary NFT is extremely rare and features unique celestial elements.',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.27.03 AM.png',
    rarity: 'legendary',
    attributes: [
      { trait_type: 'Outfit', value: 'Striped Shirt' },
      { trait_type: 'Accessory', value: 'Angel Wings' },
      { trait_type: 'Accessory', value: 'Halo' },
      { trait_type: 'Personality', value: 'Pure' },
      { trait_type: 'Collection', value: 'BlockReceipt Buddies' },
      { trait_type: 'Series', value: 'Charity Series' }
    ],
    mintedAt: '2025-05-18T09:12:45Z',
    tokenId: '789012',
    owner: '0x1234...7890',
    txHash: '0xefab...cd23'
  }
};

const NFTDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [_, navigate] = useLocation();
  const [nft, setNft] = useState<NFT | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [rotateY, setRotateY] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  
  // This would normally be an API call to get NFT details
  useEffect(() => {
    const fetchNFT = async () => {
      setLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        if (id && bulldogNFTs[id]) {
          setNft(bulldogNFTs[id]);
          
          // Show confetti if this is a newly minted NFT (check URL param)
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('new') === 'true') {
            setShowConfetti(true);
          }
        }
        setLoading(false);
      }, 1000);
    };
    
    fetchNFT();
  }, [id]);
  
  const handleFlip = () => {
    if (!isFlipping) {
      setIsFlipping(true);
      setRotateY(prev => prev === 0 ? 180 : 0);
      setTimeout(() => {
        setIsFlipping(false);
      }, 500);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="mt-4 text-muted-foreground">Loading NFT details...</p>
        </div>
      </div>
    );
  }
  
  if (!nft) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-lg mx-auto bg-card shadow-sm rounded-lg p-8 border text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">NFT Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find the NFT you're looking for. It may have been moved or doesn't exist.
          </p>
          <button
            onClick={() => navigate('/nft-browser')}
            className="interactive-button px-4 py-2 rounded-md text-sm font-medium text-white brand-gradient-bg"
          >
            Back to Collection
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      {showConfetti && <Confetti active={true} duration={5000} />}
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold brand-gradient-text">NFT Detail</h1>
        <button
          onClick={() => navigate('/nft-browser')}
          className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
        >
          Back to Collection
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* NFT Image with 3D Flip Effect */}
        <div className="relative perspective-1000 cursor-pointer" onClick={handleFlip}>
          <div 
            className="relative transition-transform duration-500 transform-style-3d"
            style={{ transform: `rotateY(${rotateY}deg)` }}
          >
            {/* Front side */}
            <div 
              className={`w-full overflow-hidden rounded-lg shadow-lg ${rotateY === 180 ? 'backface-hidden' : ''}`}
            >
              <div className="relative">
                <img 
                  src={nft.image} 
                  alt={nft.name} 
                  className="w-full h-auto object-contain bg-black aspect-square"
                />
                <div className={`absolute top-4 right-4 ${getRarityColor(nft.rarity)} text-white px-3 py-1 rounded-md font-bold`}>
                  {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
                </div>
                
                {showConfetti && (
                  <div className="absolute top-0 left-0 right-0 text-center mt-4">
                    <div className="inline-block bg-black/70 text-white px-4 py-2 rounded-full font-bold animate-bounce">
                      New NFT Minted!
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Back side */}
            <div 
              className={`absolute inset-0 w-full h-full rounded-lg shadow-lg bg-card p-6 flex flex-col justify-center ${rotateY === 0 ? 'backface-hidden' : ''}`}
              style={{ transform: 'rotateY(180deg)' }}
            >
              <h3 className="text-xl font-bold mb-4">Blockchain Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Token ID</p>
                  <p className="font-mono text-sm truncate">{nft.tokenId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Owner</p>
                  <p className="font-mono text-sm truncate">{nft.owner}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Hash</p>
                  <p className="font-mono text-sm truncate">{nft.txHash}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Minted On</p>
                  <p className="text-sm">{new Date(nft.mintedAt as string).toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-6 text-center text-sm text-muted-foreground">
                Click to flip back
              </div>
            </div>
          </div>
          
          {/* Flip indicator */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white rounded-full p-2 flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Flip</span>
          </div>
        </div>
        
        {/* NFT Details */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">{nft.name}</h2>
            <p className="text-muted-foreground">{nft.description}</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Attributes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {nft.attributes.map((attr, index) => (
                <div key={index} className="bg-card border rounded-lg p-3 hover:shadow-md transition-shadow">
                  <p className="text-xs text-muted-foreground">{attr.trait_type}</p>
                  <p className="font-medium truncate">{attr.value}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-3">Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                Share NFT
              </button>
              <button className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors">
                View on Blockchain
              </button>
              <button className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors">
                Download Image
              </button>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-3">Collection Progress</h3>
            <div className="flex items-center mb-4">
              <div className="w-full bg-secondary rounded-full h-2.5">
                <div className="brand-gradient-bg h-2.5 rounded-full" style={{ width: '35%' }}></div>
              </div>
              <span className="ml-2 text-sm font-medium">35%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You've collected 7 out of 20 Bulldog NFTs in this collection!
            </p>
            
            <div className="mt-6 p-4 bg-secondary/20 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                How to get more Bulldogs
              </h4>
              <p className="text-sm text-muted-foreground">
                {nft.id === 'bulldog-cowboy' 
                  ? 'Keep shopping at fashion retailers to earn more Fashion Series NFTs!'
                  : 'Continue making charitable donations to earn Charity Series NFTs!'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <style>
        {`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        `}
      </style>
    </div>
  );
};

export default NFTDetail;
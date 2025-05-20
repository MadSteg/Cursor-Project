import React, { useState, useEffect } from 'react';

// NFT reward types that can be earned through receipts
interface NFTReward {
  id: string;
  name: string;
  image: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  conditions: {
    merchant?: string;
    minSpend?: number;
    category?: string;
  };
}

// Sample rewards based on categories or merchants
const availableRewards: NFTReward[] = [
  {
    id: 'bulldog-cowboy',
    name: 'Cowboy Bulldog',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.19 AM.png',
    rarity: 'rare',
    conditions: {
      category: 'Fashion',
      minSpend: 50
    }
  },
  {
    id: 'bulldog-hoodie',
    name: 'Hoodie Bulldog',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.25 AM.png',
    rarity: 'common',
    conditions: {
      merchant: 'Casual Styles',
      minSpend: 25
    }
  },
  {
    id: 'bulldog-tophat',
    name: 'Dapper Bulldog',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.32 AM.png',
    rarity: 'uncommon',
    conditions: {
      category: 'Formal Wear',
      minSpend: 75
    }
  },
  {
    id: 'bulldog-angel',
    name: 'Angel Bulldog',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.27.03 AM.png',
    rarity: 'legendary',
    conditions: {
      category: 'Charitable Donation',
      minSpend: 100
    }
  },
  {
    id: 'bulldog-cow',
    name: 'Cow Bulldog',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.43 AM.png',
    rarity: 'rare',
    conditions: {
      merchant: 'Farm Fresh Market',
      minSpend: 50
    }
  },
  {
    id: 'bulldog-beer',
    name: 'Social Bulldog',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.53 AM.png',
    rarity: 'common',
    conditions: {
      category: 'Dining',
      minSpend: 30
    }
  },
  {
    id: 'bulldog-stripes',
    name: 'Striped Bulldog',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.25.54 AM.png',
    rarity: 'common',
    conditions: {
      category: 'Sports Goods',
      minSpend: 20
    }
  },
  {
    id: 'bulldog-soccer',
    name: 'Soccer Bulldog',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.00 AM.png',
    rarity: 'uncommon',
    conditions: {
      merchant: 'Sports Central',
      minSpend: 40
    }
  },
  {
    id: 'bulldog-casual',
    name: 'Urban Bulldog',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.06 AM.png',
    rarity: 'common',
    conditions: {
      category: 'Urban Wear',
      minSpend: 35
    }
  },
  {
    id: 'bulldog-captain',
    name: 'Captain Bulldog',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.57 AM.png',
    rarity: 'epic',
    conditions: {
      merchant: 'Luxury Marine',
      minSpend: 200
    }
  },
  {
    id: 'bulldog-dad',
    name: 'Daddy Bulldog',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.12 AM.png',
    rarity: 'rare',
    conditions: {
      category: 'Children',
      minSpend: 60
    }
  }
];

// Get rarity color for styling
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

// Component to display potential NFT rewards
interface NFTRewardPreviewProps {
  merchantName?: string;
  category?: string;
  total?: number;
}

const NFTRewardPreview: React.FC<NFTRewardPreviewProps> = ({ 
  merchantName, 
  category, 
  total = 0 
}) => {
  const [potentialRewards, setPotentialRewards] = useState<NFTReward[]>([]);
  const [previewMode, setPreviewMode] = useState<'carousel' | 'grid'>('carousel');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Find eligible rewards based on receipt data
  useEffect(() => {
    const eligible = availableRewards.filter(reward => {
      // Check merchant match
      const merchantMatch = !reward.conditions.merchant || 
                           (merchantName && merchantName.toLowerCase().includes(reward.conditions.merchant.toLowerCase()));
      
      // Check category match
      const categoryMatch = !reward.conditions.category || 
                           (category && category.toLowerCase().includes(reward.conditions.category.toLowerCase()));
      
      // Check minimum spend
      const spendMatch = !reward.conditions.minSpend || total >= reward.conditions.minSpend;
      
      return (merchantMatch || categoryMatch) && spendMatch;
    });
    
    // If no specific matches, provide some random options as "You might also like"
    const finalRewards = eligible.length > 0 
      ? eligible 
      : availableRewards.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    setPotentialRewards(finalRewards);
  }, [merchantName, category, total]);

  // No rewards to show
  if (potentialRewards.length === 0) {
    return null;
  }

  // Handle carousel navigation
  const nextReward = () => {
    setCurrentIndex((prev) => 
      prev === potentialRewards.length - 1 ? 0 : prev + 1
    );
  };

  const prevReward = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? potentialRewards.length - 1 : prev - 1
    );
  };

  // Carousel view
  if (previewMode === 'carousel') {
    const reward = potentialRewards[currentIndex];
    return (
      <div className="mt-6 p-6 border rounded-lg bg-card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold brand-gradient-text">NFT Reward Preview</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setPreviewMode('grid')}
              className="p-1 text-muted-foreground hover:text-foreground"
              title="Grid View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex justify-center relative">
          <button 
            onClick={prevReward} 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <div className="w-48 h-48 relative flex-shrink-0 nft-card transform transition-transform duration-500 ease-in-out hover:scale-105">
            <img 
              src={reward.image} 
              alt={reward.name} 
              className="w-full h-full object-cover rounded-lg shadow-md"
            />
            <div className={`absolute top-2 right-2 ${getRarityColor(reward.rarity)} text-white text-xs font-bold px-2 py-1 rounded-md`}>
              {reward.rarity.charAt(0).toUpperCase() + reward.rarity.slice(1)}
            </div>
          </div>
          
          <button 
            onClick={nextReward} 
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 z-10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        
        <div className="text-center mt-4">
          <h4 className="font-bold text-lg">{reward.name}</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Mint this NFT after uploading your receipt!
          </p>
          <div className="flex justify-center mt-2">
            <span className="text-xs text-center">
              {currentIndex + 1} of {potentialRewards.length} potential rewards
            </span>
          </div>
        </div>
      </div>
    );
  }
  
  // Grid view
  return (
    <div className="mt-6 p-6 border rounded-lg bg-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold brand-gradient-text">Available NFT Rewards</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => setPreviewMode('carousel')}
            className="p-1 text-muted-foreground hover:text-foreground"
            title="Carousel View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="10" rx="2" ry="2"></rect>
              <circle cx="8" cy="12" r="2"></circle>
              <path d="M19 12h.01"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {potentialRewards.map((reward) => (
          <div key={reward.id} className="relative nft-card">
            <img 
              src={reward.image} 
              alt={reward.name} 
              className="w-full h-24 sm:h-32 object-cover rounded-lg shadow-md"
            />
            <div className={`absolute top-1 right-1 ${getRarityColor(reward.rarity)} text-white text-xs font-bold px-1 py-0.5 rounded-md`}>
              {reward.rarity.charAt(0).toUpperCase() + reward.rarity.slice(1)}
            </div>
            <div className="mt-1 text-xs text-center font-medium truncate px-1">
              {reward.name}
            </div>
          </div>
        ))}
      </div>
      
      <p className="text-sm text-muted-foreground text-center mt-4">
        Mint these NFTs after uploading your receipt!
      </p>
    </div>
  );
};

export default NFTRewardPreview;
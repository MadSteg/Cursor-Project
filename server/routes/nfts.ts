import { Request, Response } from 'express';

// NFT metadata interface
interface NFTMetadata {
  id: string;
  name: string;
  image: string;
  description: string;
  tier: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'LUXURY';
  categories: string[];
  attributes: {
    [key: string]: string | number;
  };
}

// Collection of NFTs
const NFT_COLLECTION: NFTMetadata[] = [
  {
    id: 'receipt-warrior',
    name: 'Receipt Warrior',
    image: '/nft-images/receipt-warrior.svg',
    description: 'A brave warrior ready to defend your purchase history with honor and pixels.',
    tier: 'PREMIUM',
    categories: ['entertainment', 'gaming', 'sports'],
    attributes: {
      rarity: 'Epic',
      power: 72,
      defense: 68,
      speed: 65
    }
  },
  {
    id: 'crypto-receipt',
    name: 'Crypto Receipt',
    image: '/nft-images/crypto-receipt.svg',
    description: 'Digital asset receipt secured with blockchain technology and pixel perfection.',
    tier: 'LUXURY',
    categories: ['tech', 'finance', 'cryptocurrency'],
    attributes: {
      rarity: 'Legendary',
      encryption: 92,
      decentralization: 88,
      volatility: 75
    }
  },
  {
    id: 'fashion-receipt',
    name: 'Fashion Couture Receipt',
    image: '/nft-images/fashion-receipt.svg',
    description: 'Stylish receipt that showcases your fashion-forward purchases with pixel elegance.',
    tier: 'PREMIUM',
    categories: ['fashion', 'clothing', 'accessories', 'retail'],
    attributes: {
      rarity: 'Rare',
      style: 85,
      trendiness: 79,
      exclusivity: 70
    }
  },
  {
    id: 'grocery-hero',
    name: 'Grocery Hero',
    image: '/nft-images/grocery-hero.svg',
    description: 'A super grocery receipt that saves the day by tracking all your essentials.',
    tier: 'STANDARD',
    categories: ['groceries', 'food', 'household'],
    attributes: {
      rarity: 'Uncommon',
      nutrition: 65,
      value: 60,
      sustainability: 70
    }
  },
  {
    id: 'restaurant-receipt',
    name: 'Dining Dazzler',
    image: '/nft-images/restaurant-receipt.svg',
    description: 'A culinary companion that preserves your gastronomic adventures in pixel perfection.',
    tier: 'PREMIUM',
    categories: ['restaurant', 'dining', 'food', 'entertainment'],
    attributes: {
      rarity: 'Rare',
      taste: 88,
      presentation: 90,
      atmosphere: 85
    }
  },
  {
    id: 'tech-receipt',
    name: 'Tech Titan Receipt',
    image: '/nft-images/tech-receipt.svg',
    description: 'The digital guardian of your tech purchases with circuit-board styling.',
    tier: 'LUXURY',
    categories: ['electronics', 'tech', 'gadgets', 'computers'],
    attributes: {
      rarity: 'Epic',
      processing: 95,
      innovation: 92,
      durability: 85
    }
  },
  {
    id: 'travel-receipt',
    name: 'Journey Journal',
    image: '/nft-images/travel-receipt.svg',
    description: 'Captures your travel expenses with adventurous pixel art styling.',
    tier: 'STANDARD',
    categories: ['travel', 'transportation', 'hotels', 'tourism'],
    attributes: {
      rarity: 'Uncommon',
      adventure: 80,
      discovery: 75,
      memory: 85
    }
  },
  {
    id: 'beauty-receipt',
    name: 'Beauty Buzz Receipt',
    image: '/nft-images/beauty-receipt.svg',
    description: 'Glamorous pixel art receipt for your beauty and personal care purchases.',
    tier: 'STANDARD',
    categories: ['beauty', 'cosmetics', 'personal care', 'salon'],
    attributes: {
      rarity: 'Uncommon',
      glamour: 78,
      style: 82,
      transformation: 75
    }
  }
];

// Helper function to find relevant NFTs based on receipt data
const findRelevantNFTs = (categories: string[] = [], tier: string = ''): NFTMetadata[] => {
  // If no categories or tier provided, return all NFTs
  if (categories.length === 0 && !tier) {
    return NFT_COLLECTION;
  }

  // Filter NFTs based on categories and tier
  return NFT_COLLECTION.filter(nft => {
    // Match by tier if provided
    const tierMatch = !tier || nft.tier === tier.toUpperCase();
    
    // If no categories provided, just use tier match
    if (categories.length === 0) {
      return tierMatch;
    }
    
    // Check if any categories match
    const categoryMatch = nft.categories.some(nftCategory => 
      categories.some(category => 
        nftCategory.toLowerCase().includes(category.toLowerCase()) || 
        category.toLowerCase().includes(nftCategory.toLowerCase())
      )
    );
    
    return tierMatch && categoryMatch;
  });
};

// Handler for fetching NFTs
export const getNFTs = async (req: Request, res: Response) => {
  try {
    const { categories = [], tier = '', receiptData = null } = req.body;
    
    // Get relevant NFTs based on receipt data
    const relevantNFTs = findRelevantNFTs(categories, tier);
    
    // If we don't have any relevant NFTs, just return all NFTs
    const nftsToReturn = relevantNFTs.length > 0 ? relevantNFTs : NFT_COLLECTION;
    
    // Random wait for simulation purposes (100-500ms)
    const waitTime = Math.floor(Math.random() * 400) + 100;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    res.json({ 
      success: true, 
      nfts: nftsToReturn,
      count: nftsToReturn.length
    });
  } catch (error) {
    console.error('Error in getNFTs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch NFTs',
      error: (error as Error).message 
    });
  }
};

// Handler for selecting an NFT for a receipt
export const selectNFT = async (req: Request, res: Response) => {
  try {
    const { selectedNft, receiptData } = req.body;
    
    if (!selectedNft || !receiptData) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: selectedNft or receiptData'
      });
    }
    
    // Here we would normally handle blockchain interaction to mint the NFT
    // For now we'll just simulate the minting process with a delay
    
    // Random wait time between 1-2 seconds to simulate blockchain transaction
    const waitTime = Math.floor(Math.random() * 1000) + 1000;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // Simulated blockchain transaction hash
    const txHash = `0x${Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')}`;
    
    res.json({
      success: true,
      message: 'NFT minted successfully',
      txHash,
      receiptId: receiptData.id || 'unknown',
      nftId: selectedNft.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in selectNFT:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mint NFT',
      error: (error as Error).message
    });
  }
};
/**
 * NFT Art Manifest
 * 
 * This file defines all available NFT art collections that can be used for BlockReceipt NFTs
 * based on the receipt's tier (Standard, Premium, Luxury, Ultra).
 */

import { ReceiptTier } from '@/lib/receiptOcr';

// Types for NFT Art collections
export interface NFTArtItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  collection: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  creator?: string;
  tier: ReceiptTier;
  type: 'game' | 'music' | 'art' | 'collectible' | 'sports' | 'utility';
  price: number; // in cents
}

export interface NFTArtCollection {
  id: string;
  name: string;
  description: string;
  type: 'game' | 'music' | 'art' | 'collectible' | 'sports' | 'utility';
  items: NFTArtItem[];
}

// NFT Art Collections
export const NFT_ART_COLLECTIONS: NFTArtCollection[] = [
  // Gaming NFTs
  {
    id: 'zeeverse',
    name: 'Zeeverse Game Items',
    description: 'Collectible items from the Zeeverse game world. Each NFT provides unique in-game utility.',
    type: 'game',
    items: [
      {
        id: 'zeeverse-waist-token',
        name: 'Waist Token',
        description: 'A rare token used for crafting special items in the Zeeverse world.',
        imageUrl: 'https://placehold.co/300x300/FFD700/000000?text=Waist+Token',
        collection: 'Zeeverse Game Items',
        rarity: 'rare',
        creator: 'Zeeverse',
        tier: ReceiptTier.STANDARD,
        type: 'game',
        price: 100
      },
      {
        id: 'zeeverse-fishing-bait',
        name: 'Fishing Bait',
        description: 'Special bait that increases your chances of catching rare fish.',
        imageUrl: 'https://placehold.co/300x300/87CEEB/000000?text=Fishing+Bait',
        collection: 'Zeeverse Game Items',
        rarity: 'uncommon',
        creator: 'Zeeverse',
        tier: ReceiptTier.STANDARD,
        type: 'game',
        price: 100
      },
      {
        id: 'zeeverse-speedorb',
        name: 'Speedorb',
        description: 'Increases movement speed by 15% for 30 minutes when used.',
        imageUrl: 'https://placehold.co/300x300/00FF00/000000?text=Speedorb',
        collection: 'Zeeverse Game Items',
        rarity: 'uncommon',
        creator: 'Zeeverse',
        tier: ReceiptTier.STANDARD,
        type: 'game',
        price: 100
      },
      {
        id: 'zeeverse-gloop',
        name: 'Gloop',
        description: 'A strange substance that can be transformed into valuable resources.',
        imageUrl: 'https://placehold.co/300x300/00FF7F/000000?text=Gloop',
        collection: 'Zeeverse Game Items',
        rarity: 'common',
        creator: 'Zeeverse',
        tier: ReceiptTier.STANDARD,
        type: 'game',
        price: 100
      },
      {
        id: 'zeeverse-gloop-x',
        name: 'Gloop-X',
        description: 'Enhanced version of Gloop with increased transformation potential.',
        imageUrl: 'https://placehold.co/300x300/9370DB/000000?text=Gloop-X',
        collection: 'Zeeverse Game Items',
        rarity: 'uncommon',
        creator: 'Zeeverse',
        tier: ReceiptTier.PREMIUM,
        type: 'game',
        price: 2000
      },
      {
        id: 'zeeverse-tin-ore',
        name: 'Tin Ore',
        description: 'Basic crafting material used in many beginner recipes.',
        imageUrl: 'https://placehold.co/300x300/708090/000000?text=Tin+Ore',
        collection: 'Zeeverse Game Items',
        rarity: 'common',
        creator: 'Zeeverse',
        tier: ReceiptTier.STANDARD,
        type: 'game',
        price: 100
      },
      {
        id: 'zeeverse-snork-raw',
        name: 'Snork (Raw)',
        description: 'A raw snork fish that can be cooked for health regeneration.',
        imageUrl: 'https://placehold.co/300x300/40E0D0/000000?text=Snork+Raw',
        collection: 'Zeeverse Game Items',
        rarity: 'uncommon',
        creator: 'Zeeverse',
        tier: ReceiptTier.STANDARD,
        type: 'game',
        price: 100
      },
      {
        id: 'zeeverse-snorker-fried',
        name: 'Snorker (Fried)',
        description: 'Delicious fried snorker fish that provides a health buff when consumed.',
        imageUrl: 'https://placehold.co/300x300/FFA500/000000?text=Snorker+Fried',
        collection: 'Zeeverse Game Items',
        rarity: 'uncommon',
        creator: 'Zeeverse',
        tier: ReceiptTier.STANDARD,
        type: 'game',
        price: 100
      },
      {
        id: 'zeeverse-puffer-ambrosia',
        name: 'Puffer Ambrosia',
        description: 'Legendary food item that grants multiple buffs when consumed.',
        imageUrl: 'https://placehold.co/300x300/FF00FF/000000?text=Puffer+Ambrosia',
        collection: 'Zeeverse Game Items',
        rarity: 'epic',
        creator: 'Zeeverse',
        tier: ReceiptTier.LUXURY,
        type: 'game',
        price: 10000
      },
      {
        id: 'zeeverse-copper-dagger',
        name: 'Copper Dagger',
        description: 'Basic weapon with +5 attack power, suitable for beginners.',
        imageUrl: 'https://placehold.co/300x300/B87333/000000?text=Copper+Dagger',
        collection: 'Zeeverse Game Items',
        rarity: 'common',
        creator: 'Zeeverse',
        tier: ReceiptTier.STANDARD,
        type: 'game',
        price: 100
      },
      {
        id: 'zeeverse-lumigloop',
        name: 'Lumigloop',
        description: 'Glowing creature that can be used as a light source in dark areas.',
        imageUrl: 'https://placehold.co/300x300/FFFF00/000000?text=Lumigloop',
        collection: 'Zeeverse Game Items',
        rarity: 'rare',
        creator: 'Zeeverse',
        tier: ReceiptTier.PREMIUM,
        type: 'game',
        price: 2000
      }
    ]
  },
  
  // Music NFTs
  {
    id: 'sonic-gems',
    name: 'Sonic Gems',
    description: 'Music collectibles that unlock exclusive songs, remixes, and artist content.',
    type: 'music',
    items: [
      {
        id: 'sonic-gems-vapor-wave',
        name: 'Vapor Wave',
        description: 'Exclusive vaporwave track by DJ Neon Sky with animated album art.',
        imageUrl: 'https://placehold.co/300x300/FF6AD5/000000?text=Vapor+Wave',
        collection: 'Sonic Gems',
        rarity: 'uncommon',
        creator: 'DJ Neon Sky',
        tier: ReceiptTier.STANDARD,
        type: 'music',
        price: 100
      },
      {
        id: 'sonic-gems-night-drive',
        name: 'Night Drive',
        description: 'Synthwave track that unlocks animated music visualizer background.',
        imageUrl: 'https://placehold.co/300x300/8A2BE2/000000?text=Night+Drive',
        collection: 'Sonic Gems',
        rarity: 'rare',
        creator: 'Midnight Rider',
        tier: ReceiptTier.PREMIUM,
        type: 'music',
        price: 2000
      },
      {
        id: 'sonic-gems-bass-drop',
        name: 'Bass Drop',
        description: 'Heavy bass track with studio stems for remix creation.',
        imageUrl: 'https://placehold.co/300x300/FF4500/000000?text=Bass+Drop',
        collection: 'Sonic Gems',
        rarity: 'uncommon',
        creator: 'BassMatrix',
        tier: ReceiptTier.STANDARD,
        type: 'music',
        price: 100
      },
      {
        id: 'sonic-gems-celestial',
        name: 'Celestial',
        description: 'Ambient space music with interactive star map visualizer.',
        imageUrl: 'https://placehold.co/300x300/191970/FFFFFF?text=Celestial',
        collection: 'Sonic Gems',
        rarity: 'epic',
        creator: 'Astral Harmonies',
        tier: ReceiptTier.LUXURY,
        type: 'music',
        price: 10000
      },
      {
        id: 'sonic-gems-digital-dreams',
        name: 'Digital Dreams',
        description: 'Electronic dance track with exclusive behind-the-scenes video.',
        imageUrl: 'https://placehold.co/300x300/00CED1/000000?text=Digital+Dreams',
        collection: 'Sonic Gems',
        rarity: 'rare',
        creator: 'Electron',
        tier: ReceiptTier.PREMIUM,
        type: 'music',
        price: 2000
      }
    ]
  },
  
  // Art NFTs
  {
    id: 'pixel-masterpieces',
    name: 'Pixel Masterpieces',
    description: 'Collection of pixel art pieces by renowned digital artists.',
    type: 'art',
    items: [
      {
        id: 'pixel-masterpieces-cyber-city',
        name: 'Cyber City',
        description: 'Detailed pixel art cityscape with animated elements.',
        imageUrl: 'https://placehold.co/300x300/4B0082/FFFFFF?text=Cyber+City',
        collection: 'Pixel Masterpieces',
        rarity: 'rare',
        creator: 'PixelPunk',
        tier: ReceiptTier.PREMIUM,
        type: 'art',
        price: 2000
      },
      {
        id: 'pixel-masterpieces-forest-sprite',
        name: 'Forest Sprite',
        description: 'Adorable pixel art forest creature with day/night cycle animation.',
        imageUrl: 'https://placehold.co/300x300/228B22/FFFFFF?text=Forest+Sprite',
        collection: 'Pixel Masterpieces',
        rarity: 'uncommon',
        creator: 'PixelNature',
        tier: ReceiptTier.STANDARD,
        type: 'art',
        price: 100
      },
      {
        id: 'pixel-masterpieces-mountain-vista',
        name: 'Mountain Vista',
        description: 'Breathtaking pixel art landscape with weather animation.',
        imageUrl: 'https://placehold.co/300x300/4682B4/FFFFFF?text=Mountain+Vista',
        collection: 'Pixel Masterpieces',
        rarity: 'rare',
        creator: 'BitLandscape',
        tier: ReceiptTier.PREMIUM,
        type: 'art',
        price: 2000
      },
      {
        id: 'pixel-masterpieces-space-explorer',
        name: 'Space Explorer',
        description: 'Astronaut character in a detailed pixel art space scene.',
        imageUrl: 'https://placehold.co/300x300/000000/FFFFFF?text=Space+Explorer',
        collection: 'Pixel Masterpieces',
        rarity: 'epic',
        creator: 'PixelVoid',
        tier: ReceiptTier.LUXURY,
        type: 'art',
        price: 10000
      }
    ]
  },
  
  // Collectible NFTs
  {
    id: 'crypto-creatures',
    name: 'Crypto Creatures',
    description: 'Adorable digital pets that evolve based on blockchain activity.',
    type: 'collectible',
    items: [
      {
        id: 'crypto-creatures-blocky',
        name: 'Blocky',
        description: 'Cuddly block-shaped creature that changes color with market trends.',
        imageUrl: 'https://placehold.co/300x300/FF8C00/000000?text=Blocky',
        collection: 'Crypto Creatures',
        rarity: 'common',
        creator: 'Digi Pets Inc.',
        tier: ReceiptTier.STANDARD,
        type: 'collectible',
        price: 100
      },
      {
        id: 'crypto-creatures-byte-buddy',
        name: 'Byte Buddy',
        description: 'Digital companion that grows as you complete transactions.',
        imageUrl: 'https://placehold.co/300x300/9ACD32/000000?text=Byte+Buddy',
        collection: 'Crypto Creatures',
        rarity: 'uncommon',
        creator: 'Digi Pets Inc.',
        tier: ReceiptTier.STANDARD,
        type: 'collectible',
        price: 100
      },
      {
        id: 'crypto-creatures-chain-chomp',
        name: 'Chain Chomp',
        description: 'Friendly creature that represents your transaction history.',
        imageUrl: 'https://placehold.co/300x300/FFD700/000000?text=Chain+Chomp',
        collection: 'Crypto Creatures',
        rarity: 'rare',
        creator: 'Digi Pets Inc.',
        tier: ReceiptTier.PREMIUM,
        type: 'collectible',
        price: 2000
      },
      {
        id: 'crypto-creatures-token-titan',
        name: 'Token Titan',
        description: 'Legendary creature that unlocks special features in partner applications.',
        imageUrl: 'https://placehold.co/300x300/C0C0C0/000000?text=Token+Titan',
        collection: 'Crypto Creatures',
        rarity: 'legendary',
        creator: 'Digi Pets Inc.',
        tier: ReceiptTier.ULTRA,
        type: 'collectible',
        price: 30000
      }
    ]
  },
  
  // Utility NFTs
  {
    id: 'digital-keys',
    name: 'Digital Keys',
    description: 'Utility NFTs that unlock special features and access across the web.',
    type: 'utility',
    items: [
      {
        id: 'digital-keys-basic-key',
        name: 'Basic Access Key',
        description: 'Provides basic tier access to partner platform content.',
        imageUrl: 'https://placehold.co/300x300/C0C0C0/000000?text=Basic+Key',
        collection: 'Digital Keys',
        rarity: 'common',
        creator: 'Access Protocol',
        tier: ReceiptTier.STANDARD,
        type: 'utility',
        price: 100
      },
      {
        id: 'digital-keys-premium-key',
        name: 'Premium Access Key',
        description: 'Unlocks premium content and features across multiple platforms.',
        imageUrl: 'https://placehold.co/300x300/FFD700/000000?text=Premium+Key',
        collection: 'Digital Keys',
        rarity: 'rare',
        creator: 'Access Protocol',
        tier: ReceiptTier.PREMIUM,
        type: 'utility',
        price: 2000
      },
      {
        id: 'digital-keys-master-key',
        name: 'Master Access Key',
        description: 'Provides VIP access to exclusive content and members-only events.',
        imageUrl: 'https://placehold.co/300x300/FF4500/000000?text=Master+Key',
        collection: 'Digital Keys',
        rarity: 'epic',
        creator: 'Access Protocol',
        tier: ReceiptTier.LUXURY,
        type: 'utility',
        price: 10000
      },
      {
        id: 'digital-keys-founder-key',
        name: 'Founder\'s Access Key',
        description: 'Lifetime access to all platform features including early beta releases.',
        imageUrl: 'https://placehold.co/300x300/8A2BE2/FFFFFF?text=Founder+Key',
        collection: 'Digital Keys',
        rarity: 'legendary',
        creator: 'Access Protocol',
        tier: ReceiptTier.ULTRA,
        type: 'utility',
        price: 30000
      }
    ]
  }
];

/**
 * Get all NFT art items for a specific tier
 * 
 * @param tier Receipt tier
 * @returns Array of NFT art items for the specified tier
 */
export function getNFTArtItemsByTier(tier: ReceiptTier): NFTArtItem[] {
  return NFT_ART_COLLECTIONS.flatMap(collection => 
    collection.items.filter(item => item.tier === tier)
  );
}

/**
 * Get NFT art items by collection and tier
 * 
 * @param collectionId Collection ID
 * @param tier Receipt tier
 * @returns Array of NFT art items for the specified collection and tier
 */
export function getNFTArtItemsByCollectionAndTier(collectionId: string, tier: ReceiptTier): NFTArtItem[] {
  const collection = NFT_ART_COLLECTIONS.find(c => c.id === collectionId);
  if (!collection) return [];
  return collection.items.filter(item => item.tier === tier);
}

/**
 * Get an NFT art item by ID
 * 
 * @param itemId NFT art item ID
 * @returns NFT art item or undefined if not found
 */
export function getNFTArtItemById(itemId: string): NFTArtItem | undefined {
  for (const collection of NFT_ART_COLLECTIONS) {
    const item = collection.items.find(item => item.id === itemId);
    if (item) return item;
  }
  return undefined;
}

export default {
  NFT_ART_COLLECTIONS,
  getNFTArtItemsByTier,
  getNFTArtItemsByCollectionAndTier,
  getNFTArtItemById
};
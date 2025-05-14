/**
 * NFT Art Manifest
 * 
 * This file defines the NFT art options for each receipt tier.
 * Each tier has multiple art options that users can choose from when minting a receipt NFT.
 */

export type NftArtTier = 'standard' | 'premium' | 'luxury' | 'ultra';

export interface NftArtOption {
  id: string;
  name: string;
  description: string;
  artist?: string;
  imageUrl: string;
  thumbnailUrl: string;
  tier: NftArtTier;
  traits?: Record<string, string | number>;
  rarity?: number; // Scale of 1-100, higher is more rare
}

// Determination function for which tier a receipt qualifies for
export function determineReceiptTier(totalAmount: number): NftArtTier {
  if (totalAmount >= 50000) { // $500+ 
    return 'ultra';
  } else if (totalAmount >= 10000) { // $100-499
    return 'luxury';
  } else if (totalAmount >= 5000) { // $50-99
    return 'premium';
  } else {
    return 'standard'; // <$50
  }
}

// Get available art options for a receipt based on its tier
export function getAvailableArtOptions(tier: NftArtTier): NftArtOption[] {
  // Filter the manifest to only include options for the current tier and below
  const tierPriority: Record<NftArtTier, number> = {
    standard: 0,
    premium: 1, 
    luxury: 2,
    ultra: 3
  };
  
  const tierLevel = tierPriority[tier];
  
  return NFT_ART_MANIFEST.filter(option => {
    const optionTierLevel = tierPriority[option.tier];
    return optionTierLevel <= tierLevel;
  });
}

// NFT Art Manifest - Collection of all available NFT art options
export const NFT_ART_MANIFEST: NftArtOption[] = [
  // Standard Tier Options (Available to all)
  {
    id: 'standard-receipt-1',
    name: 'Digital Receipt',
    description: 'A standard digital receipt with blockchain verification',
    imageUrl: '/nft-art/standard-receipt-1.svg',
    thumbnailUrl: '/nft-art/thumbnails/standard-receipt-1.svg',
    tier: 'standard',
    traits: {
      style: 'minimal',
      background: 'white',
      border: 'simple'
    },
    rarity: 100 // Common
  },
  {
    id: 'standard-receipt-2',
    name: 'Eco Receipt',
    description: 'A tree-themed receipt celebrating paperless transactions',
    imageUrl: '/nft-art/standard-receipt-2.svg',
    thumbnailUrl: '/nft-art/thumbnails/standard-receipt-2.svg',
    tier: 'standard',
    traits: {
      style: 'eco',
      background: 'green',
      border: 'leaf'
    },
    rarity: 90 // Common
  },
  {
    id: 'standard-receipt-3',
    name: 'Retro Receipt',
    description: 'A nostalgic receipt design reminiscent of vintage paper receipts',
    imageUrl: '/nft-art/standard-receipt-3.svg',
    thumbnailUrl: '/nft-art/thumbnails/standard-receipt-3.svg',
    tier: 'standard',
    traits: {
      style: 'retro',
      background: 'beige',
      border: 'dotted'
    },
    rarity: 80 // Common
  },
  
  // Premium Tier Options
  {
    id: 'premium-receipt-1',
    name: 'Silver Receipt',
    description: 'A sleek silver-themed receipt with enhanced visual effects',
    imageUrl: '/nft-art/premium-receipt-1.svg',
    thumbnailUrl: '/nft-art/thumbnails/premium-receipt-1.svg',
    tier: 'premium',
    traits: {
      style: 'modern',
      background: 'silver',
      border: 'metallic',
      effect: 'shine'
    },
    rarity: 70 // Uncommon
  },
  {
    id: 'premium-receipt-2',
    name: 'Enhanced Receipt',
    description: 'A receipt with premium styling and subtle animations',
    imageUrl: '/nft-art/premium-receipt-2.svg',
    thumbnailUrl: '/nft-art/thumbnails/premium-receipt-2.svg',
    tier: 'premium',
    traits: {
      style: 'enhanced',
      background: 'gradient',
      border: 'animated',
      effect: 'glow'
    },
    rarity: 60 // Uncommon
  },
  
  // Luxury Tier Options
  {
    id: 'luxury-receipt-1',
    name: 'Gold Receipt',
    description: 'A luxurious gold-themed receipt with premium detailing',
    artist: 'BlockReceipt Design Team',
    imageUrl: '/nft-art/luxury-receipt-1.svg',
    thumbnailUrl: '/nft-art/thumbnails/luxury-receipt-1.svg',
    tier: 'luxury',
    traits: {
      style: 'luxury',
      background: 'gold',
      border: 'ornate',
      effect: 'shimmer'
    },
    rarity: 40 // Rare
  },
  {
    id: 'luxury-receipt-2',
    name: 'Platinum Receipt',
    description: 'An exclusive platinum-themed receipt with animated elements',
    artist: 'BlockReceipt Design Team',
    imageUrl: '/nft-art/luxury-receipt-2.svg',
    thumbnailUrl: '/nft-art/thumbnails/luxury-receipt-2.svg',
    tier: 'luxury',
    traits: {
      style: 'premium',
      background: 'platinum',
      border: 'diamond',
      effect: 'sparkle'
    },
    rarity: 30 // Rare
  },
  {
    id: 'luxury-receipt-3',
    name: 'Art Deco Receipt',
    description: 'A sophisticated receipt inspired by Art Deco aesthetics',
    artist: 'BlockReceipt Design Team',
    imageUrl: '/nft-art/luxury-receipt-3.svg',
    thumbnailUrl: '/nft-art/thumbnails/luxury-receipt-3.svg',
    tier: 'luxury',
    traits: {
      style: 'artDeco',
      background: 'geometric',
      border: 'chevron',
      effect: 'layered'
    },
    rarity: 25 // Rare
  },
  
  // Ultra Tier Options (Highest tier)
  {
    id: 'ultra-receipt-1',
    name: 'Diamond Receipt',
    description: 'The pinnacle of digital receipts with premium animated effects',
    artist: 'BlockReceipt Premium Studio',
    imageUrl: '/nft-art/ultra-receipt-1.svg',
    thumbnailUrl: '/nft-art/thumbnails/ultra-receipt-1.svg',
    tier: 'ultra',
    traits: {
      style: 'ultra',
      background: 'diamond',
      border: 'premium',
      effect: '3d',
      animation: 'advanced'
    },
    rarity: 10 // Very Rare
  },
  {
    id: 'ultra-receipt-2',
    name: 'Cosmic Receipt',
    description: 'A universe-inspired receipt with animated cosmic elements',
    artist: 'BlockReceipt Premium Studio',
    imageUrl: '/nft-art/ultra-receipt-2.svg',
    thumbnailUrl: '/nft-art/thumbnails/ultra-receipt-2.svg',
    tier: 'ultra',
    traits: {
      style: 'cosmic',
      background: 'space',
      border: 'galaxy',
      effect: 'nebula',
      animation: 'particle'
    },
    rarity: 5 // Very Rare
  },
  {
    id: 'ultra-receipt-collector',
    name: 'Collector Edition Receipt',
    description: 'A limited edition collector-inspired receipt with holographic effects',
    artist: 'BlockReceipt Premium Studio',
    imageUrl: '/nft-art/ultra-receipt-collector.svg',
    thumbnailUrl: '/nft-art/thumbnails/ultra-receipt-collector.svg',
    tier: 'ultra',
    traits: {
      style: 'collector',
      background: 'holographic',
      border: 'foil',
      effect: 'prismatic',
      animation: 'evolving'
    },
    rarity: 1 // Extremely Rare
  }
];
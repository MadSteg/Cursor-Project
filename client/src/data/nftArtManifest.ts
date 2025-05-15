/**
 * NFT Art Manifest
 * 
 * This file defines the structure and collections of NFT art for receipt tokens.
 */

import { ReceiptTier, NFTArtItem } from "@/types";

export const collections = [
  {
    id: 'block-receipt',
    name: 'BlockReceipt',
    description: 'Official BlockReceipt NFT Collection',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
  },
  {
    id: 'luxury-brands',
    name: 'Luxury Brands',
    description: 'Exclusive NFTs from premium retailers',
    primaryColor: '#F59E0B',
    secondaryColor: '#D97706',
  }
];

// Default artwork for receipt tiers
export const defaultArtwork: Record<string, NFTArtItem> = {
  'STANDARD': {
    id: 'standard-default',
    name: 'Standard Receipt',
    description: 'Basic BlockReceipt NFT',
    imageUrl: '/assets/nft-standard.png',
    collection: 'BlockReceipt',
    tier: 'STANDARD',
    rarity: 'common',
    type: 'utility',
    price: 0,
  },
  'PREMIUM': {
    id: 'premium-default',
    name: 'Premium Receipt',
    description: 'Premium BlockReceipt NFT',
    imageUrl: '/assets/nft-premium.png',
    collection: 'BlockReceipt',
    tier: 'PREMIUM',
    rarity: 'uncommon',
    type: 'utility',
    price: 0,
  },
  'LUXURY': {
    id: 'luxury-default',
    name: 'Luxury Receipt',
    description: 'Luxury BlockReceipt NFT',
    imageUrl: '/assets/nft-luxury.png',
    collection: 'BlockReceipt',
    tier: 'LUXURY',
    rarity: 'rare',
    type: 'utility',
    price: 0,
  },
  'ULTRA': {
    id: 'ultra-default',
    name: 'Ultra Receipt',
    description: 'Ultra BlockReceipt NFT',
    imageUrl: '/assets/nft-ultra.png',
    collection: 'BlockReceipt',
    tier: 'ULTRA',
    rarity: 'legendary',
    type: 'utility',
    price: 0,
  }
};
/**
 * Shared Type Definitions
 * 
 * This file contains common type definitions used across the application.
 */

// Receipt tier definitions
export type ReceiptTier = 'STANDARD' | 'PREMIUM' | 'LUXURY' | 'ULTRA';

// Enum for use in switch statements
export enum ReceiptTierEnum {
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  LUXURY = 'LUXURY',
  ULTRA = 'ULTRA'
}

// Create a namespace for the ReceiptTier type to enable dot notation in switch statements
export const ReceiptTier = {
  STANDARD: 'STANDARD' as const,
  PREMIUM: 'PREMIUM' as const, 
  LUXURY: 'LUXURY' as const,
  ULTRA: 'ULTRA' as const
};

// Receipt item definition
export interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
  category?: string;
}

// Receipt data definition
export interface ReceiptData {
  id?: string | number;
  merchantName: string;
  date: string;
  items: ReceiptItem[];
  subtotal?: number;
  tax?: number;
  total: number;
  category?: string;
  nftGift?: {
    status: string;
    message: string;
    eligible: boolean;
    taskId?: string;
  };
}

// NFT Art Item definition
export interface NFTArtItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  collection: string;
  tier: ReceiptTier;
  rarity: string;
  type: 'game' | 'utility' | 'music' | 'art' | 'collectible' | 'sports';
  price: number;
}
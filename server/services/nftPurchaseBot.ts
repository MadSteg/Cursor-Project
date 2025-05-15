/**
 * NFT Purchase Bot Service
 * 
 * Handles automated NFT purchases from marketplaces when users upload receipts,
 * as well as fallback minting from our own collection when marketplace purchases fail.
 * 
 * Updated to support external NFT procurement from emerging artists via marketplace APIs.
 */

import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import { marketplaceService, MarketplaceNFT } from './marketplaceService';

// Wallet tracker to prevent abuse (in-memory, replace with DB in production)
interface ClaimRecord {
  lastClaimTime: number;
  claimsInLast24h: number;
}

// Store claimed NFTs (in-memory - would use DB in production)
const claimedNFTs: Map<string, ClaimRecord> = new Map();

// Demo NFT collection for fallback minting
const mockNFTCollection = [
  {
    id: 'nft-001',
    name: 'Receipt Warrior',
    description: 'A heroic receipt ready to battle expense reports',
    image: '/nft-images/receipt-warrior.svg',
    price: 0.001,
    available: true
  },
  {
    id: 'nft-002',
    name: 'Crypto Receipt',
    description: 'A receipt for your crypto transactions',
    image: '/nft-images/crypto-receipt.svg',
    price: 0.002,
    available: true
  },
  {
    id: 'nft-003',
    name: 'Fashion Receipt',
    description: 'A stylish receipt for fashion purchases',
    image: '/nft-images/fashion-receipt.svg',
    price: 0.003,
    available: true
  },
  {
    id: 'nft-004',
    name: 'Electronics Receipt',
    description: 'A high-tech receipt for gadget purchases',
    image: '/nft-images/electronics-receipt.svg',
    price: 0.002,
    available: true
  },
  {
    id: 'nft-005',
    name: 'Food Receipt',
    description: 'A delicious receipt for food purchases',
    image: '/nft-images/food-receipt.svg',
    price: 0.001,
    available: true
  }
];

// Smart contract details
const contractAddress = process.env.RECEIPT_NFT_CONTRACT_ADDRESS || '0x1111111111111111111111111111111111111111';

// Result types
export interface NFTPurchaseResult {
  success: boolean;
  tokenId?: string;
  contractAddress?: string;
  name?: string;
  imageUrl?: string;
  marketplace?: string;
  price?: number;
  txHash?: string;
  error?: string;
  creator?: string;
  creatorName?: string;
  tier?: string;
}

// Initialize and log basic configs
console.log('NFT Bot using random wallet for testing only. No actual purchases will work!');

/**
 * Generate a random token ID for test NFTs
 */
function generateTokenId(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

/**
 * Check if a user is eligible to claim an NFT (limit 1 per 24h period)
 */
export async function isUserEligible(walletAddress: string): Promise<boolean> {
  const record = claimedNFTs.get(walletAddress);
  
  // Initialize claim records when first seen
  if (!claimedNFTs.has(walletAddress)) {
    console.log(`New wallet ${walletAddress} detected - eligible for NFT gift`);
    return true;
  }
  
  if (!record) return true;
  
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  
  if (now - record.lastClaimTime > oneDay) {
    // Reset if last claim was more than 24h ago
    console.log(`Wallet ${walletAddress} last claim was > 24h ago - eligible for NFT gift`);
    return true;
  }
  
  if (record.claimsInLast24h < 1) {
    // Allow if under daily limit
    console.log(`Wallet ${walletAddress} has not claimed in last 24h - eligible for NFT gift`);
    return true;
  }
  
  console.log(`Wallet ${walletAddress} already claimed in last 24h - not eligible for NFT gift`);
  return false;
}

/**
 * Record successful NFT claim for a wallet
 */
function recordNFTClaim(walletAddress: string): void {
  const now = Date.now();
  const record = claimedNFTs.get(walletAddress);
  
  if (record) {
    claimedNFTs.set(walletAddress, {
      lastClaimTime: now,
      claimsInLast24h: record.claimsInLast24h + 1
    });
  } else {
    claimedNFTs.set(walletAddress, {
      lastClaimTime: now,
      claimsInLast24h: 1
    });
  }
  
  console.log(`Recorded NFT claim for wallet ${walletAddress}`);
}

// Initialize claim records
console.log('Initialized NFT claim records');

/**
 * Find a relevant NFT based on category
 */
function findRelevantNFT(category: string = ''): any {
  const categoryMap: Record<string, string> = {
    'electronics': 'nft-004',
    'tech': 'nft-004',
    'fashion': 'nft-003',
    'clothing': 'nft-003',
    'food': 'nft-005',
    'restaurant': 'nft-005',
    'crypto': 'nft-002',
    'finance': 'nft-002'
  };
  
  // Look for matches in our collection based on category
  const lowerCategory = category.toLowerCase();
  const nftId = Object.keys(categoryMap).find(key => lowerCategory.includes(key));
  
  if (nftId) {
    return mockNFTCollection.find(nft => nft.id === categoryMap[nftId]) || mockNFTCollection[0];
  }
  
  // Default to NFT-001 (Receipt Warrior)
  return mockNFTCollection.find(nft => nft.id === 'nft-001') || mockNFTCollection[0];
}

/**
 * Purchase an NFT from a marketplace and transfer to user
 * Updated to purchase from external marketplaces
 */
export async function purchaseAndTransferNFT(
  walletAddress: string,
  receiptId: string,
  receiptData: any
): Promise<NFTPurchaseResult> {
  try {
    console.log(`Attempting to purchase NFT for wallet ${walletAddress} based on receipt ${receiptId}`);
    
    // Determine receipt category and budget based on total
    const receiptTotal = receiptData.total || 0;
    const category = marketplaceService.categorizeReceipt(receiptData);
    const { tier, budget } = marketplaceService.determineNFTBudget(receiptTotal);
    
    console.log(`Determined category: ${category}, tier: ${tier}, budget: $${budget}`);
    
    // Fetch NFTs from marketplace based on budget and category
    const nftOptions = await marketplaceService.fetchMarketplaceNFTs({
      maxPrice: budget,
      category,
      includeUnverified: true,
      sort: 'recent',
      filters: ['lowVolume', 'indieArtist'],
      limit: 10
    });
    
    // If no NFTs found, throw error to trigger fallback
    if (!nftOptions.length) {
      throw new Error("No affordable NFTs found under budget");
    }
    
    // Select a random NFT from the options
    const selectedNFT = nftOptions[Math.floor(Math.random() * nftOptions.length)];
    console.log(`Selected NFT: ${selectedNFT.name} by ${selectedNFT.creatorName || 'unknown'}`);
    
    // Purchase the NFT and transfer to recipient
    const purchaseResult = await marketplaceService.purchaseMarketplaceNFT(selectedNFT, walletAddress);
    
    if (!purchaseResult.success) {
      throw new Error(purchaseResult.error || "Failed to purchase NFT");
    }
    
    // Record the NFT claim
    recordNFTClaim(walletAddress);
    
    // Return success response with NFT details
    return {
      success: true,
      tokenId: purchaseResult.tokenId || selectedNFT.tokenId,
      contractAddress: purchaseResult.contractAddress || selectedNFT.contractAddress,
      name: purchaseResult.name || selectedNFT.name,
      imageUrl: purchaseResult.imageUrl || selectedNFT.imageUrl,
      marketplace: purchaseResult.marketplace || selectedNFT.marketplace,
      price: purchaseResult.price || selectedNFT.price,
      txHash: purchaseResult.txHash || `0x${Math.random().toString(16).substring(2, 42)}`,
      creator: selectedNFT.creator,
      creatorName: selectedNFT.creatorName,
      tier
    };
  } catch (error: any) {
    console.error(`Error purchasing NFT for ${walletAddress}:`, error);
    
    return {
      success: false,
      error: error.message || 'Failed to purchase NFT'
    };
  }
}

/**
 * Mint a fallback NFT from our own collection
 */
export async function mintFallbackNFT(
  walletAddress: string,
  name: string,
  description: string
): Promise<NFTPurchaseResult> {
  try {
    console.log(`Minting fallback NFT for wallet ${walletAddress}`);
    
    // Use basic tier for fallback NFTs
    const tier = 'basic';
    
    // Use a default NFT from our collection for fallback
    const selectedNFT = mockNFTCollection[0];
    
    // Generate a random token ID for simulation
    const tokenId = generateTokenId();
    
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Record the NFT claim
    recordNFTClaim(walletAddress);
    
    // Return success response with NFT details
    return {
      success: true,
      tokenId,
      contractAddress,
      name: `${name || selectedNFT.name} (Custom)`,
      imageUrl: selectedNFT.image,
      marketplace: 'BlockReceipt',
      price: 0,
      txHash: `0x${Math.random().toString(16).substring(2, 42)}`,
      creator: 'BlockReceipt',
      creatorName: 'BlockReceipt Artist',
      tier
    };
  } catch (error: any) {
    console.error(`Error minting fallback NFT for ${walletAddress}:`, error);
    
    return {
      success: false,
      error: error.message || 'Failed to mint fallback NFT'
    };
  }
}

/**
 * Get NFT status for a user
 */
export function getNFTClaimStatus(walletAddress: string): ClaimRecord | null {
  return claimedNFTs.get(walletAddress) || null;
}

// Export the public API
export const nftPurchaseBot = {
  isUserEligible,
  purchaseAndTransferNFT,
  mintFallbackNFT,
  getNFTClaimStatus
};
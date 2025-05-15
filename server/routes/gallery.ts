import express, { Request, Response } from 'express';
import { db } from '../db';
import { ethers } from 'ethers';

const router = express.Router();

/**
 * Gallery API route: Returns a user's NFT collection with metadata lock status
 * @path GET /api/gallery/:walletAddress
 * @param walletAddress - The wallet address to retrieve NFTs for
 * @returns Array of NFT objects with metadata and lock status
 */
router.get('/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    
    // Validate wallet address format
    if (!walletAddress || !ethers.utils.isAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wallet address format'
      });
    }
    
    console.log(`Retrieving NFT gallery for wallet: ${walletAddress}`);
    
    // Query database for NFTs owned by this wallet
    // In a real implementation, this would query our database or the blockchain
    // For now, we'll use a mock implementation
    
    // TODO: Replace with actual database query once DB schema is updated
    // const userNfts = await db.query(`
    //   SELECT * FROM nfts 
    //   WHERE owner_address = $1
    //   ORDER BY created_at DESC
    // `, [walletAddress]);
    
    // Mock data implementation - replace with DB query in production
    const mockNfts = getMockNftsForWallet(walletAddress);
    
    if (!mockNfts || mockNfts.length === 0) {
      return res.status(200).json({
        success: true,
        nfts: [],
        message: 'No NFTs found for this wallet address'
      });
    }
    
    return res.status(200).json({
      success: true,
      nfts: mockNfts,
      walletAddress
    });
    
  } catch (error: any) {
    console.error('Error retrieving NFT gallery:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve NFT gallery',
      error: error.message || 'Unknown error'
    });
  }
});

/**
 * Mock function to generate sample NFTs for a wallet
 * This would be replaced with actual database queries in production
 */
function getMockNftsForWallet(walletAddress: string) {
  // Generate deterministic NFTs based on wallet address
  // This ensures the same wallet always sees the same NFTs
  const walletSeed = parseInt(walletAddress.slice(-4), 16) || 0;
  const nftCount = (walletSeed % 5) + 1; // 1-5 NFTs
  
  const nfts = [];
  
  // Receipt categories for variety
  const categories = ['food', 'electronics', 'clothing', 'groceries', 'entertainment'];
  
  // Create mock NFTs
  for (let i = 0; i < nftCount; i++) {
    const tokenId = `${walletSeed}${i}`;
    const isLocked = i % 2 === 0; // Alternate locked/unlocked status
    const category = categories[i % categories.length];
    
    nfts.push({
      id: i + 1,
      tokenId,
      contractAddress: process.env.RECEIPT_NFT_CONTRACT_ADDRESS || '0x1234...',
      name: `BlockReceipt #${tokenId}`,
      description: `${category.charAt(0).toUpperCase() + category.slice(1)} purchase receipt NFT`,
      image: `/nft-images/${category}-receipt.svg`,
      category,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(), // Sequential dates
      owner: walletAddress,
      metadataLocked: isLocked,
      lockStatus: isLocked ? 'locked' : 'unlocked',
      encryptionDetails: isLocked ? {
        hasCapsule: true,
        policyId: `policy-${tokenId}`,
        capsuleId: `capsule-${tokenId}`
      } : null,
      total: (20 + (i * 15.99)).toFixed(2),
      items: isLocked ? [] : [
        {
          name: `${category} item ${i+1}`,
          price: (15.99 + i).toFixed(2),
          quantity: 1,
          category
        }
      ]
    });
  }
  
  return nfts;
}

/**
 * Unlock metadata for a specific NFT by providing decryption policy
 * @path POST /api/gallery/unlock/:tokenId
 */
router.post('/unlock/:tokenId', async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;
    const { walletAddress } = req.body;
    
    if (!walletAddress || !ethers.utils.isAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wallet address format'
      });
    }
    
    // In a real implementation, this would:
    // 1. Verify the wallet owns this token
    // 2. Use TACo to decrypt the metadata
    // 3. Return the decrypted data
    
    // Mock implementation for now
    console.log(`Unlocking metadata for token ID ${tokenId} for wallet ${walletAddress}`);
    
    // Simulate successful unlock
    return res.status(200).json({
      success: true,
      tokenId,
      unlocked: true,
      metadata: {
        items: [
          { name: 'Unlocked item 1', price: '19.99', quantity: 1, category: 'electronics' },
          { name: 'Unlocked item 2', price: '9.99', quantity: 2, category: 'accessories' }
        ],
        total: '39.97',
        merchantName: 'Decrypted Store',
        date: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error(`Error unlocking metadata for token:`, error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unlock NFT metadata',
      error: error.message || 'Unknown error'
    });
  }
});

export default router;
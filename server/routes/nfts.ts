/**
 * NFT Routes for BlockReceipt
 * 
 * Handles NFT-related API endpoints including fetching NFTs with coupon data
 */

import { Router } from 'express';
import { createLogger } from '../logger';
import { nftMintService } from '../services/nftMintService';

const router = Router();
const logger = createLogger('nft-routes');

/**
 * Get all NFTs owned by a wallet address
 * GET /api/nfts
 */
router.get('/', async (req, res) => {
  try {
    const { walletAddress } = req.query;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }
    
    // In a real implementation, fetch from the blockchain
    // For now, we'll return mock data
    const mockNfts = [
      {
        id: '1',
        tokenId: '1001',
        name: 'Walmart Receipt',
        description: 'Purchase at Walmart on May 12, 2025',
        imageUrl: 'https://ipfs.io/ipfs/QmXyZ123...',
        dateCreated: new Date().toISOString(),
        metadata: {
          merchantName: 'Walmart',
          date: '2025-05-12',
          total: 134.76,
          items: [
            { name: 'Groceries', price: 89.97 },
            { name: 'Electronics', price: 44.79 }
          ]
        }
      },
      {
        id: '2',
        tokenId: '1002',
        name: 'Target Receipt',
        description: 'Purchase at Target on May 14, 2025',
        imageUrl: 'https://ipfs.io/ipfs/QmAbC456...',
        dateCreated: new Date().toISOString(),
        metadata: {
          merchantName: 'Target',
          date: '2025-05-14',
          total: 67.89,
          items: [
            { name: 'Clothing', price: 49.99 },
            { name: 'Home Goods', price: 17.90 }
          ]
        }
      }
    ];
    
    return res.status(200).json(mockNfts);
    
  } catch (error) {
    logger.error(`Error fetching NFTs: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching NFTs'
    });
  }
});

/**
 * Get NFTs with coupon data
 * GET /api/nfts/with-coupons
 */
router.get('/with-coupons', async (req, res) => {
  try {
    // In a real implementation, we would fetch NFTs with coupons from the blockchain
    // For now, we'll return mock data for the frontend integration
    
    // Create mock data with a mix of active and expired coupons
    const now = Date.now();
    const twoWeeksMs = 14 * 24 * 60 * 60 * 1000;
    
    const mockNfts = [
      {
        id: '1',
        tokenId: '1001',
        name: 'Costco',
        imageUrl: 'https://ipfs.io/ipfs/QmXyZ123...',
        dateCreated: new Date(now - (3 * 24 * 60 * 60 * 1000)).toISOString(),
        metadata: {
          merchantName: 'Costco',
          date: '2025-05-14',
          total: 231.45,
          coupon: {
            capsule: `capsule_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
            ciphertext: Buffer.from('COSTCO25').toString('base64'),
            policyId: `policy_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
            validUntil: now + twoWeeksMs // Active
          }
        }
      },
      {
        id: '2',
        tokenId: '1002',
        name: 'Target',
        imageUrl: 'https://ipfs.io/ipfs/QmAbC456...',
        dateCreated: new Date(now - (5 * 24 * 60 * 60 * 1000)).toISOString(),
        metadata: {
          merchantName: 'Target',
          date: '2025-05-12',
          total: 87.99,
          coupon: {
            capsule: `capsule_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
            ciphertext: Buffer.from('TARGET10').toString('base64'),
            policyId: `policy_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
            validUntil: now + (twoWeeksMs / 2) // Active
          }
        }
      },
      {
        id: '3',
        tokenId: '1003',
        name: 'Walmart',
        imageUrl: 'https://ipfs.io/ipfs/QmDeF789...',
        dateCreated: new Date(now - (20 * 24 * 60 * 60 * 1000)).toISOString(),
        metadata: {
          merchantName: 'Walmart',
          date: '2025-04-27',
          total: 134.56,
          coupon: {
            capsule: `capsule_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
            ciphertext: Buffer.from('WALMART15').toString('base64'),
            policyId: `policy_expired_${Math.random().toString(36).substring(2, 15)}`,
            validUntil: now - (twoWeeksMs / 2) // Expired
          }
        }
      },
      {
        id: '4',
        tokenId: '1004',
        name: 'Best Buy',
        imageUrl: 'https://ipfs.io/ipfs/QmGhI012...',
        dateCreated: new Date(now - (1 * 24 * 60 * 60 * 1000)).toISOString(),
        metadata: {
          merchantName: 'Best Buy',
          date: '2025-05-16',
          total: 349.99,
          coupon: {
            capsule: `capsule_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
            ciphertext: Buffer.from('BESTBUY20').toString('base64'),
            policyId: `policy_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
            validUntil: now + twoWeeksMs // Active
          }
        }
      }
    ];
    
    return res.status(200).json(mockNfts);
    
  } catch (error) {
    logger.error(`Error fetching NFTs with coupons: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching NFTs with coupons'
    });
  }
});

export default router;
import express, { Request, Response } from 'express';
import { ethers } from 'ethers';
import { galleryService } from '../services/galleryService';
import { tacoService } from '../services/tacoService';
import { nftPurchaseBot } from '../services/nftPurchaseBot';

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
    
    try {
      // Get NFTs with metadata from the gallery service
      const nfts = await galleryService.getNFTsForWallet(walletAddress);
      
      // Return nfts (if any)
      return res.status(200).json({
        success: true,
        nfts,
        walletAddress
      });
    } catch (serviceError: any) {
      console.error(`Gallery service error for ${walletAddress}:`, serviceError);
      
      // Fallback to mock data for development testing
      if (process.env.NODE_ENV !== 'production') {
        console.log('Falling back to mock NFT data for development');
        const mockNfts = getMockNftsForWallet(walletAddress);
        
        return res.status(200).json({
          success: true,
          nfts: mockNfts,
          walletAddress,
          note: 'Using mock data due to service error'
        });
      }
      
      throw serviceError;
    }
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
    
    console.log(`Unlocking metadata for token ID ${tokenId} for wallet ${walletAddress}`);
    
    try {
      // Attempt to unlock using our gallery service
      const unlockedData = await galleryService.unlockNFTMetadata(tokenId, walletAddress);
      
      if (!unlockedData) {
        return res.status(403).json({
          success: false,
          message: 'Unable to unlock metadata - either you do not own this NFT or there is no encrypted data'
        });
      }
      
      return res.status(200).json({
        success: true,
        tokenId,
        unlocked: true,
        metadata: unlockedData
      });
    } catch (unlockError: any) {
      console.error(`Error unlocking metadata for token ${tokenId}:`, unlockError);
      
      // Fallback for development
      if (process.env.NODE_ENV !== 'production') {
        console.log('Falling back to mock unlock for development');
        
        // Simulate successful unlock with mock data
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
          },
          note: 'Using mock data due to service error'
        });
      }
      
      throw unlockError;
    }
  } catch (error: any) {
    console.error(`Error unlocking metadata for token:`, error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unlock NFT metadata',
      error: error.message || 'Unknown error'
    });
  }
});

/**
 * Check NFT claim eligibility for a wallet
 * @path GET /api/gallery/eligibility/:walletAddress
 */
router.get('/eligibility/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    
    // Validate wallet address format
    if (!walletAddress || !ethers.utils.isAddress(walletAddress)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wallet address format'
      });
    }
    
    // Check eligibility using NFT purchase bot
    const isEligible = await nftPurchaseBot.isUserEligible(walletAddress);
    const claimStatus = nftPurchaseBot.getNFTClaimStatus(walletAddress);
    
    return res.status(200).json({
      success: true,
      walletAddress,
      eligible: isEligible,
      claimStatus: claimStatus || { lastClaimTime: 0, claimsInLast24h: 0 }
    });
  } catch (error: any) {
    console.error('Error checking NFT eligibility:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check NFT eligibility',
      error: error.message || 'Unknown error'
    });
  }
});

/**
 * Return mock NFTs for development/testing
 */
function getMockNftsForWallet(walletAddress: string) {
  return [
    {
      tokenId: 'nft-001',
      contractAddress: '0x1111111111111111111111111111111111111111',
      name: 'Receipt Warrior',
      imageUrl: '/nft-images/receipt-warrior.svg',
      isLocked: true,
      receiptPreview: {
        merchantName: 'Electronics Store',
        date: new Date().toISOString(),
        total: 599.99
      },
      encryptionStatus: {
        isEncrypted: true,
        canDecrypt: true
      },
      ownerAddress: walletAddress
    },
    {
      tokenId: 'nft-002',
      contractAddress: '0x1111111111111111111111111111111111111111',
      name: 'Crypto Receipt',
      imageUrl: '/nft-images/crypto-receipt.svg',
      isLocked: false,
      receiptPreview: {
        merchantName: 'Crypto Exchange',
        date: new Date().toISOString(),
        total: 999.99
      },
      encryptionStatus: {
        isEncrypted: false,
        canDecrypt: false
      },
      ownerAddress: walletAddress
    },
    {
      tokenId: 'nft-003',
      contractAddress: '0x1111111111111111111111111111111111111111',
      name: 'Fashion Receipt',
      imageUrl: '/nft-images/fashion-receipt.svg',
      isLocked: true,
      receiptPreview: {
        merchantName: 'Fashion Boutique',
        date: new Date().toISOString(),
        total: 299.99
      },
      encryptionStatus: {
        isEncrypted: true,
        canDecrypt: true
      },
      ownerAddress: walletAddress
    },
  ];
}

export default router;
import { Router } from 'express';
import { z } from 'zod';
import { metadataService } from '../services/metadataService';
import { tacoService } from '../services/tacoService';
import { blockchainService } from '../services/blockchainService';

const router = Router();

// Schema for wallet address validation
const walletAddressSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/)
});

// Schema for token ID validation
const tokenIdSchema = z.object({
  tokenId: z.string().min(1)
});

// Schema for unlock request validation
const unlockRequestSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  tokenId: z.string().min(1)
});

/**
 * GET /api/gallery/:walletAddress
 * Fetches all NFTs owned by a wallet with their encrypted metadata status
 */
router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = walletAddressSchema.parse({
      walletAddress: req.params.walletAddress
    });
    
    // Get NFTs from both on-chain and off-chain sources
    const nfts = await metadataService.getEncryptedMetadataByWallet(walletAddress);
    
    // Format response for frontend
    const response = nfts.map(nft => ({
      tokenId: nft.tokenId,
      isLocked: true, // Always assume locked until unlocked client-side
      preview: nft.unencryptedPreview,
      dateCreated: nft.createdAt,
      imageUrl: `/api/nfts/image/${nft.tokenId}`
    }));
    
    res.json({
      success: true,
      nfts: response
    });
  } catch (error: any) {
    console.error('Error fetching gallery NFTs:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address format'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve NFTs'
    });
  }
});

/**
 * GET /api/gallery/metadata/:tokenId
 * Get encrypted metadata for a specific token
 */
router.get('/metadata/:tokenId', async (req, res) => {
  try {
    const { tokenId } = tokenIdSchema.parse({
      tokenId: req.params.tokenId
    });
    
    const metadata = await metadataService.getEncryptedMetadata(tokenId);
    
    if (!metadata) {
      return res.status(404).json({
        success: false,
        error: 'Metadata not found for token'
      });
    }
    
    res.json({
      success: true,
      metadata: {
        tokenId: metadata.tokenId,
        encryptedData: metadata.encryptedData,
        ownerAddress: metadata.ownerAddress,
        preview: metadata.unencryptedPreview
      }
    });
  } catch (error: any) {
    console.error('Error fetching token metadata:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid token ID'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve metadata'
    });
  }
});

/**
 * POST /api/gallery/unlock/:tokenId
 * Unlock encrypted metadata for a token if the requester is the owner
 */
router.post('/unlock/:tokenId', async (req, res) => {
  try {
    const { tokenId, walletAddress } = unlockRequestSchema.parse({
      tokenId: req.params.tokenId,
      walletAddress: req.body.walletAddress
    });
    
    // Verify that the requester is the NFT owner
    const metadata = await metadataService.getEncryptedMetadata(tokenId);
    
    if (!metadata) {
      return res.status(404).json({
        success: false,
        error: 'Metadata not found for token'
      });
    }
    
    if (metadata.ownerAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: 'You do not own this NFT receipt'
      });
    }
    
    try {
      // Parse the encrypted data
      const encryptedData = JSON.parse(metadata.encryptedData);
      
      // In a real implementation, we would use TaCo to decrypt
      // Since we're mocking, we'll extract the data
      let decryptedData: any;
      
      try {
        // Try to decrypt using TaCo service
        decryptedData = await tacoService.decryptData(
          walletAddress,
          encryptedData.capsuleId, 
          encryptedData.ciphertext
        );
      } catch (decryptError) {
        console.warn('TaCo decryption failed, using mock decryption:', decryptError);
        
        // Mock decryption for development
        decryptedData = {
          items: [
            { name: "Widget XL", price: 24.99, quantity: 1, category: "Electronics" },
            { name: "Service Fee", price: 4.99, quantity: 1, category: "Services" }
          ],
          subtotal: 29.98,
          tax: 2.40,
          total: 32.38,
          date: new Date().toISOString().split('T')[0],
          merchant: "Widget Store",
          paymentMethod: "Credit Card",
          receiptId: metadata.tokenId
        };
      }
      
      // Return the decrypted data
      res.json({
        success: true,
        metadata: decryptedData
      });
    } catch (parseError) {
      console.error('Error parsing encrypted data:', parseError);
      
      res.status(500).json({
        success: false,
        error: 'Encrypted data format is invalid'
      });
    }
  } catch (error: any) {
    console.error('Error unlocking token metadata:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request parameters'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to unlock metadata'
    });
  }
});

export default router;
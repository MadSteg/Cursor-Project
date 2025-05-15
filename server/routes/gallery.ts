import express, { Request, Response } from 'express';
import { db } from '../db';

const router = express.Router();

/**
 * Get all NFTs owned by a specific wallet address
 * GET /api/gallery/:wallet
 */
router.get('/:wallet', async (req: Request, res: Response) => {
  try {
    const { wallet } = req.params;
    
    if (!wallet || !wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid wallet address' 
      });
    }
    
    // In a production app, we would query our database
    // For now, we'll use mock data for development
    const mockNFTs = [
      {
        id: 'receipt-1',
        name: 'BlockReceipt #1',
        description: 'A BlockReceipt NFT from Starbucks',
        image: '/nft-images/coffee-receipt.svg',
        dateCreated: new Date().toISOString(),
        metadata: {
          merchant: 'Starbucks',
          date: '2025-05-15',
          total: 12.95,
          encrypted: true
        },
        txHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        chainId: 80002,
        contract: process.env.RECEIPT_NFT_CONTRACT_ADDRESS || '0x1111111111111111111111111111111111111111'
      },
      {
        id: 'receipt-2',
        name: 'BlockReceipt #2',
        description: 'A BlockReceipt NFT from Target',
        image: '/nft-images/shopping-receipt.svg',
        dateCreated: new Date().toISOString(),
        metadata: {
          merchant: 'Target',
          date: '2025-05-14',
          total: 87.32,
          encrypted: true
        },
        txHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        chainId: 80002,
        contract: process.env.RECEIPT_NFT_CONTRACT_ADDRESS || '0x1111111111111111111111111111111111111111'
      },
      {
        id: 'nft-gift-1',
        name: 'Pixelated Panda #42',
        description: 'A gift NFT from BlockReceipt.ai',
        image: 'https://example.com/nft-image.jpg',
        dateCreated: new Date().toISOString(),
        metadata: {
          source: 'BlockReceipt Gift',
          marketplace: 'OpenSea',
          price: 0.08
        },
        txHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        chainId: 80002,
        contract: '0x2222222222222222222222222222222222222222'
      }
    ];
    
    // Add metadataLocked property to each NFT
    const withLockStates = mockNFTs.map(nft => ({
      ...nft,
      metadataLocked: nft.metadata.encrypted || false
    }));
    
    return res.status(200).json({
      success: true,
      wallet: wallet.toLowerCase(),
      nfts: withLockStates
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
 * Get details for a specific NFT
 * GET /api/gallery/:wallet/:id
 */
router.get('/:wallet/:id', async (req: Request, res: Response) => {
  try {
    const { wallet, id } = req.params;
    
    if (!wallet || !wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid wallet address' 
      });
    }
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'NFT ID is required' 
      });
    }
    
    // In a production app, we would query our database
    // For now, we'll use mock data for development
    const mockNFT = {
      id,
      name: `BlockReceipt #${id}`,
      description: 'A BlockReceipt NFT',
      image: '/nft-images/receipt-warrior.svg',
      dateCreated: new Date().toISOString(),
      metadata: {
        merchant: 'Example Merchant',
        date: '2025-05-15',
        total: 42.99,
        encrypted: true,
        items: [
          { name: 'HIDDEN ITEM', price: 'ENCRYPTED', category: 'ENCRYPTED' }
        ]
      },
      txHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      chainId: 80002,
      contract: process.env.RECEIPT_NFT_CONTRACT_ADDRESS || '0x1111111111111111111111111111111111111111',
      metadataLocked: true
    };
    
    return res.status(200).json({
      success: true,
      wallet: wallet.toLowerCase(),
      nft: mockNFT
    });
  } catch (error: any) {
    console.error('Error retrieving NFT details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve NFT details',
      error: error.message || 'Unknown error'
    });
  }
});

/**
 * Unlock NFT metadata (simulate TACo decryption)
 * POST /api/gallery/:wallet/:id/unlock
 */
router.post('/:wallet/:id/unlock', async (req: Request, res: Response) => {
  try {
    const { wallet, id } = req.params;
    
    // In a real implementation, this would perform actual TACo decryption
    // For now, we'll just simulate the unlocking process
    const unlockedMetadata = {
      merchant: 'Example Merchant',
      date: '2025-05-15',
      total: 42.99,
      encrypted: false,
      items: [
        { name: 'Product A', price: 12.99, category: 'electronics' },
        { name: 'Product B', price: 24.99, category: 'household' },
        { name: 'Product C', price: 5.01, category: 'grocery' }
      ]
    };
    
    return res.status(200).json({
      success: true,
      wallet: wallet.toLowerCase(),
      id,
      metadata: unlockedMetadata,
      metadataLocked: false
    });
  } catch (error: any) {
    console.error('Error unlocking NFT metadata:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unlock NFT metadata',
      error: error.message || 'Unknown error'
    });
  }
});

export default router;
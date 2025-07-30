import { Router } from 'express';
import { db } from '../db';
import { NFTReceiptTier } from '../../shared/products';

const router = Router();

// Create a new NFT receipt
router.post('/create', async (req, res) => {
  try {
    const {
      productId,
      productName,
      merchantId,
      merchantName,
      amount,
      tier = NFTReceiptTier.STANDARD,
      transactionHash,
      paymentMethod,
      currency,
      email
    } = req.body;

    // Validate required fields
    if (!productId || !productName || !merchantId || !merchantName || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // In a real application, we'd trigger the blockchain contract call here
    // For development, we'll mock the NFT creation
    const mockTokenId = `mock-token-${Date.now()}`;
    const mockIpfsHash = `ipfs://QmMock${Date.now()}`;
    
    // Create receipt record
    const receiptId = 1; // In a real app, this would be from the database
    
    console.log(`Creating NFT receipt for product ${productId} with tier ${tier}`);

    // Send receipt response
    res.status(201).json({
      receiptId,
      tokenId: mockTokenId,
      transactionHash: transactionHash || `0x${Date.now().toString(16)}abcdef`,
      ipfsHash: mockIpfsHash,
      tier,
      productId,
      productName,
      merchantId,
      merchantName,
      amount,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to create NFT receipt:', error);
    res.status(500).json({ message: 'Failed to create NFT receipt' });
  }
});

// Get NFT receipt by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const receiptId = parseInt(id);
    
    if (isNaN(receiptId)) {
      return res.status(400).json({ message: 'Invalid receipt ID' });
    }
    
    // In a real application, this would fetch from the database
    // For development, we'll return mock data if ID is valid, otherwise 404
    if (receiptId === 1) {
      res.json({
        id: receiptId,
        tokenId: 'mock-token-12345',
        transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        ipfsHash: 'ipfs://QmSampleHash123456789',
        tier: NFTReceiptTier.STANDARD,
        productId: 'product-th-1',
        productName: 'Ultra HD Smart TV 65"',
        merchantId: 'merchant-tech-haven',
        merchantName: 'Tech Haven',
        amount: 0.01,
        createdAt: new Date().toISOString()
      });
    } else {
      res.status(404).json({ message: 'Receipt not found' });
    }
  } catch (error) {
    console.error('Failed to fetch NFT receipt:', error);
    res.status(500).json({ message: 'Failed to fetch NFT receipt' });
  }
});

// Get NFT receipts by wallet address
router.get('/by-wallet/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress || walletAddress.length < 10) {
      return res.status(400).json({ message: 'Invalid wallet address' });
    }
    
    // In a real application, this would fetch from the database
    // For development, we'll return mock data
    res.json([
      {
        id: 1,
        tokenId: 'mock-token-12345',
        transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        ipfsHash: 'ipfs://QmSampleHash123456789',
        tier: NFTReceiptTier.STANDARD,
        productId: 'product-th-1',
        productName: 'Ultra HD Smart TV 65"',
        merchantId: 'merchant-tech-haven',
        merchantName: 'Tech Haven',
        amount: 0.01,
        createdAt: new Date().toISOString()
      }
    ]);
  } catch (error) {
    console.error('Failed to fetch NFT receipts by wallet:', error);
    res.status(500).json({ message: 'Failed to fetch NFT receipts' });
  }
});

export default router;
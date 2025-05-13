/**
 * Blockchain API Routes
 * 
 * This file defines the API routes for interacting with the blockchain.
 */
import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { blockchainService } from '../services/blockchainService';
import { getIpfsUrl } from '../utils/ipfs';

const router = Router();

/**
 * GET /api/blockchain/status
 * Get blockchain integration status
 */
router.get('/status', async (req, res) => {
  try {
    if (!blockchainService.isAvailable()) {
      return res.json({
        available: false,
        message: 'Blockchain integration is not configured',
      });
    }

    const networkInfo = await blockchainService.getNetworkInfo();
    return res.json({
      available: true,
      ...networkInfo,
    });
  } catch (error) {
    console.error('Error checking blockchain status:', error);
    return res.status(500).json({
      available: false,
      message: 'Failed to connect to blockchain service',
    });
  }
});

/**
 * POST /api/blockchain/mint/:receiptId
 * Mint a receipt as an NFT
 */
router.post('/mint/:receiptId', async (req, res) => {
  try {
    const { receiptId } = req.params;
    const receipt = await storage.getReceipt(parseInt(receiptId, 10));
    
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    
    // Get receipt items
    const items = await storage.getReceiptItems(receipt.id);
    
    // Get merchant details
    const merchant = await storage.getMerchant(receipt.merchantId);
    
    if (!merchant) {
      return res.status(404).json({ error: 'Merchant not found' });
    }
    
    // Mint the receipt as an NFT
    const result = await blockchainService.mintReceiptNFT(receipt, items);
    
    // Update receipt with blockchain information
    await storage.updateReceipt(receipt.id, {
      blockchainVerified: true,
      blockchainTxHash: result.txHash,
      blockNumber: result.blockNumber,
      nftTokenId: result.tokenId.toString(),
      ipfsCid: result.ipfsCid,
      ipfsUrl: result.ipfsCid ? getIpfsUrl(result.ipfsCid) : undefined,
      encryptionKey: result.encryptionKey,
    });
    
    return res.json({
      success: true,
      txHash: result.txHash,
      blockNumber: result.blockNumber,
      tokenId: result.tokenId,
      encryptionKey: result.encryptionKey,
      ipfsCid: result.ipfsCid,
      ipfsUrl: result.ipfsCid ? `https://ipfs.io/ipfs/${result.ipfsCid}` : undefined
    });
  } catch (error) {
    console.error('Error minting receipt:', error);
    return res.status(500).json({ 
      error: 'Failed to mint receipt as NFT',
      details: String(error)
    });
  }
});

/**
 * GET /api/blockchain/verify/:tokenId
 * Verify a receipt on the blockchain
 */
router.get('/verify/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    
    const result = await blockchainService.verifyReceipt(parseInt(tokenId, 10));
    
    // Add IPFS URL for easy access
    if (result.verified && result.ipfsCid) {
      result.ipfsUrl = getIpfsUrl(result.ipfsCid);
    }
    
    return res.json(result);
  } catch (error) {
    console.error('Error verifying receipt:', error);
    return res.status(500).json({ 
      error: 'Failed to verify receipt on blockchain',
      details: String(error)
    });
  }
});

/**
 * POST /api/blockchain/mock-mint/:receiptId
 * Mint a receipt using mock blockchain data (for testing)
 */
router.post('/mock-mint/:receiptId', async (req, res) => {
  try {
    const { receiptId } = req.params;
    const receipt = await storage.getReceipt(parseInt(receiptId, 10));
    
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    
    // Get receipt items
    const items = await storage.getReceiptItems(receipt.id);
    
    // Create mock blockchain transaction data
    const mockTxHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const mockTokenId = Math.floor(Date.now() / 1000);
    const mockCid = `bafybei${Math.random().toString(36).substring(2, 30)}`;
    const mockBlockNumber = Math.floor(14000000 + Math.random() * 1000000);
    
    // Mock the blockchain encryption key
    const mockEncryptionKey = `key-${Math.random().toString(36).substring(2, 10)}`;
    
    console.log(`✅ Mock transaction hash: ${mockTxHash}`);
    console.log(`🔑 Mock token ID: ${mockTokenId}`);
    console.log(`📦 Mock IPFS CID: ${mockCid}`);
    
    // Update receipt with mock blockchain information
    await storage.updateReceipt(receipt.id, {
      blockchainVerified: true,
      blockchainTxHash: mockTxHash,
      blockNumber: mockBlockNumber,
      nftTokenId: mockTokenId.toString(),
      ipfsCid: mockCid,
      ipfsUrl: `https://ipfs.io/ipfs/${mockCid}`,
      encryptionKey: mockEncryptionKey
    });
    
    // Mock result to match the real mintReceiptNFT response format
    const mockResult = {
      txHash: mockTxHash,
      tokenId: mockTokenId,
      blockNumber: mockBlockNumber,
      encryptionKey: mockEncryptionKey,
      ipfsCid: mockCid,
      ipfsUrl: `https://ipfs.io/ipfs/${mockCid}`
    };
    
    return res.json({
      success: true,
      message: 'Receipt minted using mock blockchain data',
      ...mockResult
    });
  } catch (error) {
    console.error('Error creating mock blockchain data:', error);
    return res.status(500).json({ 
      error: 'Failed to create mock blockchain data',
      details: String(error)
    });
  }
});

export default router;
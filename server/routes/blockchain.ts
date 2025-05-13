/**
 * Blockchain API Routes
 * 
 * This file defines the API routes for interacting with the blockchain.
 */

import { Router } from 'express';
import { blockchainService } from '../services/blockchainService';
import { storage } from '../storage';

const router = Router();

/**
 * GET /api/blockchain/status
 * Get blockchain integration status
 */
router.get('/status', async (req, res) => {
  try {
    const isAvailable = blockchainService.isAvailable();
    
    if (!isAvailable) {
      return res.json({
        available: false,
        message: 'Blockchain integration is not available. Check environment variables.'
      });
    }
    
    const networkInfo = await blockchainService.getNetworkInfo();
    
    return res.json({
      available: true,
      networkName: networkInfo.networkName,
      chainId: networkInfo.chainId,
      contractAddress: networkInfo.contractAddress
    });
  } catch (error) {
    console.error('Error getting blockchain status:', error);
    return res.status(500).json({
      error: 'Failed to get blockchain status',
      available: false
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
    
    // Get the receipt
    const receipt = await storage.getReceipt(parseInt(receiptId));
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    
    // Get receipt items
    const items = await storage.getReceiptItems(receipt.id);
    
    // Mint the NFT
    const result = await blockchainService.mintReceiptNFT(receipt, items);
    
    // Update the receipt with blockchain info
    await storage.updateReceipt(receipt.id, {
      blockchainTxHash: result.txHash,
      blockchainVerified: true,
      blockNumber: result.blockNumber,
      nftTokenId: result.tokenId.toString()
    });
    
    return res.json({
      success: true,
      tokenId: result.tokenId,
      txHash: result.txHash,
      blockNumber: result.blockNumber,
      encryptionKey: result.encryptionKey, // Note: In production, this should be stored securely or shared securely
      cid: result.cid
    });
  } catch (error) {
    console.error('Error minting receipt NFT:', error);
    return res.status(500).json({
      error: 'Failed to mint receipt NFT',
      message: error.message
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
    
    const result = await blockchainService.verifyReceipt(parseInt(tokenId));
    
    return res.json(result);
  } catch (error) {
    console.error('Error verifying receipt:', error);
    return res.status(500).json({
      error: 'Failed to verify receipt',
      message: error.message
    });
  }
});

export default router;
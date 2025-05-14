/**
 * Blockchain API Routes for Polygon Amoy
 * 
 * This file defines the API routes for interacting with the Polygon Amoy blockchain.
 */

import { Router, Request, Response } from 'express';
import { blockchainService } from '../services/blockchainServiceAmoy';
import { storage } from '../storage';

const router = Router();

/**
 * GET /api/blockchain/status
 * Get blockchain integration status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const isAvailable = await blockchainService.isAvailable();
    
    if (!isAvailable) {
      return res.status(503).json({
        status: 'error',
        message: 'Blockchain integration is not available'
      });
    }
    
    const networkInfo = await blockchainService.getNetworkInfo();
    
    res.json({
      status: 'success',
      data: {
        available: true,
        network: networkInfo.name,
        chainId: networkInfo.chainId,
        blockNumber: networkInfo.blockNumber,
        mockMode: networkInfo.mockMode
      }
    });
  } catch (error) {
    console.error('Error checking blockchain status:', error);
    res.status(500).json({
      status: 'error',
      message: `Failed to check blockchain status: ${error.message}`
    });
  }
});

/**
 * POST /api/blockchain/mint/:receiptId
 * Mint a receipt as an NFT
 */
router.post('/mint/:receiptId', async (req: Request, res: Response) => {
  try {
    const { receiptId } = req.params;
    const receiptIdNum = parseInt(receiptId, 10);
    
    if (isNaN(receiptIdNum)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid receipt ID'
      });
    }
    
    // Get the receipt from storage
    const receipt = await storage.getReceipt(receiptIdNum);
    
    if (!receipt) {
      return res.status(404).json({
        status: 'error',
        message: 'Receipt not found'
      });
    }
    
    // Get the receipt items
    const items = await storage.getReceiptItems(receiptIdNum);
    
    if (!items || items.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Receipt items not found'
      });
    }
    
    // Check if the receipt is already on the blockchain
    if (receipt.nftTokenId) {
      return res.status(400).json({
        status: 'error',
        message: 'Receipt is already minted as an NFT'
      });
    }
    
    // Mint the NFT
    const result = await blockchainService.mintReceiptNFT(receipt, items);
    
    // Update the receipt with the token ID and block number
    const updatedReceipt = await storage.updateReceipt(receiptIdNum, {
      nftTokenId: result.tokenId,
      blockNumber: result.blockNumber
    });
    
    res.json({
      status: 'success',
      data: {
        receipt: updatedReceipt,
        tokenId: result.tokenId,
        txHash: result.txHash,
        blockNumber: result.blockNumber
      }
    });
  } catch (error) {
    console.error('Error minting receipt NFT:', error);
    res.status(500).json({
      status: 'error',
      message: `Failed to mint receipt NFT: ${error.message}`
    });
  }
});

/**
 * GET /api/blockchain/verify/:tokenId
 * Verify a receipt on the blockchain
 */
router.get('/verify/:tokenId', async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;
    
    if (!tokenId) {
      return res.status(400).json({
        status: 'error',
        message: 'Token ID is required'
      });
    }
    
    // Find the receipt with this token ID
    const receipts = await storage.getReceipts(1); // TODO: Get the proper user ID
    const receipt = receipts.find(r => r.nftTokenId === tokenId);
    
    if (!receipt) {
      return res.status(404).json({
        status: 'error',
        message: 'Receipt with this token ID not found'
      });
    }
    
    // Get the full receipt with items
    const fullReceipt = await storage.getFullReceipt(receipt.id);
    
    if (!fullReceipt) {
      return res.status(404).json({
        status: 'error',
        message: 'Full receipt not found'
      });
    }
    
    // Verify the receipt on the blockchain
    const verificationResult = await blockchainService.verifyReceipt(tokenId, fullReceipt);
    
    if (!verificationResult.valid) {
      return res.status(400).json({
        status: 'error',
        message: verificationResult.message
      });
    }
    
    res.json({
      status: 'success',
      data: {
        valid: true,
        receipt: fullReceipt,
        blockchainData: verificationResult.data
      }
    });
  } catch (error) {
    console.error('Error verifying receipt:', error);
    res.status(500).json({
      status: 'error',
      message: `Failed to verify receipt: ${error.message}`
    });
  }
});

/**
 * POST /api/blockchain/mock-mint/:receiptId
 * Mint a receipt using mock blockchain data (for testing)
 */
router.post('/mock-mint/:receiptId', async (req: Request, res: Response) => {
  try {
    const { receiptId } = req.params;
    const receiptIdNum = parseInt(receiptId, 10);
    
    if (isNaN(receiptIdNum)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid receipt ID'
      });
    }
    
    // Get the receipt from storage
    const receipt = await storage.getReceipt(receiptIdNum);
    
    if (!receipt) {
      return res.status(404).json({
        status: 'error',
        message: 'Receipt not found'
      });
    }
    
    // Get the receipt items
    const items = await storage.getReceiptItems(receiptIdNum);
    
    if (!items || items.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Receipt items not found'
      });
    }
    
    // Force mock mode by using the mintReceiptNFT method directly
    const result = await blockchainService.mintReceiptNFT(receipt, items);
    
    // Update the receipt with the token ID and block number
    const updatedReceipt = await storage.updateReceipt(receiptIdNum, {
      nftTokenId: result.tokenId,
      blockNumber: result.blockNumber
    });
    
    res.json({
      status: 'success',
      data: {
        receipt: updatedReceipt,
        tokenId: result.tokenId,
        txHash: result.txHash,
        blockNumber: result.blockNumber,
        mockMode: true
      }
    });
  } catch (error) {
    console.error('Error mock minting receipt NFT:', error);
    res.status(500).json({
      status: 'error',
      message: `Failed to mock mint receipt NFT: ${error.message}`
    });
  }
});

export default router;
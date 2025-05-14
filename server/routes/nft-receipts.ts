/**
 * NFT Receipt API Routes
 * Provides endpoints for creating and retrieving NFT receipts
 */

import express from 'express';
import { tpreService } from '../services/tpre.service';
import { 
  getProductById, 
  getMerchantById,
  NFTReceiptTier,
  calculateNFTReceiptPrice
} from '@shared/products';
import { ethers } from 'ethers';

const router = express.Router();

// Mock database for receipts (in a real app, this would be in the database)
const receipts = new Map();
let receiptCounter = 0;

/**
 * @route POST /api/nft-receipts/create
 * @desc Create a new NFT receipt for a product purchase
 */
router.post('/create', async (req, res) => {
  try {
    const { 
      productId, 
      customerWalletAddress, 
      tier = NFTReceiptTier.STANDARD,
      paymentMethod,
      paymentId
    } = req.body;

    // Validate inputs
    if (!productId || !customerWalletAddress) {
      return res.status(400).json({ 
        message: 'Missing required fields: productId, customerWalletAddress' 
      });
    }
    
    // Check if the tier is valid
    if (!Object.values(NFTReceiptTier).includes(tier)) {
      return res.status(400).json({ 
        message: `Invalid tier. Must be one of: ${Object.values(NFTReceiptTier).join(', ')}` 
      });
    }
    
    // Retrieve product and merchant
    const product = getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const merchant = getMerchantById(product.merchantId);
    if (!merchant) {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    
    // Check if the product is available
    if (!product.available) {
      return res.status(400).json({ message: 'Product is not available' });
    }
    
    // Check if the tier is available for this product
    if (!product.nftReceipt.availableTiers.includes(tier)) {
      return res.status(400).json({ 
        message: `Tier ${tier} is not available for this product` 
      });
    }

    // Calculate NFT receipt cost
    const receiptCost = calculateNFTReceiptPrice(product, tier);
    
    // Validate wallet address
    if (!ethers.utils.isAddress(customerWalletAddress)) {
      return res.status(400).json({ message: 'Invalid wallet address' });
    }
    
    // Create receipt with TPRE
    const { receiptData, encryptedReceipt } = await tpreService.createProductReceipt(
      product,
      merchant,
      customerWalletAddress,
      {
        method: paymentMethod || 'crypto',
        id: paymentId || `payment-${Date.now()}`,
        tier
      }
    );
    
    // In a real implementation, we would:
    // 1. Store the encrypted receipt in IPFS
    // 2. Mint the NFT receipt on the blockchain
    // 3. Store the receipt metadata in the database
    
    // For this demo, we'll just store it in memory
    const receiptId = ++receiptCounter;
    
    const receipt = {
      id: receiptId,
      productId,
      merchantId: product.merchantId,
      customerWalletAddress,
      encryptedReceipt,
      tier,
      nftTokenId: `mock-token-${receiptId}`,
      transactionHash: `mock-tx-${receiptId}`,
      ipfsHash: `ipfs://mock-hash-${receiptId}`,
      createdAt: new Date().toISOString()
    };
    
    receipts.set(receiptId, receipt);
    
    // Return receipt information
    res.status(201).json({
      receiptId,
      nftTokenId: receipt.nftTokenId,
      transactionHash: receipt.transactionHash,
      ipfsHash: receipt.ipfsHash,
      tier,
      price: receiptCost,
      productInfo: {
        id: product.id,
        name: product.name,
        price: product.price
      },
      merchantInfo: {
        id: merchant.id,
        name: merchant.name
      },
      createdAt: receipt.createdAt
    });
    
  } catch (error) {
    console.error('Error creating NFT receipt:', error);
    res.status(500).json({ 
      message: 'Failed to create NFT receipt',
      error: error.message 
    });
  }
});

/**
 * @route GET /api/nft-receipts/:id
 * @desc Get receipt details by ID
 */
router.get('/:id', (req, res) => {
  const receiptId = parseInt(req.params.id);
  
  if (isNaN(receiptId) || !receipts.has(receiptId)) {
    return res.status(404).json({ message: 'Receipt not found' });
  }
  
  const receipt = receipts.get(receiptId);
  
  // Get product and merchant info
  const product = getProductById(receipt.productId);
  const merchant = getMerchantById(receipt.merchantId);
  
  // Return receipt with product and merchant info
  res.json({
    ...receipt,
    product: product ? {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    } : null,
    merchant: merchant ? {
      id: merchant.id,
      name: merchant.name,
      logo: merchant.logo
    } : null
  });
});

/**
 * @route GET /api/nft-receipts/by-wallet/:address
 * @desc Get all receipts for a wallet address
 */
router.get('/by-wallet/:address', (req, res) => {
  const walletAddress = req.params.address;
  
  // Validate wallet address
  if (!ethers.utils.isAddress(walletAddress)) {
    return res.status(400).json({ message: 'Invalid wallet address' });
  }
  
  // Find all receipts for this wallet
  const walletReceipts = Array.from(receipts.values())
    .filter(receipt => receipt.customerWalletAddress.toLowerCase() === walletAddress.toLowerCase())
    .map(receipt => {
      const product = getProductById(receipt.productId);
      const merchant = getMerchantById(receipt.merchantId);
      
      return {
        id: receipt.id,
        nftTokenId: receipt.nftTokenId,
        transactionHash: receipt.transactionHash,
        ipfsHash: receipt.ipfsHash,
        tier: receipt.tier,
        createdAt: receipt.createdAt,
        product: product ? {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0]
        } : null,
        merchant: merchant ? {
          id: merchant.id,
          name: merchant.name,
          logo: merchant.logo
        } : null
      };
    });
  
  res.json(walletReceipts);
});

/**
 * @route GET /api/nft-receipts/:id/decrypt
 * @desc Decrypt a receipt (only available to the owner, merchant, or platform)
 */
router.get('/:id/decrypt', async (req, res) => {
  try {
    const receiptId = parseInt(req.params.id);
    
    if (isNaN(receiptId) || !receipts.has(receiptId)) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    
    const receipt = receipts.get(receiptId);
    
    // In a real implementation, we would:
    // 1. Verify that the caller is authorized to decrypt this receipt
    // 2. Use the caller's wallet credentials to decrypt
    
    // For this demo, we'll skip the auth check and decrypt for anyone
    const decryptedReceipt = await tpreService.decryptReceipt(
      receipt.encryptedReceipt.encryptedData,
      receipt.encryptedReceipt.encryptionContext,
      receipt.customerWalletAddress
    );
    
    res.json({
      id: receipt.id,
      decryptedData: decryptedReceipt
    });
    
  } catch (error) {
    console.error('Error decrypting receipt:', error);
    res.status(500).json({ 
      message: 'Failed to decrypt receipt',
      error: error.message 
    });
  }
});

export default router;
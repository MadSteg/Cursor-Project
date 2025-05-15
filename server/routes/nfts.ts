import express from 'express';
import { ethers } from 'ethers';
import ERC1155_ABI from '../abi/BlockReceiptCollection.json';
import { logger } from '../utils/logger';

const router = express.Router();

// Sample NFT ids for the pool
const NFT_POOL_IDS = {
  STANDARD: 1,
  PREMIUM: 2,
  LUXURY: 3,
  ULTRA: 4
};

/**
 * @route POST /api/nfts/mint
 * @desc Mint a new NFT receipt to user's wallet
 * @access Private
 */
router.post('/mint', async (req, res) => {
  const { walletAddress, nftId, receiptData } = req.body;
  
  if (!walletAddress) {
    return res.status(400).json({
      success: false,
      message: 'Wallet address is required'
    });
  }

  // Validate wallet address format
  if (!ethers.utils.isAddress(walletAddress)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid wallet address format'
    });
  }

  // Use the requested NFT ID or default to standard
  const tokenId = nftId || NFT_POOL_IDS.STANDARD;

  try {
    // Save task to track status and return task ID immediately
    const taskId = `mint-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Return task ID immediately
    res.status(202).json({
      success: true,
      message: 'NFT minting initiated',
      taskId: taskId
    });

    // Start minting process in background
    processMintTask(taskId, walletAddress, tokenId, receiptData);
    
  } catch (error) {
    logger.error('Error initiating mint process:', error);
    
    // Since we already responded, log the error but don't send another response
    // This error handling is for the initial request only
  }
});

/**
 * @route GET /api/nfts/task/:taskId
 * @desc Check status of minting task
 * @access Private
 */
router.get('/task/:taskId', async (req, res) => {
  const { taskId } = req.params;
  
  // In a production system, this would check a database for task status
  // For this MVP, we'll just return a mock response
  // This would be enhanced to actually check a Task status table in the database
  
  res.json({
    success: true,
    taskId,
    status: 'processing', // or 'completed', 'failed'
    message: 'NFT minting in progress'
  });
});

/**
 * Process the mint task in the background
 */
async function processMintTask(taskId: string, walletAddress: string, tokenId: number, receiptData: any) {
  try {
    // Check required environment variables
    if (!process.env.CONTRACT_ADDRESS) {
      throw new Error('CONTRACT_ADDRESS not set in environment');
    }
    
    if (!process.env.POLYGON_RPC_URL) {
      throw new Error('POLYGON_RPC_URL not set in environment');
    }
    
    if (!process.env.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY not set in environment');
    }

    // Connect to the blockchain
    const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
    
    // Create a wallet using the private key
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    // Connect to the smart contract
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      ERC1155_ABI,
      wallet
    );

    // Log the minting attempt
    logger.info(`Minting NFT ID ${tokenId} to ${walletAddress}`);
    
    // Call the mint function on the contract
    const tx = await contract.mint(walletAddress, tokenId);
    
    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    
    logger.info(`NFT minted successfully: ${receipt.transactionHash}`);
    
    // Update transaction status in DB (would be implemented in production)
    // updateTaskStatus(taskId, 'completed', { txHash: receipt.transactionHash });
    
    // Store receipt data in a database or IPFS if needed
    // In a production system, this would link the receipt data to the NFT
    
  } catch (error) {
    logger.error(`NFT minting failed for task ${taskId}:`, error);
    // updateTaskStatus(taskId, 'failed', { error: error.message });
  }
}

export default router;
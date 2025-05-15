import express from 'express';
import { ethers } from 'ethers';
import ERC1155_ABI from '../abi/BlockReceiptCollection.json';
import { logger } from '../utils/logger';
import * as nftMintService from '../services/nftMintService';
import * as nftPoolRepository from '../repositories/nftPoolRepository';
import * as taskService from '../services/taskService';
import { Task } from '../services/taskService';

const router = express.Router();

/**
 * Get a human-readable message for a task's status
 */
function getTaskStatusMessage(task: Task): string {
  switch (task.status) {
    case 'pending':
      return 'NFT minting request queued';
    case 'processing':
      return 'NFT minting in progress';
    case 'completed':
      return 'NFT minted successfully';
    case 'failed':
      return `NFT minting failed: ${task.error || 'Unknown error'}`;
    default:
      return 'Unknown status';
  }
}

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

  try {
    // Create a new task to track the minting process
    const task = taskService.createTask('nft_mint', walletAddress, { nftId, receiptData });
    
    // Return task ID immediately
    res.status(202).json({
      success: true,
      message: 'NFT minting initiated',
      taskId: task.id
    });

    // Process the minting task in the background
    taskService.processTask(task.id, async () => {
      if (nftId) {
        // Mint the specific NFT if an ID is provided
        return await nftMintService.mintNFT(walletAddress, nftId, receiptData);
      } else {
        // Auto-select an appropriate NFT based on receipt data
        return await nftMintService.selectAndMintNFT(walletAddress, receiptData);
      }
    });
    
  } catch (error: any) {
    logger.error('Error initiating mint process:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to initiate NFT minting: ${error.message}`
    });
  }
});

/**
 * @route GET /api/nfts/task/:taskId
 * @desc Check status of minting task
 * @access Private
 */
router.get('/task/:taskId', async (req, res) => {
  const { taskId } = req.params;
  
  try {
    // Get the task from the task service
    const task = taskService.getTask(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task ${taskId} not found`
      });
    }
    
    // Return task status and data
    return res.json({
      success: true,
      taskId: task.id,
      status: task.status,
      message: getTaskStatusMessage(task),
      data: task.status === 'completed' ? task.result : null,
      error: task.error || null,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    });
  } catch (error: any) {
    logger.error(`Error getting task status:`, error);
    return res.status(500).json({
      success: false,
      message: `Failed to get task status: ${error.message}`
    });
  }
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
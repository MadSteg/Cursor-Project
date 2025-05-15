/**
 * NFT Minting Service
 * 
 * This service handles the process of minting NFTs on the blockchain
 * It uses the Polygon Amoy testnet with our BlockReceipt smart contract
 */

import { ethers } from 'ethers';
import { logger } from '../utils/logger';
import * as nftPoolRepository from '../repositories/nftPoolRepository';
import * as ipfsService from './ipfsService';

// Check required environment variables
function checkEnv() {
  const requiredVars = [
    'CONTRACT_ADDRESS',
    'POLYGON_RPC_URL',
    'PRIVATE_KEY'
  ];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Environment variable ${varName} is not set`);
    }
  }
}

/**
 * Mint an NFT to the specified wallet address
 */
export async function mintNFT(walletAddress: string, nftId: string, receiptData: any) {
  try {
    // Check for required environment variables
    checkEnv();
    
    // If using a simulated contract address, use mock implementation
    if (process.env.CONTRACT_ADDRESS === '0x1111111111111111111111111111111111111111') {
      return await mockMintNFT(walletAddress, nftId, receiptData);
    }
    
    // Get the NFT data from the repository
    const nftData = await nftPoolRepository.getNFTById(nftId);
    if (!nftData) {
      throw new Error(`NFT with ID ${nftId} not found in pool`);
    }
    
    // Connect to blockchain
    const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    
    // Load the contract ABI from the local file
    const contractABI = require('../abi/BlockReceiptCollection.json');
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS!,
      contractABI,
      wallet
    );
    
    // Log the mint attempt
    logger.info(`Minting NFT ${nftId} (Token ID: ${nftData.tokenId}) to wallet ${walletAddress}`);
    
    // Call the mint function
    const tx = await contract.mint(walletAddress, nftData.tokenId);
    
    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    logger.info(`NFT minted successfully. Transaction hash: ${receipt.transactionHash}`);
    
    return {
      success: true,
      nftData,
      transaction: {
        hash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        confirmations: receipt.confirmations
      }
    };
  } catch (error: any) {
    logger.error(`NFT minting failed:`, error);
    throw new Error(`Failed to mint NFT: ${error.message}`);
  }
}

/**
 * Mock implementation for development that doesn't interact with blockchain
 */
async function mockMintNFT(walletAddress: string, nftId: string, receiptData: any) {
  try {
    // Get the NFT data from the repository
    const nftData = await nftPoolRepository.getNFTById(nftId);
    if (!nftData) {
      throw new Error(`NFT with ID ${nftId} not found in pool`);
    }
    
    // Create a fake transaction hash
    const txHash = `0x${Array(64).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)).join('')}`;
    
    logger.info(`[MOCK] Minted NFT ${nftId} to wallet ${walletAddress}. Transaction hash: ${txHash}`);
    
    return {
      success: true,
      nftData,
      transaction: {
        hash: txHash,
        blockNumber: Math.floor(Math.random() * 1000000),
        confirmations: 12
      }
    };
  } catch (error: any) {
    logger.error(`[MOCK] NFT minting failed:`, error);
    throw new Error(`Failed to mint NFT: ${error.message}`);
  }
}

/**
 * Select an appropriate NFT for a receipt and mint it
 */
export async function selectAndMintNFT(
  walletAddress: string, 
  receiptData: any
) {
  try {
    // Calculate appropriate tier based on receipt amount
    const total = receiptData.total || 0;
    let tier = 'standard';
    
    if (total >= 500) {
      tier = 'ultra';
    } else if (total >= 200) {
      tier = 'luxury';
    } else if (total >= 50) {
      tier = 'premium';
    }
    
    // Get category from receipt data or default to 'default'
    const category = receiptData.category || 'default';
    
    // Select an appropriate NFT
    const selectedNFT = await nftPoolRepository.selectNFTForReceipt(tier, category);
    
    if (!selectedNFT) {
      throw new Error('No suitable NFT found in the pool');
    }
    
    logger.info(`Selected NFT ${selectedNFT.id} for receipt`);
    
    // Mint the selected NFT
    return await mintNFT(walletAddress, selectedNFT.id, receiptData);
  } catch (error: any) {
    logger.error('Error selecting and minting NFT:', error);
    throw new Error(`Failed to select and mint NFT: ${error.message}`);
  }
}
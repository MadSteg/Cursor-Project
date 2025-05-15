/**
 * IPFS Service
 * 
 * This service handles pinning content to IPFS for NFT metadata and images
 * It uses a mock implementation in development but could be integrated with
 * Pinata, NFT.Storage or similar services in production.
 */

import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Mock IPFS gateway prefix
const MOCK_IPFS_GATEWAY = 'ipfs://QmBlockReceiptMockIPFSCID';

// In-memory storage of pinned content for development
const pinnedContent = new Map<string, any>();

/**
 * Generate a deterministic IPFS CID based on content
 * (This is a mock that generates a consistent CID for the same content)
 */
function generateMockCID(content: string): string {
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  return `Qm${hash.substring(0, 44)}`;
}

/**
 * Pin JSON content to IPFS
 */
export async function pinJSON(content: any): Promise<{ cid: string, url: string }> {
  try {
    // For production, this would call Pinata, NFT.Storage or similar
    // For development, we'll generate a mock CID and store in memory
    
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    const cid = generateMockCID(contentStr);
    
    // Store in our mock pinned content
    pinnedContent.set(cid, content);
    
    // Log the mock pin operation
    logger.info(`[IPFS] Pinned JSON content with CID: ${cid}`);
    
    return {
      cid,
      url: `${MOCK_IPFS_GATEWAY}/${cid}`
    };
  } catch (error) {
    logger.error('[IPFS] Error pinning JSON content', error);
    throw new Error(`Failed to pin JSON content: ${error.message}`);
  }
}

/**
 * Pin a file to IPFS
 */
export async function pinFile(filePath: string): Promise<{ cid: string, url: string }> {
  try {
    // For production, this would call Pinata, NFT.Storage or similar APIs
    // For development, we'll generate a mock CID
    
    // Read file to generate deterministic mock CID
    const fileContent = fs.readFileSync(filePath);
    const cid = generateMockCID(fileContent.toString('binary'));
    
    // Store file path in our mock storage
    pinnedContent.set(cid, { type: 'file', path: filePath });
    
    logger.info(`[IPFS] Pinned file ${filePath} with CID: ${cid}`);
    
    return {
      cid,
      url: `${MOCK_IPFS_GATEWAY}/${cid}`
    };
  } catch (error) {
    logger.error(`[IPFS] Error pinning file ${filePath}`, error);
    throw new Error(`Failed to pin file: ${error.message}`);
  }
}

/**
 * Generate and pin NFT metadata
 */
export async function generateAndPinNFTMetadata(
  nftData: {
    name: string;
    description: string;
    imageCid: string;
    attributes: Array<{ trait_type: string, value: string | number }>;
  }
): Promise<{ cid: string, url: string, metadata: any }> {
  try {
    // Create OpenSea-compatible metadata
    const metadata = {
      name: nftData.name,
      description: nftData.description,
      image: `ipfs://${nftData.imageCid}`,
      external_url: `https://blockreceipt.ai/receipt/${nftData.imageCid}`,
      attributes: nftData.attributes
    };
    
    // Pin the metadata
    const { cid, url } = await pinJSON(metadata);
    
    return {
      cid,
      url,
      metadata
    };
  } catch (error) {
    logger.error('[IPFS] Error generating and pinning NFT metadata', error);
    throw new Error(`Failed to generate and pin NFT metadata: ${error.message}`);
  }
}

/**
 * Get content from IPFS by CID
 * In production, this would call an IPFS gateway
 */
export async function getFromIPFS(cid: string): Promise<any> {
  // In production, this would fetch from an IPFS gateway
  if (pinnedContent.has(cid)) {
    return pinnedContent.get(cid);
  }
  
  throw new Error(`Content with CID ${cid} not found`);
}
/**
 * IPFS Utility
 * 
 * This file provides utilities for interacting with IPFS (InterPlanetary File System)
 * for storing and retrieving receipt data.
 */
import { create } from 'ipfs-http-client';

// IPFS configuration
// Using Infura as the IPFS provider
const projectId = process.env.IPFS_PROJECT_ID;
const projectSecret = process.env.IPFS_PROJECT_SECRET;

let client: any = null;

/**
 * Initialize the IPFS client with authentication
 */
function getIpfsClient() {
  if (client) return client;

  if (!projectId || !projectSecret) {
    console.warn('IPFS credentials not provided. Some features may not work.');
    // Create a client without auth for development purposes
    client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    });
  } else {
    // Create authenticated client
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
    client = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: auth
      }
    });
  }

  return client;
}

/**
 * Upload content to IPFS and return the CID
 * @param content Content to upload to IPFS
 * @returns CID (Content Identifier)
 */
export async function pinToIPFS(content: string): Promise<string> {
  try {
    const ipfs = getIpfsClient();
    const result = await ipfs.add({ content });
    return result.cid.toString();
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error(`Failed to upload to IPFS: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get content from IPFS by CID
 * @param cid Content Identifier
 * @returns Content as string
 */
export async function getFromIPFS(cid: string): Promise<string> {
  try {
    const ipfs = getIpfsClient();
    let content = '';
    
    // Collect content chunks
    for await (const chunk of ipfs.cat(cid)) {
      content += new TextDecoder().decode(chunk);
    }
    
    return content;
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw new Error(`Failed to retrieve from IPFS: ${error instanceof Error ? error.message : String(error)}`);
  }
}
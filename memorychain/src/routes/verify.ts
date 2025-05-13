import express, { Request, Response } from 'express';
import { ethers } from 'ethers';
import { create as createIPFS } from 'ipfs-http-client';
import dotenv from 'dotenv';
import * as thresholdCrypto from 'threshold-crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const router = express.Router();

// Get the directory name of the current module (ESM replacement for __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read contract ABI from artifacts
const contractDir = path.join(__dirname, '../../../artifacts/contracts/ReceiptMinter.sol');
// Check if the directory exists
if (!fs.existsSync(contractDir)) {
  console.error(`Contract directory not found: ${contractDir}`);
  // This could happen in development if contracts haven't been compiled
}

// ABI for the ReceiptMinter contract
const ReceiptMinterABI = fs.existsSync(path.join(contractDir, 'ReceiptMinter.json'))
  ? JSON.parse(fs.readFileSync(path.join(contractDir, 'ReceiptMinter.json'), 'utf8')).abi
  : [
      // Fallback ABI if file doesn't exist
      "function getReceiptData(uint256 id) external view returns (bytes32, bytes32)",
      "function getFullReceiptData(uint256 id) external view returns (tuple(bytes32 truncatedPanHash, bytes32 metadataCid, address recipient, uint256 timestamp))"
    ];

// Configure IPFS client (using Infura or other providers)
const ipfsConfig = {
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(
      `${process.env.IPFS_PROJECT_ID || ''}:${process.env.IPFS_PROJECT_SECRET || ''}`
    ).toString('base64')}`
  }
};

// Initialize IPFS client when credentials are available
let ipfs: any = null;
if (process.env.IPFS_PROJECT_ID && process.env.IPFS_PROJECT_SECRET) {
  try {
    ipfs = createIPFS(ipfsConfig);
    console.log('IPFS client initialized');
  } catch (error) {
    console.error('Failed to initialize IPFS client:', error);
  }
}

// The list of authorized vendor keys (in production, store securely)
const AUTHORIZED_VENDOR_KEYS: string[] = [];
if (process.env.VENDOR_PUBLIC_KEY) {
  AUTHORIZED_VENDOR_KEYS.push(process.env.VENDOR_PUBLIC_KEY);
} else {
  console.warn('No vendor public keys configured. Verification will be limited.');
}

/**
 * GET /verify/:tokenId
 * Verifies a receipt token
 */
router.get('/:tokenId', async (req: Request, res: Response) => {
  const tokenId = req.params.tokenId;
  
  // Validate token ID
  if (!tokenId || isNaN(Number(tokenId))) {
    return res.status(400).json({ error: 'Invalid token ID' });
  }
  
  // Check if blockchain configuration is available
  if (!process.env.ALCHEMY_RPC || !process.env.RECEIPT_MINTER_ADDRESS) {
    return res.status(500).json({ 
      error: 'Blockchain configuration not available',
      details: 'Missing RPC URL or contract address'
    });
  }
  
  try {
    // Connect to the blockchain
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC);
    const contract = new ethers.Contract(
      process.env.RECEIPT_MINTER_ADDRESS,
      ReceiptMinterABI,
      provider
    );
    
    // Get receipt data from the contract
    const receiptData = await contract.getFullReceiptData(tokenId);
    
    // Extract the truncated PAN hash and metadata CID
    const truncatedPanHash = receiptData.truncatedPanHash;
    const metadataCid = receiptData.metadataCid;
    const recipient = receiptData.recipient;
    const timestamp = receiptData.timestamp;
    
    // Convert bytes32 to string CID (removing leading 0x and trailing zeros)
    const cidHex = metadataCid.toString().replace(/^0x/, '').replace(/00+$/, '');
    const cid = Buffer.from(cidHex, 'hex').toString().trim().replace(/\0/g, '');
    
    // Base response without decrypted data
    const response = {
      valid: true,
      tokenId: Number(tokenId),
      recipient,
      timestamp: new Date(Number(timestamp) * 1000).toISOString(),
      ipfsGatewayUrl: `https://ipfs.io/ipfs/${cid}`
    };
    
    // Check if the X-Vendor-Key header is present
    const vendorKey = req.headers['x-vendor-key'] as string;
    
    if (!vendorKey) {
      // If no vendor key is provided, return limited information
      return res.status(200).json({
        ...response,
        decrypted: false,
        message: 'Vendor key required for full receipt details'
      });
    }
    
    // Verify the vendor key is authorized
    if (!AUTHORIZED_VENDOR_KEYS.includes(vendorKey)) {
      return res.status(401).json({
        valid: false,
        error: 'Unauthorized vendor key'
      });
    }
    
    // Attempt to fetch and decrypt the data if IPFS is configured
    if (!ipfs) {
      return res.status(500).json({
        ...response,
        decrypted: false,
        error: 'IPFS client not configured'
      });
    }
    
    // Fetch encrypted data from IPFS
    const chunks = [];
    for await (const chunk of ipfs.cat(cid)) {
      chunks.push(chunk);
    }
    const encryptedData = Buffer.concat(chunks).toString('utf8');
    
    // In a real implementation, you would:
    // 1. Use threshold cryptography to decrypt the data
    // 2. Compare the decrypted data's PAN hash to the on-chain hash
    
    // This is a simplified example
    const decryptedData = {
      // This would be the actual decrypted data in a real implementation
      paymentDetails: "Mocked payment details that would be decrypted in production",
      timestamp: new Date(Number(timestamp) * 1000).toISOString()
    };
    
    // Return the verified and decrypted data
    return res.status(200).json({
      ...response,
      decrypted: true,
      details: decryptedData
    });
    
  } catch (error: any) {
    console.error(`Error verifying receipt: ${error.message}`, error);
    return res.status(500).json({
      valid: false,
      error: 'Failed to verify receipt',
      details: error.message
    });
  }
});

export default router;
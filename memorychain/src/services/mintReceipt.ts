import { ethers } from 'ethers';
import { create as createIPFS } from 'ipfs-http-client';
import * as thresholdCrypto from 'threshold-crypto';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get the directory name of the current module (ESM replacement for __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read contract ABI from artifacts
const contractDir = path.join(__dirname, '../../../artifacts/contracts/ReceiptMinter.sol');
const ReceiptMinterABI = fs.existsSync(path.join(contractDir, 'ReceiptMinter.json'))
  ? JSON.parse(fs.readFileSync(path.join(contractDir, 'ReceiptMinter.json'), 'utf8')).abi
  : [
      // Fallback ABI if file doesn't exist
      "function mintReceipt(address to, bytes32 panHash, bytes32 cid) external returns (uint256)"
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
    console.log('IPFS client initialized for receipt minting');
  } catch (error) {
    console.error('Failed to initialize IPFS client:', error);
  }
}

/**
 * Computes a truncated PAN hash from the payment data
 * @param paymentData The payment data
 * @returns A bytes32 hash
 */
function computePanHash(paymentData: any): string {
  // In a real implementation, we would extract the first 6 and last 4 digits of the PAN
  // For this example, we'll create a hash from the payment ID
  const dataToHash = paymentData.paymentIntentId || crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  return '0x' + hash;
}

/**
 * Uploads data to IPFS
 * @param data The data to upload
 * @returns The IPFS CID
 */
async function uploadToIPFS(data: string): Promise<string> {
  if (!ipfs) {
    throw new Error('IPFS client not initialized');
  }
  
  // Add the data to IPFS
  const result = await ipfs.add(data);
  return result.cid.toString();
}

/**
 * Encrypts data using threshold cryptography
 * @param data The data to encrypt
 * @returns The encrypted data
 */
function encryptData(data: any): string {
  // In a real implementation, we would use threshold-crypto
  // For this example, we'll use a simple encryption
  const jsonData = JSON.stringify(data);
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(jsonData, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Prepend IV and key for simplicity (in production, key management would be more secure)
  return iv.toString('hex') + ':' + key.toString('hex') + ':' + encrypted;
}

/**
 * Mints a receipt NFT from Stripe payment data
 * @param paymentData The normalized Stripe payment data
 * @param customerAddress The customer's wallet address
 * @returns The transaction hash and IPFS URL
 */
export async function mintReceiptFromStripe(
  paymentData: any,
  customerAddress: string
): Promise<{ txHash: string; tokenId: number; ipfsUrl: string }> {
  // Validate inputs
  if (!paymentData) {
    throw new Error('Payment data is required');
  }
  
  if (!ethers.isAddress(customerAddress)) {
    throw new Error('Invalid customer wallet address');
  }
  
  // Check blockchain configuration
  if (!process.env.ALCHEMY_RPC || !process.env.WALLET_PRIVATE_KEY || !process.env.RECEIPT_MINTER_ADDRESS) {
    throw new Error('Missing blockchain configuration');
  }
  
  try {
    // 1. Serialize the payment data to JSON
    const serializedData = JSON.stringify(paymentData);
    
    // 2. Encrypt the data
    const encryptedData = encryptData(paymentData);
    
    // 3. Upload the encrypted data to IPFS
    const cid = await uploadToIPFS(encryptedData);
    
    // 4. Compute the PAN hash
    const panHash = computePanHash(paymentData);
    
    // 5. Connect to the blockchain
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC);
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(
      process.env.RECEIPT_MINTER_ADDRESS,
      ReceiptMinterABI,
      wallet
    );
    
    // Convert CID to bytes32 for the smart contract
    // We'll use a simplified approach: converting CID to a hex string and padding to bytes32
    const cidBytes = '0x' + Buffer.from(cid).toString('hex').padEnd(64, '0');
    
    // 6. Call mintReceipt on the contract
    console.log(`Minting receipt for ${customerAddress} with CID: ${cid}`);
    const tx = await contract.mintReceipt(customerAddress, panHash, cidBytes);
    const receipt = await tx.wait();
    
    // Extract the tokenId from the transaction receipt
    // In a real implementation, we would parse the ReceiptMinted event
    const tokenId = parseInt(receipt.logs[0]?.topics[1] || '0', 16);
    
    return {
      txHash: tx.hash,
      tokenId,
      ipfsUrl: `https://ipfs.io/ipfs/${cid}`
    };
  } catch (error: any) {
    console.error('Error minting receipt:', error);
    throw new Error(`Failed to mint receipt: ${error.message}`);
  }
}
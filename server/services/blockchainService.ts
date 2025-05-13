/**
 * Blockchain Service
 * 
 * This service handles interactions with the blockchain for receipt NFTs.
 * It uses ethers.js to interact with the ReceiptNFT smart contract.
 */

import { ethers } from 'ethers';
import crypto from 'crypto-js';
import dotenv from 'dotenv';
import type { Receipt, ReceiptItem } from '@shared/schema';

// Load environment variables
dotenv.config();

// Smart contract ABI (only the functions we need)
const CONTRACT_ABI = [
  "function mintReceipt(address to, string memory cid, string memory merchantName, uint256 timestamp, uint256 totalAmount, string memory uri) public returns (uint256)",
  "function getReceiptMetadata(uint256 tokenId) public view returns (string memory cid, string memory merchantName, uint256 timestamp, uint256 totalAmount, address minter)",
  "event ReceiptMinted(uint256 indexed tokenId, string cid, string merchantName, uint256 timestamp, uint256 totalAmount, address indexed minter)"
];

export class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;
  private wallet: ethers.Wallet;
  private initialized: boolean = false;

  constructor() {
    // We'll initialize on demand to make environment variables optional
    this.initialized = false;
  }

  /**
   * Initialize the blockchain service with the necessary configuration
   */
  private initialize(): boolean {
    try {
      const rpcUrl = process.env.RPC_URL;
      const privateKey = process.env.PRIVATE_KEY;
      const contractAddress = process.env.CONTRACT_ADDRESS;

      if (!rpcUrl || !privateKey || !contractAddress) {
        console.error('Missing environment variables for blockchain integration');
        return false;
      }

      // Initialize provider and wallet
      this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      
      // Initialize contract
      this.contract = new ethers.Contract(contractAddress, CONTRACT_ABI, this.wallet);
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing blockchain service:', error);
      return false;
    }
  }

  /**
   * Check if blockchain integration is available
   */
  isAvailable(): boolean {
    if (!this.initialized) {
      return this.initialize();
    }
    return this.initialized;
  }

  /**
   * Encrypt receipt data
   * @param receiptData Receipt data to encrypt
   * @returns Encrypted data and key
   */
  async encryptReceiptData(receiptData: any): Promise<{ encryptedData: string, encryptionKey: string }> {
    // Generate a random encryption key
    const encryptionKey = crypto.lib.WordArray.random(16).toString();
    
    // Encrypt the receipt data
    const encryptedData = crypto.AES.encrypt(
      JSON.stringify(receiptData),
      encryptionKey
    ).toString();
    
    return { encryptedData, encryptionKey };
  }

  /**
   * Decrypt receipt data
   * @param encryptedData Encrypted receipt data
   * @param encryptionKey Encryption key
   * @returns Decrypted receipt data
   */
  async decryptReceiptData(encryptedData: string, encryptionKey: string): Promise<any> {
    try {
      const decryptedBytes = crypto.AES.decrypt(encryptedData, encryptionKey);
      const decryptedText = decryptedBytes.toString(crypto.enc.Utf8);
      return JSON.parse(decryptedText);
    } catch (error) {
      console.error('Error decrypting receipt data:', error);
      throw new Error('Failed to decrypt receipt data');
    }
  }

  /**
   * Mint a receipt as an NFT
   * @param receipt Receipt data
   * @param items Receipt items
   * @returns Transaction details
   */
  async mintReceiptNFT(receipt: Receipt, items: ReceiptItem[]): Promise<{
    tokenId: number;
    txHash: string;
    blockNumber: number;
    encryptionKey: string;
    cid: string;
  }> {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service is not available');
    }

    try {
      // Prepare receipt data for blockchain
      const receiptData = {
        receipt: {
          id: receipt.id,
          merchantName: receipt.merchant?.name || 'Unknown',
          date: receipt.date,
          subtotal: receipt.subtotal.toString(),
          tax: receipt.tax.toString(),
          total: receipt.total.toString(),
        },
        items: items.map(item => ({
          name: item.name,
          price: item.price.toString(),
          quantity: item.quantity,
        }))
      };

      // Encrypt the receipt data
      const { encryptedData, encryptionKey } = await this.encryptReceiptData(receiptData);
      
      // In a real implementation, we would upload encryptedData to IPFS
      // or another decentralized storage system and get back a CID.
      // For now, we'll mock this with a hash of the encrypted data.
      const cid = crypto.SHA256(encryptedData).toString();

      // Convert the purchase date to a timestamp
      const timestamp = new Date(receipt.date).getTime() / 1000;
      
      // Convert the total amount to pennies/cents (integer)
      // totalAmount is a string from the database, convert to number and then to pennies
      const totalAmount = Math.round(parseFloat(receipt.total.toString()) * 100);
      
      // Mint the NFT
      const tx = await this.contract.mintReceipt(
        this.wallet.address, // to
        cid,                 // cid (content identifier)
        receipt.merchant?.name || 'Unknown', // merchantName
        timestamp,           // timestamp
        totalAmount,         // totalAmount in pennies/cents
        cid                  // uri (same as cid for now)
      );
      
      // Wait for the transaction to be confirmed
      const receipt1 = await tx.wait();
      
      // Find the ReceiptMinted event
      const event = receipt1.events?.find(e => e.event === 'ReceiptMinted');
      const tokenId = event?.args?.tokenId.toNumber() || 0;
      
      return {
        tokenId,
        txHash: tx.hash,
        blockNumber: receipt1.blockNumber,
        encryptionKey,
        cid
      };
    } catch (error) {
      console.error('Error minting receipt NFT:', error);
      throw new Error('Failed to mint receipt NFT');
    }
  }

  /**
   * Verify a receipt on the blockchain
   * @param tokenId Token ID
   * @param txHash Transaction hash
   * @returns Verification status and metadata
   */
  async verifyReceipt(tokenId: number): Promise<{
    verified: boolean;
    metadata?: {
      cid: string;
      merchantName: string;
      timestamp: number;
      totalAmount: number;
      minter: string;
    };
  }> {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service is not available');
    }

    try {
      const metadata = await this.contract.getReceiptMetadata(tokenId);
      
      return {
        verified: true,
        metadata: {
          cid: metadata[0],
          merchantName: metadata[1],
          timestamp: metadata[2].toNumber(),
          totalAmount: metadata[3].toNumber(),
          minter: metadata[4]
        }
      };
    } catch (error) {
      console.error('Error verifying receipt:', error);
      return { verified: false };
    }
  }

  /**
   * Get network and contract information
   */
  async getNetworkInfo(): Promise<{
    networkName: string;
    chainId: number;
    contractAddress: string;
  }> {
    if (!this.isAvailable()) {
      throw new Error('Blockchain service is not available');
    }

    const network = await this.provider.getNetwork();
    return {
      networkName: network.name,
      chainId: network.chainId,
      contractAddress: this.contract.address
    };
  }
}

// Export a singleton instance
export const blockchainService = new BlockchainService();
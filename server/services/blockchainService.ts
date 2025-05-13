/**
 * Blockchain Service
 * 
 * This service handles interactions with the blockchain for receipt NFTs.
 * It uses ethers.js to interact with the ReceiptNFT smart contract.
 */
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';
import { Receipt, ReceiptItem } from '@shared/schema';

// ABI for the ReceiptNFT contract
const RECEIPT_NFT_ABI = [
  // ERC1155 standard functions
  "function balanceOf(address account, uint256 id) external view returns (uint256)",
  "function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) external view returns (uint256[] memory)",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address account, address operator) external view returns (bool)",
  "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external",
  "function safeBatchTransferFrom(address from, address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data) external",
  
  // Custom functions
  "function mint(address to, string memory encryptedData) external returns (uint256)",
  "function getReceiptData(uint256 tokenId) external view returns (string memory)",
  "function getTokenMetadata(uint256 tokenId) external view returns (uint256 mintTimestamp, address minter, string memory encryptedData)",
  "function getTokensForAddress(address addr) external view returns (uint256[] memory)"
];

export class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;
  private wallet: ethers.Wallet;
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the blockchain service with the necessary configuration
   */
  private initialize(): boolean {
    try {
      // Check for required environment variables
      const rpcUrl = process.env.POLYGON_MUMBAI_RPC_URL;
      const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
      const contractAddress = process.env.RECEIPT_NFT_CONTRACT_ADDRESS;
      
      if (!rpcUrl || !privateKey || !contractAddress) {
        console.warn('Blockchain service not configured: Missing environment variables');
        return false;
      }
      
      // Setup provider, wallet and contract
      this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      this.contract = new ethers.Contract(
        contractAddress,
        RECEIPT_NFT_ABI,
        this.wallet
      );
      
      this.initialized = true;
      return true;
    } catch (e) {
      console.error('Failed to initialize blockchain service:', e);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Check if blockchain integration is available
   */
  isAvailable(): boolean {
    return this.initialized;
  }

  /**
   * Encrypt receipt data
   * @param receiptData Receipt data to encrypt
   * @returns Encrypted data and key
   */
  async encryptReceiptData(receiptData: any): Promise<{ encryptedData: string, encryptionKey: string }> {
    // Generate a random encryption key
    const encryptionKey = CryptoJS.lib.WordArray.random(16).toString();
    
    // Encrypt the data with AES
    const encryptedData = CryptoJS.AES.encrypt(
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
      // Decrypt the data
      const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      
      return JSON.parse(decryptedData);
    } catch (e) {
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
    txHash: string;
    tokenId: number;
    encryptionKey: string;
    blockNumber: number;
  }> {
    if (!this.initialized) {
      throw new Error('Blockchain service not initialized');
    }
    
    try {
      // Prepare receipt data for blockchain storage
      const receiptData = {
        id: receipt.id,
        date: receipt.date,
        total: receipt.total,
        merchant: receipt.merchantId,
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };
      
      // Encrypt the receipt data
      const { encryptedData, encryptionKey } = await this.encryptReceiptData(receiptData);
      
      // Mint the NFT
      const tx = await this.contract.mint(this.wallet.address, encryptedData);
      const receipt_tx = await tx.wait();
      
      // Get the token ID from the transaction events (implementation depends on contract)
      const tokenId = receipt_tx.events[0].args[3].toNumber(); // Adjust based on actual event structure
      
      return {
        txHash: tx.hash,
        tokenId,
        encryptionKey,
        blockNumber: receipt_tx.blockNumber
      };
    } catch (e) {
      console.error('Error minting receipt NFT:', e);
      throw new Error(`Failed to mint receipt NFT: ${e.message}`);
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
    mintTimestamp?: number;
    minter?: string;
    encryptedData?: string;
    error?: string;
  }> {
    if (!this.initialized) {
      return { verified: false, error: 'Blockchain service not initialized' };
    }
    
    try {
      // Get token metadata from the contract
      const [mintTimestamp, minter, encryptedData] = await this.contract.getTokenMetadata(tokenId);
      
      return {
        verified: true,
        mintTimestamp: mintTimestamp.toNumber(),
        minter,
        encryptedData
      };
    } catch (e) {
      return {
        verified: false,
        error: `Failed to verify receipt: ${e.message}`
      };
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
    if (!this.initialized) {
      throw new Error('Blockchain service not initialized');
    }
    
    const network = await this.provider.getNetwork();
    let networkName;
    
    switch (network.chainId) {
      case 80001:
        networkName = 'Polygon Mumbai';
        break;
      case 137:
        networkName = 'Polygon Mainnet';
        break;
      default:
        networkName = network.name;
    }
    
    return {
      networkName,
      chainId: network.chainId,
      contractAddress: this.contract.address
    };
  }
}

export const blockchainService = new BlockchainService();
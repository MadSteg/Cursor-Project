/**
 * Blockchain Service
 * 
 * This service handles interactions with the blockchain for receipt NFTs.
 * It uses ethers.js to interact with the ReceiptNFT smart contract.
 * Includes integration with IPFS for storing receipt data.
 */
import { ethers } from 'ethers';
import { Receipt, ReceiptItem } from '@shared/schema';
import { encryptJSON, decryptJSON } from '../utils/aes';
import { pinToIPFS, getFromIPFS } from '../utils/ipfs';

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
    // Use the AES utility to encrypt the data
    const { encrypted, key } = encryptJSON(receiptData);
    return { encryptedData: encrypted, encryptionKey: key };
  }

  /**
   * Decrypt receipt data
   * @param encryptedData Encrypted receipt data
   * @param encryptionKey Encryption key
   * @returns Decrypted receipt data
   */
  async decryptReceiptData(encryptedData: string, encryptionKey: string): Promise<any> {
    try {
      // Use the AES utility to decrypt the data
      return decryptJSON(encryptedData, encryptionKey);
    } catch (e) {
      throw new Error(`Failed to decrypt receipt data: ${e instanceof Error ? e.message : String(e)}`);
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
    ipfsCid?: string;
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
      
      // Pin encrypted data to IPFS
      let ipfsCid: string | undefined = undefined;
      try {
        ipfsCid = await pinToIPFS(encryptedData);
        console.log(`Receipt data pinned to IPFS with CID: ${ipfsCid}`);
      } catch (ipfsError) {
        console.warn('Failed to pin data to IPFS, continuing without IPFS storage:', ipfsError);
      }
      
      // Create URI for blockchain (either IPFS or direct encrypted data)
      const tokenURI = ipfsCid ? `ipfs://${ipfsCid}` : encryptedData;
      
      // Mint the NFT
      // We use '1' as the amount as each receipt is unique
      const tokenId = Date.now(); // Use timestamp as token ID for simplicity
      const tx = await this.contract.mint(this.wallet.address, tokenId, 1, tokenURI);
      const receipt_tx = await tx.wait();
      
      return {
        txHash: tx.hash,
        tokenId,
        encryptionKey,
        blockNumber: receipt_tx.blockNumber,
        ipfsCid
      };
    } catch (e: any) {
      console.error('Error minting receipt NFT:', e);
      throw new Error(`Failed to mint receipt NFT: ${e?.message || 'Unknown error'}`);
    }
  }

  /**
   * Verify a receipt on the blockchain
   * @param tokenId Token ID
   * @returns Verification status and metadata
   */
  async verifyReceipt(tokenId: number): Promise<{
    verified: boolean;
    mintTimestamp?: number;
    minter?: string;
    encryptedData?: string;
    ipfsCid?: string;
    ipfsUrl?: string;
    error?: string;
  }> {
    if (!this.initialized) {
      return { verified: false, error: 'Blockchain service not initialized' };
    }
    
    try {
      // Get token URI from the contract
      const tokenURI = await this.contract.uri(tokenId);
      let encryptedData: string;
      let ipfsCid: string | undefined;
      
      // Check if the URI is an IPFS link
      if (tokenURI.startsWith('ipfs://')) {
        ipfsCid = tokenURI.replace('ipfs://', '');
        try {
          // Fetch the data from IPFS
          encryptedData = await getFromIPFS(ipfsCid);
        } catch (ipfsError: any) {
          return {
            verified: false,
            error: `Failed to retrieve data from IPFS: ${ipfsError?.message || 'Unknown IPFS error'}`
          };
        }
      } else {
        // The URI contains the encrypted data directly
        encryptedData = tokenURI;
      }
      
      // For this implementation, we don't have mintTimestamp and minter in the contract,
      // but in a real implementation we would fetch these from the contract events
      const mintTimestamp = Math.floor(tokenId / 1000); // Approximate timestamp if we used Date.now()
      const minter = this.wallet.address;
      
      return {
        verified: true,
        mintTimestamp,
        minter,
        encryptedData,
        ipfsCid
      };
    } catch (e: any) {
      return {
        verified: false,
        error: `Failed to verify receipt: ${e?.message || 'Unknown error'}`
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
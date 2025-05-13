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

// ABI for the Receipt1155 contract
const RECEIPT_NFT_ABI = [
  // ERC1155 standard functions
  "function balanceOf(address account, uint256 id) external view returns (uint256)",
  "function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids) external view returns (uint256[] memory)",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address account, address operator) external view returns (bool)",
  "function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external",
  "function safeBatchTransferFrom(address from, address to, uint256[] calldata ids, uint256[] calldata amounts, bytes calldata data) external",
  
  // Custom functions from Receipt1155 contract
  "function mint(address to, uint256 skuId, uint256 amount, string calldata uri_) external",
  "function uri(uint256 skuId) public view returns (string memory)"
];

export class BlockchainService {
  private provider!: ethers.providers.JsonRpcProvider;
  private contract!: ethers.Contract;
  private wallet!: ethers.Wallet;
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
   * Encrypt receipt data using AES encryption
   * @param receiptData Receipt data to encrypt
   * @returns Encrypted data and key
   */
  async encryptReceiptData(receiptData: any): Promise<{ encryptedData: string, encryptionKey: string }> {
    // Use the AES utility to encrypt the data
    const { encrypted, key } = encryptJSON(receiptData);
    return { encryptedData: encrypted, encryptionKey: key };
  }

  /**
   * Decrypt receipt data using AES decryption
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
   * Mint a receipt as an NFT using the Receipt1155 contract
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
      // Format receipt data for blockchain storage
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
      
      // Encrypt the receipt data using our AES utility
      const { encrypted, key } = encryptJSON(receiptData);
      const encryptedData = encrypted;
      const encryptionKey = key;
      
      // Generate a unique token ID based on timestamp (in seconds)
      const tokenId = Math.floor(Date.now() / 1000);
      
      // Create metadata JSON
      const metadata = {
        name: `Receipt #${receipt.id} from ${receipt.merchantId}`,
        description: `Digital receipt for purchase on ${receipt.date}`,
        external_url: `https://receipt-chain.app/receipts/${receipt.id}`,
        image: "https://receipt-chain.app/images/receipt-placeholder.png",
        attributes: [
          { trait_type: "Amount", value: receipt.total },
          { trait_type: "Date", value: receipt.date },
          { trait_type: "Items", value: items.length }
        ],
        encrypted_data: encryptedData
      };
      
      // Convert metadata to string
      const metadataStr = JSON.stringify(metadata);
      
      // Try to store on IPFS (this is a fallback mechanism if direct storage fails)
      let ipfsCid: string | undefined = undefined;
      try {
        ipfsCid = await pinToIPFS(metadataStr);
        console.log(`Receipt metadata pinned to IPFS with CID: ${ipfsCid}`);
      } catch (ipfsError) {
        console.warn('Failed to pin data to IPFS, using direct data URI:', ipfsError);
      }
      
      // Create token URI (either IPFS or direct base64 encoding)
      const tokenURI = ipfsCid 
        ? `ipfs://${ipfsCid}` 
        : `data:application/json;base64,${Buffer.from(metadataStr).toString('base64')}`;
      
      console.log(`Minting NFT receipt with token ID ${tokenId}`);
      
      // Call the mint function on our Receipt1155 contract
      // Function signature: mint(address to, uint256 skuId, uint256 amount, string calldata uri_)
      const tx = await this.contract.mint(
        this.wallet.address,  // to: recipient of the NFT
        tokenId,             // skuId: our unique token ID
        1,                   // amount: always 1 for unique receipts
        tokenURI             // uri_: metadata URI
      );
      
      // Wait for transaction to be confirmed
      const receipt_tx = await tx.wait();
      console.log(`NFT minted successfully in transaction ${tx.hash}`);
      
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
   * Verify a receipt on the blockchain using the Receipt1155 contract
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
      console.log(`Verifying receipt token with ID: ${tokenId}`);
      
      // Check token exists by checking balance of contract creator (our wallet)
      const balance = await this.contract.balanceOf(this.wallet.address, tokenId);
      if (balance.eq(0)) {
        return { 
          verified: false, 
          error: `No token found with ID ${tokenId}` 
        };
      }
      
      // Get token URI from the contract (the uri() function from ERC1155)
      const tokenURI = await this.contract.uri(tokenId);
      console.log(`Retrieved token URI: ${tokenURI}`);
      
      let metadataJson: any;
      let ipfsCid: string | undefined;
      
      // Process the URI based on its format
      if (tokenURI.startsWith('ipfs://')) {
        // IPFS URI format
        ipfsCid = tokenURI.replace('ipfs://', '');
        try {
          // Fetch data from IPFS
          if (ipfsCid) {
            // ipfsCid is already checked in the if condition above
            const metadataStr = await getFromIPFS(ipfsCid as string);
            try {
              metadataJson = JSON.parse(metadataStr);
            } catch (parseError) {
              return {
                verified: true,
                mintTimestamp: Math.floor(tokenId), // Token ID is in seconds since epoch
                minter: this.wallet.address,
                encryptedData: metadataStr, // Return raw data if not JSON
                ipfsCid,
                ipfsUrl: `https://ipfs.io/ipfs/${ipfsCid}`
              };
            }
          } else {
            return {
              verified: false,
              error: "Missing IPFS CID"
            };
          }
        } catch (ipfsError: any) {
          return {
            verified: false,
            error: `Failed to retrieve data from IPFS: ${ipfsError?.message || 'Unknown IPFS error'}`
          };
        }
      } else if (tokenURI.startsWith('data:application/json;base64,')) {
        // Data URI with base64-encoded JSON
        try {
          const base64Data = tokenURI.replace('data:application/json;base64,', '');
          const jsonStr = Buffer.from(base64Data, 'base64').toString('utf8');
          metadataJson = JSON.parse(jsonStr);
        } catch (parseError: any) {
          return {
            verified: false,
            error: `Failed to parse token metadata: ${parseError?.message || 'Invalid data format'}`
          };
        }
      } else {
        // Unknown URI format
        return {
          verified: false,
          error: `Unsupported token URI format: ${tokenURI}`
        };
      }
      
      // Extract encrypted data from metadata
      const encryptedData = metadataJson.encrypted_data;
      if (!encryptedData) {
        return {
          verified: true,
          mintTimestamp: Math.floor(tokenId), // Token ID is in seconds since epoch
          minter: this.wallet.address,
          ipfsCid,
          ipfsUrl: ipfsCid ? `https://ipfs.io/ipfs/${ipfsCid}` : undefined,
          error: 'Metadata does not contain encrypted receipt data'
        };
      }
      
      return {
        verified: true,
        mintTimestamp: Math.floor(tokenId), // Token ID is in seconds since epoch
        minter: this.wallet.address,
        encryptedData,
        ipfsCid,
        ipfsUrl: ipfsCid ? `https://ipfs.io/ipfs/${ipfsCid}` : undefined
      };
    } catch (e: any) {
      console.error('Error verifying receipt:', e);
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
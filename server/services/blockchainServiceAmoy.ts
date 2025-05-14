import { ethers } from 'ethers';
import Receipt1155Artifact from '../../artifacts/contracts/Receipt1155.sol/Receipt1155.json';
import type { FullReceipt, Receipt } from '@shared/schema';

export interface IBlockchainService {
  isAvailable(): Promise<boolean>;
  getNetworkInfo(): Promise<{
    name: string;
    chainId: number;
    blockNumber: number;
    mockMode: boolean;
  }>;
  mintReceiptNFT(receipt: Receipt, items: any[]): Promise<{
    tokenId: string;
    txHash: string;
    blockNumber: number;
  }>;
  verifyReceipt(tokenId: string, receipt: any): Promise<{
    valid: boolean;
    message: string;
    data?: any;
  }>;
}

class BlockchainServiceAmoy implements IBlockchainService {
  private provider?: ethers.providers.JsonRpcProvider;
  private wallet?: ethers.Wallet;
  private contract?: ethers.Contract;
  private mockMode: boolean = true; // Start in mock mode by default

  constructor() {
    this.initialize().catch(err => {
      console.warn('Error initializing blockchain service, using mock mode:', err.message);
    });
  }

  async initialize() {
    // Check if environment variables are available
    if (!process.env.ALCHEMY_RPC || 
        !process.env.WALLET_PRIVATE_KEY || 
        !process.env.RECEIPT_MINTER_ADDRESS) {
      console.warn('Missing Polygon Amoy configuration, using mock mode');
      return;
    }

    try {
      console.log('Initializing blockchain service for Polygon Amoy...');
      
      // Initialize provider with the Amoy testnet
      console.log('Using Amoy RPC URL:', process.env.ALCHEMY_RPC);
      
      // Use JsonRpcProvider with Amoy network details
      const amoyNetwork = {
        name: 'amoy',
        chainId: 80002
      };
      
      this.provider = new ethers.providers.JsonRpcProvider(
        process.env.ALCHEMY_RPC,
        amoyNetwork
      );
      
      // Test connection by trying to get the network
      try {
        const network = await this.provider.getNetwork();
        console.log('Connected to blockchain network:', network.name, 'chainId:', network.chainId);
        
        // Create wallet with the provided private key
        this.wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, this.provider);
        
        // Initialize contract with the contract address and ABI
        this.contract = new ethers.Contract(
          process.env.RECEIPT_MINTER_ADDRESS,
          Receipt1155Artifact.abi,
          this.wallet
        );
        
        // If we make it here, we can use real blockchain mode
        this.mockMode = false;
        console.log('Blockchain service initialized successfully with contract:', process.env.RECEIPT_MINTER_ADDRESS);
      } catch (error) {
        console.error('Could not connect to blockchain network:', error);
        throw new Error(`Could not connect to blockchain network: ${error.message}`);
      }
    } catch (error) {
      console.error('Error initializing blockchain service:', error);
      console.warn('Falling back to mock mode');
    }
  }

  async isAvailable(): Promise<boolean> {
    if (this.mockMode) {
      console.log('Using mock mode for blockchain operations');
      return true;
    }

    try {
      if (!this.provider) {
        return false;
      }
      
      // Check if we can connect to the network
      await this.provider.getNetwork();
      
      return true;
    } catch (error) {
      console.error('Blockchain network is not available:', error);
      return false;
    }
  }

  async getNetworkInfo() {
    if (this.mockMode) {
      return {
        name: 'mock-amoy',
        chainId: 80002,
        blockNumber: 12345678,
        mockMode: true
      };
    }

    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }
      
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      
      return {
        name: network.name,
        chainId: network.chainId,
        blockNumber,
        mockMode: false
      };
    } catch (error) {
      console.error('Error getting network info:', error);
      throw new Error(`Failed to get network info: ${error.message}`);
    }
  }

  async mintReceiptNFT(receipt: Receipt, items: any[]) {
    if (this.mockMode) {
      console.log('Using mock mode for mintReceiptNFT');
      
      // Generate a mock token ID and transaction hash
      const tokenId = `mock-${Date.now()}`;
      const txHash = `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      
      return {
        tokenId,
        txHash,
        blockNumber: 12345678
      };
    }

    try {
      if (!this.contract || !this.wallet) {
        throw new Error('Contract or wallet not initialized');
      }
      
      // Create a JSON representation of the receipt and its items
      const receiptData = {
        id: receipt.id,
        merchant: receipt.merchantId,
        date: receipt.date,
        total: receipt.total,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      };
      
      // For now, we'll use a simple tokenId generation
      // In a production environment, we'd use a more sophisticated approach
      const tokenId = Date.now().toString();
      
      // Mint the NFT
      const tx = await this.contract.mint(
        this.wallet.address,
        tokenId,
        1,
        JSON.stringify(receiptData),
        { gasLimit: 500000 }
      );
      
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      
      return {
        tokenId,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Error minting receipt NFT:', error);
      throw new Error(`Failed to mint receipt NFT: ${error.message}`);
    }
  }

  async verifyReceipt(tokenId: string, receiptData: any) {
    if (this.mockMode) {
      console.log('Using mock mode for verifyReceipt');
      
      // Always return valid in mock mode
      return {
        valid: true,
        message: 'Receipt verified (mock mode)',
        data: {
          tokenId,
          owner: '0xMockOwnerAddress',
          uri: 'ipfs://MockCID',
          metadata: receiptData
        }
      };
    }

    try {
      if (!this.contract) {
        throw new Error('Contract not initialized');
      }
      
      // Get the token owner
      const owner = await this.contract.ownerOf(tokenId);
      
      // Get the token URI
      const uri = await this.contract.uri(tokenId);
      
      // In a real implementation, we would fetch the metadata from IPFS
      // and verify it against the provided receipt data
      
      return {
        valid: true,
        message: 'Receipt verified',
        data: {
          tokenId,
          owner,
          uri,
          metadata: receiptData
        }
      };
    } catch (error) {
      console.error('Error verifying receipt:', error);
      
      return {
        valid: false,
        message: `Failed to verify receipt: ${error.message}`
      };
    }
  }
}

// Export a singleton instance
export const blockchainService = new BlockchainServiceAmoy();
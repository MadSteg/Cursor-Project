import { ethers } from 'ethers';
import crypto from 'crypto';
import { FullReceipt } from '@shared/schema';
// We'll load the artifact dynamically once compiled
let Receipt1155Artifact: any = { 
  abi: [
    // Minimal ABI for minting receipts
    {
      "inputs": [
        { "internalType": "address", "name": "to", "type": "address" },
        { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
        { "internalType": "bytes32", "name": "receiptHash", "type": "bytes32" },
        { "internalType": "string", "name": "uri_", "type": "string" }
      ],
      "name": "mintReceipt",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
      ],
      "name": "uri",
      "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
        { "internalType": "bytes32", "name": "hash", "type": "bytes32" }
      ],
      "name": "verifyReceiptHash",
      "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
      ],
      "name": "getReceiptHash",
      "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "account", "type": "address" },
        { "internalType": "uint256", "name": "id", "type": "uint256" }
      ],
      "name": "balanceOf",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    }
  ]
};

export interface IBlockchainService {
  createReceiptHash(receipt: FullReceipt): string;
  mintReceipt(receipt: FullReceipt): Promise<any>;
  verifyReceipt(tokenId: string, receipt: FullReceipt): Promise<any>;
  getNetworkStatus(): Promise<any>;
}

class BlockchainService implements IBlockchainService {
  private provider?: ethers.providers.JsonRpcProvider;
  private wallet?: ethers.Wallet;
  private contract?: ethers.Contract;
  private mockMode: boolean = false;

  constructor() {
    // Check if environment variables are available
    if (!process.env.POLYGON_MUMBAI_RPC_URL || 
        !process.env.BLOCKCHAIN_PRIVATE_KEY || 
        !process.env.RECEIPT_NFT_CONTRACT_ADDRESS) {
      console.warn('Blockchain environment variables not found, running in mock mode');
      this.mockMode = true;
      return;
    }

    try {
      this.provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_MUMBAI_RPC_URL);
      this.wallet = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, this.provider);
      this.contract = new ethers.Contract(
        process.env.RECEIPT_NFT_CONTRACT_ADDRESS,
        Receipt1155Artifact.abi,
        this.wallet
      );
    } catch (error) {
      console.error('Error initializing blockchain service:', error);
      this.mockMode = true;
    }
  }

  createReceiptHash(receipt: FullReceipt): string {
    // Create a deterministic hash of the receipt data 
    const receiptData = {
      id: receipt.id,
      merchant: receipt.merchant.name,
      date: receipt.date.toISOString(),
      total: receipt.total,
      items: receipt.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    };
    
    // Convert the receipt data to a string and hash it
    const dataString = JSON.stringify(receiptData);
    return '0x' + crypto.createHash('sha256').update(dataString).digest('hex');
  }

  async mintReceipt(receipt: FullReceipt): Promise<any> {
    if (this.mockMode) {
      return this.mockMintReceipt(receipt);
    }

    try {
      const receiptHash = this.createReceiptHash(receipt);
      const tokenId = Date.now(); // Simple token ID generation
      
      // IPFS metadata would go here in a real implementation
      const metadataUri = `ipfs://QmHash/${tokenId}`;
      
      // Convert receipt hash to bytes32
      const hashBytes = ethers.utils.arrayify(receiptHash);
      
      // Call the mintReceipt function on the contract
      const tx = await this.contract.mintReceipt(
        this.wallet.address,
        tokenId,
        ethers.utils.hexlify(hashBytes),
        metadataUri
      );
      
      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      
      return {
        success: true,
        receipt: {
          id: receipt.id,
          merchant: receipt.merchant.name,
          date: receipt.date,
          total: receipt.total,
          blockchain: {
            tokenId: tokenId.toString(),
            transactionHash: tx.hash,
            blockNumber: receipt.blockNumber,
            network: 'mumbai',
            receiptHash
          }
        }
      };
    } catch (error) {
      console.error('Error minting receipt on blockchain:', error);
      throw new Error(`Failed to mint receipt: ${error.message}`);
    }
  }

  async verifyReceipt(tokenId: string, receipt: FullReceipt): Promise<any> {
    if (this.mockMode) {
      return this.mockVerifyReceipt(tokenId, receipt);
    }

    try {
      // Calculate the expected hash
      const calculatedHash = this.createReceiptHash(receipt);
      const hashBytes = ethers.utils.arrayify(calculatedHash);
      
      // Get the stored hash from the contract
      const storedHash = await this.contract.getReceiptHash(tokenId);
      
      // Verify the hash
      const verified = await this.contract.verifyReceiptHash(tokenId, ethers.utils.hexlify(hashBytes));
      
      // Get token URI
      const uri = await this.contract.uri(tokenId);
      
      // Get the owner of the token
      const balance = await this.contract.balanceOf(this.wallet.address, tokenId);
      const owner = balance.gt(0) ? this.wallet.address : 'Unknown';
      
      return {
        success: true,
        verified,
        receipt: {
          id: receipt.id,
          merchant: receipt.merchant.name,
          date: receipt.date,
          total: receipt.total,
          blockchain: {
            tokenId,
            verified,
            uri,
            receiptHash: calculatedHash,
            storedHash: ethers.utils.hexlify(storedHash),
            owner
          }
        }
      };
    } catch (error) {
      console.error('Error verifying receipt on blockchain:', error);
      throw new Error(`Failed to verify receipt: ${error.message}`);
    }
  }

  async getNetworkStatus(): Promise<any> {
    if (this.mockMode) {
      return {
        available: true,
        network: 'mumbai-mock',
        chainId: 80001,
        contractAddress: '0x1111111111111111111111111111111111111111',
        walletAddress: '0x2222222222222222222222222222222222222222',
        mockMode: true
      };
    }

    try {
      const network = await this.provider.getNetwork();
      return {
        available: true,
        network: network.name,
        chainId: network.chainId,
        contractAddress: this.contract.address,
        walletAddress: this.wallet.address,
        mockMode: false
      };
    } catch (error) {
      console.error('Error getting blockchain network status:', error);
      throw new Error(`Failed to get network status: ${error.message}`);
    }
  }

  private mockMintReceipt(receipt: FullReceipt): any {
    // Generate mock transaction data
    const txHash = '0x' + Array.from({length: 12}, () => 
      Math.floor(Math.random() * 36).toString(36)).join('');
    
    const tokenId = Date.now();
    const blockNumber = 14000000 + Math.floor(Math.random() * 1000000);
    const encryptionKey = 'key-' + Array.from({length: 7}, () => 
      Math.floor(Math.random() * 36).toString(36)).join('');
    
    const ipfsCid = 'bafybei' + Array.from({length: 9}, () => 
      Math.floor(Math.random() * 36).toString(36)).join('');
    
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsCid}`;
    
    console.log(`✅ Mock transaction hash: ${txHash}`);
    console.log(`🔑 Mock token ID: ${tokenId}`);
    console.log(`📦 Mock IPFS CID: ${ipfsCid}`);
    
    return {
      success: true,
      message: 'Receipt minted using mock blockchain data',
      txHash,
      tokenId,
      blockNumber,
      encryptionKey,
      ipfsCid,
      ipfsUrl
    };
  }

  private mockVerifyReceipt(tokenId: string, receipt: FullReceipt): any {
    // In mock mode, just return success
    return {
      success: true,
      verified: true,
      receipt: {
        id: receipt.id,
        merchant: receipt.merchant.name,
        date: receipt.date,
        total: receipt.total,
        blockchain: {
          tokenId,
          verified: true,
          uri: `ipfs://QmHash/${tokenId}`,
          receiptHash: this.createReceiptHash(receipt),
          storedHash: this.createReceiptHash(receipt),
          owner: '0x2222222222222222222222222222222222222222',
          mockMode: true
        }
      }
    };
  }
}

export const blockchainService = new BlockchainService();
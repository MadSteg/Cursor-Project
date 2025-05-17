import { logger } from '../utils/logger';
import { blockchainEnhancedService } from '../services/blockchainEnhancedService';
import { stampService } from '../services/stampService';
import { mockBotWallet } from '../utils/mockBotWallet';
import { thresholdClient } from '../services/thresholdClient';
import { ipfsService } from '../services/ipfsService';

interface NFTPurchaseTask {
  id: string;
  tokenId?: string;
  receiptData: {
    merchantName: string;
    date: string;
    total: number;
    items?: Array<{
      name: string;
      price: number;
      quantity?: number;
      category?: string;
    }>;
    category?: string;
    subtotal?: number;
    tax?: number;
  };
  walletAddress: string;
  ipfsHash: string;
  metadataIpfsHash?: string;
  policyId?: string;
  encrypt?: boolean;
}

/**
 * Handler for NFT purchase tasks
 * This processes receipts and mints them as NFTs with passport stamps
 */
class NFTPurchaseHandler {
  constructor() {
    logger.info('NFT Bot using random wallet for testing only. No actual purchases will work!');
  }

  async processTask(task: NFTPurchaseTask): Promise<any> {
    try {
      logger.info(`Processing NFT purchase for receipt: ${task.id}, wallet: ${task.walletAddress}`);
      
      // 1. Generate the metadata IPFS URI if not already provided
      let metadataUri = task.metadataIpfsHash 
        ? `ipfs://${task.metadataIpfsHash}` 
        : await this.createMetadataUri(task);
      
      // 2. Generate a passport stamp for this receipt
      const stampUri = await this.generateStamp(task);
      
      // 3. Mint the NFT with receipt data, metadata, and stamp
      const mintResult = await blockchainEnhancedService.mintReceipt(
        task.receiptData,
        metadataUri,
        stampUri,
        task.walletAddress,
        !!task.encrypt,
        task.policyId || ''
      );
      
      logger.info(`NFT minted successfully: ${JSON.stringify(mintResult)}`);
      
      return {
        success: true,
        taskId: task.id,
        tokenId: mintResult.tokenId,
        stampUri,
        metadataUri,
        transactionHash: mintResult.transactionHash,
        walletAddress: task.walletAddress,
        merchantName: task.receiptData.merchantName,
        totalAmount: task.receiptData.total,
        encrypted: !!task.encrypt,
        policyId: task.policyId || '',
        mockMode: mintResult.mockMode
      };
    } catch (error) {
      logger.error(`Failed to process NFT purchase: ${error.message}`, error);
      return {
        success: false,
        taskId: task.id,
        error: error.message
      };
    }
  }

  /**
   * Create metadata URI for the NFT
   */
  private async createMetadataUri(task: NFTPurchaseTask): Promise<string> {
    try {
      // Prepare metadata object
      const metadata = {
        name: `${task.receiptData.merchantName} Receipt`,
        description: `Receipt from ${task.receiptData.merchantName} dated ${task.receiptData.date}`,
        image: `ipfs://${task.ipfsHash}`,
        attributes: [
          {
            trait_type: 'Merchant',
            value: task.receiptData.merchantName
          },
          {
            trait_type: 'Date',
            value: task.receiptData.date
          },
          {
            trait_type: 'Total',
            value: task.receiptData.total.toString()
          },
          {
            trait_type: 'Category',
            value: task.receiptData.category || 'Uncategorized'
          }
        ],
        properties: {
          receiptData: task.receiptData
        }
      };
      
      // Encrypt metadata if requested
      if (task.encrypt && task.policyId) {
        const encryptedData = await thresholdClient.encryptData(
          JSON.stringify(metadata),
          task.walletAddress,
          task.policyId
        );
        
        // Upload encrypted data
        const result = await ipfsService.pinJSON({
          encrypted: true,
          policyId: task.policyId,
          data: encryptedData
        });
        
        return `ipfs://${result.IpfsHash}`;
      }
      
      // Otherwise, upload plain metadata
      const result = await ipfsService.pinJSON(metadata);
      return `ipfs://${result.IpfsHash}`;
    } catch (error) {
      logger.error(`Failed to create metadata URI: ${error.message}`, error);
      throw error;
    }
  }

  /**
   * Generate a passport stamp for the receipt
   */
  private async generateStamp(task: NFTPurchaseTask): Promise<string> {
    try {
      // Check if we should generate a promotional stamp
      const isPromotional = !!task.receiptData.items?.some(item => 
        item.name?.toLowerCase().includes('promo') || 
        item.category?.toLowerCase().includes('promo')
      );
      
      // Generate stamp with StampService
      const stampUri = await stampService.generateStamp({
        merchantName: task.receiptData.merchantName,
        merchantLocation: task.receiptData.category === 'online' ? 'Online' : undefined,
        category: task.receiptData.category,
        date: new Date(task.receiptData.date),
        total: task.receiptData.total,
        isPromotional,
        tokenId: task.tokenId || task.id
      });
      
      return stampUri;
    } catch (error) {
      logger.error(`Failed to generate passport stamp: ${error.message}`, error);
      // Return default stamp URI if generation fails
      return 'ipfs://QmdefaultStampHash';
    }
  }

  /**
   * Get the bot wallet for testing
   */
  getBotWallet() {
    return mockBotWallet.getAddress();
  }
}

export const nftPurchaseHandler = new NFTPurchaseHandler();
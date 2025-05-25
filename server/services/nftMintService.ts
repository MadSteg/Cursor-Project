/**
 * NFT Minting Service for BlockReceipt.ai
 * 
 * This service handles the NFT minting process, including:
 * - Generating metadata
 * - Uploading to IPFS
 * - Minting NFTs on the blockchain
 * - Recording transactions
 */
import { amoyBlockchainService } from './amoyBlockchainService';
import { ipfsService } from './ipfsService';
import { tacoService } from './tacoService';
import { determineReceiptTier } from './ocrService';
import { logger } from '../utils/logger';

interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

interface ReceiptData {
  id: string;
  merchantName: string;
  date: string;
  total: number;
  subtotal?: number;
  tax?: number;
  items: ReceiptItem[];
  category?: string;
  confidence?: number;
  imagePath?: string;
}

interface MintOptions {
  encryptedMetadata?: boolean;
  wallet?: string;
  recipientPublicKey?: string;
}

class NFTMintService {
  /**
   * Generate NFT metadata for a receipt
   * @param receipt Receipt data
   * @returns Metadata object
   */
  generateMetadata(receipt: ReceiptData): any {
    const tier = determineReceiptTier(receipt.total);
    
    // Generate attributes based on receipt data
    const attributes = [
      {
        trait_type: 'Merchant',
        value: receipt.merchantName
      },
      {
        trait_type: 'Date',
        value: receipt.date
      },
      {
        trait_type: 'Total',
        value: receipt.total.toFixed(2),
        display_type: 'number'
      },
      {
        trait_type: 'Category',
        value: receipt.category || 'General'
      },
      {
        trait_type: 'Tier',
        value: tier.name
      }
    ];
    
    // Add item count if available
    if (receipt.items && receipt.items.length > 0) {
      attributes.push({
        trait_type: 'Items',
        value: receipt.items.length.toString(),
        display_type: 'number'
      });
    }
    
    // Generate enriched metadata object with enhanced schema
    return {
      name: `${receipt.merchantName} Receipt - ${receipt.date}`,
      description: `Digital receipt from ${receipt.merchantName} for $${receipt.total.toFixed(2)}`,
      image: receipt.imagePath ? `ipfs://${receipt.imagePath}` : 'https://blockreceipt.ai/default-receipt.png',
      external_url: `https://blockreceipt.ai/receipts/${receipt.id}`,
      
      // Enhanced metadata fields
      merchant: receipt.merchantName,
      purchaseDate: new Date(receipt.date).toISOString(),
      totalAmount: receipt.total.toFixed(2),
      currency: 'USD',
      items: receipt.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price.toFixed(2)
      })),
      
      // Traditional NFT attributes for marketplaces
      attributes,
      
      // Additional properties for BlockReceipt features
      properties: {
        merchant: receipt.merchantName,
        date: receipt.date,
        total: receipt.total,
        subtotal: receipt.subtotal,
        tax: receipt.tax,
        category: receipt.category || 'General',
        tier: tier.id,
        benefits: tier.benefits,
        confidence: receipt.confidence
      }
    };
  }
  
  /**
   * Mint an NFT for a receipt
   * @param receipt Receipt data
   * @param options Minting options
   * @returns Minting result
   */
  async mintReceiptNFT(receipt: ReceiptData, options: MintOptions = {}): Promise<any> {
    try {
      logger.info(`Starting NFT minting process for receipt ${receipt.id}`);
      
      // Generate metadata
      const metadata = this.generateMetadata(receipt);
      logger.info('Metadata generated successfully');
      
      // Upload metadata to IPFS
      logger.info('Uploading metadata to IPFS...');
      const metadataResult = await ipfsService.pinJSON(metadata);
      logger.info(`Metadata pinned to IPFS: ${metadataResult}`);
      
      // Determine if metadata should be encrypted
      let encryptedMetadata = null;
      if (options.encryptedMetadata && options.wallet && options.recipientPublicKey) {
        logger.info('Encrypting metadata with TaCo...');
        encryptedMetadata = await tacoService.encryptReceiptMetadata(
          receipt.items,
          options.wallet,
          options.recipientPublicKey
        );
        logger.info('Metadata encrypted successfully');
      }
      
      // Format wallet address if provided
      const walletAddress = options.wallet || '0x0000000000000000000000000000000000000000';
      
      // Mint NFT on blockchain
      logger.info(`Minting NFT for wallet ${walletAddress}...`);
      const mintResult = await amoyBlockchainService.mintReceipt(
        {
          id: receipt.id,
          merchant: { name: receipt.merchantName },
          date: new Date(receipt.date),
          total: receipt.total,
          items: receipt.items,
          category: receipt.category
        },
        walletAddress,
        metadataResult.cid || metadataResult
      );
      logger.info(`NFT minted successfully: ${JSON.stringify(mintResult)}`);
      
      // Log encryption event if metadata was encrypted
      if (encryptedMetadata && encryptedMetadata.available) {
        logger.info('Logging encryption event to blockchain...');
        await amoyBlockchainService.logEncryptionEvent(
          receipt.id,
          walletAddress,
          metadataResult.cid || metadataResult
        );
        logger.info('Encryption event logged successfully');
      }
      
      // Return successful result
      return {
        success: true,
        receipt: {
          id: receipt.id,
          merchant: receipt.merchantName,
          date: receipt.date,
          total: receipt.total
        },
        nft: {
          tokenId: mintResult.tokenId,
          metadataUri: `ipfs://${metadataResult.cid || metadataResult}`,
          transaction: mintResult.transaction,
          tier: determineReceiptTier(receipt.total).id
        },
        encryption: encryptedMetadata?.available
          ? { available: true, publicKey: options.recipientPublicKey }
          : { available: false }
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Error minting NFT: ${errorMessage}`);
      throw new Error(`Failed to mint NFT: ${errorMessage}`);
    }
  }
  
  /**
   * Get NFT details for a specific token ID
   * @param tokenId Token ID to retrieve
   * @returns NFT details
   */
  async getNFTDetails(tokenId: string): Promise<any> {
    try {
      // For now, this is a mock implementation
      // In a real implementation, we would query the blockchain
      return {
        tokenId,
        metadataUri: `ipfs://mock-uri-${tokenId}`,
        owner: '0x0000000000000000000000000000000000000000',
        tier: 'silver',
        minted: new Date().toISOString()
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Error getting NFT details: ${errorMessage}`);
      throw new Error(`Failed to get NFT details: ${errorMessage}`);
    }
  }
}

// Export a singleton instance
export const nftMintService = new NFTMintService();
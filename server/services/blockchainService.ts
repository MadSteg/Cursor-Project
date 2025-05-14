/**
 * Legacy Mumbai blockchain service - DISABLED
 * 
 * This service has been disabled in favor of the Amoy blockchain service.
 * The code here exists only to satisfy imports, but does not actually initialize
 * a connection to the Mumbai network.
 */
import { FullReceipt } from '@shared/schema';

export interface IBlockchainService {
  createReceiptHash(receipt: FullReceipt): string;
  mintReceipt(receipt: FullReceipt): Promise<any>;
  verifyReceipt(tokenId: string, receipt: FullReceipt): Promise<any>;
  getNetworkStatus(): Promise<any>;
}

class BlockchainService implements IBlockchainService {
  private mockMode: boolean = true;

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
    
    // Return a dummy hash - this service is disabled
    return '0x0000000000000000000000000000000000000000000000000000000000000000';
  }

  async mintReceipt(receipt: FullReceipt): Promise<any> {
    return this.mockMintReceipt(receipt);
  }

  async verifyReceipt(tokenId: string, receipt: FullReceipt): Promise<any> {
    return this.mockVerifyReceipt(tokenId, receipt);
  }

  async getNetworkStatus(): Promise<any> {
    return {
      available: false,
      network: 'mumbai-disabled',
      chainId: 80001,
      contractAddress: '0x0000000000000000000000000000000000000000',
      walletAddress: '0x0000000000000000000000000000000000000000',
      mockMode: true,
      message: 'Mumbai network has been disabled. Please use Amoy network.'
    };
  }

  private mockMintReceipt(receipt: FullReceipt): any {
    return {
      success: false,
      message: 'Mumbai network has been disabled. Please use Amoy network.',
      mockMode: true
    };
  }

  private mockVerifyReceipt(tokenId: string, receipt: FullReceipt): any {
    return {
      verified: false,
      receipt: {
        id: receipt.id,
        blockchain: {
          tokenId,
          verified: false,
          mockMode: true,
          message: 'Mumbai network has been disabled. Please use Amoy network.'
        }
      }
    };
  }
}

export const blockchainService = new BlockchainService();
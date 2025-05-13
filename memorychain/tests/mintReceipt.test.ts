import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mintReceiptFromStripe } from '../src/services/mintReceipt.js';
import { ethers } from 'ethers';

// Mock ethers.js
vi.mock('ethers', () => {
  const mockContract = {
    mintReceipt: vi.fn().mockResolvedValue({
      hash: '0xmocktxhash',
      wait: vi.fn().mockResolvedValue({
        logs: [{ topics: ['0xtopic0', '0x0000000000000000000000000000000000000000000000000000000000000123'] }],
      }),
    }),
  };
  
  const mockWallet = {
    address: '0xMockWalletAddress',
  };
  
  return {
    isAddress: vi.fn().mockReturnValue(true),
    JsonRpcProvider: vi.fn().mockImplementation(() => ({
      // Provider methods
    })),
    Wallet: vi.fn().mockImplementation(() => mockWallet),
    Contract: vi.fn().mockImplementation(() => mockContract),
  };
});

// Mock IPFS client
vi.mock('ipfs-http-client', () => ({
  create: vi.fn().mockImplementation(() => ({
    add: vi.fn().mockResolvedValue({
      cid: {
        toString: vi.fn().mockReturnValue('mockcid'),
      },
    }),
  })),
}));

// Mock crypto for PAN hash
vi.mock('crypto', () => ({
  default: {
    createHash: vi.fn().mockImplementation(() => ({
      update: vi.fn().mockReturnThis(),
      digest: vi.fn().mockReturnValue(Buffer.from('mockhash')),
    })),
    randomBytes: vi.fn().mockImplementation((size) => Buffer.from('a'.repeat(size))),
    createCipheriv: vi.fn().mockImplementation(() => ({
      update: vi.fn().mockReturnValue(Buffer.from('mockencrypted')),
      final: vi.fn().mockReturnValue(Buffer.from('')),
    })),
  },
}));

describe('mintReceiptFromStripe Service', () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Set up environment variables
    process.env.ALCHEMY_RPC = 'https://mock-rpc-url.com';
    process.env.WALLET_PRIVATE_KEY = 'mockprivatekey';
    process.env.RECEIPT_MINTER_ADDRESS = '0xMockContractAddress';
    process.env.IPFS_PROJECT_ID = 'mockipfsid';
    process.env.IPFS_PROJECT_SECRET = 'mockipfssecret';
  });
  
  it('should validate inputs and throw error if invalid', async () => {
    // Mock ethers.isAddress to return false for this test
    vi.mocked(ethers.isAddress).mockReturnValueOnce(false);
    
    await expect(mintReceiptFromStripe(
      { paymentIntentId: 'pi_123' },
      'invalid-address'
    )).rejects.toThrow('Invalid customer wallet address');
  });
  
  it('should throw error if blockchain config missing', async () => {
    // Remove environment variables
    delete process.env.ALCHEMY_RPC;
    
    await expect(mintReceiptFromStripe(
      { paymentIntentId: 'pi_123' },
      '0xValidAddress'
    )).rejects.toThrow('Missing blockchain configuration');
  });
  
  it('should successfully mint a receipt NFT', async () => {
    const paymentData = {
      paymentIntentId: 'pi_123456',
      amountReceived: 10.00,
      currency: 'usd',
      customerEmail: 'test@example.com',
      lineItems: [
        {
          id: 'li_123',
          description: 'Test Product',
          amount: 10.00,
          currency: 'usd',
          quantity: 1,
        },
      ],
      timestamp: new Date().toISOString(),
      metadata: {
        walletAddress: '0xCustomerAddress',
      },
    };
    
    const result = await mintReceiptFromStripe(paymentData, '0xCustomerAddress');
    
    expect(result).toEqual({
      txHash: '0xmocktxhash',
      tokenId: 291, // 0x123 in decimal
      ipfsUrl: 'https://ipfs.io/ipfs/mockcid',
    });
  });
});
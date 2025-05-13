import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import verifyRoutes from '../src/routes/verify.js';
import { ethers } from 'ethers';

// Mock ethers.js
vi.mock('ethers', () => {
  const mockContract = {
    getFullReceiptData: vi.fn().mockResolvedValue({
      truncatedPanHash: '0xpanhashmocked',
      metadataCid: '0x6d6f636b636964000000000000000000',
      recipient: '0xMockRecipientAddress',
      timestamp: Math.floor(Date.now() / 1000),
    }),
  };
  
  return {
    JsonRpcProvider: vi.fn().mockImplementation(() => ({
      // Provider methods
    })),
    Contract: vi.fn().mockImplementation(() => mockContract),
  };
});

// Mock IPFS client
vi.mock('ipfs-http-client', () => {
  const mockIpfsData = Buffer.from(JSON.stringify({
    encryptedData: 'mockencrypteddata',
    items: [{ description: 'Test Item', price: 10.99 }]
  }));
  
  return {
    create: vi.fn().mockImplementation(() => ({
      cat: vi.fn().mockImplementation(function* () {
        yield mockIpfsData;
      }),
    })),
  };
});

// Mock file system
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn().mockReturnValue(true),
    readFileSync: vi.fn().mockReturnValue(JSON.stringify({ abi: [] })),
  },
}));

describe('Receipt Verification Endpoint', () => {
  let app: express.Express;
  const VALID_VENDOR_KEY = 'valid-vendor-key';
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Set up environment variables
    process.env.ALCHEMY_RPC = 'https://mock-rpc-url.com';
    process.env.RECEIPT_MINTER_ADDRESS = '0xMockContractAddress';
    process.env.VENDOR_PUBLIC_KEY = VALID_VENDOR_KEY;
    
    // Create a new Express app for each test
    app = express();
    app.use(express.json());
    app.use('/verify', verifyRoutes);
  });
  
  it('should return 400 for invalid token ID', async () => {
    const response = await supertest(app)
      .get('/verify/invalid-id');
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid token ID');
  });
  
  it('should return 500 if blockchain configuration missing', async () => {
    // Remove environment variables
    delete process.env.ALCHEMY_RPC;
    
    const response = await supertest(app)
      .get('/verify/123');
    
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Blockchain configuration not available');
  });
  
  it('should return limited data if no vendor key provided', async () => {
    const response = await supertest(app)
      .get('/verify/123');
    
    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(true);
    expect(response.body.tokenId).toBe(123);
    expect(response.body.decrypted).toBe(false);
    expect(response.body.message).toContain('Vendor key required');
  });
  
  it('should return 401 for invalid vendor key', async () => {
    const response = await supertest(app)
      .get('/verify/123')
      .set('x-vendor-key', 'invalid-key');
    
    expect(response.status).toBe(401);
    expect(response.body.valid).toBe(false);
    expect(response.body.error).toBe('Unauthorized vendor key');
  });
  
  it('should return full data for valid vendor key', async () => {
    const response = await supertest(app)
      .get('/verify/123')
      .set('x-vendor-key', VALID_VENDOR_KEY);
    
    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(true);
    expect(response.body.tokenId).toBe(123);
    expect(response.body.decrypted).toBe(true);
    expect(response.body.details).toBeDefined();
  });
});
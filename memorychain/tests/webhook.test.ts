import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import Stripe from 'stripe';
import webhookRoutes from '../src/routes/webhooks.js';

// Mock the stripe module
vi.mock('stripe', () => {
  const Stripe = vi.fn();
  Stripe.prototype.webhooks = {
    constructEvent: vi.fn(),
  };
  Stripe.prototype.customers = {
    retrieve: vi.fn(),
  };
  Stripe.prototype.invoices = {
    retrieve: vi.fn(),
  };
  return { default: Stripe };
});

// Mock mintReceiptFromStripe service
vi.mock('../src/services/mintReceipt.js', () => ({
  mintReceiptFromStripe: vi.fn().mockResolvedValue({
    txHash: '0x1234',
    tokenId: 1,
    ipfsUrl: 'https://ipfs.io/ipfs/test-cid',
  }),
}));

describe('Stripe Webhook Handler', () => {
  let app: express.Express;
  let mockStripe: any;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup mock environment variables
    process.env.STRIPE_WEBHOOK_SECRET = 'test_webhook_secret';
    
    // Create a new Express app for each test
    app = express();
    app.use(express.json());
    app.use('/webhook', webhookRoutes);
    
    // Get the mocked Stripe instance
    mockStripe = new Stripe('test_key', { apiVersion: '2023-10-16' });
  });
  
  it('should return 400 if no signature is provided', async () => {
    const response = await supertest(app)
      .post('/webhook/stripe')
      .send({ type: 'payment_intent.succeeded' });
    
    expect(response.status).toBe(400);
    expect(response.text).toContain('No Stripe signature');
  });
  
  it('should return 400 if signature verification fails', async () => {
    // Setup mock to throw an error during signature verification
    mockStripe.webhooks.constructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });
    
    const response = await supertest(app)
      .post('/webhook/stripe')
      .set('stripe-signature', 'test_signature')
      .send({ type: 'payment_intent.succeeded' });
    
    expect(response.status).toBe(400);
    expect(response.text).toContain('Invalid signature');
    expect(mockStripe.webhooks.constructEvent).toHaveBeenCalledWith(
      expect.anything(),
      'test_signature',
      'test_webhook_secret'
    );
  });
  
  it('should process payment_intent.succeeded events', async () => {
    // Setup mocks for successful flow
    const mockEvent = {
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_123456',
          amount_received: 1000, // $10.00
          currency: 'usd',
          customer: 'cus_123456',
          metadata: {
            walletAddress: '0x1234567890abcdef',
          },
        },
      },
    };
    
    mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
    mockStripe.customers.retrieve.mockResolvedValue({
      id: 'cus_123456',
      email: 'test@example.com',
    });
    
    mockStripe.invoices.retrieve.mockResolvedValue({
      lines: {
        data: [
          {
            id: 'il_123',
            description: 'Test Product',
            price: {
              id: 'price_123',
              unit_amount: 1000,
              currency: 'usd',
            },
            quantity: 1,
            currency: 'usd',
          },
        ],
      },
    });
    
    const response = await supertest(app)
      .post('/webhook/stripe')
      .set('stripe-signature', 'test_signature')
      .send(mockEvent);
    
    expect(response.status).toBe(200);
    expect(response.body.received).toBe(true);
    expect(response.body.processed).toBeDefined();
    expect(response.body.processed.paymentIntentId).toBe('pi_123456');
    expect(response.body.processed.amountReceived).toBe(10);
    expect(response.body.processed.currency).toBe('usd');
  });
  
  it('should acknowledge non-payment_intent.succeeded events without processing', async () => {
    const mockEvent = {
      type: 'checkout.session.completed',
      data: { object: {} },
    };
    
    mockStripe.webhooks.constructEvent.mockReturnValue(mockEvent);
    
    const response = await supertest(app)
      .post('/webhook/stripe')
      .set('stripe-signature', 'test_signature')
      .send(mockEvent);
    
    expect(response.status).toBe(200);
    expect(response.body.received).toBe(true);
    expect(response.body.type).toBe('checkout.session.completed');
  });
});
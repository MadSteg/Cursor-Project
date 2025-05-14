/**
 * Stripe Payment API Routes
 * Handles payment processing for the application
 */
import { Router, Request, Response } from 'express';
import { stripeService } from '../services/stripeService';
import { storage } from '../storage';
import { z } from 'zod';

const router = Router();

// Payment request validation schema
const paymentRequestSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().optional().default('usd'),
  metadata: z.record(z.string()).optional().default({}),
  receiptId: z.number().optional() // Optional receipt ID to associate with payment
});

/**
 * GET /api/payments/status
 * Get Stripe integration status
 */
router.get('/status', async (req: Request, res: Response) => {
  const status = await stripeService.isAvailable();
  res.json(status);
});

/**
 * POST /api/payments/create-intent
 * Create a payment intent for a purchase
 */
router.post('/create-intent', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = paymentRequestSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validation.error.format()
      });
    }
    
    const { amount, currency, metadata, receiptId } = validation.data;
    
    // If receipt ID provided, verify it exists and belongs to user
    if (receiptId) {
      const receipt = await storage.getReceipt(receiptId);
      
      if (!receipt) {
        return res.status(404).json({
          success: false,
          error: 'Receipt not found'
        });
      }
      
      // Associate payment with receipt in metadata
      metadata.receiptId = receiptId.toString();
    }
    
    // Create payment intent
    const paymentIntent = await stripeService.createPaymentIntent(amount, currency, metadata);
    
    res.json(paymentIntent);
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment intent',
      message: error.message
    });
  }
});

/**
 * POST /api/payments/capture/:paymentIntentId
 * Capture a payment (for testing purposes)
 */
router.post('/capture/:paymentIntentId', async (req: Request, res: Response) => {
  try {
    const { paymentIntentId } = req.params;
    
    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        error: 'Payment intent ID is required'
      });
    }
    
    const captureResult = await stripeService.capturePayment(paymentIntentId);
    
    // If payment successful and has receipt ID in metadata, update receipt
    if (captureResult.success && req.body.receiptId) {
      const receiptId = parseInt(req.body.receiptId);
      
      if (!isNaN(receiptId)) {
        await storage.updateReceipt(receiptId, {
          paymentComplete: true,
          paymentMethod: 'stripe',
          paymentId: captureResult.paymentId
        });
      }
    }
    
    res.json(captureResult);
  } catch (error: any) {
    console.error('Error capturing payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to capture payment',
      message: error.message
    });
  }
});

/**
 * POST /api/payments/mock-payment
 * Create a mock payment for testing
 */
router.post('/mock-payment', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = paymentRequestSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validation.error.format()
      });
    }
    
    const { amount, currency, metadata, receiptId } = validation.data;
    
    // Create mock payment data
    const mockPayment = {
      success: true,
      mockMode: true,
      paymentId: `py_mock_${Math.random().toString(36).substring(2, 10)}`,
      amount: Math.round(amount * 100),
      currency,
      status: 'succeeded',
      receiptUrl: `https://receipt.stripe.com/mock/${Math.random().toString(36).substring(2, 10)}`
    };
    
    // If receipt ID provided, update receipt with payment info
    if (receiptId) {
      const receipt = await storage.getReceipt(receiptId);
      
      if (!receipt) {
        return res.status(404).json({
          success: false,
          error: 'Receipt not found'
        });
      }
      
      await storage.updateReceipt(receiptId, {
        paymentComplete: true,
        paymentMethod: 'stripe-mock',
        paymentId: mockPayment.paymentId
      });
    }
    
    res.json(mockPayment);
  } catch (error: any) {
    console.error('Error creating mock payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create mock payment',
      message: error.message
    });
  }
});

export default router;
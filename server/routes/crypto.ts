import { Router } from 'express';
import { cryptoPaymentService } from '../services/cryptoPaymentService';
import { z } from 'zod';
import { logger } from '../utils/logger';

const router = Router();

// Schema for creating a crypto payment intent
const createPaymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().optional().default('MATIC'),
});

// Schema for verifying a crypto payment
const verifyPaymentSchema = z.object({
  paymentId: z.string(),
  txHash: z.string(),
});

/**
 * Create a crypto payment intent
 */
router.post('/create-payment-intent', async (req, res) => {
  try {
    const validatedData = createPaymentIntentSchema.parse(req.body);
    
    const paymentIntent = await cryptoPaymentService.createPaymentIntent(
      validatedData.amount,
      validatedData.currency
    );
    
    res.json(paymentIntent);
  } catch (error) {
    logger.error('[crypto] Error creating payment intent:', error);
    res.status(400).json({ success: false, error: 'Invalid request data' });
  }
});

/**
 * Verify a crypto payment
 */
router.post('/verify-payment', async (req, res) => {
  try {
    const validatedData = verifyPaymentSchema.parse(req.body);
    
    const verification = await cryptoPaymentService.verifyPayment(
      validatedData.paymentId,
      validatedData.txHash
    );
    
    res.json(verification);
  } catch (error) {
    logger.error('[crypto] Error verifying payment:', error);
    res.status(400).json({ success: false, error: 'Invalid request data' });
  }
});

/**
 * Get transaction details
 */
router.get('/transaction/:txHash', async (req, res) => {
  try {
    const { txHash } = req.params;
    
    if (!txHash) {
      return res.status(400).json({ success: false, error: 'Transaction hash is required' });
    }
    
    const details = await cryptoPaymentService.getTransactionDetails(txHash);
    res.json(details);
  } catch (error) {
    logger.error('[crypto] Error getting transaction details:', error);
    res.status(500).json({ success: false, error: 'Failed to get transaction details' });
  }
});

export default router;
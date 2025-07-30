import { Router } from 'express';
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import { mintReceiptFromPayment } from '../services/nftMintService';

// Initialize Stripe with fallback for development
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_development';
const stripe = new Stripe(stripeSecretKey, { apiVersion: '2022-11-15' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy_secret_for_development';

const router = Router();

// Use raw body parser for webhooks
router.post('/', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  // Skip webhook processing in development if no real Stripe keys
  if (stripeSecretKey === 'sk_test_dummy_key_for_development') {
    console.log('Skipping Stripe webhook processing in development mode');
    return res.json({ received: true, development: true });
  }

  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`Received Stripe webhook: ${event.type}`);

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent;
    const metadata = intent.metadata;
    
    try {
      // Parse metadata from payment intent
      const items = metadata.items ? JSON.parse(metadata.items) : [];
      
      const receiptData = {
        merchantName: metadata.merchantName || 'Unknown Merchant',
        totalAmount: intent.amount_received / 100, // Convert from cents
        currency: intent.currency.toUpperCase(),
        items,
        walletAddress: metadata.walletAddress,
        paymentId: intent.id,
        customerEmail: metadata.customerEmail,
        date: new Date().toISOString(),
        category: metadata.category || 'General'
      };
      
      console.log('Minting receipt for successful payment:', {
        paymentId: intent.id,
        amount: receiptData.totalAmount,
        merchant: receiptData.merchantName
      });
      
      // Mint the NFT receipt
      const result = await mintReceiptFromPayment(receiptData);
      
      console.log('Successfully minted receipt NFT:', result);
      
      // Store the minting result for future reference
      if (result.success && result.tokenId) {
        console.log(`Receipt NFT minted with Token ID: ${result.tokenId}`);
      }
      
    } catch (err: any) {
      console.error('Failed to mint receipt for payment:', err);
      console.error('Payment intent ID:', intent.id);
    }
  }
  
  // Always respond with success to acknowledge receipt
  res.json({ received: true });
});

export default router;
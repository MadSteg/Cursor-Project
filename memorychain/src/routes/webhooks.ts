import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { mintReceiptFromStripe } from '../services/mintReceipt.js';

dotenv.config();

const router = express.Router();

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

/**
 * POST /webhook/stripe
 * Handles Stripe webhook events, particularly payment_intent.succeeded
 */
router.post('/stripe', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  
  if (!sig) {
    console.error('No Stripe signature found in request');
    return res.status(400).send('Webhook Error: No Stripe signature');
  }
  
  // Get the webhook secret from environment variables
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error('Stripe webhook secret not configured');
    return res.status(500).send('Webhook Error: Webhook secret not configured');
  }
  
  let event: Stripe.Event;
  
  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event based on its type
  if (event.type === 'payment_intent.succeeded') {
    try {
      // Extract payment intent from the event
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Get payment intent ID
      const paymentIntentId = paymentIntent.id;
      
      // Get basic payment information
      const amountReceived = paymentIntent.amount_received;
      const currency = paymentIntent.currency;
      
      // Get customer email (may need to fetch customer object)
      let customerEmail = '';
      if (paymentIntent.customer) {
        const customerObj = await stripe.customers.retrieve(
          paymentIntent.customer as string
        );
        if (!('deleted' in customerObj)) {
          customerEmail = customerObj.email || '';
        }
      }
      
      // Fetch line items from the associated invoice or checkout session
      let lineItems: Stripe.LineItem[] = [];
      if (paymentIntent.invoice) {
        const invoice = await stripe.invoices.retrieve(
          paymentIntent.invoice as string,
          { expand: ['lines'] }
        );
        // Convert invoice line items to regular line items
        lineItems = invoice.lines.data.map(item => ({
          id: item.id,
          description: item.description || '',
          price: {
            id: item.price?.id || '',
            unit_amount: item.price?.unit_amount || 0,
            currency: item.currency || ''
          },
          quantity: item.quantity || 1
        } as unknown as Stripe.LineItem));
      }
      
      // Normalize the payload for further processing
      const normalizedPayload = {
        paymentIntentId,
        amountReceived: amountReceived / 100, // Convert from cents to dollars
        currency,
        customerEmail,
        lineItems: lineItems.map(item => ({
          id: item.id,
          description: item.description || '',
          amount: (item.price?.unit_amount || 0) / 100, // Convert from cents
          currency: item.price?.currency || '',
          quantity: item.quantity || 1,
        })),
        timestamp: new Date().toISOString(),
        metadata: paymentIntent.metadata || {}
      };
      
      console.log(`Processed payment intent ${paymentIntentId}`);
      
      // If the wallet address is provided in the metadata, mint an NFT receipt
      if (normalizedPayload.metadata.walletAddress) {
        try {
          const mintResult = await mintReceiptFromStripe(
            normalizedPayload,
            normalizedPayload.metadata.walletAddress
          );
          console.log(`Minted NFT receipt for payment ${paymentIntentId}`, mintResult);
        } catch (mintError: any) {
          console.error(`Failed to mint NFT receipt: ${mintError.message}`, mintError);
          // We don't want to fail the webhook callback even if minting fails
        }
      } else {
        console.log(`No wallet address provided for payment ${paymentIntentId}, skipping NFT minting`);
      }
      
      // Acknowledge receipt of the event
      res.status(200).json({ received: true, processed: normalizedPayload });
    } catch (error: any) {
      console.error(`Error processing payment intent: ${error.message}`, error);
      // Still acknowledge receipt to prevent Stripe from retrying
      res.status(200).json({ received: true, error: error.message });
    }
  } else {
    // For other event types, just acknowledge receipt
    res.status(200).json({ received: true, type: event.type });
  }
});

export default router;
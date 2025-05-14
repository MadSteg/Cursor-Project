/**
 * Stripe Payment Service
 * Handles payment processing with Stripe
 */
import { log } from "../vite";
import crypto from "crypto";

// Mock mode is enabled when STRIPE_SECRET_KEY is not available
const MOCK_MODE = !process.env.STRIPE_SECRET_KEY;
let stripe: any;

// Only import Stripe if in real mode
if (!MOCK_MODE) {
  // Dynamic import to avoid errors when Stripe is not available
  import('stripe').then((Stripe) => {
    stripe = new Stripe.default(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    });
  });
}

/**
 * Initialize Stripe service
 */
export function initializeStripeService() {
  if (MOCK_MODE) {
    log("Missing Stripe secret key, using mock mode", "stripe");
  } else {
    log("Initializing Stripe payment service", "stripe");
  }
}

/**
 * Check if Stripe service is available
 */
export function isAvailable() {
  return {
    available: true,
    mockMode: MOCK_MODE,
    message: MOCK_MODE ? "Stripe is in mock mode (no secret key provided)" : "Stripe is available"
  };
}

/**
 * Create a payment intent with Stripe
 * In mock mode, creates a fake payment intent
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = "usd",
  metadata: Record<string, string> = {}
) {
  try {
    if (MOCK_MODE) {
      // Mock implementation for testing without Stripe
      const mockId = `mock_pi_${crypto.randomBytes(8).toString("hex")}`;
      const mockSecret = `mock_seti_${crypto.randomBytes(16).toString("hex")}`;
      
      log(`Created mock payment intent ${mockId} for $${amount}`, "stripe");
      
      return {
        success: true,
        mockMode: true,
        paymentIntentId: mockId,
        clientSecret: mockSecret,
        amount: amount,
        currency: currency,
        metadata
      };
    }
    
    // Real Stripe implementation
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency,
      metadata
    });
    
    return {
      success: true,
      mockMode: false,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      amount: amount,
      currency: currency,
      metadata
    };
  } catch (error: any) {
    log(`Error creating payment intent: ${error.message}`, "stripe");
    return {
      success: false,
      error: error.message,
      mockMode: MOCK_MODE
    };
  }
}

/**
 * Create a mock payment for testing
 */
export async function createMockPayment(
  amount: number,
  paymentMethod: string = "card",
  metadata: Record<string, string> = {}
) {
  try {
    // Generate mock payment data
    const paymentId = `mock_payment_${crypto.randomBytes(8).toString("hex")}`;
    const receiptUrl = `https://receipt.url/${paymentId}`;
    
    log(`Created mock payment ${paymentId} for $${amount}`, "stripe");
    
    return {
      success: true,
      mockMode: true,
      paymentId,
      amount,
      paymentMethod,
      receiptUrl,
      metadata
    };
  } catch (error: any) {
    log(`Error creating mock payment: ${error.message}`, "stripe");
    return {
      success: false,
      error: error.message,
      mockMode: true
    };
  }
}

/**
 * Retrieve a payment by ID
 */
export async function retrievePayment(paymentId: string) {
  try {
    if (MOCK_MODE || paymentId.startsWith('mock_')) {
      // Return mock data
      return {
        success: true,
        mockMode: true,
        paymentId,
        status: 'succeeded',
        amount: 0,
        currency: 'usd',
        receiptUrl: `https://receipt.url/${paymentId}`
      };
    }
    
    // Real implementation
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    
    return {
      success: true,
      mockMode: false,
      paymentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      receiptUrl: paymentIntent.charges?.data[0]?.receipt_url
    };
  } catch (error: any) {
    log(`Error retrieving payment ${paymentId}: ${error.message}`, "stripe");
    return {
      success: false,
      error: error.message,
      mockMode: MOCK_MODE
    };
  }
}
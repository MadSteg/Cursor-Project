/**
 * Stripe Payment Service
 * Handles integration with Stripe payment processing
 */
import Stripe from 'stripe';

class StripeService {
  private stripe: Stripe | null = null;
  private mockMode = false;
  private initialized = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the Stripe service
   */
  private initialize() {
    try {
      console.log('Initializing Stripe payment service...');
      const secretKey = process.env.STRIPE_SECRET_KEY;

      if (!secretKey) {
        console.warn('Missing Stripe secret key, using mock mode');
        this.mockMode = true;
        this.initialized = true;
        return;
      }

      this.stripe = new Stripe(secretKey, {
        apiVersion: '2023-10-16',
      });
      this.initialized = true;
      this.mockMode = false;
      console.log('Stripe payment service initialized successfully');
    } catch (error) {
      console.error('Error initializing Stripe service:', error);
      this.mockMode = true;
      this.initialized = true;
    }
  }

  /**
   * Check if the Stripe service is available
   */
  async isAvailable() {
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.mockMode) {
      return {
        available: true,
        mockMode: true,
        message: 'Running in mock mode. Stripe operations will be simulated.'
      };
    }

    try {
      // Attempt to make a simple API call to verify connectivity
      if (this.stripe) {
        const products = await this.stripe.products.list({ limit: 1 });
        return {
          available: true,
          mockMode: false,
          message: 'Connected to Stripe API'
        };
      }
      return {
        available: false,
        mockMode: true,
        message: 'Stripe API client not initialized'
      };
    } catch (error) {
      console.error('Error checking Stripe availability:', error);
      return {
        available: false,
        mockMode: true,
        message: 'Failed to connect to Stripe API'
      };
    }
  }

  /**
   * Create a payment intent
   * @param amount - Amount in dollars (will be converted to cents)
   * @param currency - Currency code (default: 'usd')
   * @param metadata - Optional metadata to attach to the payment
   */
  async createPaymentIntent(amount: number, currency = 'usd', metadata: Record<string, string> = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.mockMode) {
      // Generate a mock client secret
      const mockClientSecret = `pi_mock_${Math.random().toString(36).substring(2, 15)}_secret_${Math.random().toString(36).substring(2, 15)}`;
      
      return {
        success: true,
        clientSecret: mockClientSecret,
        mockMode: true,
        amount: Math.round(amount * 100),
        currency
      };
    }

    try {
      if (!this.stripe) {
        throw new Error('Stripe client not initialized');
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        mockMode: false,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      };
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      return {
        success: false,
        error: error.message,
        mockMode: false
      };
    }
  }

  /**
   * Capture a payment (for testing receipt generation)
   * @param paymentIntentId - Stripe payment intent ID
   */
  async capturePayment(paymentIntentId: string) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.mockMode) {
      return {
        success: true,
        mockMode: true,
        paymentId: `py_mock_${Math.random().toString(36).substring(2, 10)}`,
        amount: 2999,
        status: 'succeeded',
        receiptUrl: `https://receipt.stripe.com/mock/${Math.random().toString(36).substring(2, 10)}`
      };
    }

    try {
      if (!this.stripe) {
        throw new Error('Stripe client not initialized');
      }

      // Confirm and capture a payment intent
      const paymentIntent = await this.stripe.paymentIntents.capture(paymentIntentId);

      return {
        success: true,
        mockMode: false,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
        receiptUrl: paymentIntent.charges.data[0]?.receipt_url
      };
    } catch (error: any) {
      console.error('Error capturing payment:', error);
      return {
        success: false,
        error: error.message,
        mockMode: false
      };
    }
  }
}

export const stripeService = new StripeService();
/**
 * Payment utilities for the client
 */
import { apiRequest } from './queryClient';

/**
 * Check the status of the payment system
 */
export async function checkPaymentStatus() {
  try {
    const response = await apiRequest('GET', '/api/payments/status');
    return await response.json();
  } catch (error) {
    console.error('Error checking payment status:', error);
    return {
      available: false,
      mockMode: true,
      message: 'Error connecting to payment service'
    };
  }
}

/**
 * Create a payment intent
 * @param amount Amount in dollars
 * @param receiptId Optional receipt ID to associate with payment
 * @param metadata Additional metadata for the payment
 */
export async function createPaymentIntent(amount: number, receiptId?: number, metadata: Record<string, string> = {}) {
  try {
    const response = await apiRequest('POST', '/api/payments/create-intent', {
      amount,
      receiptId,
      metadata
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Create a mock payment for testing
 * @param amount Amount in dollars
 * @param receiptId Optional receipt ID to associate with payment
 */
export async function createMockPayment(amount: number, receiptId?: number) {
  try {
    const response = await apiRequest('POST', '/api/payments/mock-payment', {
      amount,
      receiptId
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating mock payment:', error);
    throw error;
  }
}

/**
 * Get payment information for a receipt
 * @param receiptId Receipt ID
 */
export async function getReceiptPaymentInfo(receiptId: number) {
  try {
    const response = await apiRequest('GET', `/api/receipts/${receiptId}`);
    const receipt = await response.json();
    
    // Extract payment-related fields
    const { 
      paymentComplete, 
      paymentMethod, 
      paymentId, 
      paymentAmount, 
      paymentCurrency,
      paymentDate,
      stripeReceiptUrl
    } = receipt;
    
    return {
      isComplete: paymentComplete === true,
      method: paymentMethod,
      id: paymentId,
      amount: paymentAmount,
      currency: paymentCurrency,
      date: paymentDate ? new Date(paymentDate) : null,
      receiptUrl: stripeReceiptUrl
    };
  } catch (error) {
    console.error('Error fetching receipt payment info:', error);
    throw error;
  }
}
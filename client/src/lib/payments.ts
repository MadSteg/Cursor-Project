/**
 * Payment utilities for interacting with the payment API
 */
import { apiRequest } from './queryClient';

/**
 * Check if payment service is available
 * @returns Promise with payment service status
 */
export async function checkPaymentStatus() {
  try {
    const response = await apiRequest('GET', '/api/payments/status');
    return await response.json();
  } catch (error) {
    console.error('Error checking payment status:', error);
    return { available: false, mockMode: false, error: (error as Error).message };
  }
}

/**
 * Create a payment intent
 * @param amount Amount to charge (in dollars)
 * @param receiptId Optional receipt ID to associate with payment
 * @param metadata Optional metadata to include with payment
 * @returns Promise with payment intent details
 */
export async function createPaymentIntent(
  amount: number, 
  receiptId?: number, 
  metadata: Record<string, string> = {}
) {
  try {
    const response = await apiRequest('POST', '/api/payments/create-intent', {
      amount,
      receiptId,
      metadata
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Create a mock payment (for testing without Stripe)
 * @param amount Amount to charge (in dollars)
 * @param receiptId Optional receipt ID to associate with payment
 * @param metadata Optional metadata to include with payment
 * @returns Promise with mock payment details
 */
export async function createMockPayment(
  amount: number, 
  receiptId?: number, 
  metadata: Record<string, string> = {}
) {
  try {
    const response = await apiRequest('POST', '/api/payments/mock-payment', {
      amount,
      receiptId,
      metadata
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating mock payment:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get payment details
 * @param paymentId Payment ID to retrieve
 * @returns Promise with payment details
 */
export async function getPaymentDetails(paymentId: string) {
  try {
    const response = await apiRequest('GET', `/api/payments/${paymentId}`);
    return await response.json();
  } catch (error) {
    console.error('Error retrieving payment details:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get payment information for a receipt
 * @param receiptId Receipt ID to check payment for
 * @returns Promise with payment status information
 */
export async function getReceiptPaymentInfo(receiptId: number) {
  try {
    const response = await apiRequest('GET', `/api/payments/receipt/${receiptId}`);
    return await response.json();
  } catch (error) {
    console.error('Error retrieving receipt payment info:', error);
    return { 
      isComplete: false, 
      error: (error as Error).message 
    };
  }
}
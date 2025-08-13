/**
 * Mock Payment Service
 * Simple mock implementation to replace Stripe functionality
 */

// Check if mock payment service is available
export const isAvailable = true;

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata: Record<string, string> = {}
) {
  const mockPaymentIntentId = `pi_mock_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
  const mockClientSecret = `${mockPaymentIntentId}_secret_${Math.floor(Math.random() * 1000000)}`;
  
  console.log(`Created mock payment intent: ${mockPaymentIntentId} for $${amount}`);
  
  return {
    success: true,
    clientSecret: mockClientSecret,
    paymentIntentId: mockPaymentIntentId,
    mockMode: true,
  };
}

export async function createMockPayment(
  amount: number,
  paymentMethod: string = 'card',
  metadata: Record<string, string> = {}
) {
  const mockPaymentId = `py_mock_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
  const mockReceiptUrl = `https://receipt.memorychain.example/mock/${mockPaymentId}`;
  
  console.log(`Created mock payment: ${mockPaymentId} for $${amount}`);
  
  return {
    success: true,
    paymentId: mockPaymentId,
    amount,
    currency: 'usd',
    status: 'succeeded',
    receiptUrl: mockReceiptUrl,
    mockMode: true,
  };
}

export async function retrievePayment(paymentId: string) {
  console.log(`Retrieving mock payment: ${paymentId}`);
  
  return {
    success: true,
    paymentId,
    amount: 25.00,
    currency: 'usd',
    status: 'succeeded',
    mockMode: true,
  };
} 
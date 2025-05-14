import { apiRequest } from './queryClient';

/**
 * Client-side service for interacting with crypto payments
 */
export const cryptoPaymentService = {
  /**
   * Create a crypto payment intent
   */
  async createPaymentIntent(amount: number, currency = 'MATIC') {
    try {
      const response = await apiRequest('POST', '/api/crypto/create-payment-intent', {
        amount,
        currency
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error creating crypto payment intent:', error);
      return {
        success: false,
        error: 'Failed to create payment intent'
      };
    }
  },

  /**
   * Verify a crypto payment transaction
   */
  async verifyPayment(paymentId: string, txHash: string) {
    try {
      const response = await apiRequest('POST', '/api/crypto/verify-payment', {
        paymentId,
        txHash
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error verifying crypto payment:', error);
      return {
        success: false,
        error: 'Failed to verify payment'
      };
    }
  },

  /**
   * Get details of a crypto transaction
   */
  async getTransactionDetails(txHash: string) {
    try {
      const response = await apiRequest('GET', `/api/crypto/transaction/${txHash}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting transaction details:', error);
      return {
        success: false,
        error: 'Failed to get transaction details'
      };
    }
  }
};

// Helper function to format crypto address (show first 6 and last 4 chars)
export const formatCryptoAddress = (address: string) => {
  if (!address || address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}; 

// Helper function to format amount with appropriate units
export const formatCryptoAmount = (amount: string | number, currency: string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  switch (currency.toUpperCase()) {
    case 'ETH':
    case 'MATIC':
      return `${numAmount.toFixed(6)} ${currency.toUpperCase()}`;
    case 'USDC':
    case 'USDT':
      return `${numAmount.toFixed(2)} ${currency.toUpperCase()}`;
    default:
      return `${numAmount} ${currency.toUpperCase()}`;
  }
};
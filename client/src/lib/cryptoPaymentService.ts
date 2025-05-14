/**
 * Client-side service for interacting with crypto payments
 */
import { apiRequest } from './queryClient';

// Define currency types and icons
export interface CryptoCurrency {
  code: string;
  name: string;
  network: string;
  enabled: boolean;
  icon?: string;
  color?: string;
}

// Interfaces for cryptocurrency payment responses

interface CryptoPaymentIntent {
  success: boolean;
  paymentId: string;
  paymentAddress: string;
  amount: number;
  currency: string;
  expiresAt: string;
  error?: string;
}

interface CryptoPaymentVerification {
  success: boolean;
  receipt?: {
    id: number;
    txHash: string;
    blockNumber: number;
    tokenId?: number | null;
  };
  error?: string;
}

interface TransactionDetails {
  txHash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  timestamp: number;
  status: 'success' | 'pending' | 'failed';
}

export const cryptoPaymentService = {
  /**
   * Get available cryptocurrencies
   */
  async getAvailableCurrencies(): Promise<CryptoCurrency[]> {
    try {
      const response = await apiRequest('GET', '/api/crypto/available-currencies');
      
      if (!response.ok) {
        return [
          { 
            code: 'MATIC', 
            name: 'Polygon MATIC', 
            network: 'polygon-mumbai',
            enabled: true,
            color: '#8247E5'
          }
        ];
      }
      
      const data = await response.json();
      
      // Add UI metadata to currencies
      const currencies = data.currencies.map((currency: CryptoCurrency) => {
        const uiData: Record<string, { color: string }> = {
          'MATIC': { color: '#8247E5' }, // Polygon purple
          'ETH': { color: '#627EEA' },   // Ethereum blue
          'BTC': { color: '#F7931A' },   // Bitcoin orange
          'USDC': { color: '#2775CA' }   // USDC blue
        };
        
        return {
          ...currency,
          color: uiData[currency.code]?.color || '#666666'
        };
      });
      
      return currencies;
    } catch (error) {
      console.error('Error getting available currencies:', error);
      // Fallback to MATIC
      return [
        { 
          code: 'MATIC', 
          name: 'Polygon MATIC', 
          network: 'polygon-mumbai',
          enabled: true,
          color: '#8247E5'
        }
      ];
    }
  },
  
  /**
   * Create a crypto payment intent
   */
  async createPaymentIntent(amount: number, currency = 'MATIC', metadata?: Record<string, string>): Promise<CryptoPaymentIntent> {
    try {
      const response = await apiRequest('POST', '/api/crypto/create-payment', {
        amount,
        currency,
        metadata
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          paymentId: '',
          paymentAddress: '',
          amount: 0,
          currency: '',
          expiresAt: '',
          error: errorData.message || 'Failed to create payment intent'
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        ...data
      };
    } catch (error: any) {
      console.error('Error creating crypto payment intent:', error);
      return {
        success: false,
        paymentId: '',
        paymentAddress: '',
        amount: 0,
        currency: '',
        expiresAt: '',
        error: error.message || 'An unexpected error occurred'
      };
    }
  },
  
  /**
   * Verify a crypto payment transaction
   */
  async verifyPayment(paymentId: string, txHash: string): Promise<CryptoPaymentVerification> {
    try {
      const response = await apiRequest('POST', '/api/crypto/verify-payment', {
        paymentId,
        txHash
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          error: errorData.message || 'Failed to verify payment'
        };
      }
      
      const data = await response.json();
      return {
        success: true,
        ...data
      };
    } catch (error: any) {
      console.error('Error verifying crypto payment:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred'
      };
    }
  },
  
  /**
   * Get details of a crypto transaction
   */
  async getTransactionDetails(txHash: string): Promise<TransactionDetails | null> {
    try {
      const response = await apiRequest('GET', `/api/crypto/transaction/${txHash}`);
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting transaction details:', error);
      return null;
    }
  },
  
  /**
   * Get payment status
   */
  async getPaymentStatus(paymentId: string): Promise<{status: 'pending' | 'completed' | 'expired' | 'failed', txHash?: string}> {
    try {
      const response = await apiRequest('GET', `/api/crypto/payment-status/${paymentId}`);
      
      if (!response.ok) {
        return { status: 'failed' };
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      return { status: 'failed' };
    }
  }
};

/**
 * Format a cryptocurrency address for display (show first 6 and last 4 characters)
 */
export const formatCryptoAddress = (address: string): string => {
  if (!address || address.length < 12) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Format a cryptocurrency amount for display
 */
export const formatCryptoAmount = (amount: string | number, currency: string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${numAmount.toFixed(6)} ${currency}`;
};
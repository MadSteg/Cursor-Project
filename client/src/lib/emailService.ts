import { apiRequest } from './queryClient';

export interface ReceiptEmailParams {
  to: string;
  productName: string;
  merchantName: string;
  receiptId: number;
  receiptNftId: string;
  transactionHash: string;
  walletAddress: string;
  tier: string;
  amount: number;
  ipfsHash?: string;
}

/**
 * Send an email with receipt details
 */
export async function sendReceiptEmail(params: ReceiptEmailParams): Promise<boolean> {
  try {
    const response = await apiRequest('POST', '/api/email/send-receipt', params);
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Failed to send receipt email:', error);
    return false;
  }
}
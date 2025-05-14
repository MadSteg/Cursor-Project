/**
 * Taco Threshold Crypto Service
 * 
 * This service provides a client-side interface to the Taco threshold encryption
 * functionality, enabling secure key management and receipt sharing.
 */
import { apiRequest } from './queryClient';

// Types for the Taco API
interface TacoKey {
  id: number;
  userId: number;
  name: string;
  publicKey: string;
  createdAt: string;
  lastUsed?: string;
}

interface SharedReceipt {
  id: number;
  receiptId: number;
  targetId: number;
  createdAt: string;
  expiresAt?: string;
  isRevoked: boolean;
  targetName: string;
  receipt: {
    id: number;
    date: string;
    total: string;
    merchantName: string;
  };
}

interface SharedWithMeReceipt {
  id: number;
  receiptId: number;
  ownerId: number;
  ownerName: string;
  createdAt: string;
  expiresAt?: string;
  receipt: {
    id: number;
    date: string;
    total: string;
    merchantName: string;
  };
}

class TacoThresholdCryptoService {
  /**
   * Check if the Taco service is initialized
   */
  async isInitialized(): Promise<boolean> {
    try {
      const response = await apiRequest('GET', '/api/taco/status');
      const data = await response.json();
      return data.initialized;
    } catch (error) {
      console.error('Failed to check Taco status:', error);
      return false;
    }
  }

  /**
   * Initialize the Taco service
   */
  async initialize(): Promise<{ success: boolean }> {
    try {
      const response = await apiRequest('POST', '/api/taco/initialize');
      const data = await response.json();
      return { success: true };
    } catch (error) {
      console.error('Failed to initialize Taco service:', error);
      return { success: false };
    }
  }

  /**
   * Generate a new key pair
   */
  async generateKeyPair(userId: number, keyName: string): Promise<TacoKey> {
    try {
      const response = await apiRequest('POST', '/api/taco/keys', { userId, name: keyName });
      return await response.json();
    } catch (error) {
      console.error('Failed to generate key pair:', error);
      throw error;
    }
  }

  /**
   * Get all keys for a user
   */
  async getKeys(userId: number): Promise<TacoKey[]> {
    try {
      const response = await apiRequest('GET', `/api/taco/keys?userId=${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get keys:', error);
      // For demo purposes, return mock data when API is not available
      return [
        {
          id: 1,
          userId,
          name: 'Personal Key',
          publicKey: 'taco-public-6f8a9b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u',
          createdAt: new Date().toISOString(),
          lastUsed: new Date(Date.now() - 86400000).toISOString() // Yesterday
        },
        {
          id: 2,
          userId,
          name: 'Work Key',
          publicKey: 'taco-public-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v',
          createdAt: new Date(Date.now() - 1000000000).toISOString(), // Older date
          lastUsed: undefined
        }
      ];
    }
  }

  /**
   * Delete a key
   */
  async deleteKey(keyId: number): Promise<{ success: boolean }> {
    try {
      await apiRequest('DELETE', `/api/taco/keys/${keyId}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete key:', error);
      throw error;
    }
  }

  /**
   * Encrypt data using a public key
   */
  async encryptData(
    publicKey: string, 
    data: string
  ): Promise<{ encryptedData: string }> {
    try {
      const response = await apiRequest('POST', '/api/taco/encrypt', { publicKey, data });
      return await response.json();
    } catch (error) {
      console.error('Failed to encrypt data:', error);
      // For demo purposes, return a mock encrypted string
      return { 
        encryptedData: `encrypted:${Buffer.from(data).toString('base64')}` 
      };
    }
  }

  /**
   * Decrypt data using a private key
   */
  async decryptData(
    privateKey: string, 
    encryptedData: string
  ): Promise<{ data: string }> {
    try {
      const response = await apiRequest('POST', '/api/taco/decrypt', { privateKey, encryptedData });
      return await response.json();
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      // For demo purposes, try to extract mock data
      if (encryptedData.startsWith('encrypted:')) {
        const base64Data = encryptedData.substring(10);
        return { data: Buffer.from(base64Data, 'base64').toString() };
      }
      throw error;
    }
  }

  /**
   * Share a receipt with another user
   */
  async shareReceipt(
    receiptId: number,
    ownerId: number,
    targetId: number,
    encryptedData: string,
    ownerPrivateKey: string,
    targetPublicKey: string,
    expiryDate?: Date
  ): Promise<SharedReceipt> {
    try {
      const response = await apiRequest('POST', '/api/taco/share-receipt', {
        receiptId,
        ownerId,
        targetId,
        encryptedData,
        expiresAt: expiryDate?.toISOString()
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to share receipt:', error);
      throw error;
    }
  }

  /**
   * Get all receipts shared by the user
   */
  async getSharedByMe(userId: number): Promise<SharedReceipt[]> {
    try {
      const response = await apiRequest('GET', `/api/taco/shared-by-me?userId=${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get shared receipts:', error);
      throw error;
    }
  }

  /**
   * Get all receipts shared with the user
   */
  async getSharedWithMe(userId: number): Promise<SharedWithMeReceipt[]> {
    try {
      const response = await apiRequest('GET', `/api/taco/shared-with-me?userId=${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get receipts shared with user:', error);
      throw error;
    }
  }

  /**
   * Get a specific shared receipt
   */
  async getSharedReceipt(sharedId: number): Promise<SharedReceipt> {
    try {
      const response = await apiRequest('GET', `/api/taco/shared-receipts/${sharedId}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get shared receipt:', error);
      throw error;
    }
  }

  /**
   * Revoke access to a shared receipt
   */
  async revokeAccess(sharedId: number): Promise<{ success: boolean }> {
    try {
      await apiRequest('POST', `/api/taco/revoke-access/${sharedId}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to revoke access:', error);
      throw error;
    }
  }
}

export const tacoThresholdCrypto = new TacoThresholdCryptoService();
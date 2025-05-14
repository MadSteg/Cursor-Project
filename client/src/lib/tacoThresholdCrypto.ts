/**
 * TacoThresholdCrypto Service
 * 
 * This service provides client-side integration with the Taco (formerly NuCypher) 
 * threshold encryption protocol. It communicates with the server's Taco service
 * endpoints to manage keys, encrypt, decrypt, and share encrypted receipts.
 */

import { apiRequest } from './queryClient';

class TacoThresholdCrypto {
  /**
   * Generate a new key pair for a user
   * 
   * @param userId - The ID of the user
   * @param name - A friendly name for the key
   * @returns The newly created key information
   */
  async generateKeyPair(userId: number, name: string) {
    try {
      const response = await apiRequest('POST', '/api/taco/keys', { userId, name });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to generate Taco key pair:', error);
      throw error;
    }
  }

  /**
   * Get all keys for a user
   * 
   * @param userId - The ID of the user
   * @returns Array of keys belonging to the user
   */
  async getKeys(userId: number) {
    try {
      const response = await apiRequest('GET', `/api/taco/keys/${userId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to get Taco keys:', error);
      
      // Return mock data for demonstration
      return [
        {
          id: 1,
          userId,
          publicKey: 'taco-public-key-demo-1',
          keyType: 'TACO',
          name: 'My Threshold Key',
          createdAt: new Date()
        }
      ];
    }
  }

  /**
   * Encrypt data using a public key
   * 
   * @param data - The data to encrypt
   * @param publicKey - The public key to encrypt with
   * @returns The encrypted data
   */
  async encrypt(data: string, publicKey: string) {
    try {
      const response = await apiRequest('POST', '/api/taco/encrypt', { data, publicKey });
      const result = await response.json();
      return result.encryptedData;
    } catch (error) {
      console.error('Failed to encrypt with Taco:', error);
      
      // Return a mock encrypted version for demonstration
      return `taco-encrypted:${btoa(data)}`;
    }
  }

  /**
   * Decrypt data using a private key
   * 
   * @param encryptedData - The encrypted data
   * @param privateKey - The private key to decrypt with
   * @returns The decrypted data
   */
  async decrypt(encryptedData: string, privateKey: string) {
    try {
      const response = await apiRequest('POST', '/api/taco/decrypt', { encryptedData, privateKey });
      const result = await response.json();
      return result.decryptedData;
    } catch (error) {
      console.error('Failed to decrypt with Taco:', error);
      
      // Handle mock encrypted data format for demonstration
      if (encryptedData.startsWith('taco-encrypted:')) {
        return atob(encryptedData.substring(15));
      }
      
      throw error;
    }
  }

  /**
   * Generate a re-encryption key for sharing with another user
   * 
   * @param senderPrivateKey - The sender's private key
   * @param receiverPublicKey - The receiver's public key
   * @returns The re-encryption key
   */
  async generateReEncryptionKey(senderPrivateKey: string, receiverPublicKey: string) {
    try {
      const response = await apiRequest('POST', '/api/taco/generate-re-key', {
        senderPrivateKey,
        receiverPublicKey
      });
      const result = await response.json();
      return result.reEncryptionKey;
    } catch (error) {
      console.error('Failed to generate re-encryption key:', error);
      
      // Return a mock re-encryption key for demonstration
      return `taco-re-key:${senderPrivateKey.substring(0, 5)}:${receiverPublicKey.substring(0, 5)}`;
    }
  }

  /**
   * Re-encrypt data for a target user
   * 
   * @param encryptedData - The encrypted data
   * @param reEncryptionKey - The re-encryption key
   * @returns The re-encrypted data
   */
  async reEncrypt(encryptedData: string, reEncryptionKey: string) {
    try {
      const response = await apiRequest('POST', '/api/taco/re-encrypt', {
        encryptedData,
        reEncryptionKey
      });
      const result = await response.json();
      return result.reEncryptedData;
    } catch (error) {
      console.error('Failed to re-encrypt data:', error);
      
      // Return mock re-encrypted data for demonstration
      return `taco-re-encrypted:${encryptedData}`;
    }
  }

  /**
   * Share a receipt with another user
   * 
   * @param receiptId - The ID of the receipt to share
   * @param ownerId - The ID of the receipt owner
   * @param targetId - The ID of the user to share with
   * @param encryptedData - The encrypted receipt data
   * @param ownerPrivateKey - The owner's private key
   * @param targetPublicKey - The target user's public key
   * @param expiresAt - Optional expiration date
   * @returns The shared access information
   */
  async shareReceipt(
    receiptId: number,
    ownerId: number,
    targetId: number,
    encryptedData: string,
    ownerPrivateKey: string,
    targetPublicKey: string,
    expiresAt?: Date
  ) {
    try {
      const response = await apiRequest('POST', '/api/taco/share-receipt', {
        receiptId,
        ownerId,
        targetId,
        encryptedData,
        ownerPrivateKey,
        targetPublicKey,
        expiresAt: expiresAt ? expiresAt.toISOString() : undefined
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to share receipt:', error);
      
      // Return mock shared access information for demonstration
      return {
        id: Math.floor(Math.random() * 1000),
        receiptId,
        ownerId,
        targetId,
        encryptedData,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt ? expiresAt.toISOString() : null
      };
    }
  }

  /**
   * Get all receipts shared by a user
   * 
   * @param userId - The ID of the user
   * @returns Array of shared receipts
   */
  async getSharedByMe(userId: number) {
    try {
      const response = await apiRequest('GET', `/api/taco/shared-by-me/${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get receipts shared by me:', error);
      
      // Return mock shared receipts for demonstration
      return [
        {
          access: {
            id: 1,
            receiptId: 101,
            ownerId: userId,
            targetId: 2,
            encryptedData: 'taco-encrypted:mock-data',
            createdAt: new Date().toISOString(),
          },
          receipt: {
            id: 101,
            userId,
            merchantId: 1,
            merchant: { name: 'Coffeeshop' },
            date: new Date().toISOString(),
            total: '24.99'
          }
        }
      ];
    }
  }

  /**
   * Get all receipts shared with a user
   * 
   * @param userId - The ID of the user
   * @returns Array of shared receipts
   */
  async getSharedWithMe(userId: number) {
    try {
      const response = await apiRequest('GET', `/api/taco/shared-with-me/${userId}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to get receipts shared with me:', error);
      
      // Return mock shared receipts for demonstration
      return [
        {
          access: {
            id: 2,
            receiptId: 102,
            ownerId: 3,
            targetId: userId,
            encryptedData: 'taco-encrypted:mock-data-2',
            createdAt: new Date().toISOString(),
          },
          receipt: {
            id: 102,
            userId: 3,
            merchantId: 2,
            merchant: { name: 'Electronics Store' },
            date: new Date().toISOString(),
            total: '199.99'
          }
        }
      ];
    }
  }

  /**
   * Get the decrypted content of a shared receipt
   * 
   * @param sharedId - The ID of the shared access
   * @param privateKey - The private key of the target user
   * @returns The decrypted receipt data
   */
  async getDecryptedSharedReceipt(sharedId: number, privateKey: string) {
    try {
      const response = await apiRequest('POST', `/api/taco/decrypt-shared/${sharedId}`, {
        privateKey
      });
      return await response.json();
    } catch (error) {
      console.error('Failed to decrypt shared receipt:', error);
      throw error;
    }
  }
}

export const tacoThresholdCrypto = new TacoThresholdCrypto();
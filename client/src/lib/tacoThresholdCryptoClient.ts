/**
 * TaCo Threshold Crypto Client
 * 
 * This client provides an interface to the server-side TaCo threshold encryption API
 * for managing keys and performing encryption/decryption operations.
 */
import { apiRequest } from './queryClient';

export interface TacoKey {
  id: number;
  name: string;
  publicKey: string;
  createdAt: Date;
}

/**
 * TaCo Threshold Crypto Client Service
 */
export class TacoThresholdCryptoClient {
  /**
   * Get all TaCo keys for the current user
   */
  async getUserKeys(): Promise<TacoKey[]> {
    try {
      const response = await apiRequest('GET', '/api/taco/keys');
      const keys = await response.json();
      return keys;
    } catch (error) {
      console.error('Error fetching TaCo keys:', error);
      return [];
    }
  }

  /**
   * Create a new TaCo key
   * @param name A user-friendly name for the key
   * @param publicKey The TaCo public key
   */
  async createKey(name: string, publicKey: string): Promise<TacoKey | null> {
    try {
      const response = await apiRequest('POST', '/api/taco/keys', {
        name,
        publicKey
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating TaCo key:', errorData);
        return null;
      }
      
      const key = await response.json();
      return key;
    } catch (error) {
      console.error('Error creating TaCo key:', error);
      return null;
    }
  }

  /**
   * Generate a new key pair using the TaCo protocol
   * In development, this is mocked and returns a simple key pair
   */
  async generateKeyPair(keyName: string = 'My TaCo Key'): Promise<{
    privateKey: string;
    publicKey: string;
    id?: number;
  } | null> {
    // In a real implementation, this would use the TaCo threshold library
    // For now, we'll generate a mock key pair
    
    try {
      // Generate a random string for the keys (simplified for development)
      const randomKey = () => {
        const length = 32;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
      };
      
      const privateKey = randomKey();
      const publicKey = randomKey();
      
      // Store the public key on the server
      const key = await this.createKey(keyName, publicKey);
      
      return {
        privateKey,
        publicKey,
        id: key?.id
      };
    } catch (error) {
      console.error('Error generating key pair:', error);
      return null;
    }
  }

  /**
   * Encrypt data using a TaCo public key
   * @param data The data to encrypt
   * @param publicKey The TaCo public key to use
   */
  async encryptData(data: string, publicKey: string): Promise<string | null> {
    try {
      const response = await apiRequest('POST', '/api/taco/encrypt', {
        privateKey: data, // The API expects a field called privateKey but we use it for any data
        publicKey
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error encrypting data:', errorData);
        return null;
      }
      
      const result = await response.json();
      return result.encryptedData;
    } catch (error) {
      console.error('Error encrypting data:', error);
      return null;
    }
  }

  /**
   * Decrypt data using a TaCo public key
   * @param encryptedData The encrypted data
   * @param publicKey The TaCo public key
   */
  async decryptData(encryptedData: string, publicKey: string): Promise<string | null> {
    try {
      const response = await apiRequest('POST', '/api/taco/decrypt', {
        encryptedData,
        publicKey
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error decrypting data:', errorData);
        return null;
      }
      
      const result = await response.json();
      return result.decryptedData;
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  }
}

// Export a singleton instance of the client
export const tacoThresholdCryptoClient = new TacoThresholdCryptoClient();
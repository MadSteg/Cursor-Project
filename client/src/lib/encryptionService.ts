import { apiRequest } from "./queryClient";
import type { EncryptionKey, SharedAccess } from "@shared/schema";
import { tacoThresholdCrypto } from "./thresholdCrypto";

// Initialize Taco when the encryption service is first imported
tacoThresholdCrypto.initialize().catch(console.error);

/**
 * Encryption key management service for client-side
 */
export const encryptionService = {
  /**
   * Get all encryption keys for the current user
   */
  async getEncryptionKeys(): Promise<EncryptionKey[]> {
    const response = await apiRequest("GET", "/api/encryption-keys");
    return response.json();
  },

  /**
   * Create a new encryption key
   */
  async createEncryptionKey(data: {
    name: string;
    publicKey: string;
    privateKey?: string;
    algorithm: string;
    isThresholdKey?: boolean;
  }): Promise<EncryptionKey> {
    // Check if this is a Taco threshold key
    if (data.algorithm === "taco-threshold") {
      try {
        // Generate a new key pair using Taco
        const { publicKey, privateKey } = await tacoThresholdCrypto.generateKeyPair();

        // Prepare the key data with the generated keys
        const tacoKeyData = {
          name: data.name,
          publicKey,
          privateKey, // In a real app, this would be encrypted with the user's password
          algorithm: "taco-threshold",
          isThresholdKey: true
        };

        // Send to the server
        const response = await apiRequest("POST", "/api/encryption-keys", tacoKeyData);
        return response.json();
      } catch (error: any) {
        console.error("Error creating Taco key:", error);
        throw new Error(`Failed to create Taco key: ${error.message}`);
      }
    } else {
      // Standard encryption key
      const response = await apiRequest("POST", "/api/encryption-keys", data);
      return response.json();
    }
  },

  /**
   * Get an encryption key by ID
   */
  async getEncryptionKey(id: number): Promise<EncryptionKey> {
    const response = await apiRequest("GET", `/api/encryption-keys/${id}`);
    return response.json();
  },

  /**
   * Update an encryption key
   */
  async updateEncryptionKey(
    id: number,
    data: Partial<{
      name: string;
      publicKey: string;
      privateKey?: string;
      algorithm: string;
      isThresholdKey?: boolean;
    }>
  ): Promise<EncryptionKey> {
    const response = await apiRequest("PUT", `/api/encryption-keys/${id}`, data);
    return response.json();
  },

  /**
   * Get shared accesses for a receipt
   */
  async getSharedAccesses(receiptId: number): Promise<SharedAccess[]> {
    const response = await apiRequest(
      "GET",
      `/api/receipts/${receiptId}/shared-access`
    );
    return response.json();
  },

  /**
   * Create shared access for a receipt
   */
  async createSharedAccess(
    receiptId: number,
    data: {
      targetUserId: number;
      reEncryptedKey: string;
      expiresAt?: Date;
      permissions?: string;
    }
  ): Promise<SharedAccess> {
    const response = await apiRequest(
      "POST",
      `/api/receipts/${receiptId}/shared-access`,
      data
    );
    return response.json();
  },

  /**
   * Get all receipts shared with the current user
   */
  async getSharedWithMe(): Promise<any[]> {
    const response = await apiRequest("GET", "/api/shared-with-me");
    return response.json();
  },

  /**
   * Get all receipts the current user has shared with others
   */
  async getSharedByMe(): Promise<any[]> {
    const response = await apiRequest("GET", "/api/shared-by-me");
    return response.json();
  },

  // ----- Taco Threshold Encryption Methods -----

  /**
   * Encrypt data using Taco threshold encryption
   */
  async encryptWithTaco(data: any, publicKey: string): Promise<string> {
    try {
      return await tacoThresholdCrypto.encrypt(data, publicKey);
    } catch (error: any) {
      console.error("Taco encryption error:", error);
      throw new Error(`Failed to encrypt with Taco: ${error.message}`);
    }
  },

  /**
   * Decrypt data using Taco threshold encryption
   */
  async decryptWithTaco(encryptedData: string, privateKey: string): Promise<any> {
    try {
      return await tacoThresholdCrypto.decrypt(encryptedData, privateKey);
    } catch (error: any) {
      console.error("Taco decryption error:", error);
      throw new Error(`Failed to decrypt with Taco: ${error.message}`);
    }
  },

  /**
   * Generate a re-encryption key for sharing with another user
   */
  async generateTacoReEncryptionKey(
    ownerPrivateKey: string, 
    targetPublicKey: string, 
    expirationDays?: number
  ): Promise<string> {
    try {
      return await tacoThresholdCrypto.generateReEncryptionKey(
        ownerPrivateKey,
        targetPublicKey,
        expirationDays
      );
    } catch (error: any) {
      console.error("Taco re-encryption key generation error:", error);
      throw new Error(`Failed to generate re-encryption key: ${error.message}`);
    }
  },

  /**
   * Re-encrypt data for sharing with a target user
   */
  async reEncryptWithTaco(encryptedData: string, reEncryptionKey: string): Promise<string> {
    try {
      return await tacoThresholdCrypto.reEncrypt(encryptedData, reEncryptionKey);
    } catch (error: any) {
      console.error("Taco re-encryption error:", error);
      throw new Error(`Failed to re-encrypt data: ${error.message}`);
    }
  },

  /**
   * Share a receipt with a target user using Taco PRE
   */
  async shareReceiptWithTaco(
    receiptId: number, 
    targetUserId: number, 
    accessLevel: string, 
    expirationDays?: number
  ): Promise<SharedAccess> {
    try {
      // Calculate expiration date if provided
      let expiresAt: string | undefined = undefined;
      if (expirationDays) {
        const date = new Date();
        date.setDate(date.getDate() + expirationDays);
        expiresAt = date.toISOString();
      }

      // Create shared access using the server's Taco PRE service
      const response = await apiRequest("POST", `/api/taco/share/${receiptId}`, {
        targetUserId,
        accessLevel,
        expiresAt
      });
      
      return response.json();
    } catch (error: any) {
      console.error("Error sharing receipt with Taco:", error);
      throw new Error(`Failed to share receipt: ${error.message}`);
    }
  }
};
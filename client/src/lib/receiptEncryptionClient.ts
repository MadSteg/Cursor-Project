/**
 * Receipt Encryption Client
 * 
 * This client library provides methods for encrypting and decrypting receipt metadata
 * using the server-side TaCo threshold encryption service.
 */
import { apiRequest } from "./queryClient";

export interface ReceiptMetadata {
  items: Array<{ name: string, price: number, quantity: number }>;
  merchantName: string;
  date: string;
  total: number;
  subtotal: number;
  tax: number;
  category?: string;
}

export interface EncryptedData {
  capsule: string;
  ciphertext: string;
}

/**
 * Client for receipt encryption operations
 */
class ReceiptEncryptionClient {
  /**
   * Encrypt receipt metadata
   * @param metadata The receipt metadata to encrypt
   * @param publicKey Optional TaCo public key to use
   * @returns Encrypted data (capsule and ciphertext)
   */
  async encryptReceiptMetadata(
    metadata: ReceiptMetadata,
    publicKey?: string
  ): Promise<EncryptedData> {
    try {
      const response = await apiRequest(
        "POST",
        "/api/receipt-encryption/encrypt",
        {
          ...metadata,
          publicKey
        }
      );

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || "Failed to encrypt receipt metadata");
      }
      
      return result.encryptedData;
    } catch (error: any) {
      console.error("Error encrypting receipt metadata:", error);
      throw new Error(
        `Receipt encryption failed: ${error.message || "Unknown error"}`
      );
    }
  }

  /**
   * Decrypt receipt metadata
   * @param encryptedData The encrypted data object
   * @param publicKey TaCo public key to use for decryption
   * @returns Decrypted receipt metadata
   */
  async decryptReceiptMetadata(
    encryptedData: EncryptedData,
    publicKey: string
  ): Promise<ReceiptMetadata> {
    try {
      const response = await apiRequest(
        "POST",
        "/api/receipt-encryption/decrypt",
        {
          encryptedData,
          publicKey
        }
      );

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || "Failed to decrypt receipt metadata");
      }
      
      return result.decryptedData;
    } catch (error: any) {
      console.error("Error decrypting receipt metadata:", error);
      throw new Error(
        `Receipt decryption failed: ${error.message || "Unknown error"}`
      );
    }
  }

  /**
   * Grant receipt access to another user
   * @param encryptedData The encrypted receipt data
   * @param ownerPublicKey The owner's TaCo public key
   * @param recipientPublicKey The recipient's TaCo public key
   * @returns Re-encrypted data for the recipient
   */
  async grantReceiptAccess(
    encryptedData: EncryptedData,
    ownerPublicKey: string,
    recipientPublicKey: string
  ): Promise<EncryptedData> {
    try {
      const response = await apiRequest(
        "POST",
        "/api/receipt-encryption/grant-access",
        {
          encryptedData,
          ownerPublicKey,
          recipientPublicKey
        }
      );

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || "Failed to grant receipt access");
      }
      
      return result.reEncryptedData;
    } catch (error: any) {
      console.error("Error granting receipt access:", error);
      throw new Error(
        `Grant access failed: ${error.message || "Unknown error"}`
      );
    }
  }

  /**
   * Revoke receipt access from a user
   * @param receiptId The receipt ID
   * @param recipientPublicKey The recipient's TaCo public key to revoke
   * @returns True if revocation was successful
   */
  async revokeReceiptAccess(
    receiptId: string,
    recipientPublicKey: string
  ): Promise<boolean> {
    try {
      const response = await apiRequest(
        "POST",
        "/api/receipt-encryption/revoke-access",
        {
          receiptId,
          recipientPublicKey
        }
      );

      const result = await response.json();
      
      return result.success;
    } catch (error: any) {
      console.error("Error revoking receipt access:", error);
      throw new Error(
        `Revoke access failed: ${error.message || "Unknown error"}`
      );
    }
  }
}

// Export a singleton instance
export const receiptEncryptionClient = new ReceiptEncryptionClient();
import { apiRequest } from "./queryClient";
import type { EncryptionKey, SharedAccess } from "@shared/schema";

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
    const response = await apiRequest("POST", "/api/encryption-keys", data);
    return response.json();
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
};
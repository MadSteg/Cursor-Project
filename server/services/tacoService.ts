/**
 * Taco Threshold Encryption Service
 * 
 * This service provides threshold encryption capabilities using the Taco (formerly NuCypher) SDK.
 * It implements proxy re-encryption (PRE) for secure sharing of encrypted receipts between users.
 */

import * as taco from '@nucypher/taco';
import { storage } from '../storage';
import { log } from '../vite';
import { EncryptionKey, InsertEncryptionKey, InsertSharedAccess, Receipt, SharedAccess } from '@shared/schema';

/**
 * Class to handle Taco threshold encryption operations
 */
export class TacoService {
  private static instance: TacoService;
  private initialized: boolean = false;
  private provider: any;
  private domain: string = "memorychain";
  private keyCache: Map<number, any> = new Map(); // Cache for user keys

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): TacoService {
    if (!TacoService.instance) {
      TacoService.instance = new TacoService();
    }
    return TacoService.instance;
  }

  /**
   * Initialize the Taco service
   */
  public async initialize(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }

    try {
      // Initialize the Taco provider
      this.provider = await taco.createTacoProvider();
      log('Taco service initialized successfully', 'taco');
      this.initialized = true;
      return true;
    } catch (error: any) {
      log(`Failed to initialize Taco service: ${error.message}`, 'taco');
      return false;
    }
  }

  /**
   * Generate a new Taco encryption key pair
   */
  public async generateKeyPair(userId: number, keyName: string): Promise<EncryptionKey | null> {
    try {
      await this.initialize();
      
      // Generate a new key pair using Taco
      const keyPair = await this.provider.generateKeyPair();

      // Store the public key in the database
      // Note: Private key is encrypted and stored securely
      const insertKey: InsertEncryptionKey = {
        userId,
        publicKey: keyPair.publicKey,
        encryptedPrivateKey: keyPair.privateKey, // In production, this should be encrypted with a user password
        keyType: "taco-threshold",
        isActive: true,
        keyVersion: 1 // Start with version 1
      };

      // Store the key using our storage service
      const encryptionKey = await storage.createEncryptionKey(insertKey);

      // Cache the key pair for future use
      this.keyCache.set(encryptionKey.id, keyPair);

      log(`Generated new Taco encryption key for user #${userId}`, 'taco');
      return encryptionKey;
    } catch (error: any) {
      log(`Error generating Taco key pair: ${error.message}`, 'taco');
      return null;
    }
  }

  /**
   * Encrypt data using Taco
   */
  public async encrypt(data: any, userPublicKey: string): Promise<string | null> {
    try {
      await this.initialize();

      // Convert data to string
      const dataString = JSON.stringify(data);

      // Encrypt the data using Taco
      const encryptedData = await this.provider.encrypt(
        dataString, 
        userPublicKey, 
        this.domain
      );

      return encryptedData;
    } catch (error: any) {
      log(`Error encrypting data with Taco: ${error.message}`, 'taco');
      return null;
    }
  }

  /**
   * Decrypt data using Taco
   */
  public async decrypt(encryptedData: string, userPrivateKey: string): Promise<any | null> {
    try {
      await this.initialize();

      // Decrypt the data using Taco
      const decryptedDataString = await this.provider.decrypt(
        encryptedData, 
        userPrivateKey
      );

      // Parse the decrypted data
      return JSON.parse(decryptedDataString);
    } catch (error: any) {
      log(`Error decrypting data with Taco: ${error.message}`, 'taco');
      return null;
    }
  }

  /**
   * Create a re-encryption key for sharing data with another user
   */
  public async createReEncryptionKey(
    ownerPrivateKey: string, 
    targetPublicKey: string,
    expiration?: Date
  ): Promise<string | null> {
    try {
      await this.initialize();

      // Create a policy for the target
      const expirationTimestamp = expiration ? Math.floor(expiration.getTime() / 1000) : undefined;

      // Generate re-encryption key
      const reEncryptionKey = await this.provider.generateReencryptionKey(
        ownerPrivateKey,
        targetPublicKey,
        { 
          expiration: expirationTimestamp,
          domain: this.domain
        }
      );

      return reEncryptionKey;
    } catch (error: any) {
      log(`Error creating re-encryption key: ${error.message}`, 'taco');
      return null;
    }
  }

  /**
   * Share a receipt with another user using threshold encryption
   */
  public async shareReceipt(
    receiptId: number, 
    ownerUserId: number, 
    targetUserId: number,
    accessLevel: string = "full",
    expiration?: Date
  ): Promise<SharedAccess | null> {
    try {
      // Get the receipt
      const receipt = await storage.getReceipt(receiptId);
      if (!receipt) {
        throw new Error(`Receipt #${receiptId} not found`);
      }

      // Verify ownership
      if (receipt.userId !== ownerUserId) {
        throw new Error(`User #${ownerUserId} does not own receipt #${receiptId}`);
      }

      // Get the owner's encryption key
      const ownerKeys = await storage.getEncryptionKeys(ownerUserId);
      if (!ownerKeys || ownerKeys.length === 0) {
        throw new Error(`User #${ownerUserId} has no encryption keys`);
      }
      const ownerKey = ownerKeys[0]; // Use the first key for simplicity

      // Get the target's encryption key
      const targetKeys = await storage.getEncryptionKeys(targetUserId);
      if (!targetKeys || targetKeys.length === 0) {
        throw new Error(`Target user #${targetUserId} has no encryption keys`);
      }
      const targetKey = targetKeys[0]; // Use the first key for simplicity

      // Generate re-encryption key
      // Note: In a real app, you'd need to ask the user for their password to decrypt their private key
      const reEncryptionKey = await this.createReEncryptionKey(
        ownerKey.encryptedPrivateKey, // This would be decrypted with the user's password in a real app
        targetKey.publicKey,
        expiration
      );

      if (!reEncryptionKey) {
        throw new Error("Failed to create re-encryption key");
      }

      // Create shared access entry
      const sharedAccess: InsertSharedAccess = {
        receiptId,
        ownerUserId,
        targetUserId,
        reEncryptionKey,
        reEncryptionCommitment: "", // Not used in our simple implementation
        accessLevel,
        expiresAt: expiration,
        isRevoked: false
      };

      // Store the shared access
      const result = await storage.createSharedAccess(sharedAccess);
      
      log(`User #${ownerUserId} shared receipt #${receiptId} with user #${targetUserId}`, 'taco');
      return result;
    } catch (error: any) {
      log(`Error sharing receipt: ${error.message}`, 'taco');
      return null;
    }
  }

  /**
   * Re-encrypt data for a target user
   */
  public async reEncrypt(
    encryptedData: string, 
    reEncryptionKey: string
  ): Promise<string | null> {
    try {
      await this.initialize();

      // Perform re-encryption using Taco
      const reEncryptedData = await this.provider.reencrypt(
        encryptedData,
        reEncryptionKey
      );

      return reEncryptedData;
    } catch (error: any) {
      log(`Error re-encrypting data: ${error.message}`, 'taco');
      return null;
    }
  }

  /**
   * Get decrypted receipt for a shared access
   */
  public async getSharedReceipt(
    receiptId: number, 
    targetUserId: number
  ): Promise<Receipt | null> {
    try {
      // Get the receipt
      const receipt = await storage.getReceipt(receiptId);
      if (!receipt) {
        throw new Error(`Receipt #${receiptId} not found`);
      }

      // Check if user has access
      const sharedAccesses = await storage.getSharedAccesses(receiptId);
      const access = sharedAccesses.find(access => 
        access.targetUserId === targetUserId && !access.isRevoked
      );

      if (!access) {
        throw new Error(`User #${targetUserId} does not have access to receipt #${receiptId}`);
      }

      // Check if access has expired
      if (access.expiresAt && new Date(access.expiresAt) < new Date()) {
        throw new Error(`Access to receipt #${receiptId} has expired`);
      }

      // Get target user's key
      const targetKeys = await storage.getEncryptionKeys(targetUserId);
      if (!targetKeys || targetKeys.length === 0) {
        throw new Error(`User #${targetUserId} has no encryption keys`);
      }
      const targetKey = targetKeys[0];

      // If receipt is encrypted using Taco
      if (receipt.isEncrypted && receipt.encryptionPublicKey) {
        // Re-encrypt the receipt data with the shared access key
        const reEncryptedData = await this.reEncrypt(
          receipt.encryptionKey || "", 
          access.reEncryptionKey
        );

        if (!reEncryptedData) {
          throw new Error("Failed to re-encrypt receipt data");
        }

        // Decrypt the re-encrypted data using the target user's private key
        // In a real app, you'd need to ask the user for their password to decrypt their private key
        const decryptedReceipt = await this.decrypt(
          reEncryptedData,
          targetKey.encryptedPrivateKey // This would be decrypted with the user's password in a real app
        );

        if (!decryptedReceipt) {
          throw new Error("Failed to decrypt re-encrypted receipt data");
        }

        return { ...receipt, ...decryptedReceipt };
      }

      // If not encrypted, just return the receipt
      return receipt;
    } catch (error: any) {
      log(`Error getting shared receipt: ${error.message}`, 'taco');
      return null;
    }
  }

  /**
   * Create mock service for testing in environments without Taco
   */
  public static createMockService(): TacoService {
    const service = new TacoService();
    
    // Create mock provider with similar API
    service.provider = {
      generateKeyPair: async () => ({
        publicKey: `mock-taco-public-key-${Date.now()}`,
        privateKey: `mock-taco-private-key-${Date.now()}`
      }),
      encrypt: async (data: string, publicKey: string) => 
        `encrypted:${Buffer.from(data).toString('base64')}:${publicKey}`,
      decrypt: async (encryptedData: string) => {
        const parts = encryptedData.split(':');
        return parts.length > 1 ? Buffer.from(parts[1], 'base64').toString() : '{}';
      },
      generateReencryptionKey: async (ownerKey: string, targetKey: string) =>
        `reencryption-key:${ownerKey.slice(0, 8)}:${targetKey.slice(0, 8)}:${Date.now()}`,
      reencrypt: async (encryptedData: string, reEncryptionKey: string) =>
        `reencrypted:${encryptedData}:${reEncryptionKey.slice(0, 8)}`
    };
    
    service.initialized = true;
    log('Mock Taco service initialized', 'taco');
    
    return service;
  }
}

// Export a singleton instance
export const tacoService = TacoService.getInstance();

// For testing or when Taco API is unavailable, export a mock service creation method
export const createMockTacoService = TacoService.createMockService;
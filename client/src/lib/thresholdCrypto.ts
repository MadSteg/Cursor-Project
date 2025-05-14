/**
 * Client-side Taco Threshold Encryption Library
 * 
 * This library provides integration with Taco (formerly NuCypher) for threshold encryption
 * enabling selective sharing of encrypted receipts with fine-grained access control.
 */

import * as taco from '@nucypher/taco';

// Initialize Taco provider
let provider: any = null;
let initialized = false;

/**
 * Initialize the Taco provider
 */
export async function initializeTaco(): Promise<boolean> {
  if (initialized) {
    return true;
  }

  try {
    // Create a Taco provider
    provider = await taco.createTacoProvider();
    console.log('Taco client initialized successfully');
    initialized = true;
    return true;
  } catch (error: any) {
    console.error(`Failed to initialize Taco client: ${error.message}`);
    
    // In development mode, create a mock provider
    if (import.meta.env.DEV) {
      provider = createMockProvider();
      initialized = true;
      console.log('Using mock Taco provider in development mode');
      return true;
    }
    
    return false;
  }
}

/**
 * Generate a new Taco encryption key pair
 */
export async function generateKeyPair(): Promise<{ publicKey: string, privateKey: string }> {
  await ensureInitialized();
  
  try {
    const keyPair = await provider.generateKeyPair();
    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey
    };
  } catch (error: any) {
    console.error(`Error generating Taco key pair: ${error.message}`);
    throw new Error(`Failed to generate Taco key pair: ${error.message}`);
  }
}

/**
 * Encrypt data with a public key
 */
export async function encrypt(data: any, publicKey: string): Promise<string> {
  await ensureInitialized();
  
  try {
    // Convert data to string
    const dataString = JSON.stringify(data);
    
    // Encrypt with Taco
    const encryptedData = await provider.encrypt(
      dataString, 
      publicKey, 
      'memorychain' // Domain
    );
    
    return encryptedData;
  } catch (error: any) {
    console.error(`Error encrypting with Taco: ${error.message}`);
    throw new Error(`Failed to encrypt data: ${error.message}`);
  }
}

/**
 * Decrypt data with a private key
 */
export async function decrypt(encryptedData: string, privateKey: string): Promise<any> {
  await ensureInitialized();
  
  try {
    // Decrypt with Taco
    const decryptedString = await provider.decrypt(
      encryptedData, 
      privateKey
    );
    
    // Parse the decrypted data
    return JSON.parse(decryptedString);
  } catch (error: any) {
    console.error(`Error decrypting with Taco: ${error.message}`);
    throw new Error(`Failed to decrypt data: ${error.message}`);
  }
}

/**
 * Generate a re-encryption key for sharing data with another user
 */
export async function generateReEncryptionKey(
  ownerPrivateKey: string, 
  targetPublicKey: string,
  expirationDays?: number
): Promise<string> {
  await ensureInitialized();
  
  try {
    // Calculate expiration timestamp
    let expiration: number | undefined = undefined;
    if (expirationDays) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + expirationDays);
      expiration = Math.floor(expirationDate.getTime() / 1000);
    }
    
    // Generate re-encryption key
    const reEncryptionKey = await provider.generateReencryptionKey(
      ownerPrivateKey,
      targetPublicKey,
      { 
        expiration,
        domain: 'memorychain'
      }
    );
    
    return reEncryptionKey;
  } catch (error: any) {
    console.error(`Error generating re-encryption key: ${error.message}`);
    throw new Error(`Failed to generate re-encryption key: ${error.message}`);
  }
}

/**
 * Re-encrypt data for a target user
 */
export async function reEncrypt(
  encryptedData: string, 
  reEncryptionKey: string
): Promise<string> {
  await ensureInitialized();
  
  try {
    // Re-encrypt with Taco
    const reEncryptedData = await provider.reencrypt(
      encryptedData,
      reEncryptionKey
    );
    
    return reEncryptedData;
  } catch (error: any) {
    console.error(`Error re-encrypting data: ${error.message}`);
    throw new Error(`Failed to re-encrypt data: ${error.message}`);
  }
}

/**
 * Ensure the Taco provider is initialized
 */
async function ensureInitialized(): Promise<void> {
  if (!initialized) {
    const success = await initializeTaco();
    if (!success) {
      throw new Error('Taco provider not initialized');
    }
  }
}

/**
 * Create a mock Taco provider for development/testing
 */
function createMockProvider(): any {
  return {
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
}

// Export a singleton object with all the functions
export const tacoThresholdCrypto = {
  initialize: initializeTaco,
  generateKeyPair,
  encrypt,
  decrypt,
  generateReEncryptionKey,
  reEncrypt
};
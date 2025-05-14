/**
 * Client-side Threshold Cryptography Implementation
 * 
 * This library provides threshold proxy re-encryption functions for secure client-side
 * encryption and decryption of sensitive receipt data.
 */

import CryptoJS from 'crypto-js';

// Key types 
export interface UserKeys {
  privateKey: string;
  publicKey: string;
  encryptionKey: string;
}

export interface ReEncryptionKey {
  fromPublicKey: string;
  toPublicKey: string;
  reKey: string;
}

/**
 * Generates a pseudo-random key string with specified byte length
 * @param byteLength Length of the key in bytes
 * @returns Random key string
 */
function generateRandomKey(byteLength: number = 32): string {
  const randomArray = new Uint8Array(byteLength);
  crypto.getRandomValues(randomArray);
  return Array.from(randomArray, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a set of keys for threshold encryption
 * @returns Object containing public, private and encryption keys
 */
export function generateUserKeys(): UserKeys {
  // In a real threshold crypto system, these would be proper cryptographic keys
  // This is a simplified implementation for demonstration
  const privateKey = generateRandomKey(32);
  const publicKey = CryptoJS.SHA256(privateKey).toString();
  const encryptionKey = generateRandomKey(16);
  
  return {
    privateKey,
    publicKey,
    encryptionKey
  };
}

/**
 * Encrypts data using the user's public key
 * @param data The data to encrypt
 * @param publicKey The user's public key
 * @returns Encrypted data string
 */
export function encryptData(data: string, publicKey: string): string {
  // In a real threshold system, this would use proper threshold encryption
  const derived = CryptoJS.HmacSHA256(publicKey, 'encryption-salt').toString();
  return CryptoJS.AES.encrypt(data, derived).toString();
}

/**
 * Decrypts data using the user's private key
 * @param encryptedData The encrypted data to decrypt
 * @param privateKey The user's private key
 * @returns Decrypted data string
 */
export function decryptData(encryptedData: string, privateKey: string): string {
  // In a real threshold system, this would use proper threshold decryption
  const publicKey = CryptoJS.SHA256(privateKey).toString();
  const derived = CryptoJS.HmacSHA256(publicKey, 'encryption-salt').toString();
  const bytes = CryptoJS.AES.decrypt(encryptedData, derived);
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * Generates a re-encryption key that allows transforming ciphertext encrypted with
 * one public key to be decryptable by another private key
 * @param fromPrivateKey The private key of the data owner
 * @param toPublicKey The public key of the recipient
 * @returns Re-encryption key object
 */
export function generateReEncryptionKey(fromPrivateKey: string, toPublicKey: string): ReEncryptionKey {
  // In a real threshold system, this would generate a proper re-encryption key
  const fromPublicKey = CryptoJS.SHA256(fromPrivateKey).toString();
  const reKey = CryptoJS.HmacSHA256(fromPrivateKey + toPublicKey, 'rekey-salt').toString();
  
  return {
    fromPublicKey,
    toPublicKey,
    reKey
  };
}

/**
 * Re-encrypts data that was encrypted with one public key to be decryptable
 * with another private key using a re-encryption key
 * @param encryptedData The encrypted data
 * @param reEncryptionKey The re-encryption key
 * @returns Re-encrypted data string
 */
export function reEncryptData(encryptedData: string, reEncryptionKey: ReEncryptionKey): string {
  // In a real threshold system, this would properly transform the ciphertext
  const transformKey = CryptoJS.HmacSHA256(reEncryptionKey.reKey, 'transform-salt').toString();
  
  // Decrypt with original key derivative (simulated)
  const fromDerived = CryptoJS.HmacSHA256(reEncryptionKey.fromPublicKey, 'encryption-salt').toString();
  const decrypted = CryptoJS.AES.decrypt(encryptedData, fromDerived).toString(CryptoJS.enc.Utf8);
  
  // Re-encrypt with the target key
  const toDerived = CryptoJS.HmacSHA256(reEncryptionKey.toPublicKey, 'encryption-salt').toString();
  return CryptoJS.AES.encrypt(decrypted, toDerived).toString();
}

/**
 * Retrieves or generates user encryption keys from localStorage
 * @param userId Optional user ID for multi-user scenarios
 * @returns Promise resolving to user keys
 */
export async function ensureUserKeys(userId: number = 1): Promise<UserKeys> {
  const storageKey = `threshold-keys-${userId}`;
  const storedKeys = localStorage.getItem(storageKey);
  
  if (storedKeys) {
    return JSON.parse(storedKeys) as UserKeys;
  }
  
  // Generate new keys if none exist
  const newKeys = generateUserKeys();
  localStorage.setItem(storageKey, JSON.stringify(newKeys));
  return newKeys;
}

/**
 * Creates a shareable version of encrypted data using threshold cryptography
 * @param data The data to encrypt and share
 * @param fromUserId The ID of the user sharing the data
 * @param toPublicKey The public key of the recipient
 * @returns Object containing encrypted data and sharing metadata
 */
export async function createShareableData(
  data: string, 
  fromUserId: number = 1,
  toPublicKey?: string
): Promise<{encryptedData: string, sharedKey?: string}> {
  const fromKeys = await ensureUserKeys(fromUserId);
  const encryptedData = encryptData(data, fromKeys.publicKey);
  
  // Only generate sharing key if recipient public key is provided
  if (toPublicKey) {
    const reKey = generateReEncryptionKey(fromKeys.privateKey, toPublicKey);
    return {
      encryptedData,
      sharedKey: reKey.reKey
    };
  }
  
  return { encryptedData };
}

/**
 * Decrypts shared data using a shared key
 * @param encryptedData The encrypted data
 * @param sharedKey The shared re-encryption key
 * @param userId The ID of the recipient user
 * @returns Decrypted data string
 */
export async function decryptSharedData(
  encryptedData: string,
  sharedKey: string,
  fromPublicKey: string,
  userId: number = 1
): Promise<string> {
  const toKeys = await ensureUserKeys(userId);
  
  // Create a re-encryption key object from the shared key
  const reEncryptionKey: ReEncryptionKey = {
    fromPublicKey,
    toPublicKey: toKeys.publicKey,
    reKey: sharedKey
  };
  
  // Re-encrypt the data for the recipient
  const reEncrypted = reEncryptData(encryptedData, reEncryptionKey);
  
  // Decrypt with recipient's private key
  return decryptData(reEncrypted, toKeys.privateKey);
}
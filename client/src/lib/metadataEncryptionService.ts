/**
 * Metadata Encryption Service
 * 
 * This service handles the encryption and access control for receipt metadata
 * using the TACo threshold encryption protocol.
 */

import { apiRequest } from '@/lib/queryClient';

// Mock TACo provider for development
const isMockMode = process.env.NODE_ENV === 'development' || !window.taco;

// Types
export interface EncryptedMetadata {
  tokenId: string;
  encryptedData: string;
  unencryptedPreview: any;
  dataHash: string;
  ownerAddress: string;
}

export interface MetadataAccess {
  id: number;
  tokenId: string;
  granteeAddress: string;
  grantedBy: string;
  grantedAt: string;
  revokedAt: string | null;
  isOwner: boolean;
}

// Utility function to simulate encryption in mock mode
function mockEncrypt(data: any): string {
  return `encrypted:${btoa(JSON.stringify(data))}`;
}

// Utility function to simulate decryption in mock mode
function mockDecrypt(encryptedData: string): any {
  if (encryptedData.startsWith('encrypted:')) {
    try {
      return JSON.parse(atob(encryptedData.substring(10)));
    } catch (e) {
      console.error('Failed to decrypt mock data:', e);
      return null;
    }
  }
  return null;
}

/**
 * Encrypt receipt metadata for storage
 */
export async function encryptMetadata(
  data: any,
  publicPreview: any,
  ownerAddress: string,
  tokenId: string
): Promise<EncryptedMetadata | null> {
  try {
    console.log('Encrypting metadata for token', tokenId);
    
    // In mock mode, simply "encrypt" by encoding
    if (isMockMode) {
      console.log('Using mock encryption');
      const mockEncryptedData = mockEncrypt(data);
      
      // Create a simple hash of the data
      const dataHash = Array.from(
        new Uint8Array(
          await crypto.subtle.digest(
            'SHA-256',
            new TextEncoder().encode(JSON.stringify(data))
          )
        )
      )
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      return {
        tokenId,
        encryptedData: mockEncryptedData,
        unencryptedPreview: publicPreview,
        dataHash,
        ownerAddress
      };
    }

    // In production, use TACo for actual encryption
    // Implementation would use the window.taco API
    
    // For now, return mock implementation
    return {
      tokenId,
      encryptedData: mockEncrypt(data),
      unencryptedPreview: publicPreview,
      dataHash: 'mock-hash-' + Date.now(),
      ownerAddress
    };
  } catch (error) {
    console.error('Failed to encrypt metadata:', error);
    return null;
  }
}

/**
 * Store encrypted metadata on the server
 */
export async function storeEncryptedMetadata(
  metadata: EncryptedMetadata
): Promise<boolean> {
  try {
    const response = await apiRequest('POST', '/api/metadata/store', metadata);
    return response.ok;
  } catch (error) {
    console.error('Failed to store encrypted metadata:', error);
    return false;
  }
}

/**
 * Retrieve metadata for a token
 * Will return either full decrypted data if access is granted,
 * or just the public preview if no access
 */
export async function getTokenMetadata(
  tokenId: string
): Promise<{ 
  data: any; 
  hasFullAccess: boolean;
  accessGrantedBy?: string;
}> {
  try {
    const response = await apiRequest('GET', `/api/metadata/${tokenId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    
    const result = await response.json();
    
    // If the server indicates we have access to the full data
    if (result.hasFullAccess && result.encryptedData) {
      let decryptedData;
      
      // In mock mode, just decode the "encrypted" data
      if (isMockMode) {
        decryptedData = mockDecrypt(result.encryptedData);
      } else {
        // In production, would use TACo to decrypt
        decryptedData = null; // Placeholder
      }
      
      return {
        data: decryptedData || result.unencryptedPreview,
        hasFullAccess: !!decryptedData,
        accessGrantedBy: result.accessGrantedBy
      };
    }
    
    // Otherwise just return the public preview
    return {
      data: result.unencryptedPreview,
      hasFullAccess: false
    };
  } catch (error) {
    console.error('Failed to get token metadata:', error);
    return {
      data: null,
      hasFullAccess: false
    };
  }
}

/**
 * Grant access to a token's metadata to another address
 */
export async function grantMetadataAccess(
  tokenId: string,
  granteeAddress: string
): Promise<boolean> {
  try {
    const response = await apiRequest('POST', `/api/metadata/${tokenId}/grant-access`, {
      granteeAddress
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to grant metadata access:', error);
    return false;
  }
}

/**
 * Revoke access to a token's metadata from an address
 */
export async function revokeMetadataAccess(
  tokenId: string,
  granteeAddress: string
): Promise<boolean> {
  try {
    const response = await apiRequest('POST', `/api/metadata/${tokenId}/revoke-access`, {
      granteeAddress
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to revoke metadata access:', error);
    return false;
  }
}

/**
 * Get list of addresses that have been granted access to a token
 */
export async function getMetadataAccessList(
  tokenId: string
): Promise<MetadataAccess[]> {
  try {
    const response = await apiRequest('GET', `/api/metadata/${tokenId}/access-list`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch access list');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get metadata access list:', error);
    return [];
  }
}

/**
 * Check if current user has access to a token's metadata
 */
export async function checkMetadataAccess(
  tokenId: string
): Promise<boolean> {
  try {
    const response = await apiRequest('GET', `/api/metadata/${tokenId}/check-access`);
    
    if (!response.ok) {
      return false;
    }
    
    const result = await response.json();
    return result.hasAccess;
  } catch (error) {
    console.error('Failed to check metadata access:', error);
    return false;
  }
}

/**
 * Handle token transfer (automatically revokes previous owner's access)
 */
export async function handleTokenTransfer(
  tokenId: string,
  fromAddress: string,
  toAddress: string,
  txHash: string
): Promise<boolean> {
  try {
    const response = await apiRequest('POST', `/api/metadata/${tokenId}/transfer`, {
      fromAddress,
      toAddress,
      transferTxHash: txHash
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to handle token transfer:', error);
    return false;
  }
}

export default {
  encryptMetadata,
  storeEncryptedMetadata,
  getTokenMetadata,
  grantMetadataAccess,
  revokeMetadataAccess,
  getMetadataAccessList,
  checkMetadataAccess,
  handleTokenTransfer
};
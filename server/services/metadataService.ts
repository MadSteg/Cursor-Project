import { nftRepository } from '../repositories/nftRepository';
import { encryptedMetadata, InsertEncryptedMetadata } from '../../shared/schema';
import crypto from 'crypto';

/**
 * Service for managing encrypted metadata
 * Handles the persistence and retrieval of encrypted NFT receipt data
 */
export class MetadataService {
  /**
   * Store encrypted metadata for an NFT
   * @param tokenId The NFT token ID
   * @param ownerAddress The wallet address of the NFT owner
   * @param encryptedData The encrypted data as a string
   * @param unencryptedPreview Optional unencrypted preview data
   */
  async storeEncryptedMetadata(
    tokenId: string,
    ownerAddress: string,
    encryptedData: string,
    unencryptedPreview?: any
  ): Promise<boolean> {
    try {
      // Generate a hash of the encrypted data for verification
      const dataHash = crypto.createHash('sha256').update(encryptedData).digest('hex');
      
      // Create the metadata record
      const metadataRecord: InsertEncryptedMetadata = {
        tokenId,
        encryptedData,
        dataHash,
        ownerAddress,
        unencryptedPreview
      };
      
      // Store in the database using the repository
      await nftRepository.storeEncryptedMetadata(metadataRecord);
      
      console.log(`Stored encrypted metadata for token ${tokenId} owned by ${ownerAddress}`);
      return true;
    } catch (error: any) {
      console.error(`Error storing encrypted metadata for token ${tokenId}:`, error);
      return false;
    }
  }
  
  /**
   * Get encrypted metadata for an NFT
   * @param tokenId The NFT token ID
   * @returns The encrypted metadata or null if not found
   */
  async getEncryptedMetadata(tokenId: string) {
    try {
      const metadata = await nftRepository.getMetadataByTokenId(tokenId);
      return metadata;
    } catch (error: any) {
      console.error(`Error retrieving encrypted metadata for token ${tokenId}:`, error);
      return null;
    }
  }
  
  /**
   * Get all encrypted metadata for a wallet
   * @param walletAddress The wallet address
   * @returns Array of encrypted metadata records
   */
  async getEncryptedMetadataByWallet(walletAddress: string) {
    try {
      const metadataRecords = await nftRepository.getMetadataByOwner(walletAddress);
      return metadataRecords;
    } catch (error: any) {
      console.error(`Error retrieving encrypted metadata for wallet ${walletAddress}:`, error);
      return [];
    }
  }
  
  /**
   * Update the owner of encrypted metadata (used when NFT is transferred)
   * @param tokenId The NFT token ID
   * @param newOwnerAddress The new owner's wallet address
   * @returns Success status
   */
  async updateMetadataOwner(tokenId: string, newOwnerAddress: string): Promise<boolean> {
    try {
      const updated = await nftRepository.updateMetadataOwner(tokenId, newOwnerAddress);
      return !!updated;
    } catch (error: any) {
      console.error(`Error updating metadata owner for token ${tokenId}:`, error);
      return false;
    }
  }
}

export const metadataService = new MetadataService();
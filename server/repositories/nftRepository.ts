import { db } from '../db';
import { encryptedMetadata, insertEncryptedMetadataSchema, InsertEncryptedMetadata } from '../../shared/schema';
import { and, eq } from 'drizzle-orm';

/**
 * Repository for NFT metadata storage and access
 * Handles the persistence of encrypted metadata for NFT receipts
 */
export class NFTRepository {
  /**
   * Store encrypted metadata for an NFT receipt
   * @param data The encrypted metadata to store
   * @returns The stored metadata record
   */
  async storeEncryptedMetadata(data: InsertEncryptedMetadata) {
    try {
      // Validate data with our schema
      const validatedData = insertEncryptedMetadataSchema.parse(data);
      
      // Insert encrypted metadata into the database
      const [record] = await db.insert(encryptedMetadata)
        .values(validatedData)
        .returning();
      
      console.log(`Stored encrypted metadata for token ${data.tokenId}`);
      return record;
    } catch (error: any) {
      console.error('Error storing encrypted metadata:', error);
      throw new Error(`Failed to store encrypted metadata: ${error.message}`);
    }
  }

  /**
   * Get encrypted metadata for an NFT by token ID
   * @param tokenId The NFT token ID
   * @returns The encrypted metadata record if found
   */
  async getMetadataByTokenId(tokenId: string) {
    try {
      const [record] = await db.select()
        .from(encryptedMetadata)
        .where(eq(encryptedMetadata.tokenId, tokenId));
      
      return record;
    } catch (error: any) {
      console.error(`Error retrieving metadata for token ${tokenId}:`, error);
      throw new Error(`Failed to retrieve metadata: ${error.message}`);
    }
  }

  /**
   * Get all encrypted metadata records for a wallet address
   * @param ownerAddress The wallet address
   * @returns Array of encrypted metadata records
   */
  async getMetadataByOwner(ownerAddress: string) {
    try {
      const records = await db.select()
        .from(encryptedMetadata)
        .where(eq(encryptedMetadata.ownerAddress, ownerAddress));
      
      return records;
    } catch (error: any) {
      console.error(`Error retrieving metadata for owner ${ownerAddress}:`, error);
      throw new Error(`Failed to retrieve owner's metadata: ${error.message}`);
    }
  }

  /**
   * Update the owner of an NFT's encrypted metadata
   * @param tokenId The NFT token ID
   * @param newOwnerAddress The new owner's wallet address
   * @returns The updated metadata record
   */
  async updateMetadataOwner(tokenId: string, newOwnerAddress: string) {
    try {
      const [record] = await db.update(encryptedMetadata)
        .set({ 
          ownerAddress: newOwnerAddress,
          updatedAt: new Date()
        })
        .where(eq(encryptedMetadata.tokenId, tokenId))
        .returning();
      
      return record;
    } catch (error: any) {
      console.error(`Error updating metadata owner for token ${tokenId}:`, error);
      throw new Error(`Failed to update metadata owner: ${error.message}`);
    }
  }

  /**
   * Delete encrypted metadata for an NFT
   * @param tokenId The NFT token ID
   * @returns Boolean indicating success
   */
  async deleteMetadata(tokenId: string) {
    try {
      const result = await db.delete(encryptedMetadata)
        .where(eq(encryptedMetadata.tokenId, tokenId))
        .returning();
      
      return result.length > 0;
    } catch (error: any) {
      console.error(`Error deleting metadata for token ${tokenId}:`, error);
      throw new Error(`Failed to delete metadata: ${error.message}`);
    }
  }
}

export const nftRepository = new NFTRepository();
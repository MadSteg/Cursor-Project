import { db } from '../db';
import { encryptedMetadata, encryptedMetadataAccess, nftTransfers } from '../../shared/schema';
import { eq, and, isNull } from 'drizzle-orm';
import crypto from 'crypto';

/**
 * Service for handling encrypted receipt metadata and access control
 */
export class MetadataService {
  /**
   * Stores encrypted receipt data with access control
   */
  async storeEncryptedMetadata(
    tokenId: string,
    encryptedData: string,
    unencryptedPreview: any,
    ownerAddress: string
  ) {
    try {
      // Create a hash of the encrypted data for verification
      const dataHash = crypto
        .createHash('sha256')
        .update(encryptedData)
        .digest('hex');

      // Store the encrypted metadata
      await db.insert(encryptedMetadata).values({
        tokenId,
        encryptedData,
        unencryptedPreview,
        dataHash,
        ownerAddress
      });

      // Grant access to the owner (first owner always has access)
      await db.insert(encryptedMetadataAccess).values({
        tokenId,
        granteeAddress: ownerAddress,
        isOwner: true,
        grantedBy: ownerAddress, // Owner grants to self
        tacoEncryptionId: `taco:${tokenId}:${ownerAddress.slice(0, 8)}` // Mock TACo ID
      });

      return { success: true, tokenId };
    } catch (error) {
      console.error('Error storing encrypted metadata:', error);
      return { success: false, error: 'Failed to store encrypted metadata' };
    }
  }

  /**
   * Check if an address has access to the metadata for a specific token
   */
  async hasMetadataAccess(tokenId: string, walletAddress: string): Promise<boolean> {
    try {
      const access = await db
        .select()
        .from(encryptedMetadataAccess)
        .where(
          and(
            eq(encryptedMetadataAccess.tokenId, tokenId),
            eq(encryptedMetadataAccess.granteeAddress, walletAddress),
            isNull(encryptedMetadataAccess.revokedAt)
          )
        );

      return access.length > 0;
    } catch (error) {
      console.error('Error checking metadata access:', error);
      return false;
    }
  }

  /**
   * Retrieve metadata for a token with access control
   * Returns either full metadata or just the public preview based on access rights
   */
  async getTokenMetadata(tokenId: string, requestAddress: string) {
    try {
      // Retrieve the metadata record
      const [metadataRecord] = await db
        .select()
        .from(encryptedMetadata)
        .where(eq(encryptedMetadata.tokenId, tokenId));

      if (!metadataRecord) {
        return { success: false, error: 'Metadata not found' };
      }

      // Check if requestor has access - if it's the owner or has been granted access
      const hasAccess = await this.hasMetadataAccess(tokenId, requestAddress);

      // If requestor has access, return full data
      if (hasAccess) {
        return {
          success: true,
          data: {
            tokenId,
            hasFullAccess: true,
            metadata: {
              encrypted: metadataRecord.encryptedData,
              preview: metadataRecord.unencryptedPreview,
              dataHash: metadataRecord.dataHash
            }
          }
        };
      }

      // If requestor doesn't have access, only return the public preview
      return {
        success: true,
        data: {
          tokenId,
          hasFullAccess: false,
          metadata: {
            preview: metadataRecord.unencryptedPreview
          }
        }
      };
    } catch (error) {
      console.error('Error retrieving token metadata:', error);
      return { success: false, error: 'Failed to retrieve metadata' };
    }
  }

  /**
   * Grants access to a specific grantee for a token's metadata
   */
  async grantAccess(tokenId: string, granterAddress: string, granteeAddress: string) {
    try {
      // Verify granter has access to grant (must be owner or have delegated rights)
      const hasAccess = await this.hasMetadataAccess(tokenId, granterAddress);
      
      if (!hasAccess) {
        return { success: false, error: 'No permission to grant access' };
      }

      // Check if grantee already has access
      const existingAccess = await db
        .select()
        .from(encryptedMetadataAccess)
        .where(
          and(
            eq(encryptedMetadataAccess.tokenId, tokenId),
            eq(encryptedMetadataAccess.granteeAddress, granteeAddress),
            isNull(encryptedMetadataAccess.revokedAt)
          )
        );

      if (existingAccess.length > 0) {
        return { success: true, message: 'Access already granted' };
      }

      // Generate a mock TACo encryption ID
      const tacoEncryptionId = `taco:${tokenId}:${granteeAddress.slice(0, 8)}`;

      // Grant access by recording it in the database
      await db.insert(encryptedMetadataAccess).values({
        tokenId,
        granteeAddress,
        isOwner: false,
        grantedBy: granterAddress,
        tacoEncryptionId
      });

      return { success: true };
    } catch (error) {
      console.error('Error granting access:', error);
      return { success: false, error: 'Failed to grant access' };
    }
  }

  /**
   * Revokes access for a specific grantee
   */
  async revokeAccess(tokenId: string, revokerAddress: string, granteeAddress: string) {
    try {
      // Verify revoker has permission (must be original granter or owner)
      const [metadataRecord] = await db
        .select()
        .from(encryptedMetadata)
        .where(eq(encryptedMetadata.tokenId, tokenId));

      if (!metadataRecord) {
        return { success: false, error: 'Metadata not found' };
      }

      // Check if revoker is the owner or original granter
      const accessRecord = await db
        .select()
        .from(encryptedMetadataAccess)
        .where(
          and(
            eq(encryptedMetadataAccess.tokenId, tokenId),
            eq(encryptedMetadataAccess.granteeAddress, granteeAddress),
            isNull(encryptedMetadataAccess.revokedAt)
          )
        );

      if (accessRecord.length === 0) {
        return { success: false, error: 'No active access record found' };
      }

      const isOwner = metadataRecord.ownerAddress === revokerAddress;
      const isGranter = accessRecord[0].grantedBy === revokerAddress;

      if (!isOwner && !isGranter) {
        return { success: false, error: 'No permission to revoke access' };
      }

      // Protect owner from accidentally revoking their own access
      if (granteeAddress === metadataRecord.ownerAddress && accessRecord[0].isOwner) {
        return { success: false, error: 'Cannot revoke original owner access' };
      }

      // Revoke access by updating the record
      await db
        .update(encryptedMetadataAccess)
        .set({ revokedAt: new Date() })
        .where(
          and(
            eq(encryptedMetadataAccess.tokenId, tokenId),
            eq(encryptedMetadataAccess.granteeAddress, granteeAddress),
            isNull(encryptedMetadataAccess.revokedAt)
          )
        );

      return { success: true };
    } catch (error) {
      console.error('Error revoking access:', error);
      return { success: false, error: 'Failed to revoke access' };
    }
  }

  /**
   * Handles NFT transfers by automatically revoking previous owner's access
   * and granting access to the new owner
   */
  async handleTokenTransfer(tokenId: string, fromAddress: string, toAddress: string, txHash: string) {
    try {
      // Record the transfer
      await db.insert(nftTransfers).values({
        tokenId,
        fromAddress,
        toAddress,
        transferTxHash: txHash
      });

      // Revoke access for the previous owner and all their delegated accesses
      const accessesToRevoke = await db
        .select()
        .from(encryptedMetadataAccess)
        .where(
          and(
            eq(encryptedMetadataAccess.tokenId, tokenId),
            isNull(encryptedMetadataAccess.revokedAt)
          )
        );

      // Revoke all existing accesses
      for (const access of accessesToRevoke) {
        await db
          .update(encryptedMetadataAccess)
          .set({ revokedAt: new Date() })
          .where(eq(encryptedMetadataAccess.id, access.id));
      }

      // Grant access to the new owner
      await db.insert(encryptedMetadataAccess).values({
        tokenId,
        granteeAddress: toAddress,
        isOwner: true,
        grantedBy: toAddress, // New owner is granting themselves
        tacoEncryptionId: `taco:${tokenId}:${toAddress.slice(0, 8)}` // Mock TACo ID
      });

      // Update the owner in the metadata record
      await db
        .update(encryptedMetadata)
        .set({ ownerAddress: toAddress })
        .where(eq(encryptedMetadata.tokenId, tokenId));

      return { success: true };
    } catch (error) {
      console.error('Error handling token transfer:', error);
      return { success: false, error: 'Failed to process token transfer' };
    }
  }
}

// Export singleton instance
export const metadataService = new MetadataService();
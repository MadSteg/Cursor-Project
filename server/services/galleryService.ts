import { nftRepository } from '../repositories/nftRepository';
import { tacoService } from './tacoService';
import { blockchainService } from './blockchainService';
import { EncryptedMetadata } from '../../shared/schema';

interface NFTWithMetadata {
  tokenId: string;
  contractAddress: string;
  name: string;
  imageUrl: string;
  isLocked: boolean;
  receiptPreview: {
    merchantName: string;
    date: string;
    total: number;
  };
  encryptionStatus: {
    isEncrypted: boolean;
    canDecrypt: boolean;
  };
  ownerAddress: string;
}

/**
 * Gallery service for managing user NFT collections
 */
export class GalleryService {
  /**
   * Get all NFTs owned by a wallet address with metadata
   * @param walletAddress The wallet address to get NFTs for
   * @returns Array of NFTs with metadata status
   */
  async getNFTsForWallet(walletAddress: string): Promise<NFTWithMetadata[]> {
    try {
      // 1. Get blockchain NFTs for this wallet
      const chainNFTs = await blockchainService.getNFTsForWallet(walletAddress);
      
      // 2. Get encrypted metadata for all NFTs owned by this wallet
      const metadataRecords = await nftRepository.getMetadataByOwner(walletAddress);
      
      // 3. Combine the data
      const nftsWithMetadata: NFTWithMetadata[] = [];
      
      // Create a map for quick lookup
      const metadataByTokenId = new Map<string, EncryptedMetadata>();
      metadataRecords.forEach(record => {
        metadataByTokenId.set(record.tokenId, record);
      });
      
      // Process each NFT from the blockchain
      for (const nft of chainNFTs) {
        const metadata = metadataByTokenId.get(nft.tokenId);
        const preview = metadata?.unencryptedPreview as any || {
          merchantName: 'Unknown Merchant',
          date: new Date().toISOString(),
          total: 0
        };
        
        nftsWithMetadata.push({
          tokenId: nft.tokenId,
          contractAddress: nft.contractAddress,
          name: nft.name || `Receipt #${nft.tokenId}`,
          imageUrl: nft.imageUrl || '/nft-images/default-receipt.svg',
          isLocked: !!metadata?.encryptedData,
          receiptPreview: {
            merchantName: preview.merchantName,
            date: preview.date,
            total: preview.total
          },
          encryptionStatus: {
            isEncrypted: !!metadata?.encryptedData,
            canDecrypt: !!metadata?.encryptedData
          },
          ownerAddress: walletAddress
        });
      }
      
      return nftsWithMetadata;
    } catch (error: any) {
      console.error(`Error fetching NFTs for wallet ${walletAddress}:`, error);
      throw new Error(`Failed to fetch NFT gallery: ${error.message}`);
    }
  }
  
  /**
   * Unlock encrypted metadata for an NFT
   * @param tokenId The NFT token ID
   * @param walletAddress The wallet address requesting the unlock
   * @returns The decrypted metadata or null if unable to decrypt
   */
  async unlockNFTMetadata(tokenId: string, walletAddress: string): Promise<any | null> {
    try {
      // 1. Verify ownership of the NFT
      const isOwner = await blockchainService.verifyNFTOwnership(tokenId, walletAddress);
      
      if (!isOwner) {
        console.error(`Wallet ${walletAddress} does not own token ${tokenId}`);
        return null;
      }
      
      // 2. Get encrypted metadata from repository
      const metadata = await nftRepository.getMetadataByTokenId(tokenId);
      
      if (!metadata) {
        console.error(`No metadata found for token ${tokenId}`);
        return null;
      }
      
      // 3. Decrypt the metadata using TACo
      try {
        const decryptedData = await tacoService.decryptData({
          encryptedData: metadata.encryptedData,
          dataHash: metadata.dataHash,
          tokenId: tokenId,
          ownerAddress: walletAddress
        });
        
        return JSON.parse(decryptedData);
      } catch (decryptError: any) {
        console.error(`Error decrypting metadata for token ${tokenId}:`, decryptError);
        return null;
      }
    } catch (error: any) {
      console.error(`Error unlocking metadata for token ${tokenId}:`, error);
      throw new Error(`Failed to unlock NFT metadata: ${error.message}`);
    }
  }
  
  /**
   * Store encrypted metadata for an NFT
   * @param tokenId The NFT token ID  
   * @param ownerAddress The wallet address of the NFT owner
   * @param encryptedData The encrypted metadata
   * @param dataHash Hash of the data for verification
   * @param unencryptedPreview Optional unencrypted preview data
   * @returns Success status
   */
  async storeNFTMetadata(
    tokenId: string,
    ownerAddress: string,
    encryptedData: string,
    dataHash: string,
    unencryptedPreview?: any
  ): Promise<boolean> {
    try {
      await nftRepository.storeEncryptedMetadata({
        tokenId,
        encryptedData,
        dataHash,
        ownerAddress,
        unencryptedPreview: unencryptedPreview || null
      });
      
      return true;
    } catch (error: any) {
      console.error(`Error storing metadata for token ${tokenId}:`, error);
      return false;
    }
  }
}

export const galleryService = new GalleryService();
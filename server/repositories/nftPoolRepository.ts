/**
 * Repository for handling NFT Pool data
 */

import { Pool } from '@neondatabase/serverless';
import { nftPool, type NftPool, type InsertNftPool } from '../../shared/schema';
import { db } from '../db';
import { eq, sql, desc, and } from 'drizzle-orm';

class NFTPoolRepository {
  /**
   * Add a new NFT to the pool
   * @param nftData The NFT data to add
   * @returns The added NFT
   */
  async addNftToPool(nftData: InsertNftPool): Promise<NftPool> {
    try {
      const [nft] = await db.insert(nftPool)
        .values(nftData)
        .returning();
      
      return nft;
    } catch (error) {
      console.error('Error adding NFT to pool:', error);
      throw error;
    }
  }

  /**
   * Get an NFT from the pool by ID
   * @param nftId The NFT ID
   * @returns The NFT or null if not found
   */
  async getNftById(nftId: string): Promise<NftPool | null> {
    try {
      const [nft] = await db.select()
        .from(nftPool)
        .where(eq(nftPool.nftId, nftId));
      
      return nft || null;
    } catch (error) {
      console.error('Error getting NFT by ID:', error);
      throw error;
    }
  }

  /**
   * Get NFTs for a specific tier
   * @param tier The tier to filter by (basic, premium, luxury)
   * @param limit The maximum number of NFTs to return
   * @returns Array of NFTs in the tier
   */
  async getNftsByTier(tier: string, limit: number = 50): Promise<NftPool[]> {
    try {
      const nfts = await db.select()
        .from(nftPool)
        .where(and(
          eq(nftPool.tier, tier),
          eq(nftPool.enabled, true)
        ))
        .limit(limit);
      
      return nfts;
    } catch (error) {
      console.error('Error getting NFTs by tier:', error);
      throw error;
    }
  }

  /**
   * Get random NFTs for a specific tier
   * @param tier The tier to filter by (basic, premium, luxury)
   * @param count The number of random NFTs to return
   * @returns Array of random NFTs in the tier
   */
  async getRandomNftsByTier(tier: string, count: number = 5): Promise<NftPool[]> {
    try {
      // Using PostgreSQL's RANDOM() function to get random records
      const nfts = await db.select()
        .from(nftPool)
        .where(and(
          eq(nftPool.tier, tier),
          eq(nftPool.enabled, true)
        ))
        .orderBy(sql`RANDOM()`)
        .limit(count);
      
      return nfts;
    } catch (error) {
      console.error('Error getting random NFTs by tier:', error);
      throw error;
    }
  }

  /**
   * Disable an NFT in the pool (e.g., after it's been minted to a user)
   * @param nftId The NFT ID to disable
   * @returns The updated NFT
   */
  async disableNft(nftId: string): Promise<NftPool | null> {
    try {
      const [updatedNft] = await db.update(nftPool)
        .set({ 
          enabled: false,
          updatedAt: new Date()
        })
        .where(eq(nftPool.nftId, nftId))
        .returning();
      
      return updatedNft || null;
    } catch (error) {
      console.error('Error disabling NFT:', error);
      throw error;
    }
  }

  /**
   * Get total count of NFTs in the pool by tier
   * @returns Object with counts by tier
   */
  async getNftCounts(): Promise<Record<string, number>> {
    try {
      // Using count and group by to get counts by tier
      const result = await db
        .select({
          tier: nftPool.tier,
          count: sql<number>`count(*)`,
          enabled: sql<number>`sum(case when ${nftPool.enabled} = true then 1 else 0 end)`,
        })
        .from(nftPool)
        .groupBy(nftPool.tier);
      
      // Convert to a simple tier:count object
      const counts: Record<string, number> = {};
      for (const row of result) {
        counts[row.tier] = row.enabled;
      }
      
      return counts;
    } catch (error) {
      console.error('Error getting NFT counts:', error);
      throw error;
    }
  }
}

export const nftPoolRepository = new NFTPoolRepository();
import { db } from '../db';
import { 
  nftPool,
  InsertNftPool,
  NftPool
} from '../../shared/schema';
import { eq, sql, and, or, desc } from 'drizzle-orm';

/**
 * Repository for handling NFT Pool data
 */
class NFTPoolRepository {
  /**
   * Add a new NFT to the pool
   * @param nftData The NFT data to add
   * @returns The added NFT
   */
  async addNftToPool(nftData: InsertNftPool): Promise<NftPool> {
    try {
      if (!db) throw new Error('Database not initialized');
      
      const [inserted] = await db
        .insert(nftPool)
        .values(nftData)
        .returning();
      
      return inserted;
    } catch (error: any) {
      console.error('NFT Pool Repository - Error adding NFT to pool:', error);
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
      if (!db) throw new Error('Database not initialized');
      
      const [record] = await db
        .select()
        .from(nftPool)
        .where(eq(nftPool.nftId, nftId));
      
      return record || null;
    } catch (error: any) {
      console.error(`NFT Pool Repository - Error getting NFT with ID ${nftId}:`, error);
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
      if (!db) throw new Error('Database not initialized');
      
      const records = await db
        .select()
        .from(nftPool)
        .where(and(
          eq(nftPool.tier, tier.toLowerCase()),
          eq(nftPool.enabled, true)
        ))
        .limit(limit);
      
      return records;
    } catch (error: any) {
      console.error(`NFT Pool Repository - Error getting NFTs for tier ${tier}:`, error);
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
      if (!db) throw new Error('Database not initialized');
      
      // PostgreSQL supports random() function for this purpose
      const records = await db
        .select()
        .from(nftPool)
        .where(and(
          eq(nftPool.tier, tier.toLowerCase()),
          eq(nftPool.enabled, true)
        ))
        .orderBy(sql`RANDOM()`)
        .limit(count);
      
      return records;
    } catch (error: any) {
      console.error(`NFT Pool Repository - Error getting random NFTs for tier ${tier}:`, error);
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
      if (!db) throw new Error('Database not initialized');
      
      const [updated] = await db
        .update(nftPool)
        .set({
          enabled: false,
          updatedAt: new Date()
        })
        .where(eq(nftPool.nftId, nftId))
        .returning();
      
      return updated || null;
    } catch (error: any) {
      console.error(`NFT Pool Repository - Error disabling NFT with ID ${nftId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get total count of NFTs in the pool by tier
   * @returns Object with counts by tier
   */
  async getNftCounts(): Promise<Record<string, number>> {
    try {
      if (!db) throw new Error('Database not initialized');
      
      const result = await db.execute(sql`
        SELECT tier, COUNT(*) as count 
        FROM nft_pool 
        WHERE enabled = true 
        GROUP BY tier
      `);
      
      const counts: Record<string, number> = {
        basic: 0,
        premium: 0,
        luxury: 0
      };
      
      for (const row of result as unknown as any[]) {
        counts[row.tier] = parseInt(row.count, 10);
      }
      
      return counts;
    } catch (error: any) {
      console.error('NFT Pool Repository - Error getting NFT counts:', error);
      throw error;
    }
  }
}

export const nftPoolRepository = new NFTPoolRepository();
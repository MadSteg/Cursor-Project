/**
 * Taco Threshold Encryption API Routes
 * 
 * This file provides routes for the Taco threshold encryption functionality,
 * enabling secure key management and receipt sharing.
 */
import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { z } from 'zod';
import { db } from '../db';
import { eq, and } from 'drizzle-orm';
import { 
  tacoKeys, 
  sharedReceipts,
  users,
  receipts,
  merchants
} from '@shared/schema';

const router = Router();

/**
 * Initialize the Taco service
 */
router.post('/initialize', async (req: Request, res: Response) => {
  try {
    // In a real implementation, this would actually initialize the Taco service
    // For now, we'll just return success
    res.json({ success: true, initialized: true });
  } catch (error) {
    console.error('Failed to initialize Taco service:', error);
    res.status(500).json({ error: 'Failed to initialize Taco service' });
  }
});

/**
 * Check if Taco service is initialized
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    // In a real implementation, this would check if the Taco service is initialized
    // For now, we'll just return a mock status
    res.json({ initialized: true });
  } catch (error) {
    console.error('Failed to check Taco status:', error);
    res.status(500).json({ error: 'Failed to check Taco status' });
  }
});

/**
 * Generate a new Taco key pair
 */
router.post('/keys', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const schema = z.object({
      userId: z.number(),
      name: z.string().min(3)
    });
    
    const { userId, name } = schema.parse(req.body);
    
    // In a real implementation, we would generate a key pair
    // For now, we'll just create a mock key
    const publicKey = `taco-public-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    // Save the key to the database
    const [key] = await db.insert(tacoKeys).values({
      userId,
      name,
      publicKey,
      createdAt: new Date()
    }).returning();
    
    res.json(key);
  } catch (error) {
    console.error('Failed to generate key pair:', error);
    res.status(500).json({ error: 'Failed to generate key pair' });
  }
});

/**
 * Get all Taco keys for a user
 */
router.get('/keys', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.userId);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    // Get all keys for the user
    const keys = await db.select().from(tacoKeys).where(eq(tacoKeys.userId, userId));
    
    res.json(keys);
  } catch (error) {
    console.error('Failed to get keys:', error);
    res.status(500).json({ error: 'Failed to get keys' });
  }
});

/**
 * Delete a Taco key
 */
router.delete('/keys/:id', async (req: Request, res: Response) => {
  try {
    const keyId = Number(req.params.id);
    
    if (!keyId) {
      return res.status(400).json({ error: 'Key ID is required' });
    }
    
    // Delete the key
    await db.delete(tacoKeys).where(eq(tacoKeys.id, keyId));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete key:', error);
    res.status(500).json({ error: 'Failed to delete key' });
  }
});

/**
 * Encrypt data using a public key
 */
router.post('/encrypt', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const schema = z.object({
      publicKey: z.string(),
      data: z.string()
    });
    
    const { publicKey, data } = schema.parse(req.body);
    
    // In a real implementation, we would encrypt the data using the Taco library
    // For now, we'll just return a mock encrypted string
    const encryptedData = `encrypted:${Buffer.from(data).toString('base64')}`;
    
    res.json({ encryptedData });
  } catch (error) {
    console.error('Failed to encrypt data:', error);
    res.status(500).json({ error: 'Failed to encrypt data' });
  }
});

/**
 * Decrypt data using a private key
 */
router.post('/decrypt', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const schema = z.object({
      privateKey: z.string(),
      encryptedData: z.string()
    });
    
    const { privateKey, encryptedData } = schema.parse(req.body);
    
    // In a real implementation, we would decrypt the data using the Taco library
    // For now, we'll just extract the mock data
    let data = '';
    if (encryptedData.startsWith('encrypted:')) {
      const base64Data = encryptedData.substring(10);
      data = Buffer.from(base64Data, 'base64').toString();
    }
    
    res.json({ data });
  } catch (error) {
    console.error('Failed to decrypt data:', error);
    res.status(500).json({ error: 'Failed to decrypt data' });
  }
});

/**
 * Generate a re-encryption key
 */
router.post('/re-encryption-key', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const schema = z.object({
      ownerPrivateKey: z.string(),
      targetPublicKey: z.string()
    });
    
    const { ownerPrivateKey, targetPublicKey } = schema.parse(req.body);
    
    // In a real implementation, we would generate a re-encryption key using the Taco library
    // For now, we'll just return a mock key
    const reEncryptionKey = `taco-re-encryption-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    res.json({ reEncryptionKey });
  } catch (error) {
    console.error('Failed to generate re-encryption key:', error);
    res.status(500).json({ error: 'Failed to generate re-encryption key' });
  }
});

/**
 * Re-encrypt data
 */
router.post('/re-encrypt', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const schema = z.object({
      encryptedData: z.string(),
      reEncryptionKey: z.string()
    });
    
    const { encryptedData, reEncryptionKey } = schema.parse(req.body);
    
    // In a real implementation, we would re-encrypt the data using the Taco library
    // For now, we'll just return the same encrypted data
    
    res.json({ reEncryptedData: encryptedData });
  } catch (error) {
    console.error('Failed to re-encrypt data:', error);
    res.status(500).json({ error: 'Failed to re-encrypt data' });
  }
});

/**
 * Share a receipt with another user
 */
router.post('/share-receipt', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const schema = z.object({
      receiptId: z.number(),
      ownerId: z.number(),
      targetId: z.number(),
      encryptedData: z.string(),
      expiresAt: z.string().optional()
    });
    
    const { receiptId, ownerId, targetId, encryptedData, expiresAt } = schema.parse(req.body);
    
    // Create the shared receipt in the database
    const [sharedReceipt] = await db.insert(sharedReceipts).values({
      receiptId,
      ownerId,
      targetId,
      encryptedData,
      createdAt: new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isRevoked: false
    }).returning();
    
    // Get the target username for the response
    const [target] = await db.select().from(users).where(eq(users.id, targetId));
    
    // Get receipt details for the response
    const [receipt] = await db.select().from(receipts).where(eq(receipts.id, receiptId));
    const [merchant] = await db.select().from(merchants).where(eq(merchants.id, receipt.merchantId));
    
    // Return the shared receipt with additional data
    res.json({
      ...sharedReceipt,
      targetName: target.username,
      receipt: {
        id: receipt.id,
        date: receipt.date.toISOString(),
        total: receipt.total,
        merchantName: merchant.name
      }
    });
  } catch (error) {
    console.error('Failed to share receipt:', error);
    res.status(500).json({ error: 'Failed to share receipt' });
  }
});

/**
 * Get all receipts shared by me
 */
router.get('/shared-by-me', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.userId);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    // Get all shared receipts for the user
    const shared = await db.select().from(sharedReceipts).where(eq(sharedReceipts.ownerId, userId));
    
    // Enrich with target user names and receipt details
    const enrichedShared = await Promise.all(
      shared.map(async (sharedReceipt) => {
        // Get target user info
        const [target] = await db.select().from(users).where(eq(users.id, sharedReceipt.targetId));
        
        // Get receipt details
        const [receipt] = await db.select().from(receipts).where(eq(receipts.id, sharedReceipt.receiptId));
        const [merchant] = await db.select().from(merchants).where(eq(merchants.id, receipt.merchantId));
        
        return {
          ...sharedReceipt,
          targetName: target.username,
          receipt: {
            id: receipt.id,
            date: receipt.date.toISOString(),
            total: receipt.total,
            merchantName: merchant.name
          }
        };
      })
    );
    
    res.json(enrichedShared);
  } catch (error) {
    console.error('Failed to get shared receipts:', error);
    res.status(500).json({ error: 'Failed to get shared receipts' });
  }
});

/**
 * Get all receipts shared with me
 */
router.get('/shared-with-me', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.userId);
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    // Get all receipts shared with the user
    const shared = await db.select().from(sharedReceipts).where(eq(sharedReceipts.targetId, userId));
    
    // Enrich with owner user names and receipt details
    const enrichedShared = await Promise.all(
      shared.map(async (sharedReceipt) => {
        // Get owner user info
        const [owner] = await db.select().from(users).where(eq(users.id, sharedReceipt.ownerId));
        
        // Get receipt details
        const [receipt] = await db.select().from(receipts).where(eq(receipts.id, sharedReceipt.receiptId));
        const [merchant] = await db.select().from(merchants).where(eq(merchants.id, receipt.merchantId));
        
        return {
          ...sharedReceipt,
          ownerName: owner.username,
          receipt: {
            id: receipt.id,
            date: receipt.date.toISOString(),
            total: receipt.total,
            merchantName: merchant.name
          }
        };
      })
    );
    
    res.json(enrichedShared);
  } catch (error) {
    console.error('Failed to get receipts shared with user:', error);
    res.status(500).json({ error: 'Failed to get receipts shared with user' });
  }
});

/**
 * Get a specific shared receipt by ID
 */
router.get('/shared-receipts/:id', async (req: Request, res: Response) => {
  try {
    const sharedId = Number(req.params.id);
    
    if (!sharedId) {
      return res.status(400).json({ error: 'Shared receipt ID is required' });
    }
    
    // Get the shared receipt
    const [sharedReceipt] = await db.select().from(sharedReceipts).where(eq(sharedReceipts.id, sharedId));
    
    if (!sharedReceipt) {
      return res.status(404).json({ error: 'Shared receipt not found' });
    }
    
    // Get target user info
    const [target] = await db.select().from(users).where(eq(users.id, sharedReceipt.targetId));
    
    // Get receipt details
    const [receipt] = await db.select().from(receipts).where(eq(receipts.id, sharedReceipt.receiptId));
    const [merchant] = await db.select().from(merchants).where(eq(merchants.id, receipt.merchantId));
    
    // Return the shared receipt with additional data
    res.json({
      ...sharedReceipt,
      targetName: target.username,
      receipt: {
        id: receipt.id,
        date: receipt.date.toISOString(),
        total: receipt.total,
        merchantName: merchant.name
      }
    });
  } catch (error) {
    console.error('Failed to get shared receipt:', error);
    res.status(500).json({ error: 'Failed to get shared receipt' });
  }
});

/**
 * Revoke access to a shared receipt
 */
router.post('/revoke-access/:id', async (req: Request, res: Response) => {
  try {
    const sharedId = Number(req.params.id);
    
    if (!sharedId) {
      return res.status(400).json({ error: 'Shared receipt ID is required' });
    }
    
    // Mark the shared receipt as revoked
    await db.update(sharedReceipts)
      .set({ isRevoked: true })
      .where(eq(sharedReceipts.id, sharedId));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to revoke access:', error);
    res.status(500).json({ error: 'Failed to revoke access' });
  }
});

export default router;
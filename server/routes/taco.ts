/**
 * Taco threshold encryption routes
 * These routes handle threshold encryption operations using the Taco (formerly NuCypher) protocol
 */

import express from 'express';
import { tacoService } from '../services/tacoService';
import { storage } from '../storage';
import { log } from '../vite';

const router = express.Router();

// Mock authentication middleware for demo purposes
const mockAuthMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // In a real application, this would be a proper authentication middleware
  // For now, we'll simulate authentication
  req.isAuthenticated = () => true;
  req.user = { id: 1, username: 'demo_user' };
  next();
};

/**
 * Generate a new Taco encryption key
 */
router.post('/keys', mockAuthMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.body.userId || req.user.id;
    
    const key = await tacoService.generateKeyPair(userId, name || 'Default Taco Key');
    
    res.status(201).json(key);
  } catch (error) {
    log('Error generating Taco key: ' + error, 'taco');
    res.status(500).json({ error: 'Failed to generate Taco key' });
  }
});

/**
 * Get all Taco encryption keys for a user
 */
router.get('/keys', mockAuthMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.query.userId as string) || req.user.id;
    
    // Get all encryption keys for the user
    const keys = await storage.getEncryptionKeys(userId);
    
    // Filter to only include Taco keys
    const tacoKeys = keys.filter(key => key.keyType === 'taco-threshold');
    
    // Remove private keys from the response
    const safeKeys = tacoKeys.map(key => ({
      ...key,
      privateKey: undefined
    }));
    
    res.json(safeKeys);
  } catch (error) {
    log('Error getting Taco keys: ' + error, 'taco');
    res.status(500).json({ error: 'Failed to get Taco keys' });
  }
});

/**
 * Encrypt data using Taco
 */
router.post('/encrypt', mockAuthMiddleware, async (req, res) => {
  try {
    const { data, publicKey } = req.body;
    
    if (!data || !publicKey) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const encryptedData = await tacoService.encrypt(data, publicKey);
    
    res.json({ encryptedData });
  } catch (error) {
    log('Error encrypting with Taco: ' + error, 'taco');
    res.status(500).json({ error: 'Failed to encrypt data' });
  }
});

/**
 * Decrypt data using Taco
 */
router.post('/decrypt', mockAuthMiddleware, async (req, res) => {
  try {
    const { encryptedData, privateKey } = req.body;
    
    if (!encryptedData || !privateKey) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Get encryption key to verify ownership
    // In a real app, you would verify that the user owns this private key
    
    const decryptedData = await tacoService.decrypt(encryptedData, privateKey);
    
    res.json({ decryptedData });
  } catch (error) {
    log('Error decrypting with Taco: ' + error, 'taco');
    res.status(500).json({ error: 'Failed to decrypt data' });
  }
});

/**
 * Generate a re-encryption key
 */
router.post('/reencryption-key', mockAuthMiddleware, async (req, res) => {
  try {
    const { fromPrivateKey, toPublicKey } = req.body;
    
    if (!fromPrivateKey || !toPublicKey) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const reEncryptionKey = await tacoService.generateReEncryptionKey(
      fromPrivateKey,
      toPublicKey
    );
    
    res.json({ reEncryptionKey });
  } catch (error) {
    log('Error generating re-encryption key: ' + error, 'taco');
    res.status(500).json({ error: 'Failed to generate re-encryption key' });
  }
});

/**
 * Re-encrypt data
 */
router.post('/reencrypt', mockAuthMiddleware, async (req, res) => {
  try {
    const { encryptedData, reEncryptionKey } = req.body;
    
    if (!encryptedData || !reEncryptionKey) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const reEncryptedData = await tacoService.reEncrypt(
      encryptedData,
      reEncryptionKey
    );
    
    res.json({ reEncryptedData });
  } catch (error) {
    log('Error re-encrypting with Taco: ' + error, 'taco');
    res.status(500).json({ error: 'Failed to re-encrypt data' });
  }
});

/**
 * Share a receipt with another user using Taco PRE
 */
router.post('/share', mockAuthMiddleware, async (req, res) => {
  try {
    const {
      receiptId,
      ownerId,
      targetId,
      encryptedData,
      ownerPrivateKey,
      targetPublicKey,
      expiresAt
    } = req.body;
    
    if (!receiptId || !ownerId || !targetId || !encryptedData || !ownerPrivateKey || !targetPublicKey) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Verify that the user is the owner of the receipt
    const userId = req.user.id;
    if (userId !== ownerId) {
      return res.status(403).json({ error: 'You do not have permission to share this receipt' });
    }
    
    const sharedAccess = await tacoService.shareReceipt(
      receiptId,
      ownerId,
      targetId,
      encryptedData,
      ownerPrivateKey,
      targetPublicKey,
      expiresAt ? new Date(expiresAt) : undefined
    );
    
    res.status(201).json(sharedAccess);
  } catch (error) {
    log('Error sharing receipt with Taco: ' + error, 'taco');
    res.status(500).json({ error: 'Failed to share receipt' });
  }
});

/**
 * Get decrypted shared receipt
 */
router.post('/shared/:id', mockAuthMiddleware, async (req, res) => {
  try {
    const sharedAccessId = parseInt(req.params.id);
    const { recipientPrivateKey } = req.body;
    
    if (!recipientPrivateKey) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Verify that the user is the target of the shared access
    const sharedAccess = await storage.getSharedAccess(sharedAccessId);
    if (!sharedAccess) {
      return res.status(404).json({ error: 'Shared access not found' });
    }
    
    const userId = req.user.id;
    if (userId !== sharedAccess.targetId) {
      return res.status(403).json({ error: 'You do not have permission to access this shared receipt' });
    }
    
    const sharedReceipt = await tacoService.getSharedReceipt(
      sharedAccessId,
      recipientPrivateKey
    );
    
    res.json(sharedReceipt);
  } catch (error) {
    log('Error getting shared receipt: ' + error, 'taco');
    res.status(500).json({ error: 'Failed to get shared receipt' });
  }
});

/**
 * Get all shared accesses for a receipt
 */
router.get('/shared', mockAuthMiddleware, async (req, res) => {
  try {
    const receiptId = parseInt(req.query.receiptId as string);
    
    if (!receiptId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Verify that the user is the owner of the receipt
    const receipt = await storage.getReceipt(receiptId);
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    
    const userId = req.user.id;
    if (userId !== receipt.userId) {
      return res.status(403).json({ error: 'You do not have permission to view shared accesses for this receipt' });
    }
    
    const sharedAccesses = await storage.getSharedAccesses(receiptId);
    
    res.json(sharedAccesses);
  } catch (error) {
    log('Error getting shared accesses: ' + error, 'taco');
    res.status(500).json({ error: 'Failed to get shared accesses' });
  }
});

/**
 * Get all receipts shared with the current user
 */
router.get('/shared/with-me', mockAuthMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.query.userId as string) || req.user.id;
    
    const sharedAccesses = await storage.getSharedAccessesByTarget(userId);
    
    // For each shared access, get the receipt details
    const sharedReceipts = await Promise.all(
      sharedAccesses.map(async (access) => {
        const receipt = await storage.getFullReceipt(access.receiptId);
        return {
          access,
          receipt
        };
      })
    );
    
    res.json(sharedReceipts);
  } catch (error) {
    log('Error getting receipts shared with me: ' + error, 'taco');
    res.status(500).json({ error: 'Failed to get shared receipts' });
  }
});

/**
 * Get all receipts shared by the current user
 */
router.get('/shared/by-me', mockAuthMiddleware, async (req, res) => {
  try {
    const userId = parseInt(req.query.userId as string) || req.user.id;
    
    const sharedAccesses = await storage.getSharedAccessesByOwner(userId);
    
    // For each shared access, get the receipt details
    const sharedReceipts = await Promise.all(
      sharedAccesses.map(async (access) => {
        const receipt = await storage.getFullReceipt(access.receiptId);
        return {
          access,
          receipt
        };
      })
    );
    
    res.json(sharedReceipts);
  } catch (error) {
    log('Error getting receipts shared by me: ' + error, 'taco');
    res.status(500).json({ error: 'Failed to get shared receipts' });
  }
});

export default router;
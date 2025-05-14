/**
 * Taco threshold encryption routes
 * These routes handle threshold encryption operations using the Taco (formerly NuCypher) protocol
 */

import { Router } from "express";
import { tacoService } from "../services/tacoService";
import { storage } from "../storage";
import { log } from "../vite";

const router = Router();

// Middleware to mock authentication for demo purposes
// In a real app, this would be handled by a proper auth system
const mockAuth = (req: any, res: any, next: any) => {
  // Set a mock user ID
  req.isAuthenticated = () => true;
  req.user = { id: 1 };
  next();
};

/**
 * Generate a new Taco encryption key
 */
router.post("/keys/generate", mockAuth, async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { keyName } = req.body;
    
    if (!keyName) {
      return res.status(400).json({ error: "Key name is required" });
    }

    const userId = req.user.id;
    const encryptionKey = await tacoService.generateKeyPair(userId, keyName);
    
    if (!encryptionKey) {
      return res.status(500).json({ error: "Failed to generate Taco key pair" });
    }

    res.json(encryptionKey);
  } catch (error: any) {
    log(`Error generating Taco key: ${error.message}`, 'error');
    res.status(500).json({ error: error.message });
  }
});

/**
 * Encrypt data using Taco
 */
router.post("/encrypt", mockAuth, async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { data, keyId } = req.body;
    
    if (!data || !keyId) {
      return res.status(400).json({ error: "Data and key ID are required" });
    }

    // Get encryption key
    const key = await storage.getEncryptionKey(keyId);
    if (!key) {
      return res.status(404).json({ error: "Encryption key not found" });
    }

    // Check ownership
    if (key.userId !== req.user.id) {
      return res.status(403).json({ error: "You don't own this encryption key" });
    }

    // Encrypt data
    const encryptedData = await tacoService.encrypt(data, key.publicKey);
    if (!encryptedData) {
      return res.status(500).json({ error: "Failed to encrypt data" });
    }

    res.json({ encryptedData });
  } catch (error: any) {
    log(`Error encrypting data: ${error.message}`, 'error');
    res.status(500).json({ error: error.message });
  }
});

/**
 * Decrypt data using Taco
 */
router.post("/decrypt", mockAuth, async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const { encryptedData, keyId } = req.body;
    
    if (!encryptedData || !keyId) {
      return res.status(400).json({ error: "Encrypted data and key ID are required" });
    }

    // Get encryption key
    const key = await storage.getEncryptionKey(keyId);
    if (!key) {
      return res.status(404).json({ error: "Encryption key not found" });
    }

    // Check ownership
    if (key.userId !== req.user.id) {
      return res.status(403).json({ error: "You don't own this encryption key" });
    }

    // In a real app, you would need to decrypt the encryptedPrivateKey using the user's password
    const privateKey = key.encryptedPrivateKey;

    // Decrypt data
    const decryptedData = await tacoService.decrypt(encryptedData, privateKey);
    if (!decryptedData) {
      return res.status(500).json({ error: "Failed to decrypt data" });
    }

    res.json({ decryptedData });
  } catch (error: any) {
    log(`Error decrypting data: ${error.message}`, 'error');
    res.status(500).json({ error: error.message });
  }
});

/**
 * Share a receipt with another user using Taco PRE
 */
router.post("/share/:receiptId", mockAuth, async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const receiptId = parseInt(req.params.receiptId);
    const { targetUserId, accessLevel, expiresAt } = req.body;
    
    if (!targetUserId) {
      return res.status(400).json({ error: "Target user ID is required" });
    }

    // Get receipt
    const receipt = await storage.getReceipt(receiptId);
    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    // Check ownership
    if (receipt.userId !== req.user.id) {
      return res.status(403).json({ error: "You don't own this receipt" });
    }

    // Parse expiration date if provided
    let expirationDate: Date | undefined = undefined;
    if (expiresAt) {
      expirationDate = new Date(expiresAt);
    }

    // Share receipt
    const sharedAccess = await tacoService.shareReceipt(
      receiptId,
      req.user.id,
      parseInt(targetUserId),
      accessLevel || "full",
      expirationDate
    );

    if (!sharedAccess) {
      return res.status(500).json({ error: "Failed to share receipt" });
    }

    res.json(sharedAccess);
  } catch (error: any) {
    log(`Error sharing receipt: ${error.message}`, 'error');
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get decrypted shared receipt
 */
router.get("/shared/:receiptId", mockAuth, async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const receiptId = parseInt(req.params.receiptId);
    
    // Get shared receipt
    const receipt = await tacoService.getSharedReceipt(receiptId, req.user.id);
    
    if (!receipt) {
      return res.status(404).json({ error: "Shared receipt not found or access denied" });
    }

    res.json(receipt);
  } catch (error: any) {
    log(`Error getting shared receipt: ${error.message}`, 'error');
    res.status(500).json({ error: error.message });
  }
});

export default router;
import express from "express";
import { tacoService } from "../services/tacoService";
import { db } from "../db";
import { storage } from "../storage";
import { 
  tacoKeys, 
  sharedReceipts, 
  receipts, 
  merchants, 
  users 
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

const router = express.Router();

/**
 * Initialize the Taco service
 */
router.get("/init", async (req, res) => {
  try {
    const initialized = await tacoService.initialize();
    res.json({ success: initialized });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Check if Taco service is initialized
 */
router.get("/status", async (req, res) => {
  try {
    const initialized = tacoService.isInitialized();
    res.json({ initialized });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generate a new Taco key pair
 */
router.post("/keys", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const key = await tacoService.generateKeyPair(userId, name);
    res.json(key);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all Taco keys for a user
 */
router.get("/keys", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const userId = req.user.id;
    const keys = await db.select().from(tacoKeys).where(eq(tacoKeys.userId, userId));
    res.json(keys);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Encrypt data using a public key
 */
router.post("/encrypt", async (req, res) => {
  try {
    const { data, publicKey } = req.body;

    if (!data || !publicKey) {
      return res.status(400).json({ error: "Data and publicKey are required" });
    }

    const encryptedData = await tacoService.encrypt(data, publicKey);
    res.json({ encryptedData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Decrypt data using a private key
 */
router.post("/decrypt", async (req, res) => {
  try {
    const { encryptedData, privateKey } = req.body;

    if (!encryptedData || !privateKey) {
      return res.status(400).json({ error: "Encrypted data and privateKey are required" });
    }

    const decryptedData = await tacoService.decrypt(encryptedData, privateKey);
    res.json({ decryptedData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Generate a re-encryption key
 */
router.post("/re-encryption-key", async (req, res) => {
  try {
    const { senderPrivateKey, receiverPublicKey } = req.body;

    if (!senderPrivateKey || !receiverPublicKey) {
      return res.status(400).json({ error: "Sender private key and receiver public key are required" });
    }

    const reEncryptionKey = await tacoService.generateReEncryptionKey(
      senderPrivateKey,
      receiverPublicKey
    );
    res.json({ reEncryptionKey });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Re-encrypt data
 */
router.post("/re-encrypt", async (req, res) => {
  try {
    const { encryptedData, reEncryptionKey } = req.body;

    if (!encryptedData || !reEncryptionKey) {
      return res.status(400).json({ error: "Encrypted data and re-encryption key are required" });
    }

    const reEncryptedData = await tacoService.reEncrypt(encryptedData, reEncryptionKey);
    res.json({ reEncryptedData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Share a receipt with another user
 */
router.post("/share-receipt", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { receiptId, targetId, encryptedData, expiresAt } = req.body;
    const ownerId = req.user.id;

    if (!receiptId || !targetId || !encryptedData) {
      return res.status(400).json({ 
        error: "Receipt ID, target user ID, and encrypted data are required" 
      });
    }

    // Ensure the receipt belongs to the user
    const receipt = await db.select().from(receipts).where(eq(receipts.id, receiptId));
    if (receipt.length === 0) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    if (receipt[0].userId !== ownerId) {
      return res.status(403).json({ error: "You can only share your own receipts" });
    }

    // Check if target user exists
    const targetUser = await db.select().from(users).where(eq(users.id, targetId));
    if (targetUser.length === 0) {
      return res.status(404).json({ error: "Target user not found" });
    }

    const [sharedReceipt] = await db
      .insert(sharedReceipts)
      .values({
        receiptId,
        ownerId,
        targetId,
        encryptedData,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      })
      .returning();

    res.json(sharedReceipt);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all receipts shared by me
 */
router.get("/shared-by-me", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const userId = req.user.id;

    const shared = await db
      .select({
        id: sharedReceipts.id,
        receiptId: sharedReceipts.receiptId,
        targetId: sharedReceipts.targetId,
        createdAt: sharedReceipts.createdAt,
        expiresAt: sharedReceipts.expiresAt,
        isRevoked: sharedReceipts.isRevoked,
        targetName: users.username,
        receipt: {
          id: receipts.id,
          date: receipts.date,
          total: receipts.total,
          merchantName: merchants.name,
        },
      })
      .from(sharedReceipts)
      .innerJoin(receipts, eq(sharedReceipts.receiptId, receipts.id))
      .innerJoin(merchants, eq(receipts.merchantId, merchants.id))
      .innerJoin(users, eq(sharedReceipts.targetId, users.id))
      .where(eq(sharedReceipts.ownerId, userId));

    res.json(shared);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get all receipts shared with me
 */
router.get("/shared-with-me", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const userId = req.user.id;

    const shared = await db
      .select({
        id: sharedReceipts.id,
        receiptId: sharedReceipts.receiptId,
        ownerId: sharedReceipts.ownerId,
        encryptedData: sharedReceipts.encryptedData,
        createdAt: sharedReceipts.createdAt,
        expiresAt: sharedReceipts.expiresAt,
        isRevoked: sharedReceipts.isRevoked,
        ownerName: users.username,
        receipt: {
          id: receipts.id,
          date: receipts.date,
          total: receipts.total,
          merchantName: merchants.name,
        },
      })
      .from(sharedReceipts)
      .innerJoin(receipts, eq(sharedReceipts.receiptId, receipts.id))
      .innerJoin(merchants, eq(receipts.merchantId, merchants.id))
      .innerJoin(users, eq(sharedReceipts.ownerId, users.id))
      .where(
        and(
          eq(sharedReceipts.targetId, userId),
          eq(sharedReceipts.isRevoked, false)
        )
      );

    res.json(shared);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Get a specific shared receipt by ID
 */
router.get("/shared/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const sharedId = parseInt(req.params.id);
    const userId = req.user.id;

    const [shared] = await db
      .select()
      .from(sharedReceipts)
      .where(
        and(
          eq(sharedReceipts.id, sharedId),
          eq(sharedReceipts.targetId, userId),
          eq(sharedReceipts.isRevoked, false)
        )
      );

    if (!shared) {
      return res.status(404).json({ error: "Shared receipt not found" });
    }

    // Check if expired
    if (shared.expiresAt && new Date(shared.expiresAt) < new Date()) {
      return res.status(403).json({ error: "Shared receipt has expired" });
    }

    res.json(shared);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Revoke access to a shared receipt
 */
router.post("/revoke/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const sharedId = parseInt(req.params.id);
    const userId = req.user.id;

    const [shared] = await db
      .select()
      .from(sharedReceipts)
      .where(
        and(
          eq(sharedReceipts.id, sharedId),
          eq(sharedReceipts.ownerId, userId)
        )
      );

    if (!shared) {
      return res.status(404).json({ error: "Shared receipt not found or not owned by you" });
    }

    await db
      .update(sharedReceipts)
      .set({ isRevoked: true })
      .where(eq(sharedReceipts.id, sharedId));

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
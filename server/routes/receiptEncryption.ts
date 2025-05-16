/**
 * Receipt Encryption API Routes
 * 
 * These routes handle TaCo threshold encryption operations for receipt metadata,
 * including encryption, decryption, granting and revoking access.
 */
import { Router } from 'express';
import { tacoService } from '../services/tacoService';
import { requireAuth } from '../middleware/auth';
import console from 'console';
import { z } from 'zod';

const router = Router();

// Define validation schemas
const receiptMetadataSchema = z.object({
  items: z.array(z.object({
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })),
  merchantName: z.string(),
  date: z.string(),
  total: z.number(),
  subtotal: z.number(),
  tax: z.number(),
  category: z.string().optional(),
});

const encryptedDataSchema = z.object({
  capsule: z.string(),
  ciphertext: z.string(),
});

/**
 * Encrypt receipt metadata
 * POST /api/receipt-encryption/encrypt
 */
router.post('/encrypt', requireAuth, async (req, res) => {
  try {
    // Validate incoming receipt data
    const validationResult = receiptMetadataSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid receipt data format',
        errors: validationResult.error.errors
      });
    }

    const receiptData = validationResult.data;
    const publicKey = req.body.publicKey || undefined;

    // Encrypt the receipt metadata
    const encryptedData = await tacoService.encryptReceiptMetadata(receiptData, publicKey);

    return res.json({
      success: true,
      encryptedData
    });
  } catch (error: any) {
    console.error('Receipt encryption error:', error);
    return res.status(500).json({
      success: false,
      message: `Error encrypting receipt: ${error.message}`
    });
  }
});

/**
 * Decrypt receipt metadata
 * POST /api/receipt-encryption/decrypt
 */
router.post('/decrypt', requireAuth, async (req, res) => {
  try {
    // Validate incoming encrypted data
    const validationResult = encryptedDataSchema.safeParse(req.body.encryptedData);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid encrypted data format',
        errors: validationResult.error.errors
      });
    }

    const { publicKey } = req.body;
    if (!publicKey) {
      return res.status(400).json({
        success: false,
        message: 'Public key is required for decryption'
      });
    }

    // Decrypt the receipt metadata
    const decryptedData = await tacoService.decryptReceiptMetadata(
      validationResult.data,
      publicKey
    );

    return res.json({
      success: true,
      decryptedData
    });
  } catch (error: any) {
    console.error('Receipt decryption error:', error);
    return res.status(500).json({
      success: false,
      message: `Error decrypting receipt: ${error.message}`
    });
  }
});

/**
 * Grant receipt access to another user
 * POST /api/receipt-encryption/grant-access
 */
router.post('/grant-access', requireAuth, async (req, res) => {
  try {
    // Validate incoming encrypted data
    const validationResult = encryptedDataSchema.safeParse(req.body.encryptedData);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid encrypted data format',
        errors: validationResult.error.errors
      });
    }

    const { ownerPublicKey, recipientPublicKey } = req.body;
    if (!ownerPublicKey || !recipientPublicKey) {
      return res.status(400).json({
        success: false,
        message: 'Owner and recipient public keys are required'
      });
    }

    // Grant access by creating re-encrypted data for the recipient
    const reEncryptedData = await tacoService.grantReceiptAccess(
      validationResult.data,
      ownerPublicKey,
      recipientPublicKey
    );

    return res.json({
      success: true,
      reEncryptedData
    });
  } catch (error: any) {
    console.error('Receipt access grant error:', error);
    return res.status(500).json({
      success: false,
      message: `Error granting receipt access: ${error.message}`
    });
  }
});

/**
 * Revoke receipt access from a user
 * POST /api/receipt-encryption/revoke-access
 */
router.post('/revoke-access', requireAuth, async (req, res) => {
  try {
    const { receiptId, recipientPublicKey } = req.body;
    if (!receiptId || !recipientPublicKey) {
      return res.status(400).json({
        success: false,
        message: 'Receipt ID and recipient public key are required'
      });
    }

    // Revoke access
    const success = await tacoService.revokeReceiptAccess(receiptId, recipientPublicKey);

    return res.json({
      success
    });
  } catch (error: any) {
    console.error('Receipt access revocation error:', error);
    return res.status(500).json({
      success: false,
      message: `Error revoking receipt access: ${error.message}`
    });
  }
});

export default router;
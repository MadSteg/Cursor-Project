/**
 * Hot Wallet Management API Routes
 * 
 * These routes provide endpoints for managing hot wallets with TACo encryption.
 */
import { Router } from 'express';
import { walletService } from '../services/walletService';
import { z } from 'zod';
import { validateRequest } from '../middleware/validation';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Validation schemas
const generateWalletSchema = z.object({
  userId: z.number().int().positive(),
  tacoPublicKey: z.string().min(10)
});

const recoverWalletSchema = z.object({
  recipientPrivateKey: z.string().min(10)
});

/**
 * Generate a new hot wallet for the current user
 * POST /api/wallet/generate
 */
router.post(
  '/generate',
  requireAuth,
  validateRequest(generateWalletSchema),
  async (req, res) => {
    try {
      const { userId, tacoPublicKey } = req.body;
      
      // For security, ensure userId in request matches authenticated user
      if (req.user!.id !== userId) {
        return res.status(403).json({ error: 'Unauthorized access to wallet creation' });
      }
      
      const walletAddress = await walletService.generateEncryptedWallet(
        userId,
        tacoPublicKey
      );
      
      res.json({ success: true, walletAddress });
    } catch (error: any) {
      console.error('Error generating wallet:', error);
      res.status(500).json({ error: error.message || 'Failed to generate wallet' });
    }
  }
);

/**
 * Generate a wallet during registration (handled by auth service)
 * This is an internal endpoint, not exposed to clients
 * POST /api/wallet/generate-for-new-user
 */
router.post(
  '/generate-for-new-user',
  async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId || typeof userId !== 'number') {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
      
      const result = await walletService.generateWalletForNewUser(userId);
      
      res.json({
        success: true,
        walletAddress: result.address,
        tacoKey: result.tacoKey
      });
    } catch (error: any) {
      console.error('Error generating wallet for new user:', error);
      res.status(500).json({ error: error.message || 'Failed to generate wallet for new user' });
    }
  }
);

/**
 * Recover a wallet's private key using TACo decryption
 * POST /api/wallet/recover
 */
router.post(
  '/recover',
  requireAuth,
  validateRequest(recoverWalletSchema),
  async (req, res) => {
    try {
      const { recipientPrivateKey } = req.body;
      
      const privateKey = await walletService.recoverWalletPrivateKey(
        req.user!.id,
        recipientPrivateKey
      );
      
      res.json({ success: true, privateKey });
    } catch (error: any) {
      console.error('Error recovering wallet private key:', error);
      res.status(500).json({ error: error.message || 'Failed to recover wallet private key' });
    }
  }
);

/**
 * Get user info for a wallet address
 * GET /api/wallet/user-info/:address
 */
router.get(
  '/user-info/:address',
  async (req, res) => {
    try {
      const { address } = req.params;
      
      const userInfo = await walletService.getWalletUserInfo(address);
      
      if (!userInfo) {
        return res.status(404).json({ error: 'Wallet not found or not associated with a user' });
      }
      
      res.json({ success: true, ...userInfo });
    } catch (error: any) {
      console.error('Error getting wallet user info:', error);
      res.status(500).json({ error: error.message || 'Failed to get wallet user info' });
    }
  }
);

export default router;
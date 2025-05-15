/**
 * Wallet Routes
 * 
 * Handles wallet linking, generation, and management
 */
import { Router } from 'express';
import { z } from 'zod';
import { authService } from '../services/authService';
import { tacoService } from '../services/tacoService';

const router = Router();

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.session?.userId) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }
  next();
};

// Link wallet schema
const linkWalletSchema = z.object({
  walletAddress: z.string(),
  encryptedPrivateKey: z.string().optional(),
});

// Generate wallet schema
const generateWalletSchema = z.object({
  tacoPublicKey: z.string().optional(),
});

// Generate wallet for new user
router.post('/generate-for-new-user', async (req, res) => {
  try {
    // In a real implementation, this would be tied to a user session
    // For demo purposes, we're creating a demo wallet
    
    // Simulate creating a Taco key pair
    const tacoKeyPair = await tacoService.generateKeyPair(1, 'Default Key');
    
    // Mock wallet generation for demo
    const wallet = {
      address: '0xD8c7d4e0D8E44Ec8A78FF65F7a405e6621520E9E',
      privateKey: '0x86de521f02f7e0f456574b1a0d2cc0bf5ee4a2024fe2e064b1e2fd10be6a2b45',
    };
    
    res.json({
      success: true,
      wallet: {
        address: wallet.address,
        privateKey: wallet.privateKey,
        encrypted: false,
      },
      tacoPublicKey: tacoKeyPair.publicKey,
    });
  } catch (error) {
    console.error('Error generating wallet for new user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create wallet for new user',
    });
  }
});

// Link wallet to user account
router.post('/link', requireAuth, async (req, res) => {
  try {
    const { walletAddress, encryptedPrivateKey } = linkWalletSchema.parse(req.body);
    
    const userWallet = await authService.linkWalletToUser(
      req.session.userId, 
      walletAddress, 
      encryptedPrivateKey
    );
    
    // Update session
    req.session.walletAddress = userWallet.address;
    
    res.json({
      success: true,
      wallet: {
        address: userWallet.address,
        hasPrivateKey: !!userWallet.encryptedPrivateKey,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    } else {
      console.error('Wallet linking error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to link wallet',
      });
    }
  }
});

// Generate new wallet for existing user
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { tacoPublicKey } = generateWalletSchema.parse(req.body);
    
    // This would use the real implementation in a production environment
    // For demo, return a mock wallet
    
    res.json({
      success: true,
      wallet: {
        address: '0xD8c7d4e0D8E44Ec8A78FF65F7a405e6621520E9E',
        privateKey: '0x86de521f02f7e0f456574b1a0d2cc0bf5ee4a2024fe2e064b1e2fd10be6a2b45',
        encrypted: false,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    } else {
      console.error('Wallet generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate wallet',
      });
    }
  }
});

// Get current user's wallet
router.get('/current', requireAuth, async (req, res) => {
  try {
    const walletAddress = req.session.walletAddress;
    
    if (!walletAddress) {
      return res.json({
        success: true,
        wallet: null,
      });
    }
    
    // For demo purposes, return a mock wallet
    res.json({
      success: true,
      wallet: {
        address: walletAddress,
        privateKey: 'ENCRYPTED', // Never return the real private key
        encrypted: true,
      },
    });
  } catch (error) {
    console.error('Error getting wallet:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get wallet',
    });
  }
});

export default router;
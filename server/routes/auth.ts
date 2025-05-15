/**
 * Authentication Routes
 */
import { Router } from 'express';
import { z } from 'zod';
import { authService } from '../services/authService';

const router = Router();

// User signup schema
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().optional(),
  wantsWallet: z.boolean().default(false),
  tacoPublicKey: z.string().optional(),
});

// Login schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Web3 login schema
const web3LoginSchema = z.object({
  walletAddress: z.string(),
  signature: z.string(),
  nonce: z.string(),
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName, wantsWallet, tacoPublicKey } = signupSchema.parse(req.body);
    
    const result = await authService.registerUser({
      email,
      password,
      wantsWallet,
      tacoPublicKey,
    });
    
    // Set user in session
    if (req.session) {
      req.session.userId = result.user.id;
      req.session.walletAddress = result.walletAddress;
    }
    
    // Return success without sensitive info
    res.status(201).json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
      },
      wallet: result.walletAddress ? {
        address: result.walletAddress,
      } : null,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    } else {
      console.error('Signup error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create account',
      });
    }
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const result = await authService.loginWithEmail(email, password);
    
    // Set user in session
    if (req.session) {
      req.session.userId = result.user.id;
      req.session.walletAddress = result.walletAddress;
    }
    
    // Return success without sensitive info
    res.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
      },
      wallet: result.walletAddress ? {
        address: result.walletAddress,
      } : null,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    } else {
      console.error('Login error:', error);
      res.status(401).json({
        success: false,
        error: 'Authentication failed',
      });
    }
  }
});

// Web3 wallet login
router.post('/web3-login', async (req, res) => {
  try {
    const { walletAddress, signature, nonce } = web3LoginSchema.parse(req.body);
    
    const result = await authService.loginWithWeb3(walletAddress, signature, nonce);
    
    // Set user in session
    if (req.session) {
      req.session.userId = result.user.id;
      req.session.walletAddress = result.walletAddress;
    }
    
    // Return success without sensitive info
    res.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.fullName,
      },
      wallet: {
        address: result.walletAddress,
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
      console.error('Web3 login error:', error);
      res.status(401).json({
        success: false,
        error: 'Authentication failed',
      });
    }
  }
});

// Get authentication nonce for Web3 wallet signing
router.get('/nonce/:address', (req, res) => {
  // In a production environment, this would generate a unique nonce and store it
  // For simplicity, we're using a fixed message with a timestamp
  const timestamp = new Date().getTime();
  const nonce = `${timestamp}`;
  
  res.json({
    success: true,
    nonce,
    message: `Log into BlockReceipt: ${nonce}`,
  });
});

// Logout route
router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error('Logout error:', err);
        res.status(500).json({
          success: false,
          error: 'Failed to logout',
        });
      } else {
        res.json({
          success: true,
          message: 'Logged out successfully',
        });
      }
    });
  } else {
    res.json({
      success: true,
      message: 'Already logged out',
    });
  }
});

// Get current user info
router.get('/me', (req, res) => {
  if (req.session?.userId) {
    res.json({
      success: true,
      user: {
        id: req.session.userId,
        walletAddress: req.session.walletAddress || null,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Not authenticated',
    });
  }
});

export default router;
/**
 * Wallet Routes
 * 
 * Routes for wallet management and TACo encrypted wallet operations
 */
import { Router, Request, Response, NextFunction } from 'express';
// No need for RequestWithUser type, using type assertions instead
import { ethers } from 'ethers';
import { WalletService } from '../services/walletService';
import { tacoService } from '../services/tacoService';

const walletRouter = Router();
const walletService = new WalletService();

// Export as default to match other route files
export default walletRouter;

/**
 * Middleware to ensure the user is authenticated
 */
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as any).isAuthenticated()) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }
  next();
};

/**
 * Get the current user's wallet
 * GET /api/wallet/my-wallet
 */
walletRouter.get("/my-wallet", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const wallet = await walletService.getUserWallet(userId);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: 'No wallet found for this user'
      });
    }
    
    return res.json({
      success: true,
      wallet: {
        address: wallet.address,
        createdAt: wallet.createdAt,
        lastUsedAt: wallet.lastUsedAt
      }
    });
  } catch (error: any) {
    console.error('Error fetching wallet:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve wallet'
    });
  }
});

/**
 * Generate a new wallet for the current user
 * POST /api/wallet/generate
 */
walletRouter.post("/generate", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { tacoPublicKey } = req.body;
    
    // Check if user already has a wallet
    const existingWallet = await walletService.getUserWallet(userId);
    if (existingWallet) {
      return res.status(400).json({
        success: false,
        error: 'User already has a wallet'
      });
    }
    
    // Generate a new wallet
    const { address, privateKey } = await walletService.generateWallet();
    
    // Encrypt the private key using TACo
    const encryptedPrivateKey = await tacoService.encryptPrivateKey(privateKey, tacoPublicKey, userId);
    
    // Store the wallet
    await walletService.storeWallet(userId, address, encryptedPrivateKey);
    
    return res.json({
      success: true,
      wallet: {
        address
      }
    });
  } catch (error: any) {
    console.error('Error generating wallet:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate wallet'
    });
  }
});

/**
 * Get wallet balance
 * GET /api/wallet/balance/:address
 */
walletRouter.get("/balance/:address", async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    // Validate the address
    if (!ethers.utils.isAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address'
      });
    }
    
    // Get balance (default to Polygon network)
    const balance = await walletService.getWalletBalance(address, 'polygon');
    
    return res.json({
      success: true,
      balance,
      network: 'polygon'
    });
  } catch (error: any) {
    console.error('Error fetching wallet balance:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve balance'
    });
  }
});

/**
 * Decrypt the user's private key using TACo
 * POST /api/wallet/decrypt-private-key
 */
walletRouter.post("/decrypt-private-key", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { tacoPublicKey } = req.body;
    
    if (!tacoPublicKey) {
      return res.status(400).json({
        success: false,
        error: 'TACo public key is required'
      });
    }
    
    // Get user's wallet
    const wallet = await walletService.getUserWallet(userId);
    if (!wallet || !wallet.encryptedPrivateKey) {
      return res.status(404).json({
        success: false,
        error: 'No wallet or encrypted private key found'
      });
    }
    
    // Decrypt the private key
    const privateKey = await tacoService.decryptPrivateKey(
      wallet.encryptedPrivateKey, 
      tacoPublicKey,
      userId
    );
    
    // Update last used timestamp
    await walletService.updateLastUsed(wallet.address);
    
    return res.json({
      success: true,
      privateKey: privateKey
    });
  } catch (error: any) {
    console.error('Error decrypting private key:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to decrypt private key'
    });
  }
});
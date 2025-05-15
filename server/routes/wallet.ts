/**
 * Wallet Routes
 * 
 * Routes for wallet management and TACo encrypted wallet operations
 */
import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AuthService } from "../services/authService";
import { TacoService } from "../services/tacoService";
import { WalletService } from "../services/walletService";

export const walletRouter = Router();

// Authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }
  
  next();
};

// Initialize services
const tacoService = new TacoService();
const walletService = new WalletService();
const authService = new AuthService(tacoService, walletService);

// Get user wallet
walletRouter.get("/my-wallet", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId as number;
    
    // Get the wallet
    const wallet = await walletService.getUserWallet(userId);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: "Wallet not found",
      });
    }
    
    // Return wallet info (excluding private key)
    return res.json({
      success: true,
      wallet: {
        address: wallet.address,
      },
    });
  } catch (error: any) {
    console.error("Error getting wallet:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to get wallet",
    });
  }
});

// Generate a new wallet
walletRouter.post("/generate", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId as number;
    const { tacoPublicKey } = req.body;
    
    if (!tacoPublicKey) {
      return res.status(400).json({
        success: false,
        error: "TACo public key is required for wallet generation",
      });
    }
    
    // Check if user already has a wallet
    const existingWallet = await walletService.getUserWallet(userId);
    
    if (existingWallet) {
      return res.status(400).json({
        success: false,
        error: "User already has a wallet",
      });
    }
    
    // Generate a new wallet
    const wallet = await walletService.generateWallet();
    
    // Encrypt and store the wallet private key
    await tacoService.encryptPrivateKeyWithTACo(
      userId,
      wallet.privateKey,
      tacoPublicKey
    );
    
    // Link the wallet to the user
    await authService.linkWalletToUser(userId, wallet.address);
    
    // Return wallet info (excluding private key)
    return res.json({
      success: true,
      wallet: {
        address: wallet.address,
      },
    });
  } catch (error: any) {
    console.error("Error generating wallet:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate wallet",
    });
  }
});

// Get wallet balance
walletRouter.get("/balance/:address", async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        error: "Wallet address is required",
      });
    }
    
    // Get the balance
    const balance = await walletService.getWalletBalance(address);
    
    return res.json({
      success: true,
      balance,
    });
  } catch (error: any) {
    console.error("Error getting wallet balance:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to get wallet balance",
    });
  }
});

// Retrieve encrypted wallet private key
walletRouter.post("/decrypt-private-key", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.session.userId as number;
    const { tacoPrivateKey } = req.body;
    
    if (!tacoPrivateKey) {
      return res.status(400).json({
        success: false,
        error: "TACo private key is required to decrypt wallet",
      });
    }
    
    // Get the wallet
    const wallet = await walletService.getUserWallet(userId);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: "Wallet not found",
      });
    }
    
    // Decrypt the private key
    const privateKey = await tacoService.decryptWalletPrivateKey(
      wallet,
      tacoPrivateKey
    );
    
    // Return the private key
    return res.json({
      success: true,
      privateKey,
    });
  } catch (error: any) {
    console.error("Error decrypting wallet:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to decrypt wallet",
    });
  }
});

export default walletRouter;
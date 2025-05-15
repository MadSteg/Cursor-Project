/**
 * Wallet Service
 * 
 * This service provides functionality for creating and managing blockchain wallets.
 * It supports hot wallet generation with TACo encryption for enhanced security.
 */
import { ethers } from 'ethers';
import { tacoService, TacoEncryptionResult } from './tacoService';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

class WalletService {
  /**
   * Generate a new Ethereum wallet (keypair)
   */
  generateWallet(): { address: string; privateKey: string } {
    // Create a new random wallet
    const wallet = ethers.Wallet.createRandom();
    
    return {
      address: wallet.address,
      privateKey: wallet.privateKey
    };
  }
  
  /**
   * Generate and encrypt a new wallet for a user
   * @param userId The user ID
   * @param tacoPublicKey The user's TACo public key for encryption
   */
  async generateEncryptedWallet(userId: number, tacoPublicKey: string): Promise<string> {
    try {
      // First check if the user already has a wallet
      const existingWallet = await tacoService.getUserWallet(userId);
      if (existingWallet) {
        return existingWallet.address;
      }
      
      // Generate a new wallet
      const wallet = this.generateWallet();
      
      // Encrypt the private key using TACo
      const encryptedWallet = await tacoService.encryptWithTACo(
        tacoPublicKey,
        wallet.privateKey
      );
      
      // Store the encrypted wallet
      await tacoService.storeEncryptedWallet(
        userId,
        wallet.address,
        encryptedWallet
      );
      
      // Return the wallet address (public part)
      return wallet.address;
    } catch (error) {
      console.error("Error generating encrypted wallet:", error);
      throw new Error("Failed to generate encrypted wallet");
    }
  }
  
  /**
   * Generate an encrypted wallet during user registration
   * @param userId The user ID
   */
  async generateWalletForNewUser(userId: number): Promise<{ address: string; tacoKey: string; }> {
    try {
      // First, generate a TACo key pair for the user
      const key = await tacoService.generateKeyPair(userId, "Default Key");
      
      // Now generate an encrypted wallet using that key
      const address = await this.generateEncryptedWallet(userId, key.publicKey);
      
      return {
        address,
        tacoKey: key.publicKey
      };
    } catch (error) {
      console.error("Error creating wallet for new user:", error);
      throw new Error("Failed to create wallet for new user");
    }
  }
  
  /**
   * Recover a wallet's private key using the user's authentication
   * @param userId The user ID
   * @param recipientPrivateKey The recipient's TACo private key
   */
  async recoverWalletPrivateKey(userId: number, recipientPrivateKey: string): Promise<string> {
    try {
      // Get the user's encrypted wallet
      const wallet = await tacoService.getUserWallet(userId);
      if (!wallet) {
        throw new Error("User has no encrypted wallet");
      }
      
      // Decrypt the wallet private key
      const privateKey = await tacoService.decryptWalletPrivateKey(
        wallet,
        recipientPrivateKey
      );
      
      // Update the last usage timestamp
      await tacoService.updateWalletUsage(wallet.id);
      
      return privateKey;
    } catch (error) {
      console.error("Error recovering wallet private key:", error);
      throw new Error("Failed to recover wallet private key");
    }
  }
  
  /**
   * Get a user ID from a wallet address
   * @param address The wallet address
   */
  async getUserIdFromWalletAddress(address: string): Promise<number | null> {
    try {
      const wallet = await tacoService.getWalletByAddress(address);
      return wallet ? wallet.userId : null;
    } catch (error) {
      console.error("Error getting user ID from wallet address:", error);
      return null;
    }
  }
  
  /**
   * Check if a wallet exists and return user info if it does
   * @param address The wallet address to check
   */
  async getWalletUserInfo(address: string): Promise<{ userId: number; username: string } | null> {
    try {
      // Get the wallet by address
      const wallet = await tacoService.getWalletByAddress(address);
      if (!wallet) {
        return null;
      }
      
      // Get the user info
      const [user] = await db.select({
        id: users.id,
        username: users.username
      })
      .from(users)
      .where(eq(users.id, wallet.userId));
      
      if (!user) {
        return null;
      }
      
      return {
        userId: user.id,
        username: user.username
      };
    } catch (error) {
      console.error("Error getting wallet user info:", error);
      return null;
    }
  }
}

export const walletService = new WalletService();
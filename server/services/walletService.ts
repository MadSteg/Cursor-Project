/**
 * Wallet Service
 * 
 * This service handles blockchain wallet operations for the application.
 * It provides functionality to generate, store, and manage user wallets.
 */
import { db } from "../db";
import { eq } from "drizzle-orm";
import { ethers, Wallet } from "ethers";
import { userWallets, type UserWallet } from "@shared/schema";

export class WalletService {
  /**
   * Generate a new Ethereum wallet
   * @returns A new wallet with address and private key
   */
  async generateWallet(): Promise<{ address: string; privateKey: string }> {
    try {
      // Generate a random wallet
      const wallet = ethers.Wallet.createRandom();
      
      // Format the address to checksum format
      const address = ethers.utils.getAddress(wallet.address);
      
      return {
        address,
        privateKey: wallet.privateKey,
      };
    } catch (error) {
      console.error("Error generating wallet:", error);
      throw new Error("Failed to generate wallet");
    }
  }
  
  /**
   * Get a user's wallet by user ID
   * @param userId The user ID to look up
   * @returns The user's wallet or null if not found
   */
  async getUserWallet(userId: number): Promise<UserWallet | null> {
    try {
      const [wallet] = await db
        .select()
        .from(userWallets)
        .where(eq(userWallets.userId, userId));
      
      return wallet || null;
    } catch (error) {
      console.error("Error getting user wallet:", error);
      throw new Error("Failed to get user wallet");
    }
  }
  
  /**
   * Get a wallet by its address
   * @param address The wallet address to look up
   * @returns The wallet or null if not found
   */
  async getWalletByAddress(address: string): Promise<UserWallet | null> {
    try {
      // Normalize the address
      const checksum = ethers.utils.getAddress(address);
      
      const [wallet] = await db
        .select()
        .from(userWallets)
        .where(eq(userWallets.address, checksum));
      
      return wallet || null;
    } catch (error) {
      console.error("Error getting wallet by address:", error);
      throw new Error("Failed to get wallet by address");
    }
  }
  
  /**
   * Get a wallet's balance
   * @param address The wallet address to check
   * @param rpcUrl Optional RPC URL to use
   * @returns The balance in wei as a string
   */
  async getWalletBalance(address: string, rpcUrl?: string): Promise<string> {
    try {
      // Use default RPC URL if not provided
      const provider = rpcUrl 
        ? new ethers.providers.JsonRpcProvider(rpcUrl)
        : ethers.getDefaultProvider();
      
      // Get the balance
      const balance = await provider.getBalance(address);
      
      // Return the balance as a string
      return balance.toString();
    } catch (error) {
      console.error("Error getting wallet balance:", error);
      throw new Error("Failed to get wallet balance");
    }
  }
  
  /**
   * Update the last used timestamp for a wallet
   * @param address The wallet address to update
   */
  async updateLastUsed(address: string): Promise<void> {
    try {
      // Normalize the address
      const checksum = ethers.utils.getAddress(address);
      
      // Update the timestamp
      await db
        .update(userWallets)
        .set({ lastUsedAt: new Date() })
        .where(eq(userWallets.address, checksum));
    } catch (error) {
      console.error("Error updating wallet last used timestamp:", error);
      throw new Error("Failed to update wallet timestamp");
    }
  }
}
/**
 * Wallet Service
 * 
 * This service handles blockchain wallet operations for the application.
 * It provides functionality to generate, store, and manage user wallets.
 */
import { ethers } from 'ethers';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { userWallets } from '@shared/schema';

/**
 * Interface for a user wallet
 */
export interface UserWallet {
  id: number;
  userId: number;
  address: string;
  encryptedPrivateKey: string | null;
  createdAt: Date;
  lastUsedAt: Date | null;
}

export class WalletService {
  // Provider instances for different networks
  private polygonProvider: ethers.providers.JsonRpcProvider;
  
  constructor() {
    // Initialize the Polygon provider
    this.polygonProvider = new ethers.providers.JsonRpcProvider(
      process.env.POLYGON_MUMBAI_RPC_URL || 'https://polygon-mumbai.g.alchemy.com/v2/demo'
    );
  }
  
  /**
   * Generate a new Ethereum wallet
   * @returns A new wallet with address and private key
   */
  async generateWallet(): Promise<{ address: string; privateKey: string }> {
    // Create a new random wallet
    const wallet = ethers.Wallet.createRandom();
    
    return {
      address: wallet.address,
      privateKey: wallet.privateKey
    };
  }
  
  /**
   * Store a wallet in the database
   * @param userId The user ID who owns the wallet
   * @param address The wallet address
   * @param encryptedPrivateKey The encrypted private key (optional)
   * @returns The created wallet
   */
  async storeWallet(userId: number, address: string, encryptedPrivateKey?: string): Promise<UserWallet> {
    // Insert the wallet into the database
    const [wallet] = await db.insert(userWallets).values({
      userId,
      address,
      encryptedPrivateKey: encryptedPrivateKey || null,
    }).returning();
    
    return wallet;
  }
  
  /**
   * Get a user's wallet by user ID
   * @param userId The user ID to look up
   * @returns The user's wallet or null if not found
   */
  async getUserWallet(userId: number): Promise<UserWallet | null> {
    // Find the wallet in the database
    const [wallet] = await db
      .select()
      .from(userWallets)
      .where(eq(userWallets.userId, userId));
    
    return wallet || null;
  }
  
  /**
   * Get a wallet by its address
   * @param address The wallet address to look up
   * @returns The wallet or null if not found
   */
  async getWalletByAddress(address: string): Promise<UserWallet | null> {
    // Find the wallet in the database
    const [wallet] = await db
      .select()
      .from(userWallets)
      .where(eq(userWallets.address, address));
    
    return wallet || null;
  }
  
  /**
   * Get a wallet's balance
   * @param address The wallet address to check
   * @param network The network to check balance on (polygon or ethereum)
   * @returns The balance in wei as a string
   */
  async getWalletBalance(address: string, network: 'polygon' | 'ethereum' = 'polygon'): Promise<string> {
    let provider: ethers.providers.Provider;
    
    // Select the appropriate provider based on the network
    if (network === 'polygon') {
      provider = this.polygonProvider;
    } else {
      // Default to Polygon for now
      provider = this.polygonProvider;
    }
    
    // Get the balance from the blockchain
    const balance = await provider.getBalance(address);
    
    // Return the balance as a string
    return balance.toString();
  }
  
  /**
   * Update the last used timestamp for a wallet
   * @param address The wallet address to update
   */
  async updateLastUsed(address: string): Promise<void> {
    // Update the last used timestamp
    await db
      .update(userWallets)
      .set({ lastUsedAt: new Date() })
      .where(eq(userWallets.address, address));
  }
}
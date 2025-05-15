/**
 * Authentication Service
 * 
 * Handles user authentication, registration, and wallet generation
 */
import bcrypt from 'bcrypt';
import { ethers } from 'ethers';
import { db } from '../db';
import { users, userWallets } from '@shared/schema';
import { tacoService } from './tacoService';
import { eq } from 'drizzle-orm';

/**
 * Register a new user with optional wallet generation
 */
export async function registerUser({ 
  email, 
  password, 
  wantsWallet, 
  tacoPublicKey 
}: {
  email: string;
  password: string;
  wantsWallet: boolean;
  tacoPublicKey?: string;
}) {
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create the user
  const [user] = await db.insert(users)
    .values({ email, password: hashedPassword })
    .returning();
  
  let walletAddress = null;
  
  // Generate wallet if requested
  if (wantsWallet && tacoPublicKey) {
    // Create a random wallet
    const wallet = ethers.Wallet.createRandom();
    
    // Encrypt the private key with TACo
    const encryptedPrivateKey = await tacoService.encryptPrivateKeyWithTACo(
      tacoPublicKey, 
      wallet.privateKey
    );
    
    // Store wallet info
    const [userWallet] = await db.insert(userWallets)
      .values({
        userId: user.id,
        address: wallet.address,
        encryptedPrivateKey
      })
      .returning();
    
    walletAddress = userWallet.address;
  }
  
  return { 
    user, 
    walletAddress,
    privateKey: wantsWallet ? 'ENCRYPTED_WITH_TACO' : null 
  };
}

/**
 * Login with email and password
 */
export async function loginWithEmail(email: string, password: string) {
  // Find the user
  const [user] = await db.select()
    .from(users)
    .where(eq(users.email, email));
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Check password
  const passwordValid = await bcrypt.compare(password, user.password);
  
  if (!passwordValid) {
    throw new Error('Invalid password');
  }
  
  // Get the wallet for the user
  const walletAddress = await attachWalletToSession(user.id);
  
  return { 
    user, 
    walletAddress 
  };
}

/**
 * Link a wallet to a user account
 */
export async function linkWalletToUser(
  userId: number, 
  walletAddress: string, 
  encryptedPrivateKey?: string
) {
  const [existingWallet] = await db.select()
    .from(userWallets)
    .where(eq(userWallets.userId, userId));
  
  if (existingWallet) {
    throw new Error('User already has a wallet linked');
  }
  
  const [userWallet] = await db.insert(userWallets)
    .values({
      userId,
      address: walletAddress,
      encryptedPrivateKey
    })
    .returning();
  
  return userWallet;
}

/**
 * Get the user's wallet address and attach to session
 */
export async function attachWalletToSession(userId: number) {
  const [wallet] = await db.select()
    .from(userWallets)
    .where(eq(userWallets.userId, userId));
  
  return wallet?.address || null;
}

/**
 * Verify Web3 wallet signature for login
 */
export function verifySignature(walletAddress: string, signature: string, nonce: string) {
  const msg = `Log into BlockReceipt: ${nonce}`;
  const recovered = ethers.utils.verifyMessage(msg, signature);
  
  return recovered.toLowerCase() === walletAddress.toLowerCase();
}

/**
 * Login with Web3 wallet
 */
export async function loginWithWeb3(walletAddress: string, signature: string, nonce: string) {
  // Verify the signature
  const isValid = verifySignature(walletAddress, signature, nonce);
  
  if (!isValid) {
    throw new Error('Invalid signature');
  }
  
  // Find or create user with this wallet
  let user = await getUserByWalletAddress(walletAddress);
  
  if (!user) {
    // Create a new user account linked to this wallet
    const [newUser] = await db.insert(users)
      .values({
        email: `${walletAddress.substring(0, 8)}@wallet.blockreceipt.ai`, // Generate email
        password: await bcrypt.hash(Math.random().toString(36), 10) // Random password
      })
      .returning();
    
    // Link wallet to user
    await linkWalletToUser(newUser.id, walletAddress);
    
    user = newUser;
  }
  
  return {
    user,
    walletAddress
  };
}

/**
 * Get user by wallet address
 */
async function getUserByWalletAddress(walletAddress: string) {
  const [wallet] = await db.select()
    .from(userWallets)
    .where(eq(userWallets.address, walletAddress));
  
  if (!wallet) {
    return null;
  }
  
  const [user] = await db.select()
    .from(users)
    .where(eq(users.id, wallet.userId));
  
  return user;
}

export const authService = {
  registerUser,
  loginWithEmail,
  loginWithWeb3,
  linkWalletToUser,
  attachWalletToSession,
  verifySignature,
};
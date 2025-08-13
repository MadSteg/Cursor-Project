// Simple storage interface for basic app functionality
import type { 
  User, 
  InsertUser,
  Receipt as UserReceipt,
  InsertReceipt,
  Merchant,
  InsertMerchant
} from "@shared/schema";

export interface ISimpleStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Receipt methods
  getReceipts(userId: number): Promise<UserReceipt[]>;
  createReceipt(receipt: InsertReceipt): Promise<UserReceipt>;
  
  // Merchant methods
  getMerchants(): Promise<Merchant[]>;
  getMerchant(id: number): Promise<Merchant | undefined>;
  createMerchant(merchant: InsertMerchant): Promise<Merchant>;
}

export class MemSimpleStorage implements ISimpleStorage {
  private users: Map<number, User> = new Map();
  private receipts: Map<number, UserReceipt> = new Map();
  private merchants: Map<number, Merchant> = new Map();
  
  private currentUserId = 1;
  private currentReceiptId = 1;
  private currentMerchantId = 1;

  constructor() {
    this.initializeDemoData();
  }

  private async initializeDemoData() {
    // Create demo user
    const demoUser = await this.createUser({
      email: "demo@blockreceipt.ai",
      password: "demo123",
      fullName: "Demo User"
    });

    // Create demo merchants
    const dunkin = await this.createMerchant({
      name: "Dunkin' Donuts",
      category: "Food & Beverage"
    });

    const target = await this.createMerchant({
      name: "Target",
      category: "Retail"
    });

    // Create demo receipts
    await this.createReceipt({
      userId: demoUser.id,
      merchantName: "Dunkin' Donuts",
      date: "2025-01-13",
      total: 1250, // $12.50 in cents
      subtotal: 1100,
      tax: 150,
      items: [
        { name: "Coffee", price: 4.50, quantity: 1 },
        { name: "Donut", price: 2.99, quantity: 2 }
      ],
      category: "Food & Beverage"
    });

    await this.createReceipt({
      userId: demoUser.id,
      merchantName: "Target",
      date: "2025-01-12",
      total: 4567, // $45.67 in cents
      subtotal: 4200,
      tax: 367,
      items: [
        { name: "Household Items", price: 42.00, quantity: 1 }
      ],
      category: "Retail"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser: User = {
      id: this.currentUserId++,
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null,
      nonce: null
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }

  async getReceipts(userId: number): Promise<UserReceipt[]> {
    const userReceipts: UserReceipt[] = [];
    for (const receipt of this.receipts.values()) {
      if (receipt.userId === userId) {
        userReceipts.push(receipt);
      }
    }
    return userReceipts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createReceipt(receipt: InsertReceipt): Promise<UserReceipt> {
    const newReceipt: UserReceipt = {
      id: this.currentReceiptId++,
      ...receipt,
      isEncrypted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      tokenId: null,
      txHash: null,
      imageHash: null
    };
    this.receipts.set(newReceipt.id, newReceipt);
    return newReceipt;
  }

  async getMerchants(): Promise<Merchant[]> {
    return Array.from(this.merchants.values());
  }

  async getMerchant(id: number): Promise<Merchant | undefined> {
    return this.merchants.get(id);
  }

  async createMerchant(merchant: InsertMerchant): Promise<Merchant> {
    const newMerchant: Merchant = {
      id: this.currentMerchantId++,
      ...merchant,
      logoUrl: null,
      website: null,
      walletAddress: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.merchants.set(newMerchant.id, newMerchant);
    return newMerchant;
  }
}

// Export a default instance
export const simpleStorage = new MemSimpleStorage();
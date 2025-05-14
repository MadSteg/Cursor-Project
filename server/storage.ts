import { 
  users, 
  categories, 
  merchants, 
  receipts, 
  receiptItems,
  spendingStats,
  retailers,
  products,
  retailerSyncLogs,
  type User, 
  type InsertUser, 
  type Category,
  type InsertCategory,
  type Merchant,
  type InsertMerchant,
  type Receipt,
  type InsertReceipt,
  type ReceiptItem,
  type InsertReceiptItem,
  type SpendingStat,
  type InsertSpendingStat,
  type Retailer,
  type InsertRetailer,
  type Product,
  type InsertProduct,
  type RetailerSyncLog,
  type InsertRetailerSyncLog,
  type FullReceipt
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Merchant methods
  getMerchants(): Promise<Merchant[]>;
  getMerchant(id: number): Promise<Merchant | undefined>;
  getMerchantByName(name: string): Promise<Merchant | undefined>;
  createMerchant(merchant: InsertMerchant): Promise<Merchant>;
  
  // Receipt methods
  getReceipts(userId: number): Promise<Receipt[]>;
  getReceipt(id: number): Promise<Receipt | undefined>;
  createReceipt(receipt: InsertReceipt): Promise<Receipt>;
  updateReceipt(id: number, updates: Partial<InsertReceipt>): Promise<Receipt | undefined>;
  getFullReceipt(id: number): Promise<FullReceipt | undefined>;
  getRecentReceipts(userId: number, limit: number): Promise<FullReceipt[]>;
  
  // Receipt Item methods
  getReceiptItems(receiptId: number): Promise<ReceiptItem[]>;
  getReceiptItem(id: number): Promise<ReceiptItem | undefined>;
  createReceiptItem(item: InsertReceiptItem): Promise<ReceiptItem>;
  updateReceiptItem(id: number, updates: Partial<InsertReceiptItem>): Promise<ReceiptItem | undefined>;
  
  // Spending stats methods
  getSpendingStatsByMonth(userId: number, month: number, year: number): Promise<SpendingStat[]>;
  getSpendingStatsByYear(userId: number, year: number): Promise<SpendingStat[]>;
  createOrUpdateSpendingStat(stat: InsertSpendingStat): Promise<SpendingStat>;
  getCategoryBreakdown(userId: number, month: number, year: number): Promise<{category: Category, amount: string, percentage: number}[]>;
  getMonthlySpending(userId: number, year: number): Promise<{month: number, total: string}[]>;
  
  // Retailer methods
  getRetailers(): Promise<Retailer[]>;
  getRetailer(id: number): Promise<Retailer | undefined>;
  createRetailer(retailer: InsertRetailer): Promise<Retailer>;
  updateRetailer(id: number, updates: Partial<InsertRetailer>): Promise<Retailer | undefined>;
  
  // Product methods
  getProduct(id: number): Promise<Product | undefined>;
  getProductByExternalId(retailerId: number, externalId: string): Promise<Product | undefined>;
  findProductsByName(name: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined>;
  searchProducts(query: string, options?: {
    limit?: number;
    offset?: number;
    retailerId?: number;
    categoryId?: number;
  }): Promise<Product[]>;
  
  // Retailer sync logs methods
  getRetailerSyncLogs(retailerId: number, limit?: number): Promise<RetailerSyncLog[]>;
  createRetailerSyncLog(log: InsertRetailerSyncLog): Promise<RetailerSyncLog>;
  updateRetailerSyncLog(id: number, updates: Partial<InsertRetailerSyncLog>): Promise<RetailerSyncLog>;

  // Encryption key methods
  getEncryptionKeys(userId: number): Promise<EncryptionKey[]>;
  getEncryptionKey(id: number): Promise<EncryptionKey | undefined>;
  createEncryptionKey(key: InsertEncryptionKey): Promise<EncryptionKey>;
  updateEncryptionKey(id: number, updates: Partial<InsertEncryptionKey>): Promise<EncryptionKey | undefined>;

  // Shared access methods
  getSharedAccesses(receiptId: number): Promise<SharedAccess[]>;
  getSharedAccess(id: number): Promise<SharedAccess | undefined>;
  createSharedAccess(access: InsertSharedAccess): Promise<SharedAccess>;
  updateSharedAccess(id: number, updates: Partial<InsertSharedAccess>): Promise<SharedAccess | undefined>;
  getSharedAccessesByOwner(userId: number): Promise<SharedAccess[]>;
  getSharedAccessesByTarget(userId: number): Promise<SharedAccess[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private merchants: Map<number, Merchant>;
  private receipts: Map<number, Receipt>;
  private receiptItems: Map<number, ReceiptItem>;
  private spendingStats: Map<number, SpendingStat>;
  private retailers: Map<number, Retailer>;
  private products: Map<number, Product>;
  private retailerSyncLogs: Map<number, RetailerSyncLog>;
  private encryptionKeys: Map<number, EncryptionKey>;
  private sharedAccesses: Map<number, SharedAccess>;
  
  private currentUserId: number;
  private currentCategoryId: number;
  private currentMerchantId: number;
  private currentReceiptId: number;
  private currentReceiptItemId: number;
  private currentSpendingStatId: number;
  private currentRetailerId: number;
  private currentProductId: number;
  private currentRetailerSyncLogId: number;
  private currentEncryptionKeyId: number;
  private currentSharedAccessId: number;
  
  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.merchants = new Map();
    this.receipts = new Map();
    this.receiptItems = new Map();
    this.spendingStats = new Map();
    this.retailers = new Map();
    this.products = new Map();
    this.retailerSyncLogs = new Map();
    this.encryptionKeys = new Map();
    this.sharedAccesses = new Map();
    
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentMerchantId = 1;
    this.currentReceiptId = 1;
    this.currentReceiptItemId = 1;
    this.currentSpendingStatId = 1;
    this.currentRetailerId = 1;
    this.currentProductId = 1;
    this.currentRetailerSyncLogId = 1;
    this.currentEncryptionKeyId = 1;
    this.currentSharedAccessId = 1;

    this.initializeDemoData();
  }

  // Initialize demo data
  private async initializeDemoData() {
    // Create a demo user
    const demoUser = await this.createUser({
      username: "demo",
      password: "password"
    });

    // Create categories
    const groceriesCategory = await this.createCategory({
      name: "Groceries",
      color: "#3B82F6", // blue
      icon: "ri-shopping-cart-line"
    });

    const diningCategory = await this.createCategory({
      name: "Dining",
      color: "#10B981", // green
      icon: "ri-restaurant-line"
    });

    const clothingCategory = await this.createCategory({
      name: "Clothing",
      color: "#F59E0B", // amber
      icon: "ri-t-shirt-line"
    });

    const entertainmentCategory = await this.createCategory({
      name: "Entertainment",
      color: "#8B5CF6", // purple
      icon: "ri-movie-line"
    });

    const transportationCategory = await this.createCategory({
      name: "Transportation",
      color: "#EC4899", // pink
      icon: "ri-car-line"
    });

    // Create merchants
    const wholeFoods = await this.createMerchant({
      name: "Whole Foods Market",
      logo: "ri-shopping-cart-line",
      address: "123 Main Street, San Francisco, CA",
      phone: "(415) 555-1234"
    });

    const oliveGarden = await this.createMerchant({
      name: "Olive Garden",
      logo: "ri-restaurant-line",
      address: "456 Oak Avenue, San Francisco, CA",
      phone: "(415) 555-5678"
    });

    const hm = await this.createMerchant({
      name: "H&M",
      logo: "ri-t-shirt-line",
      address: "789 Market Street, San Francisco, CA",
      phone: "(415) 555-9012"
    });

    // Create receipts and items
    // Whole Foods Receipt
    const wholeFoodsReceipt = await this.createReceipt({
      userId: demoUser.id,
      merchantId: wholeFoods.id,
      categoryId: groceriesCategory.id,
      date: new Date('2023-04-12T14:34:00'),
      subtotal: "79.99",
      tax: "6.48",
      total: "86.47",
      blockchainTxHash: "0x7f3e1c7b62b9542a6b95247a0c82b034fd3c3a01c23dd07e42aeaf02371b94d",
      blockchainVerified: true,
      blockNumber: 14356789,
      nftTokenId: "WF12042023-001"
    });

    await this.createReceiptItem({
      receiptId: wholeFoodsReceipt.id,
      name: "Organic Bananas",
      price: "1.99",
      quantity: 1
    });

    await this.createReceiptItem({
      receiptId: wholeFoodsReceipt.id,
      name: "Almond Milk (32 oz)",
      price: "3.49",
      quantity: 1
    });

    await this.createReceiptItem({
      receiptId: wholeFoodsReceipt.id,
      name: "Sliced Turkey Breast",
      price: "7.99",
      quantity: 1
    });

    await this.createReceiptItem({
      receiptId: wholeFoodsReceipt.id,
      name: "Organic Spinach",
      price: "4.99",
      quantity: 1
    });

    await this.createReceiptItem({
      receiptId: wholeFoodsReceipt.id,
      name: "Avocado",
      price: "2.99",
      quantity: 2
    });

    await this.createReceiptItem({
      receiptId: wholeFoodsReceipt.id,
      name: "Greek Yogurt",
      price: "4.49",
      quantity: 1
    });

    await this.createReceiptItem({
      receiptId: wholeFoodsReceipt.id,
      name: "Whole Grain Bread",
      price: "3.99",
      quantity: 1
    });

    await this.createReceiptItem({
      receiptId: wholeFoodsReceipt.id,
      name: "Organic Blueberries",
      price: "6.99",
      quantity: 1
    });

    await this.createReceiptItem({
      receiptId: wholeFoodsReceipt.id,
      name: "Free Range Eggs",
      price: "5.49",
      quantity: 1
    });

    // Olive Garden Receipt
    const oliveGardenReceipt = await this.createReceipt({
      userId: demoUser.id,
      merchantId: oliveGarden.id,
      categoryId: diningCategory.id,
      date: new Date('2023-04-10T19:15:00'),
      subtotal: "39.78",
      tax: "3.18",
      total: "42.96",
      blockchainTxHash: "0x3d1a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1f42e",
      blockchainVerified: true,
      blockNumber: 14355678,
      nftTokenId: "OG10042023-001"
    });

    await this.createReceiptItem({
      receiptId: oliveGardenReceipt.id,
      name: "Chicken Alfredo",
      price: "18.99",
      quantity: 1
    });

    await this.createReceiptItem({
      receiptId: oliveGardenReceipt.id,
      name: "Breadsticks",
      price: "0.00",
      quantity: 1
    });

    await this.createReceiptItem({
      receiptId: oliveGardenReceipt.id,
      name: "Caesar Salad",
      price: "8.99",
      quantity: 1
    });

    await this.createReceiptItem({
      receiptId: oliveGardenReceipt.id,
      name: "Iced Tea",
      price: "2.99",
      quantity: 2
    });

    await this.createReceiptItem({
      receiptId: oliveGardenReceipt.id,
      name: "Tiramisu",
      price: "6.99",
      quantity: 1
    });

    // H&M Receipt
    const hmReceipt = await this.createReceipt({
      userId: demoUser.id,
      merchantId: hm.id,
      categoryId: clothingCategory.id,
      date: new Date('2023-04-08T15:22:00'),
      subtotal: "68.44",
      tax: "5.48",
      total: "73.92",
      blockchainTxHash: "0x8b2c4d6e8f0a2c4e6f8a0c2e4d6f8a0c2e4d6f8a0c2e4d6f8a0c2e4d6e19a",
      blockchainVerified: true,
      blockNumber: 14354567,
      nftTokenId: "HM08042023-001"
    });

    await this.createReceiptItem({
      receiptId: hmReceipt.id,
      name: "Men's Slim Fit Jeans",
      price: "29.99",
      quantity: 1
    });

    await this.createReceiptItem({
      receiptId: hmReceipt.id,
      name: "Cotton T-Shirt",
      price: "16.99",
      quantity: 2
    });

    await this.createReceiptItem({
      receiptId: hmReceipt.id,
      name: "Leather Belt",
      price: "9.95",
      quantity: 1
    });

    // Create spending stats
    await this.createOrUpdateSpendingStat({
      userId: demoUser.id,
      month: 4,
      year: 2023,
      categoryId: groceriesCategory.id,
      amount: "86.47"
    });

    await this.createOrUpdateSpendingStat({
      userId: demoUser.id,
      month: 4,
      year: 2023,
      categoryId: diningCategory.id,
      amount: "42.96"
    });

    await this.createOrUpdateSpendingStat({
      userId: demoUser.id,
      month: 4,
      year: 2023,
      categoryId: clothingCategory.id,
      amount: "73.92"
    });

    await this.createOrUpdateSpendingStat({
      userId: demoUser.id,
      month: 3,
      year: 2023,
      categoryId: groceriesCategory.id,
      amount: "78.25"
    });

    await this.createOrUpdateSpendingStat({
      userId: demoUser.id,
      month: 3,
      year: 2023,
      categoryId: diningCategory.id,
      amount: "39.50"
    });

    await this.createOrUpdateSpendingStat({
      userId: demoUser.id,
      month: 3,
      year: 2023,
      categoryId: entertainmentCategory.id,
      amount: "29.99"
    });

    await this.createOrUpdateSpendingStat({
      userId: demoUser.id,
      month: 3,
      year: 2023,
      categoryId: transportationCategory.id,
      amount: "45.75"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.name === name,
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Merchant methods
  async getMerchants(): Promise<Merchant[]> {
    return Array.from(this.merchants.values());
  }

  async getMerchant(id: number): Promise<Merchant | undefined> {
    return this.merchants.get(id);
  }

  async getMerchantByName(name: string): Promise<Merchant | undefined> {
    return Array.from(this.merchants.values()).find(
      (merchant) => merchant.name === name,
    );
  }

  async createMerchant(insertMerchant: InsertMerchant): Promise<Merchant> {
    const id = this.currentMerchantId++;
    const merchant: Merchant = { ...insertMerchant, id };
    this.merchants.set(id, merchant);
    return merchant;
  }

  // Receipt methods
  async getReceipts(userId: number): Promise<Receipt[]> {
    return Array.from(this.receipts.values()).filter(
      (receipt) => receipt.userId === userId,
    );
  }

  async getReceipt(id: number): Promise<Receipt | undefined> {
    return this.receipts.get(id);
  }

  async createReceipt(insertReceipt: InsertReceipt): Promise<Receipt> {
    const id = this.currentReceiptId++;
    const receipt: Receipt = { ...insertReceipt, id };
    this.receipts.set(id, receipt);
    return receipt;
  }

  async updateReceipt(id: number, updates: Partial<InsertReceipt>): Promise<Receipt | undefined> {
    const receipt = this.receipts.get(id);
    if (!receipt) return undefined;
    
    const updatedReceipt: Receipt = { ...receipt, ...updates };
    this.receipts.set(id, updatedReceipt);
    return updatedReceipt;
  }

  async getFullReceipt(id: number): Promise<FullReceipt | undefined> {
    const receipt = this.receipts.get(id);
    if (!receipt) return undefined;
    
    const merchant = await this.getMerchant(receipt.merchantId);
    const category = await this.getCategory(receipt.categoryId);
    const items = await this.getReceiptItems(id);
    
    if (!merchant || !category) return undefined;
    
    return {
      id: receipt.id,
      merchant: {
        name: merchant.name,
        logo: merchant.logo,
        address: merchant.address,
        phone: merchant.phone,
      },
      category: {
        name: category.name,
        color: category.color,
        icon: category.icon,
      },
      date: receipt.date,
      subtotal: receipt.subtotal,
      tax: receipt.tax,
      total: receipt.total,
      items: items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      blockchain: {
        txHash: receipt.blockchainTxHash,
        verified: receipt.blockchainVerified,
        blockNumber: receipt.blockNumber,
        nftTokenId: receipt.nftTokenId,
        ipfsCid: receipt.ipfsCid,
        ipfsUrl: receipt.ipfsUrl,
        encryptionKey: receipt.encryptionKey,
      },
    };
  }

  async getRecentReceipts(userId: number, limit: number): Promise<FullReceipt[]> {
    const userReceipts = Array.from(this.receipts.values())
      .filter(receipt => receipt.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
    
    const fullReceipts: FullReceipt[] = [];
    
    for (const receipt of userReceipts) {
      const fullReceipt = await this.getFullReceipt(receipt.id);
      if (fullReceipt) {
        fullReceipts.push(fullReceipt);
      }
    }
    
    return fullReceipts;
  }

  // Receipt Item methods
  async getReceiptItems(receiptId: number): Promise<ReceiptItem[]> {
    return Array.from(this.receiptItems.values()).filter(
      (item) => item.receiptId === receiptId,
    );
  }

  async createReceiptItem(insertItem: InsertReceiptItem): Promise<ReceiptItem> {
    const id = this.currentReceiptItemId++;
    const item: ReceiptItem = { ...insertItem, id };
    this.receiptItems.set(id, item);
    return item;
  }

  // Spending stats methods
  async getSpendingStatsByMonth(userId: number, month: number, year: number): Promise<SpendingStat[]> {
    return Array.from(this.spendingStats.values()).filter(
      (stat) => stat.userId === userId && stat.month === month && stat.year === year,
    );
  }

  async getSpendingStatsByYear(userId: number, year: number): Promise<SpendingStat[]> {
    return Array.from(this.spendingStats.values()).filter(
      (stat) => stat.userId === userId && stat.year === year,
    );
  }

  async createOrUpdateSpendingStat(insertStat: InsertSpendingStat): Promise<SpendingStat> {
    // Check if stat already exists for this user, month, year, and category
    const existingStat = Array.from(this.spendingStats.values()).find(
      (stat) => 
        stat.userId === insertStat.userId && 
        stat.month === insertStat.month && 
        stat.year === insertStat.year && 
        stat.categoryId === insertStat.categoryId,
    );
    
    if (existingStat) {
      // Update existing stat
      const amount = parseFloat(existingStat.amount) + parseFloat(insertStat.amount);
      const updatedStat: SpendingStat = { 
        ...existingStat, 
        amount: amount.toString() 
      };
      this.spendingStats.set(existingStat.id, updatedStat);
      return updatedStat;
    } else {
      // Create new stat
      const id = this.currentSpendingStatId++;
      const stat: SpendingStat = { ...insertStat, id };
      this.spendingStats.set(id, stat);
      return stat;
    }
  }

  async getCategoryBreakdown(userId: number, month: number, year: number): Promise<{category: Category, amount: string, percentage: number}[]> {
    const stats = await this.getSpendingStatsByMonth(userId, month, year);
    if (stats.length === 0) return [];
    
    // Calculate total spending
    let totalSpending = 0;
    for (const stat of stats) {
      totalSpending += parseFloat(stat.amount);
    }
    
    // Calculate percentage for each category
    const result: {category: Category, amount: string, percentage: number}[] = [];
    
    for (const stat of stats) {
      const category = await this.getCategory(stat.categoryId);
      if (category) {
        const percentage = (parseFloat(stat.amount) / totalSpending) * 100;
        result.push({
          category,
          amount: stat.amount,
          percentage: Math.round(percentage),
        });
      }
    }
    
    // Sort by percentage (highest first)
    return result.sort((a, b) => b.percentage - a.percentage);
  }

  async getMonthlySpending(userId: number, year: number): Promise<{month: number, total: string}[]> {
    const stats = await this.getSpendingStatsByYear(userId, year);
    if (stats.length === 0) return [];
    
    // Group by month and sum amounts
    const monthlyTotals = new Map<number, number>();
    
    for (const stat of stats) {
      const month = stat.month;
      const amount = parseFloat(stat.amount);
      
      if (monthlyTotals.has(month)) {
        monthlyTotals.set(month, monthlyTotals.get(month)! + amount);
      } else {
        monthlyTotals.set(month, amount);
      }
    }
    
    // Convert to array and sort by month
    const result: {month: number, total: string}[] = [];
    
    for (const [month, total] of monthlyTotals.entries()) {
      result.push({
        month,
        total: total.toString(),
      });
    }
    
    return result.sort((a, b) => a.month - b.month);
  }
  
  // Retailer methods
  async getRetailers(): Promise<Retailer[]> {
    return Array.from(this.retailers.values());
  }

  async getRetailer(id: number): Promise<Retailer | undefined> {
    return this.retailers.get(id);
  }

  async createRetailer(retailer: InsertRetailer): Promise<Retailer> {
    const id = this.currentRetailerId++;
    const newRetailer: Retailer = { ...retailer, id };
    this.retailers.set(id, newRetailer);
    return newRetailer;
  }

  async updateRetailer(id: number, updates: Partial<InsertRetailer>): Promise<Retailer | undefined> {
    const retailer = this.retailers.get(id);
    if (!retailer) return undefined;
    
    const updatedRetailer: Retailer = { ...retailer, ...updates };
    this.retailers.set(id, updatedRetailer);
    return updatedRetailer;
  }

  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductByExternalId(retailerId: number, externalId: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      product => product.retailerId === retailerId && product.externalId === externalId
    );
  }

  async findProductsByName(name: string): Promise<Product[]> {
    const lowercaseName = name.toLowerCase();
    return Array.from(this.products.values()).filter(
      product => product.name.toLowerCase().includes(lowercaseName)
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct: Product = { ...product, ...updates };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async searchProducts(query: string, options?: {
    limit?: number;
    offset?: number;
    retailerId?: number;
    categoryId?: number;
  }): Promise<Product[]> {
    const { limit = 10, offset = 0, retailerId, categoryId } = options || {};
    
    let results = Array.from(this.products.values());
    
    if (query) {
      const lowercaseQuery = query.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery) || 
        (product.description && product.description.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    if (retailerId) {
      results = results.filter(product => product.retailerId === retailerId);
    }
    
    if (categoryId) {
      results = results.filter(product => product.categoryId === categoryId);
    }
    
    return results.slice(offset, offset + limit);
  }

  // Retailer sync logs methods
  async getRetailerSyncLogs(retailerId: number, limit?: number): Promise<RetailerSyncLog[]> {
    const logs = Array.from(this.retailerSyncLogs.values())
      .filter(log => log.retailerId === retailerId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return limit ? logs.slice(0, limit) : logs;
  }

  async createRetailerSyncLog(log: InsertRetailerSyncLog): Promise<RetailerSyncLog> {
    const id = this.currentRetailerSyncLogId++;
    const newLog: RetailerSyncLog = { ...log, id };
    this.retailerSyncLogs.set(id, newLog);
    return newLog;
  }

  async updateRetailerSyncLog(id: number, updates: Partial<InsertRetailerSyncLog>): Promise<RetailerSyncLog> {
    const log = this.retailerSyncLogs.get(id);
    if (!log) {
      throw new Error(`RetailerSyncLog with id ${id} not found`);
    }
    
    const updatedLog: RetailerSyncLog = { ...log, ...updates };
    this.retailerSyncLogs.set(id, updatedLog);
    return updatedLog;
  }

  // Encryption key methods
  async getEncryptionKeys(userId: number): Promise<EncryptionKey[]> {
    return Array.from(this.encryptionKeys.values())
      .filter(key => key.userId === userId);
  }

  async getEncryptionKey(id: number): Promise<EncryptionKey | undefined> {
    return this.encryptionKeys.get(id);
  }

  async createEncryptionKey(key: InsertEncryptionKey): Promise<EncryptionKey> {
    const id = this.currentEncryptionKeyId++;
    const newKey: EncryptionKey = { ...key, id };
    this.encryptionKeys.set(id, newKey);
    return newKey;
  }

  async updateEncryptionKey(id: number, updates: Partial<InsertEncryptionKey>): Promise<EncryptionKey | undefined> {
    const key = this.encryptionKeys.get(id);
    if (!key) return undefined;
    
    const updatedKey: EncryptionKey = { ...key, ...updates };
    this.encryptionKeys.set(id, updatedKey);
    return updatedKey;
  }

  // Shared access methods
  async getSharedAccesses(receiptId: number): Promise<SharedAccess[]> {
    return Array.from(this.sharedAccesses.values())
      .filter(access => access.receiptId === receiptId);
  }

  async getSharedAccess(id: number): Promise<SharedAccess | undefined> {
    return this.sharedAccesses.get(id);
  }

  async createSharedAccess(access: InsertSharedAccess): Promise<SharedAccess> {
    const id = this.currentSharedAccessId++;
    const newAccess: SharedAccess = { ...access, id };
    this.sharedAccesses.set(id, newAccess);
    return newAccess;
  }

  async updateSharedAccess(id: number, updates: Partial<InsertSharedAccess>): Promise<SharedAccess | undefined> {
    const access = this.sharedAccesses.get(id);
    if (!access) return undefined;
    
    const updatedAccess: SharedAccess = { ...access, ...updates };
    this.sharedAccesses.set(id, updatedAccess);
    return updatedAccess;
  }

  async getSharedAccessesByOwner(userId: number): Promise<SharedAccess[]> {
    return Array.from(this.sharedAccesses.values())
      .filter(access => access.ownerUserId === userId);
  }

  async getSharedAccessesByTarget(userId: number): Promise<SharedAccess[]> {
    return Array.from(this.sharedAccesses.values())
      .filter(access => access.targetUserId === userId);
  }
}

export const storage = new MemStorage();

import { pgTable, text, serial, integer, boolean, numeric, timestamp, jsonb, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Base user schema as provided
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").unique(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
  
  // Blockchain and encryption keys
  blockchainWalletAddress: text("blockchain_wallet_address"),
  encryptionPublicKey: text("encryption_public_key"),
  preferEncryption: boolean("prefer_encryption").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  blockchainWalletAddress: true,
  encryptionPublicKey: true,
  preferEncryption: true,
});

// Define receipt categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  color: true,
  icon: true,
});

// Define merchants
export const merchants = pgTable("merchants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo"),
  address: text("address"),
  phone: text("phone"),
});

export const insertMerchantSchema = createInsertSchema(merchants).pick({
  name: true,
  logo: true,
  address: true,
  phone: true,
});

// Define receipt items
export const receiptItems = pgTable("receipt_items", {
  id: serial("id").primaryKey(),
  receiptId: integer("receipt_id").notNull(),
  name: text("name").notNull(),
  price: numeric("price").notNull(),
  quantity: integer("quantity").notNull().default(1),
  productId: integer("product_id"), // Reference to identified product from retailer database
  categoryId: integer("category_id"), // Category for the item
  matchConfidence: numeric("match_confidence"), // Confidence score for product matching
});

export const insertReceiptItemSchema = createInsertSchema(receiptItems).pick({
  receiptId: true,
  name: true,
  price: true,
  quantity: true,
  productId: true,
  categoryId: true,
  matchConfidence: true,
});

// Define receipts
export const receipts = pgTable("receipts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  merchantId: integer("merchant_id").notNull(),
  categoryId: integer("category_id").notNull(),
  retailerId: integer("retailer_id"), // Optional link to specific retailer
  date: timestamp("date").notNull().defaultNow(),
  subtotal: numeric("subtotal").notNull(),
  tax: numeric("tax").notNull(),
  total: numeric("total").notNull(),
  blockchainTxHash: text("blockchain_tx_hash"),
  blockchainVerified: boolean("blockchain_verified").default(false),
  blockNumber: integer("block_number"),
  nftTokenId: text("nft_token_id"),
  ipfsCid: text("ipfs_cid"), // IPFS Content Identifier
  ipfsUrl: text("ipfs_url"), // IPFS Gateway URL for easy access
  encryptionKey: text("encryption_key"), // Encryption key for IPFS data
  receiptImageUrl: text("receipt_image_url"), // URL to receipt image if scanned
  rawReceiptText: text("raw_receipt_text"), // OCR text from receipt scan
  processingStatus: text("processing_status").default("completed"), // pending, processing, completed, failed
  
  // Payment-related fields
  paymentId: text("payment_id"), // Stripe payment ID or other payment reference
  paymentAmount: numeric("payment_amount"), // Amount paid (may differ from total)
  paymentCurrency: text("payment_currency").default("usd"), // Currency code 
  paymentDate: timestamp("payment_date"), // When payment was processed
  paymentStatus: text("payment_status"), // Payment status (pending, completed, failed)
  paymentMethod: text("payment_method"), // Credit card, cash, etc.
  paymentComplete: boolean("payment_complete").default(false), // Whether payment has been processed
  stripeReceiptUrl: text("stripe_receipt_url"), // URL to Stripe receipt
  
  // Source information
  source: text("source"), // 'email', 'scan', 'manual', 'import'
  sourceIdentifier: text("source_identifier"), // Email ID, scan batch ID, etc.
  storeLocation: text("store_location"), // Physical store location
  storeId: text("store_id"), // Store identifier within retailer chain
  orderNumber: text("order_number"), // Order/transaction number from receipt
  
  // Threshold encryption fields
  nftRequested: boolean("nft_requested").default(false), // Whether user requested NFT receipt
  isEncrypted: boolean("is_encrypted").default(false), // Whether receipt is encrypted
  encryptionPublicKey: text("encryption_public_key"), // Public key used for encryption
  thresholdSharedKey: text("threshold_shared_key") // Shared key for threshold encryption
});

export const insertReceiptSchema = createInsertSchema(receipts).pick({
  userId: true,
  merchantId: true,
  categoryId: true,
  retailerId: true,
  date: true,
  subtotal: true,
  tax: true,
  total: true,
  blockchainTxHash: true,
  blockchainVerified: true,
  blockNumber: true,
  
  // Payment-related fields
  paymentId: true,
  paymentAmount: true,
  paymentCurrency: true,
  paymentDate: true,
  paymentStatus: true,
  paymentMethod: true,
  paymentComplete: true,
  stripeReceiptUrl: true,
  nftTokenId: true,
  ipfsCid: true,
  ipfsUrl: true,
  encryptionKey: true,
  receiptImageUrl: true,
  rawReceiptText: true,
  processingStatus: true,
  source: true,
  sourceIdentifier: true,
  storeLocation: true,
  storeId: true,
  orderNumber: true,
  paymentMethod: true,
  nftRequested: true,
  isEncrypted: true,
  encryptionPublicKey: true,
  thresholdSharedKey: true,
});

// Define spending stats
export const spendingStats = pgTable("spending_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  categoryId: integer("category_id").notNull(),
  amount: numeric("amount").notNull(),
});

export const insertSpendingStatSchema = createInsertSchema(spendingStats).pick({
  userId: true,
  month: true,
  year: true,
  categoryId: true,
  amount: true,
});

// Define retailers for SKU integrations
export const retailers = pgTable("retailers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  apiEndpoint: text("api_endpoint"),
  apiKey: text("api_key"),
  apiSecretKey: text("api_secret_key"),
  logo: text("logo"),
  website: text("website"),
  dataFormat: text("data_format"), // JSON, XML, etc.
  lastSynced: timestamp("last_synced"),
  syncEnabled: boolean("sync_enabled").default(true),
});

export const insertRetailerSchema = createInsertSchema(retailers).pick({
  name: true,
  apiEndpoint: true,
  apiKey: true,
  apiSecretKey: true,
  logo: true,
  website: true,
  dataFormat: true,
  lastSynced: true,
  syncEnabled: true,
});

// Define products table for retailer inventory
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  retailerId: integer("retailer_id").notNull(), // Which retailer this product belongs to
  merchantId: integer("merchant_id"), // Optional connection to our merchant
  externalId: text("external_id").notNull(), // SKU or product ID from retailer
  name: text("name").notNull(),
  description: text("description"),
  price: numeric("price"),
  categoryId: integer("category_id"),
  imageUrl: text("image_url"),
  barcode: text("barcode"), // UPC, EAN, etc.
  barcodeType: text("barcode_type"), // UPC, EAN, etc.
  brandName: text("brand_name"),
  departmentName: text("department_name"),
  lastUpdated: timestamp("last_updated"),
  isActive: boolean("is_active").default(true),
  metadata: jsonb("metadata"), // Additional product data in JSON format
}, (table) => {
  return {
    uniqueProductConstraint: unique().on(table.retailerId, table.externalId),
  }
});

export const insertProductSchema = createInsertSchema(products).pick({
  retailerId: true,
  merchantId: true,
  externalId: true,
  name: true,
  description: true,
  price: true,
  categoryId: true,
  imageUrl: true,
  barcode: true,
  barcodeType: true,
  brandName: true,
  departmentName: true,
  lastUpdated: true,
  isActive: true,
  metadata: true,
});

// Define retailer API sync logs
export const retailerSyncLogs = pgTable("retailer_sync_logs", {
  id: serial("id").primaryKey(),
  retailerId: integer("retailer_id").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  status: text("status").notNull(), // success, failure, in_progress
  productsAdded: integer("products_added").default(0),
  productsUpdated: integer("products_updated").default(0),
  productsRemoved: integer("products_removed").default(0),
  errorMessage: text("error_message"),
});

export const insertRetailerSyncLogSchema = createInsertSchema(retailerSyncLogs).pick({
  retailerId: true,
  startTime: true,
  endTime: true,
  status: true,
  productsAdded: true,
  productsUpdated: true,
  productsRemoved: true,
  errorMessage: true,
});

// Threshold encryption keys for users
export const encryptionKeys = pgTable("encryption_keys", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  publicKey: text("public_key").notNull(),
  encryptedPrivateKey: text("encrypted_private_key").notNull(), // Private key encrypted with user's master password
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsed: timestamp("last_used"),
  keyType: text("key_type").default("threshold").notNull(), // threshold, wallet, standard, etc.
  keyVersion: integer("key_version").default(1).notNull(),
  isActive: boolean("is_active").default(true),
});

export const insertEncryptionKeySchema = createInsertSchema(encryptionKeys).pick({
  userId: true,
  publicKey: true,
  encryptedPrivateKey: true,
  keyType: true,
  keyVersion: true,
  isActive: true,
});

// Shared access for encrypted receipts
export const sharedAccess = pgTable("shared_access", {
  id: serial("id").primaryKey(),
  receiptId: integer("receipt_id").notNull(),
  ownerUserId: integer("owner_user_id").notNull(),
  targetUserId: integer("target_user_id").notNull(),
  reEncryptionKey: text("re_encryption_key").notNull(),
  reEncryptionCommitment: text("re_encryption_commitment").notNull(),
  accessLevel: text("access_level").notNull(), // full, limited, verification-only
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isRevoked: boolean("is_revoked").default(false),
});

export const insertSharedAccessSchema = createInsertSchema(sharedAccess).pick({
  receiptId: true,
  ownerUserId: true,
  targetUserId: true,
  reEncryptionKey: true,
  reEncryptionCommitment: true,
  accessLevel: true,
  expiresAt: true,
  isRevoked: true,
});

// Define receipt with items and merchant for API responses
export const fullReceiptSchema = z.object({
  id: z.number(),
  merchant: z.object({
    name: z.string(),
    logo: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
  }),
  category: z.object({
    name: z.string(),
    color: z.string(),
    icon: z.string(),
  }),
  date: z.date(),
  subtotal: z.string(), // numeric comes as string
  tax: z.string(),
  total: z.string(),
  items: z.array(z.object({
    name: z.string(),
    price: z.string(),
    quantity: z.number(),
    categoryId: z.number().optional(),
  })),
  blockchain: z.object({
    txHash: z.string().optional(),
    verified: z.boolean(),
    blockNumber: z.number().optional(),
    nftTokenId: z.string().optional(),
    ipfsCid: z.string().optional(),
    ipfsUrl: z.string().optional(),
    network: z.string().optional(),
    contractAddress: z.string().optional(),
  }),
  encryption: z.object({
    isEncrypted: z.boolean().default(false),
    encryptionKey: z.string().optional(),
    encryptionPublicKey: z.string().optional(),
    thresholdSharedKey: z.string().optional(),
    accessibleBy: z.array(z.object({
      userId: z.number(),
      publicKey: z.string(),
      accessLevel: z.enum(['full', 'limited', 'verification-only']),
      expiresAt: z.date().optional(),
    })).optional(),
  }),
  payment: z.object({
    paymentId: z.string().optional(),
    paymentMethod: z.string().optional(),
    paymentStatus: z.string().optional(),
    paymentAmount: z.string().optional(),
    paymentCurrency: z.string().optional(),
    receiptUrl: z.string().optional(),
  }).optional(),
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Merchant = typeof merchants.$inferSelect;
export type InsertMerchant = z.infer<typeof insertMerchantSchema>;

export type ReceiptItem = typeof receiptItems.$inferSelect;
export type InsertReceiptItem = z.infer<typeof insertReceiptItemSchema>;

export type Receipt = typeof receipts.$inferSelect;
export type InsertReceipt = z.infer<typeof insertReceiptSchema>;

export type SpendingStat = typeof spendingStats.$inferSelect;
export type InsertSpendingStat = z.infer<typeof insertSpendingStatSchema>;

export type Retailer = typeof retailers.$inferSelect;
export type InsertRetailer = z.infer<typeof insertRetailerSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type RetailerSyncLog = typeof retailerSyncLogs.$inferSelect;
export type InsertRetailerSyncLog = z.infer<typeof insertRetailerSyncLogSchema>;

export type EncryptionKey = typeof encryptionKeys.$inferSelect;
export type InsertEncryptionKey = z.infer<typeof insertEncryptionKeySchema>;

export type SharedAccess = typeof sharedAccess.$inferSelect;
export type InsertSharedAccess = z.infer<typeof insertSharedAccessSchema>;

export type TacoKey = typeof tacoKeys.$inferSelect;
export type InsertTacoKey = z.infer<typeof insertTacoKeySchema>;

export type SharedReceipt = typeof sharedReceipts.$inferSelect;
export type InsertSharedReceipt = z.infer<typeof insertSharedReceiptSchema>;

export type FullReceipt = z.infer<typeof fullReceiptSchema>;

// Define Taco threshold encryption keys
export const tacoKeys = pgTable("taco_keys", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  publicKey: text("public_key").notNull(),
  keyType: text("key_type").notNull().default("TACO"), // TACO, SHARED, etc.
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastUsed: timestamp("last_used"),
  isActive: boolean("is_active").default(true),
});

export const insertTacoKeySchema = createInsertSchema(tacoKeys).pick({
  userId: true,
  publicKey: true,
  keyType: true,
  name: true,
  isActive: true,
});

// Define Taco shared receipts
export const sharedReceipts = pgTable("shared_receipts", {
  id: serial("id").primaryKey(),
  receiptId: integer("receipt_id").notNull(),
  ownerId: integer("owner_id").notNull(), // User sharing the receipt
  targetId: integer("target_id").notNull(), // User receiving the shared receipt
  encryptedData: text("encrypted_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  isRevoked: boolean("is_revoked").default(false),
});

export const insertSharedReceiptSchema = createInsertSchema(sharedReceipts).pick({
  receiptId: true,
  ownerId: true,
  targetId: true,
  encryptedData: true,
  expiresAt: true,
  isRevoked: true,
});

// Define relationships between tables
export const usersRelations = relations(users, ({ many }) => ({
  receipts: many(receipts),
  spendingStats: many(spendingStats),
  encryptionKeys: many(encryptionKeys),
  ownedSharedAccess: many(sharedAccess, { relationName: "owner" }),
  targetSharedAccess: many(sharedAccess, { relationName: "target" }),
  tacoKeys: many(tacoKeys),
  sharedReceiptsOwned: many(sharedReceipts, { relationName: "owner" }),
  sharedReceiptsReceived: many(sharedReceipts, { relationName: "target" }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  receipts: many(receipts),
  receiptItems: many(receiptItems),
  products: many(products),
  spendingStats: many(spendingStats),
}));

export const merchantsRelations = relations(merchants, ({ many }) => ({
  receipts: many(receipts),
}));

export const receiptItemsRelations = relations(receiptItems, ({ one }) => ({
  receipt: one(receipts, {
    fields: [receiptItems.receiptId],
    references: [receipts.id],
  }),
  category: one(categories, {
    fields: [receiptItems.categoryId],
    references: [categories.id],
  }),
  product: one(products, {
    fields: [receiptItems.productId],
    references: [products.id],
  }),
}));

export const receiptsRelations = relations(receipts, ({ one, many }) => ({
  user: one(users, {
    fields: [receipts.userId],
    references: [users.id],
  }),
  merchant: one(merchants, {
    fields: [receipts.merchantId],
    references: [merchants.id],
  }),
  category: one(categories, {
    fields: [receipts.categoryId],
    references: [categories.id],
  }),
  retailer: one(retailers, {
    fields: [receipts.retailerId],
    references: [retailers.id],
  }),
  items: many(receiptItems),
  sharedAccesses: many(sharedAccess),
  sharedReceipts: many(sharedReceipts),
}));

// Define Taco key relations
export const tacoKeysRelations = relations(tacoKeys, ({ one }) => ({
  user: one(users, {
    fields: [tacoKeys.userId],
    references: [users.id],
  }),
}));

// Define shared receipts relations
export const sharedReceiptsRelations = relations(sharedReceipts, ({ one }) => ({
  receipt: one(receipts, {
    fields: [sharedReceipts.receiptId],
    references: [receipts.id],
  }),
  owner: one(users, {
    fields: [sharedReceipts.ownerId],
    references: [users.id],
    relationName: "owner",
  }),
  target: one(users, {
    fields: [sharedReceipts.targetId],
    references: [users.id],
    relationName: "target",
  }),
}));

export const spendingStatsRelations = relations(spendingStats, ({ one }) => ({
  user: one(users, {
    fields: [spendingStats.userId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [spendingStats.categoryId],
    references: [categories.id],
  }),
}));

export const retailersRelations = relations(retailers, ({ many }) => ({
  products: many(products),
  syncLogs: many(retailerSyncLogs),
  receipts: many(receipts),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  retailer: one(retailers, {
    fields: [products.retailerId],
    references: [retailers.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  receiptItems: many(receiptItems),
}));

export const retailerSyncLogsRelations = relations(retailerSyncLogs, ({ one }) => ({
  retailer: one(retailers, {
    fields: [retailerSyncLogs.retailerId],
    references: [retailers.id],
  }),
}));

// Add encryption key relations
export const encryptionKeysRelations = relations(encryptionKeys, ({ one }) => ({
  user: one(users, {
    fields: [encryptionKeys.userId],
    references: [users.id],
  }),
}));

// Add shared access relations
export const sharedAccessRelations = relations(sharedAccess, ({ one }) => ({
  receipt: one(receipts, {
    fields: [sharedAccess.receiptId],
    references: [receipts.id],
  }),
  owner: one(users, {
    fields: [sharedAccess.ownerUserId],
    references: [users.id],
    relationName: "owner",
  }),
  target: one(users, {
    fields: [sharedAccess.targetUserId],
    references: [users.id],
    relationName: "target",
  }),
}));

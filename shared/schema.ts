import { pgTable, text, serial, integer, boolean, numeric, timestamp, jsonb, unique, date } from "drizzle-orm/pg-core";
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
  modelNumber: text("model_number"), // Model number for product (e.g., PS5, Dyson V11, etc.)
  serialNumber: text("serial_number"), // Serial number for the specific product unit
  warrantyExpiryDate: timestamp("warranty_expiry_date"), // When the warranty expires
});

export const insertReceiptItemSchema = createInsertSchema(receiptItems).pick({
  receiptId: true,
  name: true,
  price: true,
  quantity: true,
  productId: true,
  categoryId: true,
  matchConfidence: true,
  modelNumber: true,
  serialNumber: true,
  warrantyExpiryDate: true,
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
  
  // NFT fields
  nftRequested: boolean("nft_requested").default(false), // Whether user requested NFT receipt
  nftTierId: integer("nft_tier_id"), // ID of NFT tier requested (Standard, Premium, Luxury)
  nftThemeId: integer("nft_theme_id"), // ID of NFT theme requested (Pokemon, Luxury, etc.)
  nftPrice: numeric("nft_price"), // Price paid for NFT (in USD)
  nftMetadata: jsonb("nft_metadata"), // Additional NFT metadata
  
  // Threshold encryption fields
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
  nftTierId: true,
  nftThemeId: true,
  nftPrice: true,
  nftMetadata: true,
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
  modelNumber: text("model_number"), // Model number (e.g., PS5, Dyson V11)
  serialNumberPrefix: text("serial_number_prefix"), // Prefix for serial numbers of this model
  warrantyDuration: integer("warranty_duration"), // Warranty duration in days
  warrantyInfo: text("warranty_info"), // Additional warranty information
  warrantyUrl: text("warranty_url"), // URL to warranty page
  manufacturerName: text("manufacturer_name"), // Name of manufacturer
  manufacturerSupportUrl: text("manufacturer_support_url"), // URL to manufacturer support
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
  modelNumber: true,
  serialNumberPrefix: true,
  warrantyDuration: true,
  warrantyInfo: true,
  warrantyUrl: true,
  manufacturerName: true,
  manufacturerSupportUrl: true,
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

// NFT tiers and themes for receipt NFTs
export const nftTiers = pgTable("nft_tiers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // Standard, Premium, Luxury, etc.
  description: text("description").notNull(),
  price: numeric("price").notNull(), // Price in USD
  features: jsonb("features"), // Features included in this tier
  maxItems: integer("max_items").default(50), // Maximum number of items that can be included
  animationEnabled: boolean("animation_enabled").default(false), // Whether animation is enabled
  specialEffects: boolean("special_effects").default(false), // Whether special effects are enabled
  metadata: jsonb("metadata"), // Additional tier metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNftTierSchema = createInsertSchema(nftTiers).pick({
  name: true,
  description: true,
  price: true,
  features: true,
  maxItems: true,
  animationEnabled: true,
  specialEffects: true,
  metadata: true,
  isActive: true,
});

// NFT themes for receipt NFTs
export const nftThemes = pgTable("nft_themes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // Pokemon, Luxury, Minimal, etc.
  description: text("description").notNull(),
  baseSvgTemplate: text("base_svg_template").notNull(), // Base SVG template for the theme
  previewImageUrl: text("preview_image_url"), // URL to preview image
  colorPalette: jsonb("color_palette"), // Color palette for the theme
  fontFamily: text("font_family").default("sans-serif"), // Font family for the theme
  specialEffects: jsonb("special_effects"), // Special effects for the theme (gradients, animations, etc.)
  requiredTier: text("required_tier").default("standard"), // Minimum tier required for this theme
  metadata: jsonb("metadata"), // Additional theme metadata
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNftThemeSchema = createInsertSchema(nftThemes).pick({
  name: true,
  description: true,
  baseSvgTemplate: true,
  previewImageUrl: true,
  colorPalette: true,
  fontFamily: true,
  specialEffects: true,
  requiredTier: true,
  metadata: true,
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
    modelNumber: z.string().optional(),
    serialNumber: z.string().optional(),
    warrantyExpiryDate: z.date().optional(),
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
    nft: z.object({
      tierId: z.number().optional(),
      tierName: z.string().optional(),
      tierPrice: z.string().optional(),
      themeId: z.number().optional(),
      themeName: z.string().optional(),
      imageUrl: z.string().optional(),
      animation: z.boolean().optional(),
      specialEffects: z.boolean().optional(),
      rarity: z.string().optional(),
      attributes: z.array(z.object({
        trait_type: z.string(),
        value: z.string()
      })).optional(),
      properties: z.record(z.string(), z.any()).optional()
    }).optional(),
    warrantyData: z.object({
      modelNumbers: z.array(z.string()).optional(),
      serialNumbers: z.array(z.string()).optional(),
      warrantyExpiryDates: z.array(z.date()).optional(),
      manufacturerInfo: z.string().optional(),
      supportUrl: z.string().optional()
    }).optional(),
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
    paymentMethod: z.string().optional(), // 'stripe', 'crypto', 'card', 'cash', etc.
    paymentStatus: z.string().optional(),
    paymentAmount: z.string().optional(),
    paymentCurrency: z.string().optional(), // 'usd', 'eth', 'matic', etc.
    receiptUrl: z.string().optional(),
    cryptoData: z.object({
      walletAddress: z.string().optional(),
      transactionHash: z.string().optional(),
      network: z.string().optional(), // 'ethereum', 'polygon', etc.
      tokenType: z.string().optional(), // 'eth', 'matic', 'usdc', etc.
      gasFee: z.string().optional(),
      confirmations: z.number().optional(),
      blockExplorerUrl: z.string().optional()
    }).optional(),
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

export type NftTier = typeof nftTiers.$inferSelect;
export type InsertNftTier = z.infer<typeof insertNftTierSchema>;

export type NftTheme = typeof nftThemes.$inferSelect;
export type InsertNftTheme = z.infer<typeof insertNftThemeSchema>;

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
  inventoryItems: many(inventoryItems),
  inventoryCollections: many(inventoryCollections),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  receipts: many(receipts),
  receiptItems: many(receiptItems),
  products: many(products),
  spendingStats: many(spendingStats),
  inventoryItems: many(inventoryItems),
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

// Define inventory items schema
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  receiptId: integer("receipt_id"), // Optional if manually added without receipt
  productId: integer("product_id"), // Optional link to product if identified
  name: text("name").notNull(),
  description: text("description"),
  quantity: integer("quantity").default(1).notNull(),
  purchasePrice: numeric("purchase_price"),
  purchaseDate: date("purchase_date"),
  expiryDate: date("expiry_date"),
  categoryId: integer("category_id"),
  brandName: text("brand_name"),
  modelNumber: text("model_number"),
  serialNumber: text("serial_number"),
  barcode: text("barcode"),
  imageUrl: text("image_url"),
  currentLocation: text("current_location"), // Where is this item now (Home, Office, etc.)
  status: text("status").default("active").notNull(), // active, used, expired, sold, donated, etc.
  lastUsedDate: date("last_used_date"),
  warrantyExpiryDate: date("warranty_expiry_date"),
  isReplaceable: boolean("is_replaceable").default(true), // Is this a consumable that would need to be replaced?
  replacementInterval: integer("replacement_interval"), // Days until replacement recommended
  replacementReminder: boolean("replacement_reminder").default(false), // Should system remind user to replace
  notes: text("notes"),
  tags: text("tags").array(), // Array of tags for better searching
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  metadata: jsonb("metadata"), // Additional metadata
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).pick({
  userId: true,
  receiptId: true,
  productId: true,
  name: true,
  description: true,
  quantity: true,
  purchasePrice: true,
  purchaseDate: true,
  expiryDate: true,
  categoryId: true,
  brandName: true,
  modelNumber: true,
  serialNumber: true,
  barcode: true,
  imageUrl: true,
  currentLocation: true,
  status: true,
  lastUsedDate: true,
  warrantyExpiryDate: true,
  isReplaceable: true,
  replacementInterval: true,
  replacementReminder: true,
  notes: true,
  tags: true,
  metadata: true,
});

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;

// Inventory collections (e.g., "Kitchen Appliances", "Electronics", etc.)
export const inventoryCollections = pgTable("inventory_collections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"), // Icon for the collection
  color: text("color"), // Color for the collection
  isDefault: boolean("is_default").default(false), // Is this a default collection
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertInventoryCollectionSchema = createInsertSchema(inventoryCollections).pick({
  userId: true,
  name: true,
  description: true,
  icon: true,
  color: true,
  isDefault: true,
});

export type InventoryCollection = typeof inventoryCollections.$inferSelect;
export type InsertInventoryCollection = z.infer<typeof insertInventoryCollectionSchema>;

// Items in collections
export const inventoryItemCollections = pgTable("inventory_item_collections", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull(),
  collectionId: integer("collection_id").notNull(),
  addedAt: timestamp("added_at").defaultNow().notNull(),
}, (table) => {
  return {
    uniqueItemCollectionConstraint: unique().on(table.itemId, table.collectionId),
  }
});

export const insertInventoryItemCollectionSchema = createInsertSchema(inventoryItemCollections).pick({
  itemId: true,
  collectionId: true,
});

export type InventoryItemCollection = typeof inventoryItemCollections.$inferSelect;
export type InsertInventoryItemCollection = z.infer<typeof insertInventoryItemCollectionSchema>;

// Full inventory item for API responses
export const fullInventoryItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  quantity: z.number(),
  purchasePrice: z.string().optional(), // numeric comes as string
  purchaseDate: z.string().optional(),
  expiryDate: z.string().optional(),
  category: z.object({
    id: z.number(),
    name: z.string(),
    color: z.string(),
    icon: z.string(),
  }).optional(),
  receipt: z.object({
    id: z.number(),
    date: z.string(),
    merchant: z.object({
      name: z.string(),
      logo: z.string().optional(),
    }),
    blockchainVerified: z.boolean().optional(),
    nftTokenId: z.string().optional(),
  }).optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  serial: z.string().optional(),
  warranty: z.object({
    expiryDate: z.string().optional(),
    daysRemaining: z.number().optional(),
    status: z.string().optional(), // active, expired, etc.
  }).optional(),
  location: z.string().optional(),
  status: z.string(),
  lastUsed: z.string().optional(),
  isReplaceable: z.boolean().optional(),
  collections: z.array(z.object({
    id: z.number(),
    name: z.string(),
    color: z.string().optional(),
    icon: z.string().optional(),
  })).optional(),
  tags: z.array(z.string()).optional(),
});

export type FullInventoryItem = z.infer<typeof fullInventoryItemSchema>;

// Define inventory relations
export const inventoryItemsRelations = relations(inventoryItems, ({ one, many }) => ({
  user: one(users, {
    fields: [inventoryItems.userId],
    references: [users.id],
  }),
  receipt: one(receipts, {
    fields: [inventoryItems.receiptId],
    references: [receipts.id],
  }),
  product: one(products, {
    fields: [inventoryItems.productId],
    references: [products.id],
  }),
  category: one(categories, {
    fields: [inventoryItems.categoryId],
    references: [categories.id],
  }),
  collections: many(inventoryItemCollections),
}));

export const inventoryCollectionsRelations = relations(inventoryCollections, ({ one, many }) => ({
  user: one(users, {
    fields: [inventoryCollections.userId],
    references: [users.id],
  }),
  items: many(inventoryItemCollections),
}));

export const inventoryItemCollectionsRelations = relations(inventoryItemCollections, ({ one }) => ({
  inventoryItem: one(inventoryItems, {
    fields: [inventoryItemCollections.itemId],
    references: [inventoryItems.id],
  }),
  collection: one(inventoryCollections, {
    fields: [inventoryItemCollections.collectionId],
    references: [inventoryCollections.id],
  }),
}));

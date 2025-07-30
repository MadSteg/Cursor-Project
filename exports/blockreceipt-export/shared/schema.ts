import { pgTable, serial, text, timestamp, json, integer, boolean, primaryKey, foreignKey } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Receipt OCR Cache Table
export const ocrResultCache = pgTable('ocr_result_cache', {
  id: serial('id').primaryKey(),
  imageHash: text('image_hash').notNull().unique(), // Hash of the image for lookup
  result: json('result').notNull(), // The extracted receipt data
  confidence: integer('confidence').notNull(), // Confidence score 0-100
  processingMethod: text('processing_method').notNull(), // 'openai', 'tesseract', etc.
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'), // When this cache entry should expire (null = never)
});

// Receipt Item Schema
export type ReceiptItem = {
  name: string;
  price: number;
  quantity: number;
};

// Receipt Data Schema
export type ExtractedReceiptData = {
  merchantName: string;
  date: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  total: number;
  category?: string;
  confidence: number;
  rawText?: string;
};

// User Receipt Table
export const userReceipts = pgTable('user_receipts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(), // Reference to user
  merchantName: text('merchant_name').notNull(),
  date: text('receipt_date').notNull(),
  total: integer('total').notNull(), // In cents
  subtotal: integer('subtotal'), // In cents
  tax: integer('tax'), // In cents
  items: json('items').$type<ReceiptItem[]>(),
  category: text('category'),
  imageHash: text('image_hash'), // Reference to original image if available
  tokenId: text('token_id'), // Blockchain token ID if minted
  txHash: text('tx_hash'), // Blockchain transaction hash if minted
  isEncrypted: boolean('is_encrypted').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Schema for inserting OCR cache entries
export const insertOcrCacheSchema = createInsertSchema(ocrResultCache).omit({
  id: true,
  createdAt: true,
});

// Schema for inserting receipt records
export const insertReceiptSchema = createInsertSchema(userReceipts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for the insert schemas
export type InsertOcrCache = z.infer<typeof insertOcrCacheSchema>;
export type InsertReceipt = z.infer<typeof insertReceiptSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').unique(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  fullName: text('full_name'),
  walletAddress: text('wallet_address').unique(), // For web3 wallet login
  nonce: text('nonce'), // For web3 signature verification
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Merchants Table
export const merchants = pgTable('merchants', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  logoUrl: text('logo_url'),
  website: text('website'),
  category: text('category'),
  walletAddress: text('wallet_address'), // Merchant's wallet for identifying their NFTs
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Merchant Name Patterns Table - For recognizing merchant names in receipts
export const merchantNamePatterns = pgTable('merchant_name_patterns', {
  id: serial('id').primaryKey(),
  merchantId: integer('merchant_id').notNull().references(() => merchants.id),
  pattern: text('pattern').notNull(), // Pattern to match (e.g., "WALMART", "Walmart Inc", etc.)
  priority: integer('priority').default(0), // Higher priority patterns are checked first
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Merchant Promotions Table - For storing promotional content
export const merchantPromotions = pgTable('merchant_promotions', {
  id: serial('id').primaryKey(),
  merchantId: integer('merchant_id').notNull().references(() => merchants.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  couponCode: text('coupon_code'), // Plain text coupon code
  discount: integer('discount'), // Percentage discount amount
  isActive: boolean('is_active').default(true),
  minimumPurchase: integer('minimum_purchase'), // Minimum purchase amount in cents
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Receipts Table (blockchain receipts)
export const receipts = pgTable('receipts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  merchantId: integer('merchant_id').notNull().references(() => merchants.id),
  date: timestamp('date').notNull(),
  total: integer('total').notNull(), // In cents
  subtotal: integer('subtotal'), // In cents
  tax: integer('tax'), // In cents
  items: json('items').$type<ReceiptItem[]>(),
  category: text('category'),
  tokenId: text('token_id'), // Blockchain token ID
  txHash: text('tx_hash'), // Blockchain transaction hash
  isEncrypted: boolean('is_encrypted').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Taco Threshold Encryption Keys Table
export const tacoKeys = pgTable('taco_keys', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  publicKey: text('public_key').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Shared Receipts Table (for taco re-encryption)
export const sharedReceipts = pgTable('shared_receipts', {
  id: serial('id').primaryKey(),
  receiptId: integer('receipt_id').notNull().references(() => receipts.id),
  ownerId: integer('owner_id').notNull().references(() => users.id),
  targetId: integer('target_id').notNull().references(() => users.id),
  encryptedData: text('encrypted_data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
  isRevoked: boolean('is_revoked').default(false),
});

// Inventory Items Table
export const inventoryItems = pgTable('inventory_items', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category'),
  status: text('status').default('active'),
  tags: json('tags').$type<string[]>().default([]),
  purchaseDate: timestamp('purchase_date'),
  purchasePrice: integer('purchase_price'), // In cents
  expiryDate: timestamp('expiry_date'),
  warrantyExpiryDate: timestamp('warranty_expiry_date'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Inventory Collections Table
export const inventoryCollections = pgTable('inventory_collections', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color'), // For UI display
  icon: text('icon'), // Icon name/reference
  isDefault: boolean('is_default').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Item-Collection Many-to-Many Relationship Table
export const itemCollections = pgTable('item_collections', {
  itemId: integer('item_id').notNull().references(() => inventoryItems.id),
  collectionId: integer('collection_id').notNull().references(() => inventoryCollections.id),
}, (table) => {
  return {
    pk: primaryKey({columns: [table.itemId, table.collectionId]}),
  };
});

// Create the insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInventoryCollectionSchema = createInsertSchema(inventoryCollections).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

// User Wallets Table (for hot wallets generated at signup)
export const userWallets = pgTable('user_wallets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id).unique(),
  address: text('wallet_address').notNull().unique(),
  encryptedPrivateKey: text('encrypted_private_key'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastUsedAt: timestamp('last_used_at'),
});

// Schema for inserting user wallets
export const insertUserWalletSchema = createInsertSchema(userWallets).omit({
  id: true,
  createdAt: true,
  lastUsedAt: true,
});

// Types for the tables
export type OcrCache = typeof ocrResultCache.$inferSelect;
export type Receipt = typeof userReceipts.$inferSelect;
export type User = typeof users.$inferSelect;
export type Merchant = typeof merchants.$inferSelect;
export type MerchantNamePattern = typeof merchantNamePatterns.$inferSelect;
export type MerchantPromotion = typeof merchantPromotions.$inferSelect;
export type BlockchainReceipt = typeof receipts.$inferSelect;
export type TacoKey = typeof tacoKeys.$inferSelect;
export type SharedReceipt = typeof sharedReceipts.$inferSelect;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InventoryCollection = typeof inventoryCollections.$inferSelect;
export type ItemCollection = typeof itemCollections.$inferSelect;
export type UserWallet = typeof userWallets.$inferSelect;
export type InsertUserWallet = z.infer<typeof insertUserWalletSchema>;

// API Keys Table
export const apiKeys = pgTable('api_keys', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  merchantId: integer('merchant_id').references(() => merchants.id),
  keyValue: text('key_value').notNull(),
  name: text('name').notNull(),
  scopes: json('scopes').$type<string[]>().default([]),
  expiresAt: timestamp('expires_at'),
  lastUsed: timestamp('last_used'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  revokedAt: timestamp('revoked_at'),
});

// Create API key insert schema
export const insertApiKeySchema = createInsertSchema(apiKeys).omit({
  id: true,
  userId: true,
  keyValue: true,
  createdAt: true,
  lastUsed: true,
  revokedAt: true,
});

// Encrypted Metadata Table (for NFT receipts with dual metadata structure)
export const encryptedMetadata = pgTable('encrypted_metadata', {
  id: serial('id').primaryKey(),
  tokenId: text('token_id').notNull().unique(),
  // User-controlled private receipt data
  userData: json('user_data').notNull().$type<{
    capsule: string;
    ciphertext: string;
    policyId: string;
  }>(),
  userDataHash: text('user_data_hash').notNull(), // Hash of the user encrypted data for verification
  
  // Vendor-controlled promotion data (optional)
  promoData: json('promo_data').$type<{
    capsule: string;
    ciphertext: string;
    policyId: string;
    expiresAt: number; // Unix timestamp for expiration
  }>(),
  
  unencryptedPreview: json('unencrypted_preview'), // Public preview data
  ownerAddress: text('owner_address').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Encrypted Metadata Access Table
export const encryptedMetadataAccess = pgTable('encrypted_metadata_access', {
  id: serial('id').primaryKey(),
  metadataId: integer('metadata_id').notNull().references(() => encryptedMetadata.id),
  grantedToAddress: text('granted_to_address').notNull(),
  reEncryptedData: text('re_encrypted_data').notNull(), // Data re-encrypted for the grantee
  expiresAt: timestamp('expires_at'),
  isRevoked: boolean('is_revoked').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// NFT Pool Table (now merchant-specific)
export const nftPool = pgTable('nft_pool', {
  id: serial('id').primaryKey(),
  merchantId: integer('merchant_id').notNull().references(() => merchants.id),
  nftId: text('nft_id').notNull().unique(),
  name: text('name').notNull(),
  image: text('image').notNull(), // URL to image
  description: text('description').notNull(),
  tier: text('tier').notNull(), // "basic", "premium", "luxury"
  metadataUri: text('metadata_uri').notNull(), // IPFS URI for metadata
  categories: text('categories').array().notNull(),
  enabled: boolean('enabled').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Loyalty Points Table
export const loyaltyPoints = pgTable('loyalty_points', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  merchantId: integer('merchant_id').notNull().references(() => merchants.id),
  points: integer('points').notNull(), // Points balance
  earnedFromReceiptId: integer('earned_from_receipt_id').references(() => userReceipts.id),
  expiresAt: timestamp('expires_at'), // When points expire
  isRedeemed: boolean('is_redeemed').default(false),
  redeemedAt: timestamp('redeemed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Merchant Reward Pools Table
export const merchantRewardPools = pgTable('merchant_reward_pools', {
  id: serial('id').primaryKey(),
  merchantId: integer('merchant_id').notNull().references(() => merchants.id),
  name: text('name').notNull(), // "Holiday Collection", "Summer NFTs", etc.
  description: text('description'),
  totalFunded: integer('total_funded').notNull(), // Amount merchant funded in cents
  totalMinted: integer('total_minted').default(0), // Number of NFTs minted
  ourCommissionRate: integer('our_commission_rate').default(10), // Percentage we take (10 = 10%)
  isActive: boolean('is_active').default(true),
  startDate: timestamp('start_date').defaultNow().notNull(),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Reward Claims Table
export const rewardClaims = pgTable('reward_claims', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id),
  merchantId: integer('merchant_id').notNull().references(() => merchants.id),
  receiptId: integer('receipt_id').notNull().references(() => userReceipts.id),
  rewardType: text('reward_type').notNull(), // "nft", "discount", "points"
  nftTokenId: text('nft_token_id'), // If reward is an NFT
  pointsAwarded: integer('points_awarded'), // If reward is points
  discountAmount: integer('discount_amount'), // If reward is discount in cents
  tier: text('tier').notNull(), // "basic", "premium", "luxury"
  isAutoClaimed: boolean('is_auto_claimed').default(true),
  claimedAt: timestamp('claimed_at').defaultNow().notNull(),
});

// NFT Transfers Table
export const nftTransfers = pgTable('nft_transfers', {
  id: serial('id').primaryKey(),
  tokenId: text('token_id').notNull(),
  fromAddress: text('from_address'),
  toAddress: text('to_address').notNull(),
  txHash: text('tx_hash').notNull(),
  blockNumber: integer('block_number').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  processedForAccess: boolean('processed_for_access').default(false),
});

// Create insert schemas for metadata tables
export const insertEncryptedMetadataSchema = createInsertSchema(encryptedMetadata).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEncryptedMetadataAccessSchema = createInsertSchema(encryptedMetadataAccess).omit({
  id: true,
  createdAt: true,
});

export const insertNftTransferSchema = createInsertSchema(nftTransfers).omit({
  id: true,
});

// Types for the insert schemas
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InsertInventoryCollection = z.infer<typeof insertInventoryCollectionSchema>;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type InsertEncryptedMetadata = z.infer<typeof insertEncryptedMetadataSchema>;
export type InsertEncryptedMetadataAccess = z.infer<typeof insertEncryptedMetadataAccessSchema>;
export type InsertNftTransfer = z.infer<typeof insertNftTransferSchema>;

// NFT Ownership Table
export const nftOwnership = pgTable('nft_ownership', {
  id: serial('id').primaryKey(),
  tokenId: text('token_id').notNull(),
  ownerAddress: text('owner_address').notNull(),
  contractAddress: text('contract_address').notNull(),
  tokenType: text('token_type').default('ERC1155'), // ERC721, ERC1155
  chainId: integer('chain_id').notNull(),
  metadata: json('metadata'),
  acquiredAt: timestamp('acquired_at').defaultNow().notNull(),
  lastVerifiedAt: timestamp('last_verified_at').defaultNow().notNull(),
});

// Create insert schema for NFT ownership
export const insertNftOwnershipSchema = createInsertSchema(nftOwnership).omit({
  id: true,
  lastVerifiedAt: true,
});

// Create insert schema for nft pool
export const insertNftPoolSchema = createInsertSchema(nftPool).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLoyaltyPointsSchema = createInsertSchema(loyaltyPoints).omit({
  id: true,
  createdAt: true,
});

export const insertMerchantRewardPoolSchema = createInsertSchema(merchantRewardPools).omit({
  id: true,
  createdAt: true,
});

export const insertRewardClaimSchema = createInsertSchema(rewardClaims).omit({
  id: true,
  claimedAt: true,
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type EncryptedMetadata = typeof encryptedMetadata.$inferSelect;
export type EncryptedMetadataAccess = typeof encryptedMetadataAccess.$inferSelect;
export type NftTransfer = typeof nftTransfers.$inferSelect;
export type NftOwnership = typeof nftOwnership.$inferSelect;
export type NftPool = typeof nftPool.$inferSelect;
export type LoyaltyPoints = typeof loyaltyPoints.$inferSelect;
export type MerchantRewardPool = typeof merchantRewardPools.$inferSelect;
export type RewardClaim = typeof rewardClaims.$inferSelect;
export type InsertNftOwnership = z.infer<typeof insertNftOwnershipSchema>;
export type InsertNftPool = z.infer<typeof insertNftPoolSchema>;
export type InsertLoyaltyPoints = z.infer<typeof insertLoyaltyPointsSchema>;
export type InsertMerchantRewardPool = z.infer<typeof insertMerchantRewardPoolSchema>;
export type InsertRewardClaim = z.infer<typeof insertRewardClaimSchema>;
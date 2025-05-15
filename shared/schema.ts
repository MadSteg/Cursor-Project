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

// Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: text('full_name'),
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
  capsule: text('capsule').notNull(),
  ciphertext: text('ciphertext').notNull(),
  policyPublicKey: text('policy_public_key').notNull(),
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

// Encrypted Metadata Table (for NFT receipts)
export const encryptedMetadata = pgTable('encrypted_metadata', {
  id: serial('id').primaryKey(),
  tokenId: text('token_id').notNull().unique(),
  encryptedData: text('encrypted_data').notNull(),
  dataHash: text('data_hash').notNull(), // Hash of the encrypted data for verification
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

export type ApiKey = typeof apiKeys.$inferSelect;
export type EncryptedMetadata = typeof encryptedMetadata.$inferSelect;
export type EncryptedMetadataAccess = typeof encryptedMetadataAccess.$inferSelect;
export type NftTransfer = typeof nftTransfers.$inferSelect;
export type NftOwnership = typeof nftOwnership.$inferSelect;
export type InsertNftOwnership = z.infer<typeof insertNftOwnershipSchema>;
import { pgTable, serial, text, timestamp, integer, boolean, json, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Merchants table
export const merchants = pgTable("merchants", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// API Keys for merchant integrations
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  merchantId: integer("merchant_id").notNull(),
  key: text("key").notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Receipts table
// Inventory collections table
export const inventoryCollections = pgTable("inventory_collections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Inventory items table
export const inventoryItems = pgTable("inventory_items", {
  id: serial("id").primaryKey(),
  collectionId: integer("collection_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  quantity: integer("quantity").notNull().default(1),
  price: integer("price"), // In cents
  tags: text("tags").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const receipts = pgTable("receipts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  merchantId: integer("merchant_id").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  subtotal: integer("subtotal").notNull(), // In cents
  tax: integer("tax").notNull(), // In cents
  total: integer("total").notNull(), // In cents
  blockchainTxHash: text("blockchain_tx_hash"),
  blockchainVerified: boolean("blockchain_verified").notNull().default(false),
  blockNumber: integer("block_number"),
  nftTokenId: text("nft_token_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Taco encryption keys
export const tacoKeys = pgTable("taco_keys", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  publicKey: text("public_key").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Shared receipts
export const sharedReceipts = pgTable("shared_receipts", {
  id: serial("id").primaryKey(),
  receiptId: integer("receipt_id").notNull(),
  ownerId: integer("owner_id").notNull(),
  targetId: integer("target_id").notNull(),
  encryptedData: text("encrypted_data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  isRevoked: boolean("is_revoked").notNull().default(false),
});

// Receipt NFT table with blockchain integration
export const nftReceipts = pgTable("nft_receipts", {
  id: serial("id").primaryKey(),
  tokenId: text("token_id").notNull(),
  walletAddress: text("wallet_address").notNull(),
  merchantName: text("merchant_name").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  total: integer("total").notNull(), // Store as cents/smallest unit
  items: integer("items").notNull(),
  receiptType: text("receipt_type").notNull(), // standard, premium, luxury, ultra
  txHash: text("tx_hash"),
  ipfsMetadataUrl: text("ipfs_metadata_url"),
  nftArtId: text("nft_art_id").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, failed
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Encrypted metadata access records - tracks who has access to what encrypted data
export const encryptedMetadataAccess = pgTable("encrypted_metadata_access", {
  id: serial("id").primaryKey(),
  tokenId: text("token_id").notNull(),
  granteeAddress: text("grantee_address").notNull(), // Wallet address that has been granted access
  isOwner: boolean("is_owner").notNull().default(false), // Indicates if grantee is the original owner
  grantedBy: text("granted_by").notNull(), // Wallet address that granted access
  grantedAt: timestamp("granted_at").notNull().defaultNow(),
  revokedAt: timestamp("revoked_at"), // null if access is still valid
  tacoEncryptionId: text("taco_encryption_id"), // TACo encryption identity/reference
});

// Encrypted receipt metadata - the sensitive private data
export const encryptedMetadata = pgTable("encrypted_metadata", {
  id: serial("id").primaryKey(),
  tokenId: text("token_id").notNull().unique(),
  encryptedData: text("encrypted_data").notNull(), // The encrypted JSON data
  unencryptedPreview: json("unencrypted_preview").notNull(), // Limited preview data that's always visible
  dataHash: text("data_hash").notNull(), // Hash of the original data for verification
  ownerAddress: text("owner_address").notNull(), // Original owner's address
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// NFT token transfers - track ownership changes to automatically revoke access
export const nftTransfers = pgTable("nft_transfers", {
  id: serial("id").primaryKey(),
  tokenId: text("token_id").notNull(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  transferTxHash: text("transfer_tx_hash").notNull(),
  transferredAt: timestamp("transferred_at").notNull().defaultNow(),
  accessRevoked: boolean("access_revoked").notNull().default(false),
  revokeAccessTxHash: text("revoke_access_tx_hash"),
});

// Insert schemas
export const insertNftReceiptSchema = createInsertSchema(nftReceipts)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertEncryptedMetadataAccessSchema = createInsertSchema(encryptedMetadataAccess)
  .omit({ id: true, grantedAt: true, revokedAt: true });

export const insertEncryptedMetadataSchema = createInsertSchema(encryptedMetadata)
  .omit({ id: true, createdAt: true });

export const insertNftTransferSchema = createInsertSchema(nftTransfers)
  .omit({ id: true, transferredAt: true, accessRevoked: true, revokeAccessTxHash: true });
  
// Inventory collection and item schemas
export const insertInventoryCollectionSchema = createInsertSchema(inventoryCollections)
  .omit({ id: true, createdAt: true, updatedAt: true });

export const insertInventoryItemSchema = createInsertSchema(inventoryItems)
  .omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type NftReceipt = typeof nftReceipts.$inferSelect;
export type InsertNftReceipt = z.infer<typeof insertNftReceiptSchema>;

export type EncryptedMetadataAccess = typeof encryptedMetadataAccess.$inferSelect;
export type InsertEncryptedMetadataAccess = z.infer<typeof insertEncryptedMetadataAccessSchema>;

export type EncryptedMetadata = typeof encryptedMetadata.$inferSelect;
export type InsertEncryptedMetadata = z.infer<typeof insertEncryptedMetadataSchema>;

export type NftTransfer = typeof nftTransfers.$inferSelect;
export type InsertNftTransfer = z.infer<typeof insertNftTransferSchema>;

// Basic types
export type User = typeof users.$inferSelect;
export type Merchant = typeof merchants.$inferSelect;
export type Receipt = typeof receipts.$inferSelect;
export type TacoKey = typeof tacoKeys.$inferSelect;
export type SharedReceipt = typeof sharedReceipts.$inferSelect;
export type ApiKey = typeof apiKeys.$inferSelect;

// Inventory types
export type InventoryCollection = typeof inventoryCollections.$inferSelect;
export type InsertInventoryCollection = z.infer<typeof insertInventoryCollectionSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;

// Define FullReceipt type for compatibility
export interface FullReceipt extends Receipt {
  merchant: {
    id: number;
    name: string;
    category?: string;
    logoUrl?: string;
  };
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
}
import { pgTable, text, serial, integer, boolean, numeric, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user schema as provided
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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
});

export const insertReceiptItemSchema = createInsertSchema(receiptItems).pick({
  receiptId: true,
  name: true,
  price: true,
  quantity: true,
});

// Define receipts
export const receipts = pgTable("receipts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  merchantId: integer("merchant_id").notNull(),
  categoryId: integer("category_id").notNull(),
  date: timestamp("date").notNull().defaultNow(),
  subtotal: numeric("subtotal").notNull(),
  tax: numeric("tax").notNull(),
  total: numeric("total").notNull(),
  blockchainTxHash: text("blockchain_tx_hash"),
  blockchainVerified: boolean("blockchain_verified").default(false),
  blockNumber: integer("block_number"),
  nftTokenId: text("nft_token_id"),
});

export const insertReceiptSchema = createInsertSchema(receipts).pick({
  userId: true,
  merchantId: true,
  categoryId: true,
  date: true,
  subtotal: true,
  tax: true,
  total: true,
  blockchainTxHash: true,
  blockchainVerified: true,
  blockNumber: true,
  nftTokenId: true,
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
  })),
  blockchain: z.object({
    txHash: z.string().optional(),
    verified: z.boolean(),
    blockNumber: z.number().optional(),
    nftTokenId: z.string().optional(),
  }),
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

export type FullReceipt = z.infer<typeof fullReceiptSchema>;

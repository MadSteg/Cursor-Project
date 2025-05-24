import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import asyncHandler from 'express-async-handler';

// Validation middleware factory
export const validateBody = (schema: ZodSchema) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
        return;
      }
      next(error);
    }
  });
};

// Common validation schemas
export const schemas = {
  // Receipt creation schema
  createReceipt: z.object({
    userId: z.number().int().positive(),
    merchantName: z.string().min(1, 'Merchant name is required'),
    total: z.number().positive('Total must be positive'),
    subtotal: z.number().positive().optional(),
    tax: z.number().nonnegative().optional(),
    date: z.string().datetime().optional(),
    items: z.array(z.object({
      name: z.string().min(1, 'Item name is required'),
      quantity: z.number().int().positive('Quantity must be positive'),
      price: z.number().nonnegative('Price must be non-negative')
    })).min(1, 'At least one item is required').optional(),
    category: z.string().optional(),
    imageHash: z.string().optional()
  }),

  // User creation schema
  createUser: z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters')
  }),

  // NFT minting schema
  mintNFT: z.object({
    walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
    receiptId: z.number().int().positive(),
    tokenId: z.string().optional(),
    metadataUri: z.string().url().optional()
  }),

  // Loyalty rewards claim schema
  claimReward: z.object({
    userId: z.number().int().positive(),
    rewardType: z.enum(['points', 'nft', 'discount']),
    amount: z.number().positive().optional(),
    merchantName: z.string().min(1).optional()
  })
};
import { Router } from 'express';
import { sendReceiptEmail } from '../services/emailService';
import { z } from 'zod';

const router = Router();

// Email receipt request schema
const emailReceiptSchema = z.object({
  to: z.string().email("Valid email is required"),
  productName: z.string().min(1, "Product name is required"),
  merchantName: z.string().min(1, "Merchant name is required"),
  receiptId: z.number().int().positive("Receipt ID must be a positive integer"),
  receiptNftId: z.string().min(1, "NFT ID is required"),
  transactionHash: z.string().min(1, "Transaction hash is required"),
  walletAddress: z.string().min(1, "Wallet address is required"),
  tier: z.string().min(1, "Tier is required"),
  amount: z.number().positive("Amount must be positive"),
  ipfsHash: z.string().optional(),
});

// Send receipt email endpoint
router.post('/send-receipt', async (req, res) => {
  try {
    const validation = emailReceiptSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request data', 
        errors: validation.error.format() 
      });
    }
    
    const result = await sendReceiptEmail(validation.data);
    
    if (result) {
      return res.status(200).json({ 
        success: true, 
        message: 'Receipt email sent successfully' 
      });
    } else {
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send receipt email' 
      });
    }
  } catch (error: any) {
    console.error('Error sending receipt email:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error', 
      error: error.message 
    });
  }
});

export default router;
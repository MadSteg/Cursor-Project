/**
 * Merchant Routes
 * 
 * API endpoints for merchant management and vendor metadata
 */

import express from 'express';
import { merchantService } from '../services/merchantService';
import { couponService } from '../services/couponService';
import { requireAuth } from '../middleware/requireAuth';
import { createLogger } from '../logger';

const logger = createLogger('merchant-routes');
const router = express.Router();

// Get merchant by ID
router.get('/:id', async (req, res) => {
  try {
    const merchantId = parseInt(req.params.id);
    if (isNaN(merchantId)) {
      return res.status(400).json({ success: false, message: 'Invalid merchant ID' });
    }

    const merchant = await merchantService.getMerchantById(merchantId);
    if (!merchant) {
      return res.status(404).json({ success: false, message: 'Merchant not found' });
    }

    res.json({ success: true, merchant });
  } catch (error) {
    logger.error(`Error fetching merchant: ${error}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get promotions for a merchant
router.get('/:id/promotions', async (req, res) => {
  try {
    const merchantId = parseInt(req.params.id);
    if (isNaN(merchantId)) {
      return res.status(400).json({ success: false, message: 'Invalid merchant ID' });
    }

    const promotions = await merchantService.getMerchantPromotions(merchantId);
    res.json({ success: true, promotions });
  } catch (error) {
    logger.error(`Error fetching merchant promotions: ${error}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get coupons for a merchant
router.get('/:id/coupons', async (req, res) => {
  try {
    const merchantId = parseInt(req.params.id);
    if (isNaN(merchantId)) {
      return res.status(400).json({ success: false, message: 'Invalid merchant ID' });
    }

    const coupons = await couponService.getMerchantCoupons(merchantId);
    res.json({ success: true, coupons });
  } catch (error) {
    logger.error(`Error fetching merchant coupons: ${error}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a merchant (admin only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const { name, logoUrl, website, category, walletAddress } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Merchant name is required' });
    }
    
    const merchant = await merchantService.addMerchant({
      name,
      logoUrl,
      website,
      category,
      walletAddress
    });
    
    res.status(201).json({ success: true, merchant });
  } catch (error) {
    logger.error(`Error creating merchant: ${error}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add a merchant name pattern
router.post('/:id/patterns', requireAuth, async (req, res) => {
  try {
    const merchantId = parseInt(req.params.id);
    if (isNaN(merchantId)) {
      return res.status(400).json({ success: false, message: 'Invalid merchant ID' });
    }
    
    const { pattern, priority } = req.body;
    
    if (!pattern) {
      return res.status(400).json({ success: false, message: 'Pattern is required' });
    }
    
    const result = await merchantService.addMerchantNamePattern(
      merchantId,
      pattern,
      priority || 0
    );
    
    res.status(201).json({ success: true, pattern: result });
  } catch (error) {
    logger.error(`Error adding merchant pattern: ${error}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create a promotion for a merchant
router.post('/:id/promotions', requireAuth, async (req, res) => {
  try {
    const merchantId = parseInt(req.params.id);
    if (isNaN(merchantId)) {
      return res.status(400).json({ success: false, message: 'Invalid merchant ID' });
    }
    
    const { 
      title, 
      description, 
      startDate, 
      endDate, 
      couponCode, 
      discount, 
      minimumPurchase 
    } = req.body;
    
    if (!title || !description || !startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, description, start date, and end date are required' 
      });
    }
    
    const promotion = await merchantService.createPromotion({
      merchantId,
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      couponCode,
      discount,
      minimumPurchase
    });
    
    res.status(201).json({ success: true, promotion });
  } catch (error) {
    logger.error(`Error creating promotion: ${error}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Identify merchant from receipt name
router.post('/identify', async (req, res) => {
  try {
    const { merchantName } = req.body;
    
    if (!merchantName) {
      return res.status(400).json({ success: false, message: 'Merchant name is required' });
    }
    
    const result = await merchantService.identifyMerchantFromReceipt(merchantName);
    
    if (result.merchantId) {
      const merchant = await merchantService.getMerchantById(result.merchantId);
      res.json({ 
        success: true, 
        identified: true,
        merchantId: result.merchantId,
        confidence: result.confidence,
        merchant
      });
    } else {
      res.json({ 
        success: true, 
        identified: false,
        message: 'No matching merchant found'
      });
    }
  } catch (error) {
    logger.error(`Error identifying merchant: ${error}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export const merchantRoutes = router;
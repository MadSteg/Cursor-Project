import express from 'express';
import { merchantMatchingService } from '../services/merchantMatchingService';

const router = express.Router();

/**
 * GET /api/merchants/directory
 * Get the entire merchant directory
 */
router.get('/directory', async (req, res) => {
  try {
    const merchants = merchantMatchingService.getAllMerchants();
    res.json(merchants);
  } catch (error) {
    console.error('Error fetching merchant directory:', error);
    res.status(500).json({ message: 'Failed to fetch merchant directory' });
  }
});

/**
 * GET /api/merchants/promo-templates
 * Get all promo templates
 */
router.get('/promo-templates', async (req, res) => {
  try {
    const templates = merchantMatchingService.getAllPromoTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Error fetching promo templates:', error);
    res.status(500).json({ message: 'Failed to fetch promo templates' });
  }
});

/**
 * GET /api/merchants/promo-templates/:merchantId
 * Get promo templates for a specific merchant
 */
router.get('/promo-templates/:merchantId', async (req, res) => {
  try {
    const { merchantId } = req.params;
    const templates = merchantMatchingService.getMerchantPromoTemplates(merchantId);
    
    if (templates.length === 0) {
      res.status(404).json({ message: `No promo templates found for merchant: ${merchantId}` });
      return;
    }
    
    res.json(templates);
  } catch (error) {
    console.error('Error fetching merchant promo templates:', error);
    res.status(500).json({ message: 'Failed to fetch merchant promo templates' });
  }
});

/**
 * POST /api/merchants/match
 * Match a merchant name to a merchant in the directory
 */
router.post('/match', async (req, res) => {
  try {
    const { merchantName } = req.body;
    
    if (!merchantName) {
      res.status(400).json({ message: 'Merchant name is required' });
      return;
    }
    
    const merchant = merchantMatchingService.matchMerchant(merchantName);
    
    if (!merchant) {
      res.status(404).json({ message: 'No matching merchant found' });
      return;
    }
    
    res.json(merchant);
  } catch (error) {
    console.error('Error matching merchant:', error);
    res.status(500).json({ message: 'Failed to match merchant' });
  }
});

/**
 * POST /api/merchants/find-promo
 * Find an applicable promo template for a receipt
 */
router.post('/find-promo', async (req, res) => {
  try {
    const { merchantId, receiptData } = req.body;
    
    if (!merchantId) {
      res.status(400).json({ message: 'Merchant ID is required' });
      return;
    }
    
    const promoTemplate = merchantMatchingService.findApplicablePromo(merchantId, receiptData);
    
    if (!promoTemplate) {
      res.status(404).json({ message: 'No applicable promo template found' });
      return;
    }
    
    res.json(promoTemplate);
  } catch (error) {
    console.error('Error finding promo template:', error);
    res.status(500).json({ message: 'Failed to find promo template' });
  }
});

/**
 * POST /api/merchants/process-receipt
 * Process a receipt and generate applicable coupons
 */
router.post('/process-receipt', async (req, res) => {
  try {
    const { receiptData } = req.body;
    
    if (!receiptData || !receiptData.merchantName) {
      res.status(400).json({ message: 'Receipt data with merchant name is required' });
      return;
    }
    
    const coupons = merchantMatchingService.processReceiptForCoupons(receiptData);
    
    res.json({ coupons });
  } catch (error) {
    console.error('Error processing receipt for coupons:', error);
    res.status(500).json({ message: 'Failed to process receipt for coupons' });
  }
});

/**
 * GET /api/merchants/verification-stats
 * Get merchant verification statistics
 */
router.get('/verification-stats', async (req, res) => {
  try {
    // Mock statistics for now - in production this would query the database
    const stats = {
      verified: 142,
      total: 187,
      byMerchant: {
        WALMART: { verified: 32, total: 41 },
        TARGET: { verified: 28, total: 35 },
        CVS: { verified: 18, total: 24 },
        BESTBUY: { verified: 16, total: 22 },
        // Other merchants...
      }
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching verification stats:', error);
    res.status(500).json({ message: 'Failed to fetch verification stats' });
  }
});

export const merchantRoutes = router;
/**
 * Merchant API Routes
 * Provides endpoints for browsing merchants and their products
 */

import express from 'express';
import { 
  merchants, 
  getMerchantById, 
  getProductsByMerchant
} from '@shared/products';

const router = express.Router();

/**
 * @route GET /api/merchants
 * @desc Get all merchants
 */
router.get('/', (req, res) => {
  res.json(merchants);
});

/**
 * @route GET /api/merchants/:id
 * @desc Get merchant by ID
 */
router.get('/:id', (req, res) => {
  const merchant = getMerchantById(req.params.id);
  
  if (!merchant) {
    return res.status(404).json({ message: 'Merchant not found' });
  }
  
  res.json(merchant);
});

/**
 * @route GET /api/merchants/:id/products
 * @desc Get all products from a specific merchant
 */
router.get('/:id/products', (req, res) => {
  const merchant = getMerchantById(req.params.id);
  
  if (!merchant) {
    return res.status(404).json({ message: 'Merchant not found' });
  }
  
  const merchantProducts = getProductsByMerchant(req.params.id);
  
  // Filter to only available products unless specifically requested
  const availableOnly = req.query.includeUnavailable !== 'true';
  const filteredProducts = availableOnly 
    ? merchantProducts.filter(product => product.available)
    : merchantProducts;
  
  res.json(filteredProducts);
});

/**
 * @route GET /api/merchants/:id/receipt-templates
 * @desc Get receipt templates for a merchant
 */
router.get('/:id/receipt-templates', (req, res) => {
  const merchant = getMerchantById(req.params.id);
  
  if (!merchant) {
    return res.status(404).json({ message: 'Merchant not found' });
  }
  
  const templates = merchant.nftReceiptTemplates || {};
  
  res.json(templates);
});

export default router;
import { Router } from 'express';
import { createLogger } from '../logger';
import crypto from 'crypto';

const router = Router();
const logger = createLogger('pos-webhook');

// Simple in-memory storage for POS orders - in production this would use the database
const posOrders = new Map<string, any>();

/**
 * Verify Toast POS signature
 */
function verifyToastSignature(req: any, res: any, next: any) {
  const toastSignature = req.headers['x-toast-signature'];
  const secret = process.env.TOAST_WEBHOOK_SECRET || 'devSecretToast123'; // Use environment variable in production
  
  if (!toastSignature) {
    logger.warn('Missing Toast signature');
    return res.status(401).json({ success: false, message: 'Missing signature' });
  }
  
  // Get the raw body
  const body = JSON.stringify(req.body);
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body);
  const calculatedSignature = hmac.digest('hex');
  
  // In development mode, we'll bypass signature verification
  if (process.env.NODE_ENV === 'development') {
    logger.info('Development mode: Bypassing signature verification');
    return next();
  }
  
  if (calculatedSignature !== toastSignature) {
    logger.warn('Invalid Toast signature');
    return res.status(401).json({ success: false, message: 'Invalid signature' });
  }
  
  next();
}

/**
 * Verify Square signature
 */
function verifySquareSignature(req: any, res: any, next: any) {
  const squareSignature = req.headers['x-square-signature'];
  const secret = process.env.SQUARE_WEBHOOK_SECRET || 'devSecretSquare123';
  
  if (!squareSignature) {
    logger.warn('Missing Square signature');
    return res.status(401).json({ success: false, message: 'Missing signature' });
  }
  
  // Get the raw body
  const body = JSON.stringify(req.body);
  const hmac = crypto.createHmac('sha1', secret);
  hmac.update(body);
  const calculatedSignature = hmac.digest('hex');
  
  // In development mode, we'll bypass signature verification
  if (process.env.NODE_ENV === 'development') {
    logger.info('Development mode: Bypassing signature verification');
    return next();
  }
  
  if (calculatedSignature !== squareSignature) {
    logger.warn('Invalid Square signature');
    return res.status(401).json({ success: false, message: 'Invalid signature' });
  }
  
  next();
}

/**
 * Toast POS Webhook
 * POST /api/pos/webhook/toast
 */
router.post('/webhook/toast', verifyToastSignature, async (req, res) => {
  try {
    const { merchantId, orderId, total, subtotal, lineItems, timestamp } = req.body;
    
    // Generate a unique key for this order
    const orderKey = `${merchantId}:${orderId}`;
    
    // Store the order data for later verification
    posOrders.set(orderKey, {
      merchantId,
      orderId,
      total,
      subtotal,
      lineItems,
      timestamp: timestamp || Date.now(),
      source: 'toast'
    });
    
    logger.info(`Received Toast order: ${orderKey}`);
    
    res.status(200).json({
      success: true,
      message: 'Order received'
    });
  } catch (error) {
    logger.error('Error processing Toast webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing webhook'
    });
  }
});

/**
 * Square POS Webhook
 * POST /api/pos/webhook/square
 */
router.post('/webhook/square', verifySquareSignature, async (req, res) => {
  try {
    const { merchant_id, order_id, total_money, line_items, created_at } = req.body.data.object;
    
    // Square uses cents, so convert to dollars
    const total = total_money ? total_money.amount / 100 : 0;
    
    // Generate a unique key for this order
    const orderKey = `${merchant_id}:${order_id}`;
    
    // Store the order data for later verification
    posOrders.set(orderKey, {
      merchantId: merchant_id,
      orderId: order_id,
      total,
      subtotal: total, // Square doesn't always provide subtotal separately
      lineItems: line_items,
      timestamp: created_at ? new Date(created_at).getTime() : Date.now(),
      source: 'square'
    });
    
    logger.info(`Received Square order: ${orderKey}`);
    
    res.status(200).json({
      success: true,
      message: 'Order received'
    });
  } catch (error) {
    logger.error('Error processing Square webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing webhook'
    });
  }
});

/**
 * Clover POS Webhook
 * POST /api/pos/webhook/clover
 */
router.post('/webhook/clover', async (req, res) => {
  try {
    const { merchantId, orderId, total, lineItems, timestamp } = req.body;
    
    // Generate a unique key for this order
    const orderKey = `${merchantId}:${orderId}`;
    
    // Store the order data for later verification
    posOrders.set(orderKey, {
      merchantId,
      orderId,
      total,
      subtotal: total, // Clover doesn't always provide subtotal
      lineItems,
      timestamp: timestamp || Date.now(),
      source: 'clover'
    });
    
    logger.info(`Received Clover order: ${orderKey}`);
    
    res.status(200).json({
      success: true,
      message: 'Order received'
    });
  } catch (error) {
    logger.error('Error processing Clover webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing webhook'
    });
  }
});

/**
 * Find a POS order that matches the receipt
 * @param merchantId Merchant ID
 * @param total Receipt total
 * @param timestamp Receipt timestamp
 * @returns Matching POS order or undefined
 */
export function findMatchingPOSOrder(merchantId: string, total: number, timestamp: number): any {
  // Look for an order from this merchant with matching total within 5 minutes of the timestamp
  // This is a simple heuristic for demo purposes - production would need more robust matching
  const timeWindow = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  for (const [, order] of posOrders) {
    if (
      order.merchantId === merchantId &&
      Math.abs(order.total - total) < 0.01 && // Allow small difference in total due to rounding
      Math.abs(order.timestamp - timestamp) < timeWindow
    ) {
      return order;
    }
  }
  
  return undefined;
}

/**
 * Get webhook setup URLs for POS integrations
 * GET /api/pos/webhook-urls
 */
router.get('/webhook-urls', (req, res) => {
  // Get the base URL from the request
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  res.json({
    toast: `${baseUrl}/api/pos/webhook/toast`,
    square: `${baseUrl}/api/pos/webhook/square`,
    clover: `${baseUrl}/api/pos/webhook/clover`
  });
});

/**
 * Get all stored POS orders (for debugging)
 * GET /api/pos/orders
 */
router.get('/orders', (req, res) => {
  const orders = Array.from(posOrders.entries()).map(([key, value]) => ({
    key,
    ...value
  }));
  
  res.json(orders);
});

export { posOrders };
export default router;
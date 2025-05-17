import fs from 'fs';
import path from 'path';
import { createLogger } from '../logger';

const logger = createLogger('merchant-matching');

export interface Merchant {
  merchantId: string;
  regex: string;
  cityCode: string;
  defaultPromoTemplate: string;
}

export interface PromoTemplate {
  merchantId: string;
  title: string;
  code: string;
  rules: {
    category: string;
    minSpend: number;
  };
  percentOff?: number;
  amountOff?: number;
  description?: string;
  expiresDays: number;
  isActive: boolean;
}

export interface ReceiptFingerprint {
  merchantName: string;
  storeNumber?: string;
  subtotal: number;
  timestamp: number;
  items?: Array<{
    name: string;
    price: number;
    quantity: number;
    category?: string;
  }>;
}

class MerchantMatchingService {
  private merchants: Merchant[] = [];
  private promoTemplates: PromoTemplate[] = [];
  private initialized = false;

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const merchantsPath = path.join(process.cwd(), 'data', 'merchantDirectory.json');
      const promoTemplatesPath = path.join(process.cwd(), 'data', 'promoTemplates.json');
      
      // Load merchant directory
      if (fs.existsSync(merchantsPath)) {
        const data = fs.readFileSync(merchantsPath, 'utf8');
        this.merchants = JSON.parse(data);
      } else {
        logger.warn('Merchant directory file not found');
        this.merchants = [];
      }
      
      // Load promo templates
      if (fs.existsSync(promoTemplatesPath)) {
        const data = fs.readFileSync(promoTemplatesPath, 'utf8');
        this.promoTemplates = JSON.parse(data);
      } else {
        logger.warn('Promo templates file not found');
        this.promoTemplates = [];
      }
      
      this.initialized = true;
      logger.info(`Initialized merchant matching service with ${this.merchants.length} merchants and ${this.promoTemplates.length} promo templates`);
    } catch (error) {
      logger.error('Error loading merchant data:', error);
      this.merchants = [];
      this.promoTemplates = [];
      this.initialized = false;
    }
  }

  /**
   * Match a merchant name from a receipt to a merchant in the directory
   * @param merchantName The merchant name from the receipt
   * @returns The matched merchant or null if no match found
   */
  public matchMerchant(merchantName: string): Merchant | null {
    if (!this.initialized) {
      this.loadData();
    }
    
    if (!merchantName) {
      return null;
    }
    
    // Normalize merchant name for matching
    const normalizedName = merchantName.trim().toUpperCase();
    
    // Try to find a match using the regex patterns
    for (const merchant of this.merchants) {
      const regex = new RegExp(merchant.regex, 'i'); // Case insensitive match
      
      if (regex.test(normalizedName)) {
        logger.info(`Matched merchant: ${merchant.merchantId} for receipt from "${merchantName}"`);
        return merchant;
      }
    }
    
    logger.info(`No merchant match found for receipt from "${merchantName}"`);
    return null;
  }

  /**
   * Find an applicable promo template for a given merchant and receipt data
   * @param merchantId The merchant ID
   * @param receiptData Optional receipt data for rule-based matching
   * @returns The matched promo template or null if no match found
   */
  public findApplicablePromo(merchantId: string, receiptData?: ReceiptFingerprint): PromoTemplate | null {
    if (!this.initialized) {
      this.loadData();
    }
    
    if (!merchantId) {
      return null;
    }
    
    // Find all active promo templates for this merchant
    const merchantPromos = this.promoTemplates.filter(
      promo => promo.merchantId === merchantId && promo.isActive
    );
    
    if (merchantPromos.length === 0) {
      logger.info(`No active promos found for merchant: ${merchantId}`);
      return null;
    }
    
    // If receipt data is available, try to match based on rules
    if (receiptData) {
      for (const promo of merchantPromos) {
        // Check minimum spend rule
        if (receiptData.subtotal >= promo.rules.minSpend) {
          // Check category rule if we have items with categories
          if (promo.rules.category !== 'Any' && receiptData.items) {
            // For simplicity, if any item matches the category, we'll match the promo
            const hasMatchingCategory = receiptData.items.some(
              item => item.category?.toLowerCase() === promo.rules.category.toLowerCase()
            );
            
            if (hasMatchingCategory) {
              logger.info(`Matched promo: ${promo.code} for merchant: ${merchantId} based on category and minimum spend`);
              return promo;
            }
          } else {
            // If category is "Any" or we don't have item categories, just match on minimum spend
            logger.info(`Matched promo: ${promo.code} for merchant: ${merchantId} based on minimum spend`);
            return promo;
          }
        }
      }
    }
    
    // If no rule-based match or no receipt data, return the default promo
    const merchant = this.merchants.find(m => m.merchantId === merchantId);
    if (merchant) {
      const defaultPromo = merchantPromos.find(p => p.code === merchant.defaultPromoTemplate);
      if (defaultPromo) {
        logger.info(`Using default promo: ${defaultPromo.code} for merchant: ${merchantId}`);
        return defaultPromo;
      }
    }
    
    // If we have any promos but none matched rules, return the first active one
    logger.info(`Using first available promo for merchant: ${merchantId}`);
    return merchantPromos[0];
  }

  /**
   * Create a coupon from a promo template with an expiration date
   * @param promoTemplate The promo template
   * @returns A coupon with expiration date
   */
  public createCouponFromTemplate(promoTemplate: PromoTemplate): any {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + (promoTemplate.expiresDays * 24 * 60 * 60 * 1000));
    
    return {
      id: `${promoTemplate.merchantId}_${promoTemplate.code}_${Date.now()}`,
      merchantId: promoTemplate.merchantId,
      title: promoTemplate.title,
      code: promoTemplate.code,
      description: promoTemplate.description || 
        (promoTemplate.percentOff ? `${promoTemplate.percentOff}% off your purchase` :
         promoTemplate.amountOff ? `$${promoTemplate.amountOff} off your purchase` : 
         'Special offer'),
      discount: promoTemplate.percentOff,
      amountOff: promoTemplate.amountOff,
      minimumPurchase: promoTemplate.rules.minSpend,
      validUntil: Math.floor(expirationDate.getTime() / 1000),
      terms: `Valid for purchases of $${promoTemplate.rules.minSpend} or more.${
        promoTemplate.rules.category !== 'Any' ? ` Only applicable to ${promoTemplate.rules.category} products.` : ''
      } Expires on ${expirationDate.toLocaleDateString()}.`,
      isActive: true,
      category: promoTemplate.rules.category
    };
  }

  /**
   * Generate a receipt fingerprint from OCR data
   * @param ocrData The OCR data from receipt recognition
   * @returns A receipt fingerprint for merchant matching
   */
  public createReceiptFingerprint(ocrData: any): ReceiptFingerprint {
    // Extract basic receipt data
    const merchantName = ocrData.merchantName || '';
    const storeNumber = ocrData.storeNumber || undefined;
    const subtotal = ocrData.subtotal || ocrData.total || 0;
    const timestamp = ocrData.timestamp || ocrData.date ? new Date(ocrData.date).getTime() : Date.now();
    
    // Extract item data if available
    const items = ocrData.items?.map((item: any) => ({
      name: item.name || '',
      price: item.price || 0,
      quantity: item.quantity || 1,
      category: item.category || undefined
    })) || [];
    
    return {
      merchantName,
      storeNumber,
      subtotal,
      timestamp,
      items: items.length > 0 ? items : undefined
    };
  }

  /**
   * Process a receipt and generate applicable coupons
   * @param receiptData Receipt data from OCR
   * @returns Applicable coupons for this receipt
   */
  public processReceiptForCoupons(receiptData: any): any[] {
    const fingerprint = this.createReceiptFingerprint(receiptData);
    const merchant = this.matchMerchant(fingerprint.merchantName);
    
    if (!merchant) {
      logger.info(`No merchant matched for receipt, cannot generate coupons`);
      return [];
    }
    
    const promoTemplate = this.findApplicablePromo(merchant.merchantId, fingerprint);
    
    if (!promoTemplate) {
      logger.info(`No applicable promo found for merchant ${merchant.merchantId}`);
      return [];
    }
    
    const coupon = this.createCouponFromTemplate(promoTemplate);
    return [coupon];
  }
}

export const merchantMatchingService = new MerchantMatchingService();
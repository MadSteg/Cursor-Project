/**
 * CouponService.ts
 * 
 * Service for managing time-limited promotional coupons
 * using Threshold PRE encryption for secure access control
 */

import { thresholdClient, EncryptedData } from './tacoService';
import { createLogger } from '../logger';

const logger = createLogger('coupon-service');

// Types for coupon data
export interface CouponData {
  code: string;         // The coupon discount code
  discount: number;     // The discount percentage or amount
  validUntil: number;   // Timestamp when the coupon expires
  merchantId?: string;  // Optional merchant ID the coupon is restricted to
  minPurchase?: number; // Optional minimum purchase amount
  maxDiscount?: number; // Optional cap on discount amount
}

export interface EncryptedCouponData {
  capsule: string;      // TACo encryption capsule 
  ciphertext: string;   // Encrypted coupon data
  policyId: string;     // Policy ID for access control
  validUntil: number;   // Plaintext expiration date (needed for filtering)
}

export interface CouponDecryptResult {
  success: boolean;
  couponCode?: string;
  message?: string;
}

class CouponService {
  /**
   * Generate and encrypt a new coupon
   * @param merchantName - The name of the merchant issuing the coupon
   * @param expirationDays - Number of days until coupon expires
   * @returns EncryptedCouponData with TACo-encrypted coupon
   */
  async generateCoupon(merchantName: string, expirationDays: number = 30): Promise<EncryptedCouponData> {
    try {
      // Calculate expiration date
      const now = Date.now();
      const validUntil = now + (expirationDays * 24 * 60 * 60 * 1000);
      
      // Generate a coupon code based on merchant name and random string
      const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
      const merchantPrefix = merchantName.substring(0, 3).toUpperCase();
      const couponCode = `${merchantPrefix}${randomString}`;
      
      // Create coupon data object
      const couponData: CouponData = {
        code: couponCode,
        discount: this.generateRandomDiscount(),
        validUntil,
        merchantId: merchantName.toLowerCase().replace(/[^a-z0-9]/g, ''),
      };
      
      // Add conditional extra properties
      if (couponData.discount > 15) {
        couponData.maxDiscount = 50; // Cap high percentage discounts
      }
      
      if (couponData.discount > 30) {
        couponData.minPurchase = 100; // Require minimum purchase for big discounts
      }
      
      logger.info(`Generating coupon for ${merchantName}, valid until ${new Date(validUntil).toISOString()}`);
      
      // Encrypt the coupon data using TACo
      const encryptedData = await this.encryptCouponData(couponData);
      
      return {
        ...encryptedData,
        validUntil // Keep the expiration date in plaintext for filtering
      };
      
    } catch (error) {
      logger.error(`Error generating coupon: ${error}`);
      throw new Error(`Failed to generate coupon: ${error}`);
    }
  }
  
  /**
   * Encrypt coupon data using TACo
   * @param couponData - The coupon data to encrypt
   * @returns EncryptedData with capsule, ciphertext and policyId
   */
  private async encryptCouponData(couponData: CouponData): Promise<EncryptedData> {
    // Serialize the coupon data to a string
    const serializedData = JSON.stringify(couponData);
    
    // Use TaCo client to encrypt the data
    // Mock policy will be created by the thresholdClient
    return await thresholdClient.encrypt({
      recipientPublicKey: `coupon-${couponData.merchantId}-${Date.now()}`,
      data: Buffer.from(serializedData)
    });
  }
  
  /**
   * Decrypt a coupon if it's still valid
   * @param encryptedData - The encrypted coupon data
   * @returns CouponDecryptResult with success status and decrypted coupon code
   */
  async decryptCoupon(encryptedData: {
    capsule: string;
    ciphertext: string;
    policyId: string;
  }): Promise<CouponDecryptResult> {
    try {
      const { capsule, ciphertext, policyId } = encryptedData;
      
      logger.info(`Attempting to decrypt coupon with policy ID: ${policyId}`);
      
      // Check validity using TACo service
      const currentTime = Date.now();
      
      // Attempt to decrypt using ThresholdClient
      const decryptedResult = await thresholdClient.decrypt({
        capsule,
        ciphertext,
        policyId
      });
      
      const decryptedData = decryptedResult.toString();
      
      if (!decryptedData) {
        return {
          success: false,
          message: 'Failed to decrypt coupon data'
        };
      }
      
      // Parse the decrypted data
      const couponData: CouponData = JSON.parse(decryptedData);
      
      // Check if coupon is expired (additional validation)
      if (currentTime > couponData.validUntil) {
        return {
          success: false,
          message: 'This coupon has expired'
        };
      }
      
      return {
        success: true,
        couponCode: couponData.code
      };
      
    } catch (error) {
      logger.error(`Error decrypting coupon: ${error}`);
      return {
        success: false,
        message: 'Error processing coupon'
      };
    }
  }
  
  /**
   * Generate a random discount value between 5% and 40%
   * With weighted distribution favoring smaller discounts
   */
  private generateRandomDiscount(): number {
    // Generate random number 0-100
    const rand = Math.random() * 100;
    
    // Weight distribution to favor smaller discounts
    if (rand < 50) {
      // 50% chance of 5-10% discount
      return Math.floor(Math.random() * 6) + 5;
    } else if (rand < 80) {
      // 30% chance of 10-20% discount
      return Math.floor(Math.random() * 11) + 10;
    } else if (rand < 95) {
      // 15% chance of 20-30% discount
      return Math.floor(Math.random() * 11) + 20;
    } else {
      // 5% chance of 30-40% discount
      return Math.floor(Math.random() * 11) + 30;
    }
  }
}

export const couponService = new CouponService();
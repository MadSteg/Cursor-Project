/**
 * Coupon Service
 * 
 * Manages the creation and verification of time-limited coupons 
 * encrypted using Threshold Network's Proxy Re-Encryption (TACo PRE)
 */

import { tacoService } from './tacoService';
import { ipfsService } from './ipfsService';
import { v4 as uuidv4 } from 'uuid';
import { createLogger } from '../logger';

const logger = createLogger('coupon-service');

/**
 * Creates a time-limited coupon that can only be decrypted within the validity period
 */
export async function createTimedCoupon(
  userPubKey: string,
  couponCode: string,
  validUntil: number
) {
  try {
    logger.info(`Creating timed coupon valid until ${new Date(validUntil).toISOString()}`);
    
    // Encrypt the coupon code using TaCo PRE
    const encryptionResult = await tacoService.encrypt({
      recipientPublicKey: userPubKey,
      data: Buffer.from(couponCode),
      expiresAt: validUntil
    });
    
    // Prepare metadata for IPFS
    const metadata = {
      name: 'Time-Limited Coupon',
      description: `Valid until ${new Date(validUntil).toISOString()}`,
      type: 'coupon',
      couponId: uuidv4(),
      validUntil,
      encryptedData: {
        capsule: encryptionResult.capsule,
        ciphertext: encryptionResult.ciphertext,
        policyId: encryptionResult.policyId
      }
    };
    
    // Pin metadata to IPFS
    const metadataUri = await ipfsService.uploadJSON(metadata);
    logger.info(`Coupon metadata pinned to IPFS: ${metadataUri}`);
    
    return {
      metadataUri,
      validUntil,
      policyId: encryptionResult.policyId
    };
  } catch (error) {
    logger.error(`Failed to create timed coupon: ${error}`);
    throw new Error(`Coupon creation failed: ${error}`);
  }
}

/**
 * Verifies and decrypts a time-limited coupon
 */
export async function decryptCoupon(encryptedData: any) {
  try {
    const { capsule, ciphertext, policyId } = encryptedData;
    
    // Attempt to decrypt using TaCo PRE
    const decrypted = await tacoService.decrypt({
      capsule,
      ciphertext,
      policyId
    });
    
    // Convert the decrypted buffer to a string
    return {
      success: true,
      couponCode: new TextDecoder().decode(decrypted)
    };
  } catch (error) {
    logger.error(`Failed to decrypt coupon: ${error}`);
    
    // Check if this is an expiration error
    if (error.message?.includes('expired') || error.message?.includes('policy not valid')) {
      return {
        success: false,
        message: 'This coupon has expired and can no longer be redeemed.'
      };
    }
    
    return {
      success: false,
      message: 'Failed to decrypt coupon.'
    };
  }
}

// Export functions
export const couponService = {
  createTimedCoupon,
  decryptCoupon
};

export default couponService;
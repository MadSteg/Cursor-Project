import { createLogger } from '../logger';
import { ethers } from 'ethers';

const logger = createLogger('pos-integration');

export interface CustomerAccount {
  address: string;
  privateKey: string;
  customerId: string;
  createdAt: string;
}

export interface ReceiptResult {
  success: boolean;
  walletAddress: string;
  receiptId?: string;
  receiptImageUrl: string;
  transactionHash?: string;
  rewardPoints: number;
  basePoints: number;
  bonusPoints: number;
  qualifyingOffers: Array<{
    itemName: string;
    pointsEarned: number;
    offerDescription: string;
    category: string;
  }>;
}

export interface ReceiptItem {
  name: string;
  price: number;
  special?: boolean;
}

class POSIntegrationService {
  private customerAccounts = new Map<string, CustomerAccount>();
  private receiptImages = [
    'Hot Coffee.png',
    'Chocolate Donut.png',
    'Frapaccino.png',
    'Breakfast Sandwich.png',
    'Plain Donut.png',
    'Strawberry Sprinkle Donut.png'
  ];

  constructor() {
    // Initialize with some sample customer accounts
    this.initializeSampleAccounts();
  }

  private initializeSampleAccounts() {
    const sampleCustomers = [
      { phone: '+1234567890', points: 2500 },
      { phone: '+1555123456', points: 1800 },
      { phone: '+1777999888', points: 3200 }
    ];

    sampleCustomers.forEach(customer => {
      const customerId = this.generateCustomerId(customer.phone);
      const wallet = ethers.Wallet.createRandom();
      
      this.customerAccounts.set(customerId, {
        address: wallet.address,
        privateKey: wallet.privateKey,
        customerId,
        createdAt: new Date().toISOString()
      });
    });
  }

  /**
   * Generate customer ID from phone/email
   */
  generateCustomerId(phoneOrEmail: string): string {
    return `customer_${Buffer.from(phoneOrEmail).toString('base64').substr(0, 12)}`;
  }

  /**
   * Create or retrieve wallet for customer
   */
  createOrGetCustomerAccount(customerId: string): CustomerAccount {
    const existingAccount = this.customerAccounts.get(customerId);
    if (existingAccount) {
      logger.info(`[pos] Retrieved existing account for customer ${customerId}: ${existingAccount.address}`);
      return existingAccount;
    }

    // Create new account
    const wallet = ethers.Wallet.createRandom();
    const customerAccount: CustomerAccount = {
      address: wallet.address,
      privateKey: wallet.privateKey,
      customerId,
      createdAt: new Date().toISOString()
    };

    this.customerAccounts.set(customerId, customerAccount);
    logger.info(`[pos] Created new account for customer ${customerId}: ${wallet.address}`);
    
    return customerAccount;
  }

  /**
   * Calculate reward points for receipt items
   */
  calculateRewards(merchantId: string, totalAmount: number, items: ReceiptItem[]): {
    basePoints: number;
    bonusPoints: number;
    totalPoints: number;
    qualifyingOffers: Array<{
      itemName: string;
      pointsEarned: number;
      offerDescription: string;
      category: string;
    }>;
  } {
    const basePointsPerDollar = 10; // 10 points per dollar spent
    const basePoints = Math.floor(totalAmount * basePointsPerDollar);

    let bonusPoints = 0;
    const qualifyingOffers: Array<{
      itemName: string;
      pointsEarned: number;
      offerDescription: string;
      category: string;
    }> = [];

    // Define special item categories and their bonus points
    const specialOffers = [
      { keywords: ['latte', 'specialty', 'premium'], points: 50, description: 'Specialty Beverage Bonus', category: 'beverages' },
      { keywords: ['sandwich', 'breakfast'], points: 30, description: 'Breakfast Item Bonus', category: 'food' },
      { keywords: ['organic', 'fresh'], points: 40, description: 'Organic Product Bonus', category: 'health' },
      { keywords: ['pasta', 'wine'], points: 25, description: 'Italian Cuisine Bonus', category: 'dining' },
      { keywords: ['cheese', 'special'], points: 35, description: 'Weekly Special Bonus', category: 'featured' }
    ];

    // Check each item for special offers
    items.forEach(item => {
      if (item.special) {
        specialOffers.forEach(offer => {
          if (offer.keywords.some(keyword => 
            item.name.toLowerCase().includes(keyword.toLowerCase())
          )) {
            bonusPoints += offer.points;
            qualifyingOffers.push({
              itemName: item.name,
              pointsEarned: offer.points,
              offerDescription: offer.description,
              category: offer.category
            });
          }
        });
      }
    });

    const totalPoints = basePoints + bonusPoints;

    logger.info(`[pos] Calculated rewards: ${basePoints} base + ${bonusPoints} bonus = ${totalPoints} total points`);

    return {
      basePoints,
      bonusPoints,
      totalPoints,
      qualifyingOffers
    };
  }

  /**
   * Process receipt minting at POS
   */
  async createDigitalReceipt(
    merchantId: string,
    merchantName: string,
    customerPhone: string,
    totalAmount: number,
    items: ReceiptItem[],
    transactionId: string
  ): Promise<ReceiptResult> {
    try {
      const customerId = this.generateCustomerId(customerPhone);
      
      // Create or get customer wallet
      const wallet = this.createOrGetCustomerWallet(customerId);

      // Calculate rewards
      const rewards = this.calculateRewards(merchantId, totalAmount, items);

      // Select random receipt image
      const randomImage = this.receiptImages[Math.floor(Math.random() * this.receiptImages.length)];
      const receiptImageUrl = `/api/image-proxy/${encodeURIComponent(randomImage)}`;

      // Generate mock receipt ID and transaction hash
      const receiptId = `receipt_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Create encrypted receipt metadata (simulated)
      const receiptMetadata = {
        transactionId,
        merchantId,
        merchantName,
        totalAmount,
        items,
        timestamp: new Date().toISOString(),
        customerPhone,
        encrypted: true // Indicates this would be encrypted with Threshold
      };

      logger.info(`[pos] Created digital receipt ${receiptId} for ${customerPhone} at ${merchantName}`);
      logger.info(`[pos] Customer earned ${rewards.totalPoints} points`);

      return {
        success: true,
        walletAddress: account.address,
        receiptId,
        receiptImageUrl,
        transactionHash,
        rewardPoints: rewards.totalPoints,
        basePoints: rewards.basePoints,
        bonusPoints: rewards.bonusPoints,
        qualifyingOffers: rewards.qualifyingOffers
      };

    } catch (error) {
      logger.error(`[pos] Failed to create digital receipt:`, error);
      
      // Return basic account info even if creation fails
      const customerId = this.generateCustomerId(customerPhone);
      const account = this.createOrGetCustomerAccount(customerId);
      
      return {
        success: false,
        walletAddress: account.address,
        receiptImageUrl: '/api/image-proxy/Hot%20Coffee.png',
        rewardPoints: 0,
        basePoints: 0,
        bonusPoints: 0,
        qualifyingOffers: []
      };
    }
  }

  /**
   * Get customer account info
   */
  getCustomerAccount(customerId: string): CustomerAccount | undefined {
    return this.customerAccounts.get(customerId);
  }

  /**
   * Get all customer accounts (for admin purposes)
   */
  getAllCustomerAccounts(): CustomerAccount[] {
    return Array.from(this.customerAccounts.values());
  }
}

export const posIntegrationService = new POSIntegrationService();
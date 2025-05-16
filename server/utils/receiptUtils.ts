/**
 * Receipt tier utilities
 * 
 * These functions help determine the NFT receipt tier based on purchase amount
 * and provide other receipt-related utility functions.
 */

export interface ReceiptTier {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number | null;
  description: string;
  nftReward: string;
  benefits: string[];
}

// Define receipt tiers based on purchase amount
const RECEIPT_TIERS: ReceiptTier[] = [
  {
    id: 'basic',
    name: 'Basic Receipt',
    minAmount: 0,
    maxAmount: 50,
    description: 'Standard digital receipt with basic features',
    nftReward: 'Basic Receipt Verification NFT',
    benefits: ['Digital verification', 'Basic warranty tracking']
  },
  {
    id: 'silver',
    name: 'Silver Receipt',
    minAmount: 50,
    maxAmount: 200,
    description: 'Enhanced receipt with additional features',
    nftReward: 'Silver Receipt Collector NFT',
    benefits: ['Digital verification', 'Extended warranty tracking', 'Return policy protection']
  },
  {
    id: 'gold',
    name: 'Gold Receipt',
    minAmount: 200,
    maxAmount: 1000,
    description: 'Premium receipt with exclusive benefits',
    nftReward: 'Gold Receipt Collector NFT',
    benefits: ['Digital verification', 'Premium warranty tracking', 'Return policy protection', 'Exclusive merchant offers']
  },
  {
    id: 'platinum',
    name: 'Platinum Receipt',
    minAmount: 1000,
    maxAmount: null, // No upper limit
    description: 'Exclusive receipt with maximum benefits',
    nftReward: 'Platinum Receipt Collector NFT',
    benefits: ['Digital verification', 'Lifetime warranty tracking', 'Priority return processing', 'Exclusive merchant offers', 'Concierge service']
  }
];

/**
 * Determine receipt tier based on the total purchase amount
 * @param amount Total purchase amount
 * @returns The appropriate receipt tier
 */
export function determineReceiptTier(amount: number): ReceiptTier {
  // Find the first tier where the amount falls within its range
  const tier = RECEIPT_TIERS.find(tier => 
    amount >= tier.minAmount && 
    (tier.maxAmount === null || amount < tier.maxAmount)
  );
  
  // Default to basic tier if no matching tier is found (should never happen with our tier definitions)
  return tier || RECEIPT_TIERS[0];
}

/**
 * Get a list of all available receipt tiers
 * @returns Array of receipt tiers
 */
export function getAllReceiptTiers(): ReceiptTier[] {
  return [...RECEIPT_TIERS];
}

/**
 * Get receipt tier by ID
 * @param tierId The tier ID to find
 * @returns The requested tier or undefined if not found
 */
export function getReceiptTierById(tierId: string): ReceiptTier | undefined {
  return RECEIPT_TIERS.find(tier => tier.id === tierId);
}

/**
 * Format currency amount with proper currency symbol
 * @param amount The amount to format
 * @param currency The currency code (defaults to USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency 
  }).format(amount);
}
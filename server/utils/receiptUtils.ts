/**
 * Receipt utility functions
 */

// Receipt tier definitions based on purchase amount
export interface ReceiptTier {
  name: string;
  min: number;
  max: number;
  color: string;
  nftEligible: boolean;
  description: string;
}

// Define receipt tiers
const RECEIPT_TIERS: ReceiptTier[] = [
  {
    name: 'STANDARD',
    min: 0,
    max: 49.99,
    color: '#6b7280', // Gray
    nftEligible: true,
    description: 'Standard receipt for purchases under $50'
  },
  {
    name: 'PREMIUM',
    min: 50,
    max: 149.99,
    color: '#3b82f6', // Blue
    nftEligible: true,
    description: 'Premium receipt for purchases from $50 to $150'
  },
  {
    name: 'LUXURY',
    min: 150,
    max: 499.99,
    color: '#8b5cf6', // Purple
    nftEligible: true,
    description: 'Luxury receipt for purchases from $150 to $500'
  },
  {
    name: 'ULTRA',
    min: 500,
    max: Number.MAX_SAFE_INTEGER,
    color: '#f59e0b', // Amber/Gold
    nftEligible: true,
    description: 'Ultra receipt for purchases over $500'
  }
];

/**
 * Determines the receipt tier based on the total amount
 * 
 * @param total The total amount of the receipt
 * @returns The appropriate receipt tier
 */
export function determineReceiptTier(total: number): ReceiptTier {
  // Find the matching tier based on the total amount
  const tier = RECEIPT_TIERS.find(tier => 
    total >= tier.min && total <= tier.max
  );
  
  // Default to STANDARD if no tier is found (should never happen unless total is negative)
  return tier || RECEIPT_TIERS[0];
}

/**
 * Checks if a receipt is eligible for NFT minting based on its tier
 * 
 * @param total The total amount of the receipt
 * @returns Boolean indicating NFT eligibility
 */
export function isEligibleForNFT(total: number): boolean {
  const tier = determineReceiptTier(total);
  return tier.nftEligible;
}

/**
 * Formats a receipt total with appropriate currency symbol
 * 
 * @param total The total amount to format
 * @param currency The currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(total: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(total);
}
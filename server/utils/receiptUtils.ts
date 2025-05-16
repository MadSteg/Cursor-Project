/**
 * Receipt Utilities for BlockReceipt.ai
 * 
 * This module provides utility functions for processing and formatting receipt data.
 */

/**
 * Determine receipt tier based on total amount spent
 * @param total Total receipt amount
 * @returns Tier object with ID, name, and benefits
 */
export function determineReceiptTier(total: number): {
  id: string;
  name: string;
  benefits: string[];
} {
  // Default to bronze tier
  let tier = {
    id: 'bronze',
    name: 'Bronze',
    benefits: ['Basic receipt storage', 'PDF exports']
  };
  
  // Determine tier based on total amount
  if (total >= 100) {
    tier = {
      id: 'platinum',
      name: 'Platinum',
      benefits: ['Premium receipt storage', 'Priority support', 'Analytics dashboard', 'API access', 'Warranty tracking']
    };
  } else if (total >= 50) {
    tier = {
      id: 'gold',
      name: 'Gold',
      benefits: ['Enhanced receipt storage', 'Priority support', 'Analytics dashboard', 'API access']
    };
  } else if (total >= 20) {
    tier = {
      id: 'silver',
      name: 'Silver',
      benefits: ['Enhanced receipt storage', 'Priority support', 'Analytics dashboard']
    };
  }
  
  return tier;
}

/**
 * Format currency amount
 * @param amount Amount to format
 * @param currency Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
}

/**
 * Format date
 * @param date Date to format
 * @param format Format type (default: 'short')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, format: 'short' | 'long' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'long') {
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Clean and normalize merchant name
 * @param name Raw merchant name
 * @returns Cleaned and normalized merchant name
 */
export function cleanMerchantName(name: string): string {
  // Convert to uppercase
  let cleanName = name.toUpperCase();
  
  // Remove common suffixes
  const suffixes = [
    'INC', 'LLC', 'LTD', 'CORP', 'CORPORATION', 'CO', 'COMPANY',
    'INCORPORATED', 'LIMITED', 'INTERNATIONAL', 'INTL', 'ENTERPRISES',
    'HOLDINGS', 'GROUP', 'WORLDWIDE'
  ];
  
  suffixes.forEach(suffix => {
    const regex = new RegExp(`\\s+${suffix}(\\.)?\\s*$`, 'i');
    cleanName = cleanName.replace(regex, '');
  });
  
  // Replace multiple spaces with a single space
  cleanName = cleanName.replace(/\s+/g, ' ').trim();
  
  // Convert back to title case
  cleanName = cleanName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return cleanName;
}

/**
 * Calculate tax amount from subtotal and tax rate
 * @param subtotal Subtotal amount
 * @param taxRate Tax rate as decimal (e.g., 0.0825 for 8.25%)
 * @returns Calculated tax amount
 */
export function calculateTax(subtotal: number, taxRate: number): number {
  return subtotal * taxRate;
}

/**
 * Validate receipt data
 * @param receipt Receipt data to validate
 * @returns Validation result
 */
export function validateReceipt(receipt: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for required fields
  if (!receipt.merchantName) {
    errors.push('Merchant name is required');
  }
  
  if (!receipt.date) {
    errors.push('Date is required');
  } else {
    // Validate date format
    const dateObj = new Date(receipt.date);
    if (isNaN(dateObj.getTime())) {
      errors.push('Invalid date format');
    }
  }
  
  if (typeof receipt.total !== 'number' || isNaN(receipt.total)) {
    errors.push('Total amount is required and must be a number');
  }
  
  // Validate items array if present
  if (receipt.items && Array.isArray(receipt.items)) {
    receipt.items.forEach((item, index) => {
      if (!item.name) {
        errors.push(`Item #${index + 1}: Name is required`);
      }
      
      if (typeof item.price !== 'number' || isNaN(item.price)) {
        errors.push(`Item #${index + 1}: Price must be a number`);
      }
      
      if (typeof item.quantity !== 'number' || isNaN(item.quantity)) {
        errors.push(`Item #${index + 1}: Quantity must be a number`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
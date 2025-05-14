/**
 * Mock receipt data for development purposes
 */

import { NFTReceiptProps } from '@/pages/UserNFTWallet';

export const mockReceipts: NFTReceiptProps[] = [
  {
    id: "1",
    merchantName: "Apple Store",
    date: "2025-05-10T14:30:00Z",
    total: 1299.99,
    items: 2,
    txHash: "0x3a8e892d77a55dddddddddddddddddddddddddddddddddddddddddddddada1",
    isEncrypted: true,
    hasGrantedAccess: true,
    grantedTo: ["0x742d35Cc6634C0532925a3b844Bc454e4438f44e"],
    tokenId: "42",
    receiptType: "LUXURY",
    status: "verified",
    warranty: {
      expiryDate: "2026-05-10",
      duration: "1 year",
      isActive: true
    }
  },
  {
    id: "2",
    merchantName: "Best Buy",
    date: "2025-05-05T10:15:00Z",
    total: 499.95,
    items: 3,
    txHash: "0x4b9f793d88a58dddddddddddddddddddddddddddddddddddddddddddddada2",
    isEncrypted: true,
    hasGrantedAccess: false,
    grantedTo: [],
    tokenId: "43",
    receiptType: "PREMIUM",
    status: "verified",
    warranty: {
      expiryDate: "2027-05-05",
      duration: "2 years",
      isActive: true
    }
  },
  {
    id: "3",
    merchantName: "Amazon",
    date: "2025-04-28T09:45:00Z",
    total: 89.99,
    items: 5,
    txHash: "0x5c0fa04e99b69dddddddddddddddddddddddddddddddddddddddddddddada3",
    isEncrypted: false,
    hasGrantedAccess: true,
    grantedTo: [],
    tokenId: "44",
    receiptType: "STANDARD",
    status: "verified",
    warranty: {
      expiryDate: "2025-07-28",
      duration: "3 months",
      isActive: true
    }
  },
  {
    id: "4",
    merchantName: "Tiffany & Co.",
    date: "2025-04-15T16:20:00Z",
    total: 2499.99,
    items: 1,
    txHash: "0x6d1fb15faaaa0dddddddddddddddddddddddddddddddddddddddddddddada4",
    isEncrypted: true,
    hasGrantedAccess: true,
    grantedTo: ["0x742d35Cc6634C0532925a3b844Bc454e4438f44e"],
    tokenId: "45",
    receiptType: "LUXURY",
    status: "verified",
    warranty: {
      expiryDate: "2027-04-15",
      duration: "2 years",
      isActive: true
    }
  },
  {
    id: "5",
    merchantName: "Whole Foods",
    date: "2025-05-12T18:45:00Z",
    total: 112.34,
    items: 15,
    txHash: "0x7e2fc26fbbbdddddddddddddddddddddddddddddddddddddddddddddddada5",
    isEncrypted: false,
    hasGrantedAccess: false,
    grantedTo: [],
    tokenId: "46",
    receiptType: "STANDARD",
    status: "verified",
    warranty: {
      expiryDate: "2025-06-12",
      duration: "1 month",
      isActive: false
    }
  },
  {
    id: "6",
    merchantName: "Tesla",
    date: "2025-03-10T10:00:00Z",
    total: 54999.99,
    items: 1,
    txHash: "0x8f3fd37fcccdddddddddddddddddddddddddddddddddddddddddddddddada6",
    isEncrypted: true,
    hasGrantedAccess: true,
    grantedTo: ["0x742d35Cc6634C0532925a3b844Bc454e4438f44e", "0x842d35Cc6634C0532925a3b844Bc454e4438f55f"],
    tokenId: "47",
    receiptType: "LUXURY",
    status: "verified",
    warranty: {
      expiryDate: "2029-03-10",
      duration: "4 years",
      isActive: true
    }
  },
  {
    id: "7",
    merchantName: "Target",
    date: "2025-05-07T14:20:00Z",
    total: 87.65,
    items: 8,
    txHash: "0x9g4fe48fdddddddddddddddddddddddddddddddddddddddddddddddddddada7",
    isEncrypted: false,
    hasGrantedAccess: false,
    grantedTo: [],
    tokenId: "48",
    receiptType: "STANDARD",
    status: "verified"
  },
  {
    id: "8",
    merchantName: "Samsung",
    date: "2025-04-22T11:30:00Z",
    total: 899.99,
    items: 2,
    txHash: "0xah5gf59feeeeddddddddddddddddddddddddddddddddddddddddddddddada8",
    isEncrypted: true,
    hasGrantedAccess: false,
    grantedTo: [],
    tokenId: "49",
    receiptType: "PREMIUM",
    status: "verified",
    warranty: {
      expiryDate: "2026-04-22",
      duration: "1 year",
      isActive: true
    }
  }
];
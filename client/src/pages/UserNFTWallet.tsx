import React, { useState } from 'react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import {
  Wallet,
  Filter,
  Search,
  ChevronDown,
  RefreshCw,
  Plus,
  Lock,
  Unlock,
  Clock,
  CalendarDays,
  SortAsc,
  SortDesc,
  Upload,
  Scan
} from 'lucide-react';
import EnhancedNFTReceiptCard from '@/components/receipts/EnhancedNFTReceiptCard';
import { NFTArtItem } from '@/data/nftArtManifest';

// Define the mock receipt type
interface NFTReceiptProps {
  id: string;
  merchantName: string;
  date: string;
  total: number;
  items: number;
  txHash?: string;
  isEncrypted?: boolean;
  hasGrantedAccess?: boolean;
  grantedTo?: string[];
  tokenId?: string;
  receiptType: string;
  status: string;
  warranty?: {
    expiryDate: string;
    duration: string;
    isActive: boolean;
  };
}

// Mock data for demonstration
const mockReceipts: NFTReceiptProps[] = [
  {
    id: '1',
    merchantName: 'Whole Foods Market',
    date: '2025-05-14',
    total: 84.32,
    items: 9,
    txHash: '0x7d3e9e6bd34cf3c22376138b586d9a551349e0a34c3967d3cbc5c2d3f1bb8d32',
    isEncrypted: true,
    hasGrantedAccess: true,
    grantedTo: ['0x1234...5678'],
    tokenId: '123456',
    receiptType: 'luxury',
    status: 'confirmed',
    warranty: {
      expiryDate: '2026-05-14',
      duration: '1 year',
      isActive: true
    }
  },
  {
    id: '2',
    merchantName: 'Best Buy',
    date: '2025-05-12',
    total: 1299.99,
    items: 1,
    txHash: '0x2a1b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    isEncrypted: true,
    hasGrantedAccess: true,
    tokenId: '123457',
    receiptType: 'premium',
    status: 'confirmed',
    warranty: {
      expiryDate: '2027-05-12',
      duration: '2 years',
      isActive: true
    }
  },
  {
    id: '3',
    merchantName: 'Amazon',
    date: '2025-05-10',
    total: 67.45,
    items: 3,
    txHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    isEncrypted: true,
    hasGrantedAccess: false,
    tokenId: '123458',
    receiptType: 'standard',
    status: 'confirmed'
  },
  {
    id: '4',
    merchantName: 'Apple Store',
    date: '2025-05-08',
    total: 899.00,
    items: 2,
    txHash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
    isEncrypted: false,
    tokenId: '123459',
    receiptType: 'premium',
    status: 'confirmed',
    warranty: {
      expiryDate: '2027-05-08',
      duration: '2 years',
      isActive: true
    }
  },
  {
    id: '5',
    merchantName: 'Target',
    date: '2025-05-05',
    total: 142.76,
    items: 12,
    txHash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
    isEncrypted: true,
    hasGrantedAccess: true,
    tokenId: '123460',
    receiptType: 'standard',
    status: 'confirmed'
  },
  {
    id: '6',
    merchantName: 'REI',
    date: '2025-05-01',
    total: 321.88,
    items: 4,
    txHash: '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
    isEncrypted: false,
    tokenId: '123461',
    receiptType: 'standard',
    status: 'confirmed'
  }
];

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
type ReceiptFilter = 'all' | 'encrypted' | 'unencrypted' | 'accessible' | 'premium' | 'luxury';

const UserNFTWallet: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filter, setFilter] = useState<ReceiptFilter>('all');
  
  // Filter and sort receipts
  const getFilteredReceipts = () => {
    let filtered = [...mockReceipts];
    
    // Apply date filter
    if (activeTab === 'recent') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      filtered = filtered.filter(receipt => new Date(receipt.date) >= oneMonthAgo);
    } else if (activeTab === 'premium') {
      filtered = filtered.filter(receipt => receipt.receiptType === 'premium' || receipt.receiptType === 'luxury');
    } else if (activeTab === 'warranty') {
      filtered = filtered.filter(receipt => receipt.warranty && receipt.warranty.isActive);
    }
    
    // Apply text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(receipt => 
        receipt.merchantName.toLowerCase().includes(term) ||
        receipt.tokenId?.toLowerCase().includes(term) ||
        receipt.total.toString().includes(term)
      );
    }
    
    // Apply additional filter
    if (filter === 'encrypted') {
      filtered = filtered.filter(receipt => receipt.isEncrypted);
    } else if (filter === 'unencrypted') {
      filtered = filtered.filter(receipt => !receipt.isEncrypted);
    } else if (filter === 'accessible') {
      filtered = filtered.filter(receipt => !receipt.isEncrypted || receipt.hasGrantedAccess);
    } else if (filter === 'premium') {
      filtered = filtered.filter(receipt => receipt.receiptType === 'premium');
    } else if (filter === 'luxury') {
      filtered = filtered.filter(receipt => receipt.receiptType === 'luxury');
    }
    
    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'amount-desc':
          return b.total - a.total;
        case 'amount-asc':
          return a.total - b.total;
        default:
          return 0;
      }
    });
    
    return filtered;
  };
  
  const filteredReceipts = getFilteredReceipts();
  
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold flex items-center">
              <Wallet className="mr-3 h-8 w-8 text-primary" />
              NFT Receipt Wallet
            </h1>
            <p className="text-xl text-muted-foreground mt-1">
              Your blockchain-verified purchase history
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/scan-receipt">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Scan className="mr-2 h-4 w-4" />
                Scan Receipt
              </Button>
            </Link>
            <Link href="/verify-receipt">
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Receipt
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full md:w-64 lg:w-72 space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search receipts..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="bg-white rounded-lg border shadow-sm divide-y">
              <div className="p-3">
                <h3 className="font-medium mb-2">Receipt Categories</h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`w-full text-left px-2 py-1 rounded text-sm flex items-center ${activeTab === 'all' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    All Receipts
                  </button>
                  <button
                    onClick={() => setActiveTab('recent')}
                    className={`w-full text-left px-2 py-1 rounded text-sm flex items-center ${activeTab === 'recent' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Recent (30 days)
                  </button>
                  <button
                    onClick={() => setActiveTab('premium')}
                    className={`w-full text-left px-2 py-1 rounded text-sm flex items-center ${activeTab === 'premium' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Premium & Luxury
                  </button>
                  <button
                    onClick={() => setActiveTab('warranty')}
                    className={`w-full text-left px-2 py-1 rounded text-sm flex items-center ${activeTab === 'warranty' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Active Warranty
                  </button>
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="font-medium mb-2">Privacy Filters</h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setFilter('all')}
                    className={`w-full text-left px-2 py-1 rounded text-sm flex items-center ${filter === 'all' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    All Encryption Types
                  </button>
                  <button
                    onClick={() => setFilter('encrypted')}
                    className={`w-full text-left px-2 py-1 rounded text-sm flex items-center ${filter === 'encrypted' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Encrypted Only
                  </button>
                  <button
                    onClick={() => setFilter('unencrypted')}
                    className={`w-full text-left px-2 py-1 rounded text-sm flex items-center ${filter === 'unencrypted' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                  >
                    <Unlock className="mr-2 h-4 w-4" />
                    Unencrypted Only
                  </button>
                  <button
                    onClick={() => setFilter('accessible')}
                    className={`w-full text-left px-2 py-1 rounded text-sm flex items-center ${filter === 'accessible' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                  >
                    <Unlock className="mr-2 h-4 w-4" />
                    Currently Accessible
                  </button>
                </div>
              </div>
              
              <div className="p-3">
                <h3 className="font-medium mb-2">Receipt Tiers</h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setFilter('all')}
                    className={`w-full text-left px-2 py-1 rounded text-sm flex items-center ${filter === 'all' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    All Tiers
                  </button>
                  <button
                    onClick={() => setFilter('premium')}
                    className={`w-full text-left px-2 py-1 rounded text-sm flex items-center ${filter === 'premium' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Premium
                  </button>
                  <button
                    onClick={() => setFilter('luxury')}
                    className={`w-full text-left px-2 py-1 rounded text-sm flex items-center ${filter === 'luxury' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Luxury
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {filteredReceipts.length} {filteredReceipts.length === 1 ? 'Receipt' : 'Receipts'} Found
              </h2>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setActiveTab('all');
                    setFilter('all');
                    setSortBy('date-desc');
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Sort
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy('date-desc')}>
                      <SortDesc className="h-4 w-4 mr-2" />
                      Newest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('date-asc')}>
                      <SortAsc className="h-4 w-4 mr-2" />
                      Oldest First
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('amount-desc')}>
                      <SortDesc className="h-4 w-4 mr-2" />
                      Highest Amount
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('amount-asc')}>
                      <SortAsc className="h-4 w-4 mr-2" />
                      Lowest Amount
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {filteredReceipts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredReceipts.map((receipt) => (
                  <EnhancedNFTReceiptCard 
                    key={receipt.id} 
                    receipt={{
                      id: parseInt(receipt.id),
                      tokenId: receipt.tokenId || '',
                      merchantId: 1,
                      merchant: {
                        id: 1,
                        name: receipt.merchantName,
                        category: receipt.receiptType
                      },
                      date: receipt.date,
                      subtotal: Math.round((receipt.total || 0) * 0.9 * 100), // Estimate subtotal as 90% of total
                      tax: Math.round((receipt.total || 0) * 0.1 * 100), // Estimate tax as 10% of total
                      total: Math.round((receipt.total || 0) * 100), // Convert to cents
                      items: [],
                      blockchainTxHash: receipt.txHash,
                      blockchainVerified: receipt.status === 'confirmed',
                      blockNumber: 12345678,
                      nftArt: {
                        id: receipt.id,
                        name: `${receipt.receiptType} NFT`,
                        description: `A ${receipt.receiptType} tier NFT receipt from ${receipt.merchantName}`,
                        imageUrl: `/assets/nft-${receipt.receiptType.toLowerCase()}.png`,
                        tier: receipt.receiptType.toUpperCase() as any,
                        collection: 'BlockReceipt Collection',
                        rarity: receipt.receiptType === 'luxury' ? 'epic' : 
                               receipt.receiptType === 'premium' ? 'rare' : 'common',
                        type: 'collectible',
                        price: receipt.total * 100
                      }
                    }}
                    accessControl={{
                      granted: receipt.hasGrantedAccess || !receipt.isEncrypted || false,
                      isOwner: true,
                      accessGrantedTo: receipt.grantedTo ? receipt.grantedTo.map((address: string) => ({
                        address,
                        date: new Date().toISOString()
                      })) : []
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border rounded-lg p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <Wallet className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No receipts found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  No receipts match your current filters. Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setActiveTab('all');
                    setFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNFTWallet;
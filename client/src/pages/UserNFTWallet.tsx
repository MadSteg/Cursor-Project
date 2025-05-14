import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
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
  Scan,
  Package,
  BarChart3,
  Receipt,
  LayoutDashboard,
  Crown,
  Shield
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

// Mock data
const mockReceipts: NFTReceiptProps[] = [
  {
    id: '1',
    merchantName: 'Apple Store',
    date: '2025-05-10',
    total: 1299.99,
    items: 1,
    txHash: '0x1234567890abcdef',
    isEncrypted: true,
    hasGrantedAccess: false,
    tokenId: '1001',
    receiptType: 'luxury',
    status: 'completed',
    warranty: {
      expiryDate: '2027-05-10',
      duration: '2 years',
      isActive: true,
    }
  },
  {
    id: '2',
    merchantName: 'Whole Foods',
    date: '2025-05-09',
    total: 86.42,
    items: 12,
    isEncrypted: false,
    tokenId: '1002',
    receiptType: 'standard',
    status: 'completed'
  },
  {
    id: '3',
    merchantName: 'Best Buy',
    date: '2025-05-01',
    total: 499.99,
    items: 1,
    isEncrypted: true,
    hasGrantedAccess: true,
    grantedTo: ['0x7890abcdef1234567890'],
    tokenId: '1003',
    receiptType: 'premium',
    status: 'completed',
    warranty: {
      expiryDate: '2026-05-01',
      duration: '1 year',
      isActive: true,
    }
  },
  {
    id: '4',
    merchantName: 'Amazon',
    date: '2025-04-28',
    total: 152.67,
    items: 3,
    isEncrypted: false,
    tokenId: '1004',
    receiptType: 'standard',
    status: 'completed'
  },
  {
    id: '5',
    merchantName: 'Starbucks',
    date: '2025-05-14',
    total: 7.85,
    items: 2,
    isEncrypted: false,
    tokenId: '1005',
    receiptType: 'standard',
    status: 'completed'
  },
  {
    id: '6',
    merchantName: 'Tesla',
    date: '2025-03-15',
    total: 52999.99,
    items: 1,
    txHash: '0xabcdef1234567890',
    isEncrypted: true,
    hasGrantedAccess: false,
    tokenId: '1006',
    receiptType: 'luxury',
    status: 'completed',
    warranty: {
      expiryDate: '2033-03-15',
      duration: '8 years',
      isActive: true,
    }
  }
];

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
type ReceiptFilter = 'all' | 'encrypted' | 'unencrypted' | 'accessible' | 'premium' | 'luxury';

const UserNFTWallet: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('receipts');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filter, setFilter] = useState<ReceiptFilter>('all');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [warrantyDialog, setWarrantyDialog] = useState<{
    isOpen: boolean;
    receipt?: NFTReceiptProps;
    processing?: boolean;
    completed?: boolean;
    returnLabel?: string;
  }>({
    isOpen: false
  });
  
  // Filter and sort receipts
  const getFilteredReceipts = () => {
    let filtered = [...mockReceipts];
    
    // Apply filter
    if (filter !== 'all') {
      if (filter === 'encrypted') {
        filtered = filtered.filter(r => r.isEncrypted);
      } else if (filter === 'unencrypted') {
        filtered = filtered.filter(r => !r.isEncrypted);
      } else if (filter === 'accessible') {
        filtered = filtered.filter(r => r.hasGrantedAccess);
      } else if (filter === 'premium' || filter === 'luxury') {
        filtered = filtered.filter(r => r.receiptType === filter);
      }
    }
    
    // Apply search
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        r => 
          r.merchantName.toLowerCase().includes(term) || 
          r.total.toString().includes(term) ||
          r.id.toLowerCase().includes(term)
      );
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
              Digital Wallet Hub
            </h1>
            <p className="text-xl text-muted-foreground mt-1">
              Your blockchain-verified finance center
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="receipts" className="flex items-center justify-center gap-2">
              <Receipt className="h-4 w-4" />
              <span>Receipts</span>
            </TabsTrigger>
            <TabsTrigger value="loyalty" className="flex items-center justify-center gap-2">
              <Crown className="h-4 w-4" />
              <span>Loyalty Tiers</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center justify-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>
          
          {/* RECEIPTS TAB */}
          <TabsContent value="receipts" className="mt-6">
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
                        onClick={() => setFilter('all')}
                        className={`w-full text-left px-2 py-1 rounded text-sm flex items-center ${filter === 'all' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        All Receipts
                      </button>
                      <button
                        onClick={() => setFilter('premium')}
                        className={`w-full text-left px-2 py-1 rounded text-sm flex items-center ${filter === 'premium' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        Premium Tier
                      </button>
                      <button
                        onClick={() => setFilter('luxury')}
                        className={`w-full text-left px-2 py-1 rounded text-sm flex items-center ${filter === 'luxury' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'}`}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        Luxury Tier
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
                        <Plus className="mr-2 h-4 w-4" />
                        Shared Access
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="font-medium mb-2">Sort By</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          <div className="flex items-center">
                            {sortBy === 'date-desc' && (
                              <>
                                <CalendarDays className="mr-2 h-4 w-4" />
                                Newest First
                              </>
                            )}
                            {sortBy === 'date-asc' && (
                              <>
                                <CalendarDays className="mr-2 h-4 w-4" />
                                Oldest First
                              </>
                            )}
                            {sortBy === 'amount-desc' && (
                              <>
                                <SortDesc className="mr-2 h-4 w-4" />
                                Highest Amount
                              </>
                            )}
                            {sortBy === 'amount-asc' && (
                              <>
                                <SortAsc className="mr-2 h-4 w-4" />
                                Lowest Amount
                              </>
                            )}
                          </div>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem onClick={() => setSortBy('date-desc')}>
                          <CalendarDays className="mr-2 h-4 w-4" />
                          <span>Newest First</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('date-asc')}>
                          <CalendarDays className="mr-2 h-4 w-4" />
                          <span>Oldest First</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('amount-desc')}>
                          <SortDesc className="mr-2 h-4 w-4" />
                          <span>Highest Amount</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy('amount-asc')}>
                          <SortAsc className="mr-2 h-4 w-4" />
                          <span>Lowest Amount</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="p-3">
                    <Button variant="outline" className="w-full" onClick={() => {
                      setSearchTerm('');
                      setFilter('all');
                      setSortBy('date-desc');
                    }}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">
                    {filteredReceipts.length} {filteredReceipts.length === 1 ? 'Receipt' : 'Receipts'} Found
                  </h2>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                        <rect x="0.5" y="0.5" width="4" height="4" rx="0.5" stroke="currentColor" />
                        <rect x="0.5" y="7.5" width="4" height="4" rx="0.5" stroke="currentColor" />
                        <rect x="7.5" y="0.5" width="4" height="4" rx="0.5" stroke="currentColor" />
                        <rect x="7.5" y="7.5" width="4" height="4" rx="0.5" stroke="currentColor" />
                      </svg>
                      Grid
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                        <rect x="0.5" y="1.5" width="11" height="2" rx="0.5" stroke="currentColor" />
                        <rect x="0.5" y="5.5" width="11" height="2" rx="0.5" stroke="currentColor" />
                        <rect x="0.5" y="9.5" width="11" height="2" rx="0.5" stroke="currentColor" />
                      </svg>
                      List
                    </Button>
                  </div>
                </div>
                
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
                        subtotal: Math.round(receipt.total * 0.9 * 100), // approximation
                        tax: Math.round(receipt.total * 0.1 * 100), // approximation
                        total: Math.round(receipt.total * 100),
                        items: [{ id: 1, name: 'Item', price: Math.round(receipt.total * 100), quantity: 1 }],
                        blockchainTxHash: receipt.txHash,
                        blockchainVerified: Boolean(receipt.txHash),
                        nftArt: {
                          id: receipt.id,
                          name: receipt.merchantName,
                          tier: receipt.receiptType as any,
                          imageUrl: `/assets/nft-${receipt.receiptType.toLowerCase()}.png`
                        }
                      }}
                      accessControl={{
                        granted: !receipt.isEncrypted || receipt.hasGrantedAccess || false,
                        isOwner: true,
                        accessGrantedTo: receipt.grantedTo?.map(addr => ({
                          address: addr,
                          date: new Date().toISOString()
                        })) || []
                      }}
                      onViewMetadata={() => {
                        toast({
                          title: "Viewing Metadata",
                          description: "Full receipt metadata is being loaded..."
                        });
                      }}
                      onGrantAccess={async (address) => {
                        toast({
                          title: "Access Granted",
                          description: `Access granted to ${address.substring(0, 6)}...`
                        });
                        return true;
                      }}
                      onClaimWarranty={receipt.warranty?.isActive ? async () => {
                        setWarrantyDialog({
                          isOpen: true,
                          receipt: receipt
                        });
                      } : undefined}
                    />
                  ))}
                </div>
                
                {filteredReceipts.length === 0 && (
                  <div className="text-center py-12 border rounded-lg bg-gray-50">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-white rounded-full border">
                        <Search className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">No receipts found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or filter criteria
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setFilter('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* LOYALTY TIERS TAB */}
          <TabsContent value="loyalty" className="mt-6">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 border rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-zinc-200 p-2 mr-3">
                      <Receipt className="h-5 w-5 text-zinc-700" />
                    </div>
                    <h3 className="text-xl font-semibold">Standard Tier</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">Basic receipt NFTs for everyday purchases under $100.</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <span className="mr-2">✓</span>
                      <span>Digital receipt storage</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-2">✓</span>
                      <span>Transaction verification</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-2">✓</span>
                      <span>Basic metadata</span>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="text-sm text-muted-foreground">
                      Purchases under $100
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-blue-200 p-2 mr-3">
                      <Package className="h-5 w-5 text-blue-700" />
                    </div>
                    <h3 className="text-xl font-semibold">Premium Tier</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">Enhanced NFTs for mid-range purchases between $100-1000.</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <span className="mr-2">✓</span>
                      <span>All Standard Tier features</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-2">✓</span>
                      <span>Warranty tracking</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-2">✓</span>
                      <span>Advanced TPRE encryption</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-2">✓</span>
                      <span>Selected partner benefits</span>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="text-sm text-muted-foreground">
                      Purchases $100-$1000
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-amber-200 p-2 mr-3">
                      <Crown className="h-5 w-5 text-amber-700" />
                    </div>
                    <h3 className="text-xl font-semibold">Luxury Tier</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">Exclusive NFTs for high-value purchases above $1000.</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <span className="mr-2">✓</span>
                      <span>All Premium Tier features</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-2">✓</span>
                      <span>Exclusive animated NFT designs</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-2">✓</span>
                      <span>Extended warranty protection</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-2">✓</span>
                      <span>VIP merchant benefits</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="mr-2">✓</span>
                      <span>Special event access</span>
                    </div>
                  </div>
                  <div className="mt-auto">
                    <div className="text-sm text-muted-foreground">
                      Purchases over $1000
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Threshold Privacy Technology</h3>
                    <p className="text-muted-foreground">
                      BlockReceipt leverages advanced Threshold Proxy Re-Encryption (TPRE) to provide
                      unparalleled privacy and selective data sharing capabilities.
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Complete Ownership</h4>
                    <p className="text-sm text-muted-foreground">
                      You own your receipt data. Your sensitive information remains encrypted and only you control who can access it.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Selective Sharing</h4>
                    <p className="text-sm text-muted-foreground">
                      Grant temporary or permanent access to specific third parties like tax preparers without revealing your encryption keys.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Automatic Revocation</h4>
                    <p className="text-sm text-muted-foreground">
                      When you transfer an NFT receipt, all previous access grants are automatically revoked, ensuring privacy across ownership changes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card rounded-lg shadow-md p-6 border border-border flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Total Spending</h3>
                      <p className="text-3xl font-bold mt-2">
                        ${mockReceipts.reduce((sum, receipt) => sum + receipt.total, 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mt-auto">
                    Based on {mockReceipts.length} verified receipts
                  </p>
                </div>
                
                <div className="bg-card rounded-lg shadow-md p-6 border border-border flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Premium Receipts</h3>
                      <p className="text-3xl font-bold mt-2">
                        {mockReceipts.filter(r => r.receiptType === 'premium').length}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mt-auto">
                    Mid-tier purchases with enhanced benefits
                  </p>
                </div>
                
                <div className="bg-card rounded-lg shadow-md p-6 border border-border flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Luxury Receipts</h3>
                      <p className="text-3xl font-bold mt-2">
                        {mockReceipts.filter(r => r.receiptType === 'luxury').length}
                      </p>
                    </div>
                    <div className="p-3 bg-amber-100 rounded-full">
                      <Crown className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mt-auto">
                    High-value purchases with exclusive benefits
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-xl font-semibold mb-6">Spending by Merchant</h3>
                <div className="space-y-4">
                  {Array.from(new Set(mockReceipts.map(r => r.merchantName))).map(merchant => {
                    const merchantReceipts = mockReceipts.filter(r => r.merchantName === merchant);
                    const totalSpent = merchantReceipts.reduce((sum, r) => sum + r.total, 0);
                    const percentage = (totalSpent / mockReceipts.reduce((sum, r) => sum + r.total, 0)) * 100;
                    
                    return (
                      <div key={merchant} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{merchant}</div>
                          <div className="text-sm text-muted-foreground">${totalSpent.toFixed(2)}</div>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {[...mockReceipts]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .slice(0, 5)
                      .map(receipt => (
                        <div key={receipt.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                          <div className="flex items-center">
                            <div className="mr-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                {receipt.receiptType === 'luxury' ? (
                                  <Crown className="h-5 w-5 text-amber-500" />
                                ) : receipt.receiptType === 'premium' ? (
                                  <Package className="h-5 w-5 text-blue-500" />
                                ) : (
                                  <Receipt className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">{receipt.merchantName}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(receipt.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="font-medium">${receipt.total.toFixed(2)}</div>
                        </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border p-6">
                  <h3 className="text-xl font-semibold mb-4">Spending by Category</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Electronics</div>
                        <div className="text-sm text-muted-foreground">$1,799.98</div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                          className="bg-blue-500 h-2.5 rounded-full" 
                          style={{ width: '32%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Automotive</div>
                        <div className="text-sm text-muted-foreground">$52,999.99</div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                          className="bg-amber-500 h-2.5 rounded-full" 
                          style={{ width: '52%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Groceries</div>
                        <div className="text-sm text-muted-foreground">$86.42</div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                          className="bg-green-500 h-2.5 rounded-full" 
                          style={{ width: '8%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Online Shopping</div>
                        <div className="text-sm text-muted-foreground">$152.67</div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                          className="bg-purple-500 h-2.5 rounded-full" 
                          style={{ width: '5%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="font-medium">Food & Drink</div>
                        <div className="text-sm text-muted-foreground">$7.85</div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div 
                          className="bg-red-500 h-2.5 rounded-full" 
                          style={{ width: '1%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserNFTWallet;
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {warrantyDialog.completed 
                ? "Warranty Claim Submitted" 
                : "Process Warranty Claim"}
            </DialogTitle>
            <DialogDescription>
              {warrantyDialog.completed 
                ? "Your warranty claim has been successfully processed." 
                : "Grant access to vendor support to process your warranty claim."}
            </DialogDescription>
          </DialogHeader>

          {warrantyDialog.completed ? (
            <div className="space-y-4">
              <div className="rounded-md bg-green-50 p-4 border border-green-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Claim Processed Successfully</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Your warranty claim has been validated and approved. Please use the return label below to ship your item for replacement.</p>
                    </div>
                  </div>
                </div>
              </div>

              {warrantyDialog.returnLabel && (
                <div className="border rounded-md p-4">
                  <p className="text-sm font-medium mb-2">Return Label</p>
                  <div className="bg-gray-100 p-4 rounded text-sm font-mono overflow-x-auto">
                    {warrantyDialog.returnLabel}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      navigator.clipboard.writeText(warrantyDialog.returnLabel || '');
                      toast({
                        title: "Copied!",
                        description: "Return label copied to clipboard",
                      });
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {warrantyDialog.receipt && (
                <div className="flex items-center space-x-4 border rounded-md p-3">
                  <div className="flex-shrink-0 h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500">{warrantyDialog.receipt.merchantName.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{warrantyDialog.receipt.merchantName}</p>
                    <p className="text-xs text-gray-500">
                      {warrantyDialog.receipt.warranty?.expiryDate 
                        ? `Warranty expires: ${warrantyDialog.receipt.warranty.expiryDate}` 
                        : 'Warranty details not available'}
                    </p>
                  </div>
                </div>
              )}

              <div className="border-t border-b py-4">
                <p className="text-sm mb-2">Grant access to vendor support to process your claim:</p>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-medium">VS</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Vendor Support</p>
                    <p className="text-xs text-gray-500">Official support representative</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Access will be granted using Threshold's TACo re-encryption technology, keeping your data private while allowing limited access for claim verification.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            {warrantyDialog.completed ? (
              <Button 
                type="button" 
                onClick={() => setWarrantyDialog({ isOpen: false })}
              >
                Close
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setWarrantyDialog({ isOpen: false })}
                  disabled={warrantyDialog.processing}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setWarrantyDialog(prev => ({ 
                      ...prev, 
                      processing: true 
                    }));
                    
                    // Simulate TACo re-encryption process
                    setTimeout(() => {
                      setWarrantyDialog(prev => ({ 
                        ...prev, 
                        processing: false,
                        completed: true,
                        returnLabel: `RMA #W${Math.floor(100000 + Math.random() * 900000)}
Ship To: ${prev.receipt?.merchantName} Returns Dept.
123 Merchant Street, Suite 100
Anytown, CA 90210
Reference: ${prev.receipt?.tokenId}
`
                      }));
                      
                      toast({
                        title: "Warranty Claim Approved",
                        description: "Your claim has been processed successfully.",
                      });
                    }, 2000);
                  }}
                  disabled={warrantyDialog.processing}
                >
                  {warrantyDialog.processing ? "Processing..." : "Grant Access & Process Claim"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

export default UserNFTWallet;
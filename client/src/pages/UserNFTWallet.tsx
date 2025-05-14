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
  DollarSign,
  ShieldCheck,
  Award,
  BarChart4,
  PieChart
} from 'lucide-react';
import { mockReceipts } from '@/data/mockData';
import EnhancedNFTReceiptCard from '@/components/receipts/EnhancedNFTReceiptCard';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

/**
 * Props for NFT receipts
 */
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

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
type ReceiptFilter = 'all' | 'encrypted' | 'unencrypted' | 'accessible' | 'premium' | 'luxury';

const UserNFTWallet: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('receipts');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filter, setFilter] = useState<ReceiptFilter>('all');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // State for warranty claim dialog
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
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(receipt => 
        receipt.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.tokenId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply receipt type filter
    switch(filter) {
      case 'encrypted':
        filtered = filtered.filter(r => r.isEncrypted);
        break;
      case 'unencrypted':
        filtered = filtered.filter(r => !r.isEncrypted);
        break;
      case 'accessible':
        filtered = filtered.filter(r => r.hasGrantedAccess || !r.isEncrypted);
        break;
      case 'premium':
        filtered = filtered.filter(r => r.receiptType === 'PREMIUM');
        break;
      case 'luxury':
        filtered = filtered.filter(r => r.receiptType === 'LUXURY');
        break;
      default:
        // 'all' - no additional filtering
        break;
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'amount-asc':
        filtered.sort((a, b) => a.total - b.total);
        break;
      case 'amount-desc':
        filtered.sort((a, b) => b.total - a.total);
        break;
      default:
        // Default to newest first
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }
    
    return filtered;
  };
  
  const filteredReceipts = getFilteredReceipts();
  
  // Stats calculation
  const totalReceiptValue = filteredReceipts.reduce((sum, r) => sum + r.total, 0);
  const encryptedCount = filteredReceipts.filter(r => r.isEncrypted).length;
  const premiumCount = filteredReceipts.filter(r => r.receiptType === 'PREMIUM').length;
  const luxuryCount = filteredReceipts.filter(r => r.receiptType === 'LUXURY').length;
  
  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <h1 className="text-3xl font-bold tracking-tight">NFT Wallet</h1>
          
          <div className="flex items-center space-x-2">
            <Link href="/scan">
              <Button className="gap-2">
                <Plus size={18} />
                New Receipt
              </Button>
            </Link>
            
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                toast({
                  title: "Refreshed",
                  description: "Your NFT receipt collection has been updated.",
                });
              }}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
        
        <Tabs defaultValue="receipts" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
            <TabsTrigger value="receipts" className="flex items-center gap-2">
              <Wallet size={16} />
              <span>Receipts</span>
            </TabsTrigger>
            <TabsTrigger value="loyaltyTiers" className="flex items-center gap-2">
              <Award size={16} />
              <span>Loyalty Tiers</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart4 size={16} />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="receipts" className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    placeholder="Search receipts..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Filter size={16} />
                        Filter
                        <ChevronDown size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setFilter('all')}>
                        All Receipts
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilter('encrypted')}>
                        <Lock size={16} className="mr-2 text-gray-500" />
                        Encrypted Only
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilter('unencrypted')}>
                        <Unlock size={16} className="mr-2 text-gray-500" />
                        Unencrypted Only
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilter('accessible')}>
                        <ShieldCheck size={16} className="mr-2 text-green-500" />
                        Accessible Only
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilter('premium')}>
                        <Award size={16} className="mr-2 text-blue-500" />
                        Premium Tier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilter('luxury')}>
                        <Award size={16} className="mr-2 text-amber-500" />
                        Luxury Tier
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <SortAsc size={16} />
                        Sort
                        <ChevronDown size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSortBy('date-desc')}>
                        <CalendarDays size={16} className="mr-2 text-gray-500" />
                        Newest First
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('date-asc')}>
                        <Clock size={16} className="mr-2 text-gray-500" />
                        Oldest First
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('amount-desc')}>
                        <SortDesc size={16} className="mr-2 text-gray-500" />
                        Highest Value
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy('amount-asc')}>
                        <SortAsc size={16} className="mr-2 text-gray-500" />
                        Lowest Value
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                        imageUrl: `/assets/nft-${receipt.receiptType.toLowerCase()}.png`,
                        description: `Receipt from ${receipt.merchantName}`,
                        collection: "BlockReceipt",
                        rarity: receipt.receiptType,
                        type: "receipt",
                        price: receipt.total
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
                    <Wallet className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium">No receipts found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or add a new receipt.</p>
                  <Button className="mt-4" onClick={() => setLocation('/scan')}>Scan a Receipt</Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="loyaltyTiers" className="space-y-4">
              <div className="flex flex-col space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Current Tier</CardTitle>
                      <CardDescription>Based on your spending history</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-amber-300 to-amber-500 h-16 w-16 rounded-full flex items-center justify-center">
                          <Award className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Gold</h3>
                          <p className="text-sm text-gray-500">$1,500+ spent</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Total Receipts</CardTitle>
                      <CardDescription>Your digital collection</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-3xl font-bold">{filteredReceipts.length}</div>
                        <div className="flex -space-x-2">
                          {[...Array(Math.min(3, filteredReceipts.length))].map((_, idx) => (
                            <Avatar key={idx} className="border-2 border-white h-10 w-10">
                              <AvatarFallback className="bg-gray-200 text-xs">
                                {filteredReceipts[idx]?.merchantName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {filteredReceipts.length > 3 && (
                            <div className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                              +{filteredReceipts.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">Spend Tracker</CardTitle>
                      <CardDescription>Lifetime spending</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold">
                          ${totalReceiptValue.toFixed(2)}
                        </div>
                        <DollarSign className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Next tier at $2,000</span>
                          <span className="font-medium">{Math.min(100, Math.round((totalReceiptValue / 2000) * 100))}%</span>
                        </div>
                        <Progress value={Math.min(100, Math.round((totalReceiptValue / 2000) * 100))} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold mb-4">Tier Benefits</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 p-4">
                        <h3 className="font-bold mb-1">Standard</h3>
                        <p className="text-sm text-gray-500">$0 - $500 Spent</p>
                      </div>
                      <div className="p-4">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <ShieldCheck className="h-4 w-4 text-gray-400 mr-2" />
                            Basic receipt verification
                          </li>
                          <li className="flex items-center">
                            <Lock className="h-4 w-4 text-gray-400 mr-2" />
                            Standard encryption
                          </li>
                          <li className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            3-day support response
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-blue-50 p-4">
                        <Badge className="mb-2" variant="secondary">Current</Badge>
                        <h3 className="font-bold mb-1">Premium</h3>
                        <p className="text-sm text-gray-500">$500 - $2,000 Spent</p>
                      </div>
                      <div className="p-4">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <ShieldCheck className="h-4 w-4 text-blue-500 mr-2" />
                            Premium receipt verification
                          </li>
                          <li className="flex items-center">
                            <Lock className="h-4 w-4 text-blue-500 mr-2" />
                            Enhanced encryption options
                          </li>
                          <li className="flex items-center">
                            <Award className="h-4 w-4 text-blue-500 mr-2" />
                            Special merchant offers
                          </li>
                          <li className="flex items-center">
                            <Clock className="h-4 w-4 text-blue-500 mr-2" />
                            24-hour support response
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4">
                        <h3 className="font-bold mb-1">Luxury</h3>
                        <p className="text-sm text-gray-500">$2,000+ Spent</p>
                      </div>
                      <div className="p-4">
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <ShieldCheck className="h-4 w-4 text-amber-500 mr-2" />
                            Premium receipt verification
                          </li>
                          <li className="flex items-center">
                            <Lock className="h-4 w-4 text-amber-500 mr-2" />
                            Advanced encryption controls
                          </li>
                          <li className="flex items-center">
                            <Award className="h-4 w-4 text-amber-500 mr-2" />
                            Exclusive merchant offers
                          </li>
                          <li className="flex items-center">
                            <Clock className="h-4 w-4 text-amber-500 mr-2" />
                            Priority support (4 hours)
                          </li>
                          <li className="flex items-center">
                            <PieChart className="h-4 w-4 text-amber-500 mr-2" />
                            Advanced spending analytics
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalReceiptValue.toFixed(2)}</div>
                    <p className="text-sm text-gray-500 mt-1">Across {filteredReceipts.length} receipts</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Encrypted</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{encryptedCount}</div>
                    <p className="text-sm text-gray-500 mt-1">
                      {Math.round((encryptedCount / Math.max(1, filteredReceipts.length)) * 100)}% of total
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Premium Tier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{premiumCount}</div>
                    <p className="text-sm text-gray-500 mt-1">
                      {Math.round((premiumCount / Math.max(1, filteredReceipts.length)) * 100)}% of total
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Luxury Tier</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{luxuryCount}</div>
                    <p className="text-sm text-gray-500 mt-1">
                      {Math.round((luxuryCount / Math.max(1, filteredReceipts.length)) * 100)}% of total
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Spending Analysis</CardTitle>
                  <CardDescription>Visualization coming in next update</CardDescription>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart4 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p>Spending analysis charts are being generated.</p>
                    <p className="text-sm">Check back soon for detailed insights.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Warranty Claim Dialog */}
      <Dialog 
        open={warrantyDialog.isOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setWarrantyDialog(prev => ({ isOpen: false }));
          }
        }}
      >
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
    </div>
  );
};

export default UserNFTWallet;
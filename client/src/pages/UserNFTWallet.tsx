import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Wallet, ShoppingBag, Filter, Search, QrCode, Share2, Grid3X3, List, Download, Info, ShieldCheck } from 'lucide-react';
import { EnhancedNFTReceiptCard } from '@/components/receipts/EnhancedNFTReceiptCard';

// Type-safe receipt types
type ReceiptType = 'standard' | 'premium' | 'luxury';

interface MockReceipt {
  id: number;
  merchant: { name: string; logo: string };
  purchaseDate: string;
  amount: number;
  currencySymbol: string;
  items: number;
  receiptType: ReceiptType;
  tokenId: number;
  contractAddress: string;
  revoked?: boolean;
  // TACo encryption related fields
  isEncrypted?: boolean;
  hasEncryptedMetadata?: boolean;
  grantedAccessTo?: string[];
}

const mockReceipts: MockReceipt[] = [
  {
    id: 1,
    merchant: { name: "Whole Foods Market", logo: "wholefoods.png" },
    purchaseDate: "2025-05-10T10:30:00Z",
    amount: 84.32,
    currencySymbol: "$",
    items: 12,
    receiptType: "premium",
    tokenId: 23456,
    contractAddress: "0x1234567890123456789012345678901234567890",
    isEncrypted: true,
    hasEncryptedMetadata: true,
    grantedAccessTo: ['0x71C7656EC7ab88b098defB751B7401B5f6d8976F']
  },
  {
    id: 2,
    merchant: { name: "Apple Store", logo: "apple.png" },
    purchaseDate: "2025-05-08T15:45:00Z",
    amount: 1299.99,
    currencySymbol: "$",
    items: 2,
    receiptType: "luxury",
    tokenId: 23457,
    contractAddress: "0x1234567890123456789012345678901234567890",
    isEncrypted: true,
    hasEncryptedMetadata: true,
    grantedAccessTo: ['0x71C7656EC7ab88b098defB751B7401B5f6d8976F', '0x82A7656EC7ab88b098defB751B7401B5f6d8976F']
  },
  {
    id: 3,
    merchant: { name: "Target", logo: "target.png" },
    purchaseDate: "2025-05-05T09:15:00Z",
    amount: 49.95,
    currencySymbol: "$",
    items: 7,
    receiptType: "standard",
    tokenId: 23458,
    contractAddress: "0x1234567890123456789012345678901234567890",
    isEncrypted: false,
    hasEncryptedMetadata: false
  },
  {
    id: 4,
    merchant: { name: "Amazon", logo: "amazon.png" },
    purchaseDate: "2025-05-01T14:20:00Z",
    amount: 67.50,
    currencySymbol: "$",
    items: 4,
    receiptType: "premium",
    tokenId: 23459,
    contractAddress: "0x1234567890123456789012345678901234567890",
    isEncrypted: true,
    hasEncryptedMetadata: true,
    grantedAccessTo: []
  },
  {
    id: 5,
    merchant: { name: "Best Buy", logo: "bestbuy.png" },
    purchaseDate: "2025-04-28T11:30:00Z",
    amount: 599.99,
    currencySymbol: "$",
    items: 1,
    receiptType: "luxury",
    tokenId: 23460,
    contractAddress: "0x1234567890123456789012345678901234567890",
    revoked: true
  }
];

export default function UserNFTWallet() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedWallet, setConnectedWallet] = useState(true);
  const [showEncryptedOnly, setShowEncryptedOnly] = useState(false);

  const filteredReceipts = mockReceipts.filter(receipt => {
    const matchesSearch = receipt.merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.tokenId.toString().includes(searchQuery);
    
    const matchesEncryptedFilter = !showEncryptedOnly || receipt.isEncrypted === true;
    
    return matchesSearch && matchesEncryptedFilter;
  });

  const handleConnectWallet = () => {
    setConnectedWallet(true);
  };

  const handleDisconnectWallet = () => {
    setConnectedWallet(false);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Your NFT Receipts</h1>
          <p className="text-muted-foreground mt-2">Manage and view your blockchain-verified purchase receipts</p>
        </div>

        {!connectedWallet ? (
          <Card className="flex flex-col items-center justify-center p-12">
            <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Connect your blockchain wallet to view all your NFT receipts across multiple merchants.
            </p>
            <Button onClick={handleConnectWallet} size="lg">
              Connect Wallet
            </Button>
          </Card>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-6 flex justify-between items-center">
              <div>
                <div className="text-sm text-blue-800 mb-1">Connected Wallet</div>
                <div className="font-mono text-blue-950 flex items-center">
                  0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                  <Button variant="ghost" size="sm" className="ml-2 h-6 w-6 p-0">
                    <QrCode className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="text-sm text-blue-800 mt-2">
                  <span className="font-medium">5</span> NFT Receipts
                </div>
              </div>
              <Button variant="outline" onClick={handleDisconnectWallet}>
                Disconnect
              </Button>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by merchant or token ID..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-blue-50 flex items-center space-x-2 px-3 py-2 rounded-md border border-blue-100">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <Label htmlFor="encrypted-only" className="text-sm text-blue-700 cursor-pointer">
                    Show TACo encrypted receipts only
                  </Label>
                  <Switch 
                    id="encrypted-only" 
                    checked={showEncryptedOnly} 
                    onCheckedChange={setShowEncryptedOnly}
                  />
                </div>
                <div className="ml-2 text-xs text-blue-600">
                  {showEncryptedOnly ? 
                    `Showing ${filteredReceipts.length} encrypted receipts` : 
                    `${mockReceipts.filter(r => r.isEncrypted).length} receipts have TACo encryption`
                  }
                </div>
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Receipts</TabsTrigger>
                <TabsTrigger value="recent">Recent (30 Days)</TabsTrigger>
                <TabsTrigger value="standard">Standard</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
                <TabsTrigger value="luxury">Luxury</TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <TabsContent value="all" className="space-y-4">
                  {filteredReceipts.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No receipts found</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        {searchQuery ? 
                          "Try a different search term or clear the search field." : 
                          "Make a purchase from one of our partner merchants to get your first NFT receipt."}
                      </p>
                    </div>
                  ) : (
                    <div className={viewMode === 'grid' ? 
                      'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
                      'space-y-4'
                    }>
                      {filteredReceipts.map(receipt => (
                        <div key={receipt.id}>
                          {viewMode === 'grid' ? (
                            <EnhancedNFTReceiptCard {...receipt} />
                          ) : (
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="font-medium">{receipt.merchant.name}</h3>
                                    <div className="text-sm text-muted-foreground">
                                      {new Date(receipt.purchaseDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">{receipt.currencySymbol}{receipt.amount.toFixed(2)}</div>
                                    <div className="text-sm text-muted-foreground capitalize">
                                      {receipt.receiptType} Receipt
                                    </div>
                                  </div>
                                </div>
                                <Separator className="my-4" />
                                <div className="flex justify-between items-center">
                                  <div className="text-xs text-muted-foreground">
                                    Token ID: {receipt.tokenId}
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="sm">
                                      <Info className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Share2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="recent">
                  <div className={viewMode === 'grid' ? 
                    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
                    'space-y-4'
                  }>
                    {filteredReceipts.slice(0, 4).map(receipt => (
                      <div key={receipt.id}>
                        {viewMode === 'grid' ? (
                          <EnhancedNFTReceiptCard {...receipt} />
                        ) : (
                          <Card>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <h3 className="font-medium">{receipt.merchant.name}</h3>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(receipt.purchaseDate).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">{receipt.currencySymbol}{receipt.amount.toFixed(2)}</div>
                                  <div className="text-sm text-muted-foreground capitalize">
                                    {receipt.receiptType} Receipt
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="standard">
                  <div className={viewMode === 'grid' ? 
                    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
                    'space-y-4'
                  }>
                    {filteredReceipts
                      .filter(receipt => receipt.receiptType === 'standard')
                      .map(receipt => (
                        <div key={receipt.id}>
                          {viewMode === 'grid' ? (
                            <EnhancedNFTReceiptCard {...receipt} />
                          ) : (
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="font-medium">{receipt.merchant.name}</h3>
                                    <div className="text-sm text-muted-foreground">
                                      {new Date(receipt.purchaseDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">{receipt.currencySymbol}{receipt.amount.toFixed(2)}</div>
                                    <div className="text-sm text-muted-foreground capitalize">
                                      {receipt.receiptType} Receipt
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="premium">
                  <div className={viewMode === 'grid' ? 
                    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
                    'space-y-4'
                  }>
                    {filteredReceipts
                      .filter(receipt => receipt.receiptType === 'premium')
                      .map(receipt => (
                        <div key={receipt.id}>
                          {viewMode === 'grid' ? (
                            <EnhancedNFTReceiptCard {...receipt} />
                          ) : (
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="font-medium">{receipt.merchant.name}</h3>
                                    <div className="text-sm text-muted-foreground">
                                      {new Date(receipt.purchaseDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">{receipt.currencySymbol}{receipt.amount.toFixed(2)}</div>
                                    <div className="text-sm text-muted-foreground capitalize">
                                      {receipt.receiptType} Receipt
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="luxury">
                  <div className={viewMode === 'grid' ? 
                    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
                    'space-y-4'
                  }>
                    {filteredReceipts
                      .filter(receipt => receipt.receiptType === 'luxury')
                      .map(receipt => (
                        <div key={receipt.id}>
                          {viewMode === 'grid' ? (
                            <EnhancedNFTReceiptCard {...receipt} />
                          ) : (
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h3 className="font-medium">{receipt.merchant.name}</h3>
                                    <div className="text-sm text-muted-foreground">
                                      {new Date(receipt.purchaseDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium">{receipt.currencySymbol}{receipt.amount.toFixed(2)}</div>
                                    <div className="text-sm text-muted-foreground capitalize">
                                      {receipt.receiptType} Receipt
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
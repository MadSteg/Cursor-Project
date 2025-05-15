import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Receipt, ShoppingCart, Coffee, Laptop, Shirt } from 'lucide-react';
import NFTArtPicker from '@/components/receipts/NFTArtPicker';
import { useLocation } from 'wouter';

// Sample receipt data
const sampleReceipts = [
  {
    id: "grocery-receipt",
    merchantName: "FreshMart Groceries",
    date: "2025-05-15",
    total: 78.35,
    subtotal: 72.55,
    tax: 5.80,
    category: "Grocery",
    image: "/sample-receipts/grocery-receipt.jpg",
    items: [
      { name: "Organic Apples (1lb)", price: 4.99 },
      { name: "Whole Grain Bread", price: 3.99 },
      { name: "Cage-Free Eggs (12)", price: 5.49 },
      { name: "Free-Range Chicken", price: 12.99 },
      { name: "Organic Milk", price: 4.99 },
      { name: "Assorted Vegetables", price: 15.75 },
      { name: "Grass-Fed Beef (1lb)", price: 9.99 },
      { name: "Sparkling Water (6pk)", price: 5.49 },
      { name: "Premium Coffee Beans", price: 8.99 }
    ],
    tier: {
      id: "STANDARD",
      title: "Standard",
      description: "Standard BlockReceipt with basic features and encryption",
      price: 0.99
    }
  },
  {
    id: "coffee-receipt",
    merchantName: "Blockchain Brew Coffee",
    date: "2025-05-15",
    total: 18.75,
    subtotal: 17.36,
    tax: 1.39,
    category: "Food & Drink",
    image: "/sample-receipts/coffee-receipt.jpg",
    items: [
      { name: "Espresso Macchiato", price: 4.95 },
      { name: "Cold Brew Coffee", price: 5.50 },
      { name: "Vegan Blueberry Muffin", price: 3.95 },
      { name: "Tip", price: 2.96 }
    ],
    tier: {
      id: "BASIC",
      title: "Basic",
      description: "Basic BlockReceipt with minimal features",
      price: 0
    }
  },
  {
    id: "tech-receipt",
    merchantName: "TechVerse Electronics",
    date: "2025-05-14",
    total: 1299.99,
    subtotal: 1199.99,
    tax: 100.00,
    category: "Electronics",
    image: "/sample-receipts/tech-receipt.jpg",
    items: [
      { name: "Ultra HD Smart Display", price: 699.99 },
      { name: "Wireless Earbuds Pro", price: 249.99 },
      { name: "Extended 3-Year Warranty", price: 149.99 },
      { name: "Premium HDMI Cable", price: 29.99 },
      { name: "Smart Home Hub", price: 69.99 }
    ],
    tier: {
      id: "LUXURY",
      title: "Luxury",
      description: "Exclusive BlockReceipt with premium features and highest encryption",
      price: 5.00
    }
  },
  {
    id: "fashion-receipt",
    merchantName: "StyleBlock Fashion",
    date: "2025-05-13",
    total: 345.85,
    subtotal: 319.30,
    tax: 26.55,
    category: "Fashion",
    image: "/sample-receipts/fashion-receipt.jpg",
    items: [
      { name: "Designer Jeans", price: 129.95 },
      { name: "Premium T-Shirt", price: 49.95 },
      { name: "Leather Wallet", price: 89.95 },
      { name: "Cotton Socks (3pk)", price: 24.95 },
      { name: "Fashion Belt", price: 24.50 }
    ],
    tier: {
      id: "PREMIUM",
      title: "Premium",
      description: "Enhanced BlockReceipt with premium features and advanced encryption",
      price: 2.99
    }
  }
];

// Define tier colors for visualization
const tierColors = {
  BASIC: 'bg-gray-200',
  STANDARD: 'bg-blue-200',
  PREMIUM: 'bg-purple-200',
  LUXURY: 'bg-amber-200',
};

const categoryIcons = {
  "Grocery": <ShoppingCart className="h-8 w-8" />,
  "Food & Drink": <Coffee className="h-8 w-8" />,
  "Electronics": <Laptop className="h-8 w-8" />,
  "Fashion": <Shirt className="h-8 w-8" />
};

export default function ReceiptGalleryPage() {
  const [activeTab, setActiveTab] = useState('all');
  // Define type for receipt
  type Receipt = typeof sampleReceipts[0];
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [showNftPicker, setShowNftPicker] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast();
  const [_location, _navigate] = useLocation();

  const filteredReceipts = activeTab === 'all' 
    ? sampleReceipts 
    : sampleReceipts.filter(receipt => receipt.tier.id === activeTab);

  const handleSelectReceipt = (receipt: any) => {
    setSelectedReceipt(receipt);
  };

  const handleMintReceipt = () => {
    if (!selectedReceipt) return;
    setShowNftPicker(true);
  };

  const handleNFTSelected = async (nft: any) => {
    if (!selectedReceipt) return;
    
    setIsMinting(true);
    setShowNftPicker(false);

    // Store merchant name for later use
    const merchantName = selectedReceipt.merchantName;

    // Simulate minting
    setTimeout(() => {
      setIsMinting(false);
      
      toast({
        title: 'BlockReceipt Minted',
        description: `Your receipt from ${merchantName} has been minted as a "${nft.name}" NFT to wallet 0x0CC9bb224dA2cbe7764ab7513D493cB2b3BeA6FC.`,
        variant: 'default',
        duration: 5000,
      });
      
      // Show transaction confirmation
      setTimeout(() => {
        toast({
          title: 'Transaction Confirmed',
          description: `Transaction hash: 0x${Math.random().toString(16).substring(2, 42)}. TokenID: ${Math.floor(Math.random() * 10000)}`,
          variant: 'default',
          duration: 5000,
        });
        
        // Reset and go back to gallery
        setSelectedReceipt(null);
      }, 1500);
    }, 2000);
  };

  const handleCancelNFTSelection = () => {
    setShowNftPicker(false);
  };

  return (
    <div className="container max-w-7xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">BlockReceipt Gallery</h1>
        <p className="text-muted-foreground mt-2">
          Select a sample receipt to mint as a BlockReceipt NFT
        </p>
      </div>
      
      {!selectedReceipt && !showNftPicker ? (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Receipts</TabsTrigger>
              <TabsTrigger value="BASIC">Basic</TabsTrigger>
              <TabsTrigger value="STANDARD">Standard</TabsTrigger>
              <TabsTrigger value="PREMIUM">Premium</TabsTrigger>
              <TabsTrigger value="LUXURY">Luxury</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReceipts.map((receipt) => (
              <Card key={receipt.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-muted flex items-center justify-center">
                  <div className="absolute -right-2 -top-2">
                    <span className={`${tierColors[receipt.tier.id as 'BASIC' | 'STANDARD' | 'PREMIUM' | 'LUXURY']} px-3 py-1 rounded-full text-sm font-medium shadow-sm`}>
                      {receipt.tier.title}
                    </span>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {categoryIcons[receipt.category as keyof typeof categoryIcons] || <Receipt className="h-8 w-8" />}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{receipt.merchantName}</CardTitle>
                  <CardDescription>
                    {receipt.date} • ${receipt.total.toFixed(2)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {receipt.items.length} items including:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {receipt.items.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{item.name}</span>
                        <span>${item.price.toFixed(2)}</span>
                      </li>
                    ))}
                    {receipt.items.length > 3 && (
                      <li className="text-xs italic">...and {receipt.items.length - 3} more items</li>
                    )}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleSelectReceipt(receipt)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-700"
                  >
                    Select Receipt
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          {!showNftPicker && selectedReceipt && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-2">
                <div className="sticky top-6">
                  <Card>
                    <div className="p-6 bg-muted flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                        {categoryIcons[selectedReceipt.category as keyof typeof categoryIcons] || <Receipt className="h-10 w-10" />}
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{selectedReceipt.merchantName}</CardTitle>
                        <div className={`${tierColors[selectedReceipt.tier.id as 'BASIC' | 'STANDARD' | 'PREMIUM' | 'LUXURY']} px-3 py-1 rounded-full text-sm font-medium`}>
                          {selectedReceipt.tier.title}
                        </div>
                      </div>
                      <CardDescription>
                        {selectedReceipt.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-lg font-medium">
                        <span>Total</span>
                        <span>${selectedReceipt.total.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${selectedReceipt.subtotal.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Tax</span>
                        <span>${selectedReceipt.tax.toFixed(2)}</span>
                      </div>
                      
                      <div className="pt-4 space-y-4">
                        <Button
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          size="lg"
                          onClick={handleMintReceipt}
                          disabled={isMinting}
                        >
                          {isMinting ? 'Minting...' : 'Mint as BlockReceipt NFT'}
                        </Button>
                        
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setSelectedReceipt(null)}
                          disabled={isMinting}
                        >
                          Back to Gallery
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Receipt Items</CardTitle>
                    <CardDescription>
                      Complete list of items from your receipt
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedReceipt.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between border-b border-muted pb-2 last:border-0 last:pb-0">
                        <span>{item.name}</span>
                        <span className="font-medium">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>About {selectedReceipt.tier.title} Tier</CardTitle>
                    <CardDescription>
                      Features and benefits of this BlockReceipt tier
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedReceipt.tier.description}</p>
                    
                    {selectedReceipt.tier.id === 'BASIC' && (
                      <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
                        <li>Basic blockchain verification</li>
                        <li>Simple receipt data storage</li>
                        <li>30-day data retention</li>
                        <li>Free of charge</li>
                      </ul>
                    )}
                    
                    {selectedReceipt.tier.id === 'STANDARD' && (
                      <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
                        <li>Enhanced blockchain verification</li>
                        <li>Basic encryption of sensitive data</li>
                        <li>1-year data retention</li>
                        <li>Basic warranty tracking</li>
                      </ul>
                    )}
                    
                    {selectedReceipt.tier.id === 'PREMIUM' && (
                      <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
                        <li>Premium blockchain verification</li>
                        <li>Advanced encryption with selective disclosure</li>
                        <li>5-year data retention</li>
                        <li>Advanced warranty tracking with notifications</li>
                        <li>Return/exchange management</li>
                      </ul>
                    )}
                    
                    {selectedReceipt.tier.id === 'LUXURY' && (
                      <ul className="list-disc list-inside mt-4 space-y-2 text-sm">
                        <li>Premium blockchain verification with attestations</li>
                        <li>Highest-grade Threshold encryption</li>
                        <li>Lifetime data retention</li>
                        <li>Advanced warranty tracking with auto-claims</li>
                        <li>Exclusive NFT artwork</li>
                        <li>Premium customer support</li>
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {showNftPicker && selectedReceipt && (
            <NFTArtPicker 
              receiptData={selectedReceipt}
              onSelect={handleNFTSelected}
              onCancel={handleCancelNFTSelection}
            />
          )}
        </>
      )}
    </div>
  );
};
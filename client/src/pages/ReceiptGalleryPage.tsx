import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Wallet, LockIcon, UnlockIcon, ReceiptIcon, ShoppingBag, Calendar, AlertCircle, ExternalLink } from "lucide-react";
import { apiRequest } from '@/lib/queryClient';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';
import { Skeleton } from '@/components/ui/skeleton';

// NFT Receipt interface
interface NFTReceipt {
  id: string;
  name: string;
  description: string;
  image: string;
  dateCreated: string;
  metadata: {
    merchant: string;
    date: string;
    total: number;
    encrypted: boolean;
    items?: Array<{
      name: string;
      price: number;
      category: string;
    }>;
  };
  txHash: string;
  chainId: number;
  contract: string;
  metadataLocked: boolean;
}

export default function ReceiptGalleryPage() {
  const { toast } = useToast();
  const { address, isConnected, connect } = useWeb3Wallet();
  const [receipts, setReceipts] = useState<NFTReceipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<NFTReceipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (isConnected && address) {
      fetchReceipts();
    } else {
      setLoading(false);
    }
  }, [isConnected, address]);

  const fetchReceipts = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const response = await apiRequest('GET', `/api/gallery/${address}`);
      const data = await response.json();
      
      if (data.success && data.nfts) {
        setReceipts(data.nfts);
        if (data.nfts.length > 0) {
          setSelectedReceipt(data.nfts[0]);
        }
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch receipts",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const unlockMetadata = async (id: string) => {
    if (!address || !selectedReceipt) return;
    
    setUnlocking(true);
    try {
      const response = await apiRequest('POST', `/api/gallery/${address}/${id}/unlock`);
      const data = await response.json();
      
      if (data.success) {
        // Update the selected receipt with the unlocked metadata
        setSelectedReceipt({
          ...selectedReceipt,
          metadata: data.metadata,
          metadataLocked: false
        });
        
        // Also update the receipt in the receipts array
        setReceipts(receipts.map(receipt => 
          receipt.id === id 
            ? { ...receipt, metadata: data.metadata, metadataLocked: false } 
            : receipt
        ));
        
        toast({
          title: "Success",
          description: "Receipt metadata unlocked",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to unlock metadata",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setUnlocking(false);
    }
  };

  const renderReceiptItem = (receipt: NFTReceipt) => {
    return (
      <Card 
        key={receipt.id}
        className={`cursor-pointer hover:border-primary transition-all ${selectedReceipt?.id === receipt.id ? 'border-2 border-primary' : ''}`}
        onClick={() => setSelectedReceipt(receipt)}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-md">
              <img 
                src={receipt.image} 
                alt={receipt.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{receipt.name}</h3>
              <p className="text-sm text-muted-foreground">{receipt.metadata.merchant}</p>
              <p className="text-sm">${receipt.metadata.total.toFixed(2)}</p>
              <div className="flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {new Date(receipt.metadata.date).toLocaleDateString()}
                </span>
                {receipt.metadataLocked && (
                  <LockIcon className="h-3 w-3 ml-2 text-amber-500" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-[400px]">
        <ReceiptIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No BlockReceipts Found</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          You don't have any BlockReceipt NFTs in your wallet yet. Upload a receipt to get started.
        </p>
        <Button asChild>
          <a href="/upload">Upload a Receipt</a>
        </Button>
      </div>
    );
  };

  const renderLoadingState = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-48 w-full rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderConnectWallet = () => {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-[400px]">
        <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Connect your wallet to view your BlockReceipt NFT collection.
        </p>
        <Button onClick={connect}>
          Connect Wallet
        </Button>
      </div>
    );
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your BlockReceipt Gallery</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your blockchain receipts
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button asChild variant="outline" className="mr-2">
            <a href="/upload">Upload New Receipt</a>
          </Button>
          {!isConnected && (
            <Button onClick={connect}>
              Connect Wallet
            </Button>
          )}
        </div>
      </div>

      {!isConnected ? (
        renderConnectWallet()
      ) : loading ? (
        renderLoadingState()
      ) : receipts.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All Receipts</TabsTrigger>
                <TabsTrigger value="locked" className="flex-1">Encrypted</TabsTrigger>
                <TabsTrigger value="unlocked" className="flex-1">Decrypted</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="space-y-4 overflow-auto pr-2 max-h-[600px]">
              {receipts
                .filter(receipt => {
                  if (activeTab === 'all') return true;
                  if (activeTab === 'locked') return receipt.metadataLocked;
                  if (activeTab === 'unlocked') return !receipt.metadataLocked;
                  return true;
                })
                .map(renderReceiptItem)}
            </div>
          </div>
          
          <div className="md:col-span-2">
            {selectedReceipt && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{selectedReceipt.name}</CardTitle>
                      <CardDescription>
                        {new Date(selectedReceipt.dateCreated).toLocaleDateString()} - {selectedReceipt.description}
                      </CardDescription>
                    </div>
                    <Badge className={selectedReceipt.metadataLocked ? "bg-amber-500" : "bg-green-500"}>
                      {selectedReceipt.metadataLocked ? "Encrypted" : "Decrypted"}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="flex justify-center">
                    <div className="rounded-md overflow-hidden max-h-[300px]">
                      <img 
                        src={selectedReceipt.image} 
                        alt={selectedReceipt.name} 
                        className="object-cover"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center">
                      <ShoppingBag className="h-5 w-5 mr-2 text-primary" />
                      Receipt Details
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Merchant</p>
                        <p className="font-medium">{selectedReceipt.metadata.merchant}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{new Date(selectedReceipt.metadata.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-medium">${selectedReceipt.metadata.total.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Chain</p>
                        <p className="font-medium">Polygon {selectedReceipt.chainId === 80002 ? 'Amoy' : 'Mumbai'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex items-center">
                      <ReceiptIcon className="h-5 w-5 mr-2 text-primary" />
                      Line Items
                    </h3>
                    
                    {selectedReceipt.metadataLocked ? (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                        <div className="flex items-start">
                          <LockIcon className="h-5 w-5 mr-2 text-amber-500 mt-0.5" />
                          <div>
                            <p className="font-medium">Line Items are Encrypted</p>
                            <p className="text-sm text-muted-foreground mb-3">
                              Your receipt details are securely encrypted with threshold encryption.
                              Only you can unlock and view your sensitive purchase data.
                            </p>
                            <Button
                              onClick={() => unlockMetadata(selectedReceipt.id)}
                              disabled={unlocking}
                              className="bg-amber-500 hover:bg-amber-600"
                            >
                              {unlocking ? "Unlocking..." : "Unlock Receipt Data"}
                              {!unlocking && <UnlockIcon className="h-4 w-4 ml-2" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedReceipt.metadata.items?.map((item, index) => (
                          <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                            <div className="flex items-start">
                              <p>{item.name}</p>
                              {item.category && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {item.category}
                                </Badge>
                              )}
                            </div>
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button variant="outline" asChild>
                    <a 
                      href={`https://amoy.polygonscan.com/tx/${selectedReceipt.txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View on Explorer
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a 
                      href={`https://amoy.polygonscan.com/token/${selectedReceipt.contract}?a=${address}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      View Contract
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
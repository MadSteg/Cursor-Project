import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useGalleryPoll } from "@/hooks/useGalleryPoll";
import { useToast } from "@/hooks/use-toast";
import { useWalletConnect } from "@/hooks/useWalletConnect";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { 
  ReceiptIcon, 
  ShieldIcon, 
  TagIcon, 
  InfoIcon, 
  RefreshCcwIcon, 
  ExternalLinkIcon, 
  LockIcon 
} from "lucide-react";

// Receipt types and interfaces should be imported from shared types file
interface Receipt {
  id: number;
  merchantName: string;
  date: string;
  total: number;
  walletAddress: string;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
  nftTokenId?: string;
  nftImageUrl?: string;
  txHash?: string;
  status: 'claimed' | 'pending' | 'unclaimed';
  lastUpdated: string;
}

export default function GalleryPage() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [showReceiptDetails, setShowReceiptDetails] = useState(false);
  const { walletAddress } = useWalletConnect();
  
  // Extract task ID from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = urlParams.get('taskId');
  
  // Use the gallery polling hook
  const { 
    refreshGallery, 
    taskStatus, 
    isPolling, 
    taskCompleted 
  } = useGalleryPoll({
    taskId: taskId || undefined,
    enabled: !!taskId,
  });
  
  // Fetch user's receipts
  const { 
    data: receipts = [], 
    isLoading, 
    isError,
    refetch
  } = useQuery({
    queryKey: ['/api/gallery'],
    enabled: !!walletAddress,
  });
  
  // If no wallet is connected, show a prompt to connect
  if (!walletAddress) {
    return (
      <div className="container mx-auto py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Your BlockReceipts Gallery</h1>
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Wallet</CardTitle>
              <CardDescription>
                Please connect your wallet to view your BlockReceipts collection.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <Button 
                onClick={() => setLocation('/wallet')}
                size="lg"
              >
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Task notification - show if we're polling for a task
  useEffect(() => {
    if (isPolling) {
      toast({
        title: "Minting in Progress",
        description: "Your BlockReceipt NFT is being created. This gallery will refresh automatically when complete.",
      });
    }
    
    if (taskCompleted) {
      toast({
        title: "NFT Created!",
        description: "Your BlockReceipt NFT has been successfully minted.",
      });
      
      // Clear the taskId from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [isPolling, taskCompleted, toast]);
  
  // Receipt Details Modal
  const renderReceiptDetails = () => {
    if (!selectedReceipt) return null;
    
    return (
      <AlertDialog open={showReceiptDetails} onOpenChange={setShowReceiptDetails}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Receipt Details</AlertDialogTitle>
            <AlertDialogDescription>
              Receipt from {selectedReceipt.merchantName} on {selectedReceipt.date}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <h4 className="font-semibold mb-2">Receipt Information</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="font-medium">Date:</span> {selectedReceipt.date}</li>
                <li><span className="font-medium">Total:</span> ${selectedReceipt.total.toFixed(2)}</li>
                <li><span className="font-medium">Merchant:</span> {selectedReceipt.merchantName}</li>
                <li><span className="font-medium">Status:</span> 
                  <Badge className="ml-2" variant={
                    selectedReceipt.status === 'claimed' ? 'default' :
                    selectedReceipt.status === 'pending' ? 'outline' : 'secondary'
                  }>
                    {selectedReceipt.status}
                  </Badge>
                </li>
                {selectedReceipt.txHash && (
                  <li>
                    <span className="font-medium">Transaction:</span>
                    <a 
                      href={`https://mumbai.polygonscan.com/tx/${selectedReceipt.txHash}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center ml-2 text-xs"
                    >
                      View on Explorer
                      <ExternalLinkIcon className="h-3 w-3 ml-1" />
                    </a>
                  </li>
                )}
              </ul>
            </div>
            
            <div>
              {selectedReceipt.nftImageUrl ? (
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src={selectedReceipt.nftImageUrl} 
                    alt="Receipt NFT" 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                  <div className="text-center p-4">
                    <ReceiptIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">NFT will appear here once minted</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {selectedReceipt.items && selectedReceipt.items.length > 0 && (
            <div className="mt-2 border-t pt-4">
              <h4 className="font-semibold mb-2">Items</h4>
              <div className="max-h-40 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Item</th>
                      <th className="text-right py-2">Qty</th>
                      <th className="text-right py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReceipt.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-muted">
                        <td className="py-2">{item.name}</td>
                        <td className="text-right py-2">{item.quantity}</td>
                        <td className="text-right py-2">${item.price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            {selectedReceipt.status === 'claimed' && (
              <AlertDialogAction asChild>
                <Button variant="default">
                  <LockIcon className="mr-2 h-4 w-4" />
                  Access Controls
                </Button>
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Your BlockReceipts</h1>
          <p className="text-muted-foreground">
            Blockchain-verified digital proof of your purchases
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="flex items-center"
          >
            <RefreshCcwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          
          <Button 
            variant="default"
            size="sm"
            onClick={() => setLocation('/scan')}
          >
            <ReceiptIcon className="mr-2 h-4 w-4" />
            Add Receipt
          </Button>
        </div>
      </div>
      
      {isPolling && (
        <Card className="mb-6 border-dashed border-primary/50 bg-primary/5">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Spinner className="mr-2" />
              <div>
                <p className="font-medium">NFT Minting in Progress</p>
                <p className="text-sm text-muted-foreground">Status: {taskStatus}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={refreshGallery}>
              Refresh Now
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Receipts</TabsTrigger>
          <TabsTrigger value="claimed">Claimed NFTs</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : receipts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {receipts.map((receipt: Receipt) => (
                <Card key={receipt.id} className="overflow-hidden">
                  {receipt.nftImageUrl && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={receipt.nftImageUrl} 
                        alt={`Receipt from ${receipt.merchantName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{receipt.merchantName}</CardTitle>
                      <Badge variant={
                        receipt.status === 'claimed' ? 'default' :
                        receipt.status === 'pending' ? 'outline' : 'secondary'
                      }>
                        {receipt.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {receipt.date} - ${receipt.total.toFixed(2)}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button 
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        setSelectedReceipt(receipt);
                        setShowReceiptDetails(true);
                      }}
                    >
                      <InfoIcon className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>No Receipts Found</CardTitle>
                <CardDescription>
                  You haven't added any receipts to your BlockReceipt collection yet.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-12">
                <Button onClick={() => setLocation('/scan')}>
                  <ReceiptIcon className="mr-2 h-4 w-4" />
                  Scan Your First Receipt
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="claimed" className="mt-0">
          {/* Filtered view for claimed receipts */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : receipts.filter((r: Receipt) => r.status === 'claimed').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {receipts
                .filter((receipt: Receipt) => receipt.status === 'claimed')
                .map((receipt: Receipt) => (
                  <Card key={receipt.id} className="overflow-hidden">
                    {receipt.nftImageUrl && (
                      <div className="aspect-video w-full overflow-hidden">
                        <img 
                          src={receipt.nftImageUrl} 
                          alt={`Receipt from ${receipt.merchantName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{receipt.merchantName}</CardTitle>
                        <Badge>Claimed</Badge>
                      </div>
                      <CardDescription>
                        {receipt.date} - ${receipt.total.toFixed(2)}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-2">
                      <Button 
                        variant="secondary"
                        className="w-full"
                        onClick={() => {
                          setSelectedReceipt(receipt);
                          setShowReceiptDetails(true);
                        }}
                      >
                        <InfoIcon className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>No Claimed NFTs</CardTitle>
                <CardDescription>
                  You don't have any claimed BlockReceipt NFTs yet.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-12">
                <Button onClick={() => setLocation('/scan')}>
                  <ReceiptIcon className="mr-2 h-4 w-4" />
                  Scan a Receipt
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          {/* Filtered view for pending receipts */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : receipts.filter((r: Receipt) => r.status === 'pending').length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {receipts
                .filter((receipt: Receipt) => receipt.status === 'pending')
                .map((receipt: Receipt) => (
                  <Card key={receipt.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{receipt.merchantName}</CardTitle>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                      <CardDescription>
                        {receipt.date} - ${receipt.total.toFixed(2)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center">
                        <ShieldIcon className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm text-muted-foreground">NFT minting in progress</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button 
                        variant="secondary"
                        className="w-full"
                        onClick={() => {
                          setSelectedReceipt(receipt);
                          setShowReceiptDetails(true);
                        }}
                      >
                        <InfoIcon className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>No Pending Receipts</CardTitle>
                <CardDescription>
                  You don't have any receipts in the pending state.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {renderReceiptDetails()}
    </div>
  );
}
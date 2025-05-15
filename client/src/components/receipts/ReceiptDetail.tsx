import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Button 
} from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Share, Download, CheckCircle, ShoppingCart, HandPlatter, Shirt, Database, CreditCard } from "lucide-react";
import { format } from "date-fns";
import { getReceiptPaymentInfo } from "@/lib/payments";
import TaskStatusMessage from "@/components/nft/TaskStatusMessage";

// Define the Receipt type
interface FullReceipt {
  id: number;
  merchantName: string;
  date: Date;
  total: string;
  subtotal: string;
  tax: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  merchant: {
    name: string;
    address?: string;
    phone?: string;
  };
  category: {
    name: string;
    color: string;
  };
  paymentComplete?: boolean;
  blockchain?: {
    tokenId?: string;
    verified?: boolean;
    network?: string;
    transactionHash?: string;
    blockNumber?: number;
    receiptHash?: string;
  };
}

const ReceiptDetail: React.FC = () => {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const [showBlockchainInfo, setShowBlockchainInfo] = useState(false);
  const queryClient = useQueryClient();
  const [paymentStatus, setPaymentStatus] = useState<{
    isComplete: boolean;
    method?: string;
    id?: string;
  }>({ isComplete: false });
  const [taskId, setTaskId] = useState<string | null>(null);
  const [nftTokenId, setNftTokenId] = useState<string | null>(null);
  const [nftMintingStatus, setNftMintingStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const { data: receipt, isLoading } = useQuery<FullReceipt>({
    queryKey: [`/api/receipts/${id}`],
  });
  
  // Check payment status when receipt data is loaded
  useEffect(() => {
    if (receipt && id) {
      const checkPayment = async () => {
        try {
          const paymentInfo = await getReceiptPaymentInfo(parseInt(id));
          setPaymentStatus(paymentInfo);
        } catch (error) {
          console.error("Error fetching payment info:", error);
          // If there's an error, assume payment is not complete
          setPaymentStatus({ isComplete: false });
        }
      };
      
      checkPayment();
    }
  }, [receipt, id]);
  
  // Automatically start NFT minting process for the receipt
  useEffect(() => {
    if (receipt && receipt.id && receipt.paymentComplete && !receipt.blockchain?.tokenId) {
      // Start NFT minting process
      startNftMinting();
    } else if (receipt?.blockchain?.tokenId) {
      // Receipt already has a token ID, set completed status
      setNftTokenId(receipt.blockchain.tokenId);
      setNftMintingStatus('completed');
    }
  }, [receipt]);
  
  // Poll for task status updates
  useEffect(() => {
    if (!taskId || nftMintingStatus !== 'processing') return;

    const checkTaskStatus = async () => {
      try {
        const response = await fetch(`/api/task/${taskId}/status`);
        const data = await response.json();
        
        console.log("Task status update:", data);
        
        if (data.status === 'completed' && data.result) {
          setNftMintingStatus('completed');
          setNftTokenId(data.result.tokenId);
          
          // Refresh receipt data to get latest blockchain info
          queryClient.invalidateQueries({ queryKey: [`/api/receipts/${id}`] });
          
        } else if (data.status === 'failed') {
          setNftMintingStatus('failed');
          setError(data.error || 'Failed to create NFT');
        }
      } catch (err) {
        console.error("Error checking task status:", err);
      }
    };

    // Initial check
    checkTaskStatus();
    
    // Set up polling interval
    const interval = setInterval(checkTaskStatus, 5000);
    
    // Clean up
    return () => clearInterval(interval);
  }, [taskId, nftMintingStatus, id, queryClient]);
  
  // Navigate to checkout page
  const handlePayNow = () => {
    if (!receipt) return;
    
    // Navigate to checkout with receipt ID and amount
    navigate(`/checkout?receipt=${id}&amount=${receipt.total}`);
  };
  
  // Start NFT minting process
  const startNftMinting = async () => {
    if (!id) return;
    
    try {
      setNftMintingStatus('processing');
      
      // Call the mint endpoint
      const response = await fetch(`/api/blockchain/mint/${id}`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (data.taskId) {
        setTaskId(data.taskId);
      } else if (data.receipt?.blockchain?.tokenId) {
        // Immediate success
        setNftMintingStatus('completed');
        setNftTokenId(data.receipt.blockchain.tokenId);
        queryClient.invalidateQueries({ queryKey: [`/api/receipts/${id}`] });
      }
    } catch (error) {
      console.error("Error starting NFT minting:", error);
      setNftMintingStatus('failed');
      setError("Failed to start NFT minting process");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto my-10 p-6 text-center">
        <p>Loading receipt...</p>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="max-w-md mx-auto my-10 p-6 text-center">
        <p>Receipt not found</p>
      </div>
    );
  }

  const getCategoryIcon = () => {
    switch (receipt.category.name.toLowerCase()) {
      case "groceries":
        return <ShoppingCart className="text-primary" />;
      case "dining":
        return <HandPlatter className="text-secondary" />;
      case "clothing":
        return <Shirt className="text-accent" />;
      default:
        return <ShoppingCart className="text-primary" />;
    }
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "MMMM d, yyyy • h:mm a");
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-4">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-${receipt.category.color.split('#')[1]}-100 rounded-lg flex items-center justify-center`}>
              {getCategoryIcon()}
            </div>
            <div>
              <h3 className="font-medium text-dark">{receipt.merchant.name}</h3>
              <p className="text-xs text-gray-500">{formatDate(receipt.date)}</p>
            </div>
          </div>
          
          <div className="receipt-paper bg-gray-50 rounded-lg p-4 mt-4">
            <div className="text-center mb-4">
              <h5 className="font-medium">{receipt.merchant.name}</h5>
              {receipt.merchant.address && (
                <p className="text-xs text-gray-500">{receipt.merchant.address}</p>
              )}
              {receipt.merchant.phone && (
                <p className="text-xs text-gray-500">Tel: {receipt.merchant.phone}</p>
              )}
            </div>
            
            <div className="border-t border-dashed border-gray-300 pt-3 mb-3">
              {receipt.items.map((item: {name: string; quantity: number; price: string}, index: number) => (
                <div key={index} className="flex justify-between text-xs mb-2">
                  <span>{item.name} {item.quantity > 1 ? `(${item.quantity})` : ''}</span>
                  <span>${parseFloat(item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-dashed border-gray-300 pt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Subtotal</span>
                <span>${parseFloat(receipt.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span>Tax</span>
                <span>${parseFloat(receipt.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium mt-2">
                <span>Total</span>
                <span>${parseFloat(receipt.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {!receipt.paymentComplete && (
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              onClick={() => navigate(`/checkout?receipt=${receipt.id}&amount=${receipt.total}`)}
            >
              <div className="flex items-center justify-center w-full">
                <CreditCard className="mr-2 h-5 w-5" />
                <span>Pay Now</span>
              </div>
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className={`w-full mt-4 ${receipt.blockchain?.verified ? 'bg-blue-50 border-blue-100 text-primary hover:bg-blue-100' : ''}`}
            onClick={() => setShowBlockchainInfo(true)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                {receipt.blockchain?.verified ? (
                  <>
                    <div className="mr-2 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="text-success" size={12} />
                    </div>
                    <span>Blockchain Verified</span>
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-5 w-5 text-primary" />
                    <span>Blockchain Options</span>
                  </>
                )}
              </div>
              <span className="text-xs">View Details</span>
            </div>
          </Button>
        </CardContent>
        
        <CardFooter className="flex flex-wrap justify-between gap-2 p-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share className="mr-2 h-4 w-4" /> Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>
          
          <div>
            {paymentStatus.isComplete ? (
              <Button variant="outline" size="sm" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800">
                <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Payment Complete
              </Button>
            ) : (
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90"
                onClick={handlePayNow}
              >
                <CreditCard className="mr-2 h-4 w-4" /> Pay Now
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <Dialog open={showBlockchainInfo} onOpenChange={setShowBlockchainInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Blockchain Information</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <TaskStatusMessage 
              status={nftMintingStatus}
              tokenId={nftTokenId || undefined}
              error={error || undefined}
            />
            
            {receipt?.blockchain && (
              <div className="space-y-2 mt-4">
                <h4 className="font-medium">Network Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Network</div>
                  <div>{receipt.blockchain.network || "Polygon Amoy"}</div>
                  <div className="text-muted-foreground">Token ID</div>
                  <div>{receipt.blockchain.tokenId || "Not minted yet"}</div>
                  {receipt.blockchain.transactionHash && (
                    <>
                      <div className="text-muted-foreground">Transaction</div>
                      <div className="truncate">{receipt.blockchain.transactionHash}</div>
                    </>
                  )}
                  {receipt.blockchain.blockNumber && (
                    <>
                      <div className="text-muted-foreground">Block #</div>
                      <div>{receipt.blockchain.blockNumber}</div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {nftMintingStatus === 'idle' && receipt?.paymentComplete && !receipt?.blockchain?.tokenId && (
              <Button 
                onClick={startNftMinting}
                className="w-full mt-4"
              >
                Mint Receipt NFT
              </Button>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockchainInfo(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReceiptDetail;

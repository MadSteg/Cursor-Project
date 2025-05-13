import React from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
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
import { Share, Download, CheckCircle, ShoppingCart, HandPlatter, Shirt } from "lucide-react";
import { format } from "date-fns";
import { type FullReceipt } from "@shared/schema";
import BlockchainInfo from "@/components/blockchain/BlockchainInfo";

const ReceiptDetail: React.FC = () => {
  const { id } = useParams();
  const [showBlockchainInfo, setShowBlockchainInfo] = React.useState(false);
  
  const { data: receipt, isLoading } = useQuery<FullReceipt>({
    queryKey: [`/api/receipts/${id}`],
  });

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
              {receipt.items.map((item, index) => (
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
          
          <Button 
            variant="outline" 
            className="w-full mt-4 bg-blue-50 border-blue-100 text-primary hover:bg-blue-100"
            onClick={() => setShowBlockchainInfo(true)}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="mr-2 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="text-success" size={12} />
                </div>
                <span>Blockchain Verified</span>
              </div>
              <span className="text-xs">View Details</span>
            </div>
          </Button>
        </CardContent>
        
        <CardFooter className="flex justify-between p-4 border-t">
          <Button variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showBlockchainInfo} onOpenChange={setShowBlockchainInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Blockchain Information</DialogTitle>
          </DialogHeader>
          <BlockchainInfo 
            txHash={receipt.blockchain.txHash || "Processing..."}
            blockNumber={receipt.blockchain.blockNumber}
            verified={receipt.blockchain.verified}
            nftTokenId={receipt.blockchain.nftTokenId}
            timestamp={receipt.date}
          />
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

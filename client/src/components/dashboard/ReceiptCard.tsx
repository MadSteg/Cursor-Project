import React from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Download, Link as LinkIcon } from "lucide-react";
import { format } from "date-fns";
import { type FullReceipt } from "@shared/schema";

interface ReceiptCardProps {
  receipt: FullReceipt;
}

const ReceiptCard: React.FC<ReceiptCardProps> = ({ receipt }) => {
  const iconComponent = () => {
    // This would normally use the actual icon from receipt.category.icon
    // But for simplicity, let's use a switch statement based on category name
    switch (receipt.category.name.toLowerCase()) {
      case "groceries":
        return <i className="ri-shopping-cart-line text-primary"></i>;
      case "dining":
        return <i className="ri-restaurant-line text-secondary"></i>;
      case "clothing":
        return <i className="ri-t-shirt-line text-accent"></i>;
      case "entertainment":
        return <i className="ri-movie-line text-purple-500"></i>;
      case "transportation":
        return <i className="ri-car-line text-pink-500"></i>;
      default:
        return <i className="ri-shopping-bag-line text-gray-500"></i>;
    }
  };

  // Function to format the date
  const formatDate = (dateString: Date) => {
    return format(new Date(dateString), "MMMM d, yyyy • h:mm a");
  };

  // Function to abbreviate blockchain hash
  const abbreviateHash = (hash?: string) => {
    if (!hash) return "pending...";
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition duration-200">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-${receipt.category.color.split('#')[1]}-100 rounded-lg flex items-center justify-center`}>
              {iconComponent()}
            </div>
            <div>
              <h3 className="font-medium text-dark">{receipt.merchant.name}</h3>
              <p className="text-xs text-gray-500">{formatDate(receipt.date)}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-bold text-dark">${parseFloat(receipt.total).toFixed(2)}</span>
            <span 
              className={`text-xs px-2 py-1 bg-${receipt.category.color.split('#')[1]}-100 text-${receipt.category.color.split('#')[1]} rounded-full`}
            >
              {receipt.category.name}
            </span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-100">
              <CheckCircle className="text-success text-xs" size={12} />
            </div>
            <span className="text-xs text-gray-500">
              {receipt.blockchain.verified ? "Verified on blockchain" : "Processing..."}
            </span>
          </div>
          <Link href={`/receipts/${receipt.id}`}>
            <div className="flex items-center text-xs text-primary font-medium cursor-pointer">
              <span>View Items</span>
              <ArrowRight className="ml-1" size={12} />
            </div>
          </Link>
        </div>
        
        <div className="mt-4 receipt-paper bg-gray-50 rounded-lg p-3 h-20 overflow-hidden">
          <div className="text-xs text-gray-500 mb-1">Items: {receipt.items.length}</div>
          {receipt.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex justify-between text-xs mb-1">
              <span>{item.name}</span>
              <span>${parseFloat(item.price).toFixed(2)}</span>
            </div>
          ))}
          {receipt.items.length > 3 && (
            <div className="text-xs text-center text-gray-400 mt-2">+ {receipt.items.length - 3} more items</div>
          )}
          {receipt.items.length <= 3 && (
            <div className="text-xs text-center text-gray-400 mt-2">All items shown</div>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between bg-gray-50">
        <div className="flex items-center space-x-2">
          <LinkIcon className="text-gray-400" size={14} />
          <span className="text-xs text-gray-500 font-mono">{abbreviateHash(receipt.blockchain.txHash)}</span>
        </div>
        <button className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-1 hover:bg-gray-50 flex items-center">
          <Download className="mr-1" size={12} />
          Export
        </button>
      </div>
    </Card>
  );
};

export default ReceiptCard;

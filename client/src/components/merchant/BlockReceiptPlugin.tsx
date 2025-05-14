import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Receipt, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type BlockReceiptPluginProps = {
  merchantId: string;
  orderTotal: number;
  orderDetails: {
    items: Array<{
      name: string;
      price: number;
      quantity: number;
      sku?: string;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    orderId: string;
  };
  onReceiptSelected?: (tier: string, additionalCost: number) => void;
  onComplete?: (receiptData: any) => void;
  apiKey?: string;
  theme?: "light" | "dark" | "auto";
}

// NFT tier options with their features and pricing
const NFT_TIERS = {
  standard: {
    name: "Standard",
    price: 0.99,
    features: ["Basic receipt data", "Blockchain verification", "Digital ownership"],
    appleWalletSupport: false
  },
  premium: {
    name: "Premium",
    price: 2.99,
    features: ["Enhanced receipt details", "Product metadata", "Warranty tracking", "Gift receipts"],
    appleWalletSupport: false
  },
  luxury: {
    name: "Luxury",
    price: 5.00,
    features: ["Premium display effects", "Apple Wallet integration", "Advanced sharing options", "Collectible design"],
    appleWalletSupport: true
  }
};

export default function BlockReceiptPlugin({ 
  merchantId, 
  orderTotal, 
  orderDetails, 
  onReceiptSelected, 
  onComplete,
  apiKey,
  theme = "light" 
}: BlockReceiptPluginProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const { toast } = useToast();

  // Handle tier selection
  const handleSelectTier = (tier: string) => {
    setSelectedTier(tier);
    
    if (onReceiptSelected) {
      onReceiptSelected(tier, NFT_TIERS[tier as keyof typeof NFT_TIERS].price);
    }
  };

  // Process the NFT receipt after selection
  const handleProcessReceipt = async () => {
    if (!selectedTier) return;
    
    setIsProcessing(true);
    
    try {
      // Create receipt request payload
      const payload = {
        merchantId,
        tier: selectedTier,
        orderDetails,
        apiKey // For authentication
      };
      
      // Send request to create NFT receipt
      const response = await apiRequest("POST", "/api/blockchain/create-receipt", payload);
      const data = await response.json();
      
      if (response.ok) {
        setReceiptData(data);
        
        toast({
          title: "Receipt Created!",
          description: `Your blockchain receipt has been created successfully.`,
          variant: "default",
        });
        
        if (onComplete) {
          onComplete(data);
        }
      } else {
        throw new Error(data.message || "Failed to create receipt");
      }
    } catch (error: any) {
      console.error("Error creating receipt:", error);
      
      toast({
        title: "Error Creating Receipt",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Apply theme class
  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // Auto - detect system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme]);

  return (
    <div className="blockreceiptai-plugin font-sans">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardTitle className="flex items-center">
            <Receipt className="mr-2 h-6 w-6" />
            BlockReceipt.ai
          </CardTitle>
          <CardDescription className="text-gray-100">
            Transform your receipt into a digital asset
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6">
          {receiptData ? (
            <div className="text-center p-4">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">Receipt Created!</h3>
              <p className="text-gray-500 mb-4">
                Your digital receipt has been created and stored on the blockchain.
              </p>
              {receiptData.viewUrl && (
                <Button 
                  className="w-full"
                  onClick={() => window.open(receiptData.viewUrl, '_blank')}
                >
                  View Receipt
                </Button>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium mb-4">Add a Blockchain Receipt</h3>
              <div className="space-y-4">
                {Object.entries(NFT_TIERS).map(([tier, details]) => (
                  <motion.div 
                    key={tier}
                    whileHover={{ scale: 1.02 }}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedTier === tier 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleSelectTier(tier)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{details.name} Receipt</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {details.features.join(" • ")}
                        </p>
                      </div>
                      <div className="font-bold text-lg">${details.price.toFixed(2)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        {!receiptData && selectedTier && (
          <CardFooter className="bg-gray-50 dark:bg-gray-800 p-4">
            <Button 
              className="w-full" 
              onClick={handleProcessReceipt}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Processing...
                </div>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Add Receipt (${NFT_TIERS[selectedTier as keyof typeof NFT_TIERS].price.toFixed(2)})
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
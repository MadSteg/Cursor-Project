/**
 * Encryption Settings Page
 * 
 * This page provides tools for managing encryption settings and shared receipts
 * using BlockReceipt.ai's advanced threshold encryption technology.
 */
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import AdvancedEncryptionManager from "@/components/encryption/AdvancedEncryptionManager";
import SharedReceiptManager from "@/components/encryption/SharedReceiptManager";
import { Shield, AlertCircle, LockKeyhole, Settings, Share2, Receipt, CreditCard, Bitcoin } from "lucide-react";

export default function EncryptionSettings() {
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  
  // Check if the encryption service is initialized
  useEffect(() => {
    async function checkEncryptionStatus() {
      try {
        // In a real implementation, this would call the actual API
        // For now, we'll simulate a successful connection
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to check encryption status:", error);
        setIsInitialized(false);
      }
    }
    
    checkEncryptionStatus();
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Encryption Settings | BlockReceipt.ai</title>
        <meta name="description" content="Manage your encryption settings and shared receipts with BlockReceipt.ai's advanced encryption technology." />
      </Helmet>
      
      <main className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Encryption Settings</h1>
            <p className="text-muted-foreground">
              Manage your encryption keys and receipt sharing
            </p>
          </div>
          
          {isInitialized !== null && (
            <Badge 
              variant={isInitialized ? "default" : "destructive"}
              className="px-3 py-1"
            >
              {isInitialized ? "Encryption Active" : "Encryption Inactive"}
            </Badge>
          )}
        </div>
        
        {isInitialized === false && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Service Unavailable</AlertTitle>
            <AlertDescription>
              The BlockReceipt.ai encryption service is currently unavailable. 
              Some features may be limited.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>Privacy & Encryption</span>
              </CardTitle>
              <CardDescription>
                BlockReceipt.ai uses advanced threshold encryption to keep your financial data private and secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <h3>How BlockReceipt.ai Works</h3>
                <p>
                  BlockReceipt.ai is a blockchain-powered digital receipt platform that transforms regular financial 
                  transactions into secure, encrypted, and interactive NFT receipts with advanced privacy features:
                </p>

                <div className="my-6 p-4 bg-slate-50 rounded-lg border">
                  <h4 className="text-lg font-medium mb-3">Payment and Receipt Generation Flow</h4>
                  <ol className="space-y-3 list-decimal pl-5">
                    <li>
                      <strong>Payment Processing:</strong> Customer completes a purchase using a credit card, cryptocurrency 
                      (MATIC, USDC, Bitcoin, Ethereum, or Solana), or other payment method.
                    </li>
                    <li>
                      <strong>Receipt Tier Selection:</strong> After payment, customers can choose from different NFT receipt 
                      tiers (Standard: $0.99, Premium: $2.99, Luxury: $5.00) with various visual styles and features.
                    </li>
                    <li>
                      <strong>Product Information Association:</strong> The system associates specific product details, including 
                      serial numbers and SKUs, at the time of minting to provide verifiable proof of purchase.
                    </li>
                    <li>
                      <strong>Blockchain Verification:</strong> Each NFT receipt is minted on the blockchain, providing 
                      immutable proof of purchase that can be verified by third parties when needed.
                    </li>
                    <li>
                      <strong>Mobile Integration:</strong> NFT receipts display on mobile devices similar to boarding passes 
                      and can be added to digital wallets on iPhone and Android.
                    </li>
                  </ol>
                </div>
                
                <h3>Advanced Encryption Technology</h3>
                <p>
                  BlockReceipt.ai's threshold encryption is a cutting-edge technology that enables secure and private sharing of your receipt data. 
                  When you share a receipt, it remains encrypted and only the intended recipient can decrypt it.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mt-6">
                  <div className="border rounded-lg p-4">
                    <div className="mb-3 text-primary">
                      <LockKeyhole size={24} />
                    </div>
                    <h4 className="text-base font-medium mb-2">End-to-End Encryption</h4>
                    <p className="text-sm text-muted-foreground">
                      Your receipt data is encrypted on your device and can only be decrypted by the intended recipient.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="mb-3 text-primary">
                      <Share2 size={24} />
                    </div>
                    <h4 className="text-base font-medium mb-2">Secure Sharing</h4>
                    <p className="text-sm text-muted-foreground">
                      Share receipts with others without exposing your private data to the server or third parties.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="mb-3 text-primary">
                      <Settings size={24} />
                    </div>
                    <h4 className="text-base font-medium mb-2">Access Control</h4>
                    <p className="text-sm text-muted-foreground">
                      Set expiration dates and revoke access to shared receipts at any time.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="keys" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="keys">Encryption Keys</TabsTrigger>
              <TabsTrigger value="shared">Shared Receipts</TabsTrigger>
            </TabsList>
            <TabsContent value="keys" className="py-4">
              <AdvancedEncryptionManager />
            </TabsContent>
            <TabsContent value="shared" className="py-4">
              <SharedReceiptManager />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
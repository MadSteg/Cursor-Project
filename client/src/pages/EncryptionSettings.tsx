/**
 * Encryption Settings Page
 * 
 * This page provides tools for managing encryption settings and shared receipts
 * using the Taco threshold encryption protocol.
 */
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import TacoKeyManager from "@/components/encryption/TacoKeyManager";
import TacoSharedReceiptManager from "@/components/encryption/TacoSharedReceiptManager";
import { Shield, AlertCircle, LockKeyhole, Settings, Share2 } from "lucide-react";

export default function EncryptionSettings() {
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  
  // Check if the Taco service is initialized
  useEffect(() => {
    async function checkTacoStatus() {
      try {
        const response = await fetch('/api/taco/status');
        if (response.ok) {
          const data = await response.json();
          setIsInitialized(data.initialized);
        } else {
          setIsInitialized(false);
        }
      } catch (error) {
        console.error("Failed to check Taco status:", error);
        setIsInitialized(false);
      }
    }
    
    checkTacoStatus();
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Encryption Settings | MemoryChain</title>
        <meta name="description" content="Manage your encryption settings and shared receipts with Taco threshold encryption." />
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
              Taco {isInitialized ? "Connected" : "Disconnected"}
            </Badge>
          )}
        </div>
        
        {isInitialized === false && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Service Unavailable</AlertTitle>
            <AlertDescription>
              The Taco threshold encryption service is currently unavailable. 
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
                MemoryChain uses advanced Taco threshold encryption to keep your financial data private and secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <h3>How Taco Threshold Encryption Works</h3>
                <p>
                  Taco threshold encryption is a cutting-edge technology that enables secure and private sharing of your receipt data. 
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
              <TacoKeyManager />
            </TabsContent>
            <TabsContent value="shared" className="py-4">
              <TacoSharedReceiptManager />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
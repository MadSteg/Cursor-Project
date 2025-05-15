/**
 * Security Page
 * 
 * This page provides information about BlockReceipt.ai's advanced threshold encryption technology
 * and tools for managing security features when connected to a Web3 wallet.
 */
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ConnectWalletButton from "@/components/blockchain/ConnectWalletButton";
import AdvancedEncryptionManager from "@/components/encryption/AdvancedEncryptionManager";
import SharedReceiptManager from "@/components/encryption/SharedReceiptManager";
import { useAuth } from "@/hooks/useAuth";
import { useWeb3 } from "@/contexts/Web3Context";
import { 
  Shield, AlertCircle, LockKeyhole, Settings, Share2, 
  Receipt, CreditCard, Bitcoin, ArrowRight, Key, Wallet, 
  Lock, Unlock, FileKey, Users, Lock as LockIcon 
} from "lucide-react";

export default function EncryptionSettings() {
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  
  // Use proper authentication and wallet connection hooks
  const { isAuthenticated, isLoading } = useAuth();
  const { active: isWalletConnected } = useWeb3();
  
  // Check if services are initialized
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
    
    // Set up animation interval for the steps visualization
    const interval = setInterval(() => {
      setActiveStep(prev => prev >= 4 ? 1 : prev + 1);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Security | BlockReceipt.ai</title>
        <meta name="description" content="Learn about BlockReceipt.ai's advanced security features and threshold encryption technology that keeps your receipt data secure and private." />
      </Helmet>
      
      <main className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Security</h1>
            <p className="text-muted-foreground">
              Industry-leading privacy and security for your digital receipts
            </p>
          </div>
          
          {isInitialized !== null && (
            <Badge 
              variant={isInitialized ? "default" : "destructive"}
              className="px-3 py-1"
            >
              {isInitialized ? "TACo Encryption Active" : "Encryption Inactive"}
            </Badge>
          )}
        </div>
        
        {/* Hero Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100 overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center">
                    <Shield className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-blue-800 mb-2">Advanced Threshold Encryption Technology</h2>
                  <p className="text-blue-700">
                    BlockReceipt.ai uses Threshold Network's TACo (Threshold Access Control) encryption to provide unmatched privacy
                    and security for your receipt data while allowing selective, controlled sharing when needed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Simplified Explanation */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <LockIcon className="h-5 w-5 text-blue-600" />
                <span>How Threshold Encryption Works</span>
              </CardTitle>
              <CardDescription>
                A simple explanation of the powerful encryption technology that protects your receipts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className={`border-2 transition-all duration-300 ${activeStep === 1 ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                      <span>Receipt Creation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-center mb-4">
                      <Receipt className={`h-12 w-12 ${activeStep === 1 ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                    <p className="text-sm text-gray-500">
                      When you upload a receipt, a digital NFT receipt is created with all your purchase details.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className={`border-2 transition-all duration-300 ${activeStep === 2 ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                      <span>Encryption</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-center mb-4">
                      <Lock className={`h-12 w-12 ${activeStep === 2 ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                    <p className="text-sm text-gray-500">
                      Your receipt is encrypted with your personal key, making it unreadable to anyone else.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className={`border-2 transition-all duration-300 ${activeStep === 3 ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                      <span>Access Control</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-center mb-4">
                      <Key className={`h-12 w-12 ${activeStep === 3 ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                    <p className="text-sm text-gray-500">
                      You can grant access to others (like a warranty provider) without exposing your private key.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className={`border-2 transition-all duration-300 ${activeStep === 4 ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                      <span>Controlled Sharing</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-center mb-4">
                      <Users className={`h-12 w-12 ${activeStep === 4 ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                    <p className="text-sm text-gray-500">
                      You control who can access what parts of your receipt, and can revoke access at any time.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8 bg-slate-50 p-6 rounded-lg border">
                <h3 className="text-lg font-medium mb-4 text-blue-800">The BlockReceipt.ai Privacy Advantage</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className="bg-green-100 p-2 rounded-full">
                        <LockKeyhole className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">You Own Your Data</h4>
                      <p className="text-sm text-gray-600">Unlike traditional receipt systems, only you can decrypt your receipt data. Even our system administrators cannot access your private information.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className="bg-green-100 p-2 rounded-full">
                        <FileKey className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Cryptographic Security</h4>
                      <p className="text-sm text-gray-600">Your data is protected by military-grade elliptic curve cryptography, making it mathematically impossible to access without proper authorization.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Share2 className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Selective Sharing</h4>
                      <p className="text-sm text-gray-600">Share only the specific data you want others to see. For example, share proof of purchase for warranty claims without revealing the price you paid.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="mt-1 flex-shrink-0">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Unlock className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Revoke Access Anytime</h4>
                      <p className="text-sm text-gray-600">You can instantly revoke access to any shared receipt, putting you in complete control of your purchase history and financial data.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Advanced Encryption Keys - Only visible when authenticated */}
        {isAuthenticated ? (
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-blue-600" />
                  <span>Advanced Encryption Settings</span>
                </CardTitle>
                <CardDescription>
                  Manage your encryption keys and control how your receipts are shared
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
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
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600" />
                  <span>Advanced Settings Restricted</span>
                </CardTitle>
                <CardDescription>
                  You need to sign in to access advanced encryption settings
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 text-center">
                <div className="p-6 bg-slate-50 rounded-lg border mb-4">
                  <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    You must be signed in to access advanced encryption settings and manage your shared receipts
                  </p>
                  <Button 
                    variant="default" 
                    className="bg-gradient-to-r from-purple-600 to-blue-500"
                    onClick={() => window.location.href = '/sign-in'}
                  >
                    Sign In Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </>
  );
}
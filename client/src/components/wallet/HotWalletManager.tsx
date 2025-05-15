/**
 * Hot Wallet Manager Component
 * 
 * This component provides UI for managing TACo encrypted hot wallets.
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useHotWallet } from '@/hooks/useHotWallet';
import { AlertCircle, Copy, Eye, EyeOff, Key, RefreshCw, CheckCircle, Loader2 } from 'lucide-react';

interface HotWalletManagerProps {
  title?: string;
  description?: string;
  autoGenerate?: boolean;
}

export function HotWalletManager({
  title = "Wallet Manager",
  description = "Generate and manage TACo encrypted hot wallets",
  autoGenerate = false
}: HotWalletManagerProps) {
  const { toast } = useToast();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const { 
    wallet, 
    isLoading,
    isGenerating,
    generateWallet, 
    exportWallet
  } = useHotWallet({ autoGenerate });

  const handleCopyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleCopyPrivateKey = () => {
    if (wallet?.privateKey) {
      navigator.clipboard.writeText(wallet.privateKey);
      toast({
        title: "Private Key Copied",
        description: "Warning: Keep your private key secret",
        variant: "destructive",
      });
    }
  };

  const handleGenerateWallet = async () => {
    try {
      setGenerationError(null);
      await generateWallet();
      toast({
        title: "Wallet Generated",
        description: "Your new hot wallet has been created and encrypted with TACo",
      });
    } catch (error) {
      console.error("Error generating hot wallet:", error);
      setGenerationError("Failed to generate wallet. Please try again.");
      toast({
        title: "Generation Failed",
        description: "Could not generate wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading wallet...</span>
          </div>
        ) : wallet ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Wallet Address</label>
                <div className="flex">
                  <Input 
                    readOnly 
                    value={wallet.address || ''} 
                    className="font-mono text-sm flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleCopyAddress}
                    className="ml-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Your public blockchain address</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium">Private Key</label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowPrivateKey(!showPrivateKey)} 
                    className="h-6 px-2"
                  >
                    {showPrivateKey ? (
                      <><EyeOff className="h-3 w-3 mr-1" /> Hide</>
                    ) : (
                      <><Eye className="h-3 w-3 mr-1" /> Show</>
                    )}
                  </Button>
                </div>
                <div className="flex">
                  <Input 
                    type={showPrivateKey ? "text" : "password"} 
                    readOnly 
                    value={wallet.privateKey || ''} 
                    className="font-mono text-sm flex-1"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleCopyPrivateKey}
                    className="ml-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">TACo encrypted with threshold cryptography</p>
              </div>
              
              <div>
                <div className="rounded-md bg-blue-50 p-3 mt-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                      <p className="text-sm text-blue-700">
                        Your wallet is secured with TACo threshold encryption
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-4">
            {generationError ? (
              <div className="rounded-md bg-red-50 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Generation Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{generationError}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center bg-muted/50 rounded-lg p-6 flex flex-col items-center">
                <Key className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No Hot Wallet Found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate a new hot wallet for fast, secure transactions.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={handleGenerateWallet}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : wallet ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate Wallet
            </>
          ) : (
            <>
              <Key className="mr-2 h-4 w-4" />
              Generate Hot Wallet
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
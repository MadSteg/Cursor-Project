/**
 * Hot Wallet Manager Component
 * 
 * This component provides UI for managing TACo encrypted hot wallets.
 */
import { useState } from 'react';
import { useHotWallet } from '@/hooks/useHotWallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Copy, Key, RefreshCw, ShieldCheck } from 'lucide-react';

interface HotWalletManagerProps {
  title?: string;
  description?: string;
  autoGenerate?: boolean;
}

export function HotWalletManager({
  title = 'Secure Hot Wallet',
  description = 'Your blockchain wallet is protected with TACo threshold encryption',
  autoGenerate = false
}: HotWalletManagerProps) {
  const {
    hotWalletAddress,
    tacoKey,
    isGenerating,
    error,
    generateWallet,
    recoverWalletPrivateKey,
    hasHotWallet
  } = useHotWallet({ autoGenerate });
  
  const [isRecovering, setIsRecovering] = useState(false);
  const [tacoPrivateKey, setTacoPrivateKey] = useState('');
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  
  // Handle wallet generation
  const handleGenerateWallet = () => {
    generateWallet();
  };
  
  // Handle wallet recovery
  const handleRecoverWallet = async () => {
    if (!tacoPrivateKey) {
      return;
    }
    
    setIsRecovering(true);
    const key = await recoverWalletPrivateKey(tacoPrivateKey);
    
    if (key) {
      setPrivateKey(key);
    }
    
    setIsRecovering(false);
  };
  
  // Handle copying text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {hasHotWallet ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="wallet-address">Wallet Address</Label>
              <div className="flex">
                <Input
                  id="wallet-address"
                  value={hotWalletAddress || ''}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={() => hotWalletAddress && copyToClipboard(hotWalletAddress)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {tacoKey && (
              <div className="space-y-2">
                <Label htmlFor="taco-key">TACo Public Key</Label>
                <div className="flex">
                  <Input
                    id="taco-key"
                    value={tacoKey}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => copyToClipboard(tacoKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {!privateKey ? (
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="taco-private-key">
                  Recover Private Key with TACo Private Key
                </Label>
                <Input
                  id="taco-private-key"
                  value={tacoPrivateKey}
                  onChange={(e) => setTacoPrivateKey(e.target.value)}
                  placeholder="Enter your TACo private key"
                  className="font-mono text-sm"
                />
                <Button
                  onClick={handleRecoverWallet}
                  disabled={!tacoPrivateKey || isRecovering}
                  className="w-full mt-2"
                >
                  {isRecovering ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Recovering...
                    </>
                  ) : (
                    <>
                      <Key className="mr-2 h-4 w-4" />
                      Recover Private Key
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-2 pt-4 border-t">
                <Label htmlFor="private-key">Wallet Private Key</Label>
                <div className="flex">
                  <Input
                    id="private-key"
                    value={privateKey}
                    readOnly
                    className="flex-1 font-mono text-sm"
                    type="password"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => copyToClipboard(privateKey)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Never share your private key with anyone. It provides full access to your wallet.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4 py-4">
            <div className="text-center text-muted-foreground">
              No hot wallet found. Generate a new one to get started.
            </div>
            
            <Button
              onClick={handleGenerateWallet}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Generate Hot Wallet
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Protected with TACo threshold encryption
        </p>
      </CardFooter>
    </Card>
  );
}
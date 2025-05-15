/**
 * Hot Wallet Settings Page
 * 
 * This page allows users to manage their TACo encrypted hot wallets.
 */
import HotWalletManager from '@/components/wallet/HotWalletManager';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';
import { Shield, Info, Wallet, LockKeyhole } from 'lucide-react';
import { Link } from 'wouter';

export default function HotWalletSettingsPage() {
  const { toast } = useToast();
  const { isConnected, connect, shortDisplayAddress } = useWeb3Wallet();
  
  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect your wallet. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold">Wallet Settings</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Manage your BlockReceipt hot wallet with industry-leading TACo threshold encryption. 
            Your wallet private key is secured and can be accessed across multiple devices.
          </p>
        </header>
        
        {!isConnected ? (
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Connect your Web3 wallet to access secure hot wallet generation with threshold encryption.
            </p>
            <Button size="lg" onClick={handleConnectWallet}>
              Connect Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="bg-primary/5 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <LockKeyhole className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">TACo Encrypted Wallet</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    BlockReceipt uses TACo (Threshold Access Control) encryption to protect your
                    hot wallet's private key. This provides a secure, cross-device experience without compromising security.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/encryption-settings">
                      <Button variant="outline">
                        <Shield className="mr-2 h-4 w-4" />
                        Security Settings
                      </Button>
                    </Link>
                    <Link href="https://threshold.network/taco" target="_blank">
                      <Button variant="outline">
                        <Info className="mr-2 h-4 w-4" />
                        About TACo Encryption
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-3">Connected Wallet</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{shortDisplayAddress}</p>
                      <p className="text-sm text-muted-foreground">Currently Connected</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your wallet address is used to verify NFT receipts ownership and access encrypted metadata.
                  </p>
                </div>
              </div>
              
              <div className="flex-1">
                <HotWalletManager 
                  title="BlockReceipt Hot Wallet"
                  description="Generate a TACo encrypted hot wallet for quick transactions"
                  autoGenerate={false}
                />
              </div>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-medium text-amber-800 mb-2">Hot Wallet Security</h3>
                  <p className="text-amber-700 mb-2">
                    Your hot wallet's private key is encrypted using threshold cryptography. 
                    This allows you to access it across devices without compromising security.
                  </p>
                  <ul className="list-disc list-inside text-amber-700 text-sm space-y-1">
                    <li>Never share your TACo private key with anyone</li>
                    <li>Keep a backup of your TACo private key in a secure location</li>
                    <li>Your hot wallet private key is protected even if our servers are compromised</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
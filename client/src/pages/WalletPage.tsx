import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, ChevronRight, Coins, Wallet, ExternalLink } from "lucide-react";
import ConnectWalletButton from "@/components/blockchain/ConnectWalletButton";
import { useWeb3Wallet } from "@/hooks/useWeb3Wallet";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { ethers } from "ethers";

export default function WalletPage() {
  const { walletInfo, loading, generateHotWallet, connectToHotWallet } = useWeb3Wallet();
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateWallet = async () => {
    try {
      setGenerating(true);
      const address = await generateHotWallet();
      if (address) {
        toast({
          title: "Hot Wallet Created",
          description: `Your new wallet ${address.substring(0, 8)}... is ready to use`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error generating wallet:", error);
      toast({
        title: "Wallet Generation Failed",
        description: "Could not generate a new hot wallet",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const connectHotWallet = async () => {
    try {
      setGenerating(true);
      const address = await connectToHotWallet();
      if (address) {
        toast({
          title: "Hot Wallet Connected",
          description: `Connected to your hot wallet ${address.substring(0, 8)}...`,
          variant: "default",
        });
      } else {
        // No hot wallet found, ask if they want to generate one
        const confirmed = window.confirm("No hot wallet found. Would you like to generate one?");
        if (confirmed) {
          await handleGenerateWallet();
        }
      }
    } catch (error) {
      console.error("Error connecting to hot wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to hot wallet",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  // Format balance with ethers.js utils
  const formatBalance = (balanceStr: string | null) => {
    if (!balanceStr) return "0";
    try {
      // Format MATIC balance to display with 4 decimal places
      return ethers.utils.formatUnits(balanceStr, 18);
    } catch (e) {
      return balanceStr;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Wallet Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Connect External Wallet Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              External Wallet
            </CardTitle>
            <CardDescription>
              Connect your MetaMask or other Web3 wallet to use with BlockReceipt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-6 flex flex-col items-center justify-center">
              {walletInfo.connected ? (
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Connected</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {walletInfo.address}
                  </p>
                  {walletInfo.balance && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Coins className="h-4 w-4" />
                      <span>{formatBalance(walletInfo.balance)} MATIC</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center text-muted-foreground mb-4">
                  No wallet connected. Connect your external wallet to view and manage receipts.
                </p>
              )}
              <ConnectWalletButton variant="outline" showBalance showNetwork />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open("https://metamask.io/download/", "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Get MetaMask
            </Button>
            {walletInfo.connected && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`https://amoy.polygonscan.com/address/${walletInfo.address}`, "_blank")}
              >
                View on Explorer
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Hot Wallet Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Hot Wallet
            </CardTitle>
            <CardDescription>
              Generate or connect to a TACo encrypted hot wallet stored in your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-6 flex flex-col items-center justify-center">
              {walletInfo.isHotWallet ? (
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Hot Wallet Active</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {walletInfo.address}
                  </p>
                  {walletInfo.balance && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Coins className="h-4 w-4" />
                      <span>{formatBalance(walletInfo.balance)} MATIC</span>
                    </div>
                  )}
                  <div className="flex items-center justify-center bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm p-2 rounded">
                    <Shield className="h-4 w-4 mr-2" />
                    Protected with TACo Encryption
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground mb-4">
                  No hot wallet detected. Generate a new one or connect to an existing hot wallet.
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={connectHotWallet}
              disabled={generating || loading}
            >
              {generating || loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Hot Wallet
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={handleGenerateWallet}
              disabled={generating || loading}
            >
              {generating || loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Generating...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Generate New
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Features Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Wallet Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Polygon Network</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our system uses Polygon's Amoy testnet for cost-effective and fast transactions, with
                automatic network switching.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>TACo Encryption</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Hot wallets are secured with Threshold Cryptography for enhanced security and
                privacy while maintaining your control.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>NFT Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect your wallet to mint purchase receipts as unique NFTs, allowing for verified
                ownership and warranty tracking.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Warning */}
      <div className="mt-12 p-6 border border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/30 rounded-lg">
        <h3 className="text-xl font-bold text-yellow-700 dark:text-yellow-400 mb-2">Important Note</h3>
        <p className="text-yellow-700 dark:text-yellow-400">
          BlockReceipt is currently running on the Polygon Amoy testnet. All transactions are for testing purposes only. 
          No real value is transferred during transactions.
        </p>
      </div>
    </div>
  );
}
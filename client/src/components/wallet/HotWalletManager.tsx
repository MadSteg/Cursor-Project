import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { ethers } from 'ethers';

interface HotWalletManagerProps {
  userId?: number;
  onWalletCreated?: (address: string) => void;
}

export default function HotWalletManager({ userId, onWalletCreated }: HotWalletManagerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch wallet info on component mount if userId is available
  useEffect(() => {
    if (userId) {
      fetchWalletInfo();
    }
  }, [userId]);

  // Fetch wallet info from the server
  const fetchWalletInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('GET', '/api/wallet/my-wallet');
      const data = await response.json();
      
      if (data.success && data.wallet) {
        setWalletAddress(data.wallet.address);
        fetchWalletBalance(data.wallet.address);
      }
    } catch (error: any) {
      // Don't set error for 404 (no wallet)
      if (error.status !== 404) {
        setError(error.message || 'Failed to fetch wallet info');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch wallet balance from the server
  const fetchWalletBalance = async (address: string) => {
    try {
      const response = await apiRequest('GET', `/api/wallet/balance/${address}`);
      const data = await response.json();
      
      if (data.success) {
        // Convert wei to ETH for display
        const balanceInEth = ethers.utils.formatEther(data.balance);
        setBalance(balanceInEth);
      }
    } catch (error: any) {
      console.error('Error fetching wallet balance:', error);
      // Don't show error toast for balance issues
    }
  };

  // Generate a new hot wallet
  const generateWallet = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would generate a TACo public key here
      // For this demo, we'll use a placeholder
      const tacoPublicKey = 'demo-taco-public-key-' + Date.now();
      
      const response = await apiRequest('POST', '/api/wallet/generate', {
        tacoPublicKey,
      });
      
      const data = await response.json();
      
      if (!data.success || !data.wallet) {
        throw new Error(data.error || 'Failed to generate wallet');
      }
      
      setWalletAddress(data.wallet.address);
      fetchWalletBalance(data.wallet.address);
      
      toast({
        title: 'Wallet Generated',
        description: 'Your Polygon hot wallet has been created successfully',
      });
      
      if (onWalletCreated) {
        onWalletCreated(data.wallet.address);
      }
    } catch (error: any) {
      console.error('Wallet generation error:', error);
      setError(error.message || 'Failed to generate wallet');
      toast({
        title: 'Wallet Generation Failed',
        description: error.message || 'An error occurred while generating your wallet',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-500 text-white">
        <CardTitle>Polygon Hot Wallet</CardTitle>
        <CardDescription className="text-white text-opacity-80">
          Securely manage your BlockReceipt hot wallet
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : walletAddress ? (
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="text-sm font-medium text-gray-500">Address</div>
              <div className="mt-1 font-mono text-sm break-all">{walletAddress}</div>
            </div>
            
            <div className="rounded-md border p-4">
              <div className="text-sm font-medium text-gray-500">Balance</div>
              <div className="mt-1 flex items-baseline">
                <span className="text-2xl font-bold">{balance ? parseFloat(balance).toFixed(6) : '0.00'}</span>
                <span className="ml-1 text-sm text-gray-500">MATIC</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                ⚡ This wallet is on the Polygon network for low-cost transactions
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <p className="text-center text-sm text-gray-600">
              You don't have a hot wallet yet. Generate one to easily manage your BlockReceipts.
            </p>
            
            <div className="rounded-md bg-gray-50 p-4 border border-gray-100">
              <h4 className="text-sm font-medium">Why use a hot wallet?</h4>
              <ul className="mt-2 text-xs text-gray-600 space-y-1 list-disc pl-4">
                <li>Fast access to your BlockReceipts</li>
                <li>Extremely low transaction fees on Polygon</li>
                <li>Securely encrypted with TACo threshold encryption</li>
                <li>Compatible with all Ethereum/Polygon applications</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between bg-gray-50 border-t">
        {walletAddress ? (
          <div className="text-xs text-gray-500">
            📍 Polygon Network • Chain ID: 137
          </div>
        ) : (
          <Button
            onClick={generateWallet}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white"
          >
            {loading ? <Spinner className="mr-2" /> : null}
            Generate Hot Wallet
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
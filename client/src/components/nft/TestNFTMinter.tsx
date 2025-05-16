import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { apiRequest } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';

/**
 * TestNFTMinter - A component for testing NFT minting in development environment
 * This allows users to mint test NFTs without real blockchain transactions
 */
const TestNFTMinter: React.FC = () => {
  const { toast } = useToast();
  const { account, isConnected } = useWallet();
  const [merchantName, setMerchantName] = useState('Test Store');
  const [total, setTotal] = useState(99.99);
  const [category, setCategory] = useState('electronics');
  const [isLoading, setIsLoading] = useState(false);
  const [mintedNFT, setMintedNFT] = useState<any>(null);

  const handleMintTestNFT = async () => {
    if (!isConnected || !account) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet first to mint test NFTs',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Create receipt data for the test NFT
      const receiptData = {
        merchantName,
        date: new Date().toISOString(),
        total,
        category
      };

      // Make request to mint a test NFT
      const response = await apiRequest('POST', '/api/mint-test-nft', {
        nftId: `test-${Date.now()}`, // Create a unique ID for this test NFT
        walletAddress: account,
        receiptData
      });

      const result = await response.json();

      if (result.success) {
        setMintedNFT(result.nft);
        
        toast({
          title: 'NFT minted successfully',
          description: `Test NFT "${result.nft.name}" has been minted to your wallet`,
          variant: 'default'
        });
      } else {
        throw new Error(result.message || 'Failed to mint test NFT');
      }
    } catch (error: any) {
      console.error('Error minting test NFT:', error);
      toast({
        title: 'Minting failed',
        description: error.message || 'Something went wrong while minting the test NFT',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto my-6">
      <CardHeader>
        <CardTitle>Mint Test NFT</CardTitle>
        <CardDescription>
          Create test NFTs for development without actual blockchain transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="merchantName">Merchant Name</Label>
          <Input
            id="merchantName"
            value={merchantName}
            onChange={(e) => setMerchantName(e.target.value)}
            placeholder="Enter merchant name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="total">Total Amount</Label>
          <Input
            id="total"
            type="number"
            value={total}
            onChange={(e) => setTotal(parseFloat(e.target.value))}
            placeholder="Enter total amount"
            step="0.01"
            min="0"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Receipt Category</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="electronics">Electronics</option>
            <option value="food">Food</option>
            <option value="clothing">Clothing</option>
            <option value="travel">Travel</option>
            <option value="entertainment">Entertainment</option>
            <option value="luxury">Luxury</option>
            <option value="other">Other</option>
          </select>
        </div>

        {mintedNFT && (
          <div className="mt-4 p-4 bg-secondary/20 rounded-md">
            <h4 className="font-semibold mb-2">Minted NFT Details</h4>
            <p><span className="font-medium">Token ID:</span> {mintedNFT.tokenId}</p>
            <p><span className="font-medium">Name:</span> {mintedNFT.name}</p>
            <p><span className="font-medium">Transaction:</span> {mintedNFT.transactionHash.substring(0, 10)}...</p>
            {mintedNFT.imageUrl && (
              <div className="mt-2">
                <img 
                  src={mintedNFT.imageUrl} 
                  alt={mintedNFT.name}
                  className="w-24 h-24 object-cover rounded-md mx-auto my-2" 
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleMintTestNFT}
          disabled={isLoading || !isConnected}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Minting...
            </>
          ) : (
            'Mint Test NFT'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestNFTMinter;
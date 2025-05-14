import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ReceiptVerification } from '@/components/receipts/ReceiptVerification';

// Validation schema
const verifyFormSchema = z.object({
  contractAddress: z.string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format'),
  tokenId: z.string()
    .refine(value => !isNaN(Number(value)), 'Token ID must be a number')
    .transform(value => Number(value)),
  network: z.enum(['amoy', 'mumbai', 'polygon', 'ethereum'])
});

type VerifyFormValues = z.infer<typeof verifyFormSchema>;

export default function VerifyReceipt() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [verificationResult, setVerificationResult] = useState<{
    contractAddress: string;
    tokenId: number;
    receiptType: string;
    timestamp: number;
    revoked: boolean;
    network: 'amoy' | 'mumbai' | 'polygon' | 'ethereum';
  } | null>(null);

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: {
      contractAddress: process.env.RECEIPT_NFT_CONTRACT_ADDRESS || '',
      tokenId: undefined,
      network: 'amoy'
    }
  });

  async function onSubmit(data: VerifyFormValues) {
    try {
      // In a real implementation, this would make a call to the blockchain
      // to fetch the actual receipt data
      
      // Simulate a network delay
      toast({
        title: "Verifying...",
        description: "Checking the blockchain for this receipt token."
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we're simulating a response
      const isRevoked = Math.random() > 0.8; // 20% chance of being revoked for demo
      
      setVerificationResult({
        contractAddress: data.contractAddress,
        tokenId: data.tokenId,
        receiptType: ['standard', 'premium', 'luxury'][Math.floor(Math.random() * 3)],
        timestamp: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 30 * 24 * 60 * 60), // Random time in the last 30 days
        revoked: isRevoked,
        network: data.network
      });
      
      if (isRevoked) {
        toast({
          title: "Receipt Verified - Revoked",
          description: "This receipt token has been found on-chain but is marked as revoked.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Receipt Verified - Valid",
          description: "This receipt token has been successfully verified on-chain.",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "Unable to verify this receipt. Please check the contract address and token ID.",
        variant: "destructive"
      });
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Verify Receipt NFT</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Receipt Verification</CardTitle>
            <CardDescription>
              Enter contract address and token ID to verify a receipt NFT
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="contractAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Address</FormLabel>
                      <FormControl>
                        <Input placeholder="0x..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tokenId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token ID</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Token ID" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="network"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blockchain Network</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select network" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="amoy">Polygon Amoy (Testnet)</SelectItem>
                          <SelectItem value="mumbai">Polygon Mumbai (Testnet)</SelectItem>
                          <SelectItem value="polygon">Polygon Mainnet</SelectItem>
                          <SelectItem value="ethereum">Ethereum Mainnet</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">Verify Receipt</Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">How verification works:</p>
              <ol className="list-decimal pl-5 mt-2 space-y-1">
                <li>Enter the contract address and token ID of the receipt NFT</li>
                <li>The system queries the blockchain to verify the token exists</li>
                <li>The receipt's validity and metadata are retrieved and displayed</li>
                <li>You can view the full transaction history on the blockchain explorer</li>
              </ol>
            </div>
          </CardFooter>
        </Card>
        
        <div>
          {verificationResult ? (
            <ReceiptVerification
              receiptId={verificationResult.tokenId}
              contractAddress={verificationResult.contractAddress}
              tokenId={verificationResult.tokenId}
              receiptType={verificationResult.receiptType}
              revoked={verificationResult.revoked}
              timestamp={verificationResult.timestamp}
              network={verificationResult.network}
            />
          ) : (
            <Card className="h-full flex flex-col justify-center items-center p-8">
              <div className="text-center space-y-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-8 w-8 text-primary" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">Verification Results</h3>
                <p className="text-muted-foreground">
                  Enter the receipt details on the left and click "Verify Receipt" to see the verification results here.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
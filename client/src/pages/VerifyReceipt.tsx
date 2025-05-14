/**
 * Verify Receipt Page
 * 
 * This page allows users to verify a receipt NFT by its token ID
 * and view its metadata if they have access.
 */

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation, Link } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest } from '@/lib/queryClient';
import { 
  getTokenMetadata, 
  checkMetadataAccess, 
  grantMetadataAccess, 
  revokeMetadataAccess, 
  getMetadataAccessList 
} from '@/lib/metadataEncryptionService';
import { EnhancedNFTReceiptCard } from '@/components/receipts/EnhancedNFTReceiptCard';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, ArrowLeft, ShieldCheck, Lock, FileBox, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

// Form schema for verification
const verifyFormSchema = z.object({
  tokenId: z.string().min(1, { message: "Token ID is required" }),
});

// Form schema for requesting access
const accessRequestSchema = z.object({
  walletAddress: z.string().min(1, { message: "Wallet address is required" }),
});

type VerifyFormValues = z.infer<typeof verifyFormSchema>;
type AccessRequestValues = z.infer<typeof accessRequestSchema>;

// Status type for verification process
type VerificationStatus = 'initial' | 'loading' | 'success' | 'error' | 'no-access';

export default function VerifyReceipt() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(
    params.tokenId ? 'loading' : 'initial'
  );
  const [tokenId, setTokenId] = useState<string>(params.tokenId || '');
  const [userWalletAddress, setUserWalletAddress] = useState<string>('');
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  
  // Forms
  const verifyForm = useForm<VerifyFormValues>({
    resolver: zodResolver(verifyFormSchema),
    defaultValues: {
      tokenId: params.tokenId || '',
    },
  });
  
  const accessRequestForm = useForm<AccessRequestValues>({
    resolver: zodResolver(accessRequestSchema),
    defaultValues: {
      walletAddress: '',
    },
  });
  
  // Query for receipt data if tokenId is provided
  const { 
    data: receiptData, 
    isLoading: isLoadingReceipt,
    refetch: refetchReceipt
  } = useQuery({
    queryKey: ['receipt', tokenId],
    queryFn: async () => {
      if (!tokenId) return null;
      
      try {
        // Check if this is a valid token ID first
        const validationResponse = await apiRequest('GET', `/api/nft-receipts/validate/${tokenId}`);
        
        if (!validationResponse.ok) {
          setVerificationStatus('error');
          return null;
        }
        
        // Get metadata with possible access
        const metadata = await getTokenMetadata(tokenId);
        
        // Set verification status
        if (metadata.data) {
          setVerificationStatus(metadata.hasFullAccess ? 'success' : 'no-access');
        } else {
          setVerificationStatus('error');
        }
        
        return metadata;
      } catch (error) {
        console.error('Error fetching receipt:', error);
        setVerificationStatus('error');
        return null;
      }
    },
    enabled: !!tokenId,
  });
  
  // Query for access list if tokenId is provided
  const { 
    data: accessList,
    isLoading: isLoadingAccessList,
    refetch: refetchAccessList
  } = useQuery({
    queryKey: ['access-list', tokenId],
    queryFn: async () => {
      if (!tokenId) return [];
      
      try {
        return await getMetadataAccessList(tokenId);
      } catch (error) {
        console.error('Error fetching access list:', error);
        return [];
      }
    },
    enabled: !!tokenId,
  });
  
  // Determine if current user has owner status
  const isOwner = accessList?.some(access => 
    access.isOwner && userWalletAddress === access.granteeAddress
  ) || false;
  
  // Handle verification form submission
  const onVerifySubmit = async (data: VerifyFormValues) => {
    setTokenId(data.tokenId);
    setVerificationStatus('loading');
    setLocation(`/verify/${data.tokenId}`);
    refetchReceipt();
  };
  
  // Handle access request form submission
  const onAccessRequestSubmit = async (data: AccessRequestValues) => {
    setUserWalletAddress(data.walletAddress);
    
    // Check if user already has access
    const hasAccess = await checkMetadataAccess(tokenId);
    
    if (hasAccess) {
      toast({
        title: "Access Verified",
        description: "You already have access to this receipt metadata.",
        variant: "default",
      });
      refetchReceipt();
      setRequestDialogOpen(false);
      return;
    }
    
    // If not, just store the wallet address to be used for future access granting
    toast({
      title: "Wallet Connected",
      description: "Your wallet is now connected. Contact the receipt owner to request access.",
      variant: "default",
    });
    
    setRequestDialogOpen(false);
  };
  
  // Handle granting access
  const handleGrantAccess = async (granteeAddress: string) => {
    if (!tokenId) return false;
    
    try {
      const success = await grantMetadataAccess(tokenId, granteeAddress);
      
      if (success) {
        toast({
          title: "Access Granted",
          description: `Access to receipt metadata granted to ${granteeAddress.substring(0, 6)}...`,
        });
        refetchAccessList();
      }
      
      return success;
    } catch (error) {
      console.error('Error granting access:', error);
      return false;
    }
  };
  
  // Handle revoking access
  const handleRevokeAccess = async (granteeAddress: string) => {
    if (!tokenId) return false;
    
    try {
      const success = await revokeMetadataAccess(tokenId, granteeAddress);
      
      if (success) {
        toast({
          title: "Access Revoked",
          description: `Access to receipt metadata revoked from ${granteeAddress.substring(0, 6)}...`,
        });
        refetchAccessList();
      }
      
      return success;
    } catch (error) {
      console.error('Error revoking access:', error);
      return false;
    }
  };
  
  // Handle displaying full metadata
  const handleViewMetadata = () => {
    if (!receiptData?.data) return;
    
    // Show dialog with full metadata
    toast({
      title: "Full Metadata Accessed",
      description: "You have successfully accessed the full receipt metadata.",
    });
  };
  
  // Rendering different verification status states
  const renderVerificationStatus = () => {
    if (verificationStatus === 'initial') {
      return (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Verify NFT Receipt</CardTitle>
            <CardDescription>
              Enter a valid NFT receipt token ID to verify its authenticity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...verifyForm}>
              <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-4">
                <FormField
                  control={verifyForm.control}
                  name="tokenId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receipt Token ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter token ID" {...field} />
                      </FormControl>
                      <FormDescription>
                        The token ID can be found on the NFT receipt
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Verify Receipt
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Verify blockchain-secured receipts to prove ownership and authenticity
            </p>
          </CardFooter>
        </Card>
      );
    }
    
    if (verificationStatus === 'loading' || isLoadingReceipt) {
      return (
        <div className="w-full flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Verifying Receipt...</p>
          <p className="text-sm text-gray-500">Checking blockchain records</p>
        </div>
      );
    }
    
    if (verificationStatus === 'error') {
      return (
        <Card className="w-full max-w-md mx-auto border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600 dark:text-red-400">
              <AlertCircle className="mr-2 h-5 w-5" />
              Verification Failed
            </CardTitle>
            <CardDescription>
              We couldn't verify this receipt. It may not exist or may have been revoked.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Invalid Token ID</AlertTitle>
              <AlertDescription>
                The token ID <span className="font-mono">{tokenId}</span> could not be verified on the blockchain.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => {
              setVerificationStatus('initial');
              setTokenId('');
              setLocation('/verify');
            }}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardFooter>
        </Card>
      );
    }
    
    if (verificationStatus === 'success' || verificationStatus === 'no-access') {
      // Format receipt data for display
      // Basic receipt data from public preview
      const receiptPreview = receiptData?.data;
      if (!receiptPreview) return null;
      
      // Build a more complete receipt object with the data we have
      const fullReceipt = {
        id: 1, // Placeholder ID
        tokenId: tokenId,
        merchantId: 1, // Placeholder merchant ID
        merchant: {
          id: 1,
          name: receiptPreview.merchantName,
          category: receiptPreview.category || '',
          logoUrl: '',
        },
        date: receiptPreview.date,
        subtotal: receiptPreview.subtotal || 0,
        tax: receiptPreview.tax || 0,
        total: receiptPreview.total,
        items: receiptPreview.items || [],
        blockchainTxHash: receiptPreview.blockchainTxHash || '',
        blockchainVerified: true,
        blockNumber: receiptPreview.blockNumber || 0,
        nftArt: receiptPreview.nftArt || {
          id: receiptPreview.artId || '',
          name: 'Receipt NFT',
          description: 'NFT receipt with blockchain verification',
          imageUrl: '/nft-art/standard-receipt-1.svg',
          thumbnailUrl: '/nft-art/thumbnails/standard-receipt-1.svg',
          tier: 'standard',
        },
        artId: receiptPreview.artId,
      };
      
      // Access control info
      const accessControl = {
        granted: verificationStatus === 'success',
        isOwner: isOwner,
        accessGrantedTo: accessList?.map(access => ({
          address: access.granteeAddress,
          name: '', // Could be populated if we had user profiles
          date: access.grantedAt,
        })) || [],
      };
      
      return (
        <div className="w-full">
          <div className="mb-4">
            <Link href="/verify">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Verification
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <EnhancedNFTReceiptCard
                receipt={fullReceipt}
                accessControl={accessControl}
                onGrantAccess={handleGrantAccess}
                onRevokeAccess={handleRevokeAccess}
                onViewMetadata={handleViewMetadata}
              />
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShieldCheck className="mr-2 h-5 w-5 text-green-500" />
                    Verification Results
                  </CardTitle>
                  <CardDescription>
                    Blockchain verification status and metadata access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="status">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="status">Status</TabsTrigger>
                      <TabsTrigger value="metadata">Metadata</TabsTrigger>
                      <TabsTrigger value="access">Access Control</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="status" className="space-y-4 pt-4">
                      <Alert variant="default" className="bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-800">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertTitle>Receipt Verified</AlertTitle>
                        <AlertDescription>
                          This receipt has been verified on the blockchain and is authentic.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-500">Token ID</p>
                            <p className="font-mono text-sm">{tokenId}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-500">Verification Status</p>
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                              <p>Verified</p>
                            </div>
                          </div>
                        </div>
                        
                        {fullReceipt.blockchainTxHash && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-500">Transaction Hash</p>
                            <p className="font-mono text-sm break-all">{fullReceipt.blockchainTxHash}</p>
                          </div>
                        )}
                        
                        {fullReceipt.blockNumber > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-500">Block Number</p>
                            <p className="font-mono text-sm">{fullReceipt.blockNumber}</p>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-500">Metadata Access</p>
                          <div className="flex items-center">
                            {accessControl.granted ? (
                              <>
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                <p>Full Access</p>
                              </>
                            ) : (
                              <>
                                <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                                <p>Limited Access</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {!accessControl.granted && !userWalletAddress && (
                        <div className="mt-6">
                          <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="w-full">
                                <Lock className="mr-2 h-4 w-4" />
                                Connect Wallet for Access
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Connect Your Wallet</DialogTitle>
                                <DialogDescription>
                                  Connect your blockchain wallet to request access to this receipt's encrypted metadata
                                </DialogDescription>
                              </DialogHeader>
                              
                              <Form {...accessRequestForm}>
                                <form onSubmit={accessRequestForm.handleSubmit(onAccessRequestSubmit)} className="space-y-4">
                                  <FormField
                                    control={accessRequestForm.control}
                                    name="walletAddress"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Wallet Address</FormLabel>
                                        <FormControl>
                                          <Input placeholder="0x..." {...field} />
                                        </FormControl>
                                        <FormDescription>
                                          Enter your wallet address to request access
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setRequestDialogOpen(false)}>
                                      Cancel
                                    </Button>
                                    <Button type="submit">
                                      Connect Wallet
                                    </Button>
                                  </DialogFooter>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="metadata" className="space-y-4 pt-4">
                      {accessControl.granted ? (
                        <>
                          <Alert variant="default" className="bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-800">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <AlertTitle>Full Metadata Access</AlertTitle>
                            <AlertDescription>
                              You have full access to this receipt's metadata.
                            </AlertDescription>
                          </Alert>
                          
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium">Receipt Details</h3>
                              <div className="mt-2 space-y-2">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Merchant</p>
                                    <p>{fullReceipt.merchant.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Date</p>
                                    <p>{new Date(fullReceipt.date).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Subtotal</p>
                                    <p>${(fullReceipt.subtotal / 100).toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Tax</p>
                                    <p>${(fullReceipt.tax / 100).toFixed(2)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Total</p>
                                    <p>${(fullReceipt.total / 100).toFixed(2)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {fullReceipt.items.length > 0 && (
                              <div>
                                <h3 className="text-lg font-medium">Items</h3>
                                <div className="mt-2 border rounded-md overflow-hidden">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {fullReceipt.items.map((item, index) => (
                                        <TableRow key={index}>
                                          <TableCell>{item.name}</TableCell>
                                          <TableCell className="text-right">${(item.price / 100).toFixed(2)}</TableCell>
                                          <TableCell className="text-right">{item.quantity}</TableCell>
                                          <TableCell className="text-right">${((item.price * item.quantity) / 100).toFixed(2)}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            )}
                            
                            {receiptPreview.notes && (
                              <div>
                                <h3 className="text-lg font-medium">Notes</h3>
                                <p className="mt-2 text-gray-700 dark:text-gray-300">{receiptPreview.notes}</p>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <Alert variant="warning" className="bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-800">
                            <Lock className="h-4 w-4 text-yellow-500" />
                            <AlertTitle>Limited Metadata Access</AlertTitle>
                            <AlertDescription>
                              Some metadata is encrypted and requires access from the receipt owner.
                            </AlertDescription>
                          </Alert>
                          
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-lg font-medium">Available Receipt Details</h3>
                              <div className="mt-2 space-y-2">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Merchant</p>
                                    <p>{fullReceipt.merchant.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500">Date</p>
                                    <p>{new Date(fullReceipt.date).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Total</p>
                                  <p>${(fullReceipt.total / 100).toFixed(2)}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center space-y-2">
                              <FileBox className="h-8 w-8 text-gray-400" />
                              <p className="text-center text-gray-500">
                                Additional receipt details are encrypted
                              </p>
                              <p className="text-sm text-center text-gray-400">
                                {userWalletAddress 
                                  ? "Contact the receipt owner to request access" 
                                  : "Connect your wallet to request access"}
                              </p>
                              
                              {!userWalletAddress && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setRequestDialogOpen(true)}
                                >
                                  Connect Wallet
                                </Button>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="access" className="space-y-4 pt-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Access Control</h3>
                          <p className="text-sm text-gray-500">
                            This receipt uses threshold encryption to protect sensitive data
                          </p>
                        </div>
                        
                        {isLoadingAccessList ? (
                          <div className="py-8 flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : accessList && accessList.length > 0 ? (
                          <div className="border rounded-md overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Address</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Granted At</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {accessList.map((access) => (
                                  <TableRow key={access.id}>
                                    <TableCell className="font-mono text-xs">
                                      {access.granteeAddress.substring(0, 6)}...{access.granteeAddress.substring(access.granteeAddress.length - 4)}
                                    </TableCell>
                                    <TableCell>
                                      {access.isOwner ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                          Owner
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                          Granted
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {access.revokedAt ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                          Revoked
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                          Active
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {new Date(access.grantedAt).toLocaleDateString()}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="border border-dashed rounded-md p-6 flex flex-col items-center justify-center space-y-2">
                            <p className="text-center text-gray-500">
                              No access records available
                            </p>
                            <p className="text-sm text-center text-gray-400">
                              {isOwner 
                                ? "Grant access to others using the Share Access button" 
                                : "Access information is only visible to the receipt owner"}
                            </p>
                          </div>
                        )}
                        
                        {isOwner && (
                          <Alert>
                            <ShieldCheck className="h-4 w-4" />
                            <AlertTitle>You are the owner</AlertTitle>
                            <AlertDescription>
                              As the owner of this receipt, you can grant and revoke access to its metadata.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Verify NFT Receipt</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Verify the authenticity of a blockchain receipt and view its metadata
        </p>
      </div>
      
      {renderVerificationStatus()}
    </div>
  );
}
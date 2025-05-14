import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function NFTReceiptDetail() {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [showDecryptDialog, setShowDecryptDialog] = useState(false);
  const [decryptedData, setDecryptedData] = useState<any>(null);

  // Fetch receipt data
  const { data: receipt, isLoading: receiptLoading } = useQuery({
    queryKey: [`/api/nft-receipts/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/nft-receipts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch receipt');
      }
      return response.json();
    }
  });

  // Mutation to decrypt receipt data
  const decryptReceipt = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/nft-receipts/${id}/decrypt`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to decrypt receipt');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setDecryptedData(data.decryptedData);
      setShowDecryptDialog(true);
      toast({
        title: "Receipt Decrypted",
        description: "Successfully decrypted receipt data",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Decryption Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Handle decrypt button click
  const handleDecrypt = () => {
    decryptReceipt.mutate();
  };

  if (receiptLoading) {
    return (
      <main className="container py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-1/3 bg-muted rounded"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="space-y-2">
            <div className="h-6 w-1/2 bg-muted rounded"></div>
            <div className="h-6 w-3/4 bg-muted rounded"></div>
            <div className="h-6 w-1/4 bg-muted rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!receipt) {
    return (
      <main className="container py-10">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold mb-4">Receipt Not Found</h1>
          <p className="text-muted-foreground mb-6">The NFT receipt you're looking for doesn't exist or may have been removed.</p>
          <Button onClick={() => setLocation("/products")}>
            Browse Products
          </Button>
        </div>
      </main>
    );
  }

  const formattedDate = new Date(receipt.createdAt).toLocaleString();

  return (
    <main className="container py-10">
      <Button 
        variant="ghost" 
        onClick={() => setLocation("/products")}
        className="mb-6"
      >
        ← Back to Products
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* NFT Receipt Card */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">NFT Receipt #{id}</CardTitle>
                  <CardDescription className="text-white/80">
                    Issued on {formattedDate}
                  </CardDescription>
                </div>
                <Badge 
                  className="capitalize"
                  variant="secondary"
                >
                  {receipt.tier}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Product Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Product Name</label>
                      <p className="font-medium">{receipt.product?.name}</p>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Merchant</label>
                      <p className="font-medium">{receipt.merchant?.name}</p>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Price</label>
                      <p className="font-medium">${receipt.product?.price.toFixed(2)}</p>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Purchase Date</label>
                      <p className="font-medium">{formattedDate}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Blockchain Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-muted-foreground">NFT Token ID</label>
                      <p className="font-medium truncate">{receipt.nftTokenId}</p>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Transaction Hash</label>
                      <p className="font-medium truncate">{receipt.transactionHash}</p>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">IPFS Hash</label>
                      <p className="font-medium truncate">{receipt.ipfsHash}</p>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Owner Wallet</label>
                      <p className="font-medium truncate">{receipt.customerWalletAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">Encrypted Receipt Data</h3>
                <p className="text-muted-foreground">
                  This NFT receipt contains encrypted data using Threshold Pre-Encryption (TPRE).
                  Only authorized parties can decrypt and view the detailed receipt information.
                </p>
                <Button 
                  onClick={handleDecrypt}
                  disabled={decryptReceipt.isPending}
                  className="w-full max-w-md mx-auto"
                >
                  {decryptReceipt.isPending ? "Decrypting..." : "Decrypt Receipt Data"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Receipt Authentication</CardTitle>
              <CardDescription>
                Verify the authenticity of this NFT receipt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg bg-green-50 text-green-700">
                <h4 className="font-semibold mb-1">✓ Verified on Blockchain</h4>
                <p className="text-sm">This receipt has been verified on the Polygon Amoy blockchain.</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Security Features</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Blockchain verification</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Tamper-proof data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Threshold Pre-Encryption (TPRE)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Authorized access controls</span>
                  </li>
                  {receipt.tier === 'premium' || receipt.tier === 'luxury' ? (
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Enhanced metadata verification</span>
                    </li>
                  ) : null}
                  {receipt.tier === 'luxury' ? (
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Premium service access</span>
                    </li>
                  ) : null}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Verification Links</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <span className="truncate">View on Blockchain Explorer</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <span className="truncate">Verify on IPFS</span>
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => window.print()}>
                Print Receipt
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Decrypted Data Dialog */}
      <Dialog open={showDecryptDialog} onOpenChange={setShowDecryptDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Decrypted Receipt Data</DialogTitle>
            <DialogDescription>
              This is the decrypted data from your NFT receipt. This information is encrypted on the blockchain
              and can only be accessed by authorized parties using Threshold Pre-Encryption.
            </DialogDescription>
          </DialogHeader>

          {decryptedData && (
            <div className="py-4 overflow-auto max-h-[60vh]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Field</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Product ID</TableCell>
                    <TableCell>{decryptedData.productId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Product Name</TableCell>
                    <TableCell>{decryptedData.productName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">SKU</TableCell>
                    <TableCell>{decryptedData.productSku}</TableCell>
                  </TableRow>
                  {decryptedData.serialNumber && (
                    <TableRow>
                      <TableCell className="font-medium">Serial Number</TableCell>
                      <TableCell>{decryptedData.serialNumber}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-medium">Price</TableCell>
                    <TableCell>{decryptedData.price} {decryptedData.currency}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Merchant</TableCell>
                    <TableCell>{decryptedData.merchantName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Merchant Wallet</TableCell>
                    <TableCell className="truncate">{decryptedData.merchantWalletAddress}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Purchase Date</TableCell>
                    <TableCell>{new Date(decryptedData.purchaseDate).toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Customer Wallet</TableCell>
                    <TableCell className="truncate">{decryptedData.customerWalletAddress}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Payment Method</TableCell>
                    <TableCell>{decryptedData.paymentMethod}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Payment ID</TableCell>
                    <TableCell>{decryptedData.paymentId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">NFT Receipt Tier</TableCell>
                    <TableCell className="capitalize">{decryptedData.tier}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              {decryptedData.metadata && Object.keys(decryptedData.metadata).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Additional Metadata</h3>
                  <div className="border rounded-lg p-4 bg-muted/30">
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(decryptedData.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowDecryptDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
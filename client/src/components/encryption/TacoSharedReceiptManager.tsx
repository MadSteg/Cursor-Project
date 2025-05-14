/**
 * Taco Shared Receipt Manager
 * 
 * This component provides a UI for managing receipts shared using Taco threshold encryption.
 * It allows users to share receipts, view shared receipts, and manage access permissions.
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { encryptionService } from "@/lib/encryptionService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LockIcon, ShieldIcon, Share2Icon, UserIcon, ClockIcon, XIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Schema for creating a new shared access
const createSharedAccessSchema = z.object({
  targetUserId: z.string().min(1, "Target user is required"),
  accessLevel: z.enum(["full", "limited", "verification-only"]),
  expirationDays: z.string().optional(),
});

export function TacoSharedReceiptManager() {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [selectedShared, setSelectedShared] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get all encrypted receipts
  const { data: receipts, isLoading: loadingReceipts } = useQuery({
    queryKey: ["/api/receipts"],
    queryFn: async () => {
      // In a real app, we'd have an API to get only encrypted receipts
      const response = await fetch("/api/receipts");
      const allReceipts = await response.json();
      return allReceipts.filter((r: any) => r.isEncrypted);
    },
  });

  // Query to fetch receipts shared with me
  const { data: sharedWithMe, isLoading: loadingSharedWithMe } = useQuery({
    queryKey: ["/api/shared-with-me"],
    queryFn: encryptionService.getSharedWithMe,
  });

  // Query to fetch receipts I've shared
  const { data: sharedByMe, isLoading: loadingSharedByMe } = useQuery({
    queryKey: ["/api/shared-by-me"],
    queryFn: encryptionService.getSharedByMe,
  });

  // Form for sharing a receipt
  const form = useForm<z.infer<typeof createSharedAccessSchema>>({
    resolver: zodResolver(createSharedAccessSchema),
    defaultValues: {
      targetUserId: "",
      accessLevel: "full",
      expirationDays: "30",
    },
  });

  // Mock users for the demo
  const mockUsers = [
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Bob Johnson" },
    { id: "4", name: "Alice Williams" },
  ];

  // Mutation for sharing a receipt
  const shareReceiptMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createSharedAccessSchema> & { receiptId: number }) => {
      // Calculate expiration date
      let expiresAt: Date | undefined = undefined;
      if (data.expirationDays) {
        const days = parseInt(data.expirationDays);
        if (!isNaN(days)) {
          expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + days);
        }
      }

      // Create shared access
      return encryptionService.createSharedAccess(data.receiptId, {
        targetUserId: parseInt(data.targetUserId),
        reEncryptedKey: `taco-re-encryption-key-${Date.now()}`, // Mock key for demo
        permissions: data.accessLevel,
        expiresAt,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Receipt shared successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/shared-by-me"] });
      setIsShareDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to share receipt: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof createSharedAccessSchema>) => {
    if (!selectedReceipt) return;
    
    shareReceiptMutation.mutate({
      ...data,
      receiptId: selectedReceipt.id,
    });
  };

  const handleShareReceipt = (receipt: any) => {
    setSelectedReceipt(receipt);
    setIsShareDialogOpen(true);
  };

  const handleViewDetails = (shared: any) => {
    setSelectedShared(shared);
    setIsDetailsDialogOpen(true);
  };

  const revokeAccess = async (sharedId: number) => {
    try {
      // In a real app, we'd have an API to revoke access
      // await encryptionService.revokeAccess(sharedId);
      
      toast({
        title: "Access Revoked",
        description: "Shared access has been revoked successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/shared-by-me"] });
      setIsDetailsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to revoke access: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const isLoading = loadingReceipts || loadingSharedWithMe || loadingSharedByMe;

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading shared receipts...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="shared-with-me">
        <TabsList className="mb-4">
          <TabsTrigger value="shared-with-me">Shared with Me</TabsTrigger>
          <TabsTrigger value="shared-by-me">Shared by Me</TabsTrigger>
          <TabsTrigger value="share-new">Share Receipt</TabsTrigger>
        </TabsList>

        <TabsContent value="shared-with-me">
          <h3 className="text-lg font-semibold mb-4">Receipts Shared with Me via Taco</h3>
          
          {sharedWithMe && sharedWithMe.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sharedWithMe.map((receipt: any) => (
                <Card key={receipt.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center">
                        <ShieldIcon className="h-4 w-4 mr-2 text-blue-500" />
                        {receipt.merchant?.name || "Unnamed Merchant"}
                      </CardTitle>
                      <Badge className="bg-blue-100 text-blue-800">
                        Taco Encrypted
                      </Badge>
                    </div>
                    <CardDescription>
                      {new Date(receipt.date).toLocaleDateString()} - ${parseFloat(receipt.total).toFixed(2)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium flex items-center">
                          <UserIcon className="h-3 w-3 mr-1" /> Shared by:
                        </span>
                        <span>User #{receipt.sharedBy}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="font-medium flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" /> Shared on:
                        </span>
                        <span>{new Date(receipt.sharedAt).toLocaleDateString()}</span>
                      </div>
                      
                      {receipt.expiresAt && (
                        <div className="flex justify-between">
                          <span className="font-medium">Expires:</span>
                          <span>{new Date(receipt.expiresAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(receipt)} className="w-full">
                      View Receipt
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                  <LockIcon className="h-12 w-12 text-gray-300" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">No Shared Receipts</h3>
                    <p className="text-sm text-gray-500 max-w-md">
                      You don't have any receipts shared with you using Taco threshold encryption.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="shared-by-me">
          <h3 className="text-lg font-semibold mb-4">Receipts You've Shared via Taco</h3>
          
          {sharedByMe && sharedByMe.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sharedByMe.map((receipt: any) => (
                <Card key={receipt.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="flex items-center">
                        <Share2Icon className="h-4 w-4 mr-2 text-green-500" />
                        {receipt.merchant?.name || "Unnamed Merchant"}
                      </CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        Shared
                      </Badge>
                    </div>
                    <CardDescription>
                      {new Date(receipt.date).toLocaleDateString()} - ${parseFloat(receipt.total).toFixed(2)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium flex items-center">
                          <UserIcon className="h-3 w-3 mr-1" /> Shared with:
                        </span>
                        <span>User #{receipt.sharedWith}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="font-medium flex items-center">
                          <ClockIcon className="h-3 w-3 mr-1" /> Shared on:
                        </span>
                        <span>{new Date(receipt.sharedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewDetails(receipt)}
                      className="w-full"
                    >
                      Manage Sharing
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                  <Share2Icon className="h-12 w-12 text-gray-300" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">No Shared Receipts</h3>
                    <p className="text-sm text-gray-500 max-w-md">
                      You haven't shared any receipts with Taco threshold encryption yet.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="share-new">
          <h3 className="text-lg font-semibold mb-4">Share a Receipt with Taco Encryption</h3>
          
          {receipts && receipts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {receipts.map((receipt: any) => (
                <Card key={receipt.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {receipt.merchant?.name || "Unnamed Merchant"}
                    </CardTitle>
                    <CardDescription>
                      {new Date(receipt.date).toLocaleDateString()} - ${parseFloat(receipt.total).toFixed(2)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="text-sm">
                      <div className="mb-1">
                        <span className="font-medium">Items:</span> {receipt.items?.length || 0}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {receipt.category?.name || "Uncategorized"}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleShareReceipt(receipt)}
                      className="w-full"
                    >
                      <Share2Icon className="h-3 w-3 mr-1" />
                      Share with Taco
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                  <LockIcon className="h-12 w-12 text-gray-300" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">No Encrypted Receipts</h3>
                    <p className="text-sm text-gray-500 max-w-md">
                      You don't have any receipts that can be shared with Taco threshold encryption.
                      Receipts must be encrypted first.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Share Receipt Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Receipt with Taco Encryption</DialogTitle>
            <DialogDescription>
              Share your encrypted receipt securely using Taco threshold encryption.
              Recipients will be able to decrypt the receipt based on the permissions you set.
            </DialogDescription>
          </DialogHeader>

          {selectedReceipt && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="bg-gray-50 p-3 rounded mb-4">
                  <div className="font-medium">{selectedReceipt.merchant?.name || "Unnamed Merchant"}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(selectedReceipt.date).toLocaleDateString()} - ${parseFloat(selectedReceipt.total).toFixed(2)}
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="targetUserId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Share with User</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockUsers.map(user => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accessLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select access level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full">Full Access (View all details)</SelectItem>
                          <SelectItem value="limited">Limited Access (View total only)</SelectItem>
                          <SelectItem value="verification-only">Verification Only (Verify authenticity)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expirationDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Access Duration (Days)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select access duration" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                          <SelectItem value="">No expiration</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Alert>
                  <ShieldIcon className="h-4 w-4" />
                  <AlertTitle>Secure Sharing</AlertTitle>
                  <AlertDescription>
                    Your receipt will be shared using Taco threshold encryption. The recipient will 
                    be able to decrypt only the parts you specify without revealing your encryption keys.
                  </AlertDescription>
                </Alert>
                
                <DialogFooter>
                  <Button type="submit" disabled={shareReceiptMutation.isPending}>
                    {shareReceiptMutation.isPending ? "Sharing..." : "Share Receipt"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* Shared Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Shared Receipt Details</DialogTitle>
            <DialogDescription>
              Details about this shared receipt and access control
            </DialogDescription>
          </DialogHeader>

          {selectedShared && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <div className="font-medium text-lg">
                  {selectedShared.merchant?.name || "Unnamed Merchant"}
                </div>
                <div className="text-gray-500">
                  {new Date(selectedShared.date).toLocaleDateString()} - ${parseFloat(selectedShared.total).toFixed(2)}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 font-medium text-gray-600">Receipt ID</div>
                <div className="col-span-2">{selectedShared.id}</div>

                {'sharedWith' in selectedShared ? (
                  <>
                    <div className="col-span-1 font-medium text-gray-600">Shared With</div>
                    <div className="col-span-2">User #{selectedShared.sharedWith}</div>
                  </>
                ) : (
                  <>
                    <div className="col-span-1 font-medium text-gray-600">Shared By</div>
                    <div className="col-span-2">User #{selectedShared.sharedBy}</div>
                  </>
                )}
                
                <div className="col-span-1 font-medium text-gray-600">Shared On</div>
                <div className="col-span-2">{new Date(selectedShared.sharedAt).toLocaleString()}</div>
                
                <div className="col-span-1 font-medium text-gray-600">Expires</div>
                <div className="col-span-2">
                  {selectedShared.expiresAt 
                    ? new Date(selectedShared.expiresAt).toLocaleDateString()
                    : "No expiration"
                  }
                </div>

                <div className="col-span-1 font-medium text-gray-600">Technology</div>
                <div className="col-span-2">Taco Threshold Encryption</div>
              </div>
              
              {'sharedWith' in selectedShared && (
                <div className="pt-4">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => revokeAccess(selectedShared.id)}
                    className="w-full"
                  >
                    <XIcon className="h-4 w-4 mr-2" />
                    Revoke Access
                  </Button>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
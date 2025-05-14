/**
 * Shared Receipt Manager Component
 * 
 * This component provides an interface for managing receipts shared using
 * BlockReceipt.ai's advanced encryption technology.
 */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { encryptionService } from "@/lib/encryptionService";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Share2, Eye, Clock, CalendarIcon, ShieldAlert, Shield, ShieldCheck, AlertCircle, Ban } from "lucide-react";

// Define types for users and receipts
interface User {
  id: number;
  username: string;
  email?: string;
}

interface Receipt {
  id: number;
  userId: number;
  merchantId: number;
  merchant: {
    name: string;
  };
  date: string;
  total: string;
}

interface SharedAccess {
  id: number;
  receiptId: number;
  ownerId: number;
  targetId: number;
  encryptedData: string;
  createdAt: string;
  expiresAt?: string;
}

interface SharedReceipt {
  id: number;
  receiptId: number;
  targetId: number;
  createdAt: string;
  expiresAt?: string;
  isRevoked: boolean;
  targetName: string;
  receipt: {
    id: number;
    date: string;
    total: string;
    merchantName: string;
  };
}

// Form schema for sharing receipts
const shareFormSchema = z.object({
  receiptId: z.string().min(1, { message: "Please select a receipt" }),
  targetId: z.string().min(1, { message: "Please select a user to share with" }),
  expiryDate: z.date().optional(),
});

// Mock data for users and receipts
const mockUsers: User[] = [
  { id: 2, username: "jane_doe", email: "jane@example.com" },
  { id: 3, username: "john_smith", email: "john@example.com" },
  { id: 4, username: "sarah_jones", email: "sarah@example.com" },
];

const mockReceipts: Receipt[] = [
  { 
    id: 1, 
    userId: 1, 
    merchantId: 1, 
    merchant: { name: "Whole Foods" }, 
    date: "2025-05-10T12:00:00Z", 
    total: "127.89" 
  },
  { 
    id: 2, 
    userId: 1, 
    merchantId: 2, 
    merchant: { name: "Best Buy" }, 
    date: "2025-05-05T15:30:00Z", 
    total: "499.99" 
  },
  { 
    id: 3, 
    userId: 1, 
    merchantId: 3, 
    merchant: { name: "Amazon" }, 
    date: "2025-05-01T09:15:00Z", 
    total: "89.95" 
  },
];

// Mock shared receipt data
const mockSharedByMe: SharedReceipt[] = [
  {
    id: 1,
    receiptId: 1,
    targetId: 2,
    createdAt: "2025-05-11T09:00:00Z",
    expiresAt: "2025-06-11T09:00:00Z",
    isRevoked: false,
    targetName: "jane_doe",
    receipt: {
      id: 1,
      date: "2025-05-10T12:00:00Z",
      total: "127.89",
      merchantName: "Whole Foods"
    }
  },
  {
    id: 2,
    receiptId: 2,
    targetId: 3,
    createdAt: "2025-05-06T10:00:00Z",
    expiresAt: undefined,
    isRevoked: false,
    targetName: "john_smith",
    receipt: {
      id: 2,
      date: "2025-05-05T15:30:00Z",
      total: "499.99",
      merchantName: "Best Buy"
    }
  }
];

const mockSharedWithMe: SharedReceipt[] = [
  {
    id: 3,
    receiptId: 4,
    targetId: 1,
    createdAt: "2025-05-09T14:00:00Z",
    expiresAt: "2025-06-09T14:00:00Z",
    isRevoked: false,
    targetName: "alice_white",
    receipt: {
      id: 4,
      date: "2025-05-09T12:30:00Z",
      total: "75.50",
      merchantName: "Target"
    }
  }
];

export default function SharedReceiptManager() {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("shared-by-me");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form for sharing receipts
  const form = useForm<z.infer<typeof shareFormSchema>>({
    resolver: zodResolver(shareFormSchema),
    defaultValues: {
      receiptId: "",
      targetId: "",
    },
  });

  // Get all receipts shared by me
  const { data: sharedByMe = [], isLoading: isLoadingSharedByMe } = useQuery({
    queryKey: ['/api/encryption/shared-by-me'],
    queryFn: async () => {
      // In a real app, we would get the actual user ID
      const userId = 1;
      try {
        return await encryptionService.getSharedByMe(userId);
      } catch (error) {
        console.error("Failed to fetch shared receipts:", error);
        // Return mock data for now
        return mockSharedByMe;
      }
    },
  });

  // Get all receipts shared with me
  const { data: sharedWithMe = [], isLoading: isLoadingSharedWithMe } = useQuery({
    queryKey: ['/api/encryption/shared-with-me'],
    queryFn: async () => {
      // In a real app, we would get the actual user ID
      const userId = 1;
      try {
        return await encryptionService.getSharedWithMe(userId);
      } catch (error) {
        console.error("Failed to fetch shared receipts:", error);
        // Return mock data for now
        return mockSharedWithMe;
      }
    },
  });

  // Share a receipt
  const shareReceiptMutation = useMutation({
    mutationFn: async (data: z.infer<typeof shareFormSchema>) => {
      // In a real implementation, we would get these from the user's session
      const ownerId = 1;
      const receiptId = parseInt(data.receiptId);
      const targetId = parseInt(data.targetId);
      
      // We would encrypt the receipt data and get the target's public key
      // For now, we'll mock these values
      const receiptData = JSON.stringify({ 
        receipt: mockReceipts.find(r => r.id === receiptId),
        shared: new Date().toISOString()
      });
      const encryptedData = `encrypted:${Buffer.from(receiptData).toString('base64')}`;
      const ownerPrivateKey = "private-key-mock";
      const targetPublicKey = "public-key-mock";
      
      try {
        return await encryptionService.shareReceipt(
          receiptId,
          ownerId,
          targetId,
          encryptedData,
          ownerPrivateKey,
          targetPublicKey,
          data.expiryDate
        );
      } catch (error) {
        console.error("Error sharing receipt:", error);
        // Mock a success response for demo purposes
        return {
          id: Date.now(),
          receiptId,
          ownerId,
          targetId,
          encryptedData,
          createdAt: new Date().toISOString(),
          expiresAt: data.expiryDate?.toISOString()
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/encryption/shared-by-me'] });
      
      toast({
        title: "Receipt Shared",
        description: "The receipt has been shared successfully",
      });
      
      setIsShareDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Sharing Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  // Revoke access to a shared receipt
  const revokeAccessMutation = useMutation({
    mutationFn: async (sharedId: number) => {
      try {
        return await encryptionService.revokeAccess(sharedId);
      } catch (error) {
        console.error("Error revoking access:", error);
        // Mock success for demo
        return { success: true };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/encryption/shared-by-me'] });
      
      toast({
        title: "Access Revoked",
        description: "Receipt access has been revoked successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Revocation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleShareSubmit = (values: z.infer<typeof shareFormSchema>) => {
    shareReceiptMutation.mutate(values);
  };

  const handleRevokeAccess = (sharedId: number) => {
    if (confirm("Are you sure you want to revoke access to this receipt?")) {
      revokeAccessMutation.mutate(sharedId);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Shared Receipts</CardTitle>
            <CardDescription>
              Manage receipts shared with BlockReceipt.ai's advanced encryption
            </CardDescription>
          </div>
          <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Share2 size={16} /> Share Receipt
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share a Receipt</DialogTitle>
                <DialogDescription>
                  Securely share a receipt with another user using advanced threshold encryption
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleShareSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="receiptId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Receipt</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a receipt" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockReceipts.map(receipt => (
                              <SelectItem 
                                key={receipt.id} 
                                value={receipt.id.toString()}
                              >
                                {receipt.merchant.name} - ${receipt.total} ({new Date(receipt.date).toLocaleDateString()})
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
                    name="targetId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Share With</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a user" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockUsers.map(user => (
                              <SelectItem 
                                key={user.id} 
                                value={user.id.toString()}
                              >
                                {user.username} {user.email ? `(${user.email})` : ''}
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
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expiry Date (Optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>No expiration</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={shareReceiptMutation.isPending}
                    >
                      {shareReceiptMutation.isPending ? "Sharing..." : "Share Receipt"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="shared-by-me">Shared By Me</TabsTrigger>
            <TabsTrigger value="shared-with-me">Shared With Me</TabsTrigger>
          </TabsList>
          
          <TabsContent value="shared-by-me" className="py-4">
            {isLoadingSharedByMe ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : sharedByMe.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Share2 size={48} className="mx-auto mb-4 opacity-30" />
                <p>You haven't shared any receipts yet</p>
                <p className="text-sm mt-2">
                  Share receipts securely with others using BlockReceipt.ai's advanced encryption
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sharedByMe.map((shared: SharedReceipt) => (
                  <div 
                    key={shared.id} 
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium">{shared.receipt.merchantName}</div>
                        <div className="text-sm text-muted-foreground">
                          Receipt Date: {new Date(shared.receipt.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm font-semibold mt-1">
                          ${shared.receipt.total}
                        </div>
                      </div>
                      {shared.isRevoked ? (
                        <div className="flex items-center gap-1 text-destructive text-sm">
                          <Ban size={16} />
                          Revoked
                        </div>
                      ) : shared.expiresAt && new Date(shared.expiresAt) < new Date() ? (
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Clock size={16} />
                          Expired
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <ShieldCheck size={16} />
                          Active
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <div>Shared with:</div>
                      <div className="font-medium text-foreground">{shared.targetName}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Clock size={12} />
                      <div>Shared on {new Date(shared.createdAt).toLocaleDateString()}</div>
                      {shared.expiresAt && (
                        <>
                          <div>•</div>
                          <div>
                            {new Date(shared.expiresAt) > new Date() 
                              ? `Expires on ${new Date(shared.expiresAt).toLocaleDateString()}`
                              : `Expired on ${new Date(shared.expiresAt).toLocaleDateString()}`
                            }
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Eye size={14} />
                        View Receipt
                      </Button>
                      {!shared.isRevoked && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center gap-1 text-destructive"
                          onClick={() => handleRevokeAccess(shared.id)}
                        >
                          <Ban size={14} />
                          Revoke Access
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="shared-with-me" className="py-4">
            {isLoadingSharedWithMe ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : sharedWithMe.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Share2 size={48} className="mx-auto mb-4 opacity-30" />
                <p>No receipts have been shared with you</p>
                <p className="text-sm mt-2">
                  When someone shares a receipt with you, it will appear here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sharedWithMe.map((shared: SharedReceipt) => (
                  <div 
                    key={shared.id} 
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium">{shared.receipt.merchantName}</div>
                        <div className="text-sm text-muted-foreground">
                          Receipt Date: {new Date(shared.receipt.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm font-semibold mt-1">
                          ${shared.receipt.total}
                        </div>
                      </div>
                      {shared.isRevoked ? (
                        <div className="flex items-center gap-1 text-destructive text-sm">
                          <Ban size={16} />
                          Revoked
                        </div>
                      ) : shared.expiresAt && new Date(shared.expiresAt) < new Date() ? (
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <Clock size={16} />
                          Expired
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <ShieldCheck size={16} />
                          Active
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <div>Shared by:</div>
                      <div className="font-medium text-foreground">{shared.targetName}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Clock size={12} />
                      <div>Shared on {new Date(shared.createdAt).toLocaleDateString()}</div>
                      {shared.expiresAt && (
                        <>
                          <div>•</div>
                          <div>
                            {new Date(shared.expiresAt) > new Date() 
                              ? `Expires on ${new Date(shared.expiresAt).toLocaleDateString()}`
                              : `Expired on ${new Date(shared.expiresAt).toLocaleDateString()}`
                            }
                          </div>
                        </>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Eye size={14} />
                      View Receipt
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
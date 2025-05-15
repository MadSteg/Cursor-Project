/**
 * Create NFT Receipt Form
 * 
 * This component handles the process of creating an NFT receipt from a
 * raw receipt, including art selection and metadata encryption.
 */

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NFTArtItem, ReceiptTier } from '@/data/nftArtManifest';

// Local implementation to avoid import issues
function determineReceiptTier(total: number): ReceiptTier {
  if (total >= 500) {
    return 'ULTRA';
  } else if (total >= 200) {
    return 'LUXURY';
  } else if (total >= 50) {
    return 'PREMIUM';
  } else {
    return 'STANDARD';
  }
}
import NFTArtSelector from './NFTArtSelector';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { encryptMetadata, storeEncryptedMetadata } from '@/lib/metadataEncryptionService';
import { apiRequest } from '@/lib/queryClient';
import { AlertCircle, ArrowRight, LockIcon, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// Form schema
const formSchema = z.object({
  // Receipt basic info
  merchantName: z.string().min(1, { message: "Merchant name is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  subtotal: z.number().min(0, { message: "Subtotal must be a positive number" }),
  tax: z.number().min(0, { message: "Tax must be a positive number" }),
  total: z.number().min(0, { message: "Total must be a positive number" }),
  
  // Privacy settings
  encryptLineItems: z.boolean().default(true),
  encryptTotals: z.boolean().default(false),
  
  // Selected NFT art
  artId: z.string().optional(),
  
  // Additional metadata
  category: z.string().optional(),
  tags: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ReceiptItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CreateNFTReceiptFormProps {
  initialData?: {
    merchantName: string;
    date: string;
    subtotal: number;
    tax: number;
    total: number;
    items: ReceiptItem[];
  };
  onComplete?: (receiptId: string, tokenId: string) => void;
  walletAddress?: string;
}

export const CreateNFTReceiptForm: React.FC<CreateNFTReceiptFormProps> = ({
  initialData,
  onComplete,
  walletAddress
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedArt, setSelectedArt] = useState<NFTArtItem | null>(null);
  const [items, setItems] = useState<ReceiptItem[]>(initialData?.items || []);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');
  const [activeTab, setActiveTab] = useState('receipt');
  
  // Initialize form with initial data if available
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      merchantName: initialData?.merchantName || '',
      date: initialData?.date || new Date().toISOString().split('T')[0],
      subtotal: initialData?.subtotal || 0,
      tax: initialData?.tax || 0,
      total: initialData?.total || 0,
      encryptLineItems: true,
      encryptTotals: false,
      category: '',
      tags: '',
      notes: '',
    },
    mode: 'onChange',
  });
  
  // Watch total for determining tiers
  const watchTotal = form.watch('total');
  
  // Calculate receipt tier based on total
  const receiptTier = determineReceiptTier(watchTotal);
  
  // Handle art selection
  const handleArtSelected = (art: NFTArtItem) => {
    setSelectedArt(art);
    form.setValue('artId', art.id);
  };
  
  // Add a new item to the receipt
  const handleAddItem = () => {
    if (newItemName.trim() && newItemPrice) {
      const price = parseFloat(newItemPrice);
      const quantity = parseInt(newItemQuantity) || 1;
      
      if (!isNaN(price) && price >= 0) {
        const newItem: ReceiptItem = {
          id: Date.now(), // Use timestamp as temporary ID
          name: newItemName.trim(),
          price, // Store in cents
          quantity,
        };
        
        setItems(prev => [...prev, newItem]);
        setNewItemName('');
        setNewItemPrice('');
        setNewItemQuantity('1');
        
        // Update subtotal
        const newSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (price * quantity);
        form.setValue('subtotal', newSubtotal);
        
        // Recalculate total
        const tax = form.getValues('tax');
        form.setValue('total', newSubtotal + tax);
      }
    }
  };
  
  // Remove an item from the receipt
  const handleRemoveItem = (itemId: number) => {
    const itemToRemove = items.find(item => item.id === itemId);
    if (itemToRemove) {
      setItems(prev => prev.filter(item => item.id !== itemId));
      
      // Update subtotal
      const oldSubtotal = form.getValues('subtotal');
      const newSubtotal = oldSubtotal - (itemToRemove.price * itemToRemove.quantity);
      form.setValue('subtotal', Math.max(0, newSubtotal));
      
      // Recalculate total
      const tax = form.getValues('tax');
      form.setValue('total', Math.max(0, newSubtotal + tax));
    }
  };
  
  // Update tax and recalculate total
  const handleTaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTax = event.target.value === '' ? 0 : parseFloat(event.target.value);
    if (!isNaN(newTax)) {
      form.setValue('tax', newTax);
      
      // Recalculate total
      const subtotal = form.getValues('subtotal');
      form.setValue('total', subtotal + newTax);
    }
  };
  
  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!selectedArt) {
      toast({
        title: "Error",
        description: "Please select an NFT art design",
        variant: "destructive"
      });
      return;
    }
    
    if (!walletAddress) {
      toast({
        title: "Error",
        description: "Wallet address is required for minting",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare receipt data
      const receiptData = {
        merchantName: data.merchantName,
        date: data.date,
        subtotal: data.subtotal,
        tax: data.tax,
        total: data.total,
        items,
        category: data.category,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
        notes: data.notes,
        artId: selectedArt.id,
      };
      
      // Determine which fields to encrypt based on user preferences
      const publicPreview = {
        merchantName: data.merchantName,
        date: data.date,
        total: data.total,
        artId: selectedArt.id,
      };
      
      if (!data.encryptTotals) {
        publicPreview.subtotal = data.subtotal;
        publicPreview.tax = data.tax;
      }
      
      if (!data.encryptLineItems) {
        publicPreview.items = items;
      }
      
      // Generate a token ID
      const tokenId = `receipt-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      
      // Encrypt sensitive metadata
      const encryptedMetadata = await encryptMetadata(
        receiptData,
        publicPreview,
        walletAddress,
        tokenId
      );
      
      if (!encryptedMetadata) {
        throw new Error("Failed to encrypt receipt metadata");
      }
      
      // Store encrypted metadata
      const metadataStored = await storeEncryptedMetadata(encryptedMetadata);
      
      if (!metadataStored) {
        throw new Error("Failed to store encrypted metadata");
      }
      
      // Create NFT receipt
      const response = await apiRequest('POST', '/api/nft-receipts', {
        tokenId,
        merchantName: data.merchantName,
        date: data.date,
        total: data.total,
        artId: selectedArt.id,
        ownerAddress: walletAddress,
      });
      
      if (!response.ok) {
        throw new Error("Failed to create NFT receipt");
      }
      
      const result = await response.json();
      
      toast({
        title: "Success",
        description: "NFT receipt created successfully!",
      });
      
      if (onComplete) {
        onComplete(result.id, tokenId);
      }
    } catch (error) {
      console.error('Error creating NFT receipt:', error);
      toast({
        title: "Error",
        description: "Failed to create NFT receipt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <Tabs defaultValue="receipt" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="receipt">Receipt Info</TabsTrigger>
          <TabsTrigger value="nft-art">NFT Art Selection</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Controls</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Receipt Info Tab */}
            <TabsContent value="receipt" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Receipt Information</CardTitle>
                  <CardDescription>
                    Enter the basic receipt information or verify the scanned data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="merchantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Merchant Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter merchant name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Receipt Items</h3>
                    
                    {/* Items list */}
                    <div className="border rounded-md">
                      <div className="grid grid-cols-12 gap-2 p-2 border-b font-medium text-sm">
                        <div className="col-span-5">Item</div>
                        <div className="col-span-2">Price</div>
                        <div className="col-span-2">Qty</div>
                        <div className="col-span-2">Total</div>
                        <div className="col-span-1"></div>
                      </div>
                      
                      <div className="max-h-48 overflow-y-auto">
                        {items.length > 0 ? (
                          items.map(item => (
                            <div key={item.id} className="grid grid-cols-12 gap-2 p-2 border-b last:border-b-0 text-sm">
                              <div className="col-span-5 truncate">{item.name}</div>
                              <div className="col-span-2">${item.price.toFixed(2)}</div>
                              <div className="col-span-2">{item.quantity}</div>
                              <div className="col-span-2">${(item.price * item.quantity).toFixed(2)}</div>
                              <div className="col-span-1">
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  ✕
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-sm text-gray-500">
                            No items added yet
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Add item form */}
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-5">
                        <Input 
                          placeholder="Item name" 
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input 
                          placeholder="Price" 
                          type="number" 
                          min="0" 
                          step="0.01"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(e.target.value)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input 
                          placeholder="Qty" 
                          type="number" 
                          min="1" 
                          step="1"
                          value={newItemQuantity}
                          onChange={(e) => setNewItemQuantity(e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleAddItem}
                          className="w-full"
                        >
                          Add Item
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Totals section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="subtotal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subtotal</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              {...field} 
                              disabled={items.length > 0}
                              value={field.value}
                              onChange={(e) => {
                                const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                if (!isNaN(value)) {
                                  field.onChange(value);
                                  const tax = form.getValues('tax');
                                  form.setValue('total', value + tax);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              value={field.value}
                              onChange={(e) => {
                                handleTaxChange(e);
                                field.onChange(e);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="total"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              {...field} 
                              className="font-semibold"
                              disabled
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="groceries">Groceries</SelectItem>
                              <SelectItem value="dining">Dining</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="electronics">Electronics</SelectItem>
                              <SelectItem value="travel">Travel</SelectItem>
                              <SelectItem value="entertainment">Entertainment</SelectItem>
                              <SelectItem value="utilities">Utilities</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags (Optional, comma-separated)</FormLabel>
                          <FormControl>
                            <Input placeholder="business, reimbursable, etc." {...field} />
                          </FormControl>
                          <FormDescription>
                            Add comma-separated tags for easier organization
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Any additional notes about this purchase" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm">
                    <span className="font-medium">Receipt Tier: </span>
                    <span className="capitalize">{receiptTier}</span>
                  </div>
                  <Button type="button" onClick={() => setActiveTab('nft-art')}>
                    Continue to NFT Art <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* NFT Art Selection Tab */}
            <TabsContent value="nft-art" className="space-y-6">
              <NFTArtSelector 
                receiptTier={determineReceiptTier(form.getValues('total') / 100)} // Convert cents to dollars
                onSelectNFT={handleArtSelected}
                selectedNFTId={form.getValues('artId')}
              />
              
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab('receipt')}>
                  Back to Receipt
                </Button>
                <Button type="button" onClick={() => setActiveTab('privacy')}>
                  Continue to Privacy Controls <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            {/* Privacy Controls Tab */}
            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LockIcon className="h-5 w-5" /> 
                    Privacy & Encryption Controls
                  </CardTitle>
                  <CardDescription>
                    Control what data is encrypted and what is publicly visible in your NFT receipt
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Privacy Information</AlertTitle>
                    <AlertDescription>
                      Your receipt data will be encrypted using TACo threshold encryption. You'll be able to grant and revoke access to specific individuals.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Encryption Options</h3>
                    
                    <FormField
                      control={form.control}
                      name="encryptLineItems"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Encrypt Line Items</FormLabel>
                            <FormDescription>
                              Keep individual purchased items private and encrypted
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="encryptTotals"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Encrypt Detailed Totals</FormLabel>
                            <FormDescription>
                              Keep subtotal and tax information private (total amount will remain visible)
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Summary of Visibility</h3>
                    
                    <div className="border rounded-md divide-y">
                      <div className="p-3 bg-gray-50 dark:bg-gray-900">
                        <h4 className="font-medium">Always Public</h4>
                        <ul className="mt-2 text-sm space-y-1 text-gray-600 dark:text-gray-400">
                          <li className="flex items-center">
                            <ShieldCheck className="h-3 w-3 mr-2" /> Merchant Name
                          </li>
                          <li className="flex items-center">
                            <ShieldCheck className="h-3 w-3 mr-2" /> Date of Purchase
                          </li>
                          <li className="flex items-center">
                            <ShieldCheck className="h-3 w-3 mr-2" /> Total Amount
                          </li>
                          <li className="flex items-center">
                            <ShieldCheck className="h-3 w-3 mr-2" /> Selected NFT Art
                          </li>
                        </ul>
                      </div>
                      
                      <div className="p-3 bg-gray-50 dark:bg-gray-900">
                        <h4 className="font-medium">Conditionally Encrypted</h4>
                        <ul className="mt-2 text-sm space-y-1 text-gray-600 dark:text-gray-400">
                          <li className="flex items-center">
                            <LockIcon className={`h-3 w-3 mr-2 ${form.getValues('encryptLineItems') ? 'text-red-500' : 'text-green-500'}`} />
                            Line Items {form.getValues('encryptLineItems') ? '(Encrypted)' : '(Visible)'}
                          </li>
                          <li className="flex items-center">
                            <LockIcon className={`h-3 w-3 mr-2 ${form.getValues('encryptTotals') ? 'text-red-500' : 'text-green-500'}`} />
                            Subtotal & Tax {form.getValues('encryptTotals') ? '(Encrypted)' : '(Visible)'}
                          </li>
                          <li className="flex items-center">
                            <LockIcon className="h-3 w-3 mr-2 text-red-500" />
                            Notes (Always Encrypted)
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Alert variant="default" className="bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-800">
                    <AlertDescription className="text-sm">
                      After creating your NFT receipt, you'll be able to grant access to specific wallet addresses, and revoke access at any time.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex justify-between w-full">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('nft-art')}>
                      Back to NFT Art
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating Receipt..." : "Create NFT Receipt"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default CreateNFTReceiptForm;
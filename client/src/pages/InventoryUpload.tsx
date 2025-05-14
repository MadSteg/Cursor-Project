import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeft, Plus, Upload, Receipt, ShoppingBag, Tag, Smile } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Define the form schema with validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  quantity: z.coerce.number().int().positive().default(1),
  purchasePrice: z.string().optional(),
  purchaseDate: z.date().optional(),
  expiryDate: z.date().optional(),
  categoryId: z.coerce.number().optional(),
  brandName: z.string().optional(),
  modelNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  currentLocation: z.string().optional(),
  tags: z.array(z.string()).optional(),
  tagInput: z.string().optional(),
  receiptId: z.coerce.number().optional(),
  warrantyExpiryDate: z.date().optional(),
  isReplaceable: z.boolean().default(false),
  replacementInterval: z.coerce.number().int().positive().optional(),
  replacementReminder: z.boolean().default(false),
  notes: z.string().optional(),
  status: z.string().default("active"),
  manualUpload: z.boolean().default(false),
  importFromReceipt: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function InventoryUpload() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('manual');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      quantity: 1,
      purchasePrice: '',
      categoryId: undefined,
      brandName: '',
      modelNumber: '',
      serialNumber: '',
      currentLocation: '',
      tags: [],
      receiptId: undefined,
      isReplaceable: false,
      replacementReminder: false,
      notes: '',
      status: 'active',
      manualUpload: true,
      importFromReceipt: false,
    },
  });

  // Fetch categories for the dropdown
  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      // This will be replaced with a real API call
      return new Promise(resolve => setTimeout(() => {
        resolve([
          { id: 1, name: 'Electronics', color: '#4f46e5', icon: 'smartphone' },
          { id: 2, name: 'Home Appliances', color: '#0891b2', icon: 'home' },
          { id: 3, name: 'Clothing & Accessories', color: '#db2777', icon: 'shirt' },
          { id: 4, name: 'Furniture', color: '#a16207', icon: 'sofa' },
          { id: 5, name: 'Books & Media', color: '#9333ea', icon: 'book' },
          { id: 6, name: 'Groceries', color: '#16a34a', icon: 'shopping-basket' },
        ]);
      }, 500));
    }
  });

  // Fetch receipts for the import option
  const { data: receipts, isLoading: isReceiptsLoading } = useQuery({
    queryKey: ['/api/receipts'],
    queryFn: async () => {
      // This will be replaced with a real API call
      return new Promise(resolve => setTimeout(() => {
        resolve([
          { 
            id: 101, 
            merchant: { name: 'Apple Store' }, 
            date: '2025-04-10', 
            total: '1499.99',
            items: [
              { name: 'iPhone 15 Pro', price: '1299.99', quantity: 1 },
              { name: 'AppleCare+', price: '199.99', quantity: 1 },
            ]
          },
          { 
            id: 102, 
            merchant: { name: 'Best Buy' }, 
            date: '2024-11-15', 
            total: '599.99',
            items: [
              { name: 'Dyson V11 Vacuum', price: '499.99', quantity: 1 },
              { name: 'Extended Warranty', price: '99.99', quantity: 1 },
            ]
          },
          { 
            id: 103, 
            merchant: { name: 'Amazon' }, 
            date: '2024-08-12', 
            total: '389.99',
            items: [
              { name: 'Sony WH-1000XM4 Headphones', price: '349.99', quantity: 1 },
              { name: 'Headphone Case', price: '39.99', quantity: 1 },
            ]
          },
          { 
            id: 104, 
            merchant: { name: 'Target' }, 
            date: '2024-09-05', 
            total: '89.99',
            items: [
              { name: 'Instant Pot Duo', price: '89.99', quantity: 1 },
            ]
          },
          { 
            id: 105, 
            merchant: { name: 'Nike' }, 
            date: '2024-09-20', 
            total: '129.99',
            items: [
              { name: 'Nike Air Zoom Pegasus 38', price: '129.99', quantity: 1 },
            ]
          },
        ]);
      }, 500));
    }
  });

  // Handle tag input
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue('tags', newTags);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue('tags', newTags);
  };

  // Handle form submission
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Replace with actual API call
      return await new Promise(resolve => {
        setTimeout(() => {
          console.log('Submitting data:', data);
          resolve({ success: true, id: 123 });
        }, 1000);
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Item added to inventory",
        description: "Your item has been successfully added to your inventory.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      setLocation(`/inventory/${data.id}`);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error adding item",
        description: "There was a problem adding your item. Please try again.",
      });
      console.error("Error adding inventory item:", error);
    }
  });

  const onSubmit = (data: FormValues) => {
    // Ensure tags are included in form data
    data.tags = tags;
    mutation.mutate(data);
  };

  // Handle receipt selection for import
  const handleReceiptSelect = (receiptId: string) => {
    const selectedReceipt = receipts?.find(r => r.id === parseInt(receiptId));
    if (selectedReceipt) {
      form.setValue('receiptId', selectedReceipt.id);
      
      // Auto-populate fields if this is the first receipt item
      if (selectedReceipt.items && selectedReceipt.items.length === 1) {
        const item = selectedReceipt.items[0];
        form.setValue('name', item.name);
        form.setValue('purchasePrice', item.price);
        form.setValue('quantity', item.quantity);
      }
      
      // Set purchase date from receipt
      if (selectedReceipt.date) {
        form.setValue('purchaseDate', new Date(selectedReceipt.date));
      }
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/inventory')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Add to Inventory</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add Item Methods</CardTitle>
              <CardDescription>
                Choose how you want to add an item to your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="manual" onClick={() => form.setValue('manualUpload', true)}>
                    Manual
                  </TabsTrigger>
                  <TabsTrigger value="receipt" onClick={() => form.setValue('importFromReceipt', true)}>
                    From Receipt
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="manual" className="space-y-4">
                  <div className="flex items-center p-4 border border-dashed rounded-lg">
                    <div className="rounded-full p-2 bg-primary/10 mr-4">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Manual Entry</h3>
                      <p className="text-muted-foreground text-sm">
                        Add an item without connecting it to a receipt
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="receipt" className="space-y-4">
                  <div className="flex items-center p-4 border border-dashed rounded-lg">
                    <div className="rounded-full p-2 bg-primary/10 mr-4">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">From Receipt</h3>
                      <p className="text-muted-foreground text-sm">
                        Import details from an existing receipt
                      </p>
                    </div>
                  </div>
                  
                  {isReceiptsLoading ? (
                    <p className="text-sm text-muted-foreground py-2">Loading receipts...</p>
                  ) : receipts && receipts.length > 0 ? (
                    <div className="mt-4">
                      <FormLabel>Select Receipt</FormLabel>
                      <Select 
                        onValueChange={handleReceiptSelect}
                        disabled={mutation.isPending}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a receipt" />
                        </SelectTrigger>
                        <SelectContent>
                          {receipts.map(receipt => (
                            <SelectItem key={receipt.id} value={receipt.id.toString()}>
                              {receipt.merchant.name} - ${receipt.total} ({format(new Date(receipt.date), 'PP')})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground py-2">No receipts found</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span>Add tags to make your items easier to find</span>
                </p>
                <p className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-primary" />
                  <span>Link to a receipt for warranty claims</span>
                </p>
                <p className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  <span>Include brand and model for accurate records</span>
                </p>
                <p className="flex items-center gap-2">
                  <Smile className="h-4 w-4 text-primary" />
                  <span>Track location to always know where your items are</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Item Information</CardTitle>
              <CardDescription>
                Enter the details of the item you want to add to your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter item name" 
                              {...field} 
                              disabled={mutation.isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                {...field} 
                                disabled={mutation.isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="purchasePrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Purchase Price</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="0.00" 
                                {...field} 
                                disabled={mutation.isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="purchaseDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Purchase Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                    disabled={mutation.isPending}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value?.toString()}
                              disabled={mutation.isPending || isCategoriesLoading}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories?.map((category: any) => (
                                  <SelectItem key={category.id} value={category.id.toString()}>
                                    <div className="flex items-center">
                                      <div 
                                        className="w-2 h-2 rounded-full mr-2"
                                        style={{ backgroundColor: category.color }}
                                      />
                                      {category.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="brandName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Brand name" 
                                {...field} 
                                disabled={mutation.isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="modelNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Model number" 
                                {...field} 
                                disabled={mutation.isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="serialNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Serial Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Serial number" 
                                {...field} 
                                disabled={mutation.isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="currentLocation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Location</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Where is this item stored?" 
                                {...field} 
                                disabled={mutation.isPending}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="warrantyExpiryDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Warranty Expiry Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                    disabled={mutation.isPending}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              disabled={mutation.isPending}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="used">Used</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                                <SelectItem value="sold">Sold</SelectItem>
                                <SelectItem value="damaged">Damaged</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <FormLabel>Tags</FormLabel>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add tags (press Enter)"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTag();
                            }
                          }}
                          disabled={mutation.isPending}
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddTag}
                          disabled={mutation.isPending}
                        >
                          Add
                        </Button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map(tag => (
                            <Badge 
                              key={tag} 
                              variant="secondary"
                              className="gap-1"
                            >
                              {tag}
                              <button
                                type="button"
                                className="ml-1 rounded-full hover:bg-muted p-0.5"
                                onClick={() => handleRemoveTag(tag)}
                                disabled={mutation.isPending}
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <FormField
                      control={form.control}
                      name="isReplaceable"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={mutation.isPending}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>This is a consumable item</FormLabel>
                            <FormDescription>
                              Mark if this item will need to be replaced in the future (like food, supplies, etc.)
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    {form.watch('isReplaceable') && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="replacementInterval"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Replacement Interval (days)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="30" 
                                    {...field} 
                                    disabled={mutation.isPending}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="replacementReminder"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={mutation.isPending}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>Enable replacement reminders</FormLabel>
                                  <FormDescription>
                                    You'll be notified when it's time to replace this item
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter item description" 
                              className="min-h-24"
                              {...field} 
                              disabled={mutation.isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add any additional notes about this item" 
                              className="min-h-24"
                              {...field} 
                              disabled={mutation.isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <CardFooter className="px-0 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation('/inventory')}
                      disabled={mutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={mutation.isPending}
                      className="gap-2"
                    >
                      {mutation.isPending ? "Adding..." : "Add to Inventory"}
                      {!mutation.isPending && <Upload className="h-4 w-4" />}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
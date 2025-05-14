import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Upload,
  Image,
  X,
  Calendar,
  Receipt,
  CreditCard,
  Shield,
  Smartphone
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Form schema
const inventoryItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().optional(),
  serialNumber: z.string().optional(),
  modelNumber: z.string().optional(),
  brandName: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.string().default('active'),
  condition: z.string().default('new'),
  purchaseDate: z.string().optional(),
  purchasePrice: z.string().optional(),
  retailer: z.string().optional(),
  purchaseLocation: z.string().optional(),
  paymentMethod: z.string().optional(),
  orderNumber: z.string().optional(),
  receiptId: z.string().optional(),
  imageUrl: z.string().optional(),
  location: z.string().optional(),
  color: z.string().optional(),
  dimensions: z.string().optional(),
  weight: z.string().optional(),
  notes: z.string().optional(),
  hasWarranty: z.boolean().default(false),
  warranty: z.object({
    provider: z.string().optional(),
    coverageType: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    lengthInMonths: z.string().optional(),
    contactInfo: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
  customFields: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    })
  ).optional(),
});

type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>;

// Custom field component
const CustomField = ({ 
  index, 
  remove, 
  register 
}: { 
  index: number, 
  remove: (index: number) => void,
  register: any
}) => (
  <div className="flex gap-2 items-start mb-2">
    <div className="flex-grow">
      <Input 
        placeholder="Field name" 
        {...register(`customFields.${index}.name`)}
        className="mb-1" 
      />
      <Input 
        placeholder="Field value" 
        {...register(`customFields.${index}.value`)}
      />
    </div>
    <Button 
      type="button" 
      variant="ghost" 
      size="sm" 
      onClick={() => remove(index)}
      className="mt-1"
    >
      <X className="h-4 w-4" />
    </Button>
  </div>
);

export default function InventoryUpload() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [customFields, setCustomFields] = useState<{name: string, value: string}[]>([]);
  const [isEditMode, setIsEditMode] = useState(!!id);
  
  // Get categories for the dropdown
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    },
  });
  
  // Get receipts for the dropdown
  const { data: receipts } = useQuery({
    queryKey: ['/api/receipts'],
    queryFn: async () => {
      const response = await fetch('/api/receipts');
      if (!response.ok) {
        throw new Error('Failed to fetch receipts');
      }
      return response.json();
    },
  });
  
  // Get item details if in edit mode
  const { data: itemDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: ['/api/inventory', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await fetch(`/api/inventory/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch item details');
      }
      return response.json();
    },
    enabled: !!id,
  });
  
  // Create form
  const form = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      condition: 'new',
      hasWarranty: false,
      warranty: {
        provider: '',
        coverageType: '',
        startDate: '',
        endDate: '',
        lengthInMonths: '',
        contactInfo: '',
        notes: '',
      },
      customFields: [],
    },
  });
  
  // Populate form with item details when available
  useEffect(() => {
    if (isEditMode && itemDetails) {
      // Create a copy of the data to modify safely
      const formData = { ...itemDetails };
      
      // Format the date fields to YYYY-MM-DD for input[type="date"]
      if (formData.purchaseDate) {
        const date = new Date(formData.purchaseDate);
        formData.purchaseDate = date.toISOString().split('T')[0];
      }
      
      if (formData.warranty?.startDate) {
        const date = new Date(formData.warranty.startDate);
        formData.warranty.startDate = date.toISOString().split('T')[0];
      }
      
      if (formData.warranty?.endDate) {
        const date = new Date(formData.warranty.endDate);
        formData.warranty.endDate = date.toISOString().split('T')[0];
      }
      
      // Set hasWarranty flag
      formData.hasWarranty = !!formData.warranty;
      
      // Convert categoryId to string (select inputs expect string values)
      if (formData.categoryId) {
        formData.categoryId = formData.categoryId.toString();
      }
      
      if (formData.receiptId) {
        formData.receiptId = formData.receiptId.toString();
      }
      
      // Set image preview if available
      if (formData.imageUrl) {
        setImagePreview(formData.imageUrl);
      }
      
      // Set custom fields
      if (formData.customFields) {
        setCustomFields(formData.customFields);
      }
      
      // Reset form with the data
      form.reset(formData);
    }
  }, [form, isEditMode, itemDetails]);
  
  // Add custom field handler
  const addCustomField = () => {
    setCustomFields([...customFields, { name: '', value: '' }]);
  };
  
  // Remove custom field handler
  const removeCustomField = (index: number) => {
    const updatedFields = [...customFields];
    updatedFields.splice(index, 1);
    setCustomFields(updatedFields);
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Remove uploaded image
  const handleRemoveImage = () => {
    setImagePreview(null);
  };
  
  // Create/update item mutation
  const mutation = useMutation({
    mutationFn: async (data: InventoryItemFormValues) => {
      // Clone the data before modifying
      const formattedData = { ...data };
      
      // Include imageUrl if available
      if (imagePreview) {
        formattedData.imageUrl = imagePreview;
      }
      
      // Include custom fields
      formattedData.customFields = customFields;
      
      // Only include warranty if hasWarranty is true
      if (!formattedData.hasWarranty) {
        delete formattedData.warranty;
      }
      
      // Remove hasWarranty as it's not part of the actual model
      delete formattedData.hasWarranty;
      
      if (isEditMode) {
        return apiRequest('PATCH', `/api/inventory/${id}`, formattedData);
      } else {
        return apiRequest('POST', '/api/inventory', formattedData);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQuery({ queryKey: ['/api/inventory'] });
      toast({
        title: isEditMode ? 'Item Updated' : 'Item Added',
        description: isEditMode ? 'The inventory item has been updated successfully.' : 'The item has been added to your inventory.',
      });
      setLocation(`/inventory/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'add'} item: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: InventoryItemFormValues) => {
    mutation.mutate(data);
  };
  
  if (isEditMode && isLoadingDetails) {
    return (
      <main className="container py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1"
              onClick={() => setLocation('/inventory')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Inventory
            </Button>
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-10 w-60" />
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Skeleton className="h-64 w-full rounded-md" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => setLocation('/inventory')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Inventory
          </Button>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold mb-2">
            {isEditMode ? 'Edit Inventory Item' : 'Add New Inventory Item'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode 
              ? 'Update the details of your inventory item.' 
              : 'Fill in the details to add an item to your inventory.'}
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <h2 className="text-lg font-medium">Basic Information</h2>
                      <Separator />
                      
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Item Name*</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter item name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter a description of the item" 
                                className="resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="brandName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Brand</FormLabel>
                              <FormControl>
                                <Input placeholder="Brand name" {...field} />
                              </FormControl>
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
                                defaultValue={field.value}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories?.map((category: any) => (
                                    <SelectItem 
                                      key={category.id} 
                                      value={category.id.toString()}
                                    >
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <h2 className="text-lg font-medium">Image</h2>
                      <Separator />
                      
                      <div className="space-y-4">
                        {imagePreview ? (
                          <div className="relative">
                            <img 
                              src={imagePreview} 
                              alt="Item preview" 
                              className="max-h-64 rounded-md border w-full object-contain" 
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={handleRemoveImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed rounded-md p-6 text-center">
                            <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                            <div className="text-sm text-muted-foreground mb-4">
                              Upload an image of your item
                            </div>
                            <input
                              type="file"
                              id="image-upload"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                            <label htmlFor="image-upload">
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="gap-2"
                                asChild
                              >
                                <span>
                                  <Upload className="h-4 w-4" />
                                  Upload Image
                                </span>
                              </Button>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <h2 className="text-lg font-medium">Product Details</h2>
                      <Separator />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="serialNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Serial Number</FormLabel>
                              <FormControl>
                                <Input placeholder="Serial number" {...field} />
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
                                <Input placeholder="Model number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="color"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Color</FormLabel>
                              <FormControl>
                                <Input placeholder="Color" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="dimensions"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dimensions</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 10x20x30 cm" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 1.5 kg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Right column */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <Tabs defaultValue="status">
                      <TabsList className="mb-4">
                        <TabsTrigger value="status">Status</TabsTrigger>
                        <TabsTrigger value="purchase">Purchase Info</TabsTrigger>
                        <TabsTrigger value="warranty">Warranty</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="status" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="used">Used</SelectItem>
                                    <SelectItem value="sold">Sold</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                    <SelectItem value="damaged">Damaged</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="condition"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Condition</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="like-new">Like New</SelectItem>
                                    <SelectItem value="good">Good</SelectItem>
                                    <SelectItem value="fair">Fair</SelectItem>
                                    <SelectItem value="poor">Poor</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Storage Location</FormLabel>
                              <FormControl>
                                <Input placeholder="Where the item is stored" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      
                      <TabsContent value="purchase" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="purchaseDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Purchase Date</FormLabel>
                                <div className="relative">
                                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <FormControl>
                                    <Input 
                                      type="date" 
                                      placeholder="YYYY-MM-DD" 
                                      className="pl-10"
                                      {...field} 
                                    />
                                  </FormControl>
                                </div>
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
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      step="0.01" 
                                      placeholder="0.00" 
                                      className="pl-8"
                                      {...field} 
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="retailer"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Retailer</FormLabel>
                                <FormControl>
                                  <Input placeholder="Store or website" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="purchaseLocation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Purchase Location</FormLabel>
                                <FormControl>
                                  <Input placeholder="City, country or website" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Payment Method</FormLabel>
                                <div className="relative">
                                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <FormControl>
                                    <Input 
                                      placeholder="Credit card, PayPal, etc." 
                                      className="pl-10"
                                      {...field} 
                                    />
                                  </FormControl>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="orderNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Order Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="Order reference number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name="receiptId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Link to Receipt</FormLabel>
                              <div className="relative">
                                <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="pl-10">
                                      <SelectValue placeholder="Link to a receipt" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="">None</SelectItem>
                                    {receipts?.map((receipt: any) => (
                                      <SelectItem 
                                        key={receipt.id} 
                                        value={receipt.id.toString()}
                                      >
                                        {receipt.merchant?.name || 'Unknown'} - ${receipt.total} 
                                        ({new Date(receipt.date).toLocaleDateString()})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                      
                      <TabsContent value="warranty" className="space-y-4">
                        <FormField
                          control={form.control}
                          name="hasWarranty"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Warranty Coverage</FormLabel>
                                <FormDescription>
                                  Does this item have a warranty?
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        {form.watch('hasWarranty') && (
                          <div className="border rounded-lg p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="warranty.provider"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Provider</FormLabel>
                                    <div className="relative">
                                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                      <FormControl>
                                        <Input 
                                          placeholder="Warranty provider" 
                                          className="pl-10"
                                          {...field} 
                                        />
                                      </FormControl>
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="warranty.coverageType"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Coverage Type</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="e.g., Full, Limited, Extended" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="warranty.startDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="date" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="warranty.endDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="date" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="warranty.lengthInMonths"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Duration (months)</FormLabel>
                                    <FormControl>
                                      <Input 
                                        type="number" 
                                        placeholder="e.g., 12, 24, 36" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="warranty.contactInfo"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Contact Information</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Email, phone or website" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="warranty.notes"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Warranty Notes</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Additional information about the warranty" 
                                      className="resize-none"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <h2 className="text-lg font-medium">Additional Information</h2>
                      <Separator />
                      
                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Additional notes about this item" 
                                className="resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <FormLabel>Custom Fields</FormLabel>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={addCustomField}
                          >
                            Add Field
                          </Button>
                        </div>
                        
                        <div className="space-y-2 mt-2">
                          {customFields.map((field, index) => (
                            <CustomField 
                              key={index} 
                              index={index} 
                              remove={removeCustomField}
                              register={form.register}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setLocation('/inventory')}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? 'Saving...' : isEditMode ? 'Update Item' : 'Add Item'}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
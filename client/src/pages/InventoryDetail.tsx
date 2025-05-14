import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Calendar,
  Tag,
  Bookmark,
  Clock,
  Edit,
  Trash2,
  ArrowLeft,
  Package,
  Receipt,
  ExternalLink,
  CreditCard,
  Share2,
  Info,
  AlertCircle,
  Shield,
  BarChart,
  Plus,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Separator } from "@/components/ui/separator";
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function InventoryDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Fetch inventory item details
  const { data: item, isLoading } = useQuery({
    queryKey: ['/api/inventory', id],
    queryFn: async () => {
      const response = await fetch(`/api/inventory/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch inventory item details');
      }
      return response.json();
    },
  });
  
  // Delete inventory item mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('DELETE', `/api/inventory/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQuery({ queryKey: ['/api/inventory'] });
      setLocation('/inventory');
      toast({
        title: 'Item Deleted',
        description: 'The inventory item has been deleted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to delete item: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
    setIsDeleteDialogOpen(false);
  };

  // Status badge configuration
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", icon: React.ReactNode }> = {
      'active': { variant: 'default', icon: <Shield className="h-3 w-3" /> },
      'used': { variant: 'secondary', icon: <Clock className="h-3 w-3" /> },
      'expired': { variant: 'destructive', icon: <AlertCircle className="h-3 w-3" /> },
      'sold': { variant: 'outline', icon: <Package className="h-3 w-3" /> },
      'damaged': { variant: 'destructive', icon: <AlertCircle className="h-3 w-3" /> }
    };

    const config = statusConfig[status] || { variant: 'secondary', icon: null };
    
    return (
      <Badge variant={config.variant} className="gap-1 text-xs">
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };
  
  if (isLoading) {
    return (
      <main className="container py-8">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-24 rounded" />
                <Skeleton className="h-24 rounded" />
                <Skeleton className="h-24 rounded" />
                <Skeleton className="h-24 rounded" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  if (!item) {
    return (
      <main className="container py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Item Not Found</h2>
          <p className="text-muted-foreground mb-6">The inventory item you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => setLocation('/inventory')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Inventory
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1"
            onClick={() => setLocation('/inventory')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Inventory
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setLocation(`/inventory/${id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Image and quick info */}
          <div className="md:col-span-1">
            <div className="bg-muted rounded-lg overflow-hidden aspect-square flex items-center justify-center">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-24 w-24 text-muted-foreground/30" />
              )}
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                {item.status && getStatusBadge(item.status)}
                {item.warranty && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Shield className="h-3 w-3" />
                    Warranty
                  </Badge>
                )}
              </div>
              
              {item.receipt && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Receipt className="h-4 w-4" />
                  <span>Linked to receipt</span>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="h-auto p-0 text-sm"
                    onClick={() => setLocation(`/receipts/${item.receipt.id}`)}
                  >
                    View Receipt
                  </Button>
                </div>
              )}
              
              <div className="pt-4">
                <h3 className="text-sm font-medium mb-2">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="justify-start">
                    <Bookmark className="mr-2 h-4 w-4" />
                    Add to Collection
                  </Button>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Item
                  </Button>
                  {item.warranty && (
                    <Button variant="outline" size="sm" className="justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Track Warranty
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="justify-start">
                    <BarChart className="mr-2 h-4 w-4" />
                    Price History
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{item.name}</h1>
              <div className="flex flex-wrap gap-2 my-2">
                {item.category && (
                  <Badge 
                    variant="outline" 
                    className="gap-1"
                    style={item.category.color ? {
                      borderColor: item.category.color,
                      color: item.category.color
                    } : undefined}
                  >
                    <Tag className="h-3 w-3" />
                    {item.category.name}
                  </Badge>
                )}
                {item.brandName && (
                  <Badge variant="secondary" className="gap-1">
                    {item.brandName}
                    {item.modelNumber && ` · ${item.modelNumber}`}
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground mt-4">
                {item.description || 'No description available.'}
              </p>
            </div>
            
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="purchase">Purchase Info</TabsTrigger>
                {item.warranty && <TabsTrigger value="warranty">Warranty</TabsTrigger>}
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Product Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      {item.serialNumber && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Serial Number</span>
                          <span className="text-sm font-medium">{item.serialNumber}</span>
                        </div>
                      )}
                      {item.sku && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">SKU</span>
                          <span className="text-sm font-medium">{item.sku}</span>
                        </div>
                      )}
                      {item.dimensions && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Dimensions</span>
                          <span className="text-sm font-medium">{item.dimensions}</span>
                        </div>
                      )}
                      {item.weight && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Weight</span>
                          <span className="text-sm font-medium">{item.weight}</span>
                        </div>
                      )}
                      {item.color && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Color</span>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-medium">{item.color}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Status Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current Status</span>
                        <span className="text-sm font-medium capitalize">{item.status || 'Active'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Condition</span>
                        <span className="text-sm font-medium capitalize">{item.condition || 'New'}</span>
                      </div>
                      {item.location && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Storage Location</span>
                          <span className="text-sm font-medium">{item.location}</span>
                        </div>
                      )}
                      {item.addedToInventoryDate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Added to Inventory</span>
                          <span className="text-sm font-medium">
                            {new Date(item.addedToInventoryDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {item.customFields && item.customFields.length > 0 && (
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      {item.customFields.map((field: any, index: number) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{field.name}</span>
                          <span className="text-sm font-medium">{field.value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="purchase" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Purchase Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      {item.purchaseDate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Purchase Date</span>
                          <span className="text-sm font-medium">
                            {new Date(item.purchaseDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {item.purchasePrice && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Purchase Price</span>
                          <span className="text-sm font-medium">
                            ${parseFloat(item.purchasePrice).toFixed(2)}
                          </span>
                        </div>
                      )}
                      {item.retailer && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Retailer</span>
                          <span className="text-sm font-medium">{item.retailer}</span>
                        </div>
                      )}
                      {item.purchaseLocation && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Purchase Location</span>
                          <span className="text-sm font-medium">{item.purchaseLocation}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      {item.paymentMethod && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Payment Method</span>
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            <span className="text-sm font-medium">{item.paymentMethod}</span>
                          </div>
                        </div>
                      )}
                      {item.orderNumber && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Order Number</span>
                          <span className="text-sm font-medium">{item.orderNumber}</span>
                        </div>
                      )}
                      {item.receipt && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Receipt ID</span>
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="h-auto p-0 text-sm"
                            onClick={() => setLocation(`/receipts/${item.receipt.id}`)}
                          >
                            #{item.receipt.id}
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      {item.receipt?.nftTokenId && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">NFT Receipt</span>
                          <Badge variant="outline" className="gap-1 text-xs">
                            Token #{item.receipt.nftTokenId}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {item.warranty && (
                <TabsContent value="warranty" className="space-y-4 pt-4">
                  <Card>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-sm font-medium">Warranty Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      {item.warranty.provider && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Provider</span>
                          <span className="text-sm font-medium">{item.warranty.provider}</span>
                        </div>
                      )}
                      {item.warranty.coverageType && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Coverage Type</span>
                          <span className="text-sm font-medium">{item.warranty.coverageType}</span>
                        </div>
                      )}
                      {item.warranty.startDate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Start Date</span>
                          <span className="text-sm font-medium">
                            {new Date(item.warranty.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {item.warranty.endDate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">End Date</span>
                          <span className="text-sm font-medium">
                            {new Date(item.warranty.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {item.warranty.lengthInMonths && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Length</span>
                          <span className="text-sm font-medium">
                            {item.warranty.lengthInMonths} months
                          </span>
                        </div>
                      )}
                      {item.warranty.contactInfo && (
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Contact Information</span>
                          <span className="text-sm font-medium">{item.warranty.contactInfo}</span>
                        </div>
                      )}
                      {item.warranty.notes && (
                        <div className="mt-2">
                          <span className="text-sm text-muted-foreground">Notes</span>
                          <p className="text-sm mt-1">{item.warranty.notes}</p>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button size="sm" className="gap-1 ml-auto mt-2">
                        <Calendar className="h-4 w-4" />
                        Set Reminder
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              )}
              
              <TabsContent value="notes" className="space-y-4 pt-4">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    {item.notes ? (
                      <p className="text-sm whitespace-pre-wrap">{item.notes}</p>
                    ) : (
                      <div className="text-center py-6">
                        <Info className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No notes added yet</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button size="sm" className="gap-1 ml-auto">
                      <Plus className="h-4 w-4" />
                      Add Note
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
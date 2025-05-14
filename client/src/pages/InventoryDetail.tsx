import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  ShoppingBag, 
  Calendar, 
  Tag, 
  Box, 
  Copy, 
  Clock, 
  Share2, 
  FileBadge,
  QrCode,
  history 
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return format(date, 'PPP');
  } catch (e) {
    return 'Invalid date';
  }
};

// Property row component
const PropertyRow = ({ label, value, icon: Icon, className = '', valueClassName = '' }: { 
  label: string; 
  value: React.ReactNode; 
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  valueClassName?: string;
}) => (
  <div className={`flex items-start py-2 ${className}`}>
    <div className="w-40 flex items-center gap-2 text-muted-foreground">
      {Icon && <Icon className="h-4 w-4" />}
      <span>{label}</span>
    </div>
    <div className={`flex-1 ${valueClassName}`}>{value}</div>
  </div>
);

export default function InventoryDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch inventory item details
  const { data: item, isLoading } = useQuery({
    queryKey: [`/api/inventory/${id}`],
    queryFn: async () => {
      // This will be replaced with a real API call
      return new Promise(resolve => setTimeout(() => {
        resolve({
          id: parseInt(id as string),
          name: 'Apple iPhone 15 Pro',
          description: 'Latest iPhone model with 256GB storage in titanium blue finish. Premium smartphone with advanced camera system and A17 Pro chip.',
          quantity: 1,
          purchasePrice: '1299.99',
          purchaseDate: '2025-04-10',
          expiryDate: null,
          category: {
            id: 1, 
            name: 'Electronics',
            color: '#4f46e5',
            icon: 'smartphone'
          },
          receipt: {
            id: 101,
            date: '2025-04-10',
            merchant: {
              name: 'Apple Store',
              logo: 'https://placehold.co/100x100?text=Apple'
            },
            blockchainVerified: true,
            nftTokenId: '0x123abc'
          },
          brand: 'Apple',
          model: 'iPhone 15 Pro',
          serial: 'IMEI123456789',
          warranty: {
            expiryDate: '2026-04-10',
            daysRemaining: 360,
            status: 'active'
          },
          location: 'Home Office',
          status: 'active',
          lastUsed: '2025-05-14',
          isReplaceable: false,
          collections: [
            {
              id: 1,
              name: 'Tech Devices',
              color: '#4f46e5',
              icon: 'laptop'
            },
            {
              id: 2,
              name: 'Apple Products',
              color: '#0891b2',
              icon: 'apple'
            }
          ],
          tags: ['tech', 'smartphone', 'apple'],
          notes: 'Purchased with AppleCare+ protection plan. Keep the box for warranty claims.',
          imageUrl: 'https://placehold.co/600x400?text=iPhone15Pro'
        });
      }, 1000));
    }
  });

  const handleDelete = () => {
    // Handle deletion logic here
    setDeleteDialogOpen(false);
    // Navigate back to inventory after deletion
    setLocation('/inventory');
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => setLocation('/inventory')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Skeleton className="h-64 w-full rounded-lg mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-full ml-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-full ml-4" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container py-8">
        <Button variant="ghost" onClick={() => setLocation('/inventory')}>
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Inventory
        </Button>
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Box className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Item Not Found</h3>
          <p className="text-muted-foreground mb-4">
            The inventory item you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => setLocation('/inventory')}>Return to Inventory</Button>
        </div>
      </div>
    );
  }

  const statusBadgeVariant = 
    item.status === 'active' ? 'default' : 
    item.status === 'expired' ? 'destructive' : 
    'secondary';

  const warrantyBadgeVariant = 
    !item.warranty ? 'outline' :
    item.warranty.status === 'active' ? 'outline' : 
    'destructive';
  
  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/inventory')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{item.name}</h1>
        <Badge variant={statusBadgeVariant}>
          {item.status}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card className="overflow-hidden">
            <div className="aspect-square bg-muted flex items-center justify-center">
              {item.imageUrl ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <Box className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            {item.receipt && (
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Purchase Receipt</h3>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.receipt.date)} • {item.receipt.merchant.name}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setLocation(`/receipts/${item.receipt.id}`)}
                  >
                    View
                  </Button>
                </div>
                {item.receipt.blockchainVerified && (
                  <Badge variant="outline" className="mt-2 gap-1">
                    <FileBadge className="h-3 w-3" />
                    NFT Receipt
                  </Badge>
                )}
              </CardContent>
            )}
          </Card>
          
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              className="justify-start" 
              onClick={() => setLocation(`/inventory/${id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Item
            </Button>
            
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="justify-start text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Item
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the item
                    from your inventory.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            {item.warranty && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Warranty Info
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Warranty Information</DialogTitle>
                    <DialogDescription>
                      Details about your product warranty
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={warrantyBadgeVariant}>{item.warranty.status}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expiry Date:</span>
                      <span>{formatDate(item.warranty.expiryDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time Remaining:</span>
                      <span>{item.warranty.daysRemaining} days</span>
                    </div>
                    <Separator />
                    <div className="text-sm text-muted-foreground">
                      You can register your product for warranty through the manufacturer's website
                      using your Serial Number: <span className="font-mono">{item.serial}</span>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button>Register Warranty</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
            
            <Button variant="outline" className="justify-start">
              <QrCode className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
            
            <Button variant="outline" className="justify-start">
              <Share2 className="h-4 w-4 mr-2" />
              Share Item
            </Button>
          </div>
          
          {item.collections && item.collections.length > 0 && (
            <Card>
              <CardHeader className="py-4 px-5">
                <CardTitle className="text-sm">Collections</CardTitle>
              </CardHeader>
              <CardContent className="py-0 px-5">
                <div className="space-y-2">
                  {item.collections.map(collection => (
                    <div 
                      key={collection.id} 
                      className="flex items-center py-2 border-b last:border-0"
                      style={{ borderColor: 'hsl(var(--border))' }}
                    >
                      <div 
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: collection.color }}
                      />
                      <span>{collection.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {item.tags && item.tags.length > 0 && (
            <Card>
              <CardHeader className="py-4 px-5">
                <CardTitle className="text-sm">Tags</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-5">
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
              <TabsTrigger value="usage" className="flex-1">Usage & Notes</TabsTrigger>
              {item.receipt && (
                <TabsTrigger value="receipt" className="flex-1">Receipt</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="details" className="space-y-6 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Product Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {item.description && (
                      <PropertyRow 
                        label="Description" 
                        value={item.description}
                      />
                    )}
                    <PropertyRow 
                      label="Quantity" 
                      value={item.quantity.toString()}
                      icon={Box}
                    />
                    {item.brand && (
                      <PropertyRow 
                        label="Brand" 
                        value={item.brand}
                        icon={ShoppingBag}
                      />
                    )}
                    {item.model && (
                      <PropertyRow 
                        label="Model" 
                        value={item.model}
                      />
                    )}
                    {item.serial && (
                      <PropertyRow 
                        label="Serial Number" 
                        value={
                          <div className="flex items-center">
                            <code className="bg-muted px-1 py-0.5 rounded font-mono text-sm">
                              {item.serial}
                            </code>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 ml-2"
                              onClick={() => navigator.clipboard.writeText(item.serial)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        }
                      />
                    )}
                    {item.category && (
                      <PropertyRow 
                        label="Category" 
                        value={
                          <Badge 
                            variant="outline" 
                            className="gap-1.5"
                            style={{ borderColor: item.category.color }}
                          >
                            <div 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: item.category.color }}
                            />
                            {item.category.name}
                          </Badge>
                        }
                        icon={Tag}
                      />
                    )}
                    {item.location && (
                      <PropertyRow 
                        label="Location" 
                        value={item.location}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Purchase Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <PropertyRow 
                      label="Purchase Date" 
                      value={formatDate(item.purchaseDate)}
                      icon={Calendar}
                    />
                    {item.purchasePrice && (
                      <PropertyRow 
                        label="Purchase Price" 
                        value={`$${parseFloat(item.purchasePrice).toFixed(2)}`}
                      />
                    )}
                    {item.warranty && (
                      <PropertyRow 
                        label="Warranty Status" 
                        value={
                          <div className="flex items-center gap-2">
                            <Badge variant={warrantyBadgeVariant}>
                              {item.warranty.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              ({item.warranty.daysRemaining} days remaining)
                            </span>
                          </div>
                        }
                      />
                    )}
                    {item.isReplaceable !== undefined && (
                      <PropertyRow 
                        label="Replaceable" 
                        value={item.isReplaceable ? "Yes" : "No"}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="usage" className="space-y-6 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Usage Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <PropertyRow 
                      label="Current Status" 
                      value={
                        <Badge variant={statusBadgeVariant}>
                          {item.status}
                        </Badge>
                      }
                    />
                    {item.lastUsed && (
                      <PropertyRow 
                        label="Last Used" 
                        value={formatDate(item.lastUsed)}
                        icon={Clock}
                      />
                    )}
                    {item.expiryDate && (
                      <PropertyRow 
                        label="Expires On" 
                        value={formatDate(item.expiryDate)}
                        icon={Calendar}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {item.notes && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-muted rounded-md text-sm">
                      {item.notes}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            {item.receipt && (
              <TabsContent value="receipt" className="space-y-6 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Receipt Information</CardTitle>
                    {item.receipt.blockchainVerified && (
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                          <FileBadge className="h-3 w-3" />
                          Blockchain Verified
                        </Badge>
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <PropertyRow 
                        label="Merchant" 
                        value={item.receipt.merchant.name}
                        icon={ShoppingBag}
                      />
                      <PropertyRow 
                        label="Purchase Date" 
                        value={formatDate(item.receipt.date)}
                        icon={Calendar}
                      />
                      {item.receipt.nftTokenId && (
                        <PropertyRow 
                          label="NFT Token ID" 
                          value={
                            <div className="flex items-center">
                              <code className="bg-muted px-1 py-0.5 rounded font-mono text-sm">
                                {item.receipt.nftTokenId}
                              </code>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 ml-2"
                                onClick={() => navigator.clipboard.writeText(item.receipt.nftTokenId)}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          }
                        />
                      )}
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setLocation(`/receipts/${item.receipt.id}`)}
                      >
                        View Full Receipt
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
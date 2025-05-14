import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { PlusCircle, Search, Tag, Filter, Box, Calendar, LifeBuoy, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { queryClient } from '@/lib/queryClient';
import { formatDistanceToNow } from 'date-fns';

// Helper function to format date for display
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} (${formatDistanceToNow(date, { addSuffix: true })})`;
};

// Card for displaying an inventory item
const InventoryItemCard = ({ item }: { item: any }) => {
  const warranty = item.warranty?.expiryDate ? (
    <Badge variant={item.warranty.status === 'active' ? 'outline' : 'destructive'} className="ml-2">
      Warranty: {item.warranty.status}
    </Badge>
  ) : null;

  return (
    <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">{item.name}</CardTitle>
          <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
            {item.status}
          </Badge>
        </div>
        <CardDescription className="flex flex-wrap gap-1 items-center text-xs">
          {item.brand && <span className="font-medium">{item.brand}</span>}
          {item.model && <span>Model: {item.model}</span>}
          {warranty}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-32 rounded-md mb-2 bg-muted flex items-center justify-center overflow-hidden">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <Box className="h-10 w-10 text-muted-foreground opacity-50" />
          )}
        </div>
        <div className="space-y-1 text-sm">
          {item.location && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>Location: {item.location}</span>
            </div>
          )}
          {item.purchaseDate && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <span>Purchased: {formatDate(item.purchaseDate)}</span>
            </div>
          )}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2 border-t flex justify-between">
        <div className="text-sm text-muted-foreground">
          Qty: {item.quantity}
        </div>
        <Link to={`/inventory/${item.id}`}>
          <Button size="sm" variant="outline">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

// Skeleton for loading state
const InventoryItemSkeleton = () => (
  <Card className="h-full">
    <CardHeader className="p-4 pb-2">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <Skeleton className="h-32 w-full mb-2 rounded-md" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </CardContent>
    <CardFooter className="p-4 pt-2 border-t flex justify-between">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-8 w-24" />
    </CardFooter>
  </Card>
);

export default function Inventory() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch inventory items - we're using mock data for now
  const { data: inventoryItems, isLoading } = useQuery({
    queryKey: ['/api/inventory'],
    queryFn: async () => {
      // This will be replaced with a real API call
      return new Promise(resolve => setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'Apple iPhone 15 Pro',
            description: 'Latest iPhone model with 256GB storage',
            quantity: 1,
            purchasePrice: '1299.99',
            purchaseDate: '2025-04-10',
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
                logo: 'https://example.com/apple.png'
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
            tags: ['tech', 'smartphone', 'apple'],
            imageUrl: 'https://placehold.co/600x400?text=iPhone15Pro'
          },
          {
            id: 2,
            name: 'Dyson V11 Vacuum',
            description: 'Cordless vacuum cleaner',
            quantity: 1,
            purchasePrice: '499.99',
            purchaseDate: '2024-11-15',
            category: {
              id: 2,
              name: 'Home Appliances',
              color: '#0891b2',
              icon: 'home'
            },
            receipt: {
              id: 102,
              date: '2024-11-15',
              merchant: {
                name: 'Best Buy',
                logo: 'https://example.com/bestbuy.png'
              }
            },
            brand: 'Dyson',
            model: 'V11 Absolute',
            serial: 'DYS987654321',
            warranty: {
              expiryDate: '2026-11-15',
              daysRemaining: 580,
              status: 'active'
            },
            location: 'Storage Closet',
            status: 'active',
            tags: ['appliance', 'cleaning', 'household'],
            imageUrl: 'https://placehold.co/600x400?text=DysonV11'
          },
          {
            id: 3,
            name: 'Nike Air Zoom Pegasus 38',
            description: 'Running shoes',
            quantity: 1,
            purchasePrice: '129.99',
            purchaseDate: '2024-09-20',
            category: {
              id: 3,
              name: 'Clothing & Accessories',
              color: '#db2777',
              icon: 'shirt'
            },
            brand: 'Nike',
            model: 'Air Zoom Pegasus 38',
            location: 'Closet',
            status: 'active',
            tags: ['shoes', 'running', 'clothing'],
            imageUrl: 'https://placehold.co/600x400?text=NikeShoes'
          },
          {
            id: 4,
            name: 'Instant Pot Duo',
            description: 'Multi-use pressure cooker',
            quantity: 1,
            purchasePrice: '89.99',
            purchaseDate: '2024-06-05',
            category: {
              id: 2,
              name: 'Home Appliances',
              color: '#0891b2',
              icon: 'home'
            },
            brand: 'Instant Pot',
            model: 'Duo 6-Quart',
            serial: 'IP789456123',
            warranty: {
              expiryDate: '2025-06-05',
              daysRemaining: 45,
              status: 'active'
            },
            location: 'Kitchen',
            status: 'active',
            tags: ['kitchen', 'cooking', 'appliance'],
            imageUrl: 'https://placehold.co/600x400?text=InstantPot'
          },
          {
            id: 5,
            name: 'Sony WH-1000XM4 Headphones',
            description: 'Wireless noise-canceling headphones',
            quantity: 1,
            purchasePrice: '349.99',
            purchaseDate: '2024-08-12',
            category: {
              id: 1,
              name: 'Electronics',
              color: '#4f46e5',
              icon: 'smartphone'
            },
            receipt: {
              id: 105,
              date: '2024-08-12',
              merchant: {
                name: 'Amazon',
                logo: 'https://example.com/amazon.png'
              }
            },
            brand: 'Sony',
            model: 'WH-1000XM4',
            serial: 'SONY456789123',
            warranty: {
              expiryDate: '2025-08-12',
              daysRemaining: 90,
              status: 'active'
            },
            location: 'Home Office',
            status: 'active',
            tags: ['audio', 'electronics', 'headphones'],
            imageUrl: 'https://placehold.co/600x400?text=SonyHeadphones'
          }
        ]);
      }, 1000));
    }
  });

  // Filter and search inventory items
  const filteredItems = inventoryItems?.filter(item => {
    // Filter by status
    if (activeFilter !== 'all' && item.status !== activeFilter) {
      return false;
    }
    
    // Search term filtering
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower)) ||
        (item.brand && item.brand.toLowerCase().includes(searchLower)) ||
        (item.model && item.model.toLowerCase().includes(searchLower)) ||
        (item.serial && item.serial.toLowerCase().includes(searchLower)) ||
        (item.location && item.location.toLowerCase().includes(searchLower)) ||
        (item.tags && item.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)))
      );
    }
    
    return true;
  });

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your purchased items from all receipts
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/inventory-upload">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Item
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Inventory Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Warranty Calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LifeBuoy className="h-4 w-4 mr-2" />
                Warranty Alerts
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Box className="h-4 w-4 mr-2" />
                Import Items
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Tag className="h-4 w-4 mr-2" />
                Manage Tags
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Filter By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveFilter('all')}>
                All Items
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter('active')}>
                Active Items
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter('used')}>
                Used Items
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter('expired')}>
                Expired Items
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveFilter('sold')}>
                Sold Items
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="grid" className="mb-6">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          
          <div className="text-sm text-muted-foreground">
            {filteredItems ? (
              `${filteredItems.length} item${filteredItems.length !== 1 ? 's' : ''} ${
                activeFilter !== 'all' ? `(${activeFilter})` : ''
              }`
            ) : null}
          </div>
        </div>
        
        <TabsContent value="grid" className="mt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <InventoryItemSkeleton key={i} />
              ))}
            </div>
          ) : filteredItems && filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <InventoryItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Box className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No items found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "No items match your search criteria"
                  : "Your inventory is empty. Add items to get started."}
              </p>
              <Link to="/inventory-upload">
                <Button>Add Your First Item</Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-md flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredItems && filteredItems.length > 0 ? (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
                  <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
                    <div className="h-20 w-20 rounded-md bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <Box className="h-8 w-8 text-muted-foreground opacity-50" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1 text-center sm:text-left">
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="text-sm text-muted-foreground flex flex-wrap gap-2 justify-center sm:justify-start">
                        {item.brand && <span>{item.brand}</span>}
                        {item.model && <span>• {item.model}</span>}
                        {item.location && <span>• {item.location}</span>}
                      </div>
                      {item.warranty && (
                        <Badge variant={item.warranty.status === 'active' ? 'outline' : 'destructive'} className="mt-1">
                          Warranty: {item.warranty.status}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 items-center mt-2 sm:mt-0">
                      <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                      <Link to={`/inventory/${item.id}`}>
                        <Button size="sm" variant="outline">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Box className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No items found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "No items match your search criteria"
                  : "Your inventory is empty. Add items to get started."}
              </p>
              <Link to="/inventory-upload">
                <Button>Add Your First Item</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
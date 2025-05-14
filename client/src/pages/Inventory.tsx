import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  Plus, 
  FileBox, 
  Grid3x3, 
  LayoutList, 
  Filter,
  ChevronDown,
  Tag,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Package,
  Calendar,
  Smartphone,
  Home,
  Shirt,
  Sofa,
  BookOpen,
  ShoppingBasket,
  QrCode,
  Upload,
  BarChart
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

// Category icons map
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Electronics': <Smartphone className="h-4 w-4" />,
  'Home Appliances': <Home className="h-4 w-4" />,
  'Clothing & Accessories': <Shirt className="h-4 w-4" />,
  'Furniture': <Sofa className="h-4 w-4" />,
  'Books & Media': <BookOpen className="h-4 w-4" />,
  'Groceries': <ShoppingBasket className="h-4 w-4" />
};

// Status badge variants
const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  'active': 'default',
  'used': 'secondary',
  'expired': 'destructive',
  'sold': 'outline',
  'damaged': 'destructive'
};

// Status icons
const STATUS_ICONS: Record<string, React.ReactNode> = {
  'active': <CheckCircle2 className="h-3 w-3" />,
  'used': <Clock className="h-3 w-3" />,
  'expired': <XCircle className="h-3 w-3" />,
  'sold': <Package className="h-3 w-3" />,
  'damaged': <AlertCircle className="h-3 w-3" />
};

// Inventory grid item component
const InventoryGridItem = ({ item }: { item: any }) => {
  const [, setLocation] = useLocation();
  
  return (
    <Card 
      className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => setLocation(`/inventory/${item.id}`)}
    >
      <div className="aspect-square bg-muted relative">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileBox className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        {item.status && (
          <Badge 
            variant={STATUS_VARIANTS[item.status] || 'secondary'}
            className="absolute top-2 right-2 font-normal gap-1"
          >
            {STATUS_ICONS[item.status]}
            {item.status}
          </Badge>
        )}
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-medium text-base line-clamp-1">{item.name}</h3>
        <div className="flex items-center gap-1 mt-1">
          {item.category && (
            <Badge 
              variant="outline" 
              className="gap-1 text-xs font-normal px-2 py-0"
              style={item.category.color ? {
                borderColor: item.category.color,
                color: item.category.color
              } : undefined}
            >
              {CATEGORY_ICONS[item.category.name] || <Tag className="h-3 w-3" />}
              {item.category.name}
            </Badge>
          )}
          {item.brandName && (
            <span className="text-xs text-muted-foreground">{item.brandName}</span>
          )}
        </div>
        <div className="mt-2 text-xs text-muted-foreground line-clamp-2">
          {item.description || 'No description available'}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-sm justify-between">
        <div className="flex items-center gap-1 text-xs">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span>
            {item.purchaseDate 
              ? new Date(item.purchaseDate).toLocaleDateString() 
              : 'No date'}
          </span>
        </div>
        {item.purchasePrice && (
          <div className="font-medium">${parseFloat(item.purchasePrice).toFixed(2)}</div>
        )}
      </CardFooter>
    </Card>
  );
};

// Inventory list item component
const InventoryListItem = ({ item }: { item: any }) => {
  const [, setLocation] = useLocation();
  
  return (
    <div 
      className="flex gap-4 py-3 px-4 items-center hover:bg-muted cursor-pointer rounded-md transition-colors"
      onClick={() => setLocation(`/inventory/${item.id}`)}
    >
      <div className="w-12 h-12 bg-muted rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <FileBox className="h-6 w-6 text-muted-foreground/50" />
        )}
      </div>
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-base line-clamp-1">{item.name}</h3>
          {item.status && (
            <Badge 
              variant={STATUS_VARIANTS[item.status] || 'secondary'}
              className="font-normal gap-1 text-xs"
            >
              {STATUS_ICONS[item.status]}
              {item.status}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          {item.category && (
            <Badge 
              variant="outline" 
              className="gap-1 text-xs font-normal px-2 py-0"
              style={item.category.color ? {
                borderColor: item.category.color,
                color: item.category.color
              } : undefined}
            >
              {CATEGORY_ICONS[item.category.name] || <Tag className="h-3 w-3" />}
              {item.category.name}
            </Badge>
          )}
          {item.brandName && (
            <span className="text-xs text-muted-foreground">{item.brandName}</span>
          )}
          {item.modelNumber && (
            <span className="text-xs text-muted-foreground">{item.modelNumber}</span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 min-w-[120px]">
        {item.purchasePrice && (
          <div className="font-medium">${parseFloat(item.purchasePrice).toFixed(2)}</div>
        )}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            {item.purchaseDate 
              ? new Date(item.purchaseDate).toLocaleDateString() 
              : 'No date'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Inventory() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
  
  // Fetch inventory items
  const { data: inventoryItems, isLoading } = useQuery({
    queryKey: ['/api/inventory', searchQuery, selectedCategory, selectedStatus],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      
      if (searchQuery) {
        queryParams.append('q', searchQuery);
      }
      
      if (selectedCategory) {
        queryParams.append('categoryId', selectedCategory.toString());
      }
      
      if (selectedStatus) {
        queryParams.append('status', selectedStatus);
      }
      
      const response = await fetch(`/api/inventory?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch inventory items');
      }
      return response.json();
    },
  });
  
  // Fetch categories
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

  return (
    <main className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Manage your items and collections</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => setLocation('/receipts')}
            >
              <BarChart className="mr-2 h-4 w-4" />
              View Receipt History
            </Button>
            
            <Button
              variant="outline" 
              size="sm"
              className="shrink-0"
            >
              <QrCode className="mr-2 h-4 w-4" />
              Scan Product
            </Button>
          </div>
          
          <Button 
            onClick={() => setLocation('/inventory-upload')}
            className="shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search items..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel className="text-xs pt-2">Category</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => setSelectedCategory(undefined)}
                className="gap-2"
              >
                <div 
                  className={`w-2 h-2 rounded-full ${!selectedCategory ? "bg-primary" : "bg-transparent"}`}
                />
                All Categories
              </DropdownMenuItem>
              {categories?.map((category: any) => (
                <DropdownMenuItem 
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                >
                  <div 
                    className={`w-2 h-2 rounded-full`}
                    style={{ 
                      backgroundColor: selectedCategory === category.id 
                        ? category.color 
                        : 'transparent' 
                    }}
                  />
                  {category.name}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs pt-2">Status</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => setSelectedStatus(undefined)}
                className="gap-2"
              >
                <div 
                  className={`w-2 h-2 rounded-full ${!selectedStatus ? "bg-primary" : "bg-transparent"}`}
                />
                All Statuses
              </DropdownMenuItem>
              {['active', 'used', 'expired', 'sold', 'damaged'].map((status) => (
                <DropdownMenuItem 
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className="gap-2"
                >
                  {STATUS_ICONS[status]}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="border rounded-md flex">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-r-none h-10 px-3"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" />
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none h-10 px-3"
              onClick={() => setViewMode('list')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="items">
        <TabsList className="mb-6">
          <TabsTrigger value="items">All Items</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="warranties">Warranty Tracking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="items">
          {isLoading ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-square" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-2/3 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-1" />
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-3 w-5/6" />
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Skeleton className="h-3 w-1/3" />
                      <Skeleton className="h-3 w-1/4 ml-auto" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex gap-4 p-4 items-center">
                    <Skeleton className="w-12 h-12 rounded" />
                    <div className="flex-grow">
                      <Skeleton className="h-5 w-1/3 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="flex flex-col items-end">
                      <Skeleton className="h-5 w-16 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : inventoryItems?.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {inventoryItems.map((item: any) => (
                  <InventoryGridItem key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="space-y-2 divide-y">
                {inventoryItems.map((item: any) => (
                  <InventoryListItem key={item.id} item={item} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <FileBox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No items found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {searchQuery || selectedCategory || selectedStatus
                  ? "Try adjusting your filters or search query"
                  : "Your inventory is empty. Start by adding your first item."}
              </p>
              <Button onClick={() => setLocation('/inventory-upload')}>
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="collections">
          <div className="text-center py-12">
            <Grid3x3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Collections Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Organize your items into collections for easier management. 
              This feature will be available soon.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="warranties">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Warranty Tracking Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Keep track of your product warranties and get notified before they expire.
              This feature will be available soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
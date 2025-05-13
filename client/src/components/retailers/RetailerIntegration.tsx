import React, { useState } from 'react';
import { Plus, RefreshCcw, ShoppingBag, Store, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { apiRequest } from '@/lib/queryClient';

// Retailer type matching our backend model
interface Retailer {
  id: number;
  name: string;
  apiEndpoint?: string;
  apiKey?: string;
  logo?: string;
  website?: string;
  dataFormat?: string;
  lastSynced?: Date | null;
  syncEnabled: boolean;
}

// RetailerSync type for sync logs
interface RetailerSyncLog {
  id: number;
  retailerId: number;
  startTime: Date;
  endTime?: Date;
  status: 'success' | 'failure' | 'in_progress';
  productsAdded: number;
  productsUpdated: number;
  productsRemoved: number;
  errorMessage?: string;
}

export function RetailerIntegration() {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncingRetailer, setSyncingRetailer] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  // New retailer form state
  const [newRetailer, setNewRetailer] = useState<{
    name: string;
    apiEndpoint: string;
    apiKey: string;
    website: string;
    dataFormat: string;
    syncEnabled: boolean;
  }>({
    name: '',
    apiEndpoint: '',
    apiKey: '',
    website: '',
    dataFormat: 'json',
    syncEnabled: true,
  });

  // Load retailers
  const loadRetailers = async () => {
    setLoading(true);
    try {
      const response = await apiRequest<Retailer[]>('/api/retailers');
      setRetailers(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load retailers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new retailer
  const addRetailer = async () => {
    try {
      const response = await apiRequest<Retailer>('/api/retailers', {
        method: 'POST',
        body: JSON.stringify(newRetailer),
      });
      
      setRetailers([...retailers, response]);
      setIsAddDialogOpen(false);
      setNewRetailer({
        name: '',
        apiEndpoint: '',
        apiKey: '',
        website: '',
        dataFormat: 'json',
        syncEnabled: true,
      });
      
      toast({
        title: 'Success',
        description: `Added retailer ${response.name}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add retailer',
        variant: 'destructive',
      });
    }
  };

  // Sync retailer products
  const syncRetailerProducts = async (retailerId: number) => {
    setSyncingRetailer(retailerId);
    try {
      const response = await apiRequest<RetailerSyncLog>(`/api/retailers/${retailerId}/sync`, {
        method: 'POST',
      });
      
      toast({
        title: 'Sync initiated',
        description: `Sync process started for retailer #${retailerId}`,
      });
      
      // In a real app, we might poll for updates or use WebSockets
      // For now, just update the UI based on the initial response
      if (response.status === 'success') {
        toast({
          title: 'Sync completed',
          description: `Added ${response.productsAdded} products, updated ${response.productsUpdated}`,
        });
        
        // Refresh retailers to show updated sync time
        loadRetailers();
      } else if (response.status === 'failure') {
        toast({
          title: 'Sync failed',
          description: response.errorMessage || 'Unknown error',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync retailer products',
        variant: 'destructive',
      });
    } finally {
      setSyncingRetailer(null);
    }
  };

  // Toggle retailer sync enabled status
  const toggleSyncEnabled = async (retailer: Retailer) => {
    try {
      const response = await apiRequest<Retailer>(`/api/retailers/${retailer.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          syncEnabled: !retailer.syncEnabled,
        }),
      });
      
      // Update the retailers list with the updated retailer
      setRetailers(retailers.map(r => 
        r.id === retailer.id ? response : r
      ));
      
      toast({
        title: 'Success',
        description: `${response.name} sync ${response.syncEnabled ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update retailer',
        variant: 'destructive',
      });
    }
  };

  // Format the last synced date for display
  const formatLastSynced = (date: Date | null | undefined) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Retailer Integrations</h2>
          <p className="text-muted-foreground">
            Connect to retailer product databases to enhance your receipts
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={loadRetailers}
            disabled={loading}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Retailer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Retailer</DialogTitle>
                <DialogDescription>
                  Add a new retailer to integrate with their product database
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Retailer Name</Label>
                  <Input 
                    id="name" 
                    value={newRetailer.name}
                    onChange={e => setNewRetailer({...newRetailer, name: e.target.value})}
                    placeholder="e.g., Amazon, Walmart, Target"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    value={newRetailer.website}
                    onChange={e => setNewRetailer({...newRetailer, website: e.target.value})}
                    placeholder="e.g., https://www.amazon.com"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="apiEndpoint">API Endpoint</Label>
                  <Input 
                    id="apiEndpoint" 
                    value={newRetailer.apiEndpoint}
                    onChange={e => setNewRetailer({...newRetailer, apiEndpoint: e.target.value})}
                    placeholder="e.g., https://api.retailer.com/products"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input 
                    id="apiKey" 
                    type="password"
                    value={newRetailer.apiKey}
                    onChange={e => setNewRetailer({...newRetailer, apiKey: e.target.value})}
                    placeholder="Your API key for this retailer"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="dataFormat">Data Format</Label>
                  <Select 
                    value={newRetailer.dataFormat}
                    onValueChange={value => setNewRetailer({...newRetailer, dataFormat: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select data format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="xml">XML</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="syncEnabled"
                    checked={newRetailer.syncEnabled}
                    onCheckedChange={checked => setNewRetailer({...newRetailer, syncEnabled: checked})}
                  />
                  <Label htmlFor="syncEnabled">Enable Sync</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addRetailer}>Add Retailer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center p-8">
          <RefreshCcw className="animate-spin h-8 w-8 text-primary" />
        </div>
      ) : retailers.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 pb-6 text-center">
            <div className="flex flex-col items-center">
              <Store className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Retailers Connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect to retailer product databases to enhance your receipts with detailed product information.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Retailer
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {retailers.map(retailer => (
            <Card key={retailer.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{retailer.name}</CardTitle>
                    <CardDescription>
                      {retailer.website && (
                        <a href={retailer.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {retailer.website}
                        </a>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={retailer.syncEnabled ? "default" : "outline"}>
                    {retailer.syncEnabled ? "Active" : "Disabled"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Synced:</span>
                    <span>{formatLastSynced(retailer.lastSynced)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">API Endpoint:</span>
                    <span className="truncate max-w-[200px]">{retailer.apiEndpoint || "Not set"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Data Format:</span>
                    <span>{retailer.dataFormat || "JSON"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-between">
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={retailer.syncEnabled}
                    onCheckedChange={() => toggleSyncEnabled(retailer)}
                    aria-label="Toggle sync"
                  />
                  <span className="text-sm">Sync Enabled</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => syncRetailerProducts(retailer.id)}
                  disabled={!retailer.syncEnabled || syncingRetailer === retailer.id}
                >
                  {syncingRetailer === retailer.id ? (
                    <>
                      <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Sync Products
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
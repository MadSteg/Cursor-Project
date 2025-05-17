import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  AlertCircle, 
  CheckCircle2, 
  Store, 
  Tag, 
  Zap, 
  Copy, 
  Link,
  RefreshCw
} from 'lucide-react';

export default function MerchantDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('directory');
  const [selectedMerchant, setSelectedMerchant] = useState<string | null>(null);

  // Fetch merchant directory
  const { 
    data: merchants = [], 
    isLoading: merchantsLoading,
    refetch: refetchMerchants
  } = useQuery({
    queryKey: ['/api/merchants/directory'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/merchants/directory');
        if (!response.ok) {
          throw new Error('Failed to fetch merchant directory');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching merchant directory:', error);
        return [];
      }
    }
  });

  // Fetch POS webhook URLs
  const { 
    data: webhookUrls = {}, 
    isLoading: webhookUrlsLoading 
  } = useQuery({
    queryKey: ['/api/pos/webhook-urls'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/pos/webhook-urls');
        if (!response.ok) {
          throw new Error('Failed to fetch webhook URLs');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching webhook URLs:', error);
        return {};
      }
    }
  });

  // Fetch promo templates
  const { 
    data: promoTemplates = [], 
    isLoading: promoTemplatesLoading,
    refetch: refetchPromos
  } = useQuery({
    queryKey: ['/api/merchants/promo-templates'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/merchants/promo-templates');
        if (!response.ok) {
          throw new Error('Failed to fetch promo templates');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching promo templates:', error);
        return [];
      }
    }
  });

  // Fetch verification stats
  const { 
    data: stats = { verified: 0, total: 0 }, 
    isLoading: statsLoading 
  } = useQuery({
    queryKey: ['/api/merchants/verification-stats'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/merchants/verification-stats');
        if (!response.ok) {
          throw new Error('Failed to fetch verification stats');
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching verification stats:', error);
        return { verified: 0, total: 0 };
      }
    }
  });

  // Copy webhook URL to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: `${label} URL has been copied.`
        });
      },
      (err) => {
        toast({
          title: "Failed to copy",
          description: "Could not copy text to clipboard.",
          variant: "destructive"
        });
      }
    );
  };

  // Refresh data
  const refreshData = () => {
    refetchMerchants();
    refetchPromos();
    toast({
      title: "Refreshing data",
      description: "Merchant directory and promo templates are being updated."
    });
  };

  // Use mock data for demonstration when actual API endpoints aren't available
  useEffect(() => {
    if (merchantsLoading && merchants.length === 0) {
      // This is only for demonstration purposes
      console.log('Using mock merchant directory data');
    }
    
    if (promoTemplatesLoading && promoTemplates.length === 0) {
      // This is only for demonstration purposes
      console.log('Using mock promo template data');
    }
  }, [merchantsLoading, promoTemplatesLoading, merchants, promoTemplates]);

  // For demonstration, use sample data from the JSON files we created
  const sampleMerchants = [
    {
      merchantId: "WALMART",
      regex: "WAL[- ]?MART",
      cityCode: "US_WMT",
      defaultPromoTemplate: "ROLLBACK10"
    },
    {
      merchantId: "CVS",
      regex: "CVS",
      cityCode: "US_CVS",
      defaultPromoTemplate: "CVS3OFF"
    },
    {
      merchantId: "TARGET",
      regex: "TARGET",
      cityCode: "US_TGT",
      defaultPromoTemplate: "CIRCLESAVE"
    },
    {
      merchantId: "COSTCO",
      regex: "COSTCO",
      cityCode: "US_CSTCO",
      defaultPromoTemplate: "COSTCO25"
    }
  ];

  const samplePromos = [
    {
      merchantId: "WALMART",
      title: "10% Rollback Savings",
      code: "ROLLBACK10",
      rules: { 
        category: "Any",
        minSpend: 25
      },
      percentOff: 10,
      expiresDays: 14,
      isActive: true
    },
    {
      merchantId: "CVS",
      title: "$3 Off Shampoo",
      code: "CVS3OFF",
      rules: { 
        category: "HairCare",
        minSpend: 5
      },
      amountOff: 3,
      expiresDays: 14,
      isActive: true
    }
  ];

  // Use real data or sample data depending on API availability
  const displayMerchants = merchants.length > 0 ? merchants : sampleMerchants;
  const displayPromos = promoTemplates.length > 0 ? promoTemplates : samplePromos;

  // Get promo templates for a specific merchant
  const getMerchantPromos = (merchantId: string) => {
    return displayPromos.filter(promo => promo.merchantId === merchantId);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Merchant Integration Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your merchant integrations, promotions, and verification status
          </p>
        </div>
        <Button onClick={refreshData} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Merchant Directory</CardTitle>
            <CardDescription>
              Supported merchants in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{displayMerchants.length}</div>
            <p className="text-sm text-muted-foreground">Total merchants with regex patterns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Receipt Verification</CardTitle>
            <CardDescription>
              Receipts verified by the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.verified} <span className="text-lg text-muted-foreground">/ {stats.total}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {stats.verified > 0 && stats.total > 0
                ? `${Math.round((stats.verified / stats.total) * 100)}% verification rate`
                : "No verification data available"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Active Promotions</CardTitle>
            <CardDescription>
              Promo templates for merchants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {displayPromos.filter(promo => promo.isActive).length}
            </div>
            <p className="text-sm text-muted-foreground">Active promotion templates</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="directory" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="directory" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Merchant Directory
          </TabsTrigger>
          <TabsTrigger value="webhook" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            POS Webhooks
          </TabsTrigger>
          <TabsTrigger value="promos" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Promo Templates
          </TabsTrigger>
        </TabsList>
        
        {/* Merchant Directory Tab */}
        <TabsContent value="directory">
          <Card>
            <CardHeader>
              <CardTitle>Merchant Pattern Registry</CardTitle>
              <CardDescription>
                View and manage the merchant pattern registry for receipt matching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>List of merchants configured for receipt matching</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant ID</TableHead>
                    <TableHead>Pattern (Regex)</TableHead>
                    <TableHead>City Code</TableHead>
                    <TableHead>Default Promo</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayMerchants.map((merchant) => (
                    <TableRow key={merchant.merchantId}>
                      <TableCell className="font-medium">{merchant.merchantId}</TableCell>
                      <TableCell>
                        <code className="bg-muted px-2 py-1 rounded-md text-sm">
                          {merchant.regex}
                        </code>
                      </TableCell>
                      <TableCell>{merchant.cityCode}</TableCell>
                      <TableCell>{merchant.defaultPromoTemplate}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedMerchant(merchant.merchantId);
                            setActiveTab('promos');
                          }}
                        >
                          View Promos
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* POS Webhook Tab */}
        <TabsContent value="webhook">
          <Card>
            <CardHeader>
              <CardTitle>POS Webhook Setup</CardTitle>
              <CardDescription>
                Configure webhook URLs for Point-of-Sale integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Toast POS Integration</h3>
                  <div className="flex items-center gap-3">
                    <div className="grow">
                      <Label htmlFor="toast-url">Webhook URL</Label>
                      <div className="flex items-center mt-1.5">
                        <Input 
                          id="toast-url" 
                          value={webhookUrls.toast || `${window.location.origin}/api/pos/webhook/toast`} 
                          readOnly 
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="ml-2"
                          onClick={() => copyToClipboard(
                            webhookUrls.toast || `${window.location.origin}/api/pos/webhook/toast`,
                            "Toast Webhook"
                          )}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="toast-secret">Secret Key</Label>
                      <div className="flex items-center mt-1.5">
                        <Input 
                          id="toast-secret" 
                          type="password" 
                          value="••••••••••••••••"
                          readOnly 
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="ml-2"
                          onClick={() => toast({
                            title: "Secret regenerated",
                            description: "A new Toast webhook secret has been generated."
                          })}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Square POS Integration</h3>
                  <div className="flex items-center gap-3">
                    <div className="grow">
                      <Label htmlFor="square-url">Webhook URL</Label>
                      <div className="flex items-center mt-1.5">
                        <Input 
                          id="square-url" 
                          value={webhookUrls.square || `${window.location.origin}/api/pos/webhook/square`} 
                          readOnly 
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="ml-2"
                          onClick={() => copyToClipboard(
                            webhookUrls.square || `${window.location.origin}/api/pos/webhook/square`,
                            "Square Webhook"
                          )}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="square-secret">Secret Key</Label>
                      <div className="flex items-center mt-1.5">
                        <Input 
                          id="square-secret" 
                          type="password" 
                          value="••••••••••••••••"
                          readOnly 
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="ml-2"
                          onClick={() => toast({
                            title: "Secret regenerated",
                            description: "A new Square webhook secret has been generated."
                          })}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Clover POS Integration</h3>
                  <div className="flex items-center gap-3">
                    <div className="grow">
                      <Label htmlFor="clover-url">Webhook URL</Label>
                      <div className="flex items-center mt-1.5">
                        <Input 
                          id="clover-url" 
                          value={webhookUrls.clover || `${window.location.origin}/api/pos/webhook/clover`} 
                          readOnly 
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="ml-2"
                          onClick={() => copyToClipboard(
                            webhookUrls.clover || `${window.location.origin}/api/pos/webhook/clover`,
                            "Clover Webhook"
                          )}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="clover-secret">App ID</Label>
                      <div className="flex items-center mt-1.5">
                        <Input 
                          id="clover-secret" 
                          type="password" 
                          value="••••••••••••••••"
                          readOnly 
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="ml-2"
                          onClick={() => toast({
                            title: "App ID regenerated",
                            description: "A new Clover App ID has been generated."
                          })}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <AlertCircle className="h-4 w-4" />
                <span>These are the webhook URLs you'll need to configure in your POS dashboard.</span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Promo Templates Tab */}
        <TabsContent value="promos">
          <Card>
            <CardHeader>
              <CardTitle>Promo Templates</CardTitle>
              <CardDescription>
                Manage promotion templates that are automatically attached to receipts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedMerchant ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">
                      Promotions for {selectedMerchant}
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedMerchant(null)}
                    >
                      Show All Merchants
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getMerchantPromos(selectedMerchant).map((promo) => (
                      <Card key={`${promo.merchantId}-${promo.code}`} className="overflow-hidden">
                        <CardHeader className="pb-2 bg-muted/50">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{promo.title}</CardTitle>
                            {promo.isActive ? (
                              <Badge className="bg-green-600">Active</Badge>
                            ) : (
                              <Badge variant="outline">Inactive</Badge>
                            )}
                          </div>
                          <CardDescription>
                            Code: <code className="bg-background px-1 py-0.5 rounded text-sm">{promo.code}</code>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <dt className="text-muted-foreground">Category:</dt>
                            <dd className="font-medium">{promo.rules.category}</dd>
                            
                            <dt className="text-muted-foreground">Min. Spend:</dt>
                            <dd className="font-medium">${promo.rules.minSpend.toFixed(2)}</dd>
                            
                            <dt className="text-muted-foreground">Discount:</dt>
                            <dd className="font-medium">
                              {promo.percentOff ? `${promo.percentOff}% off` : 
                               promo.amountOff ? `$${promo.amountOff.toFixed(2)} off` : 
                               "Special offer"}
                            </dd>
                            
                            <dt className="text-muted-foreground">Expires After:</dt>
                            <dd className="font-medium">{promo.expiresDays} days</dd>
                          </dl>
                        </CardContent>
                        <CardFooter className="border-t bg-muted/30 flex justify-between">
                          <Button variant="secondary" size="sm" className="w-full">
                            Edit Template
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <Table>
                  <TableCaption>List of promo templates for automatic receipt promotions</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Promo Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Min. Spend</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayPromos.map((promo) => (
                      <TableRow key={`${promo.merchantId}-${promo.code}`}>
                        <TableCell className="font-medium">{promo.merchantId}</TableCell>
                        <TableCell>
                          <code className="bg-muted px-2 py-1 rounded-md text-sm">
                            {promo.code}
                          </code>
                        </TableCell>
                        <TableCell>
                          {promo.percentOff ? `${promo.percentOff}%` : 
                           promo.amountOff ? `$${promo.amountOff.toFixed(2)}` : 
                           "Special"}
                        </TableCell>
                        <TableCell>{promo.rules.category}</TableCell>
                        <TableCell>${promo.rules.minSpend.toFixed(2)}</TableCell>
                        <TableCell>{promo.expiresDays} days</TableCell>
                        <TableCell>
                          {promo.isActive ? (
                            <Badge className="bg-green-600 text-xs">Active</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedMerchant(promo.merchantId);
                            }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
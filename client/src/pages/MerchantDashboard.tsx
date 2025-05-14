import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { BadgeCheck, Rocket, ShieldCheck, CreditCard, Zap, BarChart3, Settings, Users, Store, Package, Bell } from 'lucide-react';

export default function MerchantDashboard() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [autoMintEnabled, setAutoMintEnabled] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [apiKey, setApiKey] = useState('br_test_xxxxxxxxxxxxxxxxxxxxx');

  const handleSaveSettings = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings saved",
        description: "Your BlockReceipt.ai integration settings have been updated.",
      });
    }, 1000);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard.",
    });
  };

  const handleGenerateNewKey = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setApiKey('br_test_' + Math.random().toString(36).substring(2, 15));
      toast({
        title: "New API key generated",
        description: "Your new BlockReceipt.ai API key has been generated. Make sure to update your integration.",
      });
    }, 1000);
  };
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Merchant Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your BlockReceipt.ai integration and settings</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">34,529</CardTitle>
              <CardDescription>NFT Receipts Minted</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <span className="text-green-500 font-medium">+12.5%</span> increase this month
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">27,105</CardTitle>
              <CardDescription>Unique Users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <span className="text-green-500 font-medium">+8.3%</span> increase this month
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">99.8%</CardTitle>
              <CardDescription>Service Uptime</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Last incident: 15 days ago
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="integration">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 md:grid-cols-4">
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="integration" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Integration</CardTitle>
                  <CardDescription>
                    Connect your e-commerce platform to BlockReceipt.ai
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <div className="flex">
                      <Input 
                        id="api-key"
                        value={apiKey}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button 
                        variant="outline" 
                        className="ml-2" 
                        onClick={handleCopyApiKey}
                      >
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use this API key to authenticate your requests.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button 
                      onClick={handleGenerateNewKey}
                      disabled={loading}
                    >
                      {loading ? "Generating..." : "Generate New API Key"}
                    </Button>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Integration Methods</h3>
                    
                    <div className="grid gap-4">
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <div className="flex items-start">
                          <div className="mr-4 mt-1">
                            <Rocket className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Direct API Integration</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Integrate directly with our RESTful API to mint NFT receipts for your customers.
                            </p>
                            <Button variant="link" className="px-0 py-1 h-auto mt-2">
                              View API Docs
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <div className="flex items-start">
                          <div className="mr-4 mt-1">
                            <Package className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Plugin & SDK</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Use our plugins for popular platforms or SDKs for custom integration.
                            </p>
                            <div className="flex space-x-4 mt-2">
                              <Button variant="link" className="px-0 py-1 h-auto">Shopify Plugin</Button>
                              <Button variant="link" className="px-0 py-1 h-auto">WooCommerce</Button>
                              <Button variant="link" className="px-0 py-1 h-auto">SDK Docs</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-primary/5 p-4 rounded-lg">
                        <div className="flex items-start">
                          <div className="mr-4 mt-1">
                            <Zap className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">Webhook Integration</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Connect via webhook to automatically generate NFT receipts when orders are placed.
                            </p>
                            <Button variant="link" className="px-0 py-1 h-auto mt-2">
                              Configure Webhooks
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Code Samples</CardTitle>
                  <CardDescription>
                    Example code to integrate BlockReceipt.ai with your platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="javascript">
                    <TabsList>
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="php">PHP</TabsTrigger>
                    </TabsList>
                    <TabsContent value="javascript" className="mt-4">
                      <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
{`// Automatic NFT receipt generation on order completion
const { BlockReceiptClient } = require('@blockreceipt/sdk');

// Initialize the client with your API key
const client = new BlockReceiptClient({
  apiKey: 'YOUR_API_KEY',
  environment: 'production' // or 'sandbox' for testing
});

// Generate an NFT receipt after order completion
async function generateNFTReceipt(orderData) {
  try {
    const receipt = await client.receipts.create({
      customer: {
        wallet_address: orderData.customer_wallet,
        email: orderData.email // Optional fallback
      },
      order: {
        id: orderData.order_id,
        amount: orderData.total_amount,
        currency: 'USD',
        items: orderData.line_items,
        metadata: {
          store_id: 'your-store-123',
          receipt_type: 'standard' // or 'premium', 'luxury'
        }
      }
    });
    
    console.log('NFT Receipt generated:', receipt.token_id);
    return receipt;
  } catch (error) {
    console.error('Error generating NFT receipt:', error);
  }
}
`}
                      </pre>
                    </TabsContent>
                    <TabsContent value="python" className="mt-4">
                      <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
{`# Automatic NFT receipt generation on order completion
from blockreceipt import BlockReceiptClient

# Initialize the client with your API key
client = BlockReceiptClient(
    api_key='YOUR_API_KEY',
    environment='production'  # or 'sandbox' for testing
)

# Generate an NFT receipt after order completion
def generate_nft_receipt(order_data):
    try:
        receipt = client.receipts.create(
            customer={
                'wallet_address': order_data['customer_wallet'],
                'email': order_data['email']  # Optional fallback
            },
            order={
                'id': order_data['order_id'],
                'amount': order_data['total_amount'],
                'currency': 'USD',
                'items': order_data['line_items'],
                'metadata': {
                    'store_id': 'your-store-123',
                    'receipt_type': 'standard'  # or 'premium', 'luxury'
                }
            }
        )
        
        print(f'NFT Receipt generated: {receipt.token_id}')
        return receipt
    except Exception as e:
        print(f'Error generating NFT receipt: {e}')
`}
                      </pre>
                    </TabsContent>
                    <TabsContent value="php" className="mt-4">
                      <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
{`<?php
// Automatic NFT receipt generation on order completion
require_once('vendor/autoload.php');

use BlockReceipt\\BlockReceiptClient;

// Initialize the client with your API key
$client = new BlockReceiptClient([
    'api_key' => 'YOUR_API_KEY',
    'environment' => 'production' // or 'sandbox' for testing
]);

// Generate an NFT receipt after order completion
function generateNFTReceipt($orderData) {
    global $client;
    try {
        $receipt = $client->receipts->create([
            'customer' => [
                'wallet_address' => $orderData['customer_wallet'],
                'email' => $orderData['email'] // Optional fallback
            ],
            'order' => [
                'id' => $orderData['order_id'],
                'amount' => $orderData['total_amount'],
                'currency' => 'USD',
                'items' => $orderData['line_items'],
                'metadata' => [
                    'store_id' => 'your-store-123',
                    'receipt_type' => 'standard' // or 'premium', 'luxury'
                ]
            ]
        ]);
        
        echo 'NFT Receipt generated: ' . $receipt->token_id;
        return $receipt;
    } catch (Exception $e) {
        echo 'Error generating NFT receipt: ' . $e->getMessage();
    }
}
?>`}
                      </pre>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Receipt Generation Settings</CardTitle>
                  <CardDescription>
                    Configure how NFT receipts are generated for your customers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic NFT Receipt Generation</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically mint NFT receipts for every order
                      </p>
                    </div>
                    <Switch 
                      checked={autoMintEnabled}
                      onCheckedChange={setAutoMintEnabled}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-0.5">
                    <Label>Default Receipt Type</Label>
                    <p className="text-sm text-muted-foreground">
                      Select the default NFT receipt style for your customers
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <Card className={`border-2 cursor-pointer ${selectedPlan === 'standard' ? 'border-primary' : 'border-border'}`} onClick={() => setSelectedPlan('standard')}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Standard</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground">
                            Basic receipt with transaction data
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0">
                          {selectedPlan === 'standard' && (
                            <BadgeCheck className="h-5 w-5 text-primary" />
                          )}
                        </CardFooter>
                      </Card>
                      
                      <Card className={`border-2 cursor-pointer ${selectedPlan === 'premium' ? 'border-primary' : 'border-border'}`} onClick={() => setSelectedPlan('premium')}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Premium</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground">
                            Enhanced with detailed itemization
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0">
                          {selectedPlan === 'premium' && (
                            <BadgeCheck className="h-5 w-5 text-primary" />
                          )}
                        </CardFooter>
                      </Card>
                      
                      <Card className={`border-2 cursor-pointer ${selectedPlan === 'luxury' ? 'border-primary' : 'border-border'}`} onClick={() => setSelectedPlan('luxury')}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Luxury</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground">
                            Premium design with animations
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0">
                          {selectedPlan === 'luxury' && (
                            <BadgeCheck className="h-5 w-5 text-primary" />
                          )}
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-0.5">
                    <Label>Customer Preferences</Label>
                    <p className="text-sm text-muted-foreground">
                      Options for customer experience
                    </p>
                    
                    <div className="grid gap-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Allow customer opt-out</Label>
                          <p className="text-xs text-muted-foreground">
                            Let customers choose to not receive NFT receipts
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Email fallback</Label>
                          <p className="text-xs text-muted-foreground">
                            Send email receipt if wallet address is unavailable
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">Show wallet connect prompt</Label>
                          <p className="text-xs text-muted-foreground">
                            Prompt customers to connect wallet at checkout
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSettings} disabled={loading}>
                    {loading ? "Saving..." : "Save Settings"}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>TPRE Configuration</CardTitle>
                  <CardDescription>
                    Configure Threshold Pre-signature with Receipt Emission settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>TPRE Encryption Level</Label>
                    <div className="flex items-center space-x-2">
                      <select className="border p-2 rounded-md w-full">
                        <option value="standard">Standard (Default)</option>
                        <option value="enhanced">Enhanced</option>
                        <option value="maximum">Maximum Security</option>
                      </select>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Sets the encryption level for sensitive receipt data
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable TPRE for all receipts</Label>
                      <p className="text-sm text-muted-foreground">
                        Apply threshold encryption to all receipt data
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Custom Receipt Appearance</CardTitle>
                  <CardDescription>
                    Customize how your NFT receipts look for your customers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Store Logo</Label>
                    <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-12">
                      <div className="text-center">
                        <div className="flex flex-col items-center">
                          <Store className="h-10 w-10 text-muted-foreground mb-2" />
                          <div className="mt-2">
                            <Button size="sm">Upload Logo</Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Recommended size: 512×512px
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Brand Colors</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Primary Color</Label>
                        <div className="flex mt-1">
                          <div className="w-8 h-8 rounded-l-md bg-blue-600 border"></div>
                          <Input value="#1E40AF" className="rounded-l-none" />
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Secondary Color</Label>
                        <div className="flex mt-1">
                          <div className="w-8 h-8 rounded-l-md bg-slate-800 border"></div>
                          <Input value="#1E293B" className="rounded-l-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Receipt Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border rounded-lg p-4 cursor-pointer bg-white">
                        <div className="h-32 flex items-center justify-center">
                          <div className="w-full p-2">
                            <div className="h-6 bg-gray-200 rounded-md w-2/3 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                          </div>
                        </div>
                        <p className="text-center text-sm mt-2">Classic</p>
                      </div>
                      
                      <div className="border-2 border-primary rounded-lg p-4 cursor-pointer bg-white">
                        <div className="h-32 flex items-center justify-center">
                          <div className="w-full p-2">
                            <div className="h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md w-2/3 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                          </div>
                        </div>
                        <p className="text-center text-sm mt-2">Modern</p>
                      </div>
                      
                      <div className="border rounded-lg p-4 cursor-pointer bg-white">
                        <div className="h-32 flex items-center justify-center">
                          <div className="w-full p-2">
                            <div className="h-6 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-md w-2/3 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                          </div>
                        </div>
                        <p className="text-center text-sm mt-2">Luxury</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSettings} disabled={loading}>
                    {loading ? "Saving..." : "Save Appearance"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>NFT Receipt Analytics</CardTitle>
                  <CardDescription>
                    Performance metrics for your NFT receipt program
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Receipt Generation Over Time</h3>
                      <div className="h-64 w-full bg-muted rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-8 w-8 text-muted-foreground" />
                        <span className="ml-2 text-muted-foreground">Chart visualization placeholder</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Receipt Type Distribution</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Standard</span>
                            <span className="text-sm font-medium">62%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '62%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Premium</span>
                            <span className="text-sm font-medium">28%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: '28%' }}></div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Luxury</span>
                            <span className="text-sm font-medium">10%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: '10%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Customer Metrics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Wallet Connection Rate</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">76%</div>
                            <p className="text-xs text-muted-foreground">
                              of customers connect their wallet at checkout
                            </p>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">Repeat Customers</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">42%</div>
                            <p className="text-xs text-muted-foreground">
                              of customers have multiple NFT receipts
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Export Analytics</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
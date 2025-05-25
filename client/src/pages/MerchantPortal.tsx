import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Key, 
  BarChart3, 
  Settings, 
  Webhook, 
  CreditCard, 
  Copy, 
  Eye, 
  EyeOff,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Leaf,
  FileText,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export default function MerchantPortal() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [storeName, setStoreName] = useState('Demo Store');
  const [storeUrl, setStoreUrl] = useState('');
  const { toast } = useToast();

  // Mock analytics data - in real app this would come from API
  const analytics = {
    totalMints: 1247,
    thisMonth: 342,
    avgTransactionValue: 28.50,
    carbonSaved: 156, // kg CO2
    costSavings: 847.20 // dollars saved on paper/printing
  };

  const generateApiKey = () => {
    const newKey = `br_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;
    setApiKey(newKey);
    toast({
      title: "API Key Generated!",
      description: "Your new API key is ready. Copy it safely - it won't be shown again.",
    });
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    });
  };

  const testWebhook = () => {
    toast({
      title: "Webhook Test Sent",
      description: "Check your endpoint logs for the test transaction",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Merchant Portal</h1>
          <p className="text-gray-600">
            Manage your BlockReceipt integration and view analytics
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="integration">POS Integration</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total NFT Receipts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalMints.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{analytics.thisMonth} this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analytics.avgTransactionValue}</div>
                  <p className="text-xs text-muted-foreground">
                    +12.3% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Carbon Saved</CardTitle>
                  <Leaf className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.carbonSaved}kg</div>
                  <p className="text-xs text-muted-foreground">
                    CO₂ emissions avoided
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${analytics.costSavings}</div>
                  <p className="text-xs text-muted-foreground">
                    vs. paper receipts
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent NFT Receipts</CardTitle>
                <CardDescription>Latest transactions from your POS system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 'TXN-001', amount: '$24.99', customer: '0x1234...5678', time: '2 min ago', status: 'minted' },
                    { id: 'TXN-002', amount: '$45.20', customer: '0x8765...4321', time: '5 min ago', status: 'minted' },
                    { id: 'TXN-003', amount: '$12.50', customer: '0x9876...1234', time: '8 min ago', status: 'pending' },
                  ].map((txn) => (
                    <div key={txn.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-medium">{txn.id}</p>
                          <p className="text-sm text-gray-500">{txn.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{txn.amount}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant={txn.status === 'minted' ? 'default' : 'secondary'}>
                            {txn.status}
                          </Badge>
                          <span className="text-sm text-gray-500">{txn.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* POS Integration Tab */}
          <TabsContent value="integration" className="space-y-6">
            {/* API Key Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Key Management
                </CardTitle>
                <CardDescription>
                  Generate and manage API keys for your POS integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apikey">Your API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="apikey"
                      type={showApiKey ? "text" : "password"}
                      value={apiKey || "No API key generated"}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyApiKey}
                      disabled={!apiKey}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button onClick={generateApiKey}>
                  Generate New API Key
                </Button>
              </CardContent>
            </Card>

            {/* Webhook Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  Webhook Configuration
                </CardTitle>
                <CardDescription>
                  Connect your POS system to automatically mint NFT receipts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Webhook URL</h4>
                  <code className="text-sm bg-white px-2 py-1 rounded border">
                    https://your-app.replit.app/api/pos-webhook
                  </code>
                  <Button variant="outline" size="sm" className="ml-2" onClick={copyApiKey}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Your Store Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-url">Store URL (optional)</Label>
                  <Input
                    id="store-url"
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    placeholder="https://yourstore.com"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={testWebhook}>
                    Test Webhook
                  </Button>
                  <Button variant="outline">
                    View Integration Guide
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Integration Status */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>API Key Generated</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Webhook URL Configured</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <span>First Transaction Pending</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Brand Customization
                </CardTitle>
                <CardDescription>
                  Customize how your NFT receipts appear to customers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Store Logo</Label>
                  <Input type="file" accept="image/*" />
                  <p className="text-sm text-gray-500">Upload a square logo (recommended: 200x200px)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand-color">Brand Color</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="color"
                      defaultValue="#3B82F6"
                      className="w-16 h-10"
                    />
                    <Input
                      placeholder="#3B82F6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receipt-template">Receipt Template</Label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Modern Minimal</option>
                    <option>Classic Business</option>
                    <option>Colorful Fun</option>
                    <option>Luxury Premium</option>
                  </select>
                </div>

                <Button>Save Branding Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Usage & Billing
                </CardTitle>
                <CardDescription>
                  Track your usage and manage billing preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="text-2xl font-bold">$0.005</div>
                    <p className="text-sm text-gray-500">per NFT minted</p>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold">{analytics.thisMonth}</div>
                    <p className="text-sm text-gray-500">mints this month</p>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold">${(analytics.thisMonth * 0.005).toFixed(2)}</div>
                    <p className="text-sm text-gray-500">estimated bill</p>
                  </Card>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Current Plan: Pay-as-you-go</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    You're charged $0.005 for each NFT receipt minted. No monthly fees.
                  </p>
                  <Button variant="outline">Upgrade to Business Plan</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
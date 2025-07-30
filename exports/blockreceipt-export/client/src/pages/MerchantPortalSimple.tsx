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
  Settings, 
  Webhook, 
  CreditCard, 
  Copy, 
  Eye, 
  EyeOff,
  DollarSign,
  ShoppingCart,
  Leaf,
  FileText,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export default function MerchantPortalSimple() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const { toast } = useToast();

  const generateApiKey = () => {
    if (!storeName.trim()) {
      toast({
        title: "Store Name Required",
        description: "Please enter your store name first",
      });
      return;
    }
    
    const newKey = `br_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`;
    setApiKey(newKey);
    toast({
      title: "API Key Generated!",
      description: "Your integration key is ready. Copy it to connect your POS system.",
    });
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Merchant Portal</h1>
          <p className="text-gray-600">
            Integrate BlockReceipt as your third receipt option alongside physical and email receipts
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="integration">POS Integration</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Get Started Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                  Add BlockReceipt as Your Third Receipt Option
                </CardTitle>
                <CardDescription>
                  Join leading retailers offering customers digital NFT receipts alongside physical and email receipts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <h4 className="font-medium">Physical Receipt</h4>
                    <p className="text-sm text-gray-500">Traditional paper</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border">
                    <AlertCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-medium">Email Receipt</h4>
                    <p className="text-sm text-gray-500">Digital backup</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <Sparkles className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-medium text-blue-900">NFT Receipt</h4>
                    <p className="text-sm text-blue-600">Secure blockchain collectible</p>
                  </div>
                </div>
                <div className="bg-blue-100 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Benefits for Your Store:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Reduce paper costs by up to 40%</li>
                    <li>• Attract tech-savvy customers</li>
                    <li>• Enhance brand reputation with sustainability</li>
                    <li>• Generate additional revenue from NFT collectibles</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cost Per Receipt</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$0.005</div>
                  <p className="text-xs text-muted-foreground">vs $0.08 paper receipt</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Carbon Impact</CardTitle>
                  <Leaf className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Zero</div>
                  <p className="text-xs text-muted-foreground">emissions per receipt</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Setup Time</CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5 min</div>
                  <p className="text-xs text-muted-foreground">to integrate</p>
                </CardContent>
              </Card>
            </div>

            {/* Integration Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Integration Guide</CardTitle>
                <CardDescription>Get BlockReceipt working with your POS system in minutes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold">Generate API Key</h4>
                      <p className="text-sm text-gray-600">Create your secure integration key in the POS Integration tab</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold">Connect Your POS</h4>
                      <p className="text-sm text-gray-600">Add our webhook URL to your POS system (Shopify, Square, etc.)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold">Start Minting</h4>
                      <p className="text-sm text-gray-600">Customers automatically get NFT receipts with every purchase</p>
                    </div>
                  </div>
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
                  Generate your secure API key to connect BlockReceipt with your POS system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div className="space-y-2">
                  <Label htmlFor="apikey">Your API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="apikey"
                      type={showApiKey ? "text" : "password"}
                      value={apiKey || "Generate an API key to get started"}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                      disabled={!apiKey}
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
                
                <Button onClick={generateApiKey} className="w-full">
                  Generate API Key
                </Button>
              </CardContent>
            </Card>

            {/* Webhook Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  POS System Integration
                </CardTitle>
                <CardDescription>
                  Connect any POS system to automatically mint NFT receipts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Webhook URL</h4>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-white px-3 py-2 rounded border flex-1">
                      https://your-app.replit.app/api/pos-webhook
                    </code>
                    <Button variant="outline" size="sm" onClick={copyApiKey}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-blue-700 mt-2">
                    Add this URL to your POS system's webhook settings
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Shopify Integration</h4>
                    <p className="text-sm text-gray-600 mb-3">Connect your Shopify store in minutes</p>
                    <Button variant="outline" className="w-full">
                      View Shopify Guide
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">Square Integration</h4>
                    <p className="text-sm text-gray-600 mb-3">Add NFT receipts to Square POS</p>
                    <Button variant="outline" className="w-full">
                      View Square Guide
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Custom POS Systems</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Have a different POS? No problem! Our webhook accepts standard transaction data from any system.
                  </p>
                  <Button variant="outline">
                    View API Documentation
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Integration Status */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {apiKey ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                    )}
                    <span>API Key Generated</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                    <span>Webhook URL Added to POS</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                    <span>First Transaction Processed</span>
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

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Simple, Transparent Pricing
                </CardTitle>
                <CardDescription>
                  Pay only for what you use - no monthly fees or hidden costs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-2">Pay-as-you-go</h3>
                    <div className="text-3xl font-bold mb-4">$0.005 <span className="text-sm font-normal">per NFT receipt</span></div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        No setup fees
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        No monthly charges
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Pay only for successful mints
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Full API access
                      </li>
                    </ul>
                  </div>

                  <div className="border-2 border-blue-500 rounded-lg p-6 relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500">Recommended</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                    <div className="text-3xl font-bold mb-4">Custom <span className="text-sm font-normal">pricing</span></div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Volume discounts
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Dedicated support
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Custom integrations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        White-label options
                      </li>
                    </ul>
                    <Button className="w-full mt-4">Contact Sales</Button>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Cost Comparison</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Paper Receipt</p>
                      <p className="text-green-700">$0.08 each</p>
                    </div>
                    <div>
                      <p className="font-medium">Email Receipt</p>
                      <p className="text-green-700">$0.001 each</p>
                    </div>
                    <div>
                      <p className="font-medium">NFT Receipt</p>
                      <p className="text-green-700">$0.005 each</p>
                    </div>
                  </div>
                  <p className="text-green-800 mt-2 font-medium">
                    Save up to 94% vs paper receipts while offering premium customer experience
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
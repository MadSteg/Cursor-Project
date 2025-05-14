import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  BarChart2, 
  Users, 
  CreditCard, 
  ShoppingBag, 
  Settings, 
  Bell, 
  Key, 
  Brush, 
  Palette, 
  PieChart,
  Database,
  Share2,
  AlertCircle,
  Check,
  Copy,
  Edit,
  Upload,
  Trash2
} from 'lucide-react';

const analyticsData = [
  { name: 'Jan', receipts: 42, revenue: 3200 },
  { name: 'Feb', receipts: 53, revenue: 4100 },
  { name: 'Mar', receipts: 62, revenue: 5300 },
  { name: 'Apr', receipts: 78, revenue: 6200 },
  { name: 'May', receipts: 91, revenue: 7400 },
];

const receiptTypes = [
  { type: 'Standard', count: 187, percentage: 62 },
  { type: 'Premium', count: 85, percentage: 28 },
  { type: 'Luxury', count: 29, percentage: 10 },
];

const mockReceipts = [
  {
    id: 123456,
    customer: 'johndoe@example.com',
    date: '2025-05-10T10:30:00Z',
    amount: 84.32,
    type: 'Premium',
    status: 'Active'
  },
  {
    id: 123457,
    customer: 'alice@example.com',
    date: '2025-05-09T14:20:00Z',
    amount: 129.99,
    type: 'Luxury',
    status: 'Active'
  },
  {
    id: 123458,
    customer: 'bob@example.com',
    date: '2025-05-08T09:15:00Z',
    amount: 49.95,
    type: 'Standard',
    status: 'Active'
  },
  {
    id: 123459,
    customer: 'sarah@example.com',
    date: '2025-05-07T16:45:00Z',
    amount: 67.50,
    type: 'Premium',
    status: 'Active'
  },
  {
    id: 123460,
    customer: 'michael@example.com',
    date: '2025-05-06T11:30:00Z',
    amount: 199.99,
    type: 'Luxury',
    status: 'Revoked'
  }
];

export default function MerchantDashboard() {
  const [apiKey, setApiKey] = useState('bkr_test_l7HzKm9N2s8fR3gT5pW6xY9v');
  const [webhookUrl, setWebhookUrl] = useState('https://example.com/webhook/receipts');
  const [loading, setLoading] = useState(false);
  const [receiptDefaults, setReceiptDefaults] = useState({
    standardEnabled: true,
    premiumEnabled: true,
    luxuryEnabled: false,
    defaultType: 'standard',
    autoIssue: true,
    emailNotification: true,
  });

  const handleGenerateNewKey = () => {
    setLoading(true);
    setTimeout(() => {
      setApiKey(`bkr_test_${Math.random().toString(36).substring(2, 15)}`);
      setLoading(false);
    }, 800);
  };

  const handleSaveSettings = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Merchant Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your blockchain receipt settings, analytics, and integrations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Receipts Issued
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">301</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Unique Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">178</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Revenue Processed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$26,412</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="receipts">Receipts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome to your BlockReceipt Dashboard</CardTitle>
                  <CardDescription>
                    Your central hub for managing blockchain receipts for your customers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md bg-blue-50 p-4 border border-blue-100">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-blue-700" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">API Integration</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            Use your API key to integrate BlockReceipt with your POS system or e-commerce platform.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Your API Key</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Use this key to authenticate your integration with the BlockReceipt API.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      value={apiKey}
                      readOnly
                      type="password"
                    />
                    <Button variant="outline" size="icon" onClick={handleCopyApiKey}>
                      <Copy className="h-4 w-4" />
                    </Button>
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

                  <div>
                    <h3 className="text-lg font-medium">Webhook URL</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Receive real-time notifications when receipts are minted or interacted with.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://your-website.com/webhook"
                    />
                    <Button variant="outline" size="icon">
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Receipt Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of receipt types issued
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {receiptTypes.map((item) => (
                        <div key={item.type} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Badge variant={item.type === 'Standard' ? 'default' : 
                                          item.type === 'Premium' ? 'secondary' : 'destructive'} 
                                   className="mr-2">
                              {item.type}
                            </Badge>
                            <span>{item.count} receipts</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  item.type === 'Standard' ? 'bg-blue-500' : 
                                  item.type === 'Premium' ? 'bg-purple-500' : 'bg-amber-500'
                                }`} 
                                style={{ width: `${item.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-500">{item.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest blockchain receipt transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockReceipts.slice(0, 3).map((receipt) => (
                        <div key={receipt.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                          <div>
                            <div className="font-medium">{receipt.customer}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(receipt.date).toLocaleDateString()} • ${receipt.amount.toFixed(2)}
                            </div>
                          </div>
                          <Badge variant={
                            receipt.type === 'Standard' ? 'default' :
                            receipt.type === 'Premium' ? 'secondary' : 'destructive'
                          }>
                            {receipt.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="w-full">View All Receipts</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="receipts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Receipt Management</CardTitle>
                  <CardDescription>
                    View and manage customer receipts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <Input placeholder="Search receipts..." className="max-w-sm" />
                    <div className="flex items-center space-x-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Receipt Type</SelectLabel>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="luxury">Luxury</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">Export</Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Receipt ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockReceipts.map((receipt) => (
                          <TableRow key={receipt.id}>
                            <TableCell className="font-medium">{receipt.id}</TableCell>
                            <TableCell>{receipt.customer}</TableCell>
                            <TableCell>{new Date(receipt.date).toLocaleDateString()}</TableCell>
                            <TableCell>${receipt.amount.toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge variant={
                                receipt.type === 'Standard' ? 'default' :
                                receipt.type === 'Premium' ? 'secondary' : 'destructive'
                              }>
                                {receipt.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={receipt.status === 'Active' ? 'outline' : 'destructive'}>
                                {receipt.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing 5 of 301 receipts
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integration Settings</CardTitle>
                  <CardDescription>
                    Configure your API and integration preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">API Configuration</h3>
                      <p className="text-sm text-gray-500">
                        Manage your API keys and webhook endpoints
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="apiKey">API Key</Label>
                        <div className="flex">
                          <Input
                            id="apiKey"
                            value={apiKey}
                            readOnly
                            type="password"
                            className="rounded-r-none"
                          />
                          <Button variant="outline" className="rounded-l-none border-l-0" onClick={handleCopyApiKey}>
                            Copy
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="webhookUrl">Webhook URL</Label>
                        <Input
                          id="webhookUrl"
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          placeholder="https://your-website.com/webhook"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch id="webhookEnabled" defaultChecked />
                        <Label htmlFor="webhookEnabled">Enable webhook notifications</Label>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Receipt Defaults</h3>
                      <p className="text-sm text-gray-500">
                        Configure default settings for receipt generation
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="standardEnabled">Standard Receipt Tier</Label>
                          <Switch 
                            id="standardEnabled" 
                            checked={receiptDefaults.standardEnabled}
                            onCheckedChange={(checked) => setReceiptDefaults({...receiptDefaults, standardEnabled: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="premiumEnabled">Premium Receipt Tier</Label>
                          <Switch 
                            id="premiumEnabled" 
                            checked={receiptDefaults.premiumEnabled}
                            onCheckedChange={(checked) => setReceiptDefaults({...receiptDefaults, premiumEnabled: checked})}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="luxuryEnabled">Luxury Receipt Tier</Label>
                          <Switch 
                            id="luxuryEnabled" 
                            checked={receiptDefaults.luxuryEnabled}
                            onCheckedChange={(checked) => setReceiptDefaults({...receiptDefaults, luxuryEnabled: checked})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Default Receipt Type</Label>
                          <RadioGroup 
                            defaultValue={receiptDefaults.defaultType}
                            className="flex flex-col space-y-1 mt-2"
                            onValueChange={(value) => setReceiptDefaults({...receiptDefaults, defaultType: value})}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="standard" id="standard" />
                              <Label htmlFor="standard">Standard</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="premium" id="premium" />
                              <Label htmlFor="premium">Premium</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="luxury" id="luxury" />
                              <Label htmlFor="luxury">Luxury</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="autoIssue" 
                          checked={receiptDefaults.autoIssue}
                          onCheckedChange={(checked) => setReceiptDefaults({...receiptDefaults, autoIssue: checked})}
                        />
                        <Label htmlFor="autoIssue">Automatically issue receipts for all transactions</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="emailNotification" 
                          checked={receiptDefaults.emailNotification}
                          onCheckedChange={(checked) => setReceiptDefaults({...receiptDefaults, emailNotification: checked})}
                        />
                        <Label htmlFor="emailNotification">Send email notifications for new receipts</Label>
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
                  <CardTitle>Receipt Appearance</CardTitle>
                  <CardDescription>
                    Customize how your NFT receipts look
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Brand Color</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="w-10 h-10 rounded-md bg-blue-600 border"></div>
                          <Input type="text" value="#2563eb" className="w-24" />
                          <Button variant="outline" size="sm">
                            <Palette className="h-4 w-4 mr-2" />
                            Change
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label>Logo Image</Label>
                        <div className="flex items-center space-x-2 mt-2">
                          <div className="w-10 h-10 rounded-md bg-gray-100 border flex items-center justify-center">
                            <ShoppingBag className="h-6 w-6 text-gray-500" />
                          </div>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Receipt Style</Label>
                        <Select defaultValue="modern">
                          <SelectTrigger className="w-full mt-2">
                            <SelectValue placeholder="Select a style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="modern">Modern</SelectItem>
                              <SelectItem value="classic">Classic</SelectItem>
                              <SelectItem value="minimal">Minimal</SelectItem>
                              <SelectItem value="vibrant">Vibrant</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Animation Effect</Label>
                        <Select defaultValue="shine">
                          <SelectTrigger className="w-full mt-2">
                            <SelectValue placeholder="Select animation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="shine">Shine</SelectItem>
                              <SelectItem value="pulse">Pulse</SelectItem>
                              <SelectItem value="rotate">Rotate</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
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
                  <CardTitle>Monthly Performance</CardTitle>
                  <CardDescription>
                    Receipts issued and revenue processed
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analyticsData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="receipts" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Receipt Distribution</CardTitle>
                    <CardDescription>
                      By receipt type
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div style={{ width: '100%', height: 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={receiptTypes}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8884d8">
                            {receiptTypes.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={
                                  entry.type === 'Standard' ? '#3b82f6' : 
                                  entry.type === 'Premium' ? '#8b5cf6' : '#f59e0b'
                                } 
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Top Customers</CardTitle>
                    <CardDescription>
                      By receipt volume
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">johndoe@example.com</div>
                          <div className="text-sm text-gray-500">12 receipts</div>
                        </div>
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">alice@example.com</div>
                          <div className="text-sm text-gray-500">9 receipts</div>
                        </div>
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">bob@example.com</div>
                          <div className="text-sm text-gray-500">7 receipts</div>
                        </div>
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '47%' }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
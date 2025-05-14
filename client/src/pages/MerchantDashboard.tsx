import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';
import { 
  Store, 
  BarChart2, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Receipt,
  GaugeCircle,
  Settings,
  Clock,
  FileText,
  Key
} from 'lucide-react';

// Chart component placeholder (would be recharts in a real implementation)
const SalesChart: React.FC = () => (
  <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
    <BarChart2 className="h-10 w-10 text-gray-300" />
    <span className="text-sm text-gray-500 ml-2">Sales chart visualization</span>
  </div>
);

const TopProducts: React.FC = () => (
  <div className="space-y-3">
    {[
      { name: 'Organic Avocado', sales: 423, trend: 'up', percentage: 12 },
      { name: 'Almond Milk', sales: 358, trend: 'up', percentage: 8 },
      { name: 'Organic Banana', sales: 294, trend: 'down', percentage: 3 },
      { name: 'Whole Grain Bread', sales: 247, trend: 'up', percentage: 5 },
      { name: 'Greek Yogurt', sales: 193, trend: 'down', percentage: 2 },
    ].map((product, idx) => (
      <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
        <div>
          <div className="font-medium">{product.name}</div>
          <div className="text-sm text-muted-foreground">{product.sales} units</div>
        </div>
        <div className={`flex items-center ${product.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {product.trend === 'up' ? (
            <ArrowUpRight className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 mr-1" />
          )}
          <span>{product.percentage}%</span>
        </div>
      </div>
    ))}
  </div>
);

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  trend, 
  trendValue, 
  icon, 
  iconBg, 
  iconColor 
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            
            {trend && (
              <div className={`flex items-center mt-1 text-sm ${
                trend === 'up' 
                  ? 'text-green-600' 
                  : trend === 'down' 
                    ? 'text-red-600' 
                    : 'text-gray-600'
              }`}>
                {trend === 'up' ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : trend === 'down' ? (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                ) : null}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          
          <div className={`p-3 rounded-full ${iconBg}`}>
            <div className={`${iconColor}`}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MerchantDashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold flex items-center">
              <Store className="mr-3 h-8 w-8 text-primary" />
              Merchant Dashboard
            </h1>
            <p className="text-xl text-muted-foreground mt-1">
              Monitor sales and NFT receipt generation
            </p>
          </div>
          
          <div className="flex space-x-3">
            <div className="bg-yellow-50 rounded-lg px-4 py-2 flex items-center border border-yellow-200">
              <div className="pr-3 border-r border-yellow-200">
                <GaugeCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="px-3">
                <div className="text-sm text-yellow-800 font-medium">Receipt Credits</div>
                <div className="text-xl font-bold text-yellow-900">2,450</div>
              </div>
              <Button variant="outline" size="sm" className="ml-2 bg-white border-yellow-200 text-yellow-800 hover:bg-yellow-50 hover:text-yellow-900">
                Buy More
              </Button>
            </div>
            
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Sales"
            value="$24,532"
            trend="up"
            trendValue="12% from last month"
            icon={<DollarSign className="h-6 w-6" />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          
          <KPICard
            title="NFT Receipts Created"
            value="1,284"
            trend="up"
            trendValue="8% from last month"
            icon={<Receipt className="h-6 w-6" />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
          
          <KPICard
            title="Active Customers"
            value="832"
            trend="up"
            trendValue="5% from last month"
            icon={<Users className="h-6 w-6" />}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          
          <KPICard
            title="Inventory Items"
            value="472"
            trend="neutral"
            trendValue="2 new items this week"
            icon={<ShoppingBag className="h-6 w-6" />}
            iconBg="bg-amber-100"
            iconColor="text-amber-600"
          />
        </div>
        
        <Tabs defaultValue="sales">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="sales">
                <TrendingUp className="h-4 w-4 mr-2" />
                Sales & Analytics
              </TabsTrigger>
              <TabsTrigger value="receipts">
                <Receipt className="h-4 w-4 mr-2" />
                NFT Receipts
              </TabsTrigger>
              <TabsTrigger value="customers">
                <Users className="h-4 w-4 mr-2" />
                Customers
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Last 30 Days
              </Button>
              <Button size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </div>
          </div>
          
          <TabsContent value="sales" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Daily revenue for the past 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <SalesChart />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>Based on last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <TopProducts />
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">
                    View All Products
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Product category breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { category: 'Produce', value: 35, color: 'bg-green-500' },
                    { category: 'Dairy & Alternatives', value: 27, color: 'bg-blue-500' },
                    { category: 'Bakery', value: 18, color: 'bg-amber-500' },
                    { category: 'Meat & Seafood', value: 12, color: 'bg-red-500' },
                    { category: 'Pantry', value: 8, color: 'bg-purple-500' },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.category}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                      <Progress value={item.value} className={`h-2 ${item.color}`} />
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Receipt Engagement</CardTitle>
                  <CardDescription>How customers interact with their receipts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-green-600">78%</div>
                      <div className="text-sm text-gray-600 mt-1">View Rate</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-blue-600">4.2</div>
                      <div className="text-sm text-gray-600 mt-1">Avg. Return Visits</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Warranty Tracked</span>
                      <span className="font-medium">64%</span>
                    </div>
                    <Progress value={64} className="h-2 bg-amber-200" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Verified by Customer</span>
                      <span className="font-medium">53%</span>
                    </div>
                    <Progress value={53} className="h-2 bg-purple-200" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Shared with Others</span>
                      <span className="font-medium">21%</span>
                    </div>
                    <Progress value={21} className="h-2 bg-blue-200" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="receipts" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Recent NFT Receipts Generated</CardTitle>
                    <CardDescription>Last 20 receipts generated for customers</CardDescription>
                  </div>
                  <Input placeholder="Search receipts..." className="w-64" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-3">Customer</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Status</div>
                  </div>
                  {[
                    { id: '7891', date: '2025-05-14', customer: 'John Smith', email: 'john@example.com', amount: 84.32, type: 'luxury', status: 'completed' },
                    { id: '7890', date: '2025-05-14', customer: 'Sarah Johnson', email: 'sarah@example.com', amount: 45.99, type: 'standard', status: 'completed' },
                    { id: '7889', date: '2025-05-14', customer: 'Michael Brown', email: 'michael@example.com', amount: 129.50, type: 'premium', status: 'completed' },
                    { id: '7888', date: '2025-05-13', customer: 'Emily Davis', email: 'emily@example.com', amount: 67.25, type: 'standard', status: 'completed' },
                    { id: '7887', date: '2025-05-13', customer: 'David Wilson', email: 'david@example.com', amount: 93.75, type: 'premium', status: 'completed' },
                    { id: '7886', date: '2025-05-13', customer: 'Jessica Taylor', email: 'jessica@example.com', amount: 22.50, type: 'standard', status: 'completed' },
                    { id: '7885', date: '2025-05-12', customer: 'Robert Miller', email: 'robert@example.com', amount: 156.40, type: 'luxury', status: 'completed' },
                    { id: '7884', date: '2025-05-12', customer: 'Jennifer Anderson', email: 'jennifer@example.com', amount: 35.99, type: 'standard', status: 'completed' },
                  ].map((receipt, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 text-sm">
                      <div className="col-span-1 font-mono text-gray-600">#{receipt.id}</div>
                      <div className="col-span-2">{receipt.date}</div>
                      <div className="col-span-3">
                        <div>{receipt.customer}</div>
                        <div className="text-xs text-muted-foreground">{receipt.email}</div>
                      </div>
                      <div className="col-span-2">${receipt.amount.toFixed(2)}</div>
                      <div className="col-span-2">
                        <Badge variant="outline" className={
                          receipt.type === 'luxury' 
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : receipt.type === 'premium'
                              ? 'bg-purple-50 text-purple-700 border-purple-200' 
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                        }>
                          {receipt.type.charAt(0).toUpperCase() + receipt.type.slice(1)}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing 8 of 1,284 receipts
                </div>
                <Button variant="outline">
                  View All Receipts
                </Button>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Receipt Distribution</CardTitle>
                  <CardDescription>By tier type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Standard Tier</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <Progress value={65} className="h-2 bg-blue-500" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Premium Tier</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <Progress value={28} className="h-2 bg-purple-500" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Luxury Tier</span>
                      <span className="font-medium">7%</span>
                    </div>
                    <Progress value={7} className="h-2 bg-amber-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Features</CardTitle>
                  <CardDescription>TACo encryption usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center pb-4">
                      <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 border-4 border-blue-100">
                        <div className="text-2xl font-bold text-blue-700">43%</div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        of receipts use TACo encryption
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Access Granted</span>
                        <span className="font-medium">76%</span>
                      </div>
                      <Progress value={76} className="h-2 bg-green-500" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Access Revoked</span>
                        <span className="font-medium">24%</span>
                      </div>
                      <Progress value={24} className="h-2 bg-red-500" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Manage Encryption
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Features</CardTitle>
                  <CardDescription>Coming soon to BlockReceipt</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Auto Receipt Scanning', status: 'beta', date: 'May 20, 2025' },
                      { name: 'Customer Loyalty Points', status: 'development', date: 'June 5, 2025' },
                      { name: 'Enhanced Analytics', status: 'planning', date: 'July 2025' },
                      { name: 'Merchant API', status: 'alpha', date: 'May 30, 2025' },
                    ].map((feature, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{feature.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {feature.date}
                          </div>
                        </div>
                        <Badge variant="outline" className={
                          feature.status === 'beta' 
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : feature.status === 'alpha'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : feature.status === 'development'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-gray-50 text-gray-700 border-gray-200'
                        }>
                          {feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View Roadmap
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Customer Overview</CardTitle>
                    <CardDescription>Key customer metrics and insights</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Total Customers</div>
                    <div className="text-3xl font-bold">3,284</div>
                    <div className="text-sm text-green-600 flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>12% increase this month</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Avg. Receipts per Customer</div>
                    <div className="text-3xl font-bold">4.7</div>
                    <div className="text-sm text-green-600 flex items-center mt-1">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      <span>0.3 increase from last month</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Avg. Purchase Value</div>
                    <div className="text-3xl font-bold">$68.42</div>
                    <div className="text-sm text-red-600 flex items-center mt-1">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      <span>3% decrease this month</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <h3 className="text-sm font-medium mb-2">Customer Retention</h3>
                  
                  <div className="flex justify-between text-sm">
                    <span>Returning Customers</span>
                    <span className="font-medium">72%</span>
                  </div>
                  <Progress value={72} className="h-2 bg-green-500" />
                  
                  <div className="flex justify-between text-sm">
                    <span>One-time Shoppers</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <Progress value={28} className="h-2 bg-gray-500" />
                  
                  <div className="flex justify-between text-sm">
                    <span>NFT Receipt Engagement</span>
                    <span className="font-medium">64%</span>
                  </div>
                  <Progress value={64} className="h-2 bg-blue-500" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MerchantDashboard;
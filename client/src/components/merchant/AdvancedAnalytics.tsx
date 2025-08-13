import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Receipt, 
  ShoppingCart,
  BarChart3,
  PieChart,
  Activity,
  Target
} from 'lucide-react';

interface AnalyticsData {
  totalRevenue: number;
  monthlyGrowth: number;
  totalCustomers: number;
  customerGrowth: number;
  totalReceipts: number;
  receiptGrowth: number;
  averageTransactionValue: number;
  topCategories: Array<{ name: string; value: number; percentage: number }>;
  recentTransactions: Array<{
    id: string;
    customer: string;
    amount: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
  }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
}

export default function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    // Simulate fetching analytics data
    const fetchAnalytics = async () => {
      setLoading(true);
      // In production, this would fetch from your API
      const mockData: AnalyticsData = {
        totalRevenue: 124750.50,
        monthlyGrowth: 12.5,
        totalCustomers: 2847,
        customerGrowth: 8.3,
        totalReceipts: 15642,
        receiptGrowth: 15.7,
        averageTransactionValue: 43.85,
        topCategories: [
          { name: 'Food & Beverage', value: 45620, percentage: 36.5 },
          { name: 'Electronics', value: 32450, percentage: 26.0 },
          { name: 'Clothing', value: 18920, percentage: 15.2 },
          { name: 'Home & Garden', value: 15680, percentage: 12.6 },
          { name: 'Other', value: 12080, percentage: 9.7 }
        ],
        recentTransactions: [
          { id: 'TXN-001', customer: 'John D.', amount: 89.99, date: '2024-01-15', status: 'completed' },
          { id: 'TXN-002', customer: 'Sarah M.', amount: 156.75, date: '2024-01-15', status: 'completed' },
          { id: 'TXN-003', customer: 'Mike R.', amount: 234.50, date: '2024-01-14', status: 'pending' },
          { id: 'TXN-004', customer: 'Lisa K.', amount: 67.25, date: '2024-01-14', status: 'completed' },
          { id: 'TXN-005', customer: 'David P.', amount: 189.99, date: '2024-01-13', status: 'completed' }
        ],
        revenueByMonth: [
          { month: 'Jan', revenue: 124750 },
          { month: 'Dec', revenue: 110200 },
          { month: 'Nov', revenue: 98500 },
          { month: 'Oct', revenue: 89200 },
          { month: 'Sep', revenue: 78400 },
          { month: 'Aug', revenue: 71200 }
        ]
      };

      setTimeout(() => {
        setAnalytics(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-20 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time insights into your business performance
          </p>
        </div>
        <div className="flex space-x-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              +{analytics.monthlyGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalCustomers.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              +{analytics.customerGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalReceipts.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              +{analytics.receiptGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.averageTransactionValue.toFixed(2)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-blue-600 mr-1" />
              Per transaction
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Revenue by Category
            </CardTitle>
            <CardDescription>
              Breakdown of revenue by product category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topCategories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: [
                          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
                        ][index % 5]
                      }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {category.percentage}%
                    </span>
                    <span className="text-sm font-medium">
                      ${category.value.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Recent Transactions
            </CardTitle>
            <CardDescription>
              Latest customer transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{transaction.customer}</p>
                    <p className="text-sm text-muted-foreground">{transaction.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${transaction.amount.toFixed(2)}</p>
                    <Badge 
                      variant={
                        transaction.status === 'completed' ? 'default' : 
                        transaction.status === 'pending' ? 'secondary' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Revenue Trend
          </CardTitle>
          <CardDescription>
            Monthly revenue performance over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end space-x-2 h-32">
            {analytics.revenueByMonth.map((month, index) => {
              const maxRevenue = Math.max(...analytics.revenueByMonth.map(m => m.revenue));
              const height = (month.revenue / maxRevenue) * 100;
              return (
                <div key={month.month} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-primary rounded-t"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground mt-2">
                    {month.month}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
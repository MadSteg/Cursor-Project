import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/WalletContext';
import WalletInfo from '../components/WalletInfo';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Receipt, 
  ShoppingCart,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Star,
  Award,
  Calendar,
  CreditCard,
  TrendingUpIcon,
  Users,
  Zap
} from 'lucide-react';

interface DashboardData {
  userStats: {
    totalReceipts: number;
    totalSpent: number;
    averageReceipt: number;
    receiptsThisMonth: number;
    spendingThisMonth: number;
    monthlyGrowth: number;
  };
  loyaltyStatus: {
    currentTier: string;
    currentPoints: number;
    pointsToNextTier: number;
    nextTier: string;
    tierMultiplier: number;
  };
  recentReceipts: Array<{
    id: string;
    merchantName: string;
    date: string;
    amount: number;
    category: string;
    loyaltyTier: string;
  }>;
  spendingByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
    count: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    spending: number;
    receipts: number;
  }>;
}

const Dashboard: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user analytics data
        const [analyticsRes, loyaltyRes] = await Promise.all([
          fetch('/api/analytics/customer/current'),
          fetch('/api/loyalty/user/current')
        ]);

        if (!analyticsRes.ok || !loyaltyRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const analyticsData = await analyticsRes.json();
        const loyaltyData = await loyaltyRes.json();

        // Transform the data into our dashboard format
        const transformedData: DashboardData = {
          userStats: {
            totalReceipts: analyticsData.data.totalReceipts || 0,
            totalSpent: analyticsData.data.totalSpent || 0,
            averageReceipt: analyticsData.data.averageReceipt || 0,
            receiptsThisMonth: analyticsData.data.receiptsThisMonth || 0,
            spendingThisMonth: analyticsData.data.spendingThisMonth || 0,
            monthlyGrowth: analyticsData.data.monthlyGrowth || 0
          },
          loyaltyStatus: {
            currentTier: loyaltyData.data.currentTier || 'Bronze',
            currentPoints: loyaltyData.data.currentPoints || 0,
            pointsToNextTier: loyaltyData.data.pointsToNextTier || 0,
            nextTier: loyaltyData.data.nextTier || 'Silver',
            tierMultiplier: loyaltyData.data.tierMultiplier || 1
          },
          recentReceipts: analyticsData.data.recentReceipts || [],
          spendingByCategory: analyticsData.data.spendingByCategory || [],
          monthlyTrends: analyticsData.data.monthlyTrends || []
        };

        setDashboardData(transformedData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
        
        // Fallback to mock data for demonstration
        setDashboardData(getMockDashboardData());
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isLoggedIn]);

  const getMockDashboardData = (): DashboardData => ({
    userStats: {
      totalReceipts: 47,
      totalSpent: 3247.80,
      averageReceipt: 69.10,
      receiptsThisMonth: 12,
      spendingThisMonth: 892.45,
      monthlyGrowth: 15.3
    },
    loyaltyStatus: {
      currentTier: 'Gold',
      currentPoints: 2847,
      pointsToNextTier: 1153,
      nextTier: 'Platinum',
      tierMultiplier: 2
    },
    recentReceipts: [
      { id: '1', merchantName: 'Target', date: '2025-01-15', amount: 82.47, category: 'Retail', loyaltyTier: 'Gold' },
      { id: '2', merchantName: 'Whole Foods', date: '2025-01-12', amount: 145.32, category: 'Groceries', loyaltyTier: 'Gold' },
      { id: '3', merchantName: 'Best Buy', date: '2025-01-08', amount: 299.99, category: 'Electronics', loyaltyTier: 'Gold' },
      { id: '4', merchantName: 'Starbucks', date: '2025-01-10', amount: 8.75, category: 'Food & Beverage', loyaltyTier: 'Gold' },
      { id: '5', merchantName: 'Amazon', date: '2025-01-05', amount: 67.89, category: 'Online Retail', loyaltyTier: 'Gold' }
    ],
    spendingByCategory: [
      { category: 'Groceries', amount: 892.45, percentage: 27.5, count: 18 },
      { category: 'Electronics', amount: 756.32, percentage: 23.3, count: 8 },
      { category: 'Food & Beverage', amount: 623.18, percentage: 19.2, count: 15 },
      { category: 'Retail', amount: 456.78, percentage: 14.1, count: 12 },
      { category: 'Transportation', amount: 234.67, percentage: 7.2, count: 6 },
      { category: 'Other', amount: 284.40, percentage: 8.7, count: 8 }
    ],
    monthlyTrends: [
      { month: 'Jan', spending: 892.45, receipts: 12 },
      { month: 'Dec', spending: 756.32, receipts: 10 },
      { month: 'Nov', spending: 623.18, receipts: 8 },
      { month: 'Oct', spending: 456.78, receipts: 6 },
      { month: 'Sep', spending: 234.67, receipts: 4 },
      { month: 'Aug', spending: 284.40, receipts: 7 }
    ]
  });

  if (!isLoggedIn) {
    return (
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="bg-card shadow-sm rounded-lg p-8 border text-center">
          <h3 className="text-xl font-medium mb-4">Welcome to BlockReceipt.ai</h3>
          <p className="text-muted-foreground mb-6">
            Connect your account to view your receipt statistics, spending analytics, and loyalty rewards
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-secondary/40 rounded-lg">
                <Receipt className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">Digital Receipts</p>
                <p className="text-muted-foreground">Store and organize all your receipts</p>
              </div>
              <div className="p-4 bg-secondary/40 rounded-lg">
                <BarChart3 className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">Smart Analytics</p>
                <p className="text-muted-foreground">Track spending patterns and trends</p>
              </div>
              <div className="p-4 bg-secondary/40 rounded-lg">
                <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="font-medium">Loyalty Rewards</p>
                <p className="text-muted-foreground">Earn points and unlock benefits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
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

  if (error) {
    return (
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { userStats, loyaltyStatus, recentReceipts, spendingByCategory, monthlyTrends } = dashboardData;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>{loyaltyStatus.currentTier} Tier</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Zap className="w-4 h-4" />
            <span>{loyaltyStatus.currentPoints} Points</span>
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalReceipts}</div>
            <p className="text-xs text-muted-foreground">
              +{userStats.receiptsThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${userStats.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +${userStats.spendingThisMonth.toFixed(2)} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Receipt</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${userStats.averageReceipt.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {userStats.monthlyGrowth > 0 ? '+' : ''}{userStats.monthlyGrowth}% vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loyalty Tier</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loyaltyStatus.currentTier}</div>
            <p className="text-xs text-muted-foreground">
              {loyaltyStatus.pointsToNextTier} points to {loyaltyStatus.nextTier}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Receipts */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Receipt className="w-5 h-5" />
                <span>Recent Receipts</span>
              </CardTitle>
              <CardDescription>Your latest transactions and spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReceipts.map((receipt) => (
                  <div key={receipt.id} className="flex justify-between items-center p-3 bg-secondary/40 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{receipt.merchantName}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(receipt.date).toLocaleDateString()}</span>
                        <Badge variant="outline" className="text-xs">
                          {receipt.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${receipt.amount.toFixed(2)}</p>
                      <Badge variant="secondary" className="text-xs">
                        {receipt.loyaltyTier}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link href="/gallery" className="text-sm text-primary hover:underline">
                  View All Receipts →
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loyalty Status */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Loyalty Status</span>
              </CardTitle>
              <CardDescription>Your current tier and progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {loyaltyStatus.currentTier}
                </div>
                <Badge variant="outline" className="text-sm">
                  {loyaltyStatus.tierMultiplier}x Points Multiplier
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Points</span>
                  <span className="font-medium">{loyaltyStatus.currentPoints.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Next Tier</span>
                  <span className="font-medium">{loyaltyStatus.nextTier}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Points Needed</span>
                  <span className="font-medium">{loyaltyStatus.pointsToNextTier.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4">
                <Link 
                  href="/loyalty" 
                  className="w-full block text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  View Rewards
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Spending Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Spending by Category</span>
            </CardTitle>
            <CardDescription>Breakdown of your spending patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {spendingByCategory.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}
                    />
                    <span className="text-sm font-medium">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${category.amount.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">
                      {category.percentage.toFixed(1)}% • {category.count} receipts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUpIcon className="w-5 h-5" />
              <span>Monthly Trends</span>
            </CardTitle>
            <CardDescription>Your spending over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyTrends.map((trend) => (
                <div key={trend.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{trend.month}</span>
                  <div className="text-right">
                    <div className="font-medium">${trend.spending.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">
                      {trend.receipts} receipts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link 
                href="/upload" 
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-secondary/40 transition-colors"
              >
                <Receipt className="w-8 h-8 mb-2 text-primary" />
                <span className="text-sm font-medium">Upload Receipt</span>
              </Link>
              
              <Link 
                href="/analytics" 
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-secondary/40 transition-colors"
              >
                <BarChart3 className="w-8 h-8 mb-2 text-primary" />
                <span className="text-sm font-medium">View Analytics</span>
              </Link>
              
              <Link 
                href="/loyalty" 
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-secondary/40 transition-colors"
              >
                <Star className="w-8 h-8 mb-2 text-primary" />
                <span className="text-sm font-medium">Loyalty Rewards</span>
              </Link>
              
              <Link 
                href="/settings" 
                className="flex flex-col items-center p-4 border rounded-lg hover:bg-secondary/40 transition-colors"
              >
                <Activity className="w-8 h-8 mb-2 text-primary" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
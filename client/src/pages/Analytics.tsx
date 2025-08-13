import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/WalletContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Receipt, 
  Calendar,
  Target,
  Lightbulb,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface AnalyticsData {
  spendingByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
    count: number;
    trend: 'up' | 'down' | 'stable';
    changePercent: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    spending: number;
    receipts: number;
    changePercent: number;
  }>;
  spendingInsights: Array<{
    type: 'savings' | 'trend' | 'alert';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    actionable: boolean;
  }>;
  merchantAnalysis: Array<{
    merchant: string;
    totalSpent: number;
    visitCount: number;
    averageSpend: number;
    lastVisit: string;
    loyaltyTier: string;
  }>;
  budgetProgress: {
    totalBudget: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
    onTrack: boolean;
  };
}

const Analytics: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    fetchAnalyticsData();
  }, [isLoggedIn, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics data
      const response = await fetch(`/api/analytics/dashboard?timeRange=${timeRange}`);
      
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(transformAnalyticsData(data.data));
      } else {
        // Fallback to mock data
        setAnalyticsData(getMockAnalyticsData());
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalyticsData(getMockAnalyticsData());
    } finally {
      setLoading(false);
    }
  };

  const transformAnalyticsData = (data: any): AnalyticsData => {
    // Transform API data to our format
    return {
      spendingByCategory: data.spendingByCategory || [],
      monthlyTrends: data.monthlyTrends || [],
      spendingInsights: data.insights || [],
      merchantAnalysis: data.merchantAnalysis || [],
      budgetProgress: data.budgetProgress || {
        totalBudget: 5000,
        spent: 3247.80,
        remaining: 1752.20,
        percentageUsed: 64.96,
        onTrack: true
      }
    };
  };

  const getMockAnalyticsData = (): AnalyticsData => ({
    spendingByCategory: [
      { category: 'Groceries', amount: 892.45, percentage: 27.5, count: 18, trend: 'up', changePercent: 12.3 },
      { category: 'Electronics', amount: 756.32, percentage: 23.3, count: 8, trend: 'down', changePercent: -8.7 },
      { category: 'Food & Beverage', amount: 623.18, percentage: 19.2, count: 15, trend: 'up', changePercent: 15.2 },
      { category: 'Retail', amount: 456.78, percentage: 14.1, count: 12, trend: 'stable', changePercent: 2.1 },
      { category: 'Transportation', amount: 234.67, percentage: 7.2, count: 6, trend: 'up', changePercent: 22.5 },
      { category: 'Other', amount: 284.40, percentage: 8.7, count: 8, trend: 'down', changePercent: -5.3 }
    ],
    monthlyTrends: [
      { month: 'Jan', spending: 892.45, receipts: 12, changePercent: 15.3 },
      { month: 'Dec', spending: 756.32, receipts: 10, changePercent: -8.2 },
      { month: 'Nov', spending: 623.18, receipts: 8, changePercent: 12.7 },
      { month: 'Oct', spending: 456.78, receipts: 6, changePercent: -5.1 },
      { month: 'Sep', spending: 234.67, receipts: 4, changePercent: 18.9 },
      { month: 'Aug', spending: 284.40, receipts: 7, changePercent: 3.2 }
    ],
    spendingInsights: [
      {
        type: 'savings',
        title: 'Potential Monthly Savings',
        description: 'You could save $156/month by reducing dining out expenses by 25%',
        impact: 'high',
        actionable: true
      },
      {
        type: 'trend',
        title: 'Electronics Spending Down',
        description: 'Your electronics spending decreased 8.7% this month - great job!',
        impact: 'medium',
        actionable: false
      },
      {
        type: 'alert',
        title: 'Transportation Costs Rising',
        description: 'Transportation costs increased 22.5% - consider carpooling or public transit',
        impact: 'medium',
        actionable: true
      },
      {
        type: 'savings',
        title: 'Budget on Track',
        description: 'You\'re 65% through your monthly budget with 8 days remaining',
        impact: 'low',
        actionable: false
      }
    ],
    merchantAnalysis: [
      { merchant: 'Whole Foods', totalSpent: 456.78, visitCount: 8, averageSpend: 57.10, lastVisit: '2025-01-12', loyaltyTier: 'Gold' },
      { merchant: 'Target', totalSpent: 389.45, visitCount: 6, averageSpend: 64.91, lastVisit: '2025-01-15', loyaltyTier: 'Gold' },
      { merchant: 'Starbucks', totalSpent: 234.67, visitCount: 15, averageSpend: 15.64, lastVisit: '2025-01-10', loyaltyTier: 'Silver' },
      { merchant: 'Best Buy', totalSpent: 299.99, visitCount: 2, averageSpend: 150.00, lastVisit: '2025-01-08', loyaltyTier: 'Gold' },
      { merchant: 'Amazon', totalSpent: 567.89, visitCount: 12, averageSpend: 47.32, lastVisit: '2025-01-05', loyaltyTier: 'Platinum' }
    ],
    budgetProgress: {
      totalBudget: 5000,
      spent: 3247.80,
      remaining: 1752.20,
      percentageUsed: 64.96,
      onTrack: true
    }
  });

  if (!isLoggedIn) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>
          <p className="text-muted-foreground mb-6">
            Connect your account to view detailed spending analytics and insights
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mr-2" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  const { spendingByCategory, monthlyTrends, spendingInsights, merchantAnalysis, budgetProgress } = analyticsData;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Deep insights into your spending patterns and trends</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={fetchAnalyticsData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center space-x-2 mb-6">
        <span className="text-sm font-medium">Time Range:</span>
        {(['7d', '30d', '90d', '1y'] as const).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range)}
          >
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
          </Button>
        ))}
      </div>

      {/* Budget Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Monthly Budget Progress</span>
          </CardTitle>
          <CardDescription>Track your spending against your monthly budget</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Budget Used</span>
              <span className="text-sm font-medium">{budgetProgress.percentageUsed.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  budgetProgress.percentageUsed > 80 ? 'bg-red-500' : 
                  budgetProgress.percentageUsed > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(budgetProgress.percentageUsed, 100)}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">${budgetProgress.remaining.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </div>
              <div>
                <div className="text-2xl font-bold">${budgetProgress.spent.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Spent</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">${budgetProgress.totalBudget.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Total Budget</div>
              </div>
            </div>
            <div className="text-center">
              <Badge variant={budgetProgress.onTrack ? 'default' : 'destructive'}>
                {budgetProgress.onTrack ? 'On Track' : 'Over Budget'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Spending by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="w-5 h-5" />
              <span>Spending by Category</span>
            </CardTitle>
            <CardDescription>Breakdown of your spending patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {spendingByCategory.map((category, index) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}
                      />
                      <span className="font-medium">{category.category}</span>
                      <Badge variant="outline" className="text-xs">
                        {category.count} receipts
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${category.amount.toFixed(2)}</div>
                      <div className="flex items-center space-x-1 text-xs">
                        {category.trend === 'up' ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : category.trend === 'down' ? (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        ) : (
                          <div className="w-3 h-3 text-gray-400">—</div>
                        )}
                        <span className={category.trend === 'up' ? 'text-green-500' : category.trend === 'down' ? 'text-red-500' : 'text-gray-500'}>
                          {category.changePercent > 0 ? '+' : ''}{category.changePercent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${category.percentage}%`,
                        backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                      }}
                    />
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
              <TrendingUp className="w-5 h-5" />
              <span>Monthly Spending Trends</span>
            </CardTitle>
            <CardDescription>Your spending patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyTrends.map((trend) => (
                <div key={trend.month} className="flex items-center justify-between p-3 bg-secondary/40 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{trend.month}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${trend.spending.toFixed(2)}</div>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{trend.receipts} receipts</span>
                      <span className={trend.changePercent > 0 ? 'text-green-500' : 'text-red-500'}>
                        {trend.changePercent > 0 ? '+' : ''}{trend.changePercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Insights */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>Smart Insights</span>
          </CardTitle>
          <CardDescription>AI-powered recommendations to optimize your spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spendingInsights.map((insight, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  insight.type === 'savings' ? 'border-green-200 bg-green-50' :
                  insight.type === 'trend' ? 'border-blue-200 bg-blue-50' :
                  'border-yellow-200 bg-yellow-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    insight.type === 'savings' ? 'bg-green-100 text-green-600' :
                    insight.type === 'trend' ? 'bg-blue-100 text-blue-600' :
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {insight.type === 'savings' ? <DollarSign className="w-4 h-4" /> :
                     insight.type === 'trend' ? <TrendingUp className="w-4 h-4" /> :
                     <Target className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {insight.impact} impact
                      </Badge>
                      {insight.actionable && (
                        <Badge variant="secondary" className="text-xs">
                          Actionable
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Merchant Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="w-5 h-5" />
            <span>Merchant Analysis</span>
          </CardTitle>
          <CardDescription>Your spending patterns by merchant</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {merchantAnalysis.map((merchant) => (
              <div key={merchant.merchant} className="flex items-center justify-between p-4 bg-secondary/40 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {merchant.merchant.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{merchant.merchant}</h4>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{merchant.visitCount} visits</span>
                      <span>•</span>
                      <span>Last: {new Date(merchant.lastVisit).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${merchant.totalSpent.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">
                    Avg: ${merchant.averageSpend.toFixed(2)}
                  </div>
                  <Badge variant="outline" className="text-xs mt-1">
                    {merchant.loyaltyTier}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;

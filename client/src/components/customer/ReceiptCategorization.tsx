import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  ShoppingBag, 
  Utensils, 
  Car, 
  Home, 
  Heart,
  TrendingUp,
  Calendar,
  DollarSign,
  Tag,
  Sparkles
} from 'lucide-react';

interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  confidence: number;
}

interface CategorizedReceipt {
  id: string;
  merchantName: string;
  date: string;
  total: number;
  category: string;
  subcategory: string;
  items: ReceiptItem[];
  aiConfidence: number;
  tags: string[];
  insights: string[];
}

export default function ReceiptCategorization() {
  const [receipts, setReceipts] = useState<CategorizedReceipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Simulate fetching categorized receipts
    const fetchCategorizedReceipts = async () => {
      setLoading(true);
      
      const mockReceipts: CategorizedReceipt[] = [
        {
          id: 'RCPT-001',
          merchantName: 'Starbucks',
          date: '2024-01-15',
          total: 12.45,
          category: 'Food & Beverage',
          subcategory: 'Coffee & Tea',
          items: [
            { id: '1', name: 'Venti Latte', price: 5.25, quantity: 1, category: 'Beverages', confidence: 0.95 },
            { id: '2', name: 'Blueberry Muffin', price: 3.50, quantity: 1, category: 'Bakery', confidence: 0.92 },
            { id: '3', name: 'Bottle Water', price: 3.70, quantity: 1, category: 'Beverages', confidence: 0.88 }
          ],
          aiConfidence: 0.94,
          tags: ['coffee', 'breakfast', 'premium'],
          insights: ['You spend 23% more on coffee than average', 'Consider buying in bulk to save money']
        },
        {
          id: 'RCPT-002',
          merchantName: 'Best Buy',
          date: '2024-01-14',
          total: 299.99,
          category: 'Electronics',
          subcategory: 'Computers & Accessories',
          items: [
            { id: '1', name: 'Wireless Mouse', price: 29.99, quantity: 1, category: 'Computer Accessories', confidence: 0.97 },
            { id: '2', name: 'USB-C Cable', price: 19.99, quantity: 2, category: 'Cables', confidence: 0.89 },
            { id: '3', name: 'Laptop Stand', price: 249.99, quantity: 1, category: 'Computer Accessories', confidence: 0.91 }
          ],
          aiConfidence: 0.92,
          tags: ['electronics', 'work', 'premium'],
          insights: ['This is your largest electronics purchase this month', 'Consider warranty options for the laptop stand']
        },
        {
          id: 'RCPT-003',
          merchantName: 'Target',
          date: '2024-01-13',
          total: 67.89,
          category: 'Home & Garden',
          subcategory: 'Household Essentials',
          items: [
            { id: '1', name: 'Paper Towels', price: 12.99, quantity: 2, category: 'Cleaning Supplies', confidence: 0.96 },
            { id: '2', name: 'Laundry Detergent', price: 15.99, quantity: 1, category: 'Cleaning Supplies', confidence: 0.94 },
            { id: '3', name: 'Toilet Paper', price: 8.99, quantity: 3, category: 'Bathroom', confidence: 0.98 },
            { id: '4', name: 'Dish Soap', price: 4.99, quantity: 2, category: 'Cleaning Supplies', confidence: 0.93 }
          ],
          aiConfidence: 0.95,
          tags: ['household', 'essentials', 'bulk'],
          insights: ['You buy household essentials every 2 weeks', 'Consider subscription for regular items']
        },
        {
          id: 'RCPT-004',
          merchantName: 'Shell Gas Station',
          date: '2024-01-12',
          total: 45.67,
          category: 'Transportation',
          subcategory: 'Fuel',
          items: [
            { id: '1', name: 'Premium Gasoline', price: 45.67, quantity: 1, category: 'Fuel', confidence: 0.99 }
          ],
          aiConfidence: 0.99,
          tags: ['transportation', 'fuel', 'regular'],
          insights: ['Gas prices are 8% higher than last month', 'Consider fuel rewards programs']
        }
      ];

      setTimeout(() => {
        setReceipts(mockReceipts);
        setLoading(false);
      }, 1500);
    };

    fetchCategorizedReceipts();
  }, []);

  const categories = [
    { name: 'all', label: 'All Categories', icon: ShoppingBag },
    { name: 'Food & Beverage', label: 'Food & Beverage', icon: Utensils },
    { name: 'Electronics', label: 'Electronics', icon: ShoppingBag },
    { name: 'Transportation', label: 'Transportation', icon: Car },
    { name: 'Home & Garden', label: 'Home & Garden', icon: Home }
  ];

  const filteredReceipts = selectedCategory === 'all' 
    ? receipts 
    : receipts.filter(receipt => receipt.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Food & Beverage': return Utensils;
      case 'Electronics': return ShoppingBag;
      case 'Transportation': return Car;
      case 'Home & Garden': return Home;
      default: return ShoppingBag;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 animate-pulse" />
          <h2 className="text-2xl font-bold">AI Receipt Categorization</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <Brain className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold">AI Receipt Categorization</h2>
        <Badge variant="secondary" className="ml-2">
          <Sparkles className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.name)}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>{category.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Receipts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReceipts.map((receipt) => {
          const CategoryIcon = getCategoryIcon(receipt.category);
          return (
            <Card key={receipt.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CategoryIcon className="h-5 w-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{receipt.merchantName}</CardTitle>
                      <CardDescription>{receipt.date}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(receipt.aiConfidence * 100)}% AI
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="text-xl font-bold">${receipt.total.toFixed(2)}</span>
                </div>

                {/* Category */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <Badge variant="secondary" className="text-xs">
                    {receipt.category}
                  </Badge>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  <span className="text-sm font-medium">Items ({receipt.items.length})</span>
                  <div className="space-y-1">
                    {receipt.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <span className="truncate">{item.name}</span>
                        <span>${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                    {receipt.items.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{receipt.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {receipt.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* AI Insights */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-medium">AI Insights</span>
                  </div>
                  <div className="space-y-1">
                    {receipt.insights.slice(0, 2).map((insight, index) => (
                      <p key={index} className="text-xs text-muted-foreground">
                        • {insight}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      {filteredReceipts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Spending Summary</CardTitle>
            <CardDescription>
              AI-analyzed spending patterns for {selectedCategory === 'all' ? 'all categories' : selectedCategory}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">
                  ${filteredReceipts.reduce((sum, r) => sum + r.total, 0).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {filteredReceipts.length}
                </div>
                <div className="text-sm text-muted-foreground">Receipts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  ${(filteredReceipts.reduce((sum, r) => sum + r.total, 0) / filteredReceipts.length).toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Average per Receipt</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
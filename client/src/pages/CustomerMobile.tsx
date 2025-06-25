import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useToast } from '@/hooks/use-toast';
import { 
  Smartphone, 
  Wallet, 
  Receipt, 
  Bell,
  Share2,
  Shield,
  Star,
  Clock,
  CheckCircle,
  X,
  QrCode
} from 'lucide-react';

export default function CustomerMobile() {
  const [currentUserId] = useState('customer_123'); // In production, get from auth
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(currentUserId);
  const { isConnected, connectionError } = useWebSocket(currentUserId);
  const { toast } = useToast();
  
  const [receipts] = useState([
    {
      id: 'receipt-1',
      merchantName: 'Downtown Coffee Co.',
      amount: 15.75,
      items: [
        { name: 'Specialty Latte', price: 5.50 },
        { name: 'Breakfast Sandwich', price: 7.25 },
        { name: 'Chocolate Donut', price: 3.00 }
      ],
      date: 'Today, 10:30 AM',
      nftImage: '/api/image-proxy/Hot%20Coffee.png',
      points: 225,
      shared: false,
      walletAddress: '0x742d35Cc6634C0532925a3b8D0932C59986Dc47F'
    },
    {
      id: 'receipt-2',
      merchantName: 'Fresh Market',
      amount: 21.50,
      items: [
        { name: 'Organic Bananas', price: 4.50 },
        { name: 'Store Brand Pasta', price: 2.25 },
        { name: 'Weekly Special Cheese', price: 8.75 },
        { name: 'Free Range Eggs', price: 6.00 }
      ],
      date: 'Yesterday, 6:15 PM',
      nftImage: '/api/image-proxy/Receipt%20NFT%20Style.png',
      points: 280,
      shared: true,
      walletAddress: '0x742d35Cc6634C0532925a3b8D0932C59986Dc47F'
    }
  ]);

  const handleNotificationAction = (notification: any, action: 'approve' | 'deny') => {
    if (action === 'approve') {
      toast({
        title: "Receipt shared",
        description: `${notification.data.brandName} now has access to your purchase data`,
      });
    } else {
      toast({
        title: "Request denied",
        description: `${notification.data.brandName} request was declined`,
      });
    }
    markAsRead(notification.id);
  };

  const totalPoints = receipts.reduce((sum, receipt) => sum + receipt.points, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Mobile Header */}
      <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">BlockReceipt</h1>
            <p className="text-sm text-slate-400">Your digital receipt manager</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className={`h-6 w-6 ${isConnected ? 'text-green-400' : 'text-slate-400'}`} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <QrCode className="h-6 w-6 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Wallet Summary */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span className="text-sm opacity-90">Total Rewards</span>
              </div>
              <Badge className="bg-white/20 text-white">
                {receipts.length} Receipts
              </Badge>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-3xl font-bold">{totalPoints.toLocaleString()}</span>
              <span className="text-lg opacity-80 mb-1">points</span>
            </div>
            <div className="flex items-center justify-between text-sm opacity-80">
              <span>≈ ${(totalPoints * 0.01).toFixed(2)} value</span>
              <span>Wallet: {receipts[0]?.walletAddress.slice(0, 8)}...</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Notifications */}
      {notifications.filter((n: any) => !n.read).length > 0 && (
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Active Requests</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-slate-400 text-xs"
            >
              Clear all
            </Button>
          </div>
          
          {notifications.filter((n: any) => !n.read && n.type === 'brand_request').map((notification: any) => (
            <Card key={notification.id} className="bg-slate-800 border-slate-700 mb-3">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 rounded-full p-2 mt-1">
                    <Share2 className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white mb-1">{notification.title}</h3>
                    <p className="text-xs text-slate-400 mb-3">{notification.message}</p>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => handleNotificationAction(notification, 'approve')}
                        className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Share Receipt
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleNotificationAction(notification, 'deny')}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 h-7 text-xs"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {notifications.filter((n: any) => !n.read && n.type === 'reward_earned').map((notification: any) => (
            <Card key={notification.id} className="bg-slate-800 border-slate-700 mb-3">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500 rounded-full p-2">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">{notification.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span className="text-xs text-slate-500">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <Button 
                    size="sm"
                    variant="ghost"
                    onClick={() => markAsRead(notification.id)}
                    className="text-slate-400 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recent Receipts */}
      <div className="px-4">
        <h2 className="text-lg font-semibold mb-3 text-white">Recent Purchases</h2>
        
        {receipts.map(receipt => (
          <Card key={receipt.id} className="w-full mb-4 bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={receipt.nftImage} 
                    alt="Receipt NFT" 
                    className="w-12 h-12 rounded-lg border border-slate-600"
                  />
                  <div>
                    <CardTitle className="text-sm text-white">{receipt.merchantName}</CardTitle>
                    <p className="text-xs text-slate-400">{receipt.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">${receipt.amount.toFixed(2)}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400" />
                    <span className="text-xs text-yellow-400">{receipt.points} pts</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 mb-3">
                {receipt.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-slate-400">{item.name}</span>
                    <span className="text-slate-300">${item.price.toFixed(2)}</span>
                  </div>
                ))}
                {receipt.items.length > 2 && (
                  <div className="text-xs text-slate-500">
                    +{receipt.items.length - 2} more items
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-400" />
                  <span className="text-xs text-slate-300">
                    {receipt.shared ? "Data shared" : "Private receipt"}
                  </span>
                </div>
                <Badge 
                  variant={receipt.shared ? "default" : "secondary"}
                  className={receipt.shared ? "bg-green-600" : "bg-slate-600"}
                >
                  {receipt.shared ? "Shared" : "Private"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="p-4 mt-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <Receipt className="h-4 w-4 mr-2" />
              View All
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <Smartphone className="h-4 w-4 mr-2" />
              Scan QR
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>
    </div>
  );
}
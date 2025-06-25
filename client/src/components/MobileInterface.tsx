import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Smartphone, 
  Wallet, 
  Receipt, 
  Bell,
  Share2,
  Shield,
  Star,
  Clock
} from 'lucide-react';

interface MobileReceiptProps {
  receipt: {
    id: string;
    merchantName: string;
    amount: number;
    items: Array<{name: string; price: number}>;
    date: string;
    nftImage: string;
    points: number;
    shared: boolean;
  };
}

function MobileReceiptCard({ receipt }: MobileReceiptProps) {
  const { toast } = useToast();
  const [isShared, setIsShared] = useState(receipt.shared);

  const handleShare = () => {
    setIsShared(!isShared);
    toast({
      title: isShared ? "Receipt access revoked" : "Receipt shared",
      description: isShared 
        ? "Brands no longer have access to this receipt"
        : "Brands can now see this purchase for targeted offers",
    });
  };

  return (
    <Card className="w-full mb-4 bg-slate-800 border-slate-700">
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-slate-300">
              {isShared ? "Shared with brands" : "Private receipt"}
            </span>
          </div>
          <Button
            size="sm"
            variant={isShared ? "destructive" : "default"}
            onClick={handleShare}
            className="h-7 text-xs"
          >
            <Share2 className="h-3 w-3 mr-1" />
            {isShared ? "Revoke" : "Share"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MobileInterface() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'brand_request',
      title: 'Nike wants access to your receipt',
      description: 'Share your Nike Air Max purchase to get early access to new releases',
      timestamp: '2 min ago',
      unread: true
    },
    {
      id: 2,
      type: 'reward',
      title: 'You earned 150 points!',
      description: 'Your Starbucks purchase qualified for bonus rewards',
      timestamp: '1 hour ago',
      unread: true
    }
  ]);

  const [receipts] = useState([
    {
      id: 'receipt-1',
      merchantName: 'Starbucks Coffee',
      amount: 12.45,
      items: [
        { name: 'Venti Latte', price: 5.95 },
        { name: 'Breakfast Sandwich', price: 6.50 }
      ],
      date: 'Today, 9:30 AM',
      nftImage: '/api/image-proxy/Hot%20Coffee.png',
      points: 150,
      shared: false
    },
    {
      id: 'receipt-2',
      merchantName: 'Nike Store',
      amount: 129.99,
      items: [
        { name: 'Air Max Sneakers', price: 129.99 }
      ],
      date: 'Yesterday, 3:15 PM',
      nftImage: '/api/image-proxy/Receipt%20NFT%20Style.png',
      points: 650,
      shared: true
    }
  ]);

  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, unread: false }
          : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Mobile Header */}
      <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">My Receipts</h1>
            <p className="text-sm text-slate-400">Digital wallet & rewards</p>
          </div>
          <div className="relative">
            <Bell className="h-6 w-6 text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Wallet Summary */}
      <div className="p-4">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                <span className="text-sm opacity-90">Wallet Balance</span>
              </div>
              <Badge className="bg-white/20 text-white">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">2,450</p>
                <p className="text-sm opacity-80">Reward Points</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">{receipts.length}</p>
                <p className="text-sm opacity-80">Receipts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      {notifications.filter(n => n.unread).length > 0 && (
        <div className="px-4 mb-4">
          <h2 className="text-lg font-semibold mb-3 text-white">Notifications</h2>
          {notifications.filter(n => n.unread).map(notification => (
            <Card 
              key={notification.id} 
              className="bg-slate-800 border-slate-700 mb-2 cursor-pointer"
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 rounded-full p-2">
                    {notification.type === 'brand_request' ? (
                      <Share2 className="h-4 w-4 text-white" />
                    ) : (
                      <Star className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">{notification.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{notification.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span className="text-xs text-slate-500">{notification.timestamp}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recent Receipts */}
      <div className="px-4">
        <h2 className="text-lg font-semibold mb-3 text-white">Recent Receipts</h2>
        {receipts.map(receipt => (
          <MobileReceiptCard key={receipt.id} receipt={receipt} />
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
              Scan Receipt
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom spacing for mobile navigation */}
      <div className="h-20"></div>
    </div>
  );
}
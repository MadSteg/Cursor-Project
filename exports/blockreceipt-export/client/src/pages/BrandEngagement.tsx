import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Shield, 
  Target, 
  Gift, 
  MessageSquare,
  Eye,
  Lock,
  Unlock,
  Star,
  TrendingUp,
  CheckCircle,
  UserCheck
} from 'lucide-react';

export default function BrandEngagement() {
  const [selectedBrand, setSelectedBrand] = useState('nike');
  const [campaignType, setCampaignType] = useState('feedback');
  const [sharedReceipts, setSharedReceipts] = useState<string[]>([]);
  const { toast } = useToast();

  const brandCampaigns = {
    nike: {
      name: 'Nike',
      logo: '👟',
      campaigns: [
        {
          id: 'nike-feedback',
          type: 'feedback',
          title: 'Share Your Nike Experience',
          description: 'Tell us about your recent Nike purchase and get early access to new releases',
          reward: 'Early Access Pass',
          participants: 156,
          active: true
        },
        {
          id: 'nike-regional',
          type: 'regional',
          title: 'East Coast Nike Challenge',
          description: 'Next 3 customers from Eastern US states get Nike HQ tour invitation',
          reward: 'Nike HQ Tour',
          participants: 2,
          target: 3,
          active: true
        }
      ]
    },
    coca_cola: {
      name: 'Coca-Cola',
      logo: '🥤',
      campaigns: [
        {
          id: 'coke-survey',
          type: 'survey',
          title: 'Why Choose Coke?',
          description: 'Quick survey for verified Coke buyers about purchase decisions',
          reward: '$5 Gift Card',
          participants: 89,
          active: true
        },
        {
          id: 'coke-loyalty',
          type: 'loyalty',
          title: 'Coke Loyalty Rewards',
          description: 'Buy 3 Cokes this month, get exclusive merchandise',
          reward: 'Exclusive Merch',
          participants: 34,
          progress: 3,
          active: true
        }
      ]
    },
    sony: {
      name: 'Sony',
      logo: '🎧',
      campaigns: [
        {
          id: 'sony-premium',
          type: 'premium',
          title: 'Premium Audio Customer Program',
          description: 'Exclusive program for customers who purchased $300+ Sony audio products',
          reward: 'Product Testing Access',
          participants: 12,
          active: true
        }
      ]
    }
  };

  const handleShareReceipt = (receiptId: string) => {
    if (!sharedReceipts.includes(receiptId)) {
      setSharedReceipts([...sharedReceipts, receiptId]);
      toast({
        title: "Receipt Shared Successfully",
        description: "Brand can now engage with you about this purchase",
      });
    }
  };

  const handleRevokeAccess = (receiptId: string) => {
    setSharedReceipts(sharedReceipts.filter(id => id !== receiptId));
    toast({
      title: "Access Revoked",
      description: "Brand no longer has access to this receipt data",
    });
  };

  const mockReceipts = [
    { id: 'receipt-1', brand: 'Nike', item: 'Air Max Sneakers', amount: 129.99, date: '2025-05-28', shared: false },
    { id: 'receipt-2', brand: 'Coca-Cola', item: 'Coke 12-pack', amount: 5.99, date: '2025-05-27', shared: false },
    { id: 'receipt-3', brand: 'Sony', item: 'WH-1000XM4 Headphones', amount: 349.99, date: '2025-05-26', shared: false },
  ];

  const selectedBrandData = brandCampaigns[selectedBrand as keyof typeof brandCampaigns];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 brand-gradient-text">
            Brand Engagement Platform
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            The first consent-based customer engagement platform. Customers control their data, 
            brands get verified access to real purchasers.
          </p>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 text-center">
              <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">Customer Control</h3>
              <p className="text-sm text-slate-400">
                Customers decide what purchase data to share and with which brands
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 text-center">
              <UserCheck className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">Verified Customers</h3>
              <p className="text-sm text-slate-400">
                Brands engage only with actual verified purchasers of their products
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6 text-center">
              <Gift className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">Instant Rewards</h3>
              <p className="text-sm text-slate-400">
                Customers get immediate value for sharing their purchase data
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Receipt Sharing */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-blue-400" />
                Customer: Share Your Receipts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-300 text-sm">
                Control which brands can see your purchase data. Share receipts to receive 
                personalized offers and participate in exclusive campaigns.
              </p>

              <div className="space-y-4">
                <h4 className="font-semibold text-white">Your Recent Purchases</h4>
                {mockReceipts.map((receipt) => (
                  <div key={receipt.id} className="bg-slate-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-medium text-white">{receipt.item}</h5>
                        <p className="text-sm text-slate-400">{receipt.brand} • ${receipt.amount}</p>
                        <p className="text-xs text-slate-500">{receipt.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {sharedReceipts.includes(receipt.id) ? (
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600 text-white">
                              <Unlock className="h-3 w-3 mr-1" />
                              Shared
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRevokeAccess(receipt.id)}
                              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                            >
                              Revoke
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleShareReceipt(receipt.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Share with {receipt.brand}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {sharedReceipts.includes(receipt.id) && (
                      <div className="bg-green-900/30 border border-green-700 p-3 rounded">
                        <p className="text-sm text-green-300">
                          ✓ {receipt.brand} can now contact you about this purchase for surveys, 
                          feedback, and exclusive offers.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Brand Campaign Management */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="h-5 w-5 text-purple-400" />
                Brand: Engagement Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-slate-300">Select Brand</Label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full p-3 mt-1 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="nike">Nike</option>
                  <option value="coca_cola">Coca-Cola</option>
                  <option value="sony">Sony</option>
                </select>
              </div>

              <div className="bg-slate-700 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{selectedBrandData.logo}</span>
                  <h4 className="font-semibold text-white">{selectedBrandData.name} Campaigns</h4>
                </div>

                <div className="space-y-4">
                  {selectedBrandData.campaigns.map((campaign) => (
                    <div key={campaign.id} className="bg-slate-600 p-4 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-white">{campaign.title}</h5>
                        <Badge className={campaign.active ? 'bg-green-600' : 'bg-gray-600'}>
                          {campaign.active ? 'Active' : 'Paused'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-slate-300 mb-3">{campaign.description}</p>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">
                          Reward: <span className="text-green-400">{campaign.reward}</span>
                        </span>
                        <span className="text-slate-400">
                          {campaign.participants} participants
                          {(campaign as any).target && ` / ${(campaign as any).target} target`}
                        </span>
                      </div>

                      {campaign.type === 'regional' && (campaign as any).target && (
                        <div className="mt-2">
                          <div className="bg-slate-800 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${(campaign.participants / (campaign as any).target) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-400 mb-2">Campaign Insights</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400">Total Reach</div>
                    <div className="text-white font-medium">2,847 customers</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Engagement Rate</div>
                    <div className="text-white font-medium">34.2%</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Avg Response Time</div>
                    <div className="text-white font-medium">2.4 hours</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Customer Satisfaction</div>
                    <div className="text-white font-medium">4.8/5.0</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Value Proposition for Brands */}
        <div className="mt-12 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">Why Brands Choose BlockReceipt</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">Verified Purchase Data</h3>
              <p className="text-sm text-slate-300">
                Access to real, authenticated purchase data from consenting customers
              </p>
            </div>
            
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">Direct Customer Access</h3>
              <p className="text-sm text-slate-300">
                Engage directly with verified customers who actually bought your products
              </p>
            </div>
            
            <div className="text-center">
              <Star className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2 text-white">Higher Engagement</h3>
              <p className="text-sm text-slate-300">
                Better response rates from customers who chose to share their data
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
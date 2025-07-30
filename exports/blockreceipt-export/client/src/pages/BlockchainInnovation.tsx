import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Shield, 
  ArrowRightLeft, 
  Building2, 
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  Coins
} from 'lucide-react';

export default function BlockchainInnovation() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="brand-gradient-text">Blockchain Innovation:</span><br />
              Solving the Big Merchant Problem
            </h1>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              How smart contracts eliminate unfair subsidies and create truly equitable cross-merchant loyalty systems
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* The Problem */}
        <Card className="border-0 shadow-lg mb-8 bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              The Traditional Pool Problem
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold mb-4 text-red-700">Unfair Subsidies</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white rounded-lg p-3">
                    <span className="font-medium">Big Box Store</span>
                    <Badge className="bg-red-100 text-red-700">Pays $5,000/month</Badge>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded-lg p-3">
                    <span className="font-medium">Local Coffee Shop</span>
                    <Badge className="bg-red-100 text-red-700">Pays $25/month</Badge>
                  </div>
                  <div className="mt-4 p-3 bg-red-100 rounded-lg">
                    <p className="text-sm text-red-700">
                      <strong>Problem:</strong> Big merchants subsidize small ones through percentage-based pool contributions
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold mb-4 text-red-700">Redemption Inequality</h3>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-sm mb-2">Customer earns 100 stamps at Big Box Store</p>
                    <p className="text-sm">Redeems all 100 stamps at Coffee Shop</p>
                  </div>
                  <div className="bg-red-100 rounded-lg p-3">
                    <p className="text-sm text-red-700">
                      <strong>Result:</strong> Coffee shop gets $10 compensation from pool, but Big Box Store paid $50 into pool for that customer
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The Solution */}
        <Card className="border-0 shadow-lg mb-8 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
              Blockchain Smart Contract Solution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <ArrowRightLeft className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Direct Settlement</h3>
                <p className="text-slate-600">
                  Smart contracts enable direct merchant-to-merchant payments. No pool subsidies.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Proportional Payment</h3>
                <p className="text-slate-600">
                  Merchants pay exactly for stamps their customers earned. Fair and transparent.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-orange-600 rounded-2xl flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Trustless Execution</h3>
                <p className="text-slate-600">
                  Blockchain ensures automatic, tamper-proof settlement without intermediaries.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">How Direct Settlement Works</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Stamp Earning Tracked</h3>
                  <p className="text-slate-600 mb-3">
                    When a customer earns stamps at any merchant, the blockchain records exactly which merchant generated those stamps.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-700">
                      <strong>Example:</strong> Customer earns 50 stamps at Big Box Store ($500 purchase)
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Redemption Triggers Smart Contract</h3>
                  <p className="text-slate-600 mb-3">
                    When stamps are redeemed, the smart contract automatically identifies which merchants should pay.
                  </p>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-sm text-purple-700">
                      <strong>Example:</strong> Customer redeems 20 stamps at Coffee Shop
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">Automatic Direct Payment</h3>
                  <p className="text-slate-600 mb-3">
                    Smart contract instantly transfers $2.00 from Big Box Store directly to Coffee Shop. No pool involved.
                  </p>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-700">
                      <strong>Result:</strong> Fair compensation - Coffee Shop gets paid by the merchant who actually generated the stamps
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Innovation */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Technical Blockchain Innovations</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Coins className="h-5 w-5 mr-2 text-yellow-600" />
                  Stamp Origin Tracking
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-mono">stampId: 12345</p>
                    <p className="text-sm font-mono">originMerchant: 0xABC...</p>
                    <p className="text-sm font-mono">earnedAt: 2024-05-27</p>
                    <p className="text-sm font-mono">value: 0.10 ETH</p>
                  </div>
                  <p className="text-sm text-slate-600">
                    Each stamp is an NFT with immutable origin data stored on-chain
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-600" />
                  Automatic Settlement
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-mono">function redeemStamps() {'{'}</p>
                    <p className="text-sm font-mono ml-4">findOriginMerchants();</p>
                    <p className="text-sm font-mono ml-4">calculateProportion();</p>
                    <p className="text-sm font-mono ml-4">executeDirectTransfer();</p>
                    <p className="text-sm font-mono">{'}'}</p>
                  </div>
                  <p className="text-sm text-slate-600">
                    Smart contract handles settlement automatically with zero trust required
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Comparison */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Traditional vs Blockchain Comparison</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-red-600">Traditional Pool System</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-slate-600">Big merchants subsidize small ones</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-slate-600">Revenue-based pool contributions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-slate-600">Unfair cost distribution</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-slate-600">Complex reconciliation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-slate-600">Trust required in intermediary</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 text-green-600">Blockchain Direct Settlement</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600">Pay-per-stamp proportional cost</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600">Direct merchant-to-merchant settlement</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600">Fair cost based on actual usage</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600">Instant automatic settlement</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600">Trustless, tamper-proof system</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
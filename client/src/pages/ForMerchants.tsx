import React from 'react';
import { CheckCircle, Shield, TrendingUp, Leaf, Lock, Sparkles, FileText, RotateCcw, DollarSign, Users, Target, Zap, BarChart3, Award } from 'lucide-react';

const ForMerchants: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Why Merchants Use BlockReceipt
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            BlockReceipt helps merchants reduce costs, streamline returns, and strengthen customer trust — all while aligning with environmental goals and future-proofing your business.
          </p>
        </div>

        {/* Merchant Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          
          {/* Save Money */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-green-100">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Save Money on Every Transaction</h3>
            </div>
            <p className="text-gray-600 mb-6">Thermal printers, paper rolls, ink, and maintenance cost merchants thousands annually. BlockReceipt lets you offer a digital receipt without printing anything.</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Minting a digital receipt costs &lt; $0.005</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Eliminate printer jams, service contracts, and reprints</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Free up staff time currently spent on receipt issues</span>
              </div>
            </div>
          </div>

          {/* Reduce Returns Headaches */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <RotateCcw className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Reduce Returns Headaches</h3>
            </div>
            <p className="text-gray-600 mb-6">With BlockReceipt, customers can return items more easily — and you have verifiable proof of purchase on-chain.</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Fewer disputes over lost/damaged receipts</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Reduced fraud from fake returns</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Shorter return lines and less conflict for staff</span>
              </div>
            </div>
          </div>

          {/* Boost Brand Reputation */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Boost Brand Reputation</h3>
            </div>
            <p className="text-gray-600 mb-6">Younger customers want digital-first, eco-conscious brands. BlockReceipt positions your business as a tech-forward, privacy-respecting leader.</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Appeal to modern consumer values</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Offer optional branded or collectible receipts</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Create buzz through limited NFT receipt designs</span>
              </div>
            </div>
          </div>

          {/* Hit ESG Goals */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-emerald-100">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-3 rounded-full mr-4">
                <Target className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Hit Your ESG Goals</h3>
            </div>
            <p className="text-gray-600 mb-6">Thermal receipt paper isn't recyclable and contributes heavily to waste. BlockReceipt helps you track measurable impact.</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Track CO₂ savings by receipt volume</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Report sustainability metrics for internal and public reports</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                <span className="text-gray-700">Earn PR and CSR points through innovation</span>
              </div>
            </div>
          </div>

        </div>

        {/* Additional Merchant Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          
          {/* Privacy-Preserving Engagement */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-indigo-100">
            <div className="bg-indigo-100 p-3 rounded-full w-fit mb-4">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">Privacy-Preserving Customer Engagement</h4>
            <p className="text-gray-600 mb-4 text-sm">Use encrypted metadata sharing to unlock smarter targeting — only with user permission.</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700">Access real post-sale behavior (if opted-in)</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700">Deliver more relevant offers and rewards</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700">Build trust by giving users control over their data</span>
              </div>
            </div>
          </div>

          {/* No Disruption */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
            <div className="bg-orange-100 p-3 rounded-full w-fit mb-4">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">No Disruption to Your Existing POS</h4>
            <p className="text-gray-600 mb-4 text-sm">BlockReceipt integrates as an optional output — like print or email.</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700">Minimal training required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700">No changes to core payment flows</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700">Flexible rollout per location or region</span>
              </div>
            </div>
          </div>

          {/* Easy Pilot */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-teal-100">
            <div className="bg-teal-100 p-3 rounded-full w-fit mb-4">
              <BarChart3 className="w-6 h-6 text-teal-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-3">Easy Pilot. Big Upside.</h4>
            <p className="text-gray-600 mb-4 text-sm">Start with 3–5 stores. We provide the software, setup support, and dashboards.</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700">Track receipts printed vs. BlockReceipts minted</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700">Monitor cost savings and environmental stats</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                <span className="text-gray-700">Analyze customer reaction and staff feedback</span>
              </div>
            </div>
          </div>

        </div>

        {/* Merchant CTA */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-12 text-center text-white mb-16">
          <h3 className="text-3xl font-bold mb-4">Offer better receipts. Save money. Connect with customers.</h3>
          <p className="text-xl text-green-100 mb-6">BlockReceipt isn't just more modern — it's smarter business.</p>
          <div className="bg-white/20 rounded-lg p-4 inline-block">
            <p className="text-lg font-medium">Ready to pilot? Contact us to start with your first 3-5 locations.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForMerchants;
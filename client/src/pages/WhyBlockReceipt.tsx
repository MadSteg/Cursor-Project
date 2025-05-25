import React from 'react';
import { CheckCircle, Shield, TrendingUp, Leaf, Lock, Sparkles, FileText, RotateCcw, DollarSign, Users, Target, Zap, BarChart3, Award } from 'lucide-react';

const WhyBlockReceipt: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
      {/* Hero Header with Purple Gradient */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-12 left-12 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-25 animate-bounce"></div>
        
        <div className="max-w-6xl mx-auto px-4 py-16 relative z-10">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Why use BlockReceipt?
            </h1>
            <p className="text-xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
              BlockReceipt helps you keep track of every purchase — securely, privately, and permanently — without relying on paper, email, or memory. Here's why it's better than traditional receipts.
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 pb-16">

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          
          {/* Your Receipts, Upgraded */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-3 rounded-full mr-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Your Receipts, Upgraded</h2>
            </div>
            <p className="text-purple-100 mb-6">No more lost paper or endless inbox searches. BlockReceipts are:</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-purple-100">Minted automatically after purchase (no setup required)</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-purple-100">Stored in a secure, searchable digital vault</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-purple-100">Available anytime via mobile</span>
              </div>
            </div>
            <p className="text-yellow-300 font-medium mt-6">It's your receipt history reimagined — modern, accessible, and reliable.</p>
          </div>

          {/* Return with Confidence */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-blue-400 to-cyan-400 p-3 rounded-full mr-4">
                <RotateCcw className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Return with Confidence</h2>
            </div>
            <p className="text-purple-100 mb-6">Show proof of purchase in seconds — even months later. BlockReceipts:</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-purple-100">Can't fade or be lost</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-purple-100">Help you return or exchange faster</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-purple-100">Are cryptographically verifiable</span>
              </div>
            </div>
            <p className="text-cyan-300 font-medium mt-6">No more digging through drawers. Just open your receipt vault.</p>
          </div>

          {/* Track Your Spending Smarter */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-3 rounded-full mr-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Track Your Spending Smarter</h2>
            </div>
            <p className="text-purple-100 mb-6">BlockReceipt uses OCR to scan and categorize what you've bought. Over time, you get:</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-purple-100">Insights into spending habits</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-purple-100">Reorder suggestions</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-purple-100">Purchase summaries by store, category, or item</span>
              </div>
            </div>
            <p className="text-emerald-300 font-medium mt-6">Think of it as a smart ledger that builds itself.</p>
          </div>

          {/* Eco-Friendly by Design */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-emerald-400 to-green-400 p-3 rounded-full mr-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Eco-Friendly by Design</h2>
            </div>
            <p className="text-purple-100 mb-6">Paper receipts are wasteful — and most thermal paper can't be recycled.</p>
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-purple-100">Helps reduce paper use</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-purple-100">Lowers carbon footprint</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                <span className="text-purple-100">Powers more sustainable commerce</span>
              </div>
            </div>
            <p className="text-green-300 font-medium mt-6">It's better for you and the planet.</p>
          </div>

        </div>

        {/* Additional Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          
          {/* Privacy & Security */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-indigo-100">
            <div className="bg-indigo-100 p-3 rounded-full w-fit mb-4">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Fully Private & Secure</h3>
            <p className="text-gray-600 mb-4">Receipts are stored using encryption and privacy-preserving technology like Threshold PRE.</p>
            <p className="text-indigo-600 font-medium">Only you control your data.</p>
          </div>

          {/* No Wallet Required */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
            <div className="bg-orange-100 p-3 rounded-full w-fit mb-4">
              <Lock className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No Wallet? No Problem.</h3>
            <p className="text-gray-600 mb-4">We create a secure digital vault for you behind the scenes. You don't need crypto knowledge.</p>
            <p className="text-orange-600 font-medium">Just pay as usual.</p>
          </div>

          {/* Collectible Experience */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-pink-100">
            <div className="bg-pink-100 p-3 rounded-full w-fit mb-4">
              <Sparkles className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Looks Good, Too.</h3>
            <p className="text-gray-600 mb-4">Some receipts come with limited-edition designs, animations, or loyalty perks.</p>
            <p className="text-pink-600 font-medium">Everyday purchases become collectible experiences.</p>
          </div>

        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">BlockReceipt is the smart, secure, eco-friendly way to own your purchase history.</h2>
          <p className="text-xl text-purple-100 mb-6">No apps to learn. No settings to configure. Just receipts — finally done right.</p>
          <div className="bg-white/20 rounded-lg p-4 inline-block">
            <p className="text-lg font-medium">Now available anywhere you see "Mint BlockReceipt" at checkout.</p>
          </div>
          <p className="text-purple-200 mt-4 text-sm">Still want paper? You can. BlockReceipt is an option, not a replacement.</p>
        </div>

      </div>
    </div>
  );
};

export default WhyBlockReceipt;
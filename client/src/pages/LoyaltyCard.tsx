import { CreditCard, Zap, Shield, Sparkles, ArrowRight, Users, Store, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LoyaltyCard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
              <Sparkles className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-700">Universal Loyalty Revolution</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="brand-gradient-text">One Card.</span><br />
              <span className="text-slate-800">Every Store.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              Your BlockReceipt Loyalty Card works across all participating merchants. 
              Collect stamps everywhere, unlock rewards anywhere.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="px-8 py-6 text-lg">
                <CreditCard className="mr-2 h-5 w-5" />
                Get Your Universal Card
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                View Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Loyalty Card Visual */}
            <div className="relative mx-auto w-80 h-48 transform rotate-6 hover:rotate-0 transition-transform duration-700">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-2xl shadow-2xl" />
              <div className="absolute inset-0 bg-black/20 rounded-2xl" />
              <div className="absolute inset-4 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">BlockReceipt</h3>
                    <p className="text-sm opacity-90">Universal Loyalty</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">847</p>
                    <p className="text-xs opacity-90">Total Stamps</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm opacity-90">Card ID</p>
                  <p className="font-mono">0x8F2...4A9</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 5 Steps */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How <span className="brand-gradient-text">Cross-Merchant</span> Loyalty Works
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              One universal loyalty card that works seamlessly across all participating merchants. 
              Here's how the magic happens:
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-5 gap-8">
              {/* Step 1 */}
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <CreditCard className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Get Your Card</h3>
                <p className="text-slate-600">
                  Receive your unique BlockReceipt Loyalty Card NFT. One card for all merchants.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <Store className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-pink-600">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Shop Anywhere</h3>
                <p className="text-slate-600">
                  Make purchases at any participating merchant. Coffee shops, restaurants, retail stores.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-orange-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Auto Stamps</h3>
                <p className="text-slate-600">
                  Earn 1 stamp per $10 spent. Stamps are automatically added to your universal card.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-red-600">4</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Network Effect</h3>
                <p className="text-slate-600">
                  Your stamps accumulate across ALL merchants. More places to shop, faster rewards.
                </p>
              </div>

              {/* Step 5 */}
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <Gift className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">5</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">Unlock Rewards</h3>
                <p className="text-slate-600">
                  Redeem stamps for rewards at any participating merchant. True cross-merchant value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why <span className="brand-gradient-text">Universal</span> is Better
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">No More Lost Cards</h3>
                <p className="text-slate-600 text-lg">
                  Your loyalty card is an NFT on the blockchain. It can never be lost, stolen, or forgotten at home.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Faster Rewards</h3>
                <p className="text-slate-600 text-lg">
                  Accumulate stamps across multiple merchants. Reach reward thresholds much faster than single-store cards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-pink-500 to-orange-600 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Network Growth</h3>
                <p className="text-slate-600 text-lg">
                  As more merchants join, your card becomes more valuable. True network effects in action.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Join the Loyalty Revolution?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get your BlockReceipt Universal Loyalty Card today and start earning stamps across all participating merchants.
          </p>
          <Button size="lg" variant="secondary" className="px-8 py-6 text-lg">
            <CreditCard className="mr-2 h-5 w-5" />
            Get Your Universal Card Now
          </Button>
        </div>
      </section>
    </div>
  );
}
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, DollarSign, Users, Target, TrendingUp, Zap, Shield, Lightbulb, AlertTriangle, Presentation, Calendar } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  icon: React.ComponentType<any>;
  content: React.ReactNode;
  bgColor: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Who feels the pain of paper receipts more?",
    icon: DollarSign,
    bgColor: "from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-4">
            Merchants — by a landslide! 🏪
          </p>
          <p className="text-lg text-muted-foreground">
            They swallow perpetual hardware, paper, labor & brand costs, while customers only suffer when a receipt is lost.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">💸 Hardware & Supplies</h4>
            <p className="text-sm">Constant spend on printers, rolls, service contracts</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2">⚠️ Maintenance Downtime</h4>
            <p className="text-sm">Jams = stalled lines & angry shoppers</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">👥 Labor & Training</h4>
            <p className="text-sm">Staff swap rolls & troubleshoot instead of selling</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">🌱 Environmental Impact</h4>
            <p className="text-sm">BPA-coated thermal paper ≠ ESG friendly</p>
          </div>
        </div>
        
        <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg border">
          <p className="text-center font-medium">
            💎 Digital NFT receipts erase every problem above — zero paper, immutable proof, instant lookup.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "The first-time \"Aha!\" moment",
    icon: Lightbulb,
    bgColor: "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-xl border">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300">Customer Reaction</h3>
            </div>
            <blockquote className="text-lg italic text-center">
              "One tap and my receipt's an NFT I'll never lose? 
              <span className="font-bold text-blue-600 dark:text-blue-400"> How is this not already the norm?</span>"
            </blockquote>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-xl border">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-green-700 dark:text-green-300">Merchant Reaction</h3>
            </div>
            <blockquote className="text-lg italic text-center">
              "Eco-friendly, fraud-proof, <em>and</em> cheaper than paper? 
              <span className="font-bold text-green-600 dark:text-green-400"> Why didn't we do this sooner?</span>"
            </blockquote>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Who to target first?",
    icon: Target,
    bgColor: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">
            Go Big: CVS, Dunkin', Walgreens 🎯
          </h3>
          <p className="text-lg text-muted-foreground">
            One pilot = thousands of lanes, massive cost savings & headline buzz
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">High Paper Spend</h4>
            <p className="text-sm text-muted-foreground">= High ROI potential</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">ESG Mandates</h4>
            <p className="text-sm text-muted-foreground">= Board-level urgency</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold mb-2">Scalability</h4>
            <p className="text-sm text-muted-foreground">One integration, nationwide rollout</p>
          </div>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-center italic">
            💡 Boutique stores love the idea, but scale too slowly for initial impact
          </p>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "#1 outcome CVS cares about",
    icon: TrendingUp,
    bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
            Kill the mile-long receipt meme 📏➡️💎
          </h3>
          <p className="text-lg text-muted-foreground">
            Slash paper costs — a dual P&L + ESG win
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">$15M</div>
            <p className="text-sm">Saved annually chain-wide</p>
            <p className="text-xs text-muted-foreground">($0.004 per transaction)</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">9,000</div>
            <p className="text-sm">Trees saved per year</p>
            <p className="text-xs text-muted-foreground">Environmental impact</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">+5pt</div>
            <p className="text-sm">Social sentiment swing</p>
            <p className="text-xs text-muted-foreground">When the joke flips</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Product, platform, or protocol?",
    icon: Zap,
    bgColor: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">
            Hybrid Platform ⚡
          </h3>
          <p className="text-lg text-muted-foreground">
            With an embedded protocol layer
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              Platform Layer
            </h4>
            <p className="text-sm">POS plug-in & merchant dashboard for easy integration</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              Protocol Layer
            </h4>
            <p className="text-sm">REST/GraphQL + SDK for developers to build on top</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2 flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              Marketplace Layer
            </h4>
            <p className="text-sm">Opt-in branded receipt art & loyalty NFTs for engagement</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "60-day pilot KPIs",
    icon: Calendar,
    bgColor: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-2">
            Success Metrics 📊
          </h3>
          <p className="text-lg text-muted-foreground">
            Hit 3 of 4 → national rollout
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">≥25%</div>
              <p className="font-semibold">Customer Opt-in</p>
              <p className="text-sm text-muted-foreground">Digital receipt adoption rate</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">≥30%</div>
              <p className="font-semibold">Paper Reduction</p>
              <p className="text-sm text-muted-foreground">Drop in thermal paper usage</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">≥40%</div>
              <p className="font-semibold">Faster Returns</p>
              <p className="text-sm text-muted-foreground">Speed improvement with NFT receipts</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">+6pt</div>
              <p className="font-semibold">NPS Lift</p>
              <p className="text-sm text-muted-foreground">Gen-Z/Millennial satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: "Two tangible shopper perks",
    icon: Users,
    bgColor: "from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🗄️</div>
              <h3 className="text-xl font-bold text-teal-700 dark:text-teal-300">Smart Receipt Vault</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center"><span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>Search & organize receipts</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>Expense tracking</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>Tax export functionality</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>Warranty proof storage</li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🎁</div>
              <h3 className="text-xl font-bold text-cyan-700 dark:text-cyan-300">Unlockable Rewards</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center"><span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>On-chain loyalty points</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>Collectible character NFTs</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>Targeted special offers</li>
              <li className="flex items-center"><span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>Exclusive brand experiences</li>
            </ul>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 8,
    title: "Biggest risk & pre-mortem fix",
    icon: AlertTriangle,
    bgColor: "from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20",
    content: (
      <div className="space-y-6">
        <div className="bg-red-100 dark:bg-red-900/30 p-6 rounded-lg border-l-4 border-red-500">
          <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-2 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Primary Risk
          </h3>
          <p className="text-red-600 dark:text-red-400">
            POS integration stalls → pilot never ships
          </p>
        </div>
        
        <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-lg border-l-4 border-green-500">
          <h3 className="text-lg font-bold text-green-700 dark:text-green-300 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Prevention Strategy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="text-sm">Hire lean dev squad</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="text-sm">Ship plug-and-play SDK</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="text-sm">Hide 'crypto' jargon</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                <span className="text-sm">Custodial email-wallet default</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 9,
    title: "5-slide pitch skeleton",
    icon: Presentation,
    bgColor: "from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20",
    content: (
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            Perfect Pitch Structure 🎯
          </h3>
        </div>
        
        <div className="space-y-3">
          {[
            { num: 1, title: "$$ & CO₂ problem", desc: "Show the pain points and costs" },
            { num: 2, title: "One-tap BlockReceipt switch", desc: "Demonstrate the simple solution" },
            { num: 3, title: "Personal memory vault", desc: "Highlight customer benefits" },
            { num: 4, title: "Loyalty & culture boost", desc: "Show engagement advantages" },
            { num: 5, title: "90-day ROI roadmap", desc: "Present clear implementation plan" }
          ].map((slide) => (
            <div key={slide.num} className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex items-center">
              <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                {slide.num}
              </div>
              <div>
                <h4 className="font-semibold">{slide.title}</h4>
                <p className="text-sm text-muted-foreground">{slide.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 10,
    title: "6-month budget range",
    icon: DollarSign,
    bgColor: "from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">
            <div className="text-center">
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">Lean MVP</h3>
              <div className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-2">≈ $23K</div>
              <p className="text-sm text-muted-foreground">Proof of concept & basic features</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">
            <div className="text-center">
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">Pilot-Ready</h3>
              <div className="text-4xl font-bold text-green-700 dark:text-green-300 mb-2">≈ $50K</div>
              <p className="text-sm text-muted-foreground">Full integration & deployment</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h4 className="font-semibold mb-4 text-center">Budget Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Infrastructure</span>
                <span className="font-medium">$800</span>
              </div>
              <div className="flex justify-between">
                <span>Wallet Integration</span>
                <span className="font-medium">$300</span>
              </div>
              <div className="flex justify-between">
                <span>Gas & Blockchain</span>
                <span className="font-medium">$200</span>
              </div>
              <div className="flex justify-between">
                <span>Security Audit</span>
                <span className="font-medium">$6,800</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Legal & Compliance</span>
                <span className="font-medium">$6,000</span>
              </div>
              <div className="flex justify-between">
                <span>Development & Design</span>
                <span className="font-medium">$28,000</span>
              </div>
              <div className="flex justify-between">
                <span>Branding & Marketing</span>
                <span className="font-medium">$8,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

const WhyBlockReceipt: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const current = slides[currentSlide];
  const IconComponent = current.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 brand-gradient-text">
            Why BlockReceipt?
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Turn the endless paper-receipt meme into an on-chain win. 
            Discover why BlockReceipt is the future of digital transactions.
          </p>
        </div>

        {/* Main Slide Container */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={`bg-gradient-to-br ${current.bgColor} rounded-2xl p-8 md:p-12 shadow-2xl border`}
            >
              {/* Slide Header */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                    <IconComponent className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {current.title}
                </h2>
                {current.subtitle && (
                  <p className="text-lg text-muted-foreground">{current.subtitle}</p>
                )}
              </div>

              {/* Slide Content */}
              <div className="mb-8">
                {current.content}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex flex-col items-center mt-8 space-y-6">
            {/* Slide Counter */}
            <div className="text-center">
              <span className="text-lg font-medium">
                {currentSlide + 1} of {slides.length}
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={prevSlide}
                className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all border"
                disabled={currentSlide === 0}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextSlide}
                className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all border"
                disabled={currentSlide === slides.length - 1}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Slide Dots */}
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-purple-600 dark:bg-purple-400'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Ready to turn paper receipts into an on-chain advantage? 🚀
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Join the digital receipt revolution and transform your business today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                  Start Your Pilot
                </button>
                <button className="px-8 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyBlockReceipt;
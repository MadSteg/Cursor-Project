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
    title: "Q1. Who feels the pain of paper receipts more?",
    icon: DollarSign,
    bgColor: "from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-4">
            Short answer: <em>Merchants</em>
          </p>
          <p className="text-lg text-muted-foreground">
            They swallow perpetual hardware, paper, labour & brand costs, while customers only suffer when a receipt is lost.
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>Hardware & supplies</strong> → constant spend on printers, rolls, service contracts.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>Maintenance downtime</strong> → jams = stalled lines & angry shoppers.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>Labour & training</strong> → staff swap rolls & troubleshoot instead of selling.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>Environmental hit</strong> → BPA‑coated thermal paper ≠ ESG friendly.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>Fraud & returns</strong> → fake receipts erode margin.</p>
          </div>
        </div>
        
        <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg border">
          <p className="text-center font-medium italic text-sm">
            Digital NFT receipts erase every bullet above — zero paper, immutable proof, instant lookup.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "Q2. Capture the first‑time \"aha!\"",
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
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300">Customer</h3>
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
              <h3 className="text-lg font-bold text-green-700 dark:text-green-300">Merchant</h3>
            </div>
            <blockquote className="text-lg italic text-center">
              "Eco‑friendly, fraud‑proof, <em>and</em> cheaper than paper? 
              <span className="font-bold text-green-600 dark:text-green-400"> Why didn't we do this sooner?</span>"
            </blockquote>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "Q3. Who to target first?",
    icon: Target,
    bgColor: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">
            Go big (CVS/Dunkin')
          </h3>
          <p className="text-lg text-muted-foreground">
            One pilot = thousands of lanes, massive cost savings & headline buzz.
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>High paper spend</strong> → high ROI.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>ESG mandates</strong> → board‑level urgency.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>Scalability</strong> → one integration, nationwide rollout.</p>
          </div>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-center italic text-sm">
            Boutique stores love the idea, but scale too slowly.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Q4. #1 outcome CVS cares about?",
    icon: TrendingUp,
    bgColor: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
            Kill the mile‑long receipt meme & slash paper costs
          </h3>
          <p className="text-lg text-muted-foreground">
            A dual P&L + ESG win.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">$15M</div>
            <p className="text-sm">chain‑wide annualised</p>
            <p className="text-xs text-muted-foreground">$0.004 saved per transaction</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">~9,000</div>
            <p className="text-sm">trees saved per year</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">+5 pt</div>
            <p className="text-sm">social‑sentiment swing</p>
            <p className="text-xs text-muted-foreground">when the joke flips</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 5,
    title: "Q5. Product, platform, or protocol?",
    icon: Zap,
    bgColor: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
    content: (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">
            Hybrid platform
          </h3>
          <p className="text-lg text-muted-foreground">
            with an embedded protocol layer.
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>Platform:</strong> POS plug‑in & merchant dashboard.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>Protocol:</strong> REST/GraphQL + SDK for devs.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>Marketplace:</strong> opt‑in branded receipt art & loyalty NFTs.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "Q6. 60‑day pilot KPIs",
    icon: Calendar,
    bgColor: "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
    content: (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>≥25 %</strong> customer opt‑in.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>≥30 %</strong> drop in thermal paper.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>≥40 %</strong> faster returns with NFT receipts.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>+6 pt</strong> NPS lift Gen‑Z/Millennials.</p>
          </div>
        </div>
        
        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg border">
          <p className="text-center italic text-sm">
            Hit 3 of 4 → national rollout.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 7,
    title: "Q7. Two tangible shopper perks",
    icon: Users,
    bgColor: "from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <p className="text-lg font-semibold mb-2">1️⃣ Smart‑receipt vault</p>
            <p className="text-sm text-muted-foreground">Search, expense, tax export, warranty proof.</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
            <p className="text-lg font-semibold mb-2">2️⃣ Unlockable rewards</p>
            <p className="text-sm text-muted-foreground">On‑chain loyalty, collectible art, targeted offers.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 8,
    title: "Q8. Biggest risk & pre‑mortem fix",
    icon: AlertTriangle,
    bgColor: "from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20",
    content: (
      <div className="space-y-6">
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg border">
          <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-2">Risk:</h3>
          <p className="text-sm">POS integration stalls → pilot never ships.</p>
        </div>
        
        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg border">
          <h3 className="text-lg font-bold text-green-700 dark:text-green-300 mb-2">Fix:</h3>
          <p className="text-sm">Hire lean dev squad, ship plug‑and‑play SDK, hide 'crypto' jargon, custodial email‑wallet default.</p>
        </div>
      </div>
    )
  },
  {
    id: 9,
    title: "Q9. 5‑slide pitch skeleton",
    icon: Presentation,
    bgColor: "from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20",
    content: (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>1.</strong> $$ & CO₂ problem</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>2.</strong> One‑tap BlockReceipt switch</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>3.</strong> Personal memory vault</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>4.</strong> Loyalty & culture boost</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
            <p className="text-sm"><strong>5.</strong> 90‑day ROI roadmap</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 10,
    title: "Q10. 6‑month budget range",
    icon: DollarSign,
    bgColor: "from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border text-center">
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">Lean MVP</h3>
            <div className="text-4xl font-bold text-blue-700 dark:text-blue-300 mb-2">≈ $23K</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border text-center">
            <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">Pilot‑ready</h3>
            <div className="text-4xl font-bold text-green-700 dark:text-green-300 mb-2">≈ $50K</div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <p>Infra $800 ▸ Wallet $300 ▸ Gas $200 + audit $6 800</p>
            </div>
            <div className="space-y-1">
              <p>Legal $6 000 ▸ Dev+Design $28 000 ▸ Branding $8 000</p>
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
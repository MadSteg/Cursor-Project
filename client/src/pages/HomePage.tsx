import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReceiptTier } from '@/lib/receiptOcr';
import {
  Receipt,
  FileText,
  Camera,
  ShieldCheck,
  Lock,
  BarChart3,
  Sparkles,
  CreditCard,
  Wallet,
  ArrowRight,
  Crown,
  Star,
  Diamond
} from 'lucide-react';

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const fadeInUpVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8
      }
    }
  };

  // Collection of NFT receipt examples with tier-specific styling
  const tierExamples = [
    {
      tier: ReceiptTier.STANDARD,
      merchant: "Daily Coffee",
      total: "$4.75",
      date: "May 12, 2025",
      bgGradient: "from-slate-50 to-slate-200",
      border: "border-slate-300",
      textColor: "text-slate-800",
      icon: <Receipt className="h-6 w-6 text-slate-600" />,
      imageSrc: "/standard-nft.svg"
    },
    {
      tier: ReceiptTier.PREMIUM,
      merchant: "Urban Outfitters",
      total: "$87.50",
      date: "May 10, 2025",
      bgGradient: "from-blue-50 to-indigo-100",
      border: "border-indigo-300",
      textColor: "text-indigo-800",
      icon: <Star className="h-6 w-6 text-indigo-600" />,
      imageSrc: "/premium-nft.svg"
    },
    {
      tier: ReceiptTier.LUXURY,
      merchant: "Apple Store",
      total: "$549.99",
      date: "May 7, 2025",
      bgGradient: "from-purple-50 to-purple-200",
      border: "border-purple-300",
      textColor: "text-purple-800",
      icon: <Crown className="h-6 w-6 text-purple-600" />,
      imageSrc: "/luxury-nft.svg"
    },
    {
      tier: ReceiptTier.ULTRA,
      merchant: "Tesla",
      total: "$1,249.00",
      date: "May 5, 2025",
      bgGradient: "from-amber-50 to-amber-200",
      border: "border-amber-400",
      textColor: "text-amber-800",
      icon: <Diamond className="h-6 w-6 text-amber-600" />,
      imageSrc: "/ultra-nft.svg"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                Transform Receipts Into Digital Assets
              </h1>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <p className="text-xl md:text-2xl text-gray-600 mb-10">
                BlockReceipt turns everyday purchases into secure, interactive NFTs with privacy controls and powerful analytics.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Link href="/scan-receipt">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                  <Camera className="mr-2 h-5 w-5" /> Scan Receipt
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tiered NFT Receipt Showcase */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tiered NFT Receipts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The more you spend, the more exclusive your BlockReceipt NFT becomes, with special artwork and benefits.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tierExamples.map((example, index) => (
              <motion.div
                key={example.tier}
                className="flex flex-col"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      delay: index * 0.1,
                      duration: 0.5
                    }
                  }
                }}
              >
                <Card 
                  className={`flex-1 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${example.bgGradient} border ${example.border}`}
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${example.textColor} bg-white/60`}>
                        {example.tier}
                      </div>
                      {example.icon}
                    </div>
                    
                    <div className="aspect-square rounded-lg mb-4 bg-white/60 flex items-center justify-center overflow-hidden">
                      {/* NFT preview image would go here */}
                      <Sparkles className={`h-16 w-16 ${example.textColor} opacity-60`} />
                    </div>
                    
                    <div className={`text-left ${example.textColor}`}>
                      <p className="text-sm font-medium">{example.merchant}</p>
                      <p className="text-lg font-bold">{example.total}</p>
                      <p className="text-xs opacity-70">{example.date}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUpVariants}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Reimagining Receipts for the Digital Age
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              BlockReceipt solves the ancient problem of paper receipts with Web3 technology.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <motion.div
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    delay: 0.1,
                    duration: 0.6
                  }
                }
              }}
            >
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <FileText className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Paper Waste Elimination</h3>
              <p className="text-gray-600">
                No more thermal paper that fades with time. Digital receipts are permanent, searchable, and eco-friendly.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    delay: 0.2,
                    duration: 0.6
                  }
                }
              }}
            >
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <ShieldCheck className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Blockchain Verified</h3>
              <p className="text-gray-600">
                Immutable proof of purchase that's tamper-proof and recognized globally through blockchain verification.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    delay: 0.3,
                    duration: 0.6
                  }
                }
              }}
            >
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Lock className="h-10 w-10 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Privacy Controlled</h3>
              <p className="text-gray-600">
                Threshold encryption lets you selectively grant and revoke access to sensitive purchase data.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    delay: 0.4,
                    duration: 0.6
                  }
                }
              }}
            >
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <BarChart3 className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Analytics</h3>
              <p className="text-gray-600">
                AI-powered insights track spending patterns while preserving your privacy with encryption.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    delay: 0.5,
                    duration: 0.6
                  }
                }
              }}
            >
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <CreditCard className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-Source Capture</h3>
              <p className="text-gray-600">
                Scan paper receipts, capture from email, or directly connect credit card and cryptocurrency payments.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    delay: 0.6,
                    duration: 0.6
                  }
                }
              }}
            >
              <div className="bg-gradient-to-br from-green-50 to-green-100 h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Wallet className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">NFT Collectibility</h3>
              <p className="text-gray-600">
                Receipts become digital collectibles with real utility tied to game assets, music content, and more.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Receipts?
          </motion.h2>
          
          <motion.p 
            className="text-xl max-w-2xl mx-auto mb-10 text-indigo-100"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join the blockchain receipt revolution today and turn your next purchase into a secure, beautiful NFT.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Link href="/scan-receipt">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
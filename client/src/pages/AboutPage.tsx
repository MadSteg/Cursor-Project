import React from 'react';
import { motion } from 'framer-motion';
import { ReceiptTier } from '@/lib/receiptOcr';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from 'wouter';
import {
  Receipt,
  Trash2,
  FileText,
  Lock,
  Globe,
  Share2,
  ShieldCheck,
  Coins,
  ListFilter,
  BarChart3,
  Sparkles,
  Crown,
  Diamond,
  Star
} from 'lucide-react';

const AboutPage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
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

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  // Tier styling
  const getTierStyles = (tier: ReceiptTier) => {
    switch (tier) {
      case ReceiptTier.STANDARD:
        return {
          background: 'bg-gradient-to-br from-slate-50 to-slate-200',
          text: 'text-slate-800',
          border: 'border-slate-300',
          shadow: 'shadow-md',
          badge: 'bg-slate-100 text-slate-800',
          icon: <Receipt className="h-10 w-10 text-slate-700" />
        };
      case ReceiptTier.PREMIUM:
        return {
          background: 'bg-gradient-to-br from-blue-50 to-indigo-100',
          text: 'text-indigo-800',
          border: 'border-indigo-300',
          shadow: 'shadow-md shadow-indigo-100',
          badge: 'bg-indigo-100 text-indigo-800',
          icon: <Star className="h-10 w-10 text-indigo-600" />
        };
      case ReceiptTier.LUXURY:
        return {
          background: 'bg-gradient-to-br from-purple-50 to-purple-200',
          text: 'text-purple-800',
          border: 'border-purple-300',
          shadow: 'shadow-lg shadow-purple-100',
          badge: 'bg-purple-100 text-purple-800',
          icon: <Crown className="h-10 w-10 text-purple-600" />
        };
      case ReceiptTier.ULTRA:
        return {
          background: 'bg-gradient-to-br from-amber-50 to-amber-200',
          text: 'text-amber-900',
          border: 'border-amber-400',
          shadow: 'shadow-xl shadow-amber-100',
          badge: 'bg-amber-100 text-amber-800',
          icon: <Diamond className="h-10 w-10 text-amber-600" />
        };
      default:
        return {
          background: 'bg-gradient-to-br from-slate-50 to-slate-200',
          text: 'text-slate-800',
          border: 'border-slate-300',
          shadow: 'shadow-md',
          badge: 'bg-slate-100 text-slate-800',
          icon: <Receipt className="h-10 w-10 text-slate-700" />
        };
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      {/* Hero Section */}
      <motion.div 
        className="text-center mb-16"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"
          variants={itemVariants}
        >
          Revolutionizing Receipts
        </motion.h1>
        <motion.p 
          className="text-xl text-gray-600 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          From wasteful paper trails to secure, blockchain-powered financial records 
          that transform everyday purchases into digital assets.
        </motion.p>
      </motion.div>

      {/* Old vs New Comparison */}
      <Tabs defaultValue="traditional" className="mb-20">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="traditional">Traditional Receipts</TabsTrigger>
          <TabsTrigger value="blockchain">BlockReceipt Solution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="traditional">
          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
          >
            <div className="relative overflow-hidden rounded-xl border border-red-200 aspect-video bg-gradient-to-br from-red-50 to-red-100">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Trash2 className="h-16 w-16 text-red-500 mb-4" />
                <h3 className="text-2xl font-bold text-red-700 mb-2">Environmental Waste</h3>
                <p className="text-red-600">10 billion receipts printed annually in the US alone, contributing to deforestation and pollution</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl border border-orange-200 aspect-video bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <FileText className="h-16 w-16 text-orange-500 mb-4" />
                <h3 className="text-2xl font-bold text-orange-700 mb-2">Easily Lost or Damaged</h3>
                <p className="text-orange-600">Thermal paper fades over time, making warranties and returns difficult to manage</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl border border-yellow-200 aspect-video bg-gradient-to-br from-yellow-50 to-yellow-100">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Lock className="h-16 w-16 text-yellow-500 mb-4" />
                <h3 className="text-2xl font-bold text-yellow-700 mb-2">No Privacy Controls</h3>
                <p className="text-yellow-600">Anyone who has your receipt can see all your purchase details without restrictions</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl border border-lime-200 aspect-video bg-gradient-to-br from-lime-50 to-lime-100">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <ListFilter className="h-16 w-16 text-lime-500 mb-4" />
                <h3 className="text-2xl font-bold text-lime-700 mb-2">No Analytics</h3>
                <p className="text-lime-600">Manual tracking in spreadsheets or expense management systems required</p>
              </div>
            </div>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="blockchain">
          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            initial="hidden"
            animate="visible" 
            variants={fadeInVariants}
          >
            <div className="relative overflow-hidden rounded-xl border border-green-200 aspect-video bg-gradient-to-br from-green-50 to-green-100">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Globe className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-green-700 mb-2">Eco-Friendly Solution</h3>
                <p className="text-green-600">Zero paper waste with digital receipts stored permanently on the blockchain</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl border border-teal-200 aspect-video bg-gradient-to-br from-teal-50 to-teal-100">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <ShieldCheck className="h-16 w-16 text-teal-500 mb-4" />
                <h3 className="text-2xl font-bold text-teal-700 mb-2">Immutable Records</h3>
                <p className="text-teal-600">Permanent and tamper-proof receipt records to verify purchases indefinitely</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl border border-blue-200 aspect-video bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Share2 className="h-16 w-16 text-blue-500 mb-4" />
                <h3 className="text-2xl font-bold text-blue-700 mb-2">Privacy-Preserving Access</h3>
                <p className="text-blue-600">Threshold encryption with selective granting/revoking of access to your receipt data</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl border border-indigo-200 aspect-video bg-gradient-to-br from-indigo-50 to-indigo-100">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <BarChart3 className="h-16 w-16 text-indigo-500 mb-4" />
                <h3 className="text-2xl font-bold text-indigo-700 mb-2">Smart Analytics</h3>
                <p className="text-indigo-600">AI-powered insights from your spending patterns while preserving privacy</p>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Receipt Tiers */}
      <motion.div 
        className="mb-20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h2 
          className="text-3xl font-bold mb-10 text-center"
          variants={itemVariants}
        >
          Gamified NFT Receipt Tiers
        </motion.h2>
        
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={itemVariants}
        >
          {Object.values(ReceiptTier).map(tier => {
            const styles = getTierStyles(tier);
            
            return (
              <Card key={tier} className={`overflow-hidden transition-all transform hover:scale-105 ${styles.background} ${styles.border} ${styles.shadow}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className={`p-3 rounded-full ${styles.background} border ${styles.border}`}>
                      {styles.icon}
                    </div>
                    <Badge className={styles.badge}>
                      {tier} Tier
                    </Badge>
                  </div>
                  <CardTitle className={`text-xl mt-4 ${styles.text}`}>
                    {tier} Collection
                  </CardTitle>
                  <CardDescription>
                    {tier === ReceiptTier.STANDARD && 'For everyday purchases up to $50'}
                    {tier === ReceiptTier.PREMIUM && 'For significant purchases $50-$200'}
                    {tier === ReceiptTier.LUXURY && 'For premium purchases $200-$1000'}
                    {tier === ReceiptTier.ULTRA && 'For exceptional purchases over $1000'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Blockchain verified</span>
                    </li>
                    {(tier === ReceiptTier.PREMIUM || tier === ReceiptTier.LUXURY || tier === ReceiptTier.ULTRA) && (
                      <li className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>{tier === ReceiptTier.PREMIUM ? 'Enhanced' : 'Exclusive'} NFT art options</span>
                      </li>
                    )}
                    {(tier === ReceiptTier.LUXURY || tier === ReceiptTier.ULTRA) && (
                      <li className="flex items-center gap-2">
                        <Coins className="h-4 w-4" />
                        <span>Rewards multiplier</span>
                      </li>
                    )}
                    {tier === ReceiptTier.ULTRA && (
                      <li className="flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        <span>Exclusive premium NFT utility</span>
                      </li>
                    )}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Explore {tier} NFTs</Button>
                </CardFooter>
              </Card>
            );
          })}
        </motion.div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="text-center mt-12"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        <div className="p-10 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 border border-indigo-100 shadow-xl">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700">Ready to Transform Your Receipts?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the blockchain receipt revolution today. Scan your receipt, choose your NFT art, and own a permanent, privacy-first proof of purchase.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/scan-receipt">
              <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                Scan Your First Receipt
              </Button>
            </Link>
            <Link href="/learn-more">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
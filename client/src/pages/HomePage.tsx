import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  ArrowRight
} from 'lucide-react';
import NFTGalleryShowcase from '@/components/home/NFTGalleryShowcase';

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
                Reimagining Receipts for the Digital Age
              </h1>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <p className="text-xl md:text-2xl text-gray-600 mb-10">
                BlockReceipt transforms purchases into secure, interactive NFTs while intelligently categorizing your inventory and spending with built-in privacy controls.
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Link href="/mint-blockreceipt">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                  <Receipt className="mr-2 h-5 w-5" /> Mint a BlockReceipt
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
              Blockchain-Powered Purchase Management
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              BlockReceipt solves the ancient problem of paper receipts with intelligent categorization and Web3 technology.
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
              <h3 className="text-xl font-bold mb-3">Intelligent Inventory Tracking</h3>
              <p className="text-gray-600">
                Automatically categorizes purchased items for inventory management and spending analytics while preserving your financial privacy.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* NFT Gallery Showcase Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <NFTGalleryShowcase />
          </motion.div>
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
            <Link href="/mint-blockreceipt">
              <Button size="lg" className="bg-white text-indigo-700 hover:bg-indigo-50">
                Mint Your First BlockReceipt <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
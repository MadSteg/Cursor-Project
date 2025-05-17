import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'wouter';
import { GitFork, Fingerprint, Lock, Wallet, Shield, Receipt, FileCheck, DollarSign, Scale, Clock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          Reinventing Receipts for the Digital Age
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-4">
          BlockReceipt.ai is a drop-in replacement for paper and email receipts. Instead of printing, vendors mint a blockchain-based receipt that's cheaper to issue, more verifiable, and gives the customer full control.
        </p>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          We make it easy to implement, cost less than thermal printing, and even allow vendors to create digital collectibles or loyalty tie-ins.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">The Problem with Traditional Receipts</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-red-100 p-2 rounded-full">
                <Receipt className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Paper Waste & Environmental Impact</h3>
                <p className="text-slate-600">Billions of paper receipts are printed annually, creating massive environmental waste with thermal paper that cannot be recycled.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-red-100 p-2 rounded-full">
                <Lock className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Limited Privacy Controls</h3>
                <p className="text-slate-600">Traditional digital receipts provide no granular privacy controls, forcing users to share all or nothing when proving purchases.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-red-100 p-2 rounded-full">
                <FileCheck className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Verification Challenges</h3>
                <p className="text-slate-600">Verifying receipt authenticity is difficult with physical receipts that fade over time or can be easily forged.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-3xl font-bold mb-4 text-slate-800">The BlockReceipt Solution</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-green-100 p-2 rounded-full">
                <Fingerprint className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Privacy-Preserving NFTs</h3>
                <p className="text-slate-600">Threshold encryption technology allows users to selectively disclose receipt data while keeping sensitive information private.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-green-100 p-2 rounded-full">
                <GitFork className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Blockchain Verification</h3>
                <p className="text-slate-600">Every receipt is cryptographically secured and verifiable on the Polygon blockchain, ensuring authenticity and preventing fraud.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 bg-green-100 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">NFT Utility & Value</h3>
                <p className="text-slate-600">Receipts become functional NFTs with real-world utility, turning mundane transactions into valuable assets.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">How BlockReceipt Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-md bg-white h-full flex flex-col">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Digitize Any Receipt</CardTitle>
              <CardDescription>Upload paper receipts, connect email inboxes, or capture purchase data directly.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-slate-600">
                Our advanced OCR technology accurately extracts all receipt data including line items, taxes, and merchant details with exceptional accuracy.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-white h-full flex flex-col">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Privacy Controls</CardTitle>
              <CardDescription>Selectively encrypt and control access to sensitive metadata.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-slate-600">
                Using Threshold's Proxy Re-Encryption, you can grant and revoke access to specific parts of your receipt data while keeping other information private.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-white h-full flex flex-col">
            <CardHeader>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-amber-600" />
              </div>
              <CardTitle>NFT Minting</CardTitle>
              <CardDescription>Transform receipts into tiered NFTs with real utility.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-slate-600">
                Each receipt becomes a unique NFT with artwork determined by transaction value. Higher-value purchases unlock premium and luxury tier NFTs with enhanced features.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Privacy-First Technology</h2>
        <p className="text-center text-slate-600 max-w-3xl mx-auto mb-8">
          BlockReceipt.ai uses advanced Threshold Access Control (TACo) encryption to protect your sensitive receipt data.
          Your receipts and offers are securely stored on the blockchain with selective disclosure controls.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-md bg-white">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Warranty Claims Simplified</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Grant temporary access to warranty information when needed without revealing purchase price or other sensitive details. Perfect for electronics, appliances, and high-value purchases.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-white">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Time-Limited Promotions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Vendors can set expiration dates for promotional offers, but only you control the encryption key through your BlockReceipt. No access to your data without your permission.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-white">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Tax-Time Data Control</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Share only tax-relevant receipt data with your accountant or financial advisor, keeping personal purchases private while streamlining tax preparation and expense tracking.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Receipts?</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/scan-receipt">Start Scanning Now</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link href="/nft-wallet">View NFT Wallet</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
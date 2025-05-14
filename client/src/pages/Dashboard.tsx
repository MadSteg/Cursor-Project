import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format } from "date-fns";
import { Receipt, DollarSign, ShoppingCart, ArrowRight } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import ReceiptCard from "@/components/dashboard/ReceiptCard";
import SpendingChart from "@/components/dashboard/SpendingChart";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import BlockchainVisualization from "@/components/dashboard/BlockchainVisualization";
import EmailReceipts from "@/components/dashboard/EmailReceipts";
import ScanReceipt from "@/components/receipts/ScanReceipt";
import ConnectWalletButton from "@/components/blockchain/ConnectWalletButton";
import { type FullReceipt } from "@shared/schema";

const Dashboard: React.FC = () => {
  // Get current month and year
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
  const currentYear = now.getFullYear();
  
  // Get recent receipts
  const { data: recentReceipts, isLoading: isLoadingReceipts } = useQuery<FullReceipt[]>({
    queryKey: ['/api/receipts/recent'],
  });
  
  // Get spending stats for the current month
  const { data: categoryBreakdown, isLoading: isLoadingBreakdown } = useQuery<any[]>({
    queryKey: [`/api/stats/${currentYear}/${currentMonth}/breakdown`],
  });
  
  // Get monthly spending for the last 3 months
  const { data: monthlySpending, isLoading: isLoadingMonthly } = useQuery<{month: number, total: string}[]>({
    queryKey: [`/api/stats/${currentYear}/monthly`],
  });
  
  // Calculate stats
  const totalReceipts = recentReceipts?.length || 0;
  
  const monthlyTotal = monthlySpending?.find(m => m.month === currentMonth)?.total || "0";
  const lastMonthTotal = monthlySpending?.find(m => m.month === (currentMonth === 1 ? 12 : currentMonth - 1))?.total || "0";
  
  const percentChange = lastMonthTotal !== "0" 
    ? Math.round(((parseFloat(monthlyTotal) - parseFloat(lastMonthTotal)) / parseFloat(lastMonthTotal)) * 100)
    : 0;
  
  const mostCommonCategory = categoryBreakdown && categoryBreakdown.length > 0
    ? categoryBreakdown[0].category.name
    : "None";
  
  const mostCommonPercentage = categoryBreakdown && categoryBreakdown.length > 0
    ? categoryBreakdown[0].percentage
    : 0;

  return (
    <main className="flex-grow">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-dark">Dashboard</h2>
            <p className="text-sm text-gray-500 mt-1">Your BlockReceipt.ai verified receipts and spending analytics</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <span className="text-sm text-gray-600">
                {format(now, "MMMM yyyy")}
              </span>
            </div>
            
            {/* Connect Web3 Wallet Button */}
            <div className="flex-shrink-0">
              <ConnectWalletButton />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Receipts"
            value={totalReceipts}
            icon={<Receipt className="text-primary" />}
            iconBgColor="bg-blue-100"
            changeValue={12}
            changeText="from last month"
            isPositiveChange={true}
          />
          
          <StatsCard
            title="Monthly Spending"
            value={`$${parseFloat(monthlyTotal).toFixed(2)}`}
            icon={<DollarSign className="text-secondary" />}
            iconBgColor="bg-green-100"
            changeValue={Math.abs(percentChange)}
            changeText="from last month"
            isPositiveChange={percentChange < 0}
          />
          
          <StatsCard
            title="Most Common Category"
            value={mostCommonCategory}
            icon={<ShoppingCart className="text-accent" />}
            iconBgColor="bg-amber-100"
            changeText={`of transactions`}
            changeValue={mostCommonPercentage}
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-dark">Recent Receipts</h2>
          <Link href="/receipts">
            <a className="text-primary text-sm font-medium flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>

        {isLoadingReceipts ? (
          <div className="text-center py-10">Loading receipts...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReceipts && recentReceipts.map((receipt) => (
              <ReceiptCard key={receipt.id} receipt={receipt} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-dark">Email Receipts</h2>
        </div>
        
        <div className="mb-8">
          <EmailReceipts />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-dark">Spending Analytics</h2>
          <Link href="/analytics">
            <a className="text-primary text-sm font-medium flex items-center">
              Detailed Reports <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SpendingChart month={currentMonth} year={currentYear} />
          <CategoryBreakdown month={currentMonth} year={currentYear} />
        </div>
      </section>

      <BlockchainVisualization />

      {/* Enhanced Security Checkout Section */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 my-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h2 className="text-xl font-bold mb-2">BlockReceipt.ai Premium Security</h2>
            <p className="text-blue-100 max-w-2xl">
              Experience our military-grade threshold encryption technology that protects your payment and receipt data 
              with advanced cryptography, while maintaining full blockchain verification benefits.
            </p>
          </div>
          <Link href="/encrypted-checkout?amount=49.99">
            <a className="mt-4 md:mt-0 bg-white text-blue-900 hover:bg-blue-50 px-4 py-2 rounded-md font-medium flex items-center">
              Try Encrypted Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </div>
        <div className="bg-blue-800 bg-opacity-50 rounded-xl p-4 text-sm">
          <h3 className="font-medium mb-2">Premium Features:</h3>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                <span className="text-xs">1</span>
              </div>
              <span className="ml-2">Threshold proxy re-encryption</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                <span className="text-xs">2</span>
              </div>
              <span className="ml-2">Selective sharing control</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
                <span className="text-xs">3</span>
              </div>
              <span className="ml-2">Zero-knowledge verification</span>
            </li>
          </ul>
        </div>
      </section>
      
      <ScanReceipt />
    </main>
  );
};

export default Dashboard;

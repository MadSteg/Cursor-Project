import React from 'react';
import { useAuth } from '../contexts/WalletContext';
import WalletInfo from '../components/WalletInfo';
import { Link } from 'wouter';

const Dashboard: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {isLoggedIn ? (
          <>
            <div className="bg-card shadow-sm rounded-lg p-6 border">
              <h3 className="text-lg font-medium mb-2">Total Receipts</h3>
              <p className="text-3xl font-bold">12</p>
            </div>
            
            <div className="bg-card shadow-sm rounded-lg p-6 border">
              <h3 className="text-lg font-medium mb-2">Total Spent</h3>
              <p className="text-3xl font-bold">$1,245.80</p>
            </div>
            
            <div className="bg-card shadow-sm rounded-lg p-6 border">
              <h3 className="text-lg font-medium mb-2">Active Warranties</h3>
              <p className="text-3xl font-bold">3</p>
            </div>
          </>
        ) : (
          <div className="md:col-span-3 bg-card shadow-sm rounded-lg p-6 border text-center">
            <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-4">
              Connect your wallet to view your receipt statistics and data
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <WalletInfo />
        </div>
        
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-8">
            {isConnected ? (
              <>
                <div className="bg-card shadow-sm rounded-lg p-6 border">
                  <h3 className="text-lg font-medium mb-4">Recent Receipts</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-secondary/40 rounded">
                      <div>
                        <p className="font-medium">Target</p>
                        <p className="text-sm text-muted-foreground">May 15, 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">$82.47</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                          Silver
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-secondary/40 rounded">
                      <div>
                        <p className="font-medium">Whole Foods</p>
                        <p className="text-sm text-muted-foreground">May 12, 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">$145.32</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                          Platinum
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-secondary/40 rounded">
                      <div>
                        <p className="font-medium">Best Buy</p>
                        <p className="text-sm text-muted-foreground">May 8, 2025</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">$299.99</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                          Platinum
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Link href="/wallet/gallery" className="text-sm text-primary hover:underline">
                      View All Receipts
                    </Link>
                  </div>
                </div>
                
                <div className="bg-card shadow-sm rounded-lg p-6 border">
                  <h3 className="text-lg font-medium mb-4">Spending by Category</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Electronics</span>
                        <span className="text-sm font-medium">$450.98</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                          className="bg-[hsl(var(--chart-1))] h-2.5 rounded-full"
                          style={{ width: '45%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Groceries</span>
                        <span className="text-sm font-medium">$325.45</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                          className="bg-[hsl(var(--chart-2))] h-2.5 rounded-full"
                          style={{ width: '32%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Dining</span>
                        <span className="text-sm font-medium">$189.75</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                          className="bg-[hsl(var(--chart-3))] h-2.5 rounded-full"
                          style={{ width: '18%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Home & Garden</span>
                        <span className="text-sm font-medium">$152.35</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                          className="bg-[hsl(var(--chart-4))] h-2.5 rounded-full"
                          style={{ width: '15%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-card shadow-sm rounded-lg p-6 border">
                <div className="text-center py-10">
                  <h3 className="text-xl font-medium mb-2">Connect Your Wallet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Connect your wallet to view your receipts, active promotions, and unlock all BlockReceipt features
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
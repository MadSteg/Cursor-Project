import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ArrowRightLeft, 
  Building2, 
  Coins,
  Timer,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface MerchantBalance {
  merchantId: string;
  merchantName: string;
  stampsEarned: number;
  stampsRedeemed: number;
  netBalance: number;
  poolContribution: number;
  settlementOwed: number;
  settlementDue: number;
}

interface PoolStatistics {
  totalPoolFunds: number;
  totalStampsEarned: number;
  totalStampsRedeemed: number;
  totalSettlementOwed: number;
  totalSettlementDue: number;
  stampValue: number;
  poolContributionRate: number;
}

interface SettlementTransaction {
  id: string;
  fromMerchant: string;
  toMerchant: string;
  stampValue: number;
  dollarAmount: number;
  timestamp: string;
  transactionHash?: string;
}

export default function MerchantSettlement() {
  const [balances, setBalances] = useState<MerchantBalance[]>([]);
  const [poolStats, setPoolStats] = useState<PoolStatistics | null>(null);
  const [transactions, setTransactions] = useState<SettlementTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettlementData();
  }, []);

  const fetchSettlementData = async () => {
    try {
      const [balanceResponse, historyResponse] = await Promise.all([
        fetch('/api/settlement/balances'),
        fetch('/api/settlement/history')
      ]);

      const balanceData = await balanceResponse.json();
      const historyData = await historyResponse.json();

      if (balanceData.success) {
        setBalances(balanceData.balances);
        setPoolStats(balanceData.poolStatistics);
      }

      if (historyData.success) {
        setTransactions(historyData.transactions);
      }
    } catch (error) {
      console.error('Error fetching settlement data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatPercentage = (rate: number) => `${(rate * 100).toFixed(1)}%`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="brand-gradient-text">Merchant Settlement</span> Dashboard
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Real-time view of cross-merchant loyalty compensation. See exactly how stamps earned at one store 
              get compensated when redeemed at another.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Pool Statistics */}
        {poolStats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total Pool Funds</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(poolStats.totalPoolFunds)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  From {formatPercentage(poolStats.poolContributionRate)} merchant contributions
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Stamps Earned</p>
                    <p className="text-2xl font-bold text-blue-600">{poolStats.totalStampsEarned.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Across all merchants
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Stamps Redeemed</p>
                    <p className="text-2xl font-bold text-purple-600">{poolStats.totalStampsRedeemed.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingDown className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {formatCurrency(poolStats.totalStampsRedeemed * poolStats.stampValue)} total value
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Stamp Value</p>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(poolStats.stampValue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Coins className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Per stamp redemption
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* How Settlement Works */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">How Cross-Merchant Settlement Works</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Pool Contribution</h3>
                <p className="text-slate-600">
                  Each merchant contributes {poolStats ? formatPercentage(poolStats.poolContributionRate) : '0.5%'} of revenue to the loyalty pool
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                  <ArrowRightLeft className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Cross-Redemption</h3>
                <p className="text-slate-600">
                  When stamps are redeemed at any merchant, they get compensated from the pool
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-orange-600 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">Auto Settlement</h3>
                <p className="text-slate-600">
                  Smart contracts automatically settle balances between merchants in real-time
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Merchant Balances */}
        <Card className="border-0 shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Merchant Settlement Balances</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {balances.map((merchant) => (
                <div key={merchant.merchantId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">{merchant.merchantName}</h3>
                    <div className="flex items-center space-x-2">
                      {merchant.settlementOwed > 0 ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Owed {formatCurrency(merchant.settlementOwed)}
                        </Badge>
                      ) : merchant.settlementDue > 0 ? (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          Owes {formatCurrency(merchant.settlementDue)}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Balanced
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Stamps Earned</p>
                      <p className="text-xl font-bold text-blue-600">{merchant.stampsEarned}</p>
                      <p className="text-xs text-slate-500">Pool contribution: {formatCurrency(merchant.poolContribution)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-slate-600">Stamps Redeemed</p>
                      <p className="text-xl font-bold text-purple-600">{merchant.stampsRedeemed}</p>
                      <p className="text-xs text-slate-500">Redemption cost: {formatCurrency(merchant.stampsRedeemed * (poolStats?.stampValue || 0.1))}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-slate-600">Net Balance</p>
                      <p className={`text-xl font-bold ${merchant.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {merchant.netBalance >= 0 ? '+' : ''}{merchant.netBalance}
                      </p>
                      <p className="text-xs text-slate-500">stamps difference</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-slate-600">Settlement Status</p>
                      {merchant.settlementOwed > 0 ? (
                        <p className="text-xl font-bold text-green-600">+{formatCurrency(merchant.settlementOwed)}</p>
                      ) : merchant.settlementDue > 0 ? (
                        <p className="text-xl font-bold text-orange-600">-{formatCurrency(merchant.settlementDue)}</p>
                      ) : (
                        <p className="text-xl font-bold text-gray-600">{formatCurrency(0)}</p>
                      )}
                      <p className="text-xs text-slate-500">net settlement</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Settlement Transactions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Recent Settlement Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ArrowRightLeft className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{tx.stampValue} stamps redeemed</p>
                      <p className="text-sm text-slate-600">
                        From {tx.fromMerchant} → {balances.find(b => b.merchantId === tx.toMerchant)?.merchantName || tx.toMerchant}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(tx.dollarAmount)}</p>
                    <p className="text-sm text-slate-500">{new Date(tx.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
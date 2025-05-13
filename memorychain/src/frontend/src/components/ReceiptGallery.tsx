import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Types for receipt data
interface Receipt {
  id: number;
  tokenId: number;
  merchant: string;
  amount: number;
  currency: string;
  date: string;
  ipfsUrl: string;
}

// Mock logos for merchants (in production, use real logos)
const merchantLogos: Record<string, string> = {
  'Walmart': 'https://logo.clearbit.com/walmart.com',
  'Amazon': 'https://logo.clearbit.com/amazon.com',
  'Target': 'https://logo.clearbit.com/target.com',
  'Apple': 'https://logo.clearbit.com/apple.com',
  'default': 'https://via.placeholder.com/50?text=Receipt'
};

export default function ReceiptGallery() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Connect to the wallet (MetaMask or WalletConnect)
  const connectWallet = async () => {
    setConnecting(true);
    try {
      // Check if MetaMask is available
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        fetchReceipts(accounts[0]);
      } else {
        setError('No Ethereum wallet found. Please install MetaMask.');
      }
    } catch (err: any) {
      setError(`Failed to connect wallet: ${err.message}`);
    } finally {
      setConnecting(false);
    }
  };

  // Fetch receipts for the connected wallet
  const fetchReceipts = async (address: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/receipts/${address}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch receipts: ${response.statusText}`);
      }
      
      const data = await response.json();
      setReceipts(data);
    } catch (err: any) {
      setError(`Error fetching receipts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load receipts when wallet is connected
  useEffect(() => {
    if (walletAddress) {
      fetchReceipts(walletAddress);
    }
  }, [walletAddress]);

  // Format currency for display
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency || 'USD'
    }).format(amount);
  };

  // Get logo for a merchant
  const getMerchantLogo = (merchant: string) => {
    return merchantLogos[merchant] || merchantLogos.default;
  };

  // Truncate wallet address for display
  const formatWalletAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Receipts</h1>
        
        {walletAddress ? (
          <div className="flex items-center">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>{formatWalletAddress(walletAddress)}</span>
            </div>
            <button 
              onClick={() => setWalletAddress(null)}
              className="ml-4 text-gray-600 hover:text-gray-800"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={connecting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
          >
            {connecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
          <button 
            className="text-red-700 font-bold underline mt-2"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      {!walletAddress && !error && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
          <p>Connect your wallet to view your receipts.</p>
        </div>
      )}

      {loading && walletAddress ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : walletAddress && receipts.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-600 mb-4">No receipts found</h3>
          <p className="text-gray-500">You don't have any receipts yet. Make a purchase to get started!</p>
        </div>
      ) : walletAddress && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {receipts.map((receipt) => (
            <Link
              key={receipt.tokenId}
              to={`/receipt/${receipt.tokenId}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <img 
                      src={getMerchantLogo(receipt.merchant)}
                      alt={receipt.merchant}
                      className="w-12 h-12 rounded-full mr-4 object-contain"
                    />
                    <h3 className="text-lg font-medium text-gray-800">{receipt.merchant}</h3>
                  </div>
                  <span className="text-sm text-gray-500">{new Date(receipt.date).toLocaleDateString()}</span>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total</span>
                    <span className="text-lg font-semibold text-gray-800">
                      {formatCurrency(receipt.amount, receipt.currency)}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified ✓
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
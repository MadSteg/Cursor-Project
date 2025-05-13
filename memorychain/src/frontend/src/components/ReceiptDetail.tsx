import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Types for receipt data
interface ReceiptItem {
  description: string;
  amount: number;
  quantity: number;
}

interface ReceiptDetail {
  tokenId: number;
  merchant: string;
  amount: number;
  currency: string;
  date: string;
  items: ReceiptItem[];
  recipient: string;
  ipfsUrl: string;
  verified: boolean;
  decrypted: boolean;
}

export default function ReceiptDetail() {
  const { tokenId } = useParams<{ tokenId: string }>();
  const navigate = useNavigate();
  
  const [receipt, setReceipt] = useState<ReceiptDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format currency for display
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currency || 'USD'
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fetch receipt details
  useEffect(() => {
    async function fetchReceiptDetail() {
      if (!tokenId) return;
      
      setLoading(true);
      try {
        const response = await fetch(`/verify/${tokenId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch receipt: ${response.statusText}`);
        }
        
        const data = await response.json();
        setReceipt(data);
      } catch (err: any) {
        setError(`Error fetching receipt: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchReceiptDetail();
  }, [tokenId]);

  // Truncate wallet address for display
  const formatWalletAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to Receipts
      </button>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : receipt ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Receipt Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">{receipt.merchant}</h1>
              {receipt.verified && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Blockchain Verified ✓
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-2">{formatDate(receipt.date)}</p>
          </div>

          {/* Receipt Body */}
          <div className="p-6">
            {/* Blockchain Info */}
            <div className="mb-8 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Blockchain Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Token ID</p>
                  <p className="font-medium">{receipt.tokenId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Recipient</p>
                  <p className="font-medium">{formatWalletAddress(receipt.recipient)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">IPFS Link</p>
                  <a 
                    href={receipt.ipfsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 break-all"
                  >
                    {receipt.ipfsUrl}
                  </a>
                </div>
              </div>
            </div>

            {/* Items */}
            {receipt.items && receipt.items.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Items</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {receipt.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {item.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                            {formatCurrency(item.amount, receipt.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">Total</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(receipt.amount, receipt.currency)}
              </span>
            </div>

            {/* Data Status */}
            {!receipt.decrypted && (
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-700">
                  This receipt shows limited information because the full data is encrypted. Only authorized vendors with the correct keys can view all details.
                </p>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <button 
                onClick={() => window.print()} 
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                </svg>
                Print Receipt
              </button>
              <a 
                href={receipt.ipfsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                View on IPFS
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-600 mb-4">Receipt not found</h3>
          <p className="text-gray-500">The receipt you're looking for doesn't exist or has been removed.</p>
        </div>
      )}
    </div>
  );
}
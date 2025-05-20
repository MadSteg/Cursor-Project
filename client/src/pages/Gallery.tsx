import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';

interface NFTItem {
  id: string;
  tokenId: string;
  imageUrl: string;
  merchantName: string;
  date: string;
  total: number;
  category?: string;
  warranty?: {
    duration: string;
    expires: string;
  }
}

const Gallery: React.FC = () => {
  const { isConnected, walletAddress } = useWallet();
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeNft, setActiveNft] = useState<NFTItem | null>(null);
  
  // Mock data for demonstration purposes
  useEffect(() => {
    // In a real app, this would fetch from your backend API
    const fetchNfts = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        // Mock data to demonstrate UI before real API integration
        const mockNfts: NFTItem[] = [
          {
            id: '1',
            tokenId: '0x123456789abcdef',
            imageUrl: 'https://placehold.co/400x600/6366f1/ffffff?text=Receipt+NFT',
            merchantName: 'Grocery Store',
            date: '2025-05-15',
            total: 67.82,
            category: 'Groceries'
          },
          {
            id: '2',
            tokenId: '0x234567890abcdef',
            imageUrl: 'https://placehold.co/400x600/8b5cf6/ffffff?text=Electronics+NFT',
            merchantName: 'Tech Store',
            date: '2025-05-10',
            total: 499.99,
            category: 'Electronics',
            warranty: {
              duration: '2 years',
              expires: '2027-05-10'
            }
          },
          {
            id: '3',
            tokenId: '0x345678901abcdef',
            imageUrl: 'https://placehold.co/400x600/ec4899/ffffff?text=Restaurant+NFT',
            merchantName: 'Local Restaurant',
            date: '2025-05-18',
            total: 85.65,
            category: 'Dining'
          },
          {
            id: '4',
            tokenId: '0x456789012abcdef',
            imageUrl: 'https://placehold.co/400x600/f59e0b/ffffff?text=Clothing+NFT',
            merchantName: 'Fashion Outlet',
            date: '2025-05-05',
            total: 128.45,
            category: 'Clothing'
          }
        ];
        
        setNfts(mockNfts);
        setIsLoading(false);
      }, 1500);
    };
    
    if (isConnected && walletAddress) {
      fetchNfts();
    } else {
      setNfts([]);
      setIsLoading(false);
    }
  }, [isConnected, walletAddress]);
  
  // Get unique categories for filter
  const categories = Array.from(new Set(nfts.map(nft => nft.category).filter(Boolean)));
  
  // Filtered NFTs based on category and search
  const filteredNfts = nfts.filter(nft => {
    const matchesCategory = selectedCategory ? nft.category === selectedCategory : true;
    const matchesSearch = searchTerm
      ? nft.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (nft.category && nft.category.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    
    return matchesCategory && matchesSearch;
  });
  
  // Modal for viewing NFT details
  const NFTModal = ({ nft, onClose }: { nft: NFTItem; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-card rounded-lg shadow-xl max-w-lg w-full overflow-hidden animate-slide-up">
        <div className="relative">
          <img 
            src={nft.imageUrl} 
            alt={`${nft.merchantName} receipt`} 
            className="w-full h-64 object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="text-white text-xl font-bold">{nft.merchantName}</h3>
            <p className="text-white/80 text-sm">{new Date(nft.date).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <div className="text-sm text-muted-foreground mb-1">Total Amount</div>
            <div className="text-2xl font-bold">${nft.total.toFixed(2)}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Category</div>
              <div className="font-medium">{nft.category || 'Uncategorized'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Token ID</div>
              <div className="font-mono text-xs truncate">{nft.tokenId}</div>
            </div>
          </div>
          
          {nft.warranty && (
            <div className="p-4 border rounded-lg bg-secondary mb-6">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="font-medium">Warranty Information</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-muted-foreground">Duration</div>
                  <div>{nft.warranty.duration}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Expires</div>
                  <div>{new Date(nft.warranty.expires).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <button className="px-4 py-2 border rounded-md hover:bg-muted transition-colors">
              Share
            </button>
            <button className="px-4 py-2 brand-gradient-bg text-white rounded-md hover:opacity-90 transition-opacity">
              Verify on Chain
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Not connected state
  if (!isConnected) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6 brand-gradient-text">NFT Receipt Gallery</h1>
          
          <div className="bg-card shadow-sm rounded-lg p-8 border animate-pulse-custom">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M14 12h4" />
              <path d="M6 12h4" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Please connect your wallet to view your NFT receipt collection
            </p>
            <button
              onClick={() => {}}
              className="interactive-button px-4 py-2 rounded-md text-sm font-medium text-white brand-gradient-bg"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">NFT Receipt Gallery</h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-card rounded-lg shadow-sm overflow-hidden border animate-pulse">
                <div className="h-48 bg-muted"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-muted rounded w-2/3"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Empty state
  if (filteredNfts.length === 0) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-bold">NFT Receipt Gallery</h1>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="bg-card shadow-sm rounded-lg p-8 border text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">No NFTs Found</h2>
            <p className="text-muted-foreground mb-6">
              {searchTerm || selectedCategory
                ? "No NFTs match your current filters. Try adjusting your search criteria."
                : "You don't have any NFT receipts yet. Upload a receipt to get started."}
            </p>
            <a
              href="/upload"
              className="interactive-button inline-block px-4 py-2 rounded-md text-sm font-medium text-white brand-gradient-bg"
            >
              Upload Receipt
            </a>
          </div>
        </div>
      </div>
    );
  }
  
  // Main gallery view
  return (
    <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold brand-gradient-text">NFT Receipt Gallery</h1>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNfts.map((nft) => (
            <div 
              key={nft.id}
              className="bg-card rounded-lg shadow-sm overflow-hidden border nft-card"
              onClick={() => setActiveNft(nft)}
            >
              <div className="relative">
                <img 
                  src={nft.imageUrl} 
                  alt={`${nft.merchantName} receipt`} 
                  className="w-full h-48 object-cover"
                />
                {nft.warranty && (
                  <div className="nft-badge">
                    Warranty
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{nft.merchantName}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground text-sm">
                    {new Date(nft.date).toLocaleDateString()}
                  </span>
                  <span className="font-bold">${nft.total.toFixed(2)}</span>
                </div>
                {nft.category && (
                  <div className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {nft.category}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {activeNft && (
        <NFTModal nft={activeNft} onClose={() => setActiveNft(null)} />
      )}
    </div>
  );
};

export default Gallery;
import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useWallet } from '../contexts/WalletContext';
import { sampleNFTs } from '../data/nftData';
import PrivacyFeatureExplainer from '../components/PrivacyFeatureExplainer';

const Home: React.FC = () => {
  const { isConnected } = useWallet();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFloatingNFT, setShowFloatingNFT] = useState(false);
  const displayNFTs = sampleNFTs.slice(0, 6);

  // Rotate through featured NFTs
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % displayNFTs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [displayNFTs.length]);

  // Show floating NFT animation after page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFloatingNFT(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-6xl mx-auto relative space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 shadow-2xl mb-16">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
        </div>
        
        <div className="relative z-10 px-6 py-16 md:py-24 text-white text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100 animate-pulse-subtle">
            BlockReceipt.ai
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-blue-100">
            Transform paper & digital receipts into secure, interactive NFTs with privacy controls
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-10">
            <Link href="/upload">
              <button className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all transform hover:-translate-y-1">
                Upload Receipt
              </button>
            </Link>
            <Link href="/nft-browser">
              <button className="px-8 py-4 text-lg font-bold border-2 border-white/70 text-white hover:bg-white/10 rounded-lg transition-colors">
                Browse NFT Collection
              </button>
            </Link>
          </div>
        </div>
        
        {/* Animated NFT Cards */}
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
          <div className="flex justify-center">
            {displayNFTs.map((nft, index) => (
              <div 
                key={nft.id}
                className={`transform transition-all duration-700 nft-card rounded-lg overflow-hidden border-4 border-white shadow-xl ${
                  index === currentIndex 
                    ? 'scale-100 rotate-0 z-30' 
                    : index === (currentIndex + 1) % displayNFTs.length
                    ? 'scale-90 rotate-6 translate-x-8 z-20' 
                    : index === (currentIndex + displayNFTs.length - 1) % displayNFTs.length
                    ? 'scale-90 -rotate-6 -translate-x-8 z-20' 
                    : 'scale-75 opacity-0'
                }`}
                style={{
                  position: 'relative',
                  width: '220px',
                  height: '220px',
                  margin: '0 -30px',
                }}
              >
                <img 
                  src={nft.image} 
                  alt={nft.name} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3">
                  <h3 className="text-white text-lg font-bold">{nft.name}</h3>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                    nft.rarity === 'legendary' ? 'bg-amber-500/80' :
                    nft.rarity === 'epic' ? 'bg-purple-600/80' :
                    nft.rarity === 'rare' ? 'bg-blue-600/80' :
                    nft.rarity === 'uncommon' ? 'bg-green-600/80' :
                    'bg-gray-600/80'
                  }`}>
                    {nft.rarity.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
        {/* Upload Receipt Card */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
          <div className="flex items-center mb-4">
            <div className="h-14 w-14 brand-gradient-bg rounded-full flex items-center justify-center text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold ml-4 brand-gradient-text">Upload Receipt</h2>
          </div>
          <p className="text-muted-foreground mb-6 text-lg">
            Transform any paper or digital receipt into a secure NFT with just a few clicks
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start rounded-lg p-2 bg-white dark:bg-black/20 shadow-sm">
              <div className="h-6 w-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
              <span>Automatic data extraction with advanced OCR</span>
            </li>
            <li className="flex items-start rounded-lg p-2 bg-white dark:bg-black/20 shadow-sm">
              <div className="h-6 w-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
              <span>Privacy-preserving encryption with Threshold TACo</span>
            </li>
            <li className="flex items-start rounded-lg p-2 bg-white dark:bg-black/20 shadow-sm">
              <div className="h-6 w-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
              <span>Collect unique Bulldog character NFTs</span>
            </li>
          </ul>
          <Link href="/upload">
            <button className="w-full py-3 brand-gradient-bg text-white text-lg font-bold rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all">
              Upload Now
            </button>
          </Link>
        </div>
        
        {/* NFT Gallery Preview */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
          <div className="flex items-center mb-4">
            <div className="h-14 w-14 brand-gradient-bg rounded-full flex items-center justify-center text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold ml-4 brand-gradient-text">NFT Gallery</h2>
          </div>
          <p className="text-muted-foreground mb-4 text-lg">
            Explore your growing collection of receipt NFTs and exclusive Bulldog characters
          </p>
          
          <div className="grid grid-cols-2 gap-3 mb-5">
            {displayNFTs.slice(0, 4).map((nft) => (
              <Link key={nft.id} href={`/nft/${nft.id}`}>
                <div className="relative rounded-lg overflow-hidden border border-indigo-200 dark:border-indigo-800 shadow-md hover:shadow-lg transition-all cursor-pointer group">
                  <img 
                    src={nft.image} 
                    alt={nft.name} 
                    className="w-full aspect-square object-cover transition-transform group-hover:scale-110 duration-300" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-white text-sm font-bold truncate">{nft.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <Link href="/nft-browser">
            <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg font-bold rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all">
              View All NFTs
            </button>
          </Link>
        </div>
        
        {/* Blockchain Benefits */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
          <div className="flex items-center mb-4">
            <div className="h-14 w-14 brand-gradient-bg rounded-full flex items-center justify-center text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold ml-4 brand-gradient-text">Blockchain Benefits</h2>
          </div>
          <p className="text-muted-foreground mb-6 text-lg">
            Enjoy enhanced security, privacy and ownership of your purchase data
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start rounded-lg p-2 bg-white dark:bg-black/20 shadow-sm">
              <div className="h-6 w-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
              <span>Immutable proof of purchase for warranty claims</span>
            </li>
            <li className="flex items-start rounded-lg p-2 bg-white dark:bg-black/20 shadow-sm">
              <div className="h-6 w-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
              <span>Selective data sharing with granular access controls</span>
            </li>
            <li className="flex items-start rounded-lg p-2 bg-white dark:bg-black/20 shadow-sm">
              <div className="h-6 w-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white mr-3 flex-shrink-0">✓</div>
              <span>Access purchase history across all your devices</span>
            </li>
          </ul>
          <Link href="/dashboard">
            <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg font-bold rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all">
              View Dashboard
            </button>
          </Link>
        </div>
      </div>
      
      {/* How It Works Section - With Animation */}
      <div className="relative mt-20 mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl -z-10"></div>
        <div className="px-6 py-12 md:py-16 rounded-3xl border border-indigo-200 dark:border-indigo-800/30 shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-12 brand-gradient-text">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white dark:bg-gray-900/60 rounded-xl p-6 shadow-lg relative">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="h-16 w-16 brand-gradient-bg rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">1</div>
              </div>
              <div className="text-center pt-8">
                <h3 className="text-xl font-bold mb-4 mt-2">Upload Receipt</h3>
                <p className="text-muted-foreground">Take a photo or upload a digital receipt file from your email</p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white dark:bg-gray-900/60 rounded-xl p-6 shadow-lg relative">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="h-16 w-16 brand-gradient-bg rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">2</div>
              </div>
              <div className="text-center pt-8">
                <h3 className="text-xl font-bold mb-4 mt-2">Mint NFT Receipt</h3>
                <p className="text-muted-foreground">Our OCR extracts the data and mints it as an NFT on Polygon</p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white dark:bg-gray-900/60 rounded-xl p-6 shadow-lg relative">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="h-16 w-16 brand-gradient-bg rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">3</div>
              </div>
              <div className="text-center pt-8">
                <h3 className="text-xl font-bold mb-4 mt-2">Collect NFT Bulldogs</h3>
                <p className="text-muted-foreground">Earn unique Bulldog character NFTs based on your shopping habits</p>
              </div>
            </div>
            
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-8 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-600 dark:to-purple-600"></div>
            <div className="hidden md:block absolute top-8 left-2/3 w-1/3 h-0.5 bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-600 dark:to-pink-600"></div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/upload">
              <button className="px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all transform hover:-translate-y-1">
                Try It Now
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Privacy Features Explainer */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center brand-gradient-text">Your Privacy Is Our Priority</h2>
        <div className="flex justify-center">
          <PrivacyFeatureExplainer />
        </div>
      </div>
      
      {/* Bulldog Earning Guide */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-8 shadow-xl mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center brand-gradient-text">How to Earn Bulldog NFTs</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {displayNFTs.slice(0, 4).map((nft) => (
            <div key={nft.id} className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg group hover:shadow-xl transition-all">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={nft.image} 
                  alt={nft.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-white ${
                  nft.rarity === 'legendary' ? 'bg-amber-500' :
                  nft.rarity === 'epic' ? 'bg-purple-600' :
                  nft.rarity === 'rare' ? 'bg-blue-600' :
                  nft.rarity === 'uncommon' ? 'bg-green-600' :
                  'bg-gray-600'
                }`}>
                  {nft.rarity.toUpperCase()}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{nft.description.split('.')[0] + '.'}</p>
                <div className="text-sm font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-2 rounded-md">
                  {nft.id.includes('cowboy') && "Fashion purchases over $50"}
                  {nft.id.includes('angel') && "Charitable donations over $100"}
                  {nft.id.includes('beer') && "Dining purchases over $30"}
                  {nft.id.includes('soccer') && "Sports purchases over $40"}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/nft-browser">
            <button className="px-6 py-3 border-2 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg hover:bg-indigo-500 hover:text-white transition-colors">
              View Complete Collection
            </button>
          </Link>
        </div>
      </div>
      
      {/* Floating NFT Animation */}
      {showFloatingNFT && (
        <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
          <div className="relative">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white rounded-full px-4 py-1 text-sm font-bold whitespace-nowrap">
              Upload a receipt to earn!
            </div>
            <div className="h-24 w-24 rounded-lg overflow-hidden border-4 border-white shadow-2xl animate-pulse-subtle">
              <img 
                src={displayNFTs[0].image} 
                alt="Featured NFT" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
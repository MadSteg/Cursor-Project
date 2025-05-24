import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useWallet } from '../contexts/WalletContext';
import { useLanguage } from '../contexts/LanguageContext';
import { sampleNFTs } from '../data/nftData';
import PrivacyFeatureExplainer from '../components/PrivacyFeatureExplainer';

const Home: React.FC = () => {
  const { isConnected } = useWallet();
  const { t } = useLanguage();
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
          <p className="text-xl md:text-2xl mb-4 max-w-3xl mx-auto text-blue-100">
            {t('home.subtitle')}
          </p>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-blue-100/80">
            {t('home.description')}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 text-left border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">For Merchants</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0">✓</div>
                  <span className="text-white/90">Cut receipt costs up to 30%</span>
                </li>
                <li className="flex items-center">
                  <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0">✓</div>
                  <span className="text-white/90">Reduce return fraud by 20%+</span>
                </li>
                <li className="flex items-center">
                  <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0">✓</div>
                  <span className="text-white/90">Meet ESG goals with paper-free systems</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 text-left border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">For Customers</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0">✓</div>
                  <span className="text-white/90">Never lose a receipt again</span>
                </li>
                <li className="flex items-center">
                  <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0">✓</div>
                  <span className="text-white/90">Easy returns with verified ownership</span>
                </li>
                <li className="flex items-center">
                  <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0">✓</div>
                  <span className="text-white/90">Collect exclusive NFT rewards</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-10">
            <Link href="/nft-browser">
              <button className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg hover:shadow-purple-500/30 transition-all transform hover:-translate-y-1">
                View NFT Gallery
              </button>
            </Link>
            <Link href="/merchant-demo">
              <button className="px-8 py-4 text-lg font-bold border-2 border-white/70 text-white hover:bg-white/10 rounded-lg transition-colors">
                See POS Demo
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
      
      {/* How It Works Section */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 rounded-3xl p-8 md:p-12 mt-20 overflow-hidden shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-12 left-12 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-25 animate-bounce"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              How BlockReceipt Makes Shopping Smarter
            </h2>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              Transform your everyday shopping into a secure, rewarding digital experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-full hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">Check Out Like Normal</h3>
                <p className="text-purple-100 text-center leading-relaxed text-sm">
                  Select "Mint BlockReceipt" instead of a paper or email receipt — simple and seamless
                </p>
              </div>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-white/40 to-transparent"></div>
            </div>
            
            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-full hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">Instant Digital Receipt</h3>
                <p className="text-purple-100 text-center leading-relaxed text-sm">
                  Get a secure NFT receipt in your wallet automatically — no apps or setup
                </p>
              </div>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-white/40 to-transparent"></div>
            </div>
            
            {/* Step 3 */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-full hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">Get Rewards, Not Clutter</h3>
                <p className="text-purple-100 text-center leading-relaxed text-sm">
                  Earn collectible NFTs and loyalty points with every purchase — no more paper pile-up
                </p>
              </div>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-white/40 to-transparent"></div>
            </div>
            
            {/* Step 4 */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-full hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                  4
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">Breeze Through Returns</h3>
                <p className="text-purple-100 text-center leading-relaxed text-sm">
                  Your receipt is always in your phone. Skip the paper trail and long return lines
                </p>
              </div>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-white/40 to-transparent"></div>
            </div>
            
            {/* Step 5 */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 h-full hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg">
                  5
                </div>
                <h3 className="text-xl font-bold text-white mb-4 text-center">Your Proof, Always Secure</h3>
                <p className="text-purple-100 text-center leading-relaxed text-sm">
                  Rest assured knowing your receipts are verifiable and fraud-resistant
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated NFT Showcase */}
      <div className="mt-20 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Collect Exclusive NFT Characters</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each purchase comes with a chance to earn rare collectible characters — the more you shop, the more you collect
          </p>
        </div>
        
        {/* Scrolling NFT Strip */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-100 via-blue-50 to-indigo-100 rounded-2xl py-8 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10"></div>
          
          {/* First Row - Left to Right */}
          <div className="flex animate-scroll-left mb-6">
            {[...sampleNFTs, ...sampleNFTs].map((nft, index) => (
              <div key={`row1-${index}`} className="flex-shrink-0 mx-3">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer border-4 border-white">
                  <img 
                    src={nft.image} 
                    alt={nft.name} 
                    className="w-full h-full object-cover group-hover:brightness-110 transition-all" 
                  />
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm font-bold text-gray-800 truncate">{nft.name}</p>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold mt-1 ${
                    nft.rarity === 'legendary' ? 'bg-amber-200 text-amber-800' :
                    nft.rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
                    nft.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                    nft.rarity === 'uncommon' ? 'bg-green-200 text-green-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {nft.rarity.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Second Row - Right to Left */}
          <div className="flex animate-scroll-right">
            {[...sampleNFTs.slice().reverse(), ...sampleNFTs.slice().reverse()].map((nft, index) => (
              <div key={`row2-${index}`} className="flex-shrink-0 mx-3">
                <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer border-4 border-white">
                  <img 
                    src={nft.image} 
                    alt={nft.name} 
                    className="w-full h-full object-cover group-hover:brightness-110 transition-all" 
                  />
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm font-bold text-gray-800 truncate">{nft.name}</p>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-bold mt-1 ${
                    nft.rarity === 'legendary' ? 'bg-amber-200 text-amber-800' :
                    nft.rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
                    nft.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                    nft.rarity === 'uncommon' ? 'bg-green-200 text-green-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {nft.rarity.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Link href="/nft-browser">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all transform hover:-translate-y-1">
              Explore All Collectibles
            </button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
        
        {/* Privacy & Security - TACo PRE */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
          </div>
          
          {/* Floating Security Elements */}
          <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-12 left-12 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-25 animate-bounce"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Your Privacy, Your Control
              </h2>
              <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
                Why BlockReceipt beats traditional receipts
              </p>
            </div>
            
            {/* Traditional vs BlockReceipt Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 mb-12">
              {/* Traditional Receipts - Problems */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                <h3 className="text-2xl font-bold text-red-300 mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Traditional Receipts
                </h3>
                <ul className="space-y-4 text-purple-100">
                  <li className="flex items-start">
                    <span className="text-red-400 mr-3 text-xl">✗</span>
                    <span className="leading-relaxed">Anyone can read your purchase details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-3 text-xl">✗</span>
                    <span className="leading-relaxed">Easy to lose or damage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-3 text-xl">✗</span>
                    <span className="leading-relaxed">No control over your data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-400 mr-3 text-xl">✗</span>
                    <span className="leading-relaxed">Fades and becomes unreadable</span>
                  </li>
                </ul>
              </div>
              
              {/* BlockReceipt - Solutions */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                <h3 className="text-2xl font-bold text-emerald-300 mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  BlockReceipt NFTs
                </h3>
                <ul className="space-y-4 text-purple-100">
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-3 text-xl">✓</span>
                    <span className="leading-relaxed">Only YOU can access full receipt details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-3 text-xl">✓</span>
                    <span className="leading-relaxed">Permanent, tamper-proof storage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-3 text-xl">✓</span>
                    <span className="leading-relaxed">Complete control over data sharing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-emerald-400 mr-3 text-xl">✓</span>
                    <span className="leading-relaxed">Never fades, always accessible</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* TACo PRE Explanation */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Advanced TACo PRE Encryption
              </h3>
              <p className="text-white/90 text-lg leading-relaxed mb-4">
                Your receipt metadata is secured using <span className="font-bold text-cyan-300">Threshold Access Control Proxy Re-Encryption</span> — 
                military-grade technology that ensures only your wallet can decrypt your purchase information.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-black font-bold">1</span>
                  </div>
                  <p className="text-white/80 text-sm">Receipt data encrypted with your unique keys</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-black font-bold">2</span>
                  </div>
                  <p className="text-white/80 text-sm">Stored securely on blockchain & IPFS</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-teal-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-black font-bold">3</span>
                  </div>
                  <p className="text-white/80 text-sm">Only you decide who gets access</p>
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="text-center">
              <p className="text-white/90 text-lg mb-4">
                <span className="font-bold">Choose security.</span> Choose control. Choose BlockReceipt at checkout.
              </p>
              <Link href="/how-it-works">
                <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-1">
                  Learn More About TACo Security
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section - With Animation */}
      <div className="relative mt-20 mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl -z-10"></div>
        <div className="px-6 py-12 md:py-16 rounded-3xl border border-indigo-200 dark:border-indigo-800/30 shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-4 brand-gradient-text">How It Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">A seamless experience for both customers and merchants</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white dark:bg-gray-900/60 rounded-xl p-6 shadow-lg relative">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="h-16 w-16 brand-gradient-bg rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">1</div>
              </div>
              <div className="text-center pt-8">
                <h3 className="text-xl font-bold mb-4 mt-2">Check Out</h3>
                <p className="text-muted-foreground">Customer chooses "Digital Receipt" option at checkout</p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white dark:bg-gray-900/60 rounded-xl p-6 shadow-lg relative">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="h-16 w-16 brand-gradient-bg rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">2</div>
              </div>
              <div className="text-center pt-8">
                <h3 className="text-xl font-bold mb-4 mt-2">Mint Receipt</h3>
                <p className="text-muted-foreground">POS system automatically mints an NFT receipt to customer's wallet</p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white dark:bg-gray-900/60 rounded-xl p-6 shadow-lg relative">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="h-16 w-16 brand-gradient-bg rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">3</div>
              </div>
              <div className="text-center pt-8">
                <h3 className="text-xl font-bold mb-4 mt-2">Receive Rewards</h3>
                <p className="text-muted-foreground">Customer earns loyalty points and special NFT collectibles</p>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="bg-white dark:bg-gray-900/60 rounded-xl p-6 shadow-lg relative">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="h-16 w-16 brand-gradient-bg rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-gray-800 shadow-lg">4</div>
              </div>
              <div className="text-center pt-8">
                <h3 className="text-xl font-bold mb-4 mt-2">Easy Returns</h3>
                <p className="text-muted-foreground">Scan wallet for verified proof of purchase in seconds</p>
              </div>
            </div>
            
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-8 left-0 w-1/4 h-0.5 bg-gradient-to-r from-indigo-300 to-blue-300 dark:from-indigo-600 dark:to-blue-600"></div>
            <div className="hidden md:block absolute top-8 left-1/4 w-1/4 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 dark:from-blue-600 dark:to-purple-600"></div>
            <div className="hidden md:block absolute top-8 left-2/4 w-1/4 h-0.5 bg-gradient-to-r from-purple-300 to-indigo-300 dark:from-purple-600 dark:to-indigo-600"></div>
            <div className="hidden md:block absolute top-8 left-3/4 w-1/4 h-0.5 bg-gradient-to-r from-indigo-300 to-pink-300 dark:from-indigo-600 dark:to-pink-600"></div>
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
      
      {/* Merchant Benefits Section */}
      <div className="relative mb-16">
        <div className="px-6 py-12 md:py-16 rounded-3xl border border-green-200 dark:border-green-800/30 shadow-xl bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
          <h2 className="text-3xl font-bold text-center mb-4 text-green-800 dark:text-green-300">For Enterprise Retailers</h2>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">Transform your receipt infrastructure while cutting costs</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900/60 rounded-xl p-6 shadow-lg">
              <div className="h-14 w-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Cost Savings</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                  <span>Eliminate thermal paper costs</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                  <span>Reduce printer maintenance and hardware</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                  <span>Save $0.004 per transaction ($15M yearly for large chains)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-900/60 rounded-xl p-6 shadow-lg">
              <div className="h-14 w-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">ESG Impact</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                  <span>Eliminate non-recyclable thermal paper</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                  <span>Save 2,200+ tons of paper annually</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                  <span>Preserve 9,000+ trees per year</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-900/60 rounded-xl p-6 shadow-lg">
              <div className="h-14 w-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Brand Perception</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                  <span>+8 pt NPS boost with younger demographics</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                  <span>Transform receipts from waste to digital assets</span>
                </li>
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                  <span>Earn press coverage for sustainability innovation</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link href="/enterprise">
              <button className="px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-green-600 to-teal-600 rounded-lg shadow-lg hover:shadow-green-500/30 transition-all transform hover:-translate-y-1">
                Enterprise Solutions
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Privacy Features Explainer */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center brand-gradient-text">Your Privacy, Your Control, Our Priority</h2>
        <div className="flex justify-center">
          <PrivacyFeatureExplainer />
        </div>
      </div>
      
      {/* Character NFT Earning Guide */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-8 shadow-xl mb-12">
        <h2 className="text-3xl font-bold mb-8 text-center brand-gradient-text">How to Earn Fun Character NFTs</h2>
        
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
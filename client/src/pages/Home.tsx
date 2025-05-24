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
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-blue-100 leading-relaxed">
            Transform your everyday shopping receipts into secure, retrievable digital NFTs — Minted instantly at checkout — no paper, no emails, just better digitally verifiable receipts.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 max-w-4xl mx-auto mb-8">
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
              BlockReceipt Makes Everyday Shopping Smarter
            </h2>
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
                  Just pick "Mint BlockReceipt" like you'd choose paper or email. Your receipt history gets upgraded automatically — no more lost paper or endless inbox searches.
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
                  Minted automatically after purchase and stored in a secure, searchable digital vault. Available anytime via mobile — it's your receipt history reimagined.
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
                  Get insights into spending habits, reorder suggestions, and purchase summaries by store. Think of it as a smart ledger that builds itself.
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
                <h3 className="text-xl font-bold text-white mb-4 text-center">Secure Verification & Returns</h3>
                <p className="text-purple-100 text-center leading-relaxed text-sm">
                  Instantly verify purchases for returns or warranty claims without the drawbacks of paper receipts — no fading, no tearing, no loss. Your proof of purchase is always accessible and verifiable.
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
                  Each receipt is protected with advanced TACo PRE encryption technology from Threshold Network — providing enterprise-grade security that's tamper-proof, fraud-proof, and worry-free.
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

      {/* Combined Purple Security Section */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden mt-20 mb-16">
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
          

          
          {/* TACo PRE Explanation */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
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
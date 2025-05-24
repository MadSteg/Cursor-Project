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
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Ditch paper pollution.
            </h2>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Choose carbon-neutral collectibles.
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6 max-w-5xl mx-auto mb-8">
            {/* Traditional Paper Receipts - Problems */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <h3 className="text-2xl font-bold text-orange-300 mb-8">
                Antiquated Paper Receipt System
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">Frustratingly vulnerable receipts</h4>
                    <p className="text-white/80">exposing your personal purchase data to everyone</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">Mysteriously disappear when</h4>
                    <p className="text-white/80">you desperately need them for returns</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">Wasteful clutter choking</h4>
                    <p className="text-white/80">wallets and polluting landfills</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">Maddeningly fade away</h4>
                    <p className="text-white/80">leaving you with unreadable thermal ink</p>
                  </div>
                </div>
                
                <p className="text-red-300 text-center mt-6 italic">
                  The antiquated paper system leaves you powerless and frustrated
                </p>
              </div>
            </div>
            
            {/* BlockReceipt - Solutions */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300">
              <h3 className="text-2xl font-bold text-emerald-300 mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                BlockReceipt
              </h3>
              
              <p className="text-white/90 text-center mb-8 leading-relaxed">
                BlockReceipt helps you keep track of every purchase — securely, privately, and permanently — without relying on paper, email, or memory. Here's why it's better than traditional receipts.
              </p>
              
              {/* Four Key Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Your Receipts, Upgraded */}
                <div className="bg-white/5 rounded-xl p-6 border border-emerald-400/20">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white">Your Receipts, Upgraded</h4>
                  </div>
                  <p className="text-white/80 text-sm mb-4">No more lost paper or endless inbox searches. BlockReceipts are:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-emerald-300">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Minted automatically after purchase (no setup required)
                    </li>
                    <li className="flex items-center text-emerald-300">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Stored in a secure, searchable digital vault
                    </li>
                    <li className="flex items-center text-emerald-300">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Available anytime via mobile
                    </li>
                  </ul>
                  <p className="text-purple-300 text-sm mt-4 italic">It's your receipt history reimagined — modern, accessible, and reliable.</p>
                </div>

                {/* Return with Confidence */}
                <div className="bg-white/5 rounded-xl p-6 border border-emerald-400/20">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white">Return with Confidence</h4>
                  </div>
                  <p className="text-white/80 text-sm mb-4">Show proof of purchase in seconds — even months later. BlockReceipts:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-emerald-300">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Can't fade or be lost
                    </li>
                    <li className="flex items-center text-emerald-300">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Help you return or exchange faster
                    </li>
                    <li className="flex items-center text-emerald-300">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Are cryptographically verifiable
                    </li>
                  </ul>
                  <p className="text-blue-300 text-sm mt-4 italic">No more digging through drawers. Just open your receipt vault.</p>
                </div>

                {/* Track Your Spending Smarter */}
                <div className="bg-white/5 rounded-xl p-6 border border-emerald-400/20">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white">Track Your Spending Smarter</h4>
                  </div>
                  <p className="text-white/80 text-sm mb-4">BlockReceipt uses OCR to scan and categorize what you've bought. Over time, you get:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-emerald-300">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Insights into spending habits
                    </li>
                    <li className="flex items-center text-emerald-300">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Reorder suggestions
                    </li>
                    <li className="flex items-center text-emerald-300">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Purchase summaries by store, category, or item
                    </li>
                  </ul>
                  <p className="text-green-300 text-sm mt-4 italic">Think of it as a smart ledger that builds itself.</p>
                </div>

                {/* Eco-Friendly by Design */}
                <div className="bg-white/5 rounded-xl p-6 border border-emerald-400/20">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white">Eco-Friendly by Design</h4>
                  </div>
                  <p className="text-white/80 text-sm mb-4">Paper receipts are wasteful — and most thermal paper can't be recycled.</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center text-emerald-300">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Helps reduce paper use
                    </li>
                    <li className="flex items-center text-emerald-300">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Lowers carbon footprint
                    </li>
                    <li className="flex items-center text-emerald-300">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Powers more sustainable commerce
                    </li>
                  </ul>
                  <p className="text-emerald-300 text-sm mt-4 italic">It's better for you and the planet.</p>
                </div>
              </div>

              {/* Bottom Row - Additional Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4 text-center border border-emerald-400/20">
                  <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h5 className="text-sm font-bold text-white mb-2">Fully Private & Secure</h5>
                  <p className="text-xs text-white/70 mb-2">Receipts are stored using encryption and privacy-preserving technology like Threshold PRE.</p>
                  <p className="text-xs text-indigo-300 font-medium">Only you control your data.</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 text-center border border-emerald-400/20">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h5 className="text-sm font-bold text-white mb-2">No Wallet? No Problem.</h5>
                  <p className="text-xs text-white/70 mb-2">We create a secure digital vault for you behind the scenes. You don't need crypto knowledge.</p>
                  <p className="text-xs text-orange-300 font-medium">Just pay as usual.</p>
                </div>

                <div className="bg-white/5 rounded-lg p-4 text-center border border-emerald-400/20">
                  <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h5 className="text-sm font-bold text-white mb-2">Looks Good, Too.</h5>
                  <p className="text-xs text-white/70 mb-2">Some receipts come with limited-edition designs, animations, or loyalty perks.</p>
                  <p className="text-xs text-pink-300 font-medium">Everyday purchases become collectible experiences.</p>
                </div>
              </div>
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
            <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed">
              Transform your everyday shopping receipts into secure, retrievable digital NFTs — Minted instantly at checkout — no paper, no emails, just better digitally verifiable receipts.
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
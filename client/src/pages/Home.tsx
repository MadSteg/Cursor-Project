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
  const [bucketImages, setBucketImages] = useState<Array<{ fileName: string; url: string }>>([]);
  const [imagesLoading, setImagesLoading] = useState(true);

  // Fetch your real images from Google Cloud Storage
  useEffect(() => {
    async function fetchBucketImages() {
      try {
        const response = await fetch('/api/nft-images');
        const data = await response.json();
        
        if (data.success && data.images?.length > 0) {
          setBucketImages(data.images);
        }
      } catch (error) {
        console.log('Using fallback images - bucket may be empty or not accessible');
      } finally {
        setImagesLoading(false);
      }
    }
    
    fetchBucketImages();
  }, []);

  // Use your real images if available, otherwise fall back to sample NFTs
  const displayNFTs = bucketImages.length > 0 
    ? bucketImages.map((image, index) => ({
        id: index + 1,
        name: "Digital Collectible", // Clean generic name, no filename exposure
        image: image.url,
        rarity: 'common' as const
      })).slice(0, 6)
    : sampleNFTs.slice(0, 6);

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
              Ditch paper pollution and antiquated systems.
            </h2>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Choose carbon-neutral NFT collectibles.
            </h2>
          </div>
          
          <div className="max-w-5xl mx-auto mb-12 space-y-3">
            {/* Traditional Paper Receipts Section */}
            <div className="bg-red-900/20 backdrop-blur-sm border border-red-400/30 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-red-300 mb-4 flex items-center justify-center">
                  🔴 Traditional Paper Receipts
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Not carbon efficient</h4>
                      <p className="text-white/80">Creates paper waste and toxic thermal ink pollution that harms the environment.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Privacy risks for everyone</h4>
                      <p className="text-white/80">Exposes personal data that can be read by anyone, opening merchants up to fraud and breaches.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Fragile and unreliable</h4>
                      <p className="text-white/80">Easily lost, damaged, or faded — risking warranty claims and making returns a hassle.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Always missing when you need them</h4>
                      <p className="text-white/80">Often misplaced just when you need proof for a return, creating unnecessary stress.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="text-center">
              <div className="text-white/60 text-2xl font-light">⸻</div>
            </div>

            {/* BlockReceipt Section */}
            <div className="bg-emerald-900/20 backdrop-blur-sm border border-emerald-400/30 rounded-2xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-emerald-300 mb-4 flex items-center justify-center">
                  🟢 BlockReceipt
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Carbon-neutral and clutter-free</h4>
                      <p className="text-white/80">Eliminate waste, ink, and landfill impact with a fully digital, sustainable format.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Only you can access your receipts</h4>
                      <p className="text-white/80">Protected by Threshold proxy re-encryption — your purchase history stays private, always.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Secure and always available</h4>
                      <p className="text-white/80">24/7 access in your digital wallet, backed by tamper-proof blockchain technology.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 mr-3 flex-shrink-0 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Never scramble for a receipt again</h4>
                      <p className="text-white/80">Receipts are stored automatically, neatly categorized, and always ready when you need them.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden mt-20 mb-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-12 left-12 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-25 animate-bounce"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Collect Exclusive NFT Characters</h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Each purchase comes with a chance to earn rare collectible characters — the more you shop, the more you collect
            </p>
          </div>
          
          {/* Scrolling NFT Strip */}
          <div className="relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl py-8 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-10"></div>
            
            {/* First Row - Left to Right */}
            <div className="flex animate-scroll-left mb-6">
              {bucketImages.length > 0 
                ? [...bucketImages, ...bucketImages].map((image, index) => (
                    <div key={`row1-${index}`} className="flex-shrink-0 mx-3">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer border-4 border-white">
                        <img 
                          src={image.url} 
                          alt="NFT Collection" 
                          className="w-full h-full object-cover group-hover:brightness-110 transition-all" 
                        />
                      </div>
                    </div>
                  ))
                : [...sampleNFTs, ...sampleNFTs].map((nft, index) => (
                    <div key={`row1-fallback-${index}`} className="flex-shrink-0 mx-3">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer border-4 border-white">
                        <img 
                          src={nft.image} 
                          alt="NFT Collection" 
                          className="w-full h-full object-cover group-hover:brightness-110 transition-all" 
                        />
                      </div>
                    </div>
                  ))
              }
            </div>
            
            {/* Second Row - Right to Left */}
            <div className="flex animate-scroll-right mb-6">
              {bucketImages.length > 0 
                ? [...bucketImages.slice().reverse(), ...bucketImages.slice().reverse()].map((image, index) => (
                    <div key={`row2-${index}`} className="flex-shrink-0 mx-3">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer border-4 border-white">
                        <img 
                          src={image.url} 
                          alt="NFT Collection" 
                          className="w-full h-full object-cover group-hover:brightness-110 transition-all" 
                        />
                      </div>
                    </div>
                  ))
                : [...sampleNFTs.slice().reverse(), ...sampleNFTs.slice().reverse()].map((nft, index) => (
                    <div key={`row2-fallback-${index}`} className="flex-shrink-0 mx-3">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer border-4 border-white">
                        <img 
                          src={nft.image} 
                          alt="NFT Collection" 
                          className="w-full h-full object-cover group-hover:brightness-110 transition-all" 
                        />
                      </div>
                    </div>
                  ))
              }
            </div>

            {/* Third Row - Left to Right (Slower) */}
            <div className="flex animate-scroll-left-slow">
              {bucketImages.length > 0 
                ? [...bucketImages.slice(0, Math.ceil(bucketImages.length/2)), ...bucketImages.slice(0, Math.ceil(bucketImages.length/2))].map((image, index) => (
                    <div key={`row3-${index}`} className="flex-shrink-0 mx-3">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer border-4 border-white">
                        <img 
                          src={image.url} 
                          alt="NFT Collection" 
                          className="w-full h-full object-cover group-hover:brightness-110 transition-all" 
                        />
                      </div>
                    </div>
                  ))
                : [...sampleNFTs.slice(0, 3), ...sampleNFTs.slice(0, 3)].map((nft, index) => (
                    <div key={`row3-fallback-${index}`} className="flex-shrink-0 mx-3">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer border-4 border-white">
                        <img 
                          src={nft.image} 
                          alt="NFT Collection" 
                          className="w-full h-full object-cover group-hover:brightness-110 transition-all" 
                        />
                      </div>
                    </div>
                  ))
              }
            </div>
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
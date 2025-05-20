import React from 'react';
import { Link } from 'wouter';
import { useWallet } from '../contexts/WalletContext';
import { sampleNFTs } from '../data/nftData';

const Home: React.FC = () => {
  const { isConnected } = useWallet();

  // Pick 4 sample NFTs to display
  const featuredNFTs = sampleNFTs.slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 brand-gradient-text">
          BlockReceipt.ai
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Transform your receipts into secure, interactive, and privacy-preserving NFTs
        </p>
        
        <div className="flex justify-center space-x-4 my-8">
          <Link href="/upload">
            <button className="px-6 py-3 text-lg font-medium text-white brand-gradient-bg rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              Upload Receipt
            </button>
          </Link>
          <Link href="/nft-browser">
            <button className="px-6 py-3 text-lg font-medium border border-primary text-primary hover:bg-primary/10 rounded-lg transition-colors">
              Browse NFT Collection
            </button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 md:col-span-1 bg-card border rounded-lg p-6 shadow-md">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 brand-gradient-bg rounded-full flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold ml-3">Upload Receipt</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Connect your wallet, upload receipts, and mint them as unique blockchain assets with built-in privacy controls.
          </p>
          <ul className="space-y-2 mb-5">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-sm">Automatic data extraction with OCR</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-sm">Encrypted storage with Threshold TACo</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-sm">Earn exclusive NFTs based on purchases</span>
            </li>
          </ul>
          <Link href="/upload">
            <button className="px-4 py-2 w-full text-center brand-gradient-bg text-white rounded-md font-medium hover:opacity-90 transition-opacity">
              Upload Now
            </button>
          </Link>
        </div>
        
        <div className="col-span-1 md:col-span-2 bg-card border rounded-lg p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="h-12 w-12 brand-gradient-bg rounded-full flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold ml-3">Bulldog NFT Collection</h2>
            </div>
            <Link href="/nft-browser" className="text-primary hover:underline text-sm">
              View All NFTs →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {featuredNFTs.map(nft => (
              <Link key={nft.id} href={`/nft/${nft.id}`}>
                <div className="border rounded-lg overflow-hidden bg-background hover:shadow-md transition-shadow cursor-pointer">
                  <div className="relative">
                    <img 
                      src={nft.image} 
                      alt={nft.name} 
                      className="w-full h-32 object-cover" 
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <h3 className="text-white text-sm font-medium truncate">{nft.name}</h3>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium mb-2">How to Earn Bulldogs:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Cowboy Bulldog:</strong> Fashion purchases over $50</span>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Angel Bulldog:</strong> Charitable donations over $100</span>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Social Bulldog:</strong> Dining purchases over $30</span>
              </div>
              <div className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span><strong>Soccer Bulldog:</strong> Sports purchases over $40</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="bg-card border rounded-lg p-6 shadow-md overflow-hidden relative">
        <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1">
          Demo Mode
        </div>
        
        <h2 className="text-xl font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 brand-gradient-bg rounded-full flex items-center justify-center text-white mb-3">
              <span className="font-bold text-xl">1</span>
            </div>
            <h3 className="font-medium mb-2">Upload Receipt</h3>
            <p className="text-sm text-muted-foreground">Take a photo or upload a digital receipt file</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 brand-gradient-bg rounded-full flex items-center justify-center text-white mb-3">
              <span className="font-bold text-xl">2</span>
            </div>
            <h3 className="font-medium mb-2">Mint NFT Receipt</h3>
            <p className="text-sm text-muted-foreground">We extract the data and mint it as an NFT on Polygon</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 brand-gradient-bg rounded-full flex items-center justify-center text-white mb-3">
              <span className="font-bold text-xl">3</span>
            </div>
            <h3 className="font-medium mb-2">Earn Bulldog NFTs</h3>
            <p className="text-sm text-muted-foreground">Collect unique Bulldog NFTs based on your shopping habits</p>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <Link href="/upload">
            <button className="px-6 py-2 text-white brand-gradient-bg rounded-md shadow hover:shadow-md transition-shadow">
              Try It Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
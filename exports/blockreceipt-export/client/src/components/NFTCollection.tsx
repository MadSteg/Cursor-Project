import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useLocation } from 'wouter';
import { NFT } from '../types/nft';
import Confetti from './Confetti';

interface NFTCollectionProps {
  nfts: NFT[];
  mintedNFTs: string[];
}

// Get rarity color
const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return 'bg-gray-500';
    case 'uncommon':
      return 'bg-green-500';
    case 'rare':
      return 'bg-blue-500';
    case 'epic':
      return 'bg-purple-500';
    case 'legendary':
      return 'bg-amber-500';
    default:
      return 'bg-gray-500';
  }
};

// Component for NFT card
const NFTCard: React.FC<{ nft: NFT; onClick: () => void }> = ({ nft, onClick }) => {
  return (
    <div 
      className="bg-card rounded-lg overflow-hidden border border-border shadow-sm nft-card cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={nft.image}
          alt={nft.name}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute top-2 right-2 ${getRarityColor(nft.rarity)} text-white text-xs font-bold px-2 py-1 rounded-md`}>
          {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{nft.name}</h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{nft.description}</p>
        <div className="flex flex-wrap gap-1">
          {nft.attributes.slice(0, 2).map((attr, index) => (
            <span key={index} className="inline-block bg-primary/10 text-primary text-xs rounded-full px-2 py-1">
              {attr.value}
            </span>
          ))}
          {nft.attributes.length > 2 && (
            <span className="inline-block bg-secondary/10 text-secondary text-xs rounded-full px-2 py-1">
              +{nft.attributes.length - 2} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// NFT Detail Modal
const NFTDetailModal: React.FC<{ nft: NFT; onClose: () => void; onMint: () => void }> = ({ 
  nft, 
  onClose,
  onMint
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-card rounded-lg shadow-xl max-w-lg w-full overflow-hidden animate-slide-up">
        <div className="relative">
          <img 
            src={nft.image} 
            alt={nft.name} 
            className="w-full h-64 object-contain bg-black"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <div className={`absolute top-4 left-4 ${getRarityColor(nft.rarity)} text-white text-xs font-bold px-2 py-1 rounded-md`}>
            {nft.rarity.charAt(0).toUpperCase() + nft.rarity.slice(1)}
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-2">{nft.name}</h3>
          <p className="text-muted-foreground mb-4">{nft.description}</p>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Attributes</h4>
            <div className="grid grid-cols-2 gap-2">
              {nft.attributes.map((attr, index) => (
                <div key={index} className="bg-secondary/10 rounded-md p-2 text-sm">
                  <div className="text-xs text-muted-foreground">{attr.trait_type}</div>
                  <div className="font-medium">{attr.value}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onMint}
              className="px-4 py-2 brand-gradient-bg text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Mint This NFT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main NFT Collection Component
const NFTCollection: React.FC<NFTCollectionProps> = ({ nfts, mintedNFTs: initialMintedNFTs }) => {
  const { isConnected } = useWallet();
  const [, navigate] = useLocation();
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [mintingNFT, setMintingNFT] = useState<string | null>(null);
  const [mintedNFTs, setMintedNFTs] = useState<string[]>(initialMintedNFTs || []);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Filter NFTs based on criteria
  const filteredNFTs = nfts.filter(nft => {
    const matchesFilter = filter === 'all' || nft.rarity === filter;
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         nft.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         nft.attributes.some(attr => attr.value.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });
  
  // Handle minting an NFT
  const handleMint = (nftId: string) => {
    setMintingNFT(nftId);
    
    // Simulate minting process
    setTimeout(() => {
      setMintedNFTs(prev => [...prev, nftId]);
      setMintingNFT(null);
      setSelectedNFT(null);
      
      // Show confetti for successful mint
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }, 2000);
  };
  
  // Not connected
  if (!isConnected) {
    return (
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6 brand-gradient-text">Bulldog NFT Collection</h1>
          
          <div className="bg-card shadow-sm rounded-lg p-8 border animate-pulse-subtle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Please connect your wallet to browse and mint from our exclusive Bulldog NFT collection
            </p>
            <button
              onClick={() => {}}
              className="px-4 py-2 rounded-md text-sm font-medium text-white brand-gradient-bg"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <p className="text-muted-foreground">Exclusive digital collectibles with randomly assigned rarity when you upload receipts</p>
          </div>
          
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
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Rarities</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNFTs.map((nft) => (
            <div key={nft.id} className="relative">
              <div onClick={() => setSelectedNFT(nft)}>
                <NFTCard nft={nft} onClick={() => setSelectedNFT(nft)} />
                {mintedNFTs.includes(nft.id) && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    Minted
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {filteredNFTs.length === 0 && (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium mb-1">No matching NFTs found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
      
      {selectedNFT && (
        <NFTDetailModal 
          nft={selectedNFT}
          onClose={() => setSelectedNFT(null)}
          onMint={() => handleMint(selectedNFT.id)}
        />
      )}

      <Confetti active={showConfetti} />

      {/* Progress indicator */}
      <div className="fixed bottom-6 left-6 bg-card shadow-lg rounded-lg p-4 border">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 brand-gradient-bg rounded-full flex items-center justify-center text-white font-bold">
            {mintedNFTs.length}
          </div>
          <div>
            <p className="text-sm font-medium">NFTs Collected</p>
            <p className="text-xs text-muted-foreground">{mintedNFTs.length} of {nfts.length}</p>
          </div>
        </div>
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full brand-gradient-bg"
            style={{ width: `${(mintedNFTs.length / nfts.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default NFTCollection;
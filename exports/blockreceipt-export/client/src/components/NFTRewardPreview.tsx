import React, { useState, useEffect } from 'react';
import { getRandomNFT } from '../data/nftData';
import { NFT } from '../types/nft';

interface NFTRewardPreviewProps {
  merchantName?: string;
  category?: string;
  total?: number;
}

const NFTRewardPreview: React.FC<NFTRewardPreviewProps> = ({ 
  merchantName, 
  category, 
  total = 0 
}) => {
  const [potentialRewards, setPotentialRewards] = useState<NFT[]>([]);
  
  // Determine which NFTs could be earned based on the receipt data
  useEffect(() => {
    // Generate potential rewards based on receipt data
    // This is just a simulation
    const newRewards: NFT[] = [];
    
    // Add a random NFT based on merchant category
    if (category?.toLowerCase().includes('fashion') || total >= 50) {
      const nft = getRandomNFT();
      if (nft.id.includes('cowboy')) {
        newRewards.push(nft);
      }
    }
    
    // Add a random NFT based on total
    if (total >= 100) {
      const nft = getRandomNFT();
      if (nft.id.includes('angel')) {
        newRewards.push(nft);
      }
    }
    
    // If no match, add at least one random NFT for preview purposes
    if (newRewards.length === 0 || !merchantName) {
      newRewards.push(getRandomNFT());
    }
    
    setPotentialRewards(newRewards);
  }, [merchantName, category, total]);
  
  return (
    <div className="bg-card shadow-sm rounded-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4">Potential NFT Rewards</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Upload your receipt to earn exclusive Bulldog NFTs. The rewards you earn depend on 
        merchant category, purchase amount, and more!
      </p>
      
      {potentialRewards.length > 0 ? (
        <div className="space-y-4">
          {potentialRewards.map((nft, index) => (
            <div key={`${nft.id}-${index}`} className="bg-card border rounded-lg p-3 flex items-center">
              <div className="h-16 w-16 rounded-md overflow-hidden mr-3 flex-shrink-0">
                <img src={nft.image} alt={nft.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <h4 className="font-medium">{nft.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">{nft.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
          <p className="text-muted-foreground italic">Upload a receipt to see potential rewards</p>
        </div>
      )}
    </div>
  );
};

export default NFTRewardPreview;
import { NFT } from '../types/nft';

// Generate 54 NFTs using your Object Storage images
export const generateObjectStorageNFTs = (): NFT[] => {
  const rarities: ('common' | 'uncommon' | 'rare' | 'epic' | 'legendary')[] = 
    ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  const merchants = ['dunkin', 'cvs', null];
  
  const characterNames = [
    'Digital Pioneer', 'Cyber Guardian', 'Blockchain Warrior', 'NFT Master', 'Crypto Knight',
    'Data Sentinel', 'Code Phantom', 'Pixel Hero', 'Network Defender', 'Token Keeper',
    'Digital Samurai', 'Cyber Ninja', 'Blockchain Sage', 'NFT Collector', 'Crypto Wizard',
    'Data Oracle', 'Code Breaker', 'Pixel Artist', 'Network Guardian', 'Token Master',
    'Digital Explorer', 'Cyber Mage', 'Blockchain Prophet', 'NFT Creator', 'Crypto Champion',
    'Data Architect', 'Code Weaver', 'Pixel Warrior', 'Network Shaman', 'Token Sage',
    'Digital Alchemist', 'Cyber Paladin', 'Blockchain Monk', 'NFT Innovator', 'Crypto Mystic',
    'Data Forger', 'Code Dancer', 'Pixel Shaman', 'Network Monk', 'Token Warrior',
    'Digital Merchant', 'Cyber Scholar', 'Blockchain Artist', 'NFT Pioneer', 'Crypto Sage',
    'Data Weaver', 'Code Master', 'Pixel Guardian', 'Network Oracle', 'Token Explorer',
    'Digital Voyager', 'Cyber Bard', 'Blockchain Scribe', 'NFT Visionary'
  ];

  const nfts: NFT[] = [];
  
  for (let i = 0; i < 54; i++) {
    const rarity = rarities[i % rarities.length];
    const merchant = merchants[i % merchants.length];
    const name = characterNames[i] || `Character #${i + 1}`;
    
    // Use actual Object Storage URL pattern based on your bucket
    const imageUrl = `/api/replit-storage/image/${i + 1}`;
    
    nfts.push({
      id: `storage-nft-${i + 1}`,
      name: name,
      description: `An exclusive digital character NFT with ${rarity} rarity. This unique collectible represents the cutting edge of blockchain art and gaming.`,
      image: imageUrl,
      rarity: rarity,
      merchant: merchant,
      attributes: [
        {
          trait_type: "Source",
          value: "Object Storage"
        },
        {
          trait_type: "Rarity",
          value: rarity.charAt(0).toUpperCase() + rarity.slice(1)
        },
        {
          trait_type: "Type",
          value: "Character"
        },
        {
          trait_type: "Generation",
          value: `Gen ${Math.floor(i / 10) + 1}`
        },
        {
          trait_type: "Power Level",
          value: (Math.floor(Math.random() * 100) + 1).toString()
        },
        ...(merchant ? [{
          trait_type: "Merchant",
          value: merchant === 'dunkin' ? 'Dunkin\'' : 'CVS'
        }] : []),
        {
          trait_type: "Element",
          value: ['Fire', 'Water', 'Earth', 'Air', 'Lightning'][i % 5]
        }
      ]
    });
  }
  
  return nfts;
};

export const objectStorageNFTs = generateObjectStorageNFTs();
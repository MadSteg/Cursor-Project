import { NFT } from '../types/nft';

// Sample NFT data for development
export const sampleNFTs: NFT[] = [
  {
    id: 'cowboy-bulldog-1',
    name: 'Cowboy Bulldog',
    description: 'A stylish bulldog wearing a cowboy hat. Earned from fashion purchases over $50.',
    image: 'https://i.imgur.com/vT4Ezde.png',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Category', value: 'Fashion' },
      { trait_type: 'Accessory', value: 'Cowboy Hat' },
      { trait_type: 'Background', value: 'Desert' },
      { trait_type: 'Rarity', value: 'Rare' }
    ]
  },
  {
    id: 'angel-bulldog-1',
    name: 'Angel Bulldog',
    description: 'A heavenly bulldog with a halo and wings. Earned from charitable donations over $100.',
    image: 'https://i.imgur.com/qTvZpBA.png',
    rarity: 'epic',
    attributes: [
      { trait_type: 'Category', value: 'Charity' },
      { trait_type: 'Accessory', value: 'Halo and Wings' },
      { trait_type: 'Background', value: 'Clouds' },
      { trait_type: 'Rarity', value: 'Epic' }
    ]
  },
  {
    id: 'social-bulldog-1',
    name: 'Social Bulldog',
    description: 'A party-loving bulldog with sunglasses. Earned from dining purchases over $30.',
    image: 'https://i.imgur.com/lQTy0Lq.png',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Category', value: 'Dining' },
      { trait_type: 'Accessory', value: 'Sunglasses' },
      { trait_type: 'Background', value: 'Party' },
      { trait_type: 'Rarity', value: 'Uncommon' }
    ]
  },
  {
    id: 'soccer-bulldog-1',
    name: 'Soccer Bulldog',
    description: 'An athletic bulldog with a soccer ball. Earned from sports purchases over $40.',
    image: 'https://i.imgur.com/9dRvmKd.png',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Category', value: 'Sports' },
      { trait_type: 'Accessory', value: 'Soccer Ball' },
      { trait_type: 'Background', value: 'Stadium' },
      { trait_type: 'Rarity', value: 'Uncommon' }
    ]
  },
  {
    id: 'tech-bulldog-1',
    name: 'Tech Bulldog',
    description: 'A tech-savvy bulldog with VR goggles. Earned from electronics purchases over $75.',
    image: 'https://i.imgur.com/HSzJrTy.png',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Category', value: 'Electronics' },
      { trait_type: 'Accessory', value: 'VR Goggles' },
      { trait_type: 'Background', value: 'Digital' },
      { trait_type: 'Rarity', value: 'Rare' }
    ]
  },
  {
    id: 'chef-bulldog-1',
    name: 'Chef Bulldog',
    description: 'A culinary bulldog with a chef hat. Earned from grocery purchases over $100.',
    image: 'https://i.imgur.com/dJSjEoA.png',
    rarity: 'common',
    attributes: [
      { trait_type: 'Category', value: 'Grocery' },
      { trait_type: 'Accessory', value: 'Chef Hat' },
      { trait_type: 'Background', value: 'Kitchen' },
      { trait_type: 'Rarity', value: 'Common' }
    ]
  },
  {
    id: 'travel-bulldog-1',
    name: 'Travel Bulldog',
    description: 'An adventurous bulldog with a backpack. Earned from travel purchases over $200.',
    image: 'https://i.imgur.com/Mib0BSB.png',
    rarity: 'legendary',
    attributes: [
      { trait_type: 'Category', value: 'Travel' },
      { trait_type: 'Accessory', value: 'Backpack' },
      { trait_type: 'Background', value: 'Mountains' },
      { trait_type: 'Rarity', value: 'Legendary' }
    ]
  },
  {
    id: 'artist-bulldog-1',
    name: 'Artist Bulldog',
    description: 'A creative bulldog with a beret and paintbrush. Earned from art supply purchases over $60.',
    image: 'https://i.imgur.com/xT7V7EG.png',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Category', value: 'Art' },
      { trait_type: 'Accessory', value: 'Beret and Paintbrush' },
      { trait_type: 'Background', value: 'Studio' },
      { trait_type: 'Rarity', value: 'Rare' }
    ]
  }
];

// Get a random NFT from the sample data
export const getRandomNFT = (): NFT => {
  const randomIndex = Math.floor(Math.random() * sampleNFTs.length);
  return sampleNFTs[randomIndex];
};

// Get sample minted NFTs (for demo purposes)
export const getSampleMintedNFTs = (): string[] => {
  // Return 3 random NFT IDs to simulate already minted NFTs
  return sampleNFTs
    .slice()
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(nft => nft.id);
};
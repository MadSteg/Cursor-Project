import { NFT } from '../types/nft';

// Function to get a random NFT from the collection
export const getRandomNFT = (): NFT => {
  const randomIndex = Math.floor(Math.random() * sampleNFTs.length);
  return sampleNFTs[randomIndex];
};

// Fixed set of bulldog NFTs with appropriate attributes and rarities
export const sampleNFTs: NFT[] = [
  {
    id: 'bulldog-1',
    name: 'Fancy Bulldog',
    description: 'A unique legendary BlockReceipt bulldog NFT with special traits.',
    image: 'https://placehold.co/400x400/FFD700/000?text=Legendary+Bulldog',
    rarity: 'legendary',
    attributes: [
      { trait_type: 'Accessory', value: 'Crown' },
      { trait_type: 'Clothing', value: 'Royal Robe' },
      { trait_type: 'Personality', value: 'Majestic' }
    ]
  },
  {
    id: 'bulldog-2',
    name: 'Rapper Bulldog',
    description: 'A unique epic BlockReceipt bulldog NFT with special traits.',
    image: 'https://placehold.co/400x400/9932CC/FFF?text=Epic+Bulldog',
    rarity: 'epic',
    attributes: [
      { trait_type: 'Accessory', value: 'Gold Chain' },
      { trait_type: 'Hat', value: 'Black Cap' },
      { trait_type: 'Personality', value: 'Cool' }
    ]
  },
  {
    id: 'bulldog-3',
    name: 'Police Bulldog',
    description: 'A unique rare BlockReceipt bulldog NFT with special traits.',
    image: 'https://placehold.co/400x400/4169E1/FFF?text=Rare+Bulldog',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Hat', value: 'Police Cap' },
      { trait_type: 'Clothing', value: 'Uniform' },
      { trait_type: 'Personality', value: 'Authoritative' }
    ]
  },
  {
    id: 'bulldog-4',
    name: 'Explorer Bulldog',
    description: 'A unique uncommon BlockReceipt bulldog NFT with special traits.',
    image: 'https://placehold.co/400x400/2E8B57/FFF?text=Uncommon+Bulldog',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Accessory', value: 'Sunglasses' },
      { trait_type: 'Hat', value: 'Safari Hat' },
      { trait_type: 'Personality', value: 'Explorer' }
    ]
  },
  {
    id: 'bulldog-5',
    name: 'Business Bulldog',
    description: 'A unique common BlockReceipt bulldog NFT with special traits.',
    image: 'https://placehold.co/400x400/777777/FFF?text=Common+Bulldog',
    rarity: 'common',
    attributes: [
      { trait_type: 'Accessory', value: 'Tie' },
      { trait_type: 'Clothing', value: 'Suit' },
      { trait_type: 'Personality', value: 'Professional' }
    ]
  },
  {
    id: 'bulldog-6',
    name: 'Social Bulldog',
    description: 'A unique common BlockReceipt bulldog NFT with special traits.',
    image: 'https://placehold.co/400x400/777777/FFF?text=Common+Bulldog',
    rarity: 'common',
    attributes: [
      { trait_type: 'Accessory', value: 'Beer' },
      { trait_type: 'Clothing', value: 'Casual' },
      { trait_type: 'Personality', value: 'Social' }
    ]
  },
  {
    id: 'bulldog-7',
    name: 'Baseball Bulldog',
    description: 'A unique common BlockReceipt bulldog NFT with special traits.',
    image: 'https://placehold.co/400x400/777777/FFF?text=Common+Bulldog',
    rarity: 'common',
    attributes: [
      { trait_type: 'Hat', value: 'Baseball Cap' },
      { trait_type: 'Clothing', value: 'Team Jersey' },
      { trait_type: 'Personality', value: 'Athletic' }
    ]
  },
  {
    id: 'bulldog-8',
    name: 'Outdoor Bulldog',
    description: 'A unique uncommon BlockReceipt bulldog NFT with special traits.',
    image: 'https://placehold.co/400x400/2E8B57/FFF?text=Uncommon+Bulldog',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Hat', value: 'Plaid Hat' },
      { trait_type: 'Clothing', value: 'Plaid Shirt' },
      { trait_type: 'Personality', value: 'Outdoorsy' }
    ]
  },
  {
    id: 'bulldog-9',
    name: 'Tourist Bulldog',
    description: 'A unique rare BlockReceipt bulldog NFT with special traits.',
    image: 'https://placehold.co/400x400/4169E1/FFF?text=Rare+Bulldog',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Accessory', value: 'Camera' },
      { trait_type: 'Hat', value: 'Sun Hat' },
      { trait_type: 'Personality', value: 'Curious' }
    ]
  },
  {
    id: 'bulldog-10',
    name: 'Godfather Bulldog',
    description: 'A unique epic BlockReceipt bulldog NFT with special traits.',
    image: 'https://placehold.co/400x400/9932CC/FFF?text=Epic+Bulldog',
    rarity: 'epic',
    attributes: [
      { trait_type: 'Accessory', value: 'Cigar' },
      { trait_type: 'Clothing', value: 'Italian Suit' },
      { trait_type: 'Personality', value: 'Powerful' }
    ]
  },
  {
    id: 'bulldog-11',
    name: 'Artistic Bulldog',
    description: 'A unique uncommon BlockReceipt bulldog NFT with special traits.',
    image: 'https://placehold.co/400x400/2E8B57/FFF?text=Uncommon+Bulldog',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Accessory', value: 'Paintbrush' },
      { trait_type: 'Hat', value: 'Beret' },
      { trait_type: 'Personality', value: 'Creative' }
    ]
  },
  {
    id: 'bulldog-12',
    name: 'Crypto Bulldog',
    description: 'A unique common BlockReceipt bulldog NFT with special traits.',
    image: 'https://placehold.co/400x400/777777/FFF?text=Common+Bulldog',
    rarity: 'common',
    attributes: [
      { trait_type: 'Accessory', value: 'Laptop' },
      { trait_type: 'Clothing', value: 'Hoodie' },
      { trait_type: 'Personality', value: 'Tech-Savvy' }
    ]
  }
];
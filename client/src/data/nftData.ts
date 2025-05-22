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
    name: 'Legendary Bulldog',
    description: 'A unique legendary BlockReceipt bulldog NFT with special traits.',
    image: 'https://img.freepik.com/free-vector/cute-french-bulldog-wearing-crown-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated_138676-4459.jpg?w=826&t=st=1716894249~exp=1716894849~hmac=e33d4dc63e7506a8a3a0c18ffc5d7a9f82a5f41e3f90ccac5e71ee2c2b39c31c',
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
    image: 'https://img.freepik.com/premium-vector/cool-bulldog-puppy-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium_138676-3734.jpg?w=826',
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
    image: 'https://img.freepik.com/premium-vector/cute-bulldog-police-cartoon-vector-icon-illustration-animal-job-icon-concept-isolated-premium-flat_138676-1591.jpg?w=826',
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
    image: 'https://img.freepik.com/premium-vector/cute-french-bulldog-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-flat_138676-4424.jpg?w=826',
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
    image: 'https://img.freepik.com/premium-vector/cute-french-bulldog-wearing-suit-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-flat_138676-3897.jpg?w=826',
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
    image: 'https://img.freepik.com/premium-vector/french-bulldog-drink-beer-cartoon-icon-illustration_138676-2268.jpg?w=826',
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
    image: 'https://img.freepik.com/premium-vector/french-bulldog-wearing-baseball-cap-cartoon_138676-2301.jpg?w=826',
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
    image: 'https://img.freepik.com/premium-vector/cute-french-bulldog-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-flat_138676-3933.jpg?w=826',
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
    image: 'https://img.freepik.com/premium-vector/cute-bulldog-vacation-cartoon-vector-icon-illustration-animal-travel-icon-concept-isolated-premium_138676-1557.jpg?w=826',
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
    image: 'https://img.freepik.com/premium-vector/cute-french-bulldog-mafia-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-flat_138676-3953.jpg?w=826',
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
    image: 'https://img.freepik.com/premium-vector/french-bulldog-painter-vector-icon-illustration-animal-job-icon-concept-isolated-premium-flat_138676-4212.jpg?w=826',
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
    image: 'https://img.freepik.com/premium-vector/cute-bulldog-hacker-cartoon-vector-icon-illustration-animal-technology-icon-concept-isolated-premium_138676-1626.jpg?w=826',
    rarity: 'common',
    attributes: [
      { trait_type: 'Accessory', value: 'Laptop' },
      { trait_type: 'Clothing', value: 'Hoodie' },
      { trait_type: 'Personality', value: 'Tech-Savvy' }
    ]
  }
];
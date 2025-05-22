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
    name: 'Royal Bulldog',
    description: 'A majestic bulldog wearing a golden crown. This legendary collectible represents the pinnacle of BlockReceipt rewards.',
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
    name: 'Cool Pup',
    description: 'This epic bulldog has swagger for days. With his cool demeanor and hip style, he is the most sought-after companion for urban adventures.',
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
    name: 'Officer Bulldog',
    description: 'Keeping the streets safe, this rare bulldog officer upholds the law with adorable authority. His badge shines almost as bright as his loyalty.',
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
    description: 'Ready for any adventure, this uncommon explorer bulldog is perfect for those who love the outdoors. His expressive face shows curiosity and excitement.',
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
    description: 'Dressed for success in his professional attire, this common bulldog means business. Perfect for receipt collectors who appreciate a touch of class.',
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
    description: 'This laid-back bulldog knows how to have a good time. With his favorite beverage in hand, he brings the party wherever he goes.',
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
    description: 'Sporting his team cap and ready for the big game, this athletic bulldog embodies the spirit of competition and team loyalty.',
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
    description: 'With his cozy outfit and friendly demeanor, this uncommon bulldog is ready for camping adventures and nature exploration.',
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
    description: 'This rare vacation-loving bulldog is all set for his tropical getaway. His happy expression shows he lives for adventure and new experiences.',
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
    description: 'This epic mafia-styled bulldog makes offers you cannot refuse. His sharp suit and confident demeanor command respect in the digital realm.',
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
    description: 'With paintbrush in hand, this creative bulldog brings artistic flair to your collection. His uncommon talent for expression makes him a unique addition.',
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
    description: 'Tech-savvy and blockchain-ready, this common bulldog represents the digital future of BlockReceipt. His hacker skills protect your digital assets.',
    image: 'https://img.freepik.com/premium-vector/cute-bulldog-hacker-cartoon-vector-icon-illustration-animal-technology-icon-concept-isolated-premium_138676-1626.jpg?w=826',
    rarity: 'common',
    attributes: [
      { trait_type: 'Accessory', value: 'Laptop' },
      { trait_type: 'Clothing', value: 'Hoodie' },
      { trait_type: 'Personality', value: 'Tech-Savvy' }
    ]
  }
];
import { NFT } from '../types/nft';

// Function to get a random NFT from the collection
export const getRandomNFT = (): NFT => {
  const randomIndex = Math.floor(Math.random() * sampleNFTs.length);
  return sampleNFTs[randomIndex];
};

// Fixed set of NFTs with appropriate attributes and rarities
export const sampleNFTs: NFT[] = [
  {
    id: 'nft-1',
    name: 'Milk Kitty',
    description: 'A cute spotted cat holding a carton of milk. This common collectible is perfect for cat lovers everywhere.',
    image: 'https://img.freepik.com/premium-vector/cute-cat-holding-milk-box-cartoon-illustration_138676-2662.jpg?w=826',
    rarity: 'common',
    attributes: [
      { trait_type: 'Animal', value: 'Cat' },
      { trait_type: 'Accessory', value: 'Milk Carton' },
      { trait_type: 'Personality', value: 'Playful' }
    ]
  },
  {
    id: 'nft-2',
    name: 'Fox & Friends',
    description: 'Adorable fox friends spending time together. This common collectible celebrates friendship in the animal kingdom.',
    image: 'https://img.freepik.com/free-vector/cute-fox-couple-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3642.jpg?w=826',
    rarity: 'common',
    attributes: [
      { trait_type: 'Animal', value: 'Fox' },
      { trait_type: 'Theme', value: 'Friendship' },
      { trait_type: 'Personality', value: 'Friendly' }
    ]
  },
  {
    id: 'nft-3',
    name: 'Gift Bunny',
    description: 'A cheerful white bunny holding a colorful gift box. This common collectible brings joy and celebration to your collection.',
    image: 'https://img.freepik.com/free-vector/cute-rabbit-holding-gift-box-cartoon-vector-icon-illustration-animal-object-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3343.jpg?w=826',
    rarity: 'common',
    attributes: [
      { trait_type: 'Animal', value: 'Bunny' },
      { trait_type: 'Accessory', value: 'Gift Box' },
      { trait_type: 'Personality', value: 'Cheerful' }
    ]
  },
  {
    id: 'nft-4',
    name: 'London Landmark',
    description: 'A beautiful silhouette of London featuring the iconic Big Ben and London Eye. This uncommon collectible celebrates famous world landmarks.',
    image: 'https://img.freepik.com/free-vector/london-skyline-silhouette-flat-style_23-2147767888.jpg?w=826',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Category', value: 'Landmark' },
      { trait_type: 'Location', value: 'London' },
      { trait_type: 'Style', value: 'Silhouette' }
    ]
  },
  {
    id: 'nft-5',
    name: 'Cool Cat',
    description: 'A stylish gray cat with sunglasses exuding confidence and cool vibes. This rare collectible is perfect for those who appreciate trendy characters.',
    image: 'https://img.freepik.com/free-vector/cute-cool-cat-wearing-sunglasses-cartoon-vector-icon-illustration-animal-fashion-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3667.jpg?w=826',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Animal', value: 'Cat' },
      { trait_type: 'Accessory', value: 'Sunglasses' },
      { trait_type: 'Personality', value: 'Cool' }
    ]
  },
  {
    id: 'nft-6',
    name: 'Sleepy Kitty',
    description: 'An adorable white cat with orange markings taking a peaceful nap. This epic collectible captures the serene beauty of our feline friends at rest.',
    image: 'https://img.freepik.com/free-vector/cute-cat-sleeping-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3498.jpg?w=826',
    rarity: 'epic',
    attributes: [
      { trait_type: 'Animal', value: 'Cat' },
      { trait_type: 'Action', value: 'Sleeping' },
      { trait_type: 'Personality', value: 'Peaceful' }
    ]
  },
  {
    id: 'nft-7',
    name: 'Rainbow Squid',
    description: 'A colorful orange squid with a playful personality holding a popsicle. This uncommon collectible brings underwater whimsy to your collection.',
    image: 'https://img.freepik.com/free-vector/cute-squid-eating-ice-cream-cartoon-vector-icon-illustration-animal-food-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3498.jpg?w=826',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Animal', value: 'Squid' },
      { trait_type: 'Accessory', value: 'Popsicle' },
      { trait_type: 'Personality', value: 'Playful' }
    ]
  },
  {
    id: 'nft-8',
    name: 'Surprised Cow',
    description: 'A wide-eyed cow with a surprised expression. This common collectible captures the innocent charm of farm animals in a delightful way.',
    image: 'https://img.freepik.com/free-vector/cute-cow-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3468.jpg?w=826',
    rarity: 'common',
    attributes: [
      { trait_type: 'Animal', value: 'Cow' },
      { trait_type: 'Expression', value: 'Surprised' },
      { trait_type: 'Personality', value: 'Innocent' }
    ]
  }
];
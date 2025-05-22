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
    name: 'Astro Donut',
    description: 'An astronaut floating on a delicious donut in space. This epic collectible brings a fun cosmic twist to your collection.',
    image: '/nft-art/space-1.png',
    rarity: 'epic',
    attributes: [
      { trait_type: 'Character', value: 'Astronaut' },
      { trait_type: 'Accessory', value: 'Donut' },
      { trait_type: 'Theme', value: 'Space' }
    ]
  },
  {
    id: 'nft-2',
    name: 'Cosmic Explorer',
    description: 'A cute astronaut floating through the cosmos with stars and planets. This rare collectible celebrates space exploration.',
    image: '/nft-art/space-2.png',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Character', value: 'Astronaut' },
      { trait_type: 'Theme', value: 'Space' },
      { trait_type: 'Accessory', value: 'Planet Balloon' }
    ]
  },
  {
    id: 'nft-3',
    name: 'Gift Bunny',
    description: 'A cheerful white bunny holding a colorful gift box. This common collectible brings joy and celebration to your collection.',
    image: '/nft-art/character-1.png',
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
    image: '/nft-art/celebration-1.png',
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
    description: 'A stylish digital smartwatch with fitness tracking capabilities. This rare collectible is perfect for tech enthusiasts.',
    image: '/nft-art/gadget-1.png',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Category', value: 'Technology' },
      { trait_type: 'Type', value: 'Smartwatch' },
      { trait_type: 'Style', value: 'Modern' }
    ]
  },
  {
    id: 'nft-6',
    name: 'Space Cat',
    description: 'An adorable cat with unique markings sitting by a trash can. This legendary collectible captures everyday pet charm with a twist.',
    image: '/nft-art/pet-1.png',
    rarity: 'legendary',
    attributes: [
      { trait_type: 'Animal', value: 'Cat' },
      { trait_type: 'Setting', value: 'Urban' },
      { trait_type: 'Personality', value: 'Curious' }
    ]
  },
  {
    id: 'nft-7',
    name: 'Ice Cream Squid',
    description: 'A cute green alien sitting on a blue planet. This uncommon collectible brings extraterrestrial whimsy to your collection.',
    image: '/nft-art/space-3.png',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Character', value: 'Alien' },
      { trait_type: 'Accessory', value: 'Planet' },
      { trait_type: 'Theme', value: 'Space' }
    ]
  },
  {
    id: 'nft-8',
    name: 'Milk Kitty',
    description: 'A bowl of delicious ramen with chopsticks. This common collectible celebrates food culture and culinary delights.',
    image: '/nft-art/food-1.png',
    rarity: 'common',
    attributes: [
      { trait_type: 'Category', value: 'Food' },
      { trait_type: 'Cuisine', value: 'Asian' },
      { trait_type: 'Dish', value: 'Ramen' }
    ]
  }
];
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
    image: 'https://img.freepik.com/free-vector/astronaut-sitting-planet-donut-cartoon-vector-icon-illustration-science-food-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3482.jpg',
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
    image: 'https://img.freepik.com/free-vector/astronaut-floating-with-planet-balloon-cartoon-vector-icon-illustration-science-technology-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3492.jpg',
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
    image: 'https://img.freepik.com/free-vector/cute-rabbit-holding-gift-box-cartoon-vector-icon-illustration-animal-object-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3343.jpg',
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
    image: 'https://img.freepik.com/free-vector/london-skyline-silhouette-flat-style_23-2147767888.jpg',
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
    image: 'https://img.freepik.com/free-vector/cute-cool-cat-wearing-sunglasses-cartoon-vector-icon-illustration-animal-fashion-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3667.jpg',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Animal', value: 'Cat' },
      { trait_type: 'Accessory', value: 'Sunglasses' },
      { trait_type: 'Personality', value: 'Cool' }
    ]
  },
  {
    id: 'nft-6',
    name: 'Space Cat',
    description: 'An adorable cat astronaut floating in space with a jetpack. This legendary collectible combines cute felines with cosmic adventure.',
    image: 'https://img.freepik.com/free-vector/astronaut-cat-playing-with-ball-wool-space-cartoon-vector-icon-illustration-animal-science-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3713.jpg',
    rarity: 'legendary',
    attributes: [
      { trait_type: 'Animal', value: 'Cat' },
      { trait_type: 'Outfit', value: 'Spacesuit' },
      { trait_type: 'Theme', value: 'Cosmic' }
    ]
  },
  {
    id: 'nft-7',
    name: 'Ice Cream Squid',
    description: 'A colorful orange squid with a playful personality enjoying an ice cream cone. This uncommon collectible brings underwater whimsy to your collection.',
    image: 'https://img.freepik.com/free-vector/cute-squid-eating-ice-cream-cartoon-vector-icon-illustration-animal-food-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3498.jpg',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Animal', value: 'Squid' },
      { trait_type: 'Accessory', value: 'Ice Cream' },
      { trait_type: 'Personality', value: 'Playful' }
    ]
  },
  {
    id: 'nft-8',
    name: 'Milk Kitty',
    description: 'A cute spotted cat holding a carton of milk. This common collectible is perfect for cat lovers everywhere.',
    image: 'https://img.freepik.com/premium-vector/cute-cat-holding-milk-box-cartoon-illustration_138676-2662.jpg',
    rarity: 'common',
    attributes: [
      { trait_type: 'Animal', value: 'Cat' },
      { trait_type: 'Accessory', value: 'Milk Carton' },
      { trait_type: 'Personality', value: 'Playful' }
    ]
  }
];
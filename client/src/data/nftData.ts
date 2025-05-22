import { NFT, NFTRarity } from '../types/nft';

// Rarity levels for filtering
export const rarityLevels = [
  { name: 'common', color: 'gray-600' },
  { name: 'uncommon', color: 'green-600' },
  { name: 'rare', color: 'blue-600' },
  { name: 'epic', color: 'purple-600' },
  { name: 'legendary', color: 'yellow-600' }
];

// Function to get a random NFT from the collection
export const getRandomNFT = (): NFT => {
  const randomIndex = Math.floor(Math.random() * sampleNFTs.length);
  return sampleNFTs[randomIndex];
};

// Merchant-specific NFT collections
export const merchantNFTs = {
  dunkin: [
    {
      id: 'dunkin-1',
      name: 'Glazed Prism Donut',
      description: 'A vibrant glazed donut with prismatic colors that shift and shimmer. This epic collectible celebrates the classic Dunkin\' favorite with a futuristic twist.',
      image: 'https://img.freepik.com/free-vector/cute-donut-cartoon-vector-icon-illustration-food-sweet-icon-concept-isolated-premium-vector-flat_138676-4756.jpg',
      rarity: 'epic' as NFTRarity,
      merchant: 'dunkin',
      attributes: [
        { trait_type: 'Type', value: 'Donut' },
        { trait_type: 'Flavor', value: 'Glazed' },
        { trait_type: 'Style', value: 'Prism' }
      ]
    },
    {
      id: 'dunkin-2',
      name: 'Neon Latte Swirl',
      description: 'A steaming hot latte with mesmerizing neon swirls. This rare collectible captures the essence of Dunkin\'s signature coffee experience.',
      image: 'https://img.freepik.com/free-vector/cute-coffee-cup-cartoon-vector-icon-illustration-drink-food-icon-concept-isolated-premium-vector_138676-4616.jpg',
      rarity: 'rare' as NFTRarity,
      merchant: 'dunkin',
      attributes: [
        { trait_type: 'Type', value: 'Coffee' },
        { trait_type: 'Flavor', value: 'Latte' },
        { trait_type: 'Style', value: 'Neon Swirl' }
      ]
    },
    {
      id: 'dunkin-3',
      name: 'Electric Iced Coffee',
      description: 'A refreshing iced coffee with electric blue energy. This uncommon collectible represents the perfect cold brew experience.',
      image: 'https://img.freepik.com/free-vector/cute-iced-coffee-cartoon-vector-icon-illustration-drink-food-icon-concept-isolated-premium-vector_138676-4712.jpg',
      rarity: 'uncommon' as NFTRarity,
      merchant: 'dunkin',
      attributes: [
        { trait_type: 'Type', value: 'Iced Coffee' },
        { trait_type: 'Temperature', value: 'Cold' },
        { trait_type: 'Style', value: 'Electric' }
      ]
    },
    {
      id: 'dunkin-4',
      name: 'Spectrum Sausage Sandwich',
      description: 'A delicious breakfast sandwich with spectrum colors that dance across its surface. This legendary collectible is the ultimate Dunkin\' breakfast experience.',
      image: 'https://img.freepik.com/free-vector/cute-sandwich-cartoon-vector-icon-illustration-food-meal-icon-concept-isolated-premium-vector-flat_138676-4618.jpg',
      rarity: 'legendary',
      merchant: 'dunkin',
      attributes: [
        { trait_type: 'Type', value: 'Sandwich' },
        { trait_type: 'Protein', value: 'Sausage' },
        { trait_type: 'Style', value: 'Spectrum' }
      ]
    }
  ],
  cvs: [
    {
      id: 'cvs-1',
      name: 'Health Potion',
      description: 'A magical health potion from CVS Pharmacy. This rare collectible represents wellness and care.',
      image: 'https://img.freepik.com/free-vector/cute-potion-bottle-cartoon-vector-icon-illustration-science-object-icon-concept-isolated-premium_138676-4523.jpg',
      rarity: 'rare',
      merchant: 'cvs',
      attributes: [
        { trait_type: 'Category', value: 'Health' },
        { trait_type: 'Type', value: 'Potion' },
        { trait_type: 'Effect', value: 'Healing' }
      ]
    },
    {
      id: 'cvs-2',
      name: 'Vitamin Shield',
      description: 'A protective vitamin shield that glows with nutritional power. This epic collectible embodies CVS\'s commitment to health.',
      image: 'https://img.freepik.com/free-vector/cute-shield-cartoon-vector-icon-illustration-security-object-icon-concept-isolated-premium-vector_138676-4441.jpg',
      rarity: 'epic',
      merchant: 'cvs',
      attributes: [
        { trait_type: 'Category', value: 'Wellness' },
        { trait_type: 'Type', value: 'Shield' },
        { trait_type: 'Benefit', value: 'Protection' }
      ]
    }
  ]
};

// All NFTs combined for backwards compatibility
export const sampleNFTs: NFT[] = [
  ...merchantNFTs.dunkin,
  ...merchantNFTs.cvs,
  {
    id: 'nft-1',
    name: 'Astro Donut',
    description: 'An astronaut floating on a delicious donut in space. This epic collectible brings a fun cosmic twist to your collection.',
    image: 'https://img.freepik.com/free-vector/astronaut-sitting-planet-donut-cartoon-vector-icon-illustration-science-food-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3482.jpg',
    rarity: 'epic' as NFTRarity,
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
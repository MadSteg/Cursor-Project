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
    name: 'Space Explorer',
    description: 'A cute astronaut floating in a cosmic tube. This legendary collectible represents the pinnacle of BlockReceipt rewards.',
    image: 'https://img.freepik.com/free-vector/astronaut-floating-tube-cartoon-icon-illustration-science-technology-icon-concept-isolated-flat-cartoon-style_138676-2150.jpg?w=826',
    rarity: 'legendary',
    attributes: [
      { trait_type: 'Accessory', value: 'Helmet' },
      { trait_type: 'Environment', value: 'Space' },
      { trait_type: 'Personality', value: 'Adventurous' }
    ]
  },
  {
    id: 'nft-2',
    name: 'Cat & Friend',
    description: 'An adorable gray cat cuddling with its blue plushie friend. This epic collectible shows the special bond between companions.',
    image: 'https://img.freepik.com/free-vector/cute-cat-hugging-dinosaur-doll-cartoon-vector-icon-illustration-animal-object-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3977.jpg?w=826',
    rarity: 'epic',
    attributes: [
      { trait_type: 'Animal', value: 'Cat' },
      { trait_type: 'Accessory', value: 'Plushie' },
      { trait_type: 'Personality', value: 'Affectionate' }
    ]
  },
  {
    id: 'nft-3',
    name: 'Baseball Star',
    description: 'A rare baseball-themed collectible featuring a bat and glove against a vibrant blue background. Perfect for sports enthusiasts.',
    image: 'https://img.freepik.com/free-vector/baseball-bat-glove-ball-cartoon-icon-illustration-sport-baseball-icon-concept-isolated-flat-cartoon-style_138676-2154.jpg?w=826',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Sport', value: 'Baseball' },
      { trait_type: 'Equipment', value: 'Bat and Glove' },
      { trait_type: 'Theme', value: 'Athletics' }
    ]
  },
  {
    id: 'nft-4',
    name: 'Moon Pioneer',
    description: 'An astronaut planting a flag on the moon. This uncommon explorer is ready for interstellar adventures beyond Earth.',
    image: 'https://img.freepik.com/free-vector/astronaut-standing-moon-with-flag-cartoon-vector-icon-illustration-science-technology-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3451.jpg?w=826',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Accessory', value: 'Flag' },
      { trait_type: 'Environment', value: 'Moon' },
      { trait_type: 'Personality', value: 'Explorer' }
    ]
  },
  {
    id: 'nft-5',
    name: 'Unicorn Dreamer',
    description: 'A magical rainbow unicorn with a playful expression. This common collectible brings color and joy to any digital collection.',
    image: 'https://img.freepik.com/free-vector/cute-unicorn-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3930.jpg?w=826',
    rarity: 'common',
    attributes: [
      { trait_type: 'Creature', value: 'Unicorn' },
      { trait_type: 'Feature', value: 'Rainbow Mane' },
      { trait_type: 'Personality', value: 'Magical' }
    ]
  },
  {
    id: 'nft-6',
    name: 'Pizza Sloth',
    description: 'A laid-back sloth enjoying a slice of pizza. This common collectible represents the perfect lazy day with comfort food.',
    image: 'https://img.freepik.com/free-vector/cute-sloth-eating-pizza-cartoon-vector-icon-illustration-animal-food-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3558.jpg?w=826',
    rarity: 'common',
    attributes: [
      { trait_type: 'Animal', value: 'Sloth' },
      { trait_type: 'Food', value: 'Pizza' },
      { trait_type: 'Personality', value: 'Relaxed' }
    ]
  },
  {
    id: 'nft-7',
    name: 'Burger Bear',
    description: 'A cute bear holding a delicious burger. This common collectible celebrates the simple joy of good food.',
    image: 'https://img.freepik.com/free-vector/cute-bear-holding-burger-cartoon-vector-icon-illustration-animal-food-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3793.jpg?w=826',
    rarity: 'common',
    attributes: [
      { trait_type: 'Animal', value: 'Bear' },
      { trait_type: 'Food', value: 'Burger' },
      { trait_type: 'Personality', value: 'Hungry' }
    ]
  },
  {
    id: 'nft-8',
    name: 'Forest Fox',
    description: 'A clever fox in its natural forest environment. This uncommon collectible represents wisdom and adaptability in the wild.',
    image: 'https://img.freepik.com/free-vector/cute-fox-holding-leaf-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3518.jpg?w=826',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Animal', value: 'Fox' },
      { trait_type: 'Environment', value: 'Forest' },
      { trait_type: 'Personality', value: 'Clever' }
    ]
  },
  {
    id: 'nft-9',
    name: 'Beach Penguin',
    description: 'A rare penguin enjoying a tropical vacation. This collectible captures the joy of exploring environments outside your comfort zone.',
    image: 'https://img.freepik.com/free-vector/cute-penguin-wearing-cap-summer-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-4234.jpg?w=826',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Animal', value: 'Penguin' },
      { trait_type: 'Accessory', value: 'Beach Ball' },
      { trait_type: 'Personality', value: 'Playful' }
    ]
  },
  {
    id: 'nft-10',
    name: 'Mafia Cat',
    description: 'A sophisticated cat dressed in formal attire with a stern expression. This epic collectible exudes power and commands respect.',
    image: 'https://img.freepik.com/free-vector/cute-cat-mafia-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-4074.jpg?w=826',
    rarity: 'epic',
    attributes: [
      { trait_type: 'Animal', value: 'Cat' },
      { trait_type: 'Clothing', value: 'Suit' },
      { trait_type: 'Personality', value: 'Powerful' }
    ]
  },
  {
    id: 'nft-11',
    name: 'Artist Panda',
    description: 'A creative panda with a paintbrush and palette. This uncommon collectible celebrates artistic expression and creativity.',
    image: 'https://img.freepik.com/free-vector/cute-panda-with-paint-palette-cartoon-vector-icon-illustration-animal-education-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3670.jpg?w=826',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Animal', value: 'Panda' },
      { trait_type: 'Accessory', value: 'Paintbrush' },
      { trait_type: 'Personality', value: 'Creative' }
    ]
  },
  {
    id: 'nft-12',
    name: 'Tech Raccoon',
    description: 'A tech-savvy raccoon with a laptop and hoodie. This common collectible represents the digital future of BlockReceipt.',
    image: 'https://img.freepik.com/free-vector/cute-raccoon-with-laptop-cartoon-vector-icon-illustration-animal-technology-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3874.jpg?w=826',
    rarity: 'common',
    attributes: [
      { trait_type: 'Animal', value: 'Raccoon' },
      { trait_type: 'Accessory', value: 'Laptop' },
      { trait_type: 'Personality', value: 'Tech-Savvy' }
    ]
  }
];
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

// All NFTs combined for backwards compatibility
export const sampleNFTs: NFT[] = [
  {
    id: 'nft-1',
    name: 'Space Cat Astronaut',
    description: 'A cute orange tabby cat wearing a tiny astronaut helmet exploring the cosmos. This epic collectible brings space adventure to your collection.',
    image: 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=🐱‍🚀',
    rarity: 'epic' as NFTRarity,
    attributes: [
      { trait_type: 'Animal', value: 'Cat' },
      { trait_type: 'Outfit', value: 'Astronaut Suit' },
      { trait_type: 'Theme', value: 'Space' }
    ]
  },
  {
    id: 'nft-2',
    name: 'Robot Butler',
    description: 'A friendly green robot with antenna and big eyes helping with daily tasks. This rare collectible represents the future of shopping assistance.',
    image: 'https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=🤖',
    rarity: 'rare' as NFTRarity,
    attributes: [
      { trait_type: 'Type', value: 'Robot' },
      { trait_type: 'Job', value: 'Butler' },
      { trait_type: 'Personality', value: 'Helpful' }
    ]
  },
  {
    id: 'nft-3',
    name: 'Rainbow Unicorn',
    description: 'A magical white unicorn with a glowing horn and rainbow mane spreading joy. This common collectible brings magic to everyday purchases.',
    image: 'https://via.placeholder.com/400x400/FFE66D/FFFFFF?text=🦄',
    rarity: 'common' as NFTRarity,
    attributes: [
      { trait_type: 'Creature', value: 'Unicorn' },
      { trait_type: 'Magic', value: 'Rainbow' },
      { trait_type: 'Horn', value: 'Glowing' }
    ]
  },
  {
    id: 'nft-4',
    name: 'Bubble Bear',
    description: 'A cheerful polar bear blowing colorful soap bubbles with a smile. This uncommon collectible adds playful fun to your NFT collection.',
    image: 'https://via.placeholder.com/400x400/A8E6CF/FFFFFF?text=🐻',
    rarity: 'uncommon' as NFTRarity,
    attributes: [
      { trait_type: 'Animal', value: 'Bear' },
      { trait_type: 'Activity', value: 'Blowing Bubbles' },
      { trait_type: 'Mood', value: 'Cheerful' }
    ]
  },
  {
    id: 'nft-5',
    name: 'Crystal Wizard',
    description: 'A wise wizard with a long beard holding a glowing crystal staff. This rare collectible casts spells of savings and smart shopping.',
    image: 'https://via.placeholder.com/400x400/C7CEEA/FFFFFF?text=🧙‍♂️',
    rarity: 'rare' as NFTRarity,
    attributes: [
      { trait_type: 'Class', value: 'Wizard' },
      { trait_type: 'Weapon', value: 'Crystal Staff' },
      { trait_type: 'Magic', value: 'Savings Spells' }
    ]
  },
  {
    id: 'nft-6',
    name: 'Golden Phoenix',
    description: 'A majestic phoenix with golden feathers rising from flames of prosperity. This legendary collectible represents rebirth and endless possibilities.',
    image: 'https://via.placeholder.com/400x400/FFD93D/FFFFFF?text=🔥🐦',
    rarity: 'legendary' as NFTRarity,
    attributes: [
      { trait_type: 'Creature', value: 'Phoenix' },
      { trait_type: 'Element', value: 'Golden Fire' },
      { trait_type: 'Power', value: 'Rebirth' }
    ]
  },
  {
    id: 'nft-7',
    name: 'Ninja Puppy',
    description: 'A cute puppy wearing ninja gear with throwing stars, ready for stealth shopping missions. This uncommon collectible brings adventure to your purchases.',
    image: 'https://via.placeholder.com/400x400/6BCF7F/FFFFFF?text=🐶⚔️',
    rarity: 'uncommon' as NFTRarity,
    attributes: [
      { trait_type: 'Animal', value: 'Puppy' },
      { trait_type: 'Class', value: 'Ninja' },
      { trait_type: 'Skill', value: 'Stealth' }
    ]
  },
  {
    id: 'nft-8',
    name: 'Moonbeam Owl',
    description: 'A wise owl perched on a crescent moon with sparkly feathers that glow in moonlight. This common collectible watches over your night shopping.',
    image: 'https://via.placeholder.com/400x400/B4A7D6/FFFFFF?text=🦉🌙',
    rarity: 'common' as NFTRarity,
    attributes: [
      { trait_type: 'Bird', value: 'Owl' },
      { trait_type: 'Element', value: 'Moonbeam' },
      { trait_type: 'Role', value: 'Guardian' }
    ]
  }
];
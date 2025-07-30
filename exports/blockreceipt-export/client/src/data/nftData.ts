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
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=spacecat&backgroundColor=1e1b4b&scale=80',
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
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=robotbutler&backgroundColor=4ecdc4&scale=80',
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
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=unicorn&backgroundColor=ffe66d&scale=80',
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
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=bubblebear&backgroundColor=a8e6cf&scale=80',
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
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=crystalwizard&backgroundColor=c7ceea&scale=80',
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
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=goldenphoenix&backgroundColor=ffd93d&scale=80',
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
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=ninjapuppy&backgroundColor=6bcf7f&scale=80',
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
    image: 'https://api.dicebear.com/7.x/bottts/svg?seed=moonbeamowl&backgroundColor=b4a7d6&scale=80',
    rarity: 'common' as NFTRarity,
    attributes: [
      { trait_type: 'Bird', value: 'Owl' },
      { trait_type: 'Element', value: 'Moonbeam' },
      { trait_type: 'Role', value: 'Guardian' }
    ]
  }
];

// Function to get sample minted NFTs (for compatibility with NFTBrowser)
export const getSampleMintedNFTs = () => {
  return sampleNFTs.slice(0, 4); // Return first 4 NFTs as "minted" examples
};
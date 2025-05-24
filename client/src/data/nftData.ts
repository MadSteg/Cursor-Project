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
      name: 'Rainbow Donut Wizard',
      description: 'A cute magical donut with sparkly rainbow glaze casting sweet spells. This epic collectible brings enchantment to your Dunkin\' experience.',
      image: 'https://cdn.pixabay.com/photo/2021/01/15/17/01/doughnut-5919219_1280.png',
      rarity: 'epic' as NFTRarity,
      merchant: 'dunkin',
      attributes: [
        { trait_type: 'Type', value: 'Donut' },
        { trait_type: 'Power', value: 'Magic' },
        { trait_type: 'Style', value: 'Rainbow' }
      ]
    },
    {
      id: 'dunkin-2',
      name: 'Coffee Bean Astronaut',
      description: 'An adorable coffee bean in a tiny spacesuit exploring the coffee cosmos. This rare collectible represents your journey through Dunkin\'s universe.',
      image: 'https://cdn.pixabay.com/photo/2020/10/23/18/05/coffee-5679700_1280.png',
      rarity: 'rare' as NFTRarity,
      merchant: 'dunkin',
      attributes: [
        { trait_type: 'Character', value: 'Coffee Bean' },
        { trait_type: 'Outfit', value: 'Spacesuit' },
        { trait_type: 'Theme', value: 'Space' }
      ]
    },
    {
      id: 'dunkin-3',
      name: 'Iced Coffee Penguin',
      description: 'A cheerful penguin sliding on an iced coffee wave with a big smile. This uncommon collectible celebrates cool refreshing drinks.',
      image: 'https://cdn.pixabay.com/photo/2021/02/03/13/40/penguin-5978378_1280.png',
      rarity: 'uncommon' as NFTRarity,
      merchant: 'dunkin',
      attributes: [
        { trait_type: 'Animal', value: 'Penguin' },
        { trait_type: 'Drink', value: 'Iced Coffee' },
        { trait_type: 'Mood', value: 'Happy' }
      ]
    },
    {
      id: 'dunkin-4',
      name: 'Breakfast Dragon',
      description: 'A tiny friendly dragon breathing maple syrup flames while protecting a breakfast sandwich. This legendary collectible guards your morning fuel.',
      image: 'https://cdn.pixabay.com/photo/2020/12/27/18/51/dragon-5862090_1280.png',
      rarity: 'legendary' as NFTRarity,
      merchant: 'dunkin',
      attributes: [
        { trait_type: 'Creature', value: 'Dragon' },
        { trait_type: 'Breath', value: 'Maple Syrup' },
        { trait_type: 'Protects', value: 'Breakfast' }
      ]
    }
  ],
  cvs: [
    {
      id: 'cvs-1',
      name: 'Vitamin Fairy',
      description: 'A tiny fairy with rainbow wings carrying a magical vitamin bottle that sparkles with health. This rare collectible brings wellness magic to your day.',
      image: 'https://cdn.pixabay.com/photo/2021/01/30/12/19/fairy-5964718_1280.png',
      rarity: 'rare' as NFTRarity,
      merchant: 'cvs',
      attributes: [
        { trait_type: 'Being', value: 'Fairy' },
        { trait_type: 'Item', value: 'Vitamin' },
        { trait_type: 'Power', value: 'Health Magic' }
      ]
    },
    {
      id: 'cvs-2',
      name: 'Bandage Bear Doctor',
      description: 'A cute teddy bear wearing a doctor coat with a stethoscope and healing bandages. This epic collectible represents care and comfort from CVS.',
      image: 'https://cdn.pixabay.com/photo/2020/05/17/12/31/teddy-bear-5179181_1280.png',
      rarity: 'epic' as NFTRarity,
      merchant: 'cvs',
      attributes: [
        { trait_type: 'Animal', value: 'Bear' },
        { trait_type: 'Profession', value: 'Doctor' },
        { trait_type: 'Specialty', value: 'Healing' }
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
    name: 'Space Cat Astronaut',
    description: 'A cute orange tabby cat wearing a tiny astronaut helmet exploring the cosmos. This epic collectible brings space adventure to your collection.',
    image: 'https://cdn.pixabay.com/photo/2021/08/04/13/06/software-developer-6521720_1280.png',
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
    image: 'https://cdn.pixabay.com/photo/2021/01/30/12/19/robot-5964717_1280.png',
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
    image: 'https://cdn.pixabay.com/photo/2021/02/19/11/43/unicorn-6030176_1280.png',
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
    image: 'https://cdn.pixabay.com/photo/2020/12/15/16/25/bear-5834347_1280.png',
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
    image: 'https://cdn.pixabay.com/photo/2021/01/04/06/25/wizard-5886422_1280.png',
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
    image: 'https://cdn.pixabay.com/photo/2020/10/11/09/25/phoenix-5645819_1280.png',
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
    image: 'https://cdn.pixabay.com/photo/2021/02/03/13/40/dog-5978377_1280.png',
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
    image: 'https://cdn.pixabay.com/photo/2020/12/08/22/13/owl-5817043_1280.png',
    rarity: 'common' as NFTRarity,
    attributes: [
      { trait_type: 'Bird', value: 'Owl' },
      { trait_type: 'Element', value: 'Moonbeam' },
      { trait_type: 'Role', value: 'Guardian' }
    ]
  }
];
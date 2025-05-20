import { NFT } from '../types/nft';

// Sample NFT data for development with original images
export const sampleNFTs: NFT[] = [
  {
    id: 'bulldog-cowboy',
    name: 'Cowboy Bulldog',
    description: 'A cool cowboy bulldog with a stylish hat and plaid shirt. Earned from fashion purchases over $50.',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.19 AM.png',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Outfit', value: 'Cowboy' },
      { trait_type: 'Hat', value: 'Cowboy Hat' },
      { trait_type: 'Personality', value: 'Adventurous' }
    ]
  },
  {
    id: 'bulldog-hoodie',
    name: 'Hoodie Bulldog',
    description: 'A relaxed bulldog wearing a comfortable green hoodie. Perfect for casual purchases at convenience stores.',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.25 AM.png',
    rarity: 'common',
    attributes: [
      { trait_type: 'Outfit', value: 'Hoodie' },
      { trait_type: 'Hat', value: 'Hood' },
      { trait_type: 'Personality', value: 'Chill' }
    ]
  },
  {
    id: 'bulldog-tophat',
    name: 'Dapper Bulldog',
    description: 'An elegant bulldog with a top hat and bow tie. Earned from luxury purchases over $150.',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.32 AM.png',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Outfit', value: 'Striped Shirt' },
      { trait_type: 'Hat', value: 'Top Hat' },
      { trait_type: 'Accessory', value: 'Bow Tie' },
      { trait_type: 'Personality', value: 'Sophisticated' }
    ]
  },
  {
    id: 'bulldog-angel',
    name: 'Angel Bulldog',
    description: 'A heavenly bulldog with angel wings and a halo. Earned from charitable donations over $100.',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.27.03 AM.png',
    rarity: 'legendary',
    attributes: [
      { trait_type: 'Outfit', value: 'Striped Shirt' },
      { trait_type: 'Accessory', value: 'Angel Wings' },
      { trait_type: 'Accessory', value: 'Halo' },
      { trait_type: 'Personality', value: 'Pure' }
    ]
  },
  {
    id: 'bulldog-cow',
    name: 'Cow Bulldog',
    description: 'A bulldog with cow spots and small horns. Earned from grocery shopping at farmers markets.',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.43 AM.png',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Outfit', value: 'Casual' },
      { trait_type: 'Pattern', value: 'Cow Spots' },
      { trait_type: 'Accessory', value: 'Horns' },
      { trait_type: 'Personality', value: 'Playful' }
    ]
  },
  {
    id: 'bulldog-newsboy',
    name: 'Newsboy Bulldog',
    description: 'A vintage-styled bulldog with a classic newsboy cap. Earned from magazine or book purchases.',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.49 AM.png',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Outfit', value: 'Jacket' },
      { trait_type: 'Hat', value: 'Newsboy Cap' },
      { trait_type: 'Personality', value: 'Classic' }
    ]
  },
  {
    id: 'bulldog-beer',
    name: 'Social Bulldog',
    description: 'A friendly bulldog enjoying a cold beer. Earned from purchases at bars and restaurants.',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.53 AM.png',
    rarity: 'common',
    attributes: [
      { trait_type: 'Outfit', value: 'Jersey' },
      { trait_type: 'Accessory', value: 'Beer Mug' },
      { trait_type: 'Personality', value: 'Social' }
    ]
  },
  {
    id: 'bulldog-stripes',
    name: 'Striped Bulldog',
    description: 'A sporty bulldog in a green and white striped jersey. Earned from purchases at sporting events.',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.25.54 AM.png',
    rarity: 'common',
    attributes: [
      { trait_type: 'Outfit', value: 'Striped Jersey' },
      { trait_type: 'Team', value: 'Green Stars' },
      { trait_type: 'Personality', value: 'Sporty' }
    ]
  },
  {
    id: 'bulldog-soccer',
    name: 'Soccer Bulldog',
    description: 'A sporty bulldog with a soccer ball and athletic jersey. Earned from sporting goods purchases over $40.',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.00 AM.png',
    rarity: 'uncommon',
    attributes: [
      { trait_type: 'Outfit', value: 'Soccer Jersey' },
      { trait_type: 'Hat', value: 'Cap' },
      { trait_type: 'Accessory', value: 'Soccer Ball' },
      { trait_type: 'Personality', value: 'Athletic' }
    ]
  },
  {
    id: 'bulldog-casual',
    name: 'Urban Bulldog',
    description: 'A city-dwelling bulldog with a casual blue outfit. Earned from urban coffee shop purchases.',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.06 AM.png',
    rarity: 'common',
    attributes: [
      { trait_type: 'Outfit', value: 'Blue Sweater' },
      { trait_type: 'Hat', value: 'Beanie' },
      { trait_type: 'Personality', value: 'Urban' }
    ]
  },
  {
    id: 'bulldog-captain',
    name: 'Captain Bulldog',
    description: 'A distinguished bulldog in a naval captain uniform. Earned from travel purchases over $200.',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.57 AM.png',
    rarity: 'epic',
    attributes: [
      { trait_type: 'Outfit', value: 'Naval Uniform' },
      { trait_type: 'Hat', value: 'Captain Hat' },
      { trait_type: 'Rank', value: 'Captain' },
      { trait_type: 'Personality', value: 'Authoritative' }
    ]
  },
  {
    id: 'bulldog-dad',
    name: 'Daddy Bulldog',
    description: 'A caring bulldog dad with his bulldog teddy. Earned from toy or gift purchases for family.',
    image: '/attached_assets/Screenshot 2025-05-20 at 12.26.12 AM.png',
    rarity: 'rare',
    attributes: [
      { trait_type: 'Outfit', value: 'Striped Jersey' },
      { trait_type: 'Accessory', value: 'Teddy Bear' },
      { trait_type: 'Personality', value: 'Caring' }
    ]
  },
];

// Get a random NFT from the sample data
export const getRandomNFT = (): NFT => {
  const randomIndex = Math.floor(Math.random() * sampleNFTs.length);
  return sampleNFTs[randomIndex];
};

// Get sample minted NFTs (for demo purposes)
export const getSampleMintedNFTs = (): string[] => {
  // Return 3 random NFT IDs to simulate already minted NFTs
  return sampleNFTs
    .slice()
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(nft => nft.id);
};
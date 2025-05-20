import { NFT } from '../types/nft';

// Sample NFT data for development with original images
export const sampleNFTs: NFT[] = [
  {
    id: 'bulldog-cowboy',
    name: 'Cowboy Bulldog',
    description: 'A cool cowboy bulldog with a stylish hat and plaid shirt.',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmNWYzZTYiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMjAiIHI9IjYwIiBmaWxsPSIjYTk3MTQyIi8+PHBhdGggZD0iTSA5MCA4NSBRIDE1MCA1NSAyMTAgODUgTCAyMjAgNzUgUSAxNTAgNDAgODAgNzUgWiIgZmlsbD0iIzhCNDUxMyIvPjxwYXRoIGQ9Ik0gODUgODUgUSAxNTAgMTAwIDIxNSA4NSBMIDI0MCA3NSBRIDE1MCA5MCA4MCA3NSBaIiBmaWxsPSIjYTA1MjJkIi8+PHJlY3QgeD0iMTIwIiB5PSIxNTAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2Q0NmE2YSIvPjxjaXJjbGUgY3g9IjEyMCIgY3k9IjExMCIgcj0iMTAiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMTgwIiBjeT0iMTEwIiByPSIxMCIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSIxMTAiIHI9IjUiIGZpbGw9ImJsYWNrIi8+PGNpcmNsZSBjeD0iMTgwIiBjeT0iMTEwIiByPSI1IiBmaWxsPSJibGFjayIvPjxlbGxpcHNlIGN4PSIxNTAiIGN5PSIxNDAiIHJ4PSIyNSIgcnk9IjEwIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iMTUwIiB5PSIyMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyI+Q293Ym95IEJ1bGxkb2c8L3RleHQ+PHRleHQgeD0iMTUwIiB5PSIyNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2E1MmEyYSI+UmFyZTwvdGV4dD48L3N2Zz4=',
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
    description: 'A relaxed bulldog wearing a comfortable green hoodie.',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmNWY4ZjUiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMjAiIHI9IjYwIiBmaWxsPSIjYjVhODkwIi8+PHBhdGggZD0iTSA5MCAxMjAgUSAxNTAgMTQwIDIxMCAxMjAgTCAyMTUgMTQwIFEgMTUwIDE2MCA4NSAxNDAgWiIgZmlsbD0iIzRDQUY1MCIvPjxwYXRoIGQ9Ik0gMTEwIDE0MCBRIDE1MCAxNjAgMTkwIDE0MCBMIDE5MCAyMDAgUSAxNTAgMTgwIDExMCAyMDAgWiIgZmlsbD0iIzRDQUY1MCIvPjxwYXRoIGQ9Ik0gMTIwIDkwIFEgMTUwIDYwIDE4MCwgOTAgTCAxODUgMTEwIFEgMTUwIDgwIDExNSAxMTAgWiIgZmlsbD0iIzRDQUY1MCIvPjxjaXJjbGUgY3g9IjEyMCIgY3k9IjExMCIgcj0iMTAiIGZpbGw9IndoaXRlIi8+PGNpcmNsZSBjeD0iMTgwIiBjeT0iMTEwIiByPSIxMCIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxMjAiIGN5PSIxMTAiIHI9IjUiIGZpbGw9ImJsYWNrIi8+PGNpcmNsZSBjeD0iMTgwIiBjeT0iMTEwIiByPSI1IiBmaWxsPSJibGFjayIvPjxlbGxpcHNlIGN4PSIxNTAiIGN5PSIxNDAiIHJ4PSIyNSIgcnk9IjEwIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iMTUwIiB5PSIyMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyI+SG9vZGllIEJ1bGxkb2c8L3RleHQ+PHRleHQgeD0iMTUwIiB5PSIyNjAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzgwODA4MCI+Q29tbW9uPC90ZXh0Pjwvc3ZnPg==',
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
    description: 'An elegant bulldog with a top hat and bow tie.',
    image: '/images/bulldogs/bulldog-tophat.svg',
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
    description: 'A heavenly bulldog with angel wings and a halo.',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNmOGY3ZmYiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMjAiIHI9IjgwIiBmaWxsPSIjZmZmY2UwIiBvcGFjaXR5PSIwLjYiLz48Y2lyY2xlIGN4PSIxNTAiIGN5PSIxMjAiIHI9IjYwIiBmaWxsPSIjZTZkMmI1Ii8+PHBhdGggZD0iTSAxMDAgMTIwIEMgNTAgODAgNDAgMTcwIDEwMCAxNTAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNlNmU2ZTYiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0gMjAwIDEyMCBDIDI1MCA4MCAyNjAgMTcwIDIwMCAxNTAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiNlNmU2ZTYiIHN0cm9rZS13aWR0aD0iMiIvPjxlbGxpcHNlIGN4PSIxNTAiIGN5PSI3MCIgcng9IjQwIiByeT0iMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZGY1NyIgc3Ryb2tlLXdpZHRoPSI1Ii8+PGNpcmNsZSBjeD0iMTIwIiBjeT0iMTEwIiByPSIxMCIgZmlsbD0id2hpdGUiLz48Y2lyY2xlIGN4PSIxODAiIGN5PSIxMTAiIHI9IjEwIiBmaWxsPSJ3aGl0ZSIvPjxjaXJjbGUgY3g9IjEyMCIgY3k9IjExMCIgcj0iNSIgZmlsbD0iYmxhY2siLz48Y2lyY2xlIGN4PSIxODAiIGN5PSIxMTAiIHI9IjUiIGZpbGw9ImJsYWNrIi8+PGVsbGlwc2UgY3g9IjE1MCIgY3k9IjE0MCIgcng9IjI1IiByeT0iMTAiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSIxNTAiIHk9IjIzMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMzMzIj5BbmdlbCBCdWxsZG9nPC90ZXh0Pjx0ZXh0IHg9IjE1MCIgeT0iMjYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmQ3MDAiPkxlZ2VuZGFyeTwvdGV4dD48L3N2Zz4=',
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
    description: 'A bulldog with cow spots and small horns.',
    image: '/images/bulldogs/bulldog-default.svg',
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
    description: 'A vintage-styled bulldog with a classic newsboy cap.',
    image: '/images/bulldogs/bulldog-default.svg',
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
    description: 'A friendly bulldog enjoying a cold beer.',
    image: '/images/bulldogs/bulldog-default.svg',
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
    description: 'A sporty bulldog in a green and white striped jersey.',
    image: '/images/bulldogs/bulldog-default.svg',
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
    description: 'A sporty bulldog with a soccer ball and athletic jersey.',
    image: '/images/bulldogs/bulldog-default.svg',
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
    description: 'A city-dwelling bulldog with a casual blue outfit.',
    image: '/images/bulldogs/bulldog-default.svg',
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
    description: 'A distinguished bulldog in a naval captain uniform.',
    image: '/images/bulldogs/bulldog-captain.svg',
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
    description: 'A caring bulldog dad with his bulldog teddy.',
    image: '/images/bulldogs/bulldog-default.svg',
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
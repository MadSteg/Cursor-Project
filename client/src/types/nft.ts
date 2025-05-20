export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  attributes: {
    trait_type: string;
    value: string;
  }[];
  mintedAt?: string;
  tokenId?: string;
  owner?: string;
  txHash?: string;
}
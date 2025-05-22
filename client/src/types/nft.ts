export interface NFTAttribute {
  trait_type: string;
  value: string;
}

export type NFTRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: NFTRarity;
  attributes: NFTAttribute[];
  merchant?: string;
}
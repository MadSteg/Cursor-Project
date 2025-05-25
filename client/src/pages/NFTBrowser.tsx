import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Heart, Sparkles, Star, Crown, Gem } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface KawaiiNFT {
  id: string;
  name: string;
  image: string;
  category: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  price: number;
  likes: number;
  isAnimated: boolean;
  creator: string;
}

// Extensive kawaii NFT collection with consistent naming
const generateKawaiiNFTs = (): KawaiiNFT[] => {
  const categories = {
    'Cute Animals': [
      'Sleepy Corgi', 'Rainbow Cat', 'Baby Panda', 'Magical Unicorn', 'Chubby Hamster',
      'Fluffy Bunny', 'Dancing Penguin', 'Kawaii Fox', 'Smiling Seal', 'Happy Dolphin',
      'Tiny Dragon', 'Floating Whale', 'Pixel Kitten', 'Bouncy Slime', 'Glowing Firefly'
    ],
    'Fantasy Friends': [
      'Fairy Princess', 'Star Guardian', 'Moon Sprite', 'Crystal Mage', 'Wind Spirit',
      'Cloud Walker', 'Dream Catcher', 'Magic Potion', 'Enchanted Rose', 'Mystic Orb',
      'Angel Wings', 'Cosmic Butterfly', 'Shooting Star', 'Rainbow Bridge', 'Golden Harp'
    ],
    'Sweet Treats': [
      'Cupcake Princess', 'Donut King', 'Ice Cream Cone', 'Candy Heart', 'Chocolate Chip',
      'Marshmallow Cloud', 'Lollipop Swirl', 'Bubble Tea', 'Kawaii Cookie', 'Sweet Macaron',
      'Cotton Candy', 'Strawberry Cake', 'Honey Bear', 'Sugar Crystal', 'Caramel Drop'
    ],
    'Ocean Cuties': [
      'Jellyfish Glow', 'Seahorse Dance', 'Starfish Shine', 'Coral Garden', 'Pearl Diver',
      'Mermaid Tail', 'Ocean Bubble', 'Seashell Song', 'Whale Song', 'Dolphin Jump',
      'Octopus Hug', 'Sea Turtle', 'Clownfish', 'Sea Anemone', 'Treasure Chest'
    ],
    'Space Kawaii': [
      'Rocket Ship', 'Planet Smile', 'Alien Friend', 'Comet Trail', 'Galaxy Swirl',
      'Space Cat', 'Moon Rabbit', 'Star Collector', 'Nebula Dance', 'Asteroid Belt',
      'Solar Flare', 'Cosmic Dust', 'Black Hole', 'Satellite', 'Space Station'
    ],
    'Garden Magic': [
      'Sunflower Smile', 'Rose Bloom', 'Daisy Chain', 'Tulip Dance', 'Lily Pad',
      'Butterfly Kiss', 'Bee Buzz', 'Ladybug Luck', 'Mushroom House', 'Tree Spirit',
      'Flower Crown', 'Garden Gate', 'Watering Can', 'Seed Sprout', 'Rainbow Garden'
    ]
  };

  const rarities: Array<'Common' | 'Rare' | 'Epic' | 'Legendary'> = ['Common', 'Rare', 'Epic', 'Legendary'];
  const creators = ['KawaiiStudio', 'CuteFactory', 'AnimeLab', 'PixelArt', 'DreamMaker', 'MagicBrush'];
  
  let nftId = 1;
  const nfts: KawaiiNFT[] = [];

  Object.entries(categories).forEach(([category, names]) => {
    names.forEach(name => {
      const rarity = rarities[Math.floor(Math.random() * rarities.length)];
      const basePrice = rarity === 'Common' ? 0.1 : rarity === 'Rare' ? 0.5 : rarity === 'Epic' ? 1.2 : 3.0;
      
      nfts.push({
        id: nftId.toString(),
        name,
        image: `https://picsum.photos/200/200?random=${nftId}&blur=0`,
        category,
        rarity,
        price: basePrice + Math.random() * 0.5,
        likes: Math.floor(Math.random() * 150) + 10,
        isAnimated: Math.random() > 0.7,
        creator: creators[Math.floor(Math.random() * creators.length)]
      });
      nftId++;
    });
  });

  return nfts.slice(0, 90); // Return 90 NFTs for abundant feel
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'Common': return 'bg-gray-500';
    case 'Rare': return 'bg-blue-500';
    case 'Epic': return 'bg-purple-500';
    case 'Legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
    default: return 'bg-gray-500';
  }
};

const getRarityIcon = (rarity: string) => {
  switch (rarity) {
    case 'Common': return <Star className="w-3 h-3" />;
    case 'Rare': return <Sparkles className="w-3 h-3" />;
    case 'Epic': return <Gem className="w-3 h-3" />;
    case 'Legendary': return <Crown className="w-3 h-3" />;
    default: return <Star className="w-3 h-3" />;
  }
};

export default function NFTBrowser() {
  const [nfts] = useState<KawaiiNFT[]>(generateKawaiiNFTs());
  const [visibleNFTs, setVisibleNFTs] = useState(24);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(nfts.map(nft => nft.category)))];

  const filteredNFTs = selectedCategory === 'All' 
    ? nfts 
    : nfts.filter(nft => nft.category === selectedCategory);

  const loadMore = () => {
    setVisibleNFTs(prev => Math.min(prev + 12, filteredNFTs.length));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Magical Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="text-center">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-pulse">
              ✨ Kawaii NFT Gallery ✨
            </h1>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
              Discover the cutest collection of animated NFTs in the blockchain universe! 🌈
            </p>
            <div className="flex justify-center space-x-2 text-4xl mb-8">
              <span className="animate-bounce">🦄</span>
              <span className="animate-bounce delay-100">🌟</span>
              <span className="animate-bounce delay-200">🎀</span>
              <span className="animate-bounce delay-300">🍭</span>
              <span className="animate-bounce delay-500">💖</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {/* Category Carousel */}
        <div className="mb-12">
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {categories.map(category => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`whitespace-nowrap rounded-full px-6 py-3 font-semibold transition-all duration-300 ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105' 
                    : 'hover:scale-105 hover:shadow-md'
                }`}
              >
                {category === 'All' ? '🌟 All Cuties' : `${getCategoryEmoji(category)} ${category}`}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">{filteredNFTs.length}</div>
              <div className="text-gray-600">Total NFTs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">{filteredNFTs.filter(n => n.isAnimated).length}</div>
              <div className="text-gray-600">Animated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">{filteredNFTs.filter(n => n.rarity === 'Legendary').length}</div>
              <div className="text-gray-600">Legendary</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600">{categories.length - 1}</div>
              <div className="text-gray-600">Categories</div>
            </div>
          </div>
        </div>

        {/* Dynamic NFT Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {filteredNFTs.slice(0, visibleNFTs).map((nft, index) => (
            <Link key={nft.id} href={`/nft/${nft.id}`}>
              <Card className="group cursor-pointer transition-all duration-500 hover:scale-105 hover:rotate-1 bg-white/90 backdrop-blur-sm border-2 hover:border-pink-300 hover:shadow-2xl overflow-hidden">
                <div className="relative">
                  {/* Rarity Glow Effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${
                    nft.rarity === 'Legendary' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                    nft.rarity === 'Epic' ? 'bg-purple-500' :
                    nft.rarity === 'Rare' ? 'bg-blue-500' : 'bg-gray-400'
                  } blur-lg`}></div>
                  
                  {/* NFT Image */}
                  <div className="relative p-4">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className={`w-full h-32 object-contain rounded-lg transition-all duration-300 group-hover:scale-110 ${
                        nft.isAnimated ? 'animate-pulse' : ''
                      }`}
                    />
                    
                    {/* Animated Badge */}
                    {nft.isAnimated && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white animate-bounce">
                          ✨ Animated
                        </Badge>
                      </div>
                    )}
                    
                    {/* Rarity Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge className={`${getRarityColor(nft.rarity)} text-white flex items-center gap-1`}>
                        {getRarityIcon(nft.rarity)}
                        {nft.rarity}
                      </Badge>
                    </div>
                    
                    {/* Price Badge */}
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-green-500 text-white font-bold">
                        {nft.price.toFixed(2)} ETH
                      </Badge>
                    </div>
                    
                    {/* Likes */}
                    <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-white/90 rounded-full px-2 py-1">
                      <Heart className="w-3 h-3 text-red-500 fill-current" />
                      <span className="text-xs font-semibold">{nft.likes}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-4 pt-0">
                  <h3 className="font-bold text-gray-800 text-sm mb-1 group-hover:text-purple-600 transition-colors">
                    {nft.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">by {nft.creator}</p>
                  <div className="text-xs text-gray-500">{nft.category}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Load More Magic Button */}
        {visibleNFTs < filteredNFTs.length && (
          <div className="text-center mt-12">
            <Button
              onClick={loadMore}
              size="lg"
              className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              ✨ Discover More Kawaii NFTs ✨
            </Button>
            <p className="text-gray-600 mt-4">
              Showing {visibleNFTs} of {filteredNFTs.length} adorable NFTs
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getCategoryEmoji(category: string): string {
  const emojiMap: { [key: string]: string } = {
    'Cute Animals': '🐾',
    'Fantasy Friends': '🧚',
    'Sweet Treats': '🧁',
    'Ocean Cuties': '🌊',
    'Space Kawaii': '🚀',
    'Garden Magic': '🌸'
  };
  return emojiMap[category] || '✨';
}
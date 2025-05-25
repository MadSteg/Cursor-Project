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

// Function to generate NFTs using your real images with AI analysis
const generateNFTsFromBucket = (bucketImages: Array<{ fileName: string; url: string }>, analysisResults?: Array<{ fileName: string; analysis: any }>): KawaiiNFT[] => {
  const categories = ['Bulldog Collection', 'Digital Pets', 'Canine Collectibles', 'Breed Showcase'];
  const creators = ['BlockReceipt', 'Digital Mint', 'NFT Creator', 'Chain Artist'];
  
  return bucketImages.map((image, index) => {
    const nftId = index + 1;
    const category = categories[index % categories.length];
    const creator = creators[index % creators.length];
    
    // Try to find AI analysis for this image
    const analysis = analysisResults?.find(result => result.fileName === image.fileName);
    
    let displayName;
    if (analysis?.analysis?.nftName) {
      displayName = analysis.analysis.nftName;
    } else {
      // Fallback to filename processing
      displayName = image.fileName
        .replace(/\.(png|jpg|jpeg|gif)$/i, '') // Remove extension
        .replace(/^screenshot[-_]?/i, '') // Remove 'screenshot' prefix
        .replace(/[-_]/g, ' ') // Replace dashes/underscores with spaces
        .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words
    }
    
    return {
      id: nftId.toString(),
      name: displayName || `Digital Collectible #${nftId}`,
      image: image.url,
      category,
      rarity: 'Common' as 'Common' | 'Rare' | 'Epic' | 'Legendary',
      price: 0, // No price display as requested
      likes: Math.floor(Math.random() * 150) + 10,
      isAnimated: false,
      creator
    };
  });
};

// Extensive kawaii NFT collection with consistent naming
const generateReceiptNFTs = (): KawaiiNFT[] => {
  const categories = {
    'Adventurers': [
      'Blue Explorer', 'Red Wanderer', 'Green Scout', 'Purple Traveler', 'Orange Adventurer',
      'Pink Pioneer', 'Yellow Seeker', 'Teal Navigator', 'Brown Hiker', 'Gray Nomad',
      'Indigo Ranger', 'Coral Trekker', 'Mint Explorer', 'Lavender Scout', 'Peach Wanderer'
    ],
    'Space Crew': [
      'Astronaut Alpha', 'Cosmonaut Beta', 'Space Captain', 'Galaxy Pilot', 'Stellar Navigator',
      'Cosmic Explorer', 'Rocket Rider', 'Planet Scout', 'Star Voyager', 'Moon Walker',
      'Solar Surfer', 'Nebula Drifter', 'Comet Chaser', 'Orbit Guardian', 'Deep Space Pioneer'
    ],
    'Ocean Friends': [
      'Blue Diver', 'Sea Explorer', 'Wave Rider', 'Coral Guardian', 'Deep Sea Scout',
      'Ocean Navigator', 'Pearl Seeker', 'Tide Walker', 'Marine Explorer', 'Kelp Forest Guide',
      'Reef Protector', 'Current Rider', 'Lagoon Scout', 'Bay Explorer', 'Aqua Adventurer'
    ],
    'Forest Rangers': [
      'Tree Climber', 'Forest Guide', 'Nature Scout', 'Woodland Explorer', 'Leaf Walker',
      'Branch Hopper', 'Moss Finder', 'Root Tracker', 'Canopy Explorer', 'Trail Blazer',
      'Bush Walker', 'Fern Seeker', 'Bark Examiner', 'Grove Guardian', 'Wild Explorer'
    ],
    'Mountain Climbers': [
      'Peak Seeker', 'Summit Explorer', 'Rock Climber', 'Alpine Scout', 'Ridge Walker',
      'Cliff Hanger', 'Valley Explorer', 'Boulder Hopper', 'Snow Trekker', 'Ice Walker',
      'Canyon Scout', 'Mesa Explorer', 'Slope Rider', 'Crag Climber', 'High Altitude Explorer'
    ]
  };
  const creators = ['BlockReceipt', 'POS Terminal', 'Receipt Bot', 'Auto Mint', 'Chain Store', 'Digital Till'];
  
  let nftId = 1;
  const nfts: KawaiiNFT[] = [];

  Object.entries(categories).forEach(([category, names]) => {
    names.forEach(name => {
      const basePrice = 0.5;
      
      nfts.push({
        id: nftId.toString(),
        name,
        image: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name.replace(' ', '')}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
        category,
        rarity: 'Common' as 'Common' | 'Rare' | 'Epic' | 'Legendary',
        price: basePrice + Math.random() * 0.5,
        likes: Math.floor(Math.random() * 150) + 10,
        isAnimated: false,
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
  const [visibleNFTs, setVisibleNFTs] = useState(24);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bucketImages, setBucketImages] = useState<Array<{ fileName: string; url: string }>>([]);
  const [analysisResults, setAnalysisResults] = useState<Array<{ fileName: string; analysis: any }>>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Fetch real NFT images from your Google Cloud Storage bucket
  useEffect(() => {
    async function fetchBucketImages() {
      try {
        const response = await fetch('/api/nft-images');
        const data = await response.json();
        
        if (data.success && data.images?.length > 0) {
          setBucketImages(data.images);
        }
      } catch (error) {
        console.log('Using fallback images - bucket may be empty or not accessible');
      } finally {
        setImagesLoading(false);
      }
    }
    
    fetchBucketImages();
  }, []);

  // Function to analyze images with AI and get smart names
  const analyzeImagesWithAI = async () => {
    try {
      setIsAnalyzing(true);
      const response = await fetch('/api/analyze-nft-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setAnalysisResults(data.results);
        console.log(`AI analysis completed for ${data.results.length} images`);
      }
    } catch (error) {
      console.error('Error analyzing images:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate NFTs using your real images from the bucket with AI analysis
  const nfts = bucketImages.length > 0 
    ? generateNFTsFromBucket(bucketImages, analysisResults)
    : generateReceiptNFTs();

  const categories = ['All', ...Array.from(new Set(nfts.map((nft: KawaiiNFT) => nft.category)))];

  const filteredNFTs = selectedCategory === 'All' 
    ? nfts 
    : nfts.filter((nft: KawaiiNFT) => nft.category === selectedCategory);

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
            <h1 className="text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              🧾 BlockReceipt NFT Collection
            </h1>
            <p className="text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
              These NFTs are automatically minted when you make purchases using BlockReceipt. Each NFT contains encrypted receipt data including purchase details, merchant information, and transaction history.
            </p>
            <div className="flex justify-center space-x-2 text-4xl mb-8">
              <span>🧾</span>
              <span>💎</span>
              <span>🔗</span>
              <span>✨</span>
              <span>🛡️</span>
            </div>
            
            {/* AI Analysis Button */}
            {bucketImages.length > 0 && (
              <div className="flex justify-center mb-8">
                <button
                  onClick={analyzeImagesWithAI}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing Images with AI...
                    </>
                  ) : (
                    <>
                      🤖 Generate Smart NFT Names
                    </>
                  )}
                </button>
              </div>
            )}
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
                    
                    {/* NFT ID Badge */}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-blue-500 text-white">
                        #{nft.id}
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
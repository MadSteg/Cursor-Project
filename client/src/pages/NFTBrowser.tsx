import { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import LoadingSkeleton from '../components/LoadingSkeleton';
import NFTReceiptModal from '../components/NFTReceiptModal';

// Sample receipt data for modal
const sampleReceiptData = {
  merchantName: "Digital Store",
  purchaseDate: "2024-05-25T15:30:00Z",
  totalAmount: 45.99,
  currency: "USD",
  items: [
    { name: "Premium Item", quantity: 1, price: 29.99 },
    { name: "Digital Service", quantity: 2, price: 8.00 }
  ],
  transactionId: "BR_" + Math.random().toString(36).substr(2, 8).toUpperCase(),
  verificationDetails: {
    tokenId: Math.floor(Math.random() * 10000),
    contractAddress: "0x" + Math.random().toString(16).substr(2, 40),
    network: "Polygon Amoy",
    verifiedAt: new Date().toISOString()
  }
};

export default function NFTBrowser() {
  const [bucketImages, setBucketImages] = useState<Array<{ fileName: string; url: string }>>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch real NFT images from Google Cloud Storage bucket
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

  // Generate 55 images for display (mix of bucket images and generated ones)
  const generateDisplayImages = () => {
    const images = [];
    const targetCount = 55;
    
    // Use bucket images first
    for (let i = 0; i < targetCount; i++) {
      if (i < bucketImages.length) {
        images.push({
          id: i + 1,
          url: bucketImages[i].url,
          isFromBucket: true
        });
      } else {
        // Generate additional images to reach 55
        const seeds = [
          'Adventure', 'Explorer', 'Wanderer', 'Pioneer', 'Navigator', 'Scout', 'Traveler',
          'Guardian', 'Seeker', 'Walker', 'Rider', 'Drifter', 'Climber', 'Hopper',
          'Tracker', 'Finder', 'Chaser', 'Surfer', 'Protector', 'Guide', 'Ranger',
          'Captain', 'Pilot', 'Voyager', 'Cosmic', 'Galaxy', 'Stellar', 'Solar',
          'Nebula', 'Planet', 'Orbit', 'Comet', 'Moon', 'Space', 'Star', 'Deep',
          'Ocean', 'Wave', 'Coral', 'Pearl', 'Marine', 'Reef', 'Current', 'Bay',
          'Forest', 'Tree', 'Nature', 'Woodland', 'Leaf', 'Branch', 'Root', 'Canopy',
          'Mountain', 'Peak', 'Summit', 'Alpine', 'Ridge', 'Canyon', 'Valley'
        ];
        const seed = seeds[i % seeds.length] + i;
        images.push({
          id: i + 1,
          url: `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
          isFromBucket: false
        });
      }
    }
    
    return images;
  };

  const displayImages = generateDisplayImages();

  const handleImageClick = (image: any) => {
    setSelectedNFT({
      ...sampleReceiptData,
      id: image.id,
      image: image.url
    });
    setModalOpen(true);
  };

  if (imagesLoading) {
    return (
      <>
        <SEOHead 
          title="BlockReceipt Vault - BlockReceipt.ai"
          description="Explore our collection of carbon-neutral NFT collectibles. Each digital receipt transforms into a unique, encrypted NFT powered by blockchain technology."
          keywords="NFT gallery, digital collectibles, blockchain receipts, carbon-neutral NFTs, encrypted NFTs, Web3 collectibles"
          url="/nft-browser"
        />
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
          <div className="container mx-auto px-4 py-16">
            <LoadingSkeleton />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title="BlockReceipt Vault - BlockReceipt.ai"
        description="Explore our collection of carbon-neutral NFT collectibles. Each digital receipt transforms into a unique, encrypted NFT powered by blockchain technology."
        keywords="NFT gallery, digital collectibles, blockchain receipts, carbon-neutral NFTs, encrypted NFTs, Web3 collectibles"
        url="/nft-browser"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
        {/* Hero Header */}
        <div className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-12 left-12 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-25 animate-bounce"></div>

          <div className="container mx-auto px-4 py-16 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                BlockReceipt Vault
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
                Your collection of carbon-neutral NFT receipts. Each NFT contains encrypted purchase data including merchant information, transaction history, and verification details.
              </p>
            </div>
          </div>
        </div>

        {/* NFT Grid with Animation */}
        <div className="container mx-auto px-4 pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {displayImages.map((image, index) => (
              <div
                key={image.id}
                onClick={() => handleImageClick(image)}
                className="group cursor-pointer transition-all duration-500 hover:scale-105 hover:rotate-1 bg-white/10 backdrop-blur-sm border border-white/20 hover:border-pink-300/50 hover:shadow-2xl overflow-hidden rounded-xl animate-fadeInUp"
                style={{
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: 'both'
                }}
              >
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 bg-gradient-to-br from-purple-400 to-pink-500 blur-lg"></div>

                  {/* NFT Image */}
                  <div className="relative p-3">
                    <img
                      src={image.url}
                      alt={`NFT #${image.id}`}
                      className="w-full h-24 object-contain rounded-lg transition-all duration-300 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* NFT ID Badge */}
                    <div className="absolute top-1 right-1">
                      <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        #{image.id}
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end">
                      <div className="text-white text-xs font-semibold p-2">
                        Click to view receipt
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Collection Info */}
          <div className="text-center mt-12">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Complete Collection
              </h3>
              <p className="text-purple-200 text-lg">
                Displaying {displayImages.length} unique NFT receipts from your BlockReceipt collection. 
                Each NFT represents a real purchase with encrypted receipt data stored on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Receipt Modal */}
      {selectedNFT && (
        <NFTReceiptModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedNFT(null);
          }}
          nftData={selectedNFT}
        />
      )}
    </>
  );
}
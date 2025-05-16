import React from 'react';
import { Link } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, ShoppingBag, CreditCard, Receipt, Utensils, Plane, Home } from 'lucide-react';

// Sample NFT data for the gallery
const nftCategories = [
  {
    id: 'standard',
    name: 'Standard Receipts',
    description: 'Basic digital proof of purchase for everyday transactions',
    icon: <Receipt className="h-6 w-6 text-primary" />,
    nfts: [
      { id: 1, name: 'Receipt Guardian', tier: 'Silver', image: '/assets/nft-images/receipt-guardian.svg' },
      { id: 2, name: 'Pixel Receipt', tier: 'Bronze', image: '/assets/nft-images/default-nft.svg' },
      { id: 3, name: 'Digital Shopper', tier: 'Silver', image: '/assets/nft-images/digital-shopper.svg' },
    ]
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Warranty-enabled receipts for electronic purchases',
    icon: <CreditCard className="h-6 w-6 text-blue-500" />,
    nfts: [
      { id: 4, name: 'Tech Guardian', tier: 'Gold', image: '/assets/nft-images/tech-guardian.svg' },
      { id: 5, name: 'Circuit Keeper', tier: 'Silver', image: '/assets/nft-images/circuit-keeper.svg' },
    ]
  },
  {
    id: 'luxury',
    name: 'Luxury Items',
    description: 'Enhanced receipts for high-value purchases',
    icon: <ShoppingBag className="h-6 w-6 text-amber-500" />,
    nfts: [
      { id: 6, name: 'Luxury Receipt', tier: 'Platinum', image: '/assets/nft-images/luxury-receipt.svg' },
      { id: 7, name: 'Premium Proof', tier: 'Gold', image: '/assets/nft-images/premium-proof.svg' },
    ]
  },
  {
    id: 'food',
    name: 'Food & Dining',
    description: 'Restaurant and food purchase receipts',
    icon: <Utensils className="h-6 w-6 text-green-500" />,
    nfts: [
      { id: 8, name: 'Food Receipt', tier: 'Bronze', image: '/assets/nft-images/food-receipt.svg' },
      { id: 9, name: 'Dining Record', tier: 'Silver', image: '/assets/nft-images/dining-record.svg' },
    ]
  },
  {
    id: 'travel',
    name: 'Travel & Transport',
    description: 'Ticket and travel expense receipts',
    icon: <Plane className="h-6 w-6 text-purple-500" />,
    nfts: [
      { id: 10, name: 'Travel Ticket', tier: 'Silver', image: '/assets/nft-images/travel-nft.svg' },
      { id: 11, name: 'Journey Log', tier: 'Bronze', image: '/assets/nft-images/journey-log.svg' },
    ]
  },
  {
    id: 'home',
    name: 'Home & Living',
    description: 'Receipts for home goods and furnishings',
    icon: <Home className="h-6 w-6 text-orange-500" />,
    nfts: [
      { id: 12, name: 'Home Receipt', tier: 'Silver', image: '/assets/nft-images/home-receipt.svg' },
      { id: 13, name: 'Living Space', tier: 'Gold', image: '/assets/nft-images/living-space.svg' },
    ]
  }
];

// Generate a random background gradient for NFT cards
const getRandomGradient = (category: string) => {
  const gradients = {
    standard: 'from-blue-100 to-indigo-100 border-blue-200',
    electronics: 'from-blue-100 to-cyan-100 border-blue-200',
    luxury: 'from-amber-100 to-yellow-100 border-amber-200',
    food: 'from-green-100 to-emerald-100 border-green-200',
    travel: 'from-purple-100 to-fuchsia-100 border-purple-200',
    home: 'from-orange-100 to-amber-100 border-orange-200',
    crypto: 'from-violet-100 to-purple-100 border-violet-200'
  };
  
  return gradients[category as keyof typeof gradients] || 'from-gray-100 to-slate-100 border-gray-200';
};

// Badge color for tier
const getTierColor = (tier: string) => {
  switch (tier) {
    case 'Bronze': return 'bg-amber-600';
    case 'Silver': return 'bg-slate-400';
    case 'Gold': return 'bg-amber-400';
    case 'Platinum': return 'bg-gradient-to-r from-indigo-500 to-purple-500';
    default: return 'bg-slate-500';
  }
};

interface NFTGalleryShowcaseProps {
  className?: string;
}

const NFTGalleryShowcase: React.FC<NFTGalleryShowcaseProps> = ({ className = '' }) => {
  // Get the first three categories for the showcase version
  const featuredCategories = nftCategories.slice(0, 3);
  
  return (
    <div className={`space-y-8 ${className}`}>
      <div className="flex flex-col space-y-3">
        <h2 className="text-2xl font-bold tracking-tight">
          NFT Receipt Collection
        </h2>
        <p className="text-muted-foreground">
          Transform your receipts into these collectible digital NFTs. Each receipt you upload can earn you one of these unique tokens.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                {category.icon}
                <CardTitle>{category.name}</CardTitle>
              </div>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-0">
              <div className="grid grid-cols-2 gap-2 p-6 pt-0">
                {category.nfts.slice(0, 2).map((nft) => (
                  <div 
                    key={nft.id} 
                    className={`rounded-lg border p-2 relative overflow-hidden bg-gradient-to-br ${getRandomGradient(category.id)}`}
                  >
                    <div className="aspect-square rounded-md overflow-hidden flex items-center justify-center bg-white/80">
                      {nft.image ? (
                        <img src={nft.image} alt={nft.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <Package className="h-8 w-8 text-slate-400" />
                      )}
                    </div>
                    <div className="mt-2 flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-medium">{nft.name}</h4>
                      </div>
                      <Badge className={`${getTierColor(nft.tier)} text-white text-xs`}>
                        {nft.tier}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 py-3">
              <Link href={`/nft-catalog/${category.id}`}>
                <Button variant="ghost" className="w-full justify-between">
                  View {category.nfts.length} {category.name} NFTs
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <Link href="/nft-catalog">
          <Button className="gap-2">
            View Full NFT Catalog
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NFTGalleryShowcase;
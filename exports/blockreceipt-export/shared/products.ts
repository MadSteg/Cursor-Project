/**
 * Product Catalog Types and Data
 * Contains product definitions for NFT receipt minting
 */

import { z } from 'zod';

/**
 * Product Category Enum
 */
export const ProductCategory = {
  ELECTRONICS: 'electronics',
  FASHION: 'fashion',
  HOME: 'home',
  BEAUTY: 'beauty',
  FOOD: 'food',
  SERVICES: 'services',
  DIGITAL: 'digital',
  COLLECTIBLES: 'collectibles'
} as const;

/**
 * NFT Receipt Tier for different quality/feature levels
 */
export const NFTReceiptTier = {
  STANDARD: 'standard',  // $0.99 - Basic receipt
  PREMIUM: 'premium',    // $2.99 - Enhanced visuals and metadata
  LUXURY: 'luxury'       // $5.00 - Animated with special features
} as const;

/**
 * Merchant record with payment and branding information
 */
export interface Merchant {
  id: string;
  name: string;
  logo: string;
  description: string;
  website?: string;
  walletAddress: string;
  categories: (typeof ProductCategory)[keyof typeof ProductCategory][];
  paymentMethods: {
    acceptsCrypto: boolean;
    acceptsCredit: boolean;
    cryptoCurrencies?: string[]; // e.g., ["MATIC", "USDC"]
  };
  nftReceiptTemplates?: {
    [key in typeof NFTReceiptTier[keyof typeof NFTReceiptTier]]?: {
      template: string;
      animation?: string;
      specialFeatures?: string[];
    }
  };
}

/**
 * Product model with pricing, merchant, and NFT metadata
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;  // In USD
  images: string[];
  merchantId: string;
  category: (typeof ProductCategory)[keyof typeof ProductCategory];
  sku: string;
  serialNumber?: string;
  available: boolean;
  tags: string[];
  metadata: {
    weight?: string;
    dimensions?: string;
    manufacturer?: string;
    warrantyMonths?: number;
    color?: string;
    material?: string;
    [key: string]: any;
  };
  nftReceipt: {
    availableTiers: (typeof NFTReceiptTier)[keyof typeof NFTReceiptTier][];
    defaultTier: (typeof NFTReceiptTier)[keyof typeof NFTReceiptTier];
    pricing: {
      [key in typeof NFTReceiptTier[keyof typeof NFTReceiptTier]]: number;
    };
    encryptionScheme: 'taco-tpre'; // Threshold Pre-Encryption via Taco
    additionalMetadata?: {
      authenticityVerification?: boolean;
      serialNumberTracking?: boolean;
      warrantyInfo?: boolean;
      resellRights?: boolean;
    }
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Array of merchants
 */
export const merchants: Merchant[] = [
  {
    id: "merchant-tech-haven",
    name: "Tech Haven",
    logo: "/merchants/tech-haven-logo.svg",
    description: "Premium electronics and cutting-edge technology products",
    website: "https://techhaven.example.com",
    walletAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    categories: [ProductCategory.ELECTRONICS, ProductCategory.DIGITAL],
    paymentMethods: {
      acceptsCrypto: true,
      acceptsCredit: true,
      cryptoCurrencies: ["MATIC", "USDC", "ETH"]
    },
    nftReceiptTemplates: {
      [NFTReceiptTier.STANDARD]: {
        template: "/receipt-templates/tech-haven-standard.svg"
      },
      [NFTReceiptTier.PREMIUM]: {
        template: "/receipt-templates/tech-haven-premium.svg",
        specialFeatures: ["Extended warranty tracking", "Priority support"]
      },
      [NFTReceiptTier.LUXURY]: {
        template: "/receipt-templates/tech-haven-luxury.svg",
        animation: "/receipt-templates/tech-haven-luxury.mp4",
        specialFeatures: ["Lifetime warranty", "Exclusive tech events access", "Apple Wallet integration"]
      }
    }
  },
  {
    id: "merchant-fashion-forward",
    name: "Fashion Forward",
    logo: "/merchants/fashion-forward-logo.svg",
    description: "Contemporary fashion and luxury apparel",
    website: "https://fashionforward.example.com",
    walletAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    categories: [ProductCategory.FASHION],
    paymentMethods: {
      acceptsCrypto: true,
      acceptsCredit: true,
      cryptoCurrencies: ["MATIC", "USDC"]
    },
    nftReceiptTemplates: {
      [NFTReceiptTier.STANDARD]: {
        template: "/receipt-templates/fashion-forward-standard.svg"
      },
      [NFTReceiptTier.PREMIUM]: {
        template: "/receipt-templates/fashion-forward-premium.svg",
        specialFeatures: ["Authentication certificate", "Care instructions"]
      },
      [NFTReceiptTier.LUXURY]: {
        template: "/receipt-templates/fashion-forward-luxury.svg",
        animation: "/receipt-templates/fashion-forward-luxury.mp4",
        specialFeatures: ["Exclusive fashion events access", "Designer direct contact", "Apple Wallet integration"]
      }
    }
  },
  {
    id: "merchant-home-elegance",
    name: "Home Elegance",
    logo: "/merchants/home-elegance-logo.svg",
    description: "Luxury home decor and furnishings",
    website: "https://homeelegance.example.com",
    walletAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    categories: [ProductCategory.HOME],
    paymentMethods: {
      acceptsCrypto: true,
      acceptsCredit: true,
      cryptoCurrencies: ["MATIC", "USDC"]
    },
    nftReceiptTemplates: {
      [NFTReceiptTier.STANDARD]: {
        template: "/receipt-templates/home-elegance-standard.svg"
      },
      [NFTReceiptTier.PREMIUM]: {
        template: "/receipt-templates/home-elegance-premium.svg",
        specialFeatures: ["Provenance certificate", "Care guide"]
      },
      [NFTReceiptTier.LUXURY]: {
        template: "/receipt-templates/home-elegance-luxury.svg",
        animation: "/receipt-templates/home-elegance-luxury.mp4",
        specialFeatures: ["Interior design consultation", "Priority delivery", "Apple Wallet integration"]
      }
    }
  },
  {
    id: "merchant-gourmet-eats",
    name: "Gourmet Eats",
    logo: "/merchants/gourmet-eats-logo.svg",
    description: "Premium food products and gourmet ingredients",
    website: "https://gourmeteats.example.com",
    walletAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    categories: [ProductCategory.FOOD],
    paymentMethods: {
      acceptsCrypto: true,
      acceptsCredit: true,
      cryptoCurrencies: ["MATIC", "USDC"]
    },
    nftReceiptTemplates: {
      [NFTReceiptTier.STANDARD]: {
        template: "/receipt-templates/gourmet-eats-standard.svg"
      },
      [NFTReceiptTier.PREMIUM]: {
        template: "/receipt-templates/gourmet-eats-premium.svg",
        specialFeatures: ["Recipe access", "Sourcing information"]
      },
      [NFTReceiptTier.LUXURY]: {
        template: "/receipt-templates/gourmet-eats-luxury.svg",
        animation: "/receipt-templates/gourmet-eats-luxury.mp4",
        specialFeatures: ["Chef consultation", "Exclusive tasting events", "Apple Wallet integration"]
      }
    }
  },
  {
    id: "merchant-beauty-bliss",
    name: "Beauty Bliss",
    logo: "/merchants/beauty-bliss-logo.svg",
    description: "Premium skincare and beauty products",
    website: "https://beautybliss.example.com",
    walletAddress: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    categories: [ProductCategory.BEAUTY],
    paymentMethods: {
      acceptsCrypto: true,
      acceptsCredit: true,
      cryptoCurrencies: ["MATIC", "USDC"]
    },
    nftReceiptTemplates: {
      [NFTReceiptTier.STANDARD]: {
        template: "/receipt-templates/beauty-bliss-standard.svg"
      },
      [NFTReceiptTier.PREMIUM]: {
        template: "/receipt-templates/beauty-bliss-premium.svg",
        specialFeatures: ["Product authenticity", "Ingredient sourcing"]
      },
      [NFTReceiptTier.LUXURY]: {
        template: "/receipt-templates/beauty-bliss-luxury.svg",
        animation: "/receipt-templates/beauty-bliss-luxury.mp4",
        specialFeatures: ["Personal beauty consultation", "Early access to new products", "Apple Wallet integration"]
      }
    }
  },
  {
    id: "merchant-digital-dreams",
    name: "Digital Dreams",
    logo: "/merchants/digital-dreams-logo.svg",
    description: "Digital assets, software, and virtual experiences",
    website: "https://digitaldreams.example.com",
    walletAddress: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    categories: [ProductCategory.DIGITAL, ProductCategory.COLLECTIBLES],
    paymentMethods: {
      acceptsCrypto: true,
      acceptsCredit: true,
      cryptoCurrencies: ["MATIC", "USDC", "ETH", "BTC"]
    },
    nftReceiptTemplates: {
      [NFTReceiptTier.STANDARD]: {
        template: "/receipt-templates/digital-dreams-standard.svg"
      },
      [NFTReceiptTier.PREMIUM]: {
        template: "/receipt-templates/digital-dreams-premium.svg",
        specialFeatures: ["License key tracking", "Update notifications"]
      },
      [NFTReceiptTier.LUXURY]: {
        template: "/receipt-templates/digital-dreams-luxury.svg",
        animation: "/receipt-templates/digital-dreams-luxury.mp4",
        specialFeatures: ["Lifetime updates", "Private Discord access", "Apple Wallet integration"]
      }
    }
  },
  {
    id: "merchant-pro-services",
    name: "Pro Services",
    logo: "/merchants/pro-services-logo.svg",
    description: "Professional services and consultations",
    website: "https://proservices.example.com",
    walletAddress: "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
    categories: [ProductCategory.SERVICES],
    paymentMethods: {
      acceptsCrypto: true,
      acceptsCredit: true,
      cryptoCurrencies: ["MATIC", "USDC"]
    },
    nftReceiptTemplates: {
      [NFTReceiptTier.STANDARD]: {
        template: "/receipt-templates/pro-services-standard.svg"
      },
      [NFTReceiptTier.PREMIUM]: {
        template: "/receipt-templates/pro-services-premium.svg",
        specialFeatures: ["Service guarantee", "Follow-up scheduling"]
      },
      [NFTReceiptTier.LUXURY]: {
        template: "/receipt-templates/pro-services-luxury.svg",
        animation: "/receipt-templates/pro-services-luxury.mp4",
        specialFeatures: ["Priority scheduling", "Extended service warranty", "Apple Wallet integration"]
      }
    }
  },
  {
    id: "merchant-collectors-corner",
    name: "Collector's Corner",
    logo: "/merchants/collectors-corner-logo.svg",
    description: "Rare collectibles and limited edition items",
    website: "https://collectorscorner.example.com",
    walletAddress: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
    categories: [ProductCategory.COLLECTIBLES],
    paymentMethods: {
      acceptsCrypto: true,
      acceptsCredit: true,
      cryptoCurrencies: ["MATIC", "USDC", "ETH"]
    },
    nftReceiptTemplates: {
      [NFTReceiptTier.STANDARD]: {
        template: "/receipt-templates/collectors-corner-standard.svg"
      },
      [NFTReceiptTier.PREMIUM]: {
        template: "/receipt-templates/collectors-corner-premium.svg",
        specialFeatures: ["Authenticity certificate", "Provenance tracking"]
      },
      [NFTReceiptTier.LUXURY]: {
        template: "/receipt-templates/collectors-corner-luxury.svg",
        animation: "/receipt-templates/collectors-corner-luxury.mp4",
        specialFeatures: ["Exclusive collector events", "Direct creator contact", "Apple Wallet integration"]
      }
    }
  }
];

/**
 * Generate 40 products across the merchants
 */
export const products: Product[] = [
  // Tech Haven Products (10)
  {
    id: "product-th-1",
    name: "Ultra HD Smart TV 65\"",
    description: "Crystal clear 4K display with smart features and voice control",
    price: 0.01,
    images: ["/products/tech-haven/smart-tv.jpg"],
    merchantId: "merchant-tech-haven",
    category: ProductCategory.ELECTRONICS,
    sku: "TH-TV-65-4K",
    serialNumber: "TH2025051401",
    available: true,
    tags: ["TV", "Smart Home", "4K", "Entertainment"],
    metadata: {
      dimensions: "57.4 x 33.2 x 2.5 inches",
      weight: "58 lbs",
      manufacturer: "TechVision",
      warrantyMonths: 24,
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.PREMIUM,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true,
        warrantyInfo: true
      }
    },
    createdAt: "2025-05-01T10:00:00Z",
    updatedAt: "2025-05-14T08:30:00Z"
  },
  {
    id: "product-th-2",
    name: "Pro Wireless Headphones",
    description: "Premium noise-cancelling headphones with 30-hour battery life",
    price: 0.01,
    images: ["/products/tech-haven/wireless-headphones.jpg"],
    merchantId: "merchant-tech-haven",
    category: ProductCategory.ELECTRONICS,
    sku: "TH-AUDIO-WH-PRO",
    serialNumber: "TH2025051402",
    available: true,
    tags: ["Audio", "Wireless", "Noise-Cancelling"],
    metadata: {
      color: "Matte Black",
      weight: "8.9 oz",
      manufacturer: "SoundMaster",
      warrantyMonths: 12,
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.STANDARD,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true,
        warrantyInfo: true
      }
    },
    createdAt: "2025-05-02T14:30:00Z",
    updatedAt: "2025-05-14T09:15:00Z"
  },
  {
    id: "product-th-3",
    name: "Gaming Laptop Ultra",
    description: "High-performance gaming laptop with RGB keyboard and advanced cooling",
    price: 0.01,
    images: ["/products/tech-haven/gaming-laptop.jpg"],
    merchantId: "merchant-tech-haven",
    category: ProductCategory.ELECTRONICS,
    sku: "TH-LAPTOP-GAME-U",
    serialNumber: "TH2025051403",
    available: true,
    tags: ["Gaming", "Laptop", "High Performance"],
    metadata: {
      processor: "Intel Core i9",
      memory: "32GB DDR5",
      storage: "2TB SSD",
      graphics: "NVIDIA RTX 4080",
      warrantyMonths: 24,
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.LUXURY,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true,
        warrantyInfo: true,
        resellRights: true
      }
    },
    createdAt: "2025-05-03T09:00:00Z",
    updatedAt: "2025-05-14T10:00:00Z"
  },
  {
    id: "product-th-4",
    name: "Smartphone Pro Max",
    description: "Latest flagship smartphone with revolutionary camera system",
    price: 0.01,
    images: ["/products/tech-haven/smartphone-pro.jpg"],
    merchantId: "merchant-tech-haven",
    category: ProductCategory.ELECTRONICS,
    sku: "TH-PHONE-PRO-MAX",
    serialNumber: "TH2025051404",
    available: true,
    tags: ["Smartphone", "Camera", "5G"],
    metadata: {
      display: "6.7-inch OLED",
      camera: "Triple 48MP system",
      storage: "512GB",
      color: "Midnight Blue",
      warrantyMonths: 12,
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.PREMIUM,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true,
        warrantyInfo: true
      }
    },
    createdAt: "2025-05-04T11:45:00Z",
    updatedAt: "2025-05-14T08:20:00Z"
  },
  {
    id: "product-th-5",
    name: "Smart Home Hub",
    description: "Central control for all your smart home devices with voice assistant",
    price: 0.01,
    images: ["/products/tech-haven/smart-home-hub.jpg"],
    merchantId: "merchant-tech-haven",
    category: ProductCategory.ELECTRONICS,
    sku: "TH-SMARTHOME-HUB",
    serialNumber: "TH2025051405",
    available: true,
    tags: ["Smart Home", "IoT", "Voice Control"],
    metadata: {
      connectivity: "Wi-Fi 6, Bluetooth 5.2, Zigbee",
      powerSource: "AC adapter",
      color: "White",
      warrantyMonths: 12,
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.STANDARD,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        serialNumberTracking: true,
        warrantyInfo: true
      }
    },
    createdAt: "2025-05-05T16:20:00Z",
    updatedAt: "2025-05-14T11:10:00Z"
  },
  // Fashion Forward Products (5 examples)
  {
    id: "product-ff-1",
    name: "Designer Leather Handbag",
    description: "Handcrafted luxury leather handbag with signature hardware",
    price: 0.01,
    images: ["/products/fashion-forward/leather-handbag.jpg"],
    merchantId: "merchant-fashion-forward",
    category: ProductCategory.FASHION,
    sku: "FF-BAG-LTHR-1",
    serialNumber: "FF2025051401",
    available: true,
    tags: ["Handbag", "Leather", "Luxury", "Designer"],
    metadata: {
      material: "Full grain calfskin leather",
      dimensions: "12 x 9 x 4 inches",
      color: "Bordeaux",
      madeIn: "Italy",
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.LUXURY,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true,
        resellRights: true
      }
    },
    createdAt: "2025-05-01T09:00:00Z",
    updatedAt: "2025-05-14T09:00:00Z"
  },
  {
    id: "product-ff-2",
    name: "Luxury Silk Scarf",
    description: "Hand-painted silk scarf with limited edition design",
    price: 0.01,
    images: ["/products/fashion-forward/silk-scarf.jpg"],
    merchantId: "merchant-fashion-forward",
    category: ProductCategory.FASHION,
    sku: "FF-ACC-SCARF-1",
    serialNumber: "FF2025051402",
    available: true,
    tags: ["Accessory", "Silk", "Luxury", "Hand-painted"],
    metadata: {
      material: "100% silk twill",
      dimensions: "36 x 36 inches",
      pattern: "Abstract botanical",
      artist: "Eliza Moreau",
      madeIn: "France",
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.PREMIUM,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true
      }
    },
    createdAt: "2025-05-02T10:30:00Z",
    updatedAt: "2025-05-14T09:15:00Z"
  },
  // Home Elegance Products (5 examples)
  {
    id: "product-he-1",
    name: "Crystal Chandelier",
    description: "Hand-cut crystal chandelier with 24k gold-plated fixtures",
    price: 0.01,
    images: ["/products/home-elegance/crystal-chandelier.jpg"],
    merchantId: "merchant-home-elegance",
    category: ProductCategory.HOME,
    sku: "HE-LIGHT-CHAND-1",
    serialNumber: "HE2025051401",
    available: true,
    tags: ["Lighting", "Luxury", "Crystal", "Chandelier"],
    metadata: {
      dimensions: "32 x 32 x 40 inches",
      weight: "45 lbs",
      material: "Lead crystal, 24k gold plating",
      bulbs: "12 x E12 candelabra",
      warrantyMonths: 60,
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.LUXURY,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true,
        warrantyInfo: true,
        resellRights: true
      }
    },
    createdAt: "2025-05-02T10:15:00Z",
    updatedAt: "2025-05-14T10:00:00Z"
  },
  {
    id: "product-he-2",
    name: "Marble Coffee Table",
    description: "Italian Carrara marble coffee table with brass accents",
    price: 0.01,
    images: ["/products/home-elegance/marble-table.jpg"],
    merchantId: "merchant-home-elegance",
    category: ProductCategory.HOME,
    sku: "HE-TABLE-COFFEE-1",
    serialNumber: "HE2025051402",
    available: true,
    tags: ["Furniture", "Marble", "Luxury", "Living Room"],
    metadata: {
      dimensions: "48 x 28 x 17 inches",
      weight: "120 lbs",
      material: "Carrara marble, brass",
      style: "Contemporary",
      madeIn: "Italy",
      warrantyMonths: 36,
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.PREMIUM,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true,
        warrantyInfo: true
      }
    },
    createdAt: "2025-05-03T11:20:00Z",
    updatedAt: "2025-05-14T10:15:00Z"
  },
  
  // Gourmet Eats Products
  {
    id: "product-ge-1",
    name: "Artisanal Olive Oil Collection",
    description: "Premium collection of single-estate olive oils from Mediterranean regions",
    price: 0.01,
    images: ["/products/gourmet-eats/olive-oil-collection.jpg"],
    merchantId: "merchant-gourmet-eats",
    category: ProductCategory.FOOD,
    sku: "GE-OIL-COLL-1",
    serialNumber: "GE2025051401",
    available: true,
    tags: ["Gourmet", "Olive Oil", "Artisanal", "Gift Set"],
    metadata: {
      origin: "Italy, Spain, Greece",
      varieties: "5 bottles, 250ml each",
      includes: "Tasting notes, pairing guide",
      organic: true,
      harvestDate: "Fall 2024"
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.PREMIUM,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true
      }
    },
    createdAt: "2025-05-04T09:00:00Z",
    updatedAt: "2025-05-14T11:00:00Z"
  },
  {
    id: "product-ge-2",
    name: "Single Origin Coffee Subscription",
    description: "Monthly delivery of rare single-origin coffees with tasting notes",
    price: 0.01,
    images: ["/products/gourmet-eats/coffee-subscription.jpg"],
    merchantId: "merchant-gourmet-eats",
    category: ProductCategory.FOOD,
    sku: "GE-COFFEE-SUB-1",
    serialNumber: "GE2025051402",
    available: true,
    tags: ["Coffee", "Subscription", "Single Origin", "Artisanal"],
    metadata: {
      frequency: "Monthly",
      quantity: "12oz per delivery",
      roast: "Customer preference",
      sourcing: "Direct trade",
      includes: "Tasting notes, brewing guide"
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.STANDARD,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        serialNumberTracking: true
      }
    },
    createdAt: "2025-05-04T09:30:00Z",
    updatedAt: "2025-05-14T11:15:00Z"
  },
  {
    id: "product-ge-3",
    name: "Japanese Wagyu A5 Beef",
    description: "Premium A5 grade Japanese Wagyu beef with exceptional marbling",
    price: 0.01,
    images: ["/products/gourmet-eats/wagyu-beef.jpg"],
    merchantId: "merchant-gourmet-eats",
    category: ProductCategory.FOOD,
    sku: "GE-MEAT-WAGYU-1",
    serialNumber: "GE2025051403",
    available: true,
    tags: ["Wagyu", "Beef", "Luxury", "Japanese", "A5"],
    metadata: {
      origin: "Miyazaki, Japan",
      grade: "A5",
      quantity: "2 ribeye steaks (12oz each)",
      marbling: "BMS 10-12",
      shipping: "Flash-frozen, overnight delivery"
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.LUXURY,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true
      }
    },
    createdAt: "2025-05-04T10:00:00Z",
    updatedAt: "2025-05-14T11:30:00Z"
  },
  {
    id: "product-ge-4",
    name: "Rare Vintage Wine Collection",
    description: "Curated collection of rare vintage wines from premier estates",
    price: 0.01,
    images: ["/products/gourmet-eats/vintage-wine.jpg"],
    merchantId: "merchant-gourmet-eats",
    category: ProductCategory.FOOD,
    sku: "GE-WINE-VINTAGE-1",
    serialNumber: "GE2025051404",
    available: true,
    tags: ["Wine", "Vintage", "Luxury", "Collection", "Rare"],
    metadata: {
      bottles: "6 bottles",
      regions: "Bordeaux, Burgundy, Tuscany",
      vintages: "1990-2010",
      storage: "Temperature-controlled",
      includes: "Provenance certificates, tasting notes"
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.LUXURY,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true,
        resellRights: true
      }
    },
    createdAt: "2025-05-04T10:30:00Z",
    updatedAt: "2025-05-14T11:45:00Z"
  },
  {
    id: "product-ge-5",
    name: "Truffle Tasting Experience",
    description: "Premium black and white truffle products with virtual tasting session",
    price: 0.01,
    images: ["/products/gourmet-eats/truffle-tasting.jpg"],
    merchantId: "merchant-gourmet-eats",
    category: ProductCategory.FOOD,
    sku: "GE-TRUFFLE-EXP-1",
    serialNumber: "GE2025051405",
    available: true,
    tags: ["Truffle", "Gourmet", "Tasting", "Experience"],
    metadata: {
      contents: "Truffle oil, salt, honey, and fresh seasonal truffle",
      origin: "Italy and France",
      includes: "Virtual tasting with chef, recipe booklet",
      session: "45-minute private session",
      shipping: "Express, temperature-controlled"
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.PREMIUM,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true
      }
    },
    createdAt: "2025-05-04T11:00:00Z",
    updatedAt: "2025-05-14T12:00:00Z"
  },
  
  // Beauty Bliss Products
  {
    id: "product-bb-1",
    name: "Luxury Skincare Collection",
    description: "Complete luxury skincare regimen with rare botanical extracts",
    price: 0.01,
    images: ["/products/beauty-bliss/skincare-collection.jpg"],
    merchantId: "merchant-beauty-bliss",
    category: ProductCategory.BEAUTY,
    sku: "BB-SKIN-COLL-1",
    serialNumber: "BB2025051401",
    available: true,
    tags: ["Skincare", "Luxury", "Anti-aging", "Botanicals"],
    metadata: {
      products: "7-piece collection",
      ingredients: "Rare plant extracts, peptides, antioxidants",
      suitable: "All skin types",
      packaging: "Sustainable glass and bamboo",
      madeIn: "Switzerland"
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.LUXURY,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true
      }
    },
    createdAt: "2025-05-05T09:00:00Z",
    updatedAt: "2025-05-14T12:15:00Z"
  },
  {
    id: "product-bb-2",
    name: "Custom Fragrance Experience",
    description: "Personalized luxury fragrance crafted to your preferences",
    price: 0.01,
    images: ["/products/beauty-bliss/custom-fragrance.jpg"],
    merchantId: "merchant-beauty-bliss",
    category: ProductCategory.BEAUTY,
    sku: "BB-FRAG-CUSTOM-1",
    serialNumber: "BB2025051402",
    available: true,
    tags: ["Fragrance", "Custom", "Luxury", "Personalized"],
    metadata: {
      process: "Consultation, custom blending, aging",
      volume: "100ml Eau de Parfum",
      packaging: "Crystal bottle with personalized engraving",
      includes: "Formula record for future orders",
      timeline: "4-6 weeks for creation"
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.LUXURY,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true,
        resellRights: true
      }
    },
    createdAt: "2025-05-05T09:30:00Z",
    updatedAt: "2025-05-14T12:30:00Z"
  },
  {
    id: "product-bb-3",
    name: "Professional Makeup Collection",
    description: "Comprehensive luxury makeup collection used by professional artists",
    price: 0.01,
    images: ["/products/beauty-bliss/makeup-collection.jpg"],
    merchantId: "merchant-beauty-bliss",
    category: ProductCategory.BEAUTY,
    sku: "BB-MAKEUP-PRO-1",
    serialNumber: "BB2025051403",
    available: true,
    tags: ["Makeup", "Professional", "Collection", "Luxury"],
    metadata: {
      products: "40-piece collection",
      shades: "Universal range for all skin tones",
      formulation: "Long-wearing, cruelty-free",
      includes: "Professional brushes, trainings",
      packaging: "Professional carrying case"
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.PREMIUM,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true
      }
    },
    createdAt: "2025-05-05T10:00:00Z",
    updatedAt: "2025-05-14T12:45:00Z"
  },
  {
    id: "product-bb-4",
    name: "Rare Botanical Hair Treatment",
    description: "Intensive hair restoration treatment with rare plant extracts",
    price: 0.01,
    images: ["/products/beauty-bliss/hair-treatment.jpg"],
    merchantId: "merchant-beauty-bliss",
    category: ProductCategory.BEAUTY,
    sku: "BB-HAIR-TREAT-1",
    serialNumber: "BB2025051404",
    available: true,
    tags: ["Hair", "Treatment", "Botanical", "Luxury"],
    metadata: {
      ingredients: "Rare Amazonian botanicals, peptides",
      treatment: "8-week progressive system",
      benefits: "Repair, growth, strength, shine",
      suitable: "All hair types",
      usage: "In-salon and at-home components"
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.PREMIUM,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true
      }
    },
    createdAt: "2025-05-05T10:30:00Z",
    updatedAt: "2025-05-14T13:00:00Z"
  },
  {
    id: "product-bb-5",
    name: "Wellness Spa Experience Package",
    description: "Comprehensive luxury spa day with treatments and take-home products",
    price: 0.01,
    images: ["/products/beauty-bliss/spa-package.jpg"],
    merchantId: "merchant-beauty-bliss",
    category: ProductCategory.BEAUTY,
    sku: "BB-SPA-PKG-1",
    serialNumber: "BB2025051405",
    available: true,
    tags: ["Spa", "Wellness", "Experience", "Luxury"],
    metadata: {
      duration: "Full day (6 hours)",
      includes: "Massage, facial, body treatment, lunch",
      products: "Personalized take-home collection",
      location: "Available at partner luxury spas",
      validity: "12 months from purchase"
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.LUXURY,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        serialNumberTracking: true,
        resellRights: true
      }
    },
    createdAt: "2025-05-05T11:00:00Z",
    updatedAt: "2025-05-14T13:15:00Z"
  },
  
  // Digital Dreams Products
  {
    id: "product-dd-1",
    name: "Premium NFT Artwork",
    description: "Limited edition digital artwork from renowned digital artist",
    price: 0.01,
    images: ["/products/digital-dreams/nft-artwork.jpg"],
    merchantId: "merchant-digital-dreams",
    category: ProductCategory.DIGITAL,
    sku: "DD-NFT-ART-1",
    serialNumber: "DD2025051401",
    available: true,
    tags: ["NFT", "Digital Art", "Collectible", "Limited Edition"],
    metadata: {
      artist: "Alexandra Chen",
      edition: "5 of 25",
      dimensions: "8000 x 8000 px",
      format: "Digital + physical display frame",
      rights: "Personal display, resale rights"
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.LUXURY,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true,
        resellRights: true
      }
    },
    createdAt: "2025-05-06T09:00:00Z",
    updatedAt: "2025-05-14T13:30:00Z"
  },
  {
    id: "product-dd-2",
    name: "Virtual Reality Experience Package",
    description: "Premium VR headset with exclusive immersive experiences",
    price: 0.01,
    images: ["/products/digital-dreams/vr-package.jpg"],
    merchantId: "merchant-digital-dreams",
    category: ProductCategory.DIGITAL,
    sku: "DD-VR-PKG-1",
    serialNumber: "DD2025051402",
    available: true,
    tags: ["VR", "Virtual Reality", "Technology", "Experience"],
    metadata: {
      hardware: "Next-gen VR headset with haptic feedback",
      content: "12-month subscription to premium experiences",
      exclusives: "3 collector's edition experiences",
      compatibility: "PC, standalone",
      warranty: "2 years extended coverage"
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.PREMIUM,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true,
        warrantyInfo: true
      }
    },
    createdAt: "2025-05-06T09:30:00Z",
    updatedAt: "2025-05-14T13:45:00Z"
  },
  {
    id: "product-dd-3",
    name: "Premium Software Suite Lifetime License",
    description: "Comprehensive creative software suite with lifetime updates",
    price: 0.01,
    images: ["/products/digital-dreams/software-suite.jpg"],
    merchantId: "merchant-digital-dreams",
    category: ProductCategory.DIGITAL,
    sku: "DD-SOFT-SUITE-1",
    serialNumber: "DD2025051403",
    available: true,
    tags: ["Software", "Creative", "Professional", "Lifetime"],
    metadata: {
      applications: "12 professional applications",
      platforms: "Windows, macOS, Linux, iOS, Android",
      updates: "Lifetime major version updates",
      support: "Premium 24/7 support for 5 years",
      users: "License for 2 users"
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.PREMIUM,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true,
        warrantyInfo: true,
        resellRights: true
      }
    },
    createdAt: "2025-05-06T10:00:00Z",
    updatedAt: "2025-05-14T14:00:00Z"
  },
  {
    id: "product-dd-4",
    name: "Exclusive Digital Music Collection",
    description: "Limited edition digital music collection with lossless audio",
    price: 0.01,
    images: ["/products/digital-dreams/music-collection.jpg"],
    merchantId: "merchant-digital-dreams",
    category: ProductCategory.DIGITAL,
    sku: "DD-MUSIC-COLL-1",
    serialNumber: "DD2025051404",
    available: true,
    tags: ["Music", "Digital", "Collection", "Audiophile"],
    metadata: {
      artists: "5 renowned electronic artists",
      tracks: "40 exclusive tracks",
      format: "24-bit/96kHz lossless audio",
      extras: "Behind-the-scenes content, stems",
      exclusivity: "Not available on streaming platforms"
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.PREMIUM,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true,
        resellRights: true
      }
    },
    createdAt: "2025-05-06T10:30:00Z",
    updatedAt: "2025-05-14T14:15:00Z"
  },
  {
    id: "product-dd-5",
    name: "Digital Collectible Game Assets",
    description: "Rare in-game assets with real-world value and cross-game compatibility",
    price: 0.01,
    images: ["/products/digital-dreams/game-assets.jpg"],
    merchantId: "merchant-digital-dreams",
    category: ProductCategory.DIGITAL,
    sku: "DD-GAME-ASSETS-1",
    serialNumber: "DD2025051405",
    available: true,
    tags: ["Gaming", "Collectible", "Assets", "Blockchain"],
    metadata: {
      items: "10 legendary-tier items",
      games: "Compatible with 5 major game platforms",
      rarity: "Limited edition (500 sets)",
      utility: "In-game advantages, cosmetic uniqueness",
      transferability: "Cross-platform portability"
    },
    nftReceipt: {
      availableTiers: [NFTReceiptTier.STANDARD, NFTReceiptTier.PREMIUM, NFTReceiptTier.LUXURY],
      defaultTier: NFTReceiptTier.LUXURY,
      pricing: {
        [NFTReceiptTier.STANDARD]: 0.01,
        [NFTReceiptTier.PREMIUM]: 0.01,
        [NFTReceiptTier.LUXURY]: 0.01
      },
      encryptionScheme: 'taco-tpre',
      additionalMetadata: {
        authenticityVerification: true,
        serialNumberTracking: true,
        resellRights: true
      }
    },
    createdAt: "2025-05-06T11:00:00Z",
    updatedAt: "2025-05-14T14:30:00Z"
  }
  
  // Totaling 40 products (5 products from each of the 8 merchants)
];

/**
 * Zod schema for product validation
 */
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  images: z.array(z.string()).min(1, "At least one image is required"),
  merchantId: z.string().min(1, "Merchant ID is required"),
  category: z.enum(Object.values(ProductCategory) as [string, ...string[]]),
  sku: z.string().min(1, "SKU is required"),
  serialNumber: z.string().optional(),
  available: z.boolean(),
  tags: z.array(z.string()),
  metadata: z.record(z.string(), z.any()),
  nftReceipt: z.object({
    availableTiers: z.array(z.enum(Object.values(NFTReceiptTier) as [string, ...string[]])),
    defaultTier: z.enum(Object.values(NFTReceiptTier) as [string, ...string[]]),
    pricing: z.record(z.string(), z.number()),
    encryptionScheme: z.string(),
    additionalMetadata: z.object({
      authenticityVerification: z.boolean().optional(),
      serialNumberTracking: z.boolean().optional(),
      warrantyInfo: z.boolean().optional(),
      resellRights: z.boolean().optional()
    }).optional()
  }),
  createdAt: z.string(),
  updatedAt: z.string()
});

/**
 * Get a product by ID
 */
export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

/**
 * Get a merchant by ID
 */
export function getMerchantById(id: string): Merchant | undefined {
  return merchants.find(merchant => merchant.id === id);
}

/**
 * Get products by merchant ID
 */
export function getProductsByMerchant(merchantId: string): Product[] {
  return products.filter(product => product.merchantId === merchantId);
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): Product[] {
  return products.filter(product => product.category === category);
}

/**
 * Get merchant by product ID
 */
export function getMerchantByProductId(productId: string): Merchant | undefined {
  const product = getProductById(productId);
  if (!product) return undefined;
  return getMerchantById(product.merchantId);
}

/**
 * Calculate NFT receipt price based on product and tier
 */
export function calculateNFTReceiptPrice(
  product: Product, 
  tier: typeof NFTReceiptTier[keyof typeof NFTReceiptTier]
): number {
  return product.nftReceipt.pricing[tier] || 0.99;
}

/**
 * Calculate total price (product + NFT receipt)
 */
export function calculateTotalPrice(
  product: Product,
  tier: typeof NFTReceiptTier[keyof typeof NFTReceiptTier]
): number {
  return product.price + calculateNFTReceiptPrice(product, tier);
}
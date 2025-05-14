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
    price: 1299.99,
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
        [NFTReceiptTier.STANDARD]: 0.99,
        [NFTReceiptTier.PREMIUM]: 2.99,
        [NFTReceiptTier.LUXURY]: 5.00
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
    price: 349.99,
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
        [NFTReceiptTier.STANDARD]: 0.99,
        [NFTReceiptTier.PREMIUM]: 2.99,
        [NFTReceiptTier.LUXURY]: 5.00
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
    price: 1899.99,
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
        [NFTReceiptTier.STANDARD]: 0.99,
        [NFTReceiptTier.PREMIUM]: 2.99,
        [NFTReceiptTier.LUXURY]: 5.00
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
    price: 1099.99,
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
        [NFTReceiptTier.STANDARD]: 0.99,
        [NFTReceiptTier.PREMIUM]: 2.99,
        [NFTReceiptTier.LUXURY]: 5.00
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
    price: 199.99,
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
        [NFTReceiptTier.STANDARD]: 0.99,
        [NFTReceiptTier.PREMIUM]: 2.99,
        [NFTReceiptTier.LUXURY]: 5.00
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
    price: 1250.00,
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
        [NFTReceiptTier.STANDARD]: 0.99,
        [NFTReceiptTier.PREMIUM]: 2.99,
        [NFTReceiptTier.LUXURY]: 5.00
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
    price: 225.00,
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
        [NFTReceiptTier.STANDARD]: 0.99,
        [NFTReceiptTier.PREMIUM]: 2.99,
        [NFTReceiptTier.LUXURY]: 5.00
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
    price: 2499.99,
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
        [NFTReceiptTier.STANDARD]: 0.99,
        [NFTReceiptTier.PREMIUM]: 2.99,
        [NFTReceiptTier.LUXURY]: 5.00
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
    price: 1850.00,
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
        [NFTReceiptTier.STANDARD]: 0.99,
        [NFTReceiptTier.PREMIUM]: 2.99,
        [NFTReceiptTier.LUXURY]: 5.00
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
  // Add more products for each merchant...

  // Totaling 40 products
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
/**
 * Seed script for the NFT Pool database
 * 
 * This script populates the NFT pool with initial data for testing
 * Run with: node scripts/seed-nft-pool.js
 */

import * as dotenv from 'dotenv';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Set WebSocket constructor for Neon
neonConfig.webSocketConstructor = ws;

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

// Create database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Initial NFT pool data - collection of NFTs to populate the database
const nftPoolData = [
  // Basic tier NFTs
  {
    nft_id: 'basic-001',
    name: 'Receipt Warrior',
    description: 'A heroic receipt ready to battle expense reports',
    image: 'https://storage.googleapis.com/blockreceipt/nft-images/receipt-warrior.svg',
    tier: 'basic',
    metadata_uri: 'ipfs://QmNfYSJKXPQFv1JTJbQHbcbYwCdGXqFNpE8AdwSXAiTc9v',
    categories: ['gaming', 'pixel', 'receipts'],
    enabled: true
  },
  {
    nft_id: 'basic-002',
    name: 'Digital Receipt Collector',
    description: 'For those who prefer their receipts in digital form',
    image: 'https://storage.googleapis.com/blockreceipt/nft-images/digital-receipt.svg',
    tier: 'basic',
    metadata_uri: 'ipfs://QmNfYSJKXPQFv1JTJbQHbcbYwCdGXqFNpE8AdwSXAiTc9w',
    categories: ['digital', 'receipts', 'collector'],
    enabled: true
  },
  {
    nft_id: 'basic-003',
    name: 'Receipt Pixel Art',
    description: 'Retro-style pixel art of your favorite receipt',
    image: 'https://storage.googleapis.com/blockreceipt/nft-images/pixel-receipt.svg',
    tier: 'basic',
    metadata_uri: 'ipfs://QmNfYSJKXPQFv1JTJbQHbcbYwCdGXqFNpE8AdwSXAiTc9x',
    categories: ['pixel', 'art', 'receipts'],
    enabled: true
  },
  {
    nft_id: 'basic-004',
    name: 'Grocery Receipt',
    description: 'A stylized representation of grocery shopping receipts',
    image: 'https://storage.googleapis.com/blockreceipt/nft-images/grocery-receipt.svg',
    tier: 'basic',
    metadata_uri: 'ipfs://QmNfYSJKXPQFv1JTJbQHbcbYwCdGXqFNpE8AdwSXAiTc9y',
    categories: ['grocery', 'shopping', 'receipts'],
    enabled: true
  },
  {
    nft_id: 'basic-005',
    name: 'Coffee Shop Receipt',
    description: 'For coffee enthusiasts who track their caffeine expenditures',
    image: 'https://storage.googleapis.com/blockreceipt/nft-images/coffee-receipt.svg',
    tier: 'basic',
    metadata_uri: 'ipfs://QmNfYSJKXPQFv1JTJbQHbcbYwCdGXqFNpE8AdwSXAiTc9z',
    categories: ['coffee', 'food', 'receipts'],
    enabled: true
  },
  
  // Premium tier NFTs
  {
    nft_id: 'premium-001',
    name: 'Golden Receipt',
    description: 'A luxurious golden receipt for your premium purchases',
    image: 'https://storage.googleapis.com/blockreceipt/nft-images/golden-receipt.svg',
    tier: 'premium',
    metadata_uri: 'ipfs://QmNfYSJKXPQFv1JTJbQHbcbYwCdGXqFNpE8AdwSXAiTd9v',
    categories: ['luxury', 'gold', 'receipts'],
    enabled: true
  },
  {
    nft_id: 'premium-002',
    name: 'Receipt Mage',
    description: 'A magical character that transforms receipts into organized data',
    image: 'https://storage.googleapis.com/blockreceipt/nft-images/receipt-mage.svg',
    tier: 'premium',
    metadata_uri: 'ipfs://QmNfYSJKXPQFv1JTJbQHbcbYwCdGXqFNpE8AdwSXAiTd9w',
    categories: ['fantasy', 'magic', 'receipts'],
    enabled: true
  },
  {
    nft_id: 'premium-003',
    name: 'Tech Receipt Collector',
    description: 'A futuristic receipt visualizer for technology enthusiasts',
    image: 'https://storage.googleapis.com/blockreceipt/nft-images/tech-receipt.svg',
    tier: 'premium',
    metadata_uri: 'ipfs://QmNfYSJKXPQFv1JTJbQHbcbYwCdGXqFNpE8AdwSXAiTd9x',
    categories: ['tech', 'gadgets', 'receipts'],
    enabled: true
  },
  {
    nft_id: 'premium-004',
    name: 'Fashion Receipt Tracker',
    description: 'Keep track of your fashion purchases in style',
    image: 'https://storage.googleapis.com/blockreceipt/nft-images/fashion-receipt.svg',
    tier: 'premium',
    metadata_uri: 'ipfs://QmNfYSJKXPQFv1JTJbQHbcbYwCdGXqFNpE8AdwSXAiTd9y',
    categories: ['fashion', 'clothing', 'receipts'],
    enabled: true
  },
  {
    nft_id: 'premium-005',
    name: 'Restaurant Receipt Collection',
    description: 'A foodie\'s dream for tracking culinary adventures',
    image: 'https://storage.googleapis.com/blockreceipt/nft-images/restaurant-receipt.svg',
    tier: 'premium',
    metadata_uri: 'ipfs://QmNfYSJKXPQFv1JTJbQHbcbYwCdGXqFNpE8AdwSXAiTd9z',
    categories: ['food', 'restaurant', 'receipts'],
    enabled: true
  },
  
  // Luxury tier NFTs
  {
    nft_id: 'luxury-001',
    name: 'Diamond Receipt',
    description: 'The ultimate receipt for luxury purchases',
    image: 'https://storage.googleapis.com/blockreceipt/nft-images/diamond-receipt.svg',
    tier: 'luxury',
    metadata_uri: 'ipfs://QmNfYSJKXPQFv1JTJbQHbcbYwCdGXqFNpE8AdwSXAiTe9v',
    categories: ['diamond', 'luxury', 'receipts'],
    enabled: true
  },
  {
    nft_id: 'luxury-002',
    name: 'Receipt Titan',
    description: 'A powerful titan that guards your most valuable receipt data',
    image: 'https://storage.googleapis.com/blockreceipt/nft-images/receipt-titan.svg',
    tier: 'luxury',
    metadata_uri: 'ipfs://QmNfYSJKXPQFv1JTJbQHbcbYwCdGXqFNpE8AdwSXAiTe9w',
    categories: ['mythical', 'power', 'receipts'],
    enabled: true
  },
  {
    nft_id: 'luxury-003',
    name: 'Executive Receipt Suite',
    description: 'For executives who need comprehensive receipt management',
    image: 'https://storage.googleapis.com/blockreceipt/nft-images/executive-receipt.svg',
    tier: 'luxury',
    metadata_uri: 'ipfs://QmNfYSJKXPQFv1JTJbQHbcbYwCdGXqFNpE8AdwSXAiTe9x',
    categories: ['business', 'executive', 'receipts'],
    enabled: true
  },
  {
    nft_id: 'luxury-004',
    name: 'Space Explorer Receipt',
    description: 'For tracking expenses beyond this world',
    image: 'https://storage.googleapis.com/blockreceipt/nft-images/space-receipt.svg',
    tier: 'luxury',
    metadata_uri: 'ipfs://QmNfYSJKXPQFv1JTJbQHbcbYwCdGXqFNpE8AdwSXAiTe9y',
    categories: ['space', 'exploration', 'receipts'],
    enabled: true
  },
  {
    nft_id: 'luxury-005',
    name: 'Collector\'s Receipt Vault',
    description: 'A prestigious vault for storing your most valuable receipt data',
    image: 'https://storage.googleapis.com/blockreceipt/nft-images/vault-receipt.svg',
    tier: 'luxury',
    metadata_uri: 'ipfs://QmNfYSJKXPQFv1JTJbQHbcbYwCdGXqFNpE8AdwSXAiTe9z',
    categories: ['vault', 'collector', 'receipts'],
    enabled: true
  }
];

// Function to insert data into the NFT pool table
async function seedNftPool() {
  const client = await pool.connect();
  
  try {
    // Start a transaction
    await client.query('BEGIN');
    
    // Check if table exists, create if not
    await client.query(`
      CREATE TABLE IF NOT EXISTS nft_pool (
        id SERIAL PRIMARY KEY,
        nft_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        image TEXT NOT NULL,
        description TEXT NOT NULL,
        tier TEXT NOT NULL,
        metadata_uri TEXT NOT NULL,
        categories TEXT[] NOT NULL,
        enabled BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      )
    `);
    
    console.log('NFT pool table ensured');
    
    // Clear existing data (optional - uncomment if you want to reset)
    // await client.query('DELETE FROM nft_pool');
    // console.log('Cleared existing NFT pool data');
    
    // Insert each NFT
    let insertedCount = 0;
    
    for (const nft of nftPoolData) {
      try {
        const result = await client.query(`
          INSERT INTO nft_pool
            (nft_id, name, image, description, tier, metadata_uri, categories, enabled)
          VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (nft_id) DO NOTHING
          RETURNING id
        `, [
          nft.nft_id,
          nft.name,
          nft.image,
          nft.description,
          nft.tier,
          nft.metadata_uri,
          nft.categories,
          nft.enabled
        ]);
        
        if (result.rows.length > 0) {
          console.log(`Inserted NFT: ${nft.name} (ID: ${nft.nft_id})`);
          insertedCount++;
        } else {
          console.log(`NFT already exists: ${nft.name} (ID: ${nft.nft_id})`);
        }
      } catch (error) {
        console.error(`Error inserting NFT ${nft.nft_id}:`, error);
        throw error; // Re-throw to trigger transaction rollback
      }
    }
    
    // Commit the transaction
    await client.query('COMMIT');
    
    console.log(`Successfully inserted ${insertedCount} new NFTs into the pool`);
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error seeding NFT pool:', error);
  } finally {
    // Release the client back to the pool
    client.release();
  }
}

// Run the seed function
seedNftPool()
  .then(() => {
    console.log('NFT pool seeding completed');
    pool.end(); // Close the pool connection
  })
  .catch(error => {
    console.error('NFT pool seeding failed:', error);
    pool.end(); // Close the pool connection
    process.exit(1);
  });
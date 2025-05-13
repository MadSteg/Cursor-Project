// This script provides a mock minting endpoint for testing without requiring Stripe
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let tokenIdCounter = 1;

// Mock receipt minting endpoint
app.post('/receipt/mock', (req, res) => {
  const tokenId = tokenIdCounter++;
  
  console.log(`🔨 Minting mock receipt with tokenId: ${tokenId}`);
  
  // Create a mock response similar to what would be returned by the actual blockchain service
  setTimeout(() => {
    res.json({
      tokenId: tokenId,
      cid: `bafybeia${Math.random().toString(36).substring(2, 15)}`,
      txHash: `0x${Math.random().toString(36).substring(2, 15)}`,
      message: "Mock receipt minted on Polygon Mumbai"
    });
  }, 1000); // Simulate blockchain delay
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'MemoryChain mock service running',
    config: {
      stripeEnabled: false,
      mumbaiEnabled: process.env.WALLET_PRIVATE_KEY !== '0xYOUR_TEST_WALLET_PRIVATE_KEY'
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`⚠️  Stripe disabled (dummy keys)`);
  
  if (process.env.WALLET_PRIVATE_KEY === '0xYOUR_TEST_WALLET_PRIVATE_KEY') {
    console.log(`⚠️  Using example wallet key - replace with your real key in .env file`);
  }
});
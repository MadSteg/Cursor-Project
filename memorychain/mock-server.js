// A simple mock server implementation for MemoryChain on Mumbai
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

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
    const mockTxHash = `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const mockCid = `bafybei${Math.random().toString(36).substring(2, 30)}`;
    
    console.log(`✅ Mock transaction hash: ${mockTxHash}`);
    console.log(`📦 Mock IPFS CID: ${mockCid}`);
    
    res.json({
      tokenId: tokenId,
      cid: mockCid,
      txHash: mockTxHash,
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
  console.log(`⚠️  Stripe disabled (using dummy keys)`);
  console.log(`⚠️  IPFS disabled (using mock CID generation)`);
  
  if (process.env.WALLET_PRIVATE_KEY === '0xYOUR_TEST_WALLET_PRIVATE_KEY') {
    console.log(`⚠️  Using example wallet key - replace with your real key in .env file`);
  }
});
// Generate block explorer links for the wallet
import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

function getPrivateKey() {
  const walletKey = process.env.WALLET_PRIVATE_KEY || '';
  const blockchainKey = process.env.BLOCKCHAIN_PRIVATE_KEY || '';
  
  if (walletKey && walletKey.trim() !== '') {
    return walletKey;
  }
  
  if (blockchainKey && blockchainKey.trim() !== '') {
    return blockchainKey;
  }
  
  return '0x0000000000000000000000000000000000000000000000000000000000000001';
}

// Define explorer URLs
const explorers = [
  {
    network: 'Polygon Amoy Testnet',
    url: 'https://amoy.polygonscan.com/address/'
  },
  {
    network: 'Polygon Mumbai Testnet',
    url: 'https://mumbai.polygonscan.com/address/'
  },
  {
    network: 'Polygon Mainnet',
    url: 'https://polygonscan.com/address/'
  }
];

function generateExplorerLinks() {
  try {
    // Get wallet address
    const privateKey = getPrivateKey();
    const wallet = new ethers.Wallet(privateKey);
    const address = wallet.address;
    
    console.log(`Generating block explorer links for: ${address}`);
    console.log('='.repeat(60));
    
    // Generate links for each explorer
    explorers.forEach(explorer => {
      const fullUrl = `${explorer.url}${address}`;
      console.log(`[${explorer.network}]`);
      console.log(`  ${fullUrl}`);
      console.log('-'.repeat(60));
    });
    
    console.log('\nOpen these links in your browser to check wallet balance');
    console.log('The wallet should have MATIC on Polygon Amoy Testnet to deploy the contract');
    
  } catch (error) {
    console.error('Error generating explorer links:', error);
  }
}

// Run the function
generateExplorerLinks();
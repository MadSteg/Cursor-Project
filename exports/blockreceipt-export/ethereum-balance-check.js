// Check Ethereum mainnet and other Ethereum networks
import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get private key directly
const privateKey = process.env.WALLET_PRIVATE_KEY || process.env.BLOCKCHAIN_PRIVATE_KEY;
if (!privateKey) {
  console.error('ERROR: No private key found in environment variables');
  process.exit(1);
}

// Create wallet
const wallet = new ethers.Wallet(privateKey);
const walletAddress = wallet.address;
console.log(`Wallet address: ${walletAddress}`);

// Define networks to check
const networks = [
  {
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr',
    chainId: 1,
    currency: 'ETH'
  },
  {
    name: 'Ethereum Sepolia Testnet',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr',
    chainId: 11155111,
    currency: 'ETH'
  },
  {
    name: 'Polygon Mainnet',
    rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr',
    chainId: 137,
    currency: 'MATIC'
  },
  {
    name: 'Polygon Mumbai Testnet',
    rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr',
    chainId: 80001,
    currency: 'MATIC'
  },
  {
    name: 'Polygon Amoy Testnet',
    rpcUrl: 'https://polygon-amoy.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr',
    chainId: 80002,
    currency: 'MATIC'
  }
];

async function checkBalances() {
  console.log('Checking wallet balances across networks...');
  console.log('='.repeat(60));
  
  for (const network of networks) {
    console.log(`\n[${network.name}]`);
    
    try {
      // Create provider
      const provider = new ethers.providers.JsonRpcProvider(
        network.rpcUrl, 
        { 
          name: network.name.toLowerCase().replace(/\s+/g, '-'), 
          chainId: network.chainId 
        }
      );
      
      // Get balance
      try {
        const balance = await provider.getBalance(walletAddress);
        const formattedBalance = ethers.utils.formatEther(balance);
        console.log(`✓ Balance: ${formattedBalance} ${network.currency}`);
        
        // If balance is above zero, print extra info
        if (balance.gt(0)) {
          console.log(`🔔 FUNDS DETECTED on ${network.name}`);
          console.log(`  This wallet has ${formattedBalance} ${network.currency}`);
          
          if (network.name !== 'Polygon Amoy Testnet') {
            console.log(`  NOTE: These funds are NOT on Amoy testnet and cannot be used for our deployment`);
            
            if (network.name === 'Ethereum Mainnet') {
              console.log(`  To use these funds, you would need to bridge ETH to Polygon Amoy`);
              console.log(`  Consider funding Amoy directly through a faucet instead`);
            }
          }
        }
        
      } catch (balanceError) {
        console.log(`✗ Error checking balance: ${balanceError.message}`);
      }
      
    } catch (providerError) {
      console.log(`✗ Network connection failed: ${providerError.message}`);
    }
  }
  
  console.log('\n='.repeat(60));
  console.log('SUMMARY:');
  console.log('1. To deploy on Polygon Amoy, you need MATIC tokens on the Amoy testnet');
  console.log('2. ETH on Ethereum cannot be used directly on Polygon Amoy');
  console.log('3. Get Amoy testnet MATIC from: https://amoy.polygon.technology/');
  console.log('4. Alternative: Use Remix IDE to deploy from a browser wallet with Amoy MATIC');
}

// Run the check
checkBalances();
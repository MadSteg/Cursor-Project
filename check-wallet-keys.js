// Check both wallet private keys
import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkWalletKeys() {
  try {
    // Check if keys exist and get their values
    const walletKey = process.env.WALLET_PRIVATE_KEY || '';
    const blockchainKey = process.env.BLOCKCHAIN_PRIVATE_KEY || '';
    
    console.log('Checking wallet keys in environment variables:');
    console.log('-'.repeat(50));
    
    // Check WALLET_PRIVATE_KEY
    console.log('WALLET_PRIVATE_KEY:');
    if (!walletKey || walletKey.trim() === '') {
      console.log('  Status: Empty or missing');
      console.log('  Address: N/A');
    } else {
      try {
        const wallet1 = new ethers.Wallet(walletKey);
        console.log(`  Status: Valid`);
        console.log(`  Address: ${wallet1.address}`);
        
        // Connect to Amoy and check balance
        const provider1 = new ethers.providers.JsonRpcProvider(
          'https://polygon-amoy.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr',
          { name: 'amoy', chainId: 80002 }
        );
        const connectedWallet1 = wallet1.connect(provider1);
        const balance1 = await provider1.getBalance(wallet1.address);
        console.log(`  Balance: ${ethers.utils.formatEther(balance1)} MATIC on Amoy testnet`);
      } catch (error) {
        console.log(`  Status: Invalid (${error.message})`);
      }
    }
    
    console.log('-'.repeat(50));
    
    // Check BLOCKCHAIN_PRIVATE_KEY
    console.log('BLOCKCHAIN_PRIVATE_KEY:');
    if (!blockchainKey || blockchainKey.trim() === '') {
      console.log('  Status: Empty or missing');
      console.log('  Address: N/A');
    } else {
      try {
        const wallet2 = new ethers.Wallet(blockchainKey);
        console.log(`  Status: Valid`);
        console.log(`  Address: ${wallet2.address}`);
        
        // Connect to Amoy and check balance
        const provider2 = new ethers.providers.JsonRpcProvider(
          'https://polygon-amoy.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr',
          { name: 'amoy', chainId: 80002 }
        );
        const connectedWallet2 = wallet2.connect(provider2);
        const balance2 = await provider2.getBalance(wallet2.address);
        console.log(`  Balance: ${ethers.utils.formatEther(balance2)} MATIC on Amoy testnet`);
      } catch (error) {
        console.log(`  Status: Invalid (${error.message})`);
      }
    }
    
    console.log('-'.repeat(50));
    console.log('\nNOTE: If both keys are empty or invalid, set a valid private key in .env');
    
  } catch (error) {
    console.error('Error checking wallet keys:', error);
  }
}

// Run the check
checkWalletKeys();
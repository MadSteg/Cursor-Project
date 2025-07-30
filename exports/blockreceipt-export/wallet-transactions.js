// Check transactions for the wallet on Amoy
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

async function checkWalletHistory() {
  // Amoy network config and RPC
  const amoyRpc = 'https://polygon-amoy.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr';
  const provider = new ethers.providers.JsonRpcProvider(amoyRpc, {
    name: 'amoy',
    chainId: 80002
  });
  
  try {
    // Check latest block number
    const latestBlock = await provider.getBlockNumber();
    console.log(`Current Amoy block number: ${latestBlock}`);
    
    // Check balance
    const balance = await provider.getBalance(walletAddress);
    console.log(`Current balance: ${ethers.utils.formatEther(balance)} MATIC`);
    
    // Try to get transaction count
    const txCount = await provider.getTransactionCount(walletAddress);
    console.log(`Transaction count: ${txCount}`);
    
    if (txCount === 0) {
      console.log('This wallet has never sent any transactions on Amoy testnet.');
    } else {
      console.log(`This wallet has sent ${txCount} transactions on Amoy testnet.`);
    }
    
    // Check for incoming transactions by scanning recent blocks
    console.log('\nScanning for incoming transactions...');
    let foundTx = false;
    
    // Check last 100 blocks
    const startBlock = Math.max(1, latestBlock - 100);
    console.log(`Scanning blocks ${startBlock} to ${latestBlock}`);
    
    for (let i = latestBlock; i >= startBlock; i--) {
      const block = await provider.getBlockWithTransactions(i);
      for (const tx of block.transactions) {
        if (tx.to?.toLowerCase() === walletAddress.toLowerCase()) {
          console.log(`Found incoming transaction in block ${i}: ${tx.hash}`);
          console.log(`  From: ${tx.from}`);
          console.log(`  Value: ${ethers.utils.formatEther(tx.value)} MATIC`);
          foundTx = true;
        }
      }
    }
    
    if (!foundTx) {
      console.log(`No incoming transactions found in the last 100 blocks.`);
    }
    
    console.log('\nPossible issues:');
    console.log('1. Your 51 MATIC might be on a different network (Mumbai or Mainnet)');
    console.log('2. You might be using a different wallet address on Amoy');
    console.log('3. The funds might not have been transferred to Amoy yet');
    
    console.log('\nFaucet Information:');
    console.log('Polygon Amoy Faucet: https://amoy.polygon.technology/');
    
  } catch (error) {
    console.error(`Error checking wallet history: ${error.message}`);
  }
}

// Run the check
checkWalletHistory();
// Advanced wallet balance check with raw JSON output
import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get private key directly without any fallback
const privateKey = process.env.WALLET_PRIVATE_KEY || process.env.BLOCKCHAIN_PRIVATE_KEY;
if (!privateKey) {
  console.error('ERROR: No private key found in environment variables');
  process.exit(1);
}

// Create wallet
const wallet = new ethers.Wallet(privateKey);
console.log(`Wallet address: ${wallet.address}`);

// Define Amoy provider with detailed logging
async function checkAmoyBalance() {
  console.log('\n--- AMOY TESTNET CONNECTIVITY TEST ---');
  
  // Explicit Amoy network config
  const amoyNetwork = {
    name: 'amoy',
    chainId: 80002
  };
  
  // Use hardcoded Alchemy Amoy RPC
  const rpcUrl = 'https://polygon-amoy.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr';
  console.log(`RPC URL: ${rpcUrl}`);
  
  try {
    // Create provider with explicit network definition
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl, amoyNetwork);
    
    // Test basic connectivity
    console.log('Testing provider connection...');
    const network = await provider.getNetwork();
    console.log(`Connected to network: ${network.name} (chainId: ${network.chainId})`);
    
    // Try to get block number
    const blockNumber = await provider.getBlockNumber();
    console.log(`Current block number: ${blockNumber}`);
    
    // Get gas price
    const gasPrice = await provider.getGasPrice();
    console.log(`Current gas price: ${ethers.utils.formatUnits(gasPrice, "gwei")} gwei`);
    
    // Check balance (with detailed error handling)
    console.log(`\nChecking balance for address: ${wallet.address}`);
    try {
      const balanceWei = await provider.getBalance(wallet.address);
      const balanceMatic = ethers.utils.formatEther(balanceWei);
      console.log(`Balance: ${balanceMatic} MATIC (${balanceWei.toString()} wei)`);
    } catch (balanceError) {
      console.error(`Error getting balance: ${balanceError.message}`);
      console.error(balanceError);
    }
    
    // Try a raw JSON-RPC call
    console.log('\nTrying raw JSON-RPC call...');
    const balance = await provider.send('eth_getBalance', [wallet.address, 'latest']);
    console.log(`Raw balance result: ${balance} (${parseInt(balance, 16)} wei)`);
    
  } catch (error) {
    console.error(`Provider error: ${error.message}`);
    console.error(error);
  }
}

// Run the checks
checkAmoyBalance();
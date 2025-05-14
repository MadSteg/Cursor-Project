// Script to check the wallet balance on Amoy testnet
import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkBalance() {
  try {
    // Get RPC URL
    const apiKey = process.env.ALCHEMY_RPC;
    if (!apiKey) {
      throw new Error('Missing ALCHEMY_RPC environment variable');
    }
    
    // Construct the full RPC URL
    const rpcUrl = `https://polygon-amoy.g.alchemy.com/v2/${apiKey}`;
    console.log(`Using RPC URL: ${rpcUrl}`);

    // Define Amoy network
    const amoyNetwork = {
      name: 'amoy',
      chainId: 80002
    };

    // Create provider
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl, amoyNetwork);
    
    // Test connection
    const blockNumber = await provider.getBlockNumber();
    console.log(`Connected to Amoy testnet. Current block: ${blockNumber}`);
    
    // Get wallet private key
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('Missing WALLET_PRIVATE_KEY environment variable');
    }
    
    // Create wallet
    const wallet = new ethers.Wallet(privateKey, provider);
    const address = wallet.address;
    console.log(`Checking balance for wallet address: ${address}`);
    
    // Get balance
    const balanceWei = await provider.getBalance(address);
    const balanceEth = ethers.utils.formatEther(balanceWei);
    
    console.log(`Wallet balance: ${balanceWei.toString()} wei`);
    console.log(`Wallet balance: ${balanceEth} MATIC`);
    
    // Check if balance is sufficient for deployment
    if (balanceWei.lt(ethers.utils.parseEther('0.1'))) {
      console.log('WARNING: Balance may be insufficient for contract deployment');
      console.log('Recommended to have at least 0.1 MATIC for gas fees');
    } else {
      console.log('Balance appears sufficient for contract deployment');
    }
    
  } catch (error) {
    console.error('Error checking balance:', error);
  }
}

// Run the function
checkBalance();
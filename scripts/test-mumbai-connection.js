// Simple script to test connection to Mumbai
const { ethers } = require('ethers');
require('dotenv').config();

async function main() {
  console.log('Testing connection to Mumbai Testnet...');
  
  if (!process.env.POLYGON_MUMBAI_RPC_URL) {
    throw new Error('POLYGON_MUMBAI_RPC_URL not set in environment');
  }
  
  console.log('Using RPC URL:', process.env.POLYGON_MUMBAI_RPC_URL);
  
  try {
    // Create provider
    const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_MUMBAI_RPC_URL);
    console.log('Provider created');
    
    // Try to get the network
    const network = await provider.getNetwork();
    console.log('Successfully connected to network:', {
      name: network.name,
      chainId: network.chainId
    });
    
    // Get block number to verify
    const blockNumber = await provider.getBlockNumber();
    console.log('Current block number:', blockNumber);
    
    return {
      success: true,
      network,
      blockNumber
    };
  } catch (error) {
    console.error('Error connecting to Mumbai:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

main()
  .then(result => {
    console.log('Test completed with result:', result);
    process.exit(0);
  })
  .catch(error => {
    console.error('Test failed with error:', error);
    process.exit(1);
  });
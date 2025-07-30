// Check wallet balance across multiple networks
import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define test networks
const networks = [
  {
    name: 'Polygon Amoy',
    chainId: 80002,
    rpcUrl: 'https://polygon-amoy.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr'
  },
  {
    name: 'Polygon Mumbai',
    chainId: 80001,
    rpcUrl: 'https://polygon-mumbai.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr'
  },
  {
    name: 'Polygon Mainnet',
    chainId: 137,
    rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr'
  }
];

// Use an alternative private key if WALLET_PRIVATE_KEY is empty
function getPrivateKey() {
  const privateKey = process.env.WALLET_PRIVATE_KEY || process.env.BLOCKCHAIN_PRIVATE_KEY;
  
  if (!privateKey || privateKey.trim() === '') {
    console.error('No private key found in environment variables. Using fallback key for address display only.');
    return '0x0000000000000000000000000000000000000000000000000000000000000001';
  }
  
  return privateKey;
}

async function checkBalanceAcrossNetworks() {
  try {
    const privateKey = getPrivateKey();
    const wallet = new ethers.Wallet(privateKey);
    const walletAddress = wallet.address;
    
    console.log(`Checking balances for wallet address: ${walletAddress}`);
    console.log('='.repeat(50));
    
    // Check each network
    for (const network of networks) {
      try {
        const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl, {
          name: network.name,
          chainId: network.chainId
        });
        
        // Try to get current block
        let blockInfo = '(connection failed)';
        try {
          const blockNumber = await provider.getBlockNumber();
          blockInfo = `block #${blockNumber}`;
        } catch (blockError) {
          // Ignore block error and continue
        }
        
        // Connect wallet to this provider
        const connectedWallet = wallet.connect(provider);
        
        // Get balance
        const balanceWei = await provider.getBalance(walletAddress);
        const balanceEth = ethers.utils.formatEther(balanceWei);
        
        console.log(`[${network.name}] (${blockInfo}):`);
        console.log(`  Balance: ${balanceEth} MATIC (${balanceWei.toString()} wei)`);
        
      } catch (error) {
        console.log(`[${network.name}]: Connection failed - ${error.message}`);
      }
      
      console.log('-'.repeat(50));
    }
    
    console.log('\nTIP: If balance shows as 0 on all networks, the private key in .env may be invalid');
    console.log('TIP: Check the wallet address in a block explorer to verify funds');
    
  } catch (error) {
    console.error('Error checking balances:', error);
  }
}

// Run the check
checkBalanceAcrossNetworks();
// Enhanced deployment script for Receipt1155Enhanced contract
import { ethers } from 'ethers';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check for required environment variables
const requiredEnvVars = [
  'WALLET_PRIVATE_KEY',
  'ALCHEMY_RPC'
];

// Check for simulation mode
const SIMULATE = process.env.SIMULATE === 'true';

// Validate environment variables if not in simulation mode
if (!SIMULATE) {
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Set SIMULATE=true to run in simulation mode without these variables.');
    process.exit(1);
  }
}

// Function to deploy the contract
async function deployContract() {
  try {
    // If in simulation mode, return a fake address
    if (SIMULATE) {
      console.log('Running in simulation mode...');
      const simulatedAddress = '0x' + '1'.repeat(40); // 0x1111...1111
      console.log(`Simulated contract deployed at: ${simulatedAddress}`);
      updateEnvFile(simulatedAddress);
      return simulatedAddress;
    }
    
    // Setup provider and wallet
    const rpcUrl = process.env.ALCHEMY_RPC.startsWith('http') 
      ? process.env.ALCHEMY_RPC 
      : `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_RPC}`;
    
    const network = {
      name: 'amoy',
      chainId: 80002
    };
    
    console.log(`Connecting to Polygon Amoy at: ${rpcUrl}`);
    
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl, network);
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
    const walletAddress = wallet.address;
    
    console.log(`Using wallet address: ${walletAddress}`);
    
    // Check wallet balance
    const balance = await provider.getBalance(walletAddress);
    console.log(`Wallet balance: ${ethers.utils.formatEther(balance)} MATIC`);
    
    if (balance.eq(0)) {
      console.error('Wallet has 0 MATIC. Please fund the wallet before deploying.');
      process.exit(1);
    }
    
    // Load contract artifacts
    const contractPath = path.join(__dirname, 'artifacts/contracts/Receipt1155Enhanced.sol/Receipt1155Enhanced.json');
    let contractJson;
    
    try {
      if (fs.existsSync(contractPath)) {
        contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
      } else {
        console.error(`Contract artifact not found at ${contractPath}. Run 'npx hardhat compile' first.`);
        process.exit(1);
      }
    } catch (error) {
      console.error('Error reading contract artifact:', error);
      process.exit(1);
    }
    
    // Deploy contract
    console.log('Deploying Receipt1155Enhanced contract...');
    const factory = new ethers.ContractFactory(
      contractJson.abi,
      contractJson.bytecode,
      wallet
    );
    
    const contract = await factory.deploy(walletAddress); // Pass wallet address as initialOwner
    
    console.log(`Contract deployment transaction sent: ${contract.deployTransaction.hash}`);
    console.log('Waiting for confirmation...');
    
    await contract.deployed();
    
    console.log(`Contract deployed successfully at address: ${contract.address}`);
    
    // Update the .env file with the new contract address
    updateEnvFile(contract.address);
    
    return contract.address;
  } catch (error) {
    console.error('Error deploying contract:', error);
    handleDeploymentError(error);
    return null;
  }
}

// Function to update the .env file with the new contract address
function updateEnvFile(contractAddress) {
  try {
    const envPath = './.env';
    let envContent = '';
    
    // Read existing .env file if it exists
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add contract address variables
    const envVars = {
      'RECEIPT_NFT_CONTRACT_ADDRESS': contractAddress,
      'RECEIPT_MINTER_ADDRESS': contractAddress
    };
    
    // Update each environment variable
    Object.entries(envVars).forEach(([key, value]) => {
      if (envContent.includes(`${key}=`)) {
        // Replace existing variable
        envContent = envContent.replace(
          new RegExp(`${key}=.*`, 'g'),
          `${key}=${value}`
        );
      } else {
        // Add new variable
        envContent += `\n${key}=${value}`;
      }
    });
    
    // Write updated content back to .env file
    fs.writeFileSync(envPath, envContent);
    console.log(`Updated .env file with contract address: ${contractAddress}`);
    return true;
  } catch (error) {
    console.error('Error updating .env file:', error);
    return false;
  }
}

// Function to handle deployment errors
function handleDeploymentError(error) {
  console.error('\n======================================================');
  console.error('ERROR: Contract deployment failed:');
  console.error(error.message);
  console.error('======================================================\n');
  
  // Determine the specific error type and provide targeted solutions
  let specificSolutions = [];
  
  if (error.message.includes('private key') || error.message.includes('WALLET_PRIVATE_KEY')) {
    specificSolutions.push('* WALLET_PRIVATE_KEY is missing or invalid');
    specificSolutions.push('  1. Add your private key to the .env file: WALLET_PRIVATE_KEY=your_private_key');
    specificSolutions.push('  2. Make sure the wallet has sufficient MATIC funds for gas');
  } 
  else if (error.message.includes('network') || error.message.includes('RPC')) {
    specificSolutions.push('* Network connection issue detected');
    specificSolutions.push('  1. Check that your ALCHEMY_RPC URL is correct for Amoy testnet');
    specificSolutions.push('  2. Verify that the Alchemy API key is valid and has access to Polygon Amoy');
  }
  else if (error.message.includes('gas') || error.message.includes('fund')) {
    specificSolutions.push('* Insufficient funds for gas fees');
    specificSolutions.push('  1. Add MATIC to your wallet address for Amoy testnet');
    specificSolutions.push('  2. Request test MATIC from the Polygon Amoy faucet');
  }
  
  console.log('\nPossible solutions:');
  
  if (specificSolutions.length > 0) {
    specificSolutions.forEach(solution => console.log(solution));
  } else {
    console.log('1. Check that your WALLET_PRIVATE_KEY is correct and has MATIC funds');
    console.log('2. Verify that the ALCHEMY_RPC URL is working and connects to Amoy testnet');
    console.log('3. Try deploying via Remix IDE as outlined in Remix_Deployment_Guide.md');
  }
  
  console.log('\nRecommendation: Follow the Remix_Deployment_Guide.md to deploy via browser');
  console.log('Or run with SIMULATE=true to use simulation mode');
}

// Main function to run the deployment process
async function main() {
  console.log('Starting Receipt1155Enhanced contract deployment process...');
  
  try {
    const contractAddress = await deployContract();
    
    if (contractAddress) {
      console.log('\n======================================================');
      console.log(`DEPLOYMENT ${SIMULATE ? 'SIMULATION' : 'SUCCESSFUL'}!`);
      console.log(`Contract address: ${contractAddress}`);
      console.log('Environment variables have been updated.');
      console.log('Next steps:');
      console.log('1. Verify the contract is working correctly using verify-contract.js');
      console.log('2. Update your frontend to use the new contract address');
      console.log('======================================================\n');
    } else {
      console.log('Contract deployment failed or was simulated.');
    }
  } catch (error) {
    console.error('Deployment process failed:', error);
    handleDeploymentError(error);
  }
}

// Run the main function
main()
  .catch((error) => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
  });

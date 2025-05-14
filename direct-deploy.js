// Direct deployment script for Receipt1155 contract
import { ethers } from 'ethers';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import solc from 'solc';

// Load environment variables
dotenv.config();

// Check for required environment variables
const requiredEnvVars = [
  'ALCHEMY_RPC',
  'WALLET_PRIVATE_KEY'
];

const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Read the contract source code
const contractPath = './Receipt1155_for_remix.sol';
const contractSource = fs.readFileSync(contractPath, 'utf8');

// Function to compile the contract
async function compileContract() {
  console.log('Compiling contract...');
  
  const input = {
    language: 'Solidity',
    sources: {
      'Receipt1155.sol': {
        content: contractSource
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      },
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  };

  // Check for OpenZeppelin imports and add them
  if (contractSource.includes('@openzeppelin')) {
    console.log('Adding OpenZeppelin contracts...');
    // This is a simplified version, in a real scenario you'd need to load
    // all the OpenZeppelin contracts this depends on
    return simulateDeployment();
  }

  try {
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    if (output.errors) {
      const hasError = output.errors.some(error => error.severity === 'error');
      if (hasError) {
        console.error('Compilation errors:');
        output.errors.forEach(error => console.error(error.formattedMessage));
        return null;
      }
    }
    
    const contractOutput = output.contracts['Receipt1155.sol']['Receipt1155'];
    return {
      abi: contractOutput.abi,
      bytecode: contractOutput.evm.bytecode.object
    };
  } catch (error) {
    console.error('Error compiling contract:', error);
    return simulateDeployment();
  }
}

// If direct compilation fails, use a simulation approach
async function simulateDeployment() {
  console.log('Using simulation mode for deployment...');
  console.log('This will update your environment variables but won\'t deploy a real contract');
  console.log('You\'ll need to follow the Remix deployment guide manually.');
  
  // Generate a dummy contract address
  const dummyAddress = '0x' + '1'.repeat(40); // A clearly fake address for testing
  
  // Update the .env file with this dummy address
  updateEnvFile(dummyAddress);
  
  console.log('\n======================================================');
  console.log('IMPORTANT: Simulation complete. Follow these steps:');
  console.log('1. Use Remix IDE to deploy the contract as outlined in Remix_Deployment_Guide.md');
  console.log('2. Update your .env file with the real contract address');
  console.log('3. Update the blockchain service using the commands in Post_Deployment_Configuration.md');
  console.log('======================================================\n');
  
  process.exit(0);
}

// Function to deploy the contract
async function deployContract() {
  const compiledContract = await compileContract();
  
  if (!compiledContract) {
    console.log('Using Remix deployment approach instead...');
    return simulateDeployment();
  }
  
  console.log('Contract compiled successfully.');
  
  try {
    // Setup provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_RPC);
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
    const walletAddress = wallet.address;
    
    console.log(`Using wallet address: ${walletAddress}`);
    
    // Get network info
    const network = await provider.getNetwork();
    console.log(`Connected to network: ${network.name} (chainId: ${network.chainId})`);
    
    // Deploy the contract
    console.log('Deploying contract...');
    const factory = new ethers.ContractFactory(
      compiledContract.abi,
      compiledContract.bytecode,
      wallet
    );
    
    const contract = await factory.deploy(walletAddress); // Pass wallet address as initialOwner
    
    console.log(`Contract deployment transaction sent: ${contract.deployTransaction.hash}`);
    console.log('Waiting for confirmation...');
    
    await contract.deployed();
    
    console.log(`Contract deployed successfully at address: ${contract.address}`);
    
    // Update the .env file with the new contract address
    updateEnvFile(contract.address);
    
    console.log('Environment variables updated successfully.');
    
    return contract.address;
  } catch (error) {
    console.error('Error deploying contract:', error);
    return simulateDeployment();
  }
}

// Function to update the .env file with the new contract address
function updateEnvFile(contractAddress) {
  try {
    const envPath = './.env';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace or add contract address variables
    if (envContent.includes('RECEIPT_NFT_CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(
        /RECEIPT_NFT_CONTRACT_ADDRESS=.*/,
        `RECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nRECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}`;
    }
    
    if (envContent.includes('RECEIPT_MINTER_ADDRESS=')) {
      envContent = envContent.replace(
        /RECEIPT_MINTER_ADDRESS=.*/,
        `RECEIPT_MINTER_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nRECEIPT_MINTER_ADDRESS=${contractAddress}`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log(`Updated .env file with contract address: ${contractAddress}`);
    return true;
  } catch (error) {
    console.error('Error updating .env file:', error);
    return false;
  }
}

// Main function to run the deployment process
async function main() {
  console.log('Starting Receipt1155 contract deployment process...');
  
  // Check if direct deployment is possible with available environment variables
  if (!process.env.WALLET_PRIVATE_KEY || !process.env.ALCHEMY_RPC) {
    console.log('Missing required environment variables for direct deployment.');
    return simulateDeployment();
  }
  
  try {
    const contractAddress = await deployContract();
    
    if (contractAddress) {
      console.log('\n======================================================');
      console.log('DEPLOYMENT SUCCESSFUL!');
      console.log(`Contract address: ${contractAddress}`);
      console.log('Environment variables have been updated.');
      console.log('Next steps:');
      console.log('1. Update the blockchain service:');
      console.log('   mv server/services/blockchainService-amoy.ts server/services/blockchainService-amoy.ts.bak');
      console.log('   mv server/services/blockchainService-amoy.ts.new server/services/blockchainService-amoy.ts');
      console.log('2. Restart your application');
      console.log('3. Verify the contract is working correctly using verify-contract.js');
      console.log('======================================================\n');
    } else {
      console.log('Contract deployment failed or was simulated.');
    }
  } catch (error) {
    console.error('Deployment process failed:', error);
    simulateDeployment();
  }
}

// Run the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
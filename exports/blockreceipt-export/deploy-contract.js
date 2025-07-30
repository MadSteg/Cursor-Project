// Direct contract deployment script
import { ethers } from 'ethers';
import fs from 'fs';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';
import path from 'path';

// Load environment variables
dotenv.config();

const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
const RPC_URL = process.env.ALCHEMY_RPC;

// First, we need to compile the contract using solc
async function compileContract() {
  console.log("Compiling Receipt1155.sol...");
  
  try {
    // Create a temporary directory for compilation artifacts
    if (!fs.existsSync('./artifacts')) {
      fs.mkdirSync('./artifacts');
    }
    
    // Compile the contract using solcjs
    execSync('npx solcjs --bin --abi ./contracts/Receipt1155.sol -o ./artifacts --optimize', 
      { stdio: 'inherit' });
    
    // Find the compiled contract files
    const files = fs.readdirSync('./artifacts');
    const abiFile = files.find(f => f.includes('Receipt1155.sol') && f.endsWith('.abi'));
    const binFile = files.find(f => f.includes('Receipt1155.sol') && f.endsWith('.bin'));
    
    if (!abiFile || !binFile) {
      throw new Error('Compiled contract files not found');
    }
    
    // Read the ABI and bytecode
    const abi = JSON.parse(fs.readFileSync(path.join('./artifacts', abiFile), 'utf8'));
    const bytecode = '0x' + fs.readFileSync(path.join('./artifacts', binFile), 'utf8');
    
    return { abi, bytecode };
  } catch (error) {
    console.error("Error compiling contract:", error);
    return null;
  }
}

async function deployContract() {
  try {
    if (!PRIVATE_KEY || !RPC_URL) {
      throw new Error("Missing PRIVATE_KEY or RPC_URL in .env file");
    }
    
    console.log("Starting deployment to Polygon Amoy...");
    
    // Compile the contract
    const compiledContract = await compileContract();
    
    if (!compiledContract) {
      throw new Error("Failed to compile contract");
    }
    
    // Setup provider and wallet
    console.log("Setting up provider and wallet...");
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    
    // Get wallet information
    const balance = await wallet.getBalance();
    const walletAddress = wallet.address;
    
    console.log(`Deploying from wallet: ${walletAddress}`);
    console.log(`Wallet balance: ${ethers.utils.formatEther(balance)} MATIC`);
    
    if (balance.eq(0)) {
      throw new Error("Wallet has zero balance. Please fund the wallet with MATIC before deployment.");
    }
    
    // Deploy the contract
    console.log("Deploying contract...");
    const ContractFactory = new ethers.ContractFactory(
      compiledContract.abi, 
      compiledContract.bytecode, 
      wallet
    );
    
    const contract = await ContractFactory.deploy(walletAddress);
    console.log(`Transaction sent: ${contract.deployTransaction.hash}`);
    
    console.log("Waiting for contract deployment transaction to be mined...");
    await contract.deployed();
    
    console.log(`Contract deployed successfully!`);
    console.log(`Contract Address: ${contract.address}`);
    
    // Update the .env file
    updateEnvFile(contract.address);
    
    return contract.address;
  } catch (error) {
    console.error("Deployment failed:", error);
    return null;
  }
}

function updateEnvFile(contractAddress) {
  try {
    // Load existing .env file
    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    
    // Update contract addresses
    envConfig.RECEIPT_NFT_CONTRACT_ADDRESS = contractAddress;
    envConfig.RECEIPT_MINTER_ADDRESS = contractAddress;
    
    // Write updated .env file
    const envContent = Object.entries(envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync('.env', envContent);
    
    console.log(`Updated .env file with contract address: ${contractAddress}`);
  } catch (error) {
    console.error("Error updating .env file:", error);
  }
}

// Run the deployment
deployContract()
  .then(result => {
    if (result) {
      console.log("\nNext steps:");
      console.log("1. Update the blockchain service with the improved version:");
      console.log("   > cp server/services/blockchainService-improved.ts server/services/blockchainService-amoy.ts");
      console.log("2. Restart the application to use the new contract");
    } else {
      console.log("\nDeployment failed. Please check the error messages above.");
    }
  })
  .catch(error => {
    console.error("Unexpected error:", error);
  });
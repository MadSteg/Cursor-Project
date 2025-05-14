// Hardhat deployment script
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

async function main() {
  try {
    console.log("Deploying Receipt1155 contract to Polygon Amoy...");
    
    // Get the wallet signer
    const [deployer] = await hre.ethers.getSigners();
    
    console.log(`Deploying from wallet: ${deployer.address}`);
    
    const balance = await deployer.getBalance();
    console.log(`Wallet balance: ${hre.ethers.utils.formatEther(balance)} MATIC`);
    
    // Get the contract factory
    const Receipt1155 = await hre.ethers.getContractFactory("Receipt1155");
    
    // Deploy the contract with initialOwner parameter
    console.log("Deploying contract...");
    const receipt1155 = await Receipt1155.deploy(deployer.address);
    
    // Wait for the contract to be deployed
    console.log(`Transaction sent: ${receipt1155.deployTransaction.hash}`);
    console.log("Waiting for transaction confirmation...");
    
    await receipt1155.deployed();
    
    console.log(`Contract deployed to: ${receipt1155.address}`);
    
    // Update .env file with the new contract address
    updateEnvFile(receipt1155.address);
    
    console.log("Deployment complete!");
    
    return receipt1155.address;
  } catch (error) {
    console.error("Error deploying contract:", error);
    process.exitCode = 1;
    return null;
  }
}

function updateEnvFile(contractAddress) {
  try {
    // Load existing .env file
    const envPath = path.resolve('.env');
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    
    // Update the contract address
    envConfig.RECEIPT_NFT_CONTRACT_ADDRESS = contractAddress;
    envConfig.RECEIPT_MINTER_ADDRESS = contractAddress;
    
    // Write updated .env file
    const envContent = Object.entries(envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    fs.writeFileSync(envPath, envContent);
    
    console.log("Updated .env file with new contract address.");
    console.log(`New contract address: ${contractAddress}`);
  } catch (error) {
    console.error("Error updating .env file:", error);
  }
}

// Run the deployment
main()
  .then((result) => {
    if (result) {
      console.log("\nNext steps:");
      console.log("1. Update the blockchain service with the improved version:");
      console.log("   > cp server/services/blockchainService-improved.ts server/services/blockchainService-amoy.ts");
      console.log("2. Restart the application to use the new contract");
    }
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
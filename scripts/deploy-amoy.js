// Deploy Receipt1155 contract to Polygon Amoy network
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

async function main() {
  try {
    console.log("Deploying Receipt1155 contract to Polygon Amoy network...");
    
    // Get the contract factory
    const Receipt1155 = await ethers.getContractFactory("Receipt1155");
    
    // Deploy the contract
    const receipt1155 = await Receipt1155.deploy();
    
    // Wait for deployment to complete
    await receipt1155.deployed();
    
    console.log(`Receipt1155 contract deployed to: ${receipt1155.address}`);
    
    // Update .env file with the new contract address
    updateEnvFile(receipt1155.address);
    
    console.log("Deployment complete!");
  } catch (error) {
    console.error("Error deploying contract:", error);
    process.exitCode = 1;
  }
}

function updateEnvFile(contractAddress) {
  try {
    // Load existing .env file
    const envPath = path.resolve(__dirname, "../.env");
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    
    // Update the contract address
    envConfig.RECEIPT_MINTER_ADDRESS = contractAddress;
    
    // Write updated .env file
    const envContent = Object.entries(envConfig)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");
    
    fs.writeFileSync(envPath, envContent);
    
    console.log("Updated .env file with new contract address.");
  } catch (error) {
    console.error("Error updating .env file:", error);
  }
}

// Run the deployment
main();
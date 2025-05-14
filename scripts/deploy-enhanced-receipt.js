// SPDX-License-Identifier: MIT
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Starting deployment of enhanced Receipt1155 contract...");

  // Get the ContractFactory for our enhanced contract
  const Receipt1155Enhanced = await hre.ethers.getContractFactory("Receipt1155Enhanced");
  
  // Define the base URI for token metadata
  const baseURI = "ipfs://"; // This will be prepended to token-specific URIs
  
  // Deploy the contract
  console.log("Deploying Receipt1155Enhanced with baseURI:", baseURI);
  const receipt = await Receipt1155Enhanced.deploy(baseURI);
  
  // Wait for deployment to complete
  await receipt.deployed();
  
  console.log("Receipt1155Enhanced deployed to:", receipt.address);
  
  // Update the .env file with the new contract address
  updateEnvFile(receipt.address);
  
  // Verify roles are properly set up
  console.log("Verifying role setup...");
  const deployer = (await hre.ethers.getSigners())[0].address;
  
  const ADMIN_ROLE = await receipt.ADMIN_ROLE();
  const MINTER_ROLE = await receipt.MINTER_ROLE();
  
  const hasAdminRole = await receipt.hasRole(ADMIN_ROLE, deployer);
  const hasMinterRole = await receipt.hasRole(MINTER_ROLE, deployer);
  
  console.log(`Deployer (${deployer}) has ADMIN_ROLE: ${hasAdminRole}`);
  console.log(`Deployer (${deployer}) has MINTER_ROLE: ${hasMinterRole}`);
  
  console.log("Deployment completed successfully!");
  
  // Wait for 5 block confirmations for extra security
  console.log("Waiting for 5 block confirmations...");
  await receipt.deployTransaction.wait(5);
  console.log("Contract confirmed on the blockchain.");
  
  return {
    contractAddress: receipt.address,
    deployer: deployer
  };
}

/**
 * Updates the .env file with the new contract address
 */
function updateEnvFile(contractAddress) {
  try {
    // Read current .env file
    let envContent = fs.readFileSync('.env', 'utf8');
    
    // Replace the receipt contract address if it exists
    if (envContent.includes('RECEIPT_NFT_CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(
        /RECEIPT_NFT_CONTRACT_ADDRESS=.*/,
        `RECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      // Add it if it doesn't exist
      envContent += `\nRECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    
    // Write the updated content back to .env
    fs.writeFileSync('.env', envContent);
    console.log(`Updated .env file with the new contract address: ${contractAddress}`);
  } catch (error) {
    console.error("Error updating .env file:", error.message);
  }
}

// Execute the deployment function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
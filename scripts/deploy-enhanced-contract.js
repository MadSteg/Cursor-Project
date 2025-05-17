// deploy-enhanced-contract.js - Script to deploy the enhanced Receipt1155 contract
require('dotenv').config();
const { ethers } = require('hardhat');
const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Starting deployment of Receipt1155Enhanced contract...');
  
  try {
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying contract with account: ${deployer.address}`);
    
    // Compile the contract
    const ContractFactory = await ethers.getContractFactory('Receipt1155Enhanced');
    
    // Deploy the contract with the deployer as the initial owner
    const contract = await ContractFactory.deploy(deployer.address);
    await contract.deployed();
    
    console.log(`Receipt1155Enhanced contract deployed to: ${contract.address}`);
    console.log(`Transaction hash: ${contract.deployTransaction.hash}`);
    
    // Save contract details to a file for future reference
    const deploymentInfo = {
      contractAddress: contract.address,
      deploymentTimestamp: new Date().toISOString(),
      deployerAddress: deployer.address,
      chainId: await deployer.getChainId(),
      transactionHash: contract.deployTransaction.hash
    };
    
    // Update the .env file with the new contract address
    updateEnvFile(contract.address);
    
    // Save deployment details to a JSON file
    fs.writeFileSync(
      path.join(__dirname, '..', 'deployment-info.json'),
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log('Deployment info saved to deployment-info.json');
    console.log('Environment variables updated with new contract address');
    
    return contract.address;
  } catch (error) {
    console.error('Error during deployment:', error);
    process.exit(1);
  }
}

function updateEnvFile(contractAddress) {
  try {
    // Read the current .env file
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add the CONTRACT_ADDRESS variable
    const contractAddressRegex = /RECEIPT_NFT_CONTRACT_ADDRESS=.*/;
    if (contractAddressRegex.test(envContent)) {
      // Replace existing CONTRACT_ADDRESS
      envContent = envContent.replace(
        contractAddressRegex,
        `RECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      // Add new CONTRACT_ADDRESS
      envContent += `\nRECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    
    // Write the updated content back to the .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log(`Updated .env file with new contract address: ${contractAddress}`);
  } catch (error) {
    console.error('Error updating .env file:', error);
  }
}

// Execute deployment if this script is run directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { main, updateEnvFile };
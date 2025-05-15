// BlockReceipt NFT Collection Deployment Script
require('dotenv').config();
const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Deploying BlockReceiptCollection to Polygon Amoy...");
  
  // Set base URI for the collection
  // This should point to IPFS CID for the collection metadata
  const baseURI = process.env.NFT_BASE_URI || "ipfs://YOUR_IPFS_CID/";
  
  // Deploy the contract
  const BlockReceiptCollection = await ethers.getContractFactory("BlockReceiptCollection");
  const receiptCollection = await BlockReceiptCollection.deploy(baseURI);
  await receiptCollection.deployed();
  
  console.log(`BlockReceiptCollection deployed to: ${receiptCollection.address}`);
  
  // Update the .env file with the contract address
  updateEnvFile(receiptCollection.address);
  
  // Output ABI to a JSON file for use in the backend
  const artifact = require('../artifacts/contracts/BlockReceiptCollection.sol/BlockReceiptCollection.json');
  const abiDir = path.join(__dirname, '../server/abi');
  
  if (!fs.existsSync(abiDir)){
    fs.mkdirSync(abiDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(abiDir, 'BlockReceiptCollection.json'),
    JSON.stringify(artifact.abi, null, 2)
  );
  
  console.log('Contract ABI saved to server/abi/BlockReceiptCollection.json');
  
  // Verify contract on Polygonscan (if not on a local network)
  if (process.env.POLYGONSCAN_API_KEY && network.name !== 'localhost' && network.name !== 'hardhat') {
    console.log('Waiting for block confirmations...');
    await receiptCollection.deployTransaction.wait(5);
    
    console.log('Verifying contract on Polygonscan...');
    await hre.run('verify:verify', {
      address: receiptCollection.address,
      constructorArguments: [baseURI],
    });
    console.log('Contract verified on Polygonscan!');
  }
}

/**
 * Updates the .env file with the new contract address
 */
function updateEnvFile(contractAddress) {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add CONTRACT_ADDRESS
    if (envContent.includes('CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(
        /CONTRACT_ADDRESS=.*/,
        `CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nCONTRACT_ADDRESS=${contractAddress}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log(`Updated .env file with CONTRACT_ADDRESS=${contractAddress}`);
  } catch (error) {
    console.error('Error updating .env file:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
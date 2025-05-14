// scripts/deploy-mumbai.cjs
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying Receipt1155 to Mumbai Testnet...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);
  
  // Display account balance
  const balance = await deployer.getBalance();
  console.log(`Account balance: ${ethers.utils.formatEther(balance)} MATIC`);

  // Deploy the Receipt1155 contract with deployer as initialOwner
  const Receipt1155 = await ethers.getContractFactory("Receipt1155");
  const receipt1155 = await Receipt1155.deploy(deployer.address);
  await receipt1155.deployed();

  console.log(`Receipt1155 contract deployed to: ${receipt1155.address}`);
  
  // Update the .env file with the contract address
  updateEnvFile(receipt1155.address);
  
  console.log("Deployment complete!");
}

// Helper function to update the .env file with the contract address
function updateEnvFile(contractAddress) {
  try {
    const envPath = path.resolve('.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace or add the RECEIPT_NFT_CONTRACT_ADDRESS
    if (envContent.includes('RECEIPT_NFT_CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(
        /RECEIPT_NFT_CONTRACT_ADDRESS=.*/,
        `RECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nRECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log(`Updated .env file with contract address: ${contractAddress}`);
  } catch (error) {
    console.error('Failed to update .env file:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
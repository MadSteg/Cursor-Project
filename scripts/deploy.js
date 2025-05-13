// Scripts for deploying the ReceiptNFT contract to the Polygon Mumbai network
const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment of ReceiptNFT contract...");

  // Get the contract factory
  const ReceiptNFT = await ethers.getContractFactory("ReceiptNFT");
  
  // Deploy the contract
  console.log("Deploying ReceiptNFT...");
  const receiptNFT = await ReceiptNFT.deploy();
  
  // Wait for deployment to finish
  await receiptNFT.deployed();
  
  console.log("ReceiptNFT deployed to:", receiptNFT.address);
  
  // Save the contract address to a file
  const network = await ethers.provider.getNetwork();
  const deploymentInfo = {
    contractAddress: receiptNFT.address,
    network: network.name || `chainId-${network.chainId}`,
    deploymentTime: new Date().toISOString()
  };
  
  // Update the .env file with the contract address
  console.log("Updating environment variables...");
  try {
    const envPath = path.resolve(__dirname, "../.env");
    let envContent = "";
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
    }
    
    // Check if RECEIPT_NFT_CONTRACT_ADDRESS already exists in the file
    if (envContent.includes("RECEIPT_NFT_CONTRACT_ADDRESS=")) {
      // Replace the existing value
      envContent = envContent.replace(
        /RECEIPT_NFT_CONTRACT_ADDRESS=.*/,
        `RECEIPT_NFT_CONTRACT_ADDRESS=${receiptNFT.address}`
      );
    } else {
      // Add the new value
      envContent += `\n# ReceiptNFT contract address on Polygon Mumbai (deployed on ${new Date().toISOString()})`;
      envContent += `\nRECEIPT_NFT_CONTRACT_ADDRESS=${receiptNFT.address}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log("Updated .env file with contract address");
  } catch (error) {
    console.error("Failed to update .env file:", error);
    console.log("Please manually add or update the RECEIPT_NFT_CONTRACT_ADDRESS in your .env file with:", receiptNFT.address);
  }
  
  console.log("Deployment complete!");
  console.log("\nTo verify the contract on Polygonscan, run:");
  console.log(`npx hardhat verify --network mumbai ${receiptNFT.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
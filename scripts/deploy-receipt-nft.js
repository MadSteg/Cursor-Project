/**
 * Deployment script for the consolidated ReceiptNFT contract
 * For Polygon Amoy testnet (chain ID 80002)
 */
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment of ReceiptNFT contract...");
  
  // Get the contract factory
  const ReceiptNFT = await hre.ethers.getContractFactory("ReceiptNFT");
  
  // Deploy the contract
  console.log("Deploying ReceiptNFT contract...");
  const receipt = await ReceiptNFT.deploy();
  
  // Wait for deployment to complete
  await receipt.deployed();
  
  console.log(`ReceiptNFT contract deployed to: ${receipt.address}`);
  
  // Update .env file with the new contract address
  updateEnvFile(receipt.address);
  
  // Write deployment info to a file for reference
  const deploymentInfo = {
    contractAddress: receipt.address,
    deploymentTime: new Date().toISOString(),
    network: hre.network.name,
    chainId: hre.network.config.chainId,
  };
  
  fs.writeFileSync(
    path.join(__dirname, "..", "deployments", `${hre.network.name}-receipt-nft.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment info saved to deployments folder");
  
  // Verify the contract on the explorer if not on a local network
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Waiting for block confirmations before verification...");
    await receipt.deployTransaction.wait(5); // Wait for 5 confirmations
    
    console.log("Verifying contract on explorer...");
    try {
      await hre.run("verify:verify", {
        address: receipt.address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Error verifying contract:", error.message);
    }
  }
  
  return receipt.address;
}

/**
 * Updates the .env file with the new contract address
 */
function updateEnvFile(contractAddress) {
  const envFilePath = path.join(__dirname, "..", ".env");
  
  try {
    let envContent = "";
    if (fs.existsSync(envFilePath)) {
      envContent = fs.readFileSync(envFilePath, "utf8");
    }
    
    // Replace or add the contract address
    if (envContent.includes("RECEIPT_NFT_CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /RECEIPT_NFT_CONTRACT_ADDRESS=.*/,
        `RECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nRECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    
    fs.writeFileSync(envFilePath, envContent);
    console.log(".env file updated with new contract address");
  } catch (error) {
    console.error("Error updating .env file:", error);
  }
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
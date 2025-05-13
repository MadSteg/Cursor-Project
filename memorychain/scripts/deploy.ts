import { ethers } from "hardhat";
import { ReceiptMinter__factory } from "../typechain-types";

async function main() {
  try {
    console.log("Deploying ReceiptMinter contract...");

    // We get the contract factory to deploy
    const ReceiptMinter = await ethers.getContractFactory("ReceiptMinter");
    
    // Base URI for the ERC1155 token metadata
    const baseUri = "https://api.memorychain.app/metadata/";
    
    // Deploy the contract
    const receiptMinter = await ReceiptMinter.deploy(baseUri);

    // Wait for deployment to finish
    await receiptMinter.waitForDeployment();
    
    const address = await receiptMinter.getAddress();
    console.log(`ReceiptMinter deployed to: ${address}`);
    
    // Get the deployer's address to verify it has the MINTER_ROLE
    const [deployer] = await ethers.getSigners();
    
    // Log the transaction hash
    console.log(`Deployment transaction: ${receiptMinter.deploymentTransaction()?.hash}`);
    
    // Verify the MINTER_ROLE is assigned to the deployer
    const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
    const hasMinterRole = await receiptMinter.hasRole(MINTER_ROLE, deployer.address);
    
    console.log(`Deployer address: ${deployer.address}`);
    console.log(`Deployer has MINTER_ROLE: ${hasMinterRole}`);
    
    // You could optionally grant MINTER_ROLE to other addresses here
    // await receiptMinter.grantRole(MINTER_ROLE, "0x...");
    
    console.log("Deployment completed successfully");
  } catch (error) {
    console.error("Error deploying contract:", error);
    process.exitCode = 1;
  }
}

// Execute the deployment
main();
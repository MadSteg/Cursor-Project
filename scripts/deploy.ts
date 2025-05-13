// deploy.ts
// This script deploys the Receipt1155 contract to Mumbai testnet
import * as hre from "hardhat";

async function main() {
  console.log("Deploying Receipt1155 ERC-1155 contract to network...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying with account: ${deployer.address}`);
  
  const Receipt1155 = await hre.ethers.getContractFactory("Receipt1155");
  const receipt1155 = await Receipt1155.deploy();
  
  await receipt1155.deployed();
  
  console.log(`Receipt1155 deployed to: ${receipt1155.address}`);
  return receipt1155.address;
}

main()
  .then((address) => {
    console.log(`Deployment successful: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
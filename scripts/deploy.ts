import { ethers } from "hardhat";

async function main() {
  console.log("Deploying Receipt1155 contract...");
  
  const Receipt1155 = await ethers.getContractFactory("Receipt1155");
  const receipt = await Receipt1155.deploy();
  
  await receipt.deployed();
  
  console.log("Receipt1155 deployed to:", receipt.address);
  console.log("RECEIPT_NFT_CONTRACT_ADDRESS=", receipt.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
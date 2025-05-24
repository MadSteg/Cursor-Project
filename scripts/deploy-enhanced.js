const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying enhanced Receipt1155 contract with PRE integration...");
  console.log("Deployer address:", deployer.address);
  
  // Contract configuration
  const uri = "https://api.blockreceipt.ai/metadata/{id}.json";
  const preModuleAddress = process.env.PRE_MODULE_ADDRESS || "0x347CC7ede7e5517bD47D20620B2CF1b406edcF07";
  
  console.log("PRE Module Address:", preModuleAddress);
  console.log("Base URI:", uri);
  
  // Deploy the enhanced contract
  const Receipt1155Enhanced = await ethers.getContractFactory("Receipt1155Enhanced");
  const contract = await Receipt1155Enhanced.deploy(
    uri,
    preModuleAddress,
    deployer.address // initial owner
  );
  
  await contract.deployed();
  
  console.log("✅ Receipt1155Enhanced deployed to:", contract.address);
  console.log("🔐 PRE Module integrated at:", preModuleAddress);
  console.log("👤 Contract owner:", deployer.address);
  
  // Verify deployment
  console.log("\nVerifying deployment...");
  const owner = await contract.owner();
  const preModule = await contract.preModule();
  
  console.log("Contract owner verification:", owner === deployer.address ? "✅" : "❌");
  console.log("PRE module verification:", preModule === preModuleAddress ? "✅" : "❌");
  
  // Save deployment info
  const deployment = {
    contractAddress: contract.address,
    preModuleAddress: preModuleAddress,
    deployer: deployer.address,
    network: process.env.HARDHAT_NETWORK || "localhost",
    timestamp: new Date().toISOString()
  };
  
  console.log("\n📋 Deployment Summary:");
  console.log(JSON.stringify(deployment, null, 2));
  
  return contract;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
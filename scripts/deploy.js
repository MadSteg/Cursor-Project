const hre = require("hardhat");

async function main() {
  console.log("Deploying ReceiptNFT contract...");

  // Deploy the contract
  const ReceiptNFT = await hre.ethers.getContractFactory("ReceiptNFT");
  const receiptNFT = await ReceiptNFT.deploy();

  await receiptNFT.deployed();

  console.log(`ReceiptNFT deployed to: ${receiptNFT.address}`);
  console.log(`Set this address as CONTRACT_ADDRESS in your .env file`);
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
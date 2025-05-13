// This file is a CommonJS module for Hardhat deployment
// It needs to be run with NODE_OPTIONS=--experimental-vm-modules
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Load contract ABI and bytecode
const contractPath = path.join(__dirname, "artifacts/contracts/Receipt1155.sol/Receipt1155.json");
let contractJson;

try {
  if (fs.existsSync(contractPath)) {
    contractJson = JSON.parse(fs.readFileSync(contractPath, "utf8"));
  } else {
    console.error(`Contract artifact not found at ${contractPath}. Run 'npx hardhat compile' first.`);
    process.exit(1);
  }
} catch (error) {
  console.error("Error reading contract artifact:", error);
  process.exit(1);
}

async function main() {
  // Validate environment variables
  const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
  const rpcUrl = process.env.POLYGON_MUMBAI_RPC_URL;
  
  if (!privateKey || !rpcUrl) {
    console.error("Missing required environment variables: BLOCKCHAIN_PRIVATE_KEY and/or POLYGON_MUMBAI_RPC_URL");
    process.exit(1);
  }

  console.log("Deploying Receipt1155 contract to Polygon Mumbai testnet...");

  // Setup provider and wallet
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const deployer = wallet.address;

  console.log(`Deploying from address: ${deployer}`);

  // Check wallet balance
  const balance = await provider.getBalance(deployer);
  console.log(`Wallet balance: ${ethers.utils.formatEther(balance)} MATIC`);

  if (balance.eq(0)) {
    console.error("Wallet has 0 MATIC. Please fund the wallet before deploying.");
    process.exit(1);
  }

  // Deploy contract
  const ReceiptFactory = new ethers.ContractFactory(
    contractJson.abi,
    contractJson.bytecode,
    wallet
  );

  const receipt = await ReceiptFactory.deploy();
  await receipt.deployed();

  console.log(`Receipt1155 deployed to: ${receipt.address}`);
  console.log(`Transaction hash: ${receipt.deployTransaction.hash}`);
  console.log("");
  console.log("Set this in your .env file:");
  console.log(`RECEIPT_NFT_CONTRACT_ADDRESS=${receipt.address}`);

  return receipt.address;
}

// Run the deployment
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { main };
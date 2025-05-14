// SPDX-License-Identifier: MIT
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

/**
 * Verifies the enhanced Receipt1155 contract on Polygonscan (Amoy or Mumbai)
 * This allows public inspection of the contract code and functions
 */
async function main() {
  if (!process.env.RECEIPT_NFT_CONTRACT_ADDRESS) {
    throw new Error("Missing RECEIPT_NFT_CONTRACT_ADDRESS in environment variables");
  }

  const contractAddress = process.env.RECEIPT_NFT_CONTRACT_ADDRESS;
  console.log(`Verifying Receipt1155Enhanced contract at address: ${contractAddress}`);

  // Read the current network from Hardhat config
  const network = hre.network.name;
  console.log(`Target network: ${network}`);

  // Read the .env file to set the baseURI (needed for verification)
  let baseURI = "ipfs://";
  try {
    // Try to read baseURI from .env if it exists
    const envPath = path.resolve(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/BASE_URI=(.+)/);
      if (match && match[1]) {
        baseURI = match[1];
      }
    }
  } catch (error) {
    console.warn("Could not read BASE_URI from .env file, using default: ipfs://");
  }

  console.log(`Using baseURI for verification: ${baseURI}`);

  try {
    // Verify the contract on Polygonscan
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [baseURI],
      contract: "contracts/Receipt1155Enhanced.sol:Receipt1155Enhanced"
    });

    console.log(`🎉 Contract successfully verified on ${network} Polygonscan!`);
    console.log(`View your contract at: ${getExplorerUrl(network, contractAddress)}`);
  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log(`✅ Contract is already verified on ${network} Polygonscan`);
      console.log(`View your contract at: ${getExplorerUrl(network, contractAddress)}`);
    } else {
      console.error("Error during verification:", error);
      throw error;
    }
  }
}

/**
 * Returns the explorer URL for the contract based on the network
 */
function getExplorerUrl(network, address) {
  switch (network) {
    case 'mumbai':
      return `https://mumbai.polygonscan.com/address/${address}`;
    case 'amoy':
      return `https://www.oklink.com/amoy/address/${address}`;
    case 'polygon':
      return `https://polygonscan.com/address/${address}`;
    default:
      return `https://www.oklink.com/amoy/address/${address}`;
  }
}

// Execute the verification
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Verification failed:", error);
    process.exit(1);
  });
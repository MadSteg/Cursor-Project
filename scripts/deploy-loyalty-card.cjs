const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying LoyaltyCard contract to Polygon Amoy...");

  // Get the contract factory
  const LoyaltyCard = await ethers.getContractFactory("LoyaltyCard");

  // Deploy the contract
  console.log("📦 Deploying contract...");
  const loyaltyCard = await LoyaltyCard.deploy();

  // Wait for deployment to complete
  await loyaltyCard.deployed();

  console.log("✅ LoyaltyCard deployed to:", loyaltyCard.address);
  console.log("🔗 Transaction hash:", loyaltyCard.deployTransaction.hash);

  // Update environment file with the new contract address
  updateEnvFile(loyaltyCard.address);

  // Verify deployment by checking if contract exists
  const code = await ethers.provider.getCode(loyaltyCard.address);
  if (code === "0x") {
    throw new Error("❌ Contract deployment failed - no code at address");
  }

  console.log("🎯 Contract verification successful!");

  // Set up some demo merchants for testing
  console.log("🏪 Setting up demo merchants...");
  
  const demoMerchants = [
    {
      address: "0x1234567890123456789012345678901234567890",
      name: "Demo Coffee Shop",
      threshold: 5
    },
    {
      address: "0x0987654321098765432109876543210987654321", 
      name: "Demo Restaurant",
      threshold: 10
    }
  ];

  for (const merchant of demoMerchants) {
    try {
      console.log(`   Adding merchant: ${merchant.name}...`);
      const tx = await loyaltyCard.authorizeMerchant(
        merchant.address,
        merchant.name,
        merchant.threshold
      );
      await tx.wait();
      console.log(`   ✅ ${merchant.name} authorized (${merchant.threshold} stamps for reward)`);
    } catch (error) {
      console.log(`   ⚠️  Failed to authorize ${merchant.name}:`, error.message);
    }
  }

  console.log("\n🎉 Loyalty Card deployment complete!");
  console.log("📋 Summary:");
  console.log(`   Contract Address: ${loyaltyCard.address}`);
  console.log(`   Network: Polygon Amoy`);
  console.log(`   Block: ${loyaltyCard.deployTransaction.blockNumber}`);
  console.log("\n🔧 Next steps:");
  console.log("   1. Update LOYALTY_CONTRACT_ADDRESS in your .env file");
  console.log("   2. Test the loyalty system through the merchant portal");
  console.log("   3. Verify contract on Polygonscan Amoy");

  // Save contract info for reference
  const contractInfo = {
    address: loyaltyCard.address,
    txHash: loyaltyCard.deployTransaction.hash,
    blockNumber: loyaltyCard.deployTransaction.blockNumber,
    network: "polygon-amoy",
    deployedAt: new Date().toISOString(),
    demoMerchants
  };

  fs.writeFileSync(
    path.join(__dirname, "../deployed-loyalty-contract.json"),
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("💾 Contract info saved to deployed-loyalty-contract.json");
}

/**
 * Updates the .env file with the new loyalty contract address
 */
function updateEnvFile(contractAddress) {
  const envPath = path.join(__dirname, "../.env");
  
  try {
    let envContent = "";
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
    }

    // Check if LOYALTY_CONTRACT_ADDRESS already exists
    if (envContent.includes("LOYALTY_CONTRACT_ADDRESS=")) {
      // Update existing line
      envContent = envContent.replace(
        /LOYALTY_CONTRACT_ADDRESS=.*/,
        `LOYALTY_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      // Add new line
      envContent += `\nLOYALTY_CONTRACT_ADDRESS=${contractAddress}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log(`📝 Updated .env with LOYALTY_CONTRACT_ADDRESS=${contractAddress}`);
  } catch (error) {
    console.log("⚠️  Could not update .env file:", error.message);
    console.log(`📝 Please manually add: LOYALTY_CONTRACT_ADDRESS=${contractAddress}`);
  }
}

// Handle errors gracefully
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
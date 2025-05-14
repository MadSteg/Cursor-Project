// Test connection to Polygon Amoy network
import { ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  try {
    // Get Amoy RPC URL from environment
    const rpcUrl = process.env.ALCHEMY_RPC;
    if (!rpcUrl) {
      throw new Error("ALCHEMY_RPC not set in environment");
    }
    
    console.log("Using Amoy RPC URL:", rpcUrl);
    
    // Create provider with explicit network details
    const amoyNetwork = {
      name: "amoy",
      chainId: 80002
    };
    
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl, amoyNetwork);
    
    // Test connection by getting network info
    const network = await provider.getNetwork();
    console.log("Connected to network:", network.name, "(chainId =", network.chainId, ")");
    
    // Get latest block
    const blockNumber = await provider.getBlockNumber();
    console.log("Latest block:", blockNumber);
    
    // If wallet private key is available, test wallet connection
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    if (privateKey) {
      const wallet = new ethers.Wallet(privateKey, provider);
      console.log("Wallet address:", wallet.address);
      
      // Get wallet balance
      const balance = await wallet.getBalance();
      console.log("Wallet balance:", ethers.utils.formatEther(balance), "MATIC");
      
      if (balance.eq(0)) {
        console.warn("Warning: Wallet has 0 MATIC. Fund it at https://faucet.polygon.technology (select Amoy)");
      }
    } else {
      console.warn("No wallet private key found in environment");
    }
    
    console.log("Connection test successful!");
  } catch (error) {
    console.error("Connection test failed:", error.message);
    process.exitCode = 1;
  }
}

// Run the test
main();
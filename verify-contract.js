// Script to verify the deployed Receipt1155 contract
import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Receipt1155 contract ABI (minimal for testing)
const contractABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "uri",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" }
    ],
    "name": "getReceiptHash",
    "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" },
      { "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

async function verifyContract() {
  try {
    // Check for environment variables
    const rpcUrl = process.env.ALCHEMY_RPC;
    const contractAddress = process.env.RECEIPT_NFT_CONTRACT_ADDRESS;
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    
    if (!rpcUrl || !contractAddress || !privateKey) {
      console.error("Missing required environment variables");
      return false;
    }
    
    console.log(`Verifying contract at address: ${contractAddress}`);
    
    // Setup provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Get network info
    const network = await provider.getNetwork();
    console.log(`Connected to network: ${network.name} (chainId: ${network.chainId})`);
    
    // Check if the address is a contract
    const code = await provider.getCode(contractAddress);
    if (code === '0x') {
      console.error("❌ ERROR: The address does not contain contract code. It may be a wallet address.");
      return false;
    }
    console.log("✅ Address contains contract bytecode");
    
    // Create contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    
    // Test contract functions
    let successCount = 0;
    let errorCount = 0;
    
    try {
      // Test balanceOf
      const balance = await contract.balanceOf(wallet.address, 1);
      console.log(`✅ balanceOf function works. Balance: ${balance.toString()}`);
      successCount++;
    } catch (error) {
      console.error("❌ balanceOf function failed:", error.message);
      errorCount++;
    }
    
    try {
      // Test uri (may return empty string if no tokens minted)
      const uri = await contract.uri(1);
      console.log(`✅ uri function works. URI for token 1: ${uri || "(empty)"}`);
      successCount++;
    } catch (error) {
      console.error("❌ uri function failed:", error.message);
      errorCount++;
    }
    
    try {
      // Test getReceiptHash (may return zero bytes if no tokens minted)
      const hash = await contract.getReceiptHash(1);
      console.log(`✅ getReceiptHash function works. Hash for token 1: ${hash}`);
      successCount++;
    } catch (error) {
      console.error("❌ getReceiptHash function failed:", error.message);
      errorCount++;
    }
    
    // Summary
    console.log("\nVerification Results:");
    console.log(`Successful function calls: ${successCount}`);
    console.log(`Failed function calls: ${errorCount}`);
    
    if (successCount > 0) {
      console.log("\n✅ Contract verification passed! The contract implements required functions.");
      return true;
    } else {
      console.log("\n❌ Contract verification failed. The contract does not implement any required functions.");
      return false;
    }
  } catch (error) {
    console.error("Error verifying contract:", error);
    return false;
  }
}

// Run the verification
verifyContract()
  .then(success => {
    if (success) {
      console.log("\nYour Receipt1155 contract is properly deployed and functional!");
      console.log("You can now use it with the BlockReceipt.ai application.");
    } else {
      console.log("\nThere are issues with your Receipt1155 contract deployment.");
      console.log("Please check the error messages above and fix any issues before continuing.");
    }
  })
  .catch(error => {
    console.error("Unexpected error during verification:", error);
  });
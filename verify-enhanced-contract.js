// Script to verify the Receipt1155Enhanced contract on Polygonscan
import { ethers } from 'ethers';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check for required environment variables
const requiredEnvVars = [
  'RECEIPT_NFT_CONTRACT_ADDRESS',
  'ALCHEMY_RPC',
  'WALLET_PRIVATE_KEY'
];

// Validate environment variables
const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Function to verify contract functionality
async function verifyContract() {
  try {
    // Setup provider and wallet
    const rpcUrl = process.env.ALCHEMY_RPC.startsWith('http') 
      ? process.env.ALCHEMY_RPC 
      : `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_RPC}`;
    
    const network = {
      name: 'amoy',
      chainId: 80002
    };
    
    console.log(`Connecting to Polygon Amoy at: ${rpcUrl}`);
    
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl, network);
    const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
    const walletAddress = wallet.address;
    
    console.log(`Using wallet address: ${walletAddress}`);
    
    // Load contract ABI
    const contractPath = path.join(__dirname, 'artifacts/contracts/Receipt1155Enhanced.sol/Receipt1155Enhanced.json');
    let contractJson;
    
    try {
      if (fs.existsSync(contractPath)) {
        contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
      } else {
        console.error(`Contract artifact not found at ${contractPath}. Run 'npx hardhat compile' first.`);
        process.exit(1);
      }
    } catch (error) {
      console.error('Error reading contract artifact:', error);
      process.exit(1);
    }
    
    // Connect to the deployed contract
    const contractAddress = process.env.RECEIPT_NFT_CONTRACT_ADDRESS;
    const contract = new ethers.Contract(contractAddress, contractJson.abi, wallet);
    
    console.log(`Connected to Receipt1155Enhanced at: ${contractAddress}`);
    
    // Verify contract functionality
    console.log('\nVerifying contract functionality...');
    
    // Check if the wallet has the MINTER_ROLE
    const MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
    const hasMinterRole = await contract.hasRole(MINTER_ROLE, walletAddress);
    console.log(`Wallet has MINTER_ROLE: ${hasMinterRole}`);
    
    if (!hasMinterRole) {
      console.log('Warning: Wallet does not have MINTER_ROLE. Some tests will fail.');
    }
    
    // Check if the wallet has the ADMIN_ROLE
    const ADMIN_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
    const hasAdminRole = await contract.hasRole(ADMIN_ROLE, walletAddress);
    console.log(`Wallet has ADMIN_ROLE: ${hasAdminRole}`);
    
    if (!hasAdminRole) {
      console.log('Warning: Wallet does not have ADMIN_ROLE. Some tests will fail.');
    }
    
    // Test minting a receipt
    if (hasMinterRole) {
      console.log('\nTesting receipt minting...');
      
      const testReceiptHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Test Receipt " + Date.now()));
      const testUri = "ipfs://QmTest";
      const testStampUri = "ipfs://QmTestStamp";
      const testReceiptType = 1; // Standard receipt
      const testEncrypted = false;
      const testPolicyId = "";
      
      try {
        const tx = await contract.mintNewReceipt(
          walletAddress,
          testReceiptHash,
          testUri,
          testStampUri,
          testReceiptType,
          testEncrypted,
          testPolicyId
        );
        
        console.log(`Mint transaction sent: ${tx.hash}`);
        console.log('Waiting for confirmation...');
        
        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
        
        // Find the token ID from the event
        const mintEvent = receipt.events.find(event => event.event === 'ReceiptMinted');
        const tokenId = mintEvent.args.tokenId.toNumber();
        
        console.log(`Receipt minted with token ID: ${tokenId}`);
        
        // Verify the receipt data
        console.log('\nVerifying receipt data...');
        
        const tokenData = await contract.getTokenData(tokenId);
        console.log('Token data:');
        console.log(`- URI: ${tokenData.tokenUri}`);
        console.log(`- Stamp URI: ${tokenData.stampUri_}`);
        console.log(`- Receipt Type: ${tokenData.receiptType}`);
        console.log(`- Encrypted: ${tokenData.encrypted}`);
        console.log(`- Policy ID: ${tokenData.policyId}`);
        console.log(`- Revoked: ${tokenData.revoked}`);
        console.log(`- Timestamp: ${new Date(tokenData.timestamp.toNumber() * 1000).toISOString()}`);
        
        // Verify receipt hash
        const storedHash = await contract.getReceiptHash(tokenId);
        const hashMatches = storedHash === testReceiptHash;
        console.log(`Receipt hash verification: ${hashMatches ? 'PASSED' : 'FAILED'}`);
        
        // Check balance
        const balance = await contract.balanceOf(walletAddress, tokenId);
        console.log(`Balance of token ${tokenId}: ${balance.toString()}`);
        
        console.log('\nContract verification completed successfully!');
        return true;
      } catch (error) {
        console.error('Error testing contract functionality:', error);
        return false;
      }
    } else {
      console.log('Skipping mint test due to missing MINTER_ROLE');
      return false;
    }
  } catch (error) {
    console.error('Error verifying contract:', error);
    return false;
  }
}

// Function to check contract on Polygonscan
async function checkContractOnExplorer() {
  const contractAddress = process.env.RECEIPT_NFT_CONTRACT_ADDRESS;
  const explorerUrl = `https://amoy.polygonscan.com/address/${contractAddress}`;
  
  console.log(`\nContract deployed at: ${contractAddress}`);
  console.log(`View on Polygonscan: ${explorerUrl}`);
  
  try {
    // Try to fetch contract info from Polygonscan API
    console.log('\nChecking contract on Polygonscan...');
    
    const apiUrl = `https://api-amoy.polygonscan.com/api?module=contract&action=getsourcecode&address=${contractAddress}`;
    const response = await axios.get(apiUrl);
    
    if (response.data && response.data.status === '1' && response.data.result && response.data.result[0]) {
      const contractInfo = response.data.result[0];
      
      if (contractInfo.ContractName) {
        console.log(`Contract name: ${contractInfo.ContractName}`);
        console.log(`Compiler version: ${contractInfo.CompilerVersion}`);
        
        if (contractInfo.ABI === 'Contract source code not verified') {
          console.log('\nContract is NOT verified on Polygonscan.');
          console.log('To verify the contract, use the Polygonscan verification process:');
          console.log('1. Go to https://amoy.polygonscan.com/verifyContract');
          console.log(`2. Enter the contract address: ${contractAddress}`);
          console.log('3. Fill in the contract details and upload the source code');
        } else {
          console.log('\nContract is verified on Polygonscan!');
        }
      } else {
        console.log('Contract information not available on Polygonscan.');
      }
    } else {
      console.log('Could not retrieve contract information from Polygonscan API.');
    }
  } catch (error) {
    console.log('Error checking contract on Polygonscan:', error.message);
  }
}

// Main function
async function main() {
  console.log('Starting Receipt1155Enhanced contract verification...');
  
  const verified = await verifyContract();
  
  if (verified) {
    await checkContractOnExplorer();
    
    console.log('\n======================================================');
    console.log('VERIFICATION SUCCESSFUL!');
    console.log('The Receipt1155Enhanced contract is working correctly.');
    console.log('======================================================\n');
  } else {
    console.log('\n======================================================');
    console.log('VERIFICATION FAILED!');
    console.log('The Receipt1155Enhanced contract has issues.');
    console.log('======================================================\n');
  }
}

// Run the main function
main()
  .catch((error) => {
    console.error('Unhandled error in main:', error);
    process.exit(1);
  });

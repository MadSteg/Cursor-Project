// Verify contract deployment and functionality
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Contract ABI - minimal ABI with just the functions we need to test
const CONTRACT_ABI = [
  "function mintReceipt(address customer, string ipfsHash, uint256 amount, string currency, address merchant) public returns (uint256)",
  "function getReceiptMetadata(uint256 receiptId) public view returns (uint256 timestamp, string ipfsHash, address merchant, address customer, uint256 amount, string currency, bool isVerified)",
  "function getReceiptCount() public view returns (uint256)",
  "function owner() public view returns (address)"
];

async function verifyContract() {
  try {
    // Get contract address from environment
    const contractAddress = process.env.RECEIPT_NFT_CONTRACT_ADDRESS;
    
    if (!contractAddress || contractAddress === '0x1111111111111111111111111111111111111111') {
      console.log('No valid contract address found in .env file.');
      console.log('Please update the RECEIPT_NFT_CONTRACT_ADDRESS variable with your deployed contract address.');
      return;
    }
    
    console.log(`Verifying contract at: ${contractAddress}`);
    console.log(`Explorer: https://amoy.polygonscan.com/address/${contractAddress}`);
    
    // Setup provider and wallet
    const apiKey = process.env.ALCHEMY_RPC;
    const rpcUrl = `https://polygon-amoy.g.alchemy.com/v2/${apiKey}`;
    
    const provider = new ethers.providers.JsonRpcProvider(
      rpcUrl,
      { 
        name: 'amoy',
        chainId: 80002
      }
    );
    
    // Try to load the contract
    console.log('\nConnecting to the contract...');
    const contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);
    
    // Check if the contract exists
    try {
      const code = await provider.getCode(contractAddress);
      if (code === '0x') {
        console.log('❌ No contract code found at this address!');
        console.log('This could mean:');
        console.log('1. The contract deployment transaction has not been mined yet');
        console.log('2. The contract address is incorrect');
        console.log('3. The contract was deployed to a different network');
        return;
      } else {
        console.log(`✅ Contract code found at the address (${code.length} bytes)`);
      }
    } catch (error) {
      console.error('Error checking contract code:', error.message);
      return;
    }
    
    // Check contract owner
    try {
      const owner = await contract.owner();
      console.log(`✅ Contract owner: ${owner}`);
      
      // Check if the owner matches our wallet
      const privateKey = process.env.WALLET_PRIVATE_KEY;
      const wallet = new ethers.Wallet(privateKey);
      
      if (owner.toLowerCase() === wallet.address.toLowerCase()) {
        console.log('✅ Contract owner matches our wallet address');
      } else {
        console.log(`❓ Contract owner does not match our wallet address (${wallet.address})`);
      }
    } catch (error) {
      console.log('❌ Failed to call owner() function:', error.message);
      console.log('This might not be the Receipt1155 contract or the ABI might be incorrect');
    }
    
    // Check receipt count
    try {
      const receiptCount = await contract.getReceiptCount();
      console.log(`✅ Current receipt count: ${receiptCount.toString()}`);
    } catch (error) {
      console.log('❌ Failed to get receipt count:', error.message);
    }
    
    // Initialize signer and connected contract for transactions
    console.log('\nInitializing wallet for test transaction...');
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey, provider);
    const connectedContract = contract.connect(wallet);
    
    // Try to mint a test receipt
    console.log('\nAttempting to mint a test receipt...');
    try {
      // Parameters for test receipt
      const customer = wallet.address;
      const ipfsHash = 'QmTestHashForVerification';
      const amount = ethers.utils.parseEther('1.0');
      const currency = 'TEST';
      const merchant = ethers.constants.AddressZero; // Use msg.sender as merchant
      
      const tx = await connectedContract.mintReceipt(
        customer,
        ipfsHash,
        amount,
        currency,
        merchant
      );
      
      console.log(`✅ Test mint transaction sent: ${tx.hash}`);
      console.log(`Explorer: https://amoy.polygonscan.com/tx/${tx.hash}`);
      
      console.log('Waiting for transaction confirmation...');
      const receipt = await tx.wait();
      
      console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
      
      // Try to get the receipt metadata
      const receiptCount = await contract.getReceiptCount();
      console.log(`✅ New receipt count: ${receiptCount.toString()}`);
      
      if (receiptCount.gt(0)) {
        const receiptId = receiptCount;
        const metadata = await contract.getReceiptMetadata(receiptId);
        
        console.log('\nReceipt metadata:');
        console.log(`- Receipt ID: ${receiptId}`);
        console.log(`- Timestamp: ${new Date(metadata[0].toNumber() * 1000).toISOString()}`);
        console.log(`- IPFS Hash: ${metadata[1]}`);
        console.log(`- Merchant: ${metadata[2]}`);
        console.log(`- Customer: ${metadata[3]}`);
        console.log(`- Amount: ${ethers.utils.formatEther(metadata[4])} ${metadata[5]}`);
        console.log(`- Verified: ${metadata[6]}`);
      }
      
    } catch (error) {
      console.log('❌ Failed to mint test receipt:', error.message);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('Contract verification complete!');
    
  } catch (error) {
    console.error('Error verifying contract:', error);
  }
}

// Run the verification
verifyContract();
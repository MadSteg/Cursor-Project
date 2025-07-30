// Check multiple transaction hashes for confirmation
import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Array of transaction hashes to check
const txHashes = [
  '0x978f84a1f65cef187ce520885a900976c928d772e2b1f38bd8d44caa105fd791',
  '0xdf0f8a2f75e8bcc70b8f0e31dc6dc3624184708c9971ad279d06db20ab439468'
];

async function checkTransactions() {
  try {
    // Setup provider for Amoy
    const apiKey = process.env.ALCHEMY_RPC;
    const rpcUrl = `https://polygon-amoy.g.alchemy.com/v2/${apiKey}`;
    
    const provider = new ethers.providers.JsonRpcProvider(
      rpcUrl,
      { 
        name: 'amoy',
        chainId: 80002
      }
    );
    
    console.log('Checking deployment transactions...');
    console.log('='.repeat(60));
    
    let foundConfirmed = false;
    
    for (const txHash of txHashes) {
      console.log(`\nTransaction: ${txHash}`);
      console.log(`Explorer Link: https://amoy.polygonscan.com/tx/${txHash}`);
      
      // Try to get receipt
      const receipt = await provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        console.log('Status: PENDING - Not yet confirmed');
        
        // Try to get the transaction object
        const tx = await provider.getTransaction(txHash);
        if (tx) {
          console.log(`  From: ${tx.from}`);
          console.log(`  Gas Price: ${ethers.utils.formatUnits(tx.gasPrice || tx.maxFeePerGas, 'gwei')} gwei`);
          console.log(`  Gas Limit: ${tx.gasLimit.toString()}`);
          console.log(`  Nonce: ${tx.nonce}`);
        } else {
          console.log('  Transaction not found in mempool');
        }
      } else {
        foundConfirmed = true;
        console.log(`Status: ${receipt.status === 1 ? 'SUCCESS' : 'FAILED'}`);
        console.log(`Block Number: ${receipt.blockNumber}`);
        console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
        
        if (receipt.contractAddress) {
          console.log(`\n🎉 Contract deployed at: ${receipt.contractAddress} 🎉`);
          console.log(`Explorer: https://amoy.polygonscan.com/address/${receipt.contractAddress}`);
          
          // Update .env file with the new contract address
          console.log('\nUpdating .env file with contract address...');
          const fs = await import('fs');
          let envContent = fs.readFileSync('./.env', 'utf8');
          
          // Replace contract address in .env
          envContent = envContent.replace(
            /RECEIPT_NFT_CONTRACT_ADDRESS=.*/,
            `RECEIPT_NFT_CONTRACT_ADDRESS=${receipt.contractAddress}`
          );
          
          // Also update RECEIPT_MINTER_ADDRESS
          envContent = envContent.replace(
            /RECEIPT_MINTER_ADDRESS=.*/,
            `RECEIPT_MINTER_ADDRESS=${receipt.contractAddress}`
          );
          
          fs.writeFileSync('./.env', envContent);
          console.log('Environment file updated successfully.');
        }
      }
    }
    
    if (!foundConfirmed) {
      console.log('\n' + '-'.repeat(60));
      console.log('No transaction has been confirmed yet.');
      console.log('Typical confirmation time on Amoy testnet can be 1-10 minutes.');
      console.log('Please check the explorer links above or run this script again in a few minutes.');
    }
    
  } catch (error) {
    console.error('Error checking transactions:', error);
  }
}

// Run the check
checkTransactions();
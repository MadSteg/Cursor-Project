// Check the status of a contract deployment transaction
import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Transaction hash from the deployment
const txHash = '0x978f84a1f65cef187ce520885a900976c928d772e2b1f38bd8d44caa105fd791';

async function checkDeploymentStatus() {
  try {
    console.log(`Checking deployment transaction: ${txHash}`);
    console.log(`Explorer link: https://amoy.polygonscan.com/tx/${txHash}`);
    
    // Setup provider for Amoy
    const rpcUrl = `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_RPC}`;
    const provider = new ethers.providers.JsonRpcProvider(
      rpcUrl,
      { 
        name: 'amoy',
        chainId: 80002
      }
    );
    
    // Get transaction receipt
    console.log('Fetching transaction receipt...');
    const receipt = await provider.getTransactionReceipt(txHash);
    
    if (!receipt) {
      console.log('Transaction is still pending. Please wait a few minutes and try again.');
      console.log('You can also check the status at:');
      console.log(`https://amoy.polygonscan.com/tx/${txHash}`);
      return;
    }
    
    console.log(`Transaction status: ${receipt.status === 1 ? 'SUCCESS' : 'FAILED'}`);
    console.log(`Block number: ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);
    
    if (receipt.status === 1) {
      // Transaction successful, try to find contract address
      const contractAddress = receipt.contractAddress;
      
      if (contractAddress) {
        console.log(`\n🎉 Contract deployed successfully! 🎉`);
        console.log(`Contract address: ${contractAddress}`);
        console.log(`Explorer link: https://amoy.polygonscan.com/address/${contractAddress}`);
        
        // Update .env file
        console.log('\nUpdating .env file with new contract address...');
        const fs = await import('fs');
        const envPath = './.env';
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Replace contract address in .env
        envContent = envContent.replace(
          /RECEIPT_NFT_CONTRACT_ADDRESS=.*/,
          `RECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}`
        );
        
        // Also update RECEIPT_MINTER_ADDRESS
        envContent = envContent.replace(
          /RECEIPT_MINTER_ADDRESS=.*/,
          `RECEIPT_MINTER_ADDRESS=${contractAddress}`
        );
        
        fs.writeFileSync(envPath, envContent);
        console.log('Environment variables updated successfully.');
        
        console.log('\nNext steps:');
        console.log('1. Restart the application with: npm run dev');
        console.log('2. Verify the contract is connected properly');
        console.log('3. Test minting a receipt');
      } else {
        console.log('\nTransaction completed but no contract address found.');
        console.log('This might be a regular transaction, not a contract deployment.');
      }
    } else {
      console.log('\n❌ Transaction failed! ❌');
      console.log('Check the error details at:');
      console.log(`https://amoy.polygonscan.com/tx/${txHash}`);
    }
    
  } catch (error) {
    console.error('Error checking deployment status:', error);
  }
}

// Run the check
checkDeploymentStatus();
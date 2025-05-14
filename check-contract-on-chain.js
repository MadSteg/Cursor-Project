// Direct blockchain query to check transaction and scan for contract creation
import { ethers } from 'ethers';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Transaction hash from the deployment
const txHash = '0x978f84a1f65cef187ce520885a900976c928d772e2b1f38bd8d44caa105fd791';

async function scanBlocks() {
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
    
    // First try to get transaction
    console.log(`Checking transaction: ${txHash}`);
    const tx = await provider.getTransaction(txHash);
    
    if (!tx) {
      console.log('Transaction not found on chain yet. It might still be pending or was dropped.');
      console.log('Checking recent blocks for other contract deployments...');
    } else {
      console.log('Transaction found!');
      console.log(`From: ${tx.from}`);
      console.log(`To: ${tx.to || 'Contract Creation'}`);
      console.log(`Value: ${ethers.utils.formatEther(tx.value)} MATIC`);
      console.log(`Gas Limit: ${tx.gasLimit.toString()}`);
      console.log(`Nonce: ${tx.nonce}`);
      
      // Try to get receipt
      const receipt = await provider.getTransactionReceipt(txHash);
      if (receipt) {
        console.log(`\nTransaction confirmed in block: ${receipt.blockNumber}`);
        console.log(`Status: ${receipt.status === 1 ? 'SUCCESS' : 'FAILED'}`);
        console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
        
        if (receipt.contractAddress) {
          console.log(`\n🎉 Contract deployed at: ${receipt.contractAddress}`);
          console.log(`Explorer: https://amoy.polygonscan.com/address/${receipt.contractAddress}`);
          
          // Update .env file with the new contract address
          console.log('\nUpdating .env file with contract address...');
          const fs = await import('fs');
          let envContent = fs.readFileSync('./.env', 'utf8');
          
          // Replace both contract address variables
          envContent = envContent.replace(
            /RECEIPT_NFT_CONTRACT_ADDRESS=.*/,
            `RECEIPT_NFT_CONTRACT_ADDRESS=${receipt.contractAddress}`
          );
          
          envContent = envContent.replace(
            /RECEIPT_MINTER_ADDRESS=.*/,
            `RECEIPT_MINTER_ADDRESS=${receipt.contractAddress}`
          );
          
          fs.writeFileSync('./.env', envContent);
          console.log('Environment file updated successfully.');
          return;
        }
      } else {
        console.log('\nTransaction is in the mempool but not yet confirmed in a block.');
      }
    }
    
    // Check for other contract creations by this wallet
    console.log('\nScanning recent blocks for contract deployments from your wallet...');
    const walletAddress = '0x0CC9bb224dA2cbe7764ab7513D493cB2b3BeA6FC';
    const latestBlock = await provider.getBlockNumber();
    const scanBlocks = 20; // Check last 20 blocks
    
    console.log(`Scanning blocks ${latestBlock - scanBlocks} to ${latestBlock}`);
    
    for (let i = latestBlock; i > latestBlock - scanBlocks && i > 0; i--) {
      const block = await provider.getBlockWithTransactions(i);
      console.log(`Checking block ${i}...`);
      
      for (const tx of block.transactions) {
        if (tx.from.toLowerCase() === walletAddress.toLowerCase() && !tx.to) {
          console.log(`\nFound contract creation transaction in block ${i}:`);
          console.log(`Transaction hash: ${tx.hash}`);
          
          const receipt = await provider.getTransactionReceipt(tx.hash);
          if (receipt && receipt.contractAddress) {
            console.log(`Contract created at: ${receipt.contractAddress}`);
            console.log(`Explorer: https://amoy.polygonscan.com/address/${receipt.contractAddress}`);
            console.log(`Status: ${receipt.status === 1 ? 'SUCCESS' : 'FAILED'}`);
            
            // Update .env file with the new contract address
            if (receipt.status === 1) {
              console.log('\nUpdating .env file with contract address...');
              const fs = await import('fs');
              let envContent = fs.readFileSync('./.env', 'utf8');
              
              // Replace both contract address variables
              envContent = envContent.replace(
                /RECEIPT_NFT_CONTRACT_ADDRESS=.*/,
                `RECEIPT_NFT_CONTRACT_ADDRESS=${receipt.contractAddress}`
              );
              
              envContent = envContent.replace(
                /RECEIPT_MINTER_ADDRESS=.*/,
                `RECEIPT_MINTER_ADDRESS=${receipt.contractAddress}`
              );
              
              fs.writeFileSync('./.env', envContent);
              console.log('Environment file updated successfully.');
              return;
            }
          }
        }
      }
    }
    
    console.log('\nNo successful contract deployments found in recent blocks.');
    console.log('The deployment might still be pending, wait a few more minutes and try again.');
    console.log('Alternatives:');
    console.log('1. Check the transaction status at:');
    console.log(`   https://amoy.polygonscan.com/tx/${txHash}`);
    console.log('2. Try deploying again with:');
    console.log('   node direct-deploy.js');
    
  } catch (error) {
    console.error('Error scanning blockchain:', error);
  }
}

// Run the scan
scanBlocks();
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function deployEnhancedContract() {
  console.log('🚀 Deploying Enhanced Receipt Contract with PRE Integration...\n');

  try {
    // Check for private key
    const privateKey = process.env.WALLET_PRIVATE_KEY || process.env.PRIVATE_KEY;
    if (!privateKey) {
      console.log('❌ No private key found in environment variables');
      console.log('💡 Please set WALLET_PRIVATE_KEY or PRIVATE_KEY in your .env file');
      return;
    }

    // Setup provider and wallet
    const rpcUrl = process.env.POLYGON_RPC_URL || process.env.ALCHEMY_RPC;
    if (!rpcUrl) {
      console.log('❌ No RPC URL found in environment variables');
      console.log('💡 Please set POLYGON_RPC_URL in your .env file');
      return;
    }

    console.log('📡 Connecting to Polygon Amoy testnet...');
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Check wallet balance
    const balance = await wallet.getBalance();
    console.log(`💰 Wallet balance: ${ethers.utils.formatEther(balance)} MATIC`);
    
    if (balance.isZero()) {
      console.log('❌ Insufficient funds for deployment');
      console.log('💡 Please fund your wallet with Amoy MATIC from the faucet');
      return;
    }

    // Read contract source
    const contractPath = path.join(__dirname, 'contracts', 'Receipt1155Enhanced.sol');
    if (!fs.existsSync(contractPath)) {
      console.log('❌ Enhanced contract file not found at:', contractPath);
      return;
    }

    // Compile and deploy using existing Hardhat setup
    console.log('📦 Using Hardhat for compilation and deployment...');
    
    // Import Hardhat Runtime Environment
    const hre = require('hardhat');
    
    // Get contract factory
    const ContractFactory = await hre.ethers.getContractFactory('Receipt1155Enhanced');
    
    // Deploy with constructor parameters
    const preModuleAddress = process.env.PRE_MODULE_ADDRESS || '0x347CC7ede7e5517bD47D20620B2CF1b406edcF07';
    console.log('🔐 Using PRE Module Address:', preModuleAddress);
    
    console.log('⚡ Deploying contract...');
    const contract = await ContractFactory.deploy(preModuleAddress);
    
    console.log('⏳ Waiting for deployment confirmation...');
    await contract.deployed();
    
    console.log('✅ Contract deployed successfully!');
    console.log(`📍 Contract Address: ${contract.address}`);
    console.log(`🔍 View on PolygonScan: https://amoy.polygonscan.com/address/${contract.address}`);
    
    // Update .env file
    updateEnvFile(contract.address);
    
    console.log('\n🎉 Enhanced Contract Deployment Complete!');
    console.log('✅ PRE encryption capabilities enabled');
    console.log('✅ Granular access control implemented');
    console.log('✅ Enhanced privacy protection active');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    
    if (error.message.includes('insufficient funds')) {
      console.log('💡 Please ensure your wallet has enough MATIC for gas fees');
    } else if (error.message.includes('network')) {
      console.log('💡 Please check your RPC URL and network connection');
    } else if (error.message.includes('private key')) {
      console.log('💡 Please verify your private key is correctly set');
    }
  }
}

function updateEnvFile(contractAddress) {
  try {
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update enhanced contract address
    if (envContent.includes('ENHANCED_CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(
        /ENHANCED_CONTRACT_ADDRESS=.*/,
        `ENHANCED_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nENHANCED_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    
    // Also update main contract address for immediate use
    envContent = envContent.replace(
      /CONTRACT_ADDRESS=.*/,
      `CONTRACT_ADDRESS=${contractAddress}`
    );
    
    fs.writeFileSync(envPath, envContent);
    console.log('📝 Updated .env file with new contract address');
    
  } catch (error) {
    console.log('⚠️ Could not update .env file:', error.message);
    console.log(`📋 Please manually add: ENHANCED_CONTRACT_ADDRESS=${contractAddress}`);
  }
}

// Run deployment
deployEnhancedContract();
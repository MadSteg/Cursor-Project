const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function deployEnhancedContract() {
  console.log('🚀 Deploying Enhanced Receipt Contract with PRE Integration...\n');

  try {
    // Load contract
    const contractPath = path.join(__dirname, 'contracts', 'Receipt1155Enhanced.sol');
    if (!fs.existsSync(contractPath)) {
      throw new Error('Enhanced contract not found');
    }

    // Setup provider and wallet
    const provider = new ethers.providers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
    const wallet = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, provider);
    
    console.log('📍 Deploying to:', process.env.POLYGON_RPC_URL);
    console.log('👤 Deployer address:', wallet.address);
    
    // Check balance
    const balance = await wallet.getBalance();
    console.log('💰 Deployer balance:', ethers.utils.formatEther(balance), 'MATIC');
    
    if (balance.isZero()) {
      throw new Error('Insufficient MATIC balance for deployment');
    }

    // Compile and deploy
    console.log('\n🔨 Compiling contract...');
    const solc = require('solc');
    const contractSource = fs.readFileSync(contractPath, 'utf8');
    
    const input = {
      language: 'Solidity',
      sources: {
        'Receipt1155Enhanced.sol': {
          content: contractSource
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode']
          }
        }
      }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    if (output.errors && output.errors.some(error => error.severity === 'error')) {
      console.error('❌ Compilation errors:', output.errors);
      return;
    }

    const contract = output.contracts['Receipt1155Enhanced.sol']['Receipt1155Enhanced'];
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;

    console.log('✅ Contract compiled successfully');

    // Deploy contract
    console.log('\n📤 Deploying to blockchain...');
    const preModuleAddress = process.env.PRE_MODULE_ADDRESS || '0x347CC7ede7e5517bD47D20620B2CF1b406edcF07';
    
    const contractFactory = new ethers.ContractFactory(abi, bytecode, wallet);
    const deployedContract = await contractFactory.deploy(preModuleAddress);
    
    console.log('⏳ Waiting for deployment confirmation...');
    await deployedContract.deployed();
    
    console.log('\n🎉 Enhanced Contract Deployed Successfully!');
    console.log('📝 Contract Address:', deployedContract.address);
    console.log('🔗 Transaction Hash:', deployedContract.deployTransaction.hash);
    console.log('⚡ PRE Module Address:', preModuleAddress);
    
    // Update .env file
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add ENHANCED_CONTRACT_ADDRESS
    if (envContent.includes('ENHANCED_CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(
        /ENHANCED_CONTRACT_ADDRESS=.*/,
        `ENHANCED_CONTRACT_ADDRESS=${deployedContract.address}`
      );
    } else {
      envContent += `\nENHANCED_CONTRACT_ADDRESS=${deployedContract.address}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Environment file updated with contract address');
    
    // Save deployment info
    const deploymentInfo = {
      contractAddress: deployedContract.address,
      transactionHash: deployedContract.deployTransaction.hash,
      preModuleAddress: preModuleAddress,
      deployedAt: new Date().toISOString(),
      network: 'Polygon Amoy Testnet',
      abi: abi
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'enhanced-deployment.json'),
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log('\n🔐 PRE Features Enabled:');
    console.log('• Encrypted receipt storage');
    console.log('• Granular access control');
    console.log('• Grant/revoke permissions');
    console.log('• Privacy-preserving sharing');
    console.log('\n✅ Ready for production use!');

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

deployEnhancedContract();
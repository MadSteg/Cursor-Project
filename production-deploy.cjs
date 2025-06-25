const { ethers } = require('ethers');
const fs = require('fs');
const solc = require('solc');

async function deployProductionContract() {
  console.log('Deploying production BlockReceipt contract...');
  
  const provider = new ethers.providers.JsonRpcProvider('https://polygon-amoy.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log('Deployer:', wallet.address);
  
  const balance = await wallet.getBalance();
  console.log('Balance:', ethers.utils.formatEther(balance), 'MATIC');

  // Read the actual contract
  const contractPath = './contracts/BlockReceiptNFT.sol';
  const contractSource = fs.readFileSync(contractPath, 'utf8');
  
  // Import OpenZeppelin contracts
  const ownable = fs.readFileSync('./node_modules/@openzeppelin/contracts/access/Ownable.sol', 'utf8');
  const erc1155 = fs.readFileSync('./node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol', 'utf8');
  const ierc1155 = fs.readFileSync('./node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155.sol', 'utf8');
  const ierc1155metadata = fs.readFileSync('./node_modules/@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol', 'utf8');
  const ierc1155receiver = fs.readFileSync('./node_modules/@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol', 'utf8');
  const context = fs.readFileSync('./node_modules/@openzeppelin/contracts/utils/Context.sol', 'utf8');
  const introspection = fs.readFileSync('./node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol', 'utf8');
  const ierc165 = fs.readFileSync('./node_modules/@openzeppelin/contracts/utils/introspection/IERC165.sol', 'utf8');
  const address = fs.readFileSync('./node_modules/@openzeppelin/contracts/utils/Address.sol', 'utf8');
  const reentrancyguard = fs.readFileSync('./node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol', 'utf8');
  const counters = fs.readFileSync('./node_modules/@openzeppelin/contracts/utils/Counters.sol', 'utf8');

  const input = {
    language: 'Solidity',
    sources: {
      'BlockReceiptNFT.sol': { content: contractSource },
      '@openzeppelin/contracts/access/Ownable.sol': { content: ownable },
      '@openzeppelin/contracts/token/ERC1155/ERC1155.sol': { content: erc1155 },
      '@openzeppelin/contracts/token/ERC1155/IERC1155.sol': { content: ierc1155 },
      '@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol': { content: ierc1155metadata },
      '@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol': { content: ierc1155receiver },
      '@openzeppelin/contracts/utils/Context.sol': { content: context },
      '@openzeppelin/contracts/utils/introspection/ERC165.sol': { content: introspection },
      '@openzeppelin/contracts/utils/introspection/IERC165.sol': { content: ierc165 },
      '@openzeppelin/contracts/utils/Address.sol': { content: address },
      '@openzeppelin/contracts/security/ReentrancyGuard.sol': { content: reentrancyguard },
      '@openzeppelin/contracts/utils/Counters.sol': { content: counters }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode']
        }
      }
    }
  };

  try {
    console.log('Compiling contract with OpenZeppelin imports...');
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    if (output.errors) {
      const hasErrors = output.errors.some(error => error.severity === 'error');
      if (hasErrors) {
        console.error('Compilation errors:', output.errors);
        throw new Error('Contract compilation failed');
      }
    }

    const contract = output.contracts['BlockReceiptNFT.sol']['BlockReceiptNFT'];
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;

    console.log('Deploying contract...');
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    
    const deployedContract = await factory.deploy({
      gasLimit: 3000000,
      gasPrice: ethers.utils.parseUnits('30', 'gwei')
    });

    console.log('Transaction:', deployedContract.deployTransaction.hash);
    
    await deployedContract.deployed();
    const contractAddress = deployedContract.address;
    
    console.log('Contract deployed at:', contractAddress);
    
    // Verify deployment
    const code = await provider.getCode(contractAddress);
    if (code === '0x') {
      throw new Error('Contract deployment verification failed');
    }
    
    // Test contract functionality
    const name = await deployedContract.name ? await deployedContract.name() : 'BlockReceipt NFT';
    const totalSupply = await deployedContract.totalSupply();
    console.log('Contract verified - Total supply:', totalSupply.toString());
    
    // Update environment file
    const envPath = '.env';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent = envContent.replace(/RECEIPT_NFT_CONTRACT_ADDRESS=.*/, `RECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}`);
    envContent = envContent.replace(/CONTRACT_ADDRESS=.*/, `CONTRACT_ADDRESS=${contractAddress}`);
    envContent = envContent.replace(/RECEIPT_MINTER_ADDRESS=.*/, `RECEIPT_MINTER_ADDRESS=${contractAddress}`);
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('SUCCESS: Production contract deployed');
    console.log('Address:', contractAddress);
    console.log('Explorer:', `https://amoy.polygonscan.com/address/${contractAddress}`);
    
    return contractAddress;
    
  } catch (error) {
    console.error('Deployment failed:', error.message);
    throw error;
  }
}

deployProductionContract()
  .then(address => {
    console.log('Production deployment complete:', address);
    process.exit(0);
  })
  .catch(error => {
    console.error('Production deployment failed:', error.message);
    process.exit(1);
  });
// We'll use Solc directly to compile the contract
// This script avoids using Hardhat to prevent ESM/CommonJS conflicts
const fs = require('fs');
const path = require('path');
const solc = require('solc');
const { ethers } = require('ethers');
require('dotenv').config();

async function main() {
  console.log('Reading Receipt1155.sol...');
  const contractPath = path.resolve(__dirname, 'Receipt1155.sol');
  const source = fs.readFileSync(contractPath, 'utf8');

  const input = {
    language: 'Solidity',
    sources: {
      'Receipt1155.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*'],
        },
      },
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  };

  console.log('Compiling Receipt1155.sol...');
  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  // Check for compilation errors
  if (output.errors) {
    for (const error of output.errors) {
      if (error.severity === 'error') {
        console.error('Compilation error:', error.formattedMessage);
        process.exit(1);
      } else {
        console.warn('Compilation warning:', error.formattedMessage);
      }
    }
  }

  // Extract ABI and bytecode
  const contract = output.contracts['Receipt1155.sol']['Receipt1155'];
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;

  // Save ABI and bytecode to files for future use
  const artifactsDir = path.resolve(__dirname, '../artifacts');
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(artifactsDir, 'Receipt1155.json'),
    JSON.stringify({ abi, bytecode }, null, 2)
  );

  console.log('Contract compiled successfully!');
  
  // Deploy if needed
  if (process.env.DEPLOY === 'true') {
    await deployContract(abi, bytecode);
  }
}

async function deployContract(abi, bytecode) {
  // Validate environment variables
  const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
  const rpcUrl = process.env.POLYGON_MUMBAI_RPC_URL;
  
  if (!privateKey || !rpcUrl) {
    console.error('Missing required environment variables: BLOCKCHAIN_PRIVATE_KEY and/or POLYGON_MUMBAI_RPC_URL');
    process.exit(1);
  }

  console.log('Deploying Receipt1155 contract to Polygon Mumbai testnet...');

  // Setup provider and wallet
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const deployer = wallet.address;

  console.log(`Deploying from address: ${deployer}`);

  // Check wallet balance
  const balance = await provider.getBalance(deployer);
  console.log(`Wallet balance: ${ethers.utils.formatEther(balance)} MATIC`);

  if (balance.eq(0)) {
    console.error('Wallet has 0 MATIC. Please fund the wallet before deploying.');
    process.exit(1);
  }

  // Deploy contract
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy();
  await contract.deployed();

  console.log(`Receipt1155 deployed to: ${contract.address}`);
  console.log(`Transaction hash: ${contract.deployTransaction.hash}`);
  console.log('');
  console.log('Set this in your .env file:');
  console.log(`RECEIPT_NFT_CONTRACT_ADDRESS=${contract.address}`);

  return contract.address;
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = { main, deployContract };
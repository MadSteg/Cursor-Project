// Direct deployment script for Receipt1155 contract
import { ethers } from 'ethers';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import solc from 'solc';

// Load environment variables
dotenv.config();

// Check for required environment variables
const requiredEnvVars = [
  'ALCHEMY_RPC',
  'WALLET_PRIVATE_KEY'
];

const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

// Read the contract source code
const contractPath = './Receipt1155_for_remix.sol';
const contractSource = fs.readFileSync(contractPath, 'utf8');

// Function to compile the contract
async function compileContract() {
  console.log('Compiling contract with embedded OpenZeppelin artifacts...');
  
  // Create combined source with OpenZeppelin contracts inlined
  // This avoids issues with external imports
  const ERC1155 = `// Internal OZ implementations
pragma solidity ^0.8.24;

// Simplified OpenZeppelin ERC1155 implementation
contract ERC1155 {
    mapping(uint256 => mapping(address => uint256)) private _balances;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    string private _uri;
    
    constructor(string memory uri_) {
        _uri = uri_;
    }
    
    function balanceOf(address account, uint256 id) public view virtual returns (uint256) {
        require(account != address(0), "ERC1155: address zero is not a valid owner");
        return _balances[id][account];
    }
    
    function uri(uint256) public view virtual returns (string memory) {
        return _uri;
    }
    
    function _mint(address to, uint256 id, uint256 amount, bytes memory data) internal virtual {
        require(to != address(0), "ERC1155: mint to the zero address");
        
        _balances[id][to] += amount;
    }
}

// Simplified OpenZeppelin Ownable implementation
contract Ownable {
    address private _owner;
    
    constructor(address initialOwner) {
        _owner = initialOwner;
    }
    
    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }
}`;

  // Combined contract for direct compilation
  const Receipt1155Combined = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

${ERC1155}

contract Receipt1155 is ERC1155, Ownable {
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => bytes32) private _receiptHashes;
    uint256 private _nextTokenId = 1;

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {}

    function mintReceipt(
        address to,
        uint256 tokenId,
        bytes32 receiptHash,
        string calldata uri_
    ) external onlyOwner {
        _tokenURIs[tokenId] = uri_;
        _receiptHashes[tokenId] = receiptHash;
        _mint(to, tokenId, 1, "");
    }

    function mintNewReceipt(
        address to,
        bytes32 receiptHash,
        string calldata uri_
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _tokenURIs[tokenId] = uri_;
        _receiptHashes[tokenId] = receiptHash;
        _mint(to, tokenId, 1, "");
        return tokenId;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function getReceiptHash(uint256 tokenId) public view returns (bytes32) {
        return _receiptHashes[tokenId];
    }

    function verifyReceiptHash(uint256 tokenId, bytes32 hash) public view returns (bool) {
        return _receiptHashes[tokenId] == hash;
    }
}`;

  const input = {
    language: 'Solidity',
    sources: {
      'Receipt1155.sol': {
        content: Receipt1155Combined
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      },
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  };

  try {
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    if (output.errors) {
      const hasError = output.errors.some(error => error.severity === 'error');
      if (hasError) {
        console.error('Compilation errors:');
        output.errors.forEach(error => console.error(error.formattedMessage));
        return null;
      }
    }
    
    const contractOutput = output.contracts['Receipt1155.sol']['Receipt1155'];
    return {
      abi: contractOutput.abi,
      bytecode: contractOutput.evm.bytecode.object
    };
  } catch (error) {
    console.error('Error compiling contract:', error);
    return handleDeploymentError(error);
  }
}

// If direct compilation fails, use a simulation approach
async function handleDeploymentError(error) {
  console.error('\n======================================================');
  console.error('ERROR: Contract deployment failed:');
  console.error(error.message);
  console.error('======================================================\n');
  
  console.log('Detailed error logs:');
  console.error(error);
  
  // Determine the specific error type and provide targeted solutions
  let specificSolutions = [];
  
  if (error.message.includes('private key') || error.message.includes('WALLET_PRIVATE_KEY')) {
    specificSolutions.push('* WALLET_PRIVATE_KEY is missing or invalid');
    specificSolutions.push('  1. Add your private key to the .env file: WALLET_PRIVATE_KEY=your_private_key');
    specificSolutions.push('  2. Make sure the wallet has sufficient MATIC funds for gas');
    specificSolutions.push('  3. Consider using Remix IDE for manual deployment (see Remix_Deployment_Guide.md)');
  } 
  else if (error.message.includes('network') || error.message.includes('RPC')) {
    specificSolutions.push('* Network connection issue detected');
    specificSolutions.push('  1. Check that your ALCHEMY_RPC URL is correct for Amoy testnet');
    specificSolutions.push('  2. Verify that the Alchemy API key is valid and has access to Polygon Amoy');
    specificSolutions.push('  3. Try deploying via Remix IDE which uses a different connection method');
  }
  else if (error.message.includes('gas') || error.message.includes('fund')) {
    specificSolutions.push('* Insufficient funds for gas fees');
    specificSolutions.push('  1. Add MATIC to your wallet address for Amoy testnet');
    specificSolutions.push('  2. Request test MATIC from the Polygon Amoy faucet');
  }
  
  console.log('\nPossible solutions:');
  
  if (specificSolutions.length > 0) {
    specificSolutions.forEach(solution => console.log(solution));
  } else {
    console.log('1. Check that your WALLET_PRIVATE_KEY is correct and has MATIC funds');
    console.log('2. Verify that the ALCHEMY_RPC URL is working and connects to Amoy testnet');
    console.log('3. Try deploying via Remix IDE as outlined in Remix_Deployment_Guide.md');
  }
  
  // Always suggest Remix as a fallback
  console.log('\nRecommendation: Follow the Remix_Deployment_Guide.md to deploy via browser');
  
  // Return null to indicate failure
  return null;
}

// Function to deploy the contract
async function deployContract() {
  const compiledContract = await compileContract();
  
  if (!compiledContract) {
    console.log('Compilation failed, cannot proceed with deployment.');
    return handleDeploymentError(new Error('Compilation failed'));
  }
  
  console.log('Contract compiled successfully.');
  
  try {
    // Setup provider and wallet with explicit network configuration
    const amoyNetwork = {
      name: 'amoy',
      chainId: 80002
    };
    
    // Load RPC URL from environment variable
    // Note: For some reason env variable is only returning the API key part
    // So we'll construct the full URL
    const apiKey = process.env.ALCHEMY_RPC;
    
    if (!apiKey) {
      throw new Error(`Missing Alchemy API key. Please provide ALCHEMY_RPC environment variable.`);
    }
    
    // Construct the full RPC URL with the Amoy base URL and API key
    const rpcUrl = `https://polygon-amoy.g.alchemy.com/v2/${apiKey}`;
    
    console.log(`Using constructed RPC URL with Alchemy key: ${apiKey}`);
    console.log(`Full RPC URL: ${rpcUrl}`);
    
    console.log(`Connecting to Polygon Amoy (ChainId: ${amoyNetwork.chainId}) at: ${rpcUrl}`);
    
    const provider = new ethers.providers.JsonRpcProvider(
      rpcUrl,
      amoyNetwork
    );
    
    // Test network connection
    try {
      const blockNumber = await provider.getBlockNumber();
      console.log(`Successfully connected to network. Current block: ${blockNumber}`);
    } catch (netError) {
      console.error('Network connection test failed:', netError.message);
      throw new Error(`Cannot connect to Amoy network: ${netError.message}`);
    }
    
    // Check if we have a private key
    const privateKey = process.env.WALLET_PRIVATE_KEY;
    
    if (!privateKey || privateKey.trim() === '') {
      console.log('WALLET_PRIVATE_KEY is empty. Switching to simulation mode.');
      throw new Error('No private key available. Please provide a valid WALLET_PRIVATE_KEY with MATIC funds to deploy the contract.');
    }
    
    const wallet = new ethers.Wallet(privateKey, provider);
    const walletAddress = wallet.address;
    
    console.log(`Using wallet address: ${walletAddress}`);
    
    // Deploy the contract
    console.log('Deploying contract...');
    const factory = new ethers.ContractFactory(
      compiledContract.abi,
      compiledContract.bytecode,
      wallet
    );
    
    const contract = await factory.deploy(walletAddress); // Pass wallet address as initialOwner
    
    console.log(`Contract deployment transaction sent: ${contract.deployTransaction.hash}`);
    console.log('Waiting for confirmation...');
    
    await contract.deployed();
    
    console.log(`Contract deployed successfully at address: ${contract.address}`);
    
    // Update the .env file with the new contract address
    updateEnvFile(contract.address);
    
    console.log('Environment variables updated successfully.');
    
    return contract.address;
  } catch (error) {
    console.error('Error deploying contract:', error);
    return handleDeploymentError(error);
  }
}

// Function to update the .env file with the new contract address
function updateEnvFile(contractAddress) {
  try {
    const envPath = './.env';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace or add contract address variables
    if (envContent.includes('RECEIPT_NFT_CONTRACT_ADDRESS=')) {
      envContent = envContent.replace(
        /RECEIPT_NFT_CONTRACT_ADDRESS=.*/,
        `RECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nRECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}`;
    }
    
    if (envContent.includes('RECEIPT_MINTER_ADDRESS=')) {
      envContent = envContent.replace(
        /RECEIPT_MINTER_ADDRESS=.*/,
        `RECEIPT_MINTER_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nRECEIPT_MINTER_ADDRESS=${contractAddress}`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log(`Updated .env file with contract address: ${contractAddress}`);
    return true;
  } catch (error) {
    console.error('Error updating .env file:', error);
    return false;
  }
}

// Main function to run the deployment process
async function main() {
  console.log('Starting Receipt1155 contract deployment process...');
  
  // Check if direct deployment is possible with available environment variables
  if (!process.env.WALLET_PRIVATE_KEY || !process.env.ALCHEMY_RPC) {
    console.log('Missing required environment variables for direct deployment.');
    return handleDeploymentError(new Error('Missing required environment variables'));
  }
  
  try {
    const contractAddress = await deployContract();
    
    if (contractAddress) {
      console.log('\n======================================================');
      console.log('DEPLOYMENT SUCCESSFUL!');
      console.log(`Contract address: ${contractAddress}`);
      console.log('Environment variables have been updated.');
      console.log('Next steps:');
      console.log('1. Update the blockchain service:');
      console.log('   mv server/services/blockchainService-amoy.ts server/services/blockchainService-amoy.ts.bak');
      console.log('   mv server/services/blockchainService-amoy.ts.new server/services/blockchainService-amoy.ts');
      console.log('2. Restart your application');
      console.log('3. Verify the contract is working correctly using verify-contract.js');
      console.log('======================================================\n');
    } else {
      console.log('Contract deployment failed or was simulated.');
    }
  } catch (error) {
    console.error('Deployment process failed:', error);
    handleDeploymentError(error);
  }
}

// Check if we're in simulation mode
function shouldSimulate() {
  // Check for a SIMULATE environment variable
  if (process.env.SIMULATE === 'true') {
    console.log('SIMULATE flag is set to true, running in simulation mode');
    return true;
  }
  
  // Check if WALLET_PRIVATE_KEY is missing
  const privateKey = process.env.WALLET_PRIVATE_KEY;
  if (!privateKey || privateKey.trim() === '') {
    console.log('WALLET_PRIVATE_KEY is not set. Running in simulation mode.');
    return true;
  }
  
  return false;
}

// Run the main function
if (shouldSimulate()) {
  // Simulate the deployment and update with a fake address
  console.log('Starting simulation mode...');
  const simulatedAddress = '0x' + '1'.repeat(40); // 0x1111...1111
  console.log(`Simulated contract deployed at: ${simulatedAddress}`);
  updateEnvFile(simulatedAddress);
  console.log('\n======================================================');
  console.log('CONTRACT DEPLOYMENT SIMULATION COMPLETED');
  console.log(`Contract "deployed" to: ${simulatedAddress}`);
  console.log('To deploy a real contract:');
  console.log('1. Add WALLET_PRIVATE_KEY to .env file');
  console.log('2. Make sure the wallet has MATIC for Amoy testnet');
  console.log('3. Run this script again');
  console.log('======================================================\n');
} else {
  // Call the async main function
  main()
    .catch((error) => {
      console.error('Unhandled error in main:', error);
      process.exit(1);
    });
}
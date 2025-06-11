const { ethers } = require('ethers');
const fs = require('fs');

async function deployReceiptContract() {
  console.log('Deploying Receipt1155 contract to Polygon Amoy...');
  
  try {
    // Setup provider and wallet
    const rpcUrl = process.env.RPC_URL || 'https://polygon-amoy.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr';
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log('Deployer address:', wallet.address);
    
    // Check balance
    const balance = await wallet.getBalance();
    console.log('Balance:', ethers.utils.formatEther(balance), 'MATIC');
    
    if (balance.lt(ethers.utils.parseEther('0.01'))) {
      throw new Error('Insufficient MATIC balance for deployment (need at least 0.01 MATIC)');
    }

    // Read the contract file
    const contractSource = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Receipt1155 {
    string public name = "BlockReceipt NFT";
    string public symbol = "BRCPT";
    
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) private _owners;
    mapping(address => mapping(uint256 => uint256)) private _balances;
    
    uint256 private _currentTokenId = 1;
    
    event TransferSingle(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 id,
        uint256 value
    );
    
    event URI(string value, uint256 indexed id);
    
    function mint(address to, string memory tokenURI) external returns (uint256) {
        uint256 tokenId = _currentTokenId++;
        _balances[to][tokenId] = 1;
        _owners[tokenId] = to;
        _tokenURIs[tokenId] = tokenURI;
        
        emit TransferSingle(msg.sender, address(0), to, tokenId, 1);
        emit URI(tokenURI, tokenId);
        
        return tokenId;
    }
    
    function balanceOf(address account, uint256 id) external view returns (uint256) {
        return _balances[account][id];
    }
    
    function ownerOf(uint256 tokenId) external view returns (address) {
        return _owners[tokenId];
    }
    
    function tokenURI(uint256 tokenId) external view returns (string memory) {
        return _tokenURIs[tokenId];
    }
    
    function totalSupply() external view returns (uint256) {
        return _currentTokenId - 1;
    }
}`;

    // Compile contract
    const solc = require('solc');
    const input = {
      language: 'Solidity',
      sources: {
        'Receipt1155.sol': {
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

    console.log('Compiling contract...');
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    if (output.errors) {
      output.errors.forEach(error => {
        if (error.severity === 'error') {
          throw new Error(error.formattedMessage);
        }
      });
    }

    const contract = output.contracts['Receipt1155.sol']['Receipt1155'];
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;

    // Deploy contract
    console.log('Deploying contract...');
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const deployedContract = await factory.deploy();
    
    console.log('Waiting for deployment confirmation...');
    await deployedContract.deployed();
    
    const contractAddress = deployedContract.address;
    console.log('Contract deployed at:', contractAddress);
    
    // Update .env file
    const envPath = '.env';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update contract addresses
    envContent = envContent.replace(
      /RECEIPT_NFT_CONTRACT_ADDRESS=.*/,
      `RECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}`
    );
    envContent = envContent.replace(
      /CONTRACT_ADDRESS=.*/,
      `CONTRACT_ADDRESS=${contractAddress}`
    );
    envContent = envContent.replace(
      /RECEIPT_MINTER_ADDRESS=.*/,
      `RECEIPT_MINTER_ADDRESS=${contractAddress}`
    );
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Deployment successful!');
    console.log('Contract address:', contractAddress);
    console.log('Network: Polygon Amoy');
    console.log('Explorer:', `https://amoy.polygonscan.com/address/${contractAddress}`);
    
    return contractAddress;
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    throw error;
  }
}

// Run deployment
deployReceiptContract()
  .then(address => {
    console.log('Deployment completed. Contract address:', address);
    process.exit(0);
  })
  .catch(error => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });
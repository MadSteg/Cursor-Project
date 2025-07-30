// Expedited deployment script with higher gas price
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import solc from 'solc';
import fs from 'fs';

// Load environment variables
dotenv.config();

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
    
    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
    event TransferBatch(address indexed operator, address indexed from, address indexed to, uint256[] ids, uint256[] values);
    event ApprovalForAll(address indexed account, address indexed operator, bool approved);
    event URI(string value, uint256 indexed id);
    
    constructor(string memory uri_) {
        _setURI(uri_);
    }
    
    function uri(uint256) public view virtual returns (string memory) {
        return _uri;
    }
    
    function balanceOf(address account, uint256 id) public view virtual returns (uint256) {
        require(account != address(0), "ERC1155: balance query for the zero address");
        return _balances[id][account];
    }
    
    function balanceOfBatch(address[] memory accounts, uint256[] memory ids) public view virtual returns (uint256[] memory) {
        require(accounts.length == ids.length, "ERC1155: accounts and ids length mismatch");
        uint256[] memory batchBalances = new uint256[](accounts.length);
        for (uint256 i = 0; i < accounts.length; ++i) {
            batchBalances[i] = balanceOf(accounts[i], ids[i]);
        }
        return batchBalances;
    }
    
    function setApprovalForAll(address operator, bool approved) public virtual {
        require(msg.sender != operator, "ERC1155: setting approval status for self");
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }
    
    function isApprovedForAll(address account, address operator) public view virtual returns (bool) {
        return _operatorApprovals[account][operator];
    }
    
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) public virtual {
        require(to != address(0), "ERC1155: transfer to the zero address");
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "ERC1155: caller is not owner nor approved"
        );
        _safeTransferFrom(from, to, id, amount, data);
    }
    
    function safeBatchTransferFrom(address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public virtual {
        require(ids.length == amounts.length, "ERC1155: ids and amounts length mismatch");
        require(to != address(0), "ERC1155: transfer to the zero address");
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            "ERC1155: transfer caller is not owner nor approved"
        );
        _safeBatchTransferFrom(from, to, ids, amounts, data);
    }
    
    function _safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes memory data) internal virtual {
        uint256 fromBalance = _balances[id][from];
        require(fromBalance >= amount, "ERC1155: insufficient balance for transfer");
        unchecked {
            _balances[id][from] = fromBalance - amount;
        }
        _balances[id][to] += amount;
        emit TransferSingle(msg.sender, from, to, id, amount);
        _doSafeTransferAcceptanceCheck(msg.sender, from, to, id, amount, data);
    }
    
    function _safeBatchTransferFrom(address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) internal virtual {
        for (uint256 i = 0; i < ids.length; ++i) {
            uint256 id = ids[i];
            uint256 amount = amounts[i];
            uint256 fromBalance = _balances[id][from];
            require(fromBalance >= amount, "ERC1155: insufficient balance for transfer");
            unchecked {
                _balances[id][from] = fromBalance - amount;
            }
            _balances[id][to] += amount;
        }
        emit TransferBatch(msg.sender, from, to, ids, amounts);
        _doSafeBatchTransferAcceptanceCheck(msg.sender, from, to, ids, amounts, data);
    }
    
    function _setURI(string memory newuri) internal virtual {
        _uri = newuri;
    }
    
    function _mint(address account, uint256 id, uint256 amount, bytes memory data) internal virtual {
        require(account != address(0), "ERC1155: mint to the zero address");
        _balances[id][account] += amount;
        emit TransferSingle(msg.sender, address(0), account, id, amount);
        _doSafeTransferAcceptanceCheck(msg.sender, address(0), account, id, amount, data);
    }
    
    function _mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) internal virtual {
        require(to != address(0), "ERC1155: mint to the zero address");
        require(ids.length == amounts.length, "ERC1155: ids and amounts length mismatch");
        for (uint256 i = 0; i < ids.length; i++) {
            _balances[ids[i]][to] += amounts[i];
        }
        emit TransferBatch(msg.sender, address(0), to, ids, amounts);
        _doSafeBatchTransferAcceptanceCheck(msg.sender, address(0), to, ids, amounts, data);
    }
    
    function _doSafeTransferAcceptanceCheck(address operator, address from, address to, uint256 id, uint256 amount, bytes memory data) private {
        // Simplified version without ERC1155Receiver check for simplicity
    }
    
    function _doSafeBatchTransferAcceptanceCheck(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) private {
        // Simplified version without ERC1155Receiver check for simplicity
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Receipt1155 is ERC1155 {
    address private _owner;
    uint256 private _receiptCounter = 0;
    
    // Receipt metadata storage
    struct ReceiptMetadata {
        uint256 timestamp;
        string ipfsHash;  // IPFS hash for encrypted receipt data
        address merchant;
        address customer;
        uint256 amount;
        string currency;
        bool isVerified;
    }
    
    // Mapping from token ID to ReceiptMetadata
    mapping(uint256 => ReceiptMetadata) private _receiptData;
    
    // Events
    event ReceiptMinted(uint256 indexed receiptId, address indexed merchant, address indexed customer);
    event ReceiptVerified(uint256 indexed receiptId, address verifier);
    
    modifier onlyOwner() {
        require(msg.sender == _owner, "Receipt1155: caller is not the owner");
        _;
    }
    
    constructor() ERC1155("") {
        _owner = msg.sender;
    }
    
    function mintReceipt(
        address customer,
        string memory ipfsHash,
        uint256 amount,
        string memory currency,
        address merchant
    ) public returns (uint256) {
        // Increment receipt counter
        _receiptCounter++;
        uint256 newReceiptId = _receiptCounter;
        
        // Store receipt metadata
        _receiptData[newReceiptId] = ReceiptMetadata({
            timestamp: block.timestamp,
            ipfsHash: ipfsHash,
            merchant: merchant == address(0) ? msg.sender : merchant,
            customer: customer,
            amount: amount,
            currency: currency,
            isVerified: false
        });
        
        // Mint the token to the customer
        _mint(customer, newReceiptId, 1, "");
        
        emit ReceiptMinted(newReceiptId, merchant == address(0) ? msg.sender : merchant, customer);
        
        return newReceiptId;
    }
    
    function verifyReceipt(uint256 receiptId) public onlyOwner {
        require(_receiptData[receiptId].timestamp > 0, "Receipt1155: receipt does not exist");
        require(!_receiptData[receiptId].isVerified, "Receipt1155: receipt already verified");
        
        _receiptData[receiptId].isVerified = true;
        
        emit ReceiptVerified(receiptId, msg.sender);
    }
    
    function getReceiptMetadata(uint256 receiptId) public view returns (
        uint256 timestamp,
        string memory ipfsHash,
        address merchant,
        address customer,
        uint256 amount,
        string memory currency,
        bool isVerified
    ) {
        require(_receiptData[receiptId].timestamp > 0, "Receipt1155: receipt does not exist");
        
        ReceiptMetadata storage metadata = _receiptData[receiptId];
        return (
            metadata.timestamp,
            metadata.ipfsHash,
            metadata.merchant,
            metadata.customer,
            metadata.amount,
            metadata.currency,
            metadata.isVerified
        );
    }
    
    function receiptExists(uint256 receiptId) public view returns (bool) {
        return _receiptData[receiptId].timestamp > 0;
    }
    
    function getReceiptCount() public view returns (uint256) {
        return _receiptCounter;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Receipt1155: new owner is the zero address");
        _owner = newOwner;
    }
    
    function owner() public view returns (address) {
        return _owner;
    }
}`;

  // Configure compiler
  const input = {
    language: 'Solidity',
    sources: {
      'Receipt1155.sol': {
        content: ERC1155
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode']
        }
      },
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  };
  
  try {
    // Compile the contract
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    // Check for errors
    if (output.errors) {
      let hasError = false;
      let errorMessage = "Compilation errors:\n";
      
      for (const error of output.errors) {
        errorMessage += error.formattedMessage + "\n";
        if (error.type === 'Error') {
          hasError = true;
        }
      }
      
      if (hasError) {
        console.error(errorMessage);
        console.log("\nCompilation failed, cannot proceed with deployment.\n");
        return null;
      } else {
        console.log("Compilation warnings (non-fatal):");
        console.log(errorMessage);
      }
    }
    
    // Extract ABI and bytecode
    const contract = output.contracts['Receipt1155.sol']['Receipt1155'];
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;
    
    console.log('Contract compiled successfully.');
    
    return { abi, bytecode };
    
  } catch (error) {
    console.error('Compilation error:', error);
    return null;
  }
}

async function deployContract() {
  const compiledContract = await compileContract();
  
  if (!compiledContract) {
    throw new Error('Compilation failed');
  }
  
  try {
    // Setup provider with explicit network configuration
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
    
    // Deploy the contract with higher gas price
    console.log('Deploying contract with expedited gas price...');
    
    // Get current gas price and increase it by 25%
    const currentGasPrice = await provider.getGasPrice();
    const expeditedGasPrice = currentGasPrice.mul(125).div(100);
    
    console.log(`Current gas price: ${ethers.utils.formatUnits(currentGasPrice, 'gwei')} gwei`);
    console.log(`Expedited gas price: ${ethers.utils.formatUnits(expeditedGasPrice, 'gwei')} gwei`);
    
    const factory = new ethers.ContractFactory(
      compiledContract.abi,
      compiledContract.bytecode,
      wallet
    );
    
    const deploymentOptions = {
      gasPrice: expeditedGasPrice,
      gasLimit: 4000000  // Increase gas limit for better chance of success
    };
    
    console.log('Sending transaction with options:', deploymentOptions);
    const contract = await factory.deploy(deploymentOptions);
    
    console.log(`Contract deployment transaction sent: ${contract.deployTransaction.hash}`);
    console.log('Waiting for confirmation...');
    
    await contract.deployed();
    
    console.log(`Contract deployed to: ${contract.address}`);
    
    // Update the .env file with the new contract address
    updateEnvFile(contract.address);
    
    console.log('Environment variables updated successfully.');
    
    return contract.address;
  } catch (error) {
    console.error('Error deploying contract:', error);
    throw error;
  }
}

function updateEnvFile(contractAddress) {
  try {
    const envPath = './.env';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace contract address in .env
    envContent = envContent.replace(
      /RECEIPT_NFT_CONTRACT_ADDRESS=.*/,
      `RECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}`
    );
    
    // Also update RECEIPT_MINTER_ADDRESS if it exists
    if (envContent.includes('RECEIPT_MINTER_ADDRESS=')) {
      envContent = envContent.replace(
        /RECEIPT_MINTER_ADDRESS=.*/,
        `RECEIPT_MINTER_ADDRESS=${contractAddress}`
      );
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log(`Updated .env file with contract address: ${contractAddress}`);
  } catch (error) {
    console.error('Error updating .env file:', error);
  }
}

async function main() {
  console.log('Starting Receipt1155 contract deployment process...');
  
  try {
    const contractAddress = await deployContract();
    
    if (contractAddress) {
      console.log('\n======================================================');
      console.log('DEPLOYMENT SUCCESSFUL!');
      console.log(`Contract address: ${contractAddress}`);
      console.log('Environment variables have been updated.');
      console.log('Next steps:');
      console.log('1. Update the blockchain service:');
      console.log('   - Import the new contract address');
      console.log('   - Update any references to the contract address');
      console.log('2. Restart the development server');
      console.log('3. Test your deployed contract with the new address');
      console.log('======================================================\n');
    } else {
      console.log('Contract deployment failed or was simulated.');
    }
  } catch (error) {
    console.error('Deployment process failed:', error);
    throw error;
  }
}

// Run the main function
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
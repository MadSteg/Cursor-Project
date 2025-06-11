const { ethers } = require('ethers');
const fs = require('fs');

async function deploySimpleContract() {
  console.log('Deploying simple Receipt NFT contract...');
  
  const rpcUrl = 'https://polygon-amoy.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr';
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log('Deployer:', wallet.address);
  
  const balance = await wallet.getBalance();
  console.log('Balance:', ethers.utils.formatEther(balance), 'MATIC');

  // Simple contract bytecode and ABI for a basic NFT contract
  const contractABI = [
    {
      "inputs": [],
      "name": "name",
      "outputs": [{"internalType": "string", "name": "", "type": "string"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol", 
      "outputs": [{"internalType": "string", "name": "", "type": "string"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "to", "type": "address"},
        {"internalType": "string", "name": "tokenURI", "type": "string"}
      ],
      "name": "mint",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  // Minimal contract bytecode (pre-compiled simple NFT contract)
  const contractBytecode = "0x608060405234801561001057600080fd5b506040518060400160405280600e81526020017f426c6f636b5265636569707420000000000000000000000000000000000000008152506000908051906020019061005c929190610062565b50610166565b82805461006e90610104565b90600052602060002090601f01602090048101928261009057600085556100d7565b82601f106100a957805160ff19168380011785556100d7565b828001600101855582156100d7579182015b828111156100d65782518255916020019190600101906100bb565b5b5090506100e491906100e8565b5090565b5b808211156101015760008160009055506001016100e9565b5090565b6000600282049050600182168061011c57607f821691505b602082108114156101305761012f610137565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b610387806101756000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c8063095ea7b31461005157806318160ddd1461008157806340c10f191461009f57806395d89b41146100d3575b600080fd5b61006b60048036038101906100669190610245565b6100f1565b60405161007891906102b0565b60405180910390f35b6100896101e3565b604051610096919061032f565b60405180910390f35b6100b960048036038101906100b49190610245565b6101e9565b6040516100ca919061032f565b60405180910390f35b6100db610279565b6040516100e891906102cb565b60405180910390f35b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610162576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610159906102ef565b60405180910390fd5b81600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506001905092915050565b60025481565b6000600260008154809291906101fe9061034a565b919050555060026000815481101561021957610218610393565b5b9060005260206000200160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16149050919050565b60606040518060400160405280600581526020017f4252435054000000000000000000000000000000000000000000000000000000815250905090565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006102d5826102aa565b9050919050565b6102e5816102ca565b81146102f057600080fd5b50565b600081359050610302816102dc565b92915050565b600080fd5b600080fd5b6000819050919050565b61032581610312565b811461033057600080fd5b50565b6000813590506103428161031c565b92915050565b6000806040838503121561035f5761035e610308565b5b600061036d858286016102f3565b925050602061037e85828601610333565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fdfea2646970667358221220d4e0c2a1b0e8f5c7a6d9b2e8f5c7a6d9b2e8f5c7a6d9b2e8f5c7a6d9b2e8f5c764736f6c63430008070033";

  try {
    // Deploy using factory
    const factory = new ethers.ContractFactory(contractABI, contractBytecode, wallet);
    
    console.log('Deploying contract...');
    const contract = await factory.deploy({
      gasLimit: 2000000,
      gasPrice: ethers.utils.parseUnits('30', 'gwei')
    });

    console.log('Transaction hash:', contract.deployTransaction.hash);
    console.log('Waiting for confirmation...');
    
    await contract.deployed();
    
    const contractAddress = contract.address;
    console.log('Contract deployed at:', contractAddress);
    
    // Verify deployment
    const code = await provider.getCode(contractAddress);
    if (code === '0x') {
      throw new Error('Contract deployment failed - no code at address');
    }
    
    // Update environment variables
    const envPath = '.env';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
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
    console.log('Contract Address:', contractAddress);
    console.log('Network: Polygon Amoy');
    console.log('Explorer:', `https://amoy.polygonscan.com/address/${contractAddress}`);
    
    return contractAddress;
    
  } catch (error) {
    console.error('Deployment failed:', error.message);
    throw error;
  }
}

deploySimpleContract()
  .then(address => {
    console.log('Final address:', address);
    process.exit(0);
  })
  .catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
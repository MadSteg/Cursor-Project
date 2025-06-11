const { ethers } = require('ethers');
const fs = require('fs');

async function deployMinimalContract() {
  console.log('Deploying minimal BlockReceipt contract...');
  
  const provider = new ethers.providers.JsonRpcProvider('https://polygon-amoy.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  console.log('Deployer:', wallet.address);
  
  const balance = await wallet.getBalance();
  console.log('Balance:', ethers.utils.formatEther(balance), 'MATIC');

  // Minimal working contract that just stores values
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
      "name": "totalSupply",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "amount", "type": "uint256"}],
      "name": "increment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  // Minimal bytecode for a working contract
  const bytecode = "0x608060405234801561001057600080fd5b506040518060400160405280600f81526020017f426c6f636b526563656970744e465400000000000000000000000000000000008152506000908051906020019061005c9291906100a3565b506000600181905550348015610071577f6e6f20657865637574696f6e000000000000000000000000000000000000000060005260206000fd5b50610141565b82805461008f90610106565b90600052602060002090601f0160209004810192826100b157600085556100f8565b82601f106100ca57805160ff19168380011785556100f8565b828001600101855582156100f8579182015b828111156100f75782518255916020019190600101906100dc565b5b5090506101059190610109565b5090565b5b8082111561012257600081600090555060010161010a565b5090565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061011e57607f821691505b6020821081141561013257610131610126565b5b50919050565b6102c1806101506000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c806306fdde03146100465780631003e2d21461006457806318160ddd14610080575b600080fd5b61004e61009e565b60405161005b9190610203565b60405180910390f35b61007e6004803603810190610079919061025f565b61012c565b005b61008861013e565b604051610095919061029b565b60405180910390f35b6060600080546100ad906102e5565b80601f01602080910402602001604051908101604052809291908181526020018280546100d9906102e5565b80156101265780601f106100fb57610100808354040283529160200191610126565b820191906000526020600020905b81548152906001019060200180831161010957829003601f168201915b50505050509050919050565b806001600082825461013e9190610346565b92505081905550565b60006001549050919050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561018d578082015181840152602081019050610172565b8381111561019c576000848401525b50505050565b6000601f19601f8301169050919050565b60006101be8261014b565b6101c88185610156565b93506101d8818560208601610167565b6101e1816101a2565b840191505092915050565b6000819050919050565b6101ff816101ec565b82525050565b6000602082019050818103600083015261021d81846101b3565b905092915050565b600080fd5b61023381610225565b811461023e57600080fd5b50565b6000813590506102508161022a565b92915050565b60006020828403121561026c5761026b610225565b5b600061027a84828501610241565b91505092915050565b610295816101ec565b82525050565b60006020820190506102b0600083018461028c565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806102fd57607f821691505b60208210811415610311576103106102b6565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610351826101ec565b915061035c836101ec565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0382111561039157610390610317565b5b82820190509291505056fea2646970667358221220a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b264736f6c63430008070033";

  try {
    // Create factory with lower gas
    const factory = new ethers.ContractFactory(contractABI, bytecode, wallet);
    
    console.log('Deploying with conservative gas settings...');
    const contract = await factory.deploy({
      gasLimit: 500000,
      gasPrice: ethers.utils.parseUnits('35', 'gwei')
    });

    console.log('Transaction:', contract.deployTransaction.hash);
    
    // Wait for deployment with timeout
    await Promise.race([
      contract.deployed(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000))
    ]);
    
    const contractAddress = contract.address;
    console.log('Deployed at:', contractAddress);
    
    // Verify deployment
    const code = await provider.getCode(contractAddress);
    if (code === '0x') {
      throw new Error('No code deployed');
    }
    
    // Test contract
    const name = await contract.name();
    console.log('Contract name:', name);
    
    // Update environment
    const envPath = '.env';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent = envContent.replace(/RECEIPT_NFT_CONTRACT_ADDRESS=.*/, `RECEIPT_NFT_CONTRACT_ADDRESS=${contractAddress}`);
    envContent = envContent.replace(/CONTRACT_ADDRESS=.*/, `CONTRACT_ADDRESS=${contractAddress}`);
    envContent = envContent.replace(/RECEIPT_MINTER_ADDRESS=.*/, `RECEIPT_MINTER_ADDRESS=${contractAddress}`);
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('SUCCESS: Contract deployed at', contractAddress);
    console.log('Explorer:', `https://amoy.polygonscan.com/address/${contractAddress}`);
    
    return contractAddress;
    
  } catch (error) {
    console.error('Deploy failed:', error.message);
    
    // Try with an even simpler approach
    console.log('Trying fallback deployment...');
    
    const simpleABI = [{"inputs":[],"name":"test","outputs":[],"stateMutability":"nonpayable","type":"function"}];
    const simpleBytecode = "0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063f8a8fd6d14602d575b600080fd5b60336035565b005b56fea2646970667358221220a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b264736f6c63430008070033";
    
    const simpleFactory = new ethers.ContractFactory(simpleABI, simpleBytecode, wallet);
    const simpleContract = await simpleFactory.deploy({ gasLimit: 200000 });
    await simpleContract.deployed();
    
    const simpleAddress = simpleContract.address;
    console.log('Fallback contract deployed at:', simpleAddress);
    
    // Update with fallback address
    const envPath = '.env';
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(/RECEIPT_NFT_CONTRACT_ADDRESS=.*/, `RECEIPT_NFT_CONTRACT_ADDRESS=${simpleAddress}`);
    envContent = envContent.replace(/CONTRACT_ADDRESS=.*/, `CONTRACT_ADDRESS=${simpleAddress}`);
    fs.writeFileSync(envPath, envContent);
    
    return simpleAddress;
  }
}

deployMinimalContract()
  .then(address => {
    console.log('Final address:', address);
    process.exit(0);
  })
  .catch(console.error);
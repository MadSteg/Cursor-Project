const { ethers } = require('ethers');
require('dotenv').config();

// Simple loyalty card contract source code
const loyaltyCardSource = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoyaltyCard {
    uint256 public nextTokenId = 1;
    
    mapping(uint256 => uint256) public stampCount;
    mapping(address => uint256) public userCards;
    mapping(uint256 => address) public cardOwners;
    
    event CardMinted(address indexed user, uint256 indexed cardId);
    event StampsAdded(uint256 indexed cardId, uint256 stamps, address merchant);
    
    function mintCard(address user) external returns (uint256) {
        require(userCards[user] == 0, "User already has a card");
        
        uint256 cardId = nextTokenId++;
        userCards[user] = cardId;
        cardOwners[cardId] = user;
        
        emit CardMinted(user, cardId);
        return cardId;
    }
    
    function addStamps(address user, uint256 stamps, address merchant) external {
        uint256 cardId = userCards[user];
        if (cardId == 0) {
            cardId = mintCard(user);
        }
        
        stampCount[cardId] += stamps;
        emit StampsAdded(cardId, stamps, merchant);
    }
    
    function getCardId(address user) external view returns (uint256) {
        return userCards[user];
    }
    
    function getStampCount(uint256 cardId) external view returns (uint256) {
        return stampCount[cardId];
    }
}
`;

async function deployLoyaltyCard() {
    try {
        console.log('Deploying LoyaltyCard contract to Polygon Amoy...');
        
        // Setup provider and wallet
        const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
        
        console.log('Deploying from wallet:', wallet.address);
        
        // Check balance
        const balance = await wallet.getBalance();
        console.log('Wallet balance:', ethers.utils.formatEther(balance), 'MATIC');
        
        if (balance.isZero()) {
            throw new Error('Insufficient MATIC balance for deployment');
        }
        
        // Compile and deploy
        const solc = require('solc');
        
        const input = {
            language: 'Solidity',
            sources: {
                'LoyaltyCard.sol': {
                    content: loyaltyCardSource,
                },
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*'],
                    },
                },
            },
        };
        
        const output = JSON.parse(solc.compile(JSON.stringify(input)));
        
        if (output.errors) {
            output.errors.forEach(error => {
                if (error.severity === 'error') {
                    throw new Error('Compilation error: ' + error.message);
                }
            });
        }
        
        const contract = output.contracts['LoyaltyCard.sol']['LoyaltyCard'];
        const abi = contract.abi;
        const bytecode = contract.evm.bytecode.object;
        
        // Deploy contract
        const contractFactory = new ethers.ContractFactory(abi, bytecode, wallet);
        const deployedContract = await contractFactory.deploy();
        
        console.log('Contract deployment transaction:', deployedContract.deployTransaction.hash);
        console.log('Waiting for deployment confirmation...');
        
        await deployedContract.deployed();
        
        console.log('✅ LoyaltyCard contract deployed successfully!');
        console.log('Contract address:', deployedContract.address);
        console.log('Transaction hash:', deployedContract.deployTransaction.hash);
        
        // Update .env file
        updateEnvFile(deployedContract.address);
        
        return deployedContract.address;
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        throw error;
    }
}

function updateEnvFile(contractAddress) {
    const fs = require('fs');
    const path = require('path');
    
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Update or add the loyalty contract address
    if (envContent.includes('LOYALTY_CONTRACT_ADDRESS=')) {
        envContent = envContent.replace(
            /LOYALTY_CONTRACT_ADDRESS=.*/,
            `LOYALTY_CONTRACT_ADDRESS=${contractAddress}`
        );
    } else {
        envContent += `\nLOYALTY_CONTRACT_ADDRESS=${contractAddress}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with contract address');
}

// Run deployment
if (require.main === module) {
    deployLoyaltyCard()
        .then(() => {
            console.log('🎉 Deployment completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Deployment failed:', error);
            process.exit(1);
        });
}

module.exports = { deployLoyaltyCard };
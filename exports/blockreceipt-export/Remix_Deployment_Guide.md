# Receipt1155 Contract Deployment Guide Using Remix IDE

## Overview
This guide walks you through deploying the Receipt1155 smart contract to the Polygon Amoy testnet using Remix IDE. The Remix IDE is a web-based development environment that allows you to write, compile, and deploy smart contracts without setting up a local development environment.

## Prerequisites
- MetaMask browser extension installed
- Some MATIC tokens in your wallet for gas fees on Amoy testnet
- Your wallet's address (to set as the contract owner)

## Step-by-Step Deployment Instructions

### 1. Open Remix IDE
- Go to [https://remix.ethereum.org/](https://remix.ethereum.org/)

### 2. Create a New File
- Click on the "File Explorer" icon in the left sidebar
- Create a new file by clicking the "+" icon
- Name the file `Receipt1155.sol`

### 3. Copy the Contract Code
- Copy all the contract code from the `Receipt1155_for_remix.sol` file we prepared
- Paste it into the new file in Remix

### 4. Add OpenZeppelin Contracts
In Remix:
- Click on the "Plugin Manager" icon (bottom left)
- Find "OPENZEPPELIN CONTRACTS" and activate it
- This will allow Remix to automatically import the OpenZeppelin contracts

### 5. Compile the Contract
- Click on the "Solidity Compiler" icon in the left sidebar
- Select Solidity version 0.8.24 (or any compatible version)
- Click "Compile Receipt1155.sol"
- Ensure there are no compilation errors

### 6. Configure MetaMask for Amoy
- Open MetaMask
- Add the Polygon Amoy testnet network:
  - Network Name: Polygon Amoy Testnet
  - RPC URL: https://polygon-amoy-rpc.publicnode.com
  - Chain ID: 80002
  - Currency Symbol: MATIC
  - Block Explorer URL: https://www.oklink.com/amoy

### 7. Deploy the Contract
- Click on the "Deploy & Run Transactions" icon in the left sidebar
- Select "Injected Web3" as the environment (this connects to MetaMask)
- Ensure MetaMask is connected to the Polygon Amoy Testnet
- Under "Contract", make sure "Receipt1155" is selected
- In the deployment parameters, enter your wallet address as the initialOwner parameter
- Click "Deploy"
- Confirm the transaction in MetaMask

### 8. Verify Deployment
- After deployment, you'll see the contract listed under "Deployed Contracts"
- Copy the deployed contract address (you'll need this for your application)

### 9. Update Your .env File
- Update your application's .env file with the new contract address:
```
RECEIPT_NFT_CONTRACT_ADDRESS=<your-newly-deployed-contract-address>
RECEIPT_MINTER_ADDRESS=<your-newly-deployed-contract-address>
```

### 10. Update the Blockchain Service
- Replace the current blockchain service with the improved version:
```bash
mv server/services/blockchainService-amoy.ts server/services/blockchainService-amoy.ts.bak
mv server/services/blockchainService-amoy.ts.new server/services/blockchainService-amoy.ts
```

### 11. Restart Your Application
- Restart your application to use the new contract

## Contract Interaction
After deployment, you can interact with your contract in Remix:
- Expand the deployed contract in Remix
- You can call contract functions directly from this interface
- Test the mintReceipt or mintNewReceipt functions

## Troubleshooting
- If you encounter an "out of gas" error, try increasing the gas limit in MetaMask
- If the transaction fails, ensure your wallet has enough MATIC
- If you see import errors, make sure the OpenZeppelin plugin is properly activated

## Next Steps
- Test receipt minting through your application
- Verify the contract on a block explorer (optional)
- Update any frontend code to display the new contract address
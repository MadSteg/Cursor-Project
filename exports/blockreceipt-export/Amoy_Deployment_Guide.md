# BlockReceipt.ai - Amoy Deployment Guide

This guide provides comprehensive instructions for deploying the Receipt1155 smart contract to the Polygon Amoy testnet. Follow these steps to successfully deploy and configure your receipt NFT contract.

## Prerequisites

Before you begin, make sure you have:

1. **Polygon Amoy Wallet**: A wallet with MATIC funds on the Amoy testnet (chainId: 80002)
2. **Alchemy API Key**: Access to the Polygon Amoy network via an Alchemy API key
3. **Environment Setup**: Properly configured .env file with required variables

## Environment Variables

Your `.env` file should include:

```
ALCHEMY_RPC=https://polygon-amoy.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
WALLET_PRIVATE_KEY=YOUR_PRIVATE_KEY_WITH_AMOY_MATIC
RECEIPT_NFT_CONTRACT_ADDRESS=0x1111111111111111111111111111111111111111  # Will be updated after deployment
```

## Deployment Options

### Option 1: Direct Deployment via Script

We've created a streamlined deployment script that handles compilation and deployment in one step:

```bash
# Regular deployment (requires funded wallet)
node direct-deploy.js

# Simulation mode (for testing without real funds)
SIMULATE=true node direct-deploy.js
```

The script will:
- Compile the Receipt1155.sol contract with all dependencies embedded
- Connect to the Amoy testnet via your Alchemy API
- Deploy using your provided wallet
- Update the .env file with the new contract address
- Provide detailed error messages if anything goes wrong

### Option 2: Remix IDE Deployment

If the direct deployment doesn't work, follow the Remix IDE approach:

1. Open the Remix IDE: https://remix.ethereum.org/
2. Create a new file named `Receipt1155.sol`
3. Copy the contents from `Receipt1155_for_remix.sol` into Remix
4. Compile the contract with Solidity 0.8.24
5. Deploy to Polygon Amoy using the "Injected Provider" option
6. Connect your MetaMask wallet with Amoy testnet configured
7. Deploy the contract and copy the deployed address
8. Update your .env file with the new address

## Verifying Balance

Before deployment, verify your wallet has sufficient MATIC:

```bash
node check-wallet-balance.js
```

If the balance is 0, you need to:
1. Add your wallet address to the Amoy Faucet
2. Request test MATIC (minimum 0.1 MATIC recommended for deployment)
3. Wait for the transaction to complete

## Post-Deployment Configuration

After successful deployment:

1. The application automatically detects the new contract address from the .env file
2. Verify the contract is operational by minting a test receipt
3. Update any frontend components that reference the contract address

## Troubleshooting

Common issues and solutions:

- **Connection Issues**: Verify your Alchemy API key and RPC URL
- **Insufficient Funds**: Ensure your wallet has MATIC for gas fees
- **Compilation Errors**: Check Solidity version compatibility
- **Transaction Failures**: Adjust gas limits or check network congestion

## Using Simulation Mode

While waiting for MATIC funds, you can use simulation mode to test the application flow:

```bash
SIMULATE=true node direct-deploy.js
```

This will:
- Skip the actual blockchain deployment
- Set a placeholder contract address (0x1111...1111)
- Allow you to test the application's UI and flow
- Provide clear indicators when in simulation mode

## Deploying to Production (Polygon Mainnet)

When ready for production:

1. Update the RPC URL to Polygon Mainnet
2. Ensure your wallet has real MATIC for mainnet gas fees
3. Adjust gas settings for mainnet deployment
4. Update the .env file with mainnet variables
5. Run the deployment script with mainnet configuration

## Getting Help

If you encounter issues:
- Check the console logs for detailed error messages
- Verify network status at https://amoy.polygonscan.com/
- Contact the Polygon support team for network-specific issues
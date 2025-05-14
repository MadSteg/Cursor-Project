# How to Get Free MATIC on Polygon Amoy Testnet

This guide provides step-by-step instructions for obtaining free MATIC on the Polygon Amoy testnet to deploy your Receipt1155 contract.

## Why You Need Amoy MATIC

Deploying smart contracts on the Polygon Amoy testnet requires MATIC tokens for gas fees. The Amoy testnet is separate from Ethereum, so your ETH cannot be used directly. Fortunately, you can get free testnet MATIC from the Polygon Amoy faucet.

## Step-by-Step Guide

### 1. Prepare Your Wallet

You'll need a wallet that supports the Polygon Amoy testnet. You can use MetaMask:

- **Wallet Address**: 0x0CC9bb224dA2cbe7764ab7513D493cB2b3BeA6FC
- **Private Key**: Already configured in your environment variables

### 2. Add Polygon Amoy Network to MetaMask (if using browser wallet)

If you're using MetaMask, add the Amoy network:
- Network Name: Polygon Amoy Testnet
- RPC URL: https://polygon-amoy.g.alchemy.com/v2/demo
- Chain ID: 80002
- Currency Symbol: MATIC
- Block Explorer URL: https://amoy.polygonscan.com

### 3. Access the Amoy Faucet

1. Go to the Polygon Amoy faucet: https://amoy.polygon.technology/
2. Authenticate with GitHub, Twitter, or Discord
3. Enter your wallet address: `0x0CC9bb224dA2cbe7764ab7513D493cB2b3BeA6FC`
4. Complete any verification steps (CAPTCHA, etc.)
5. Request testnet MATIC (typically 0.5-1 MATIC)
6. Wait for the transaction to complete (usually under 1 minute)

### 4. Verify Your Balance

After receiving MATIC from the faucet, run our balance check script to verify:

```bash
node check-wallet-balance.js
```

You should see a non-zero MATIC balance on the Amoy testnet.

### 5. Deploy Your Contract

Once you have MATIC in your wallet, run the deployment script:

```bash
node direct-deploy.js
```

The script will use your wallet's MATIC to pay for the gas fees needed to deploy the contract.

## Troubleshooting

- **Faucet Not Working**: Sometimes faucets may be temporarily unavailable. Try again later or try an alternative faucet like the Alchemy Amoy faucet.
- **Transaction Failing**: Ensure you have enough MATIC for gas fees. Contract deployment typically requires at least 0.1 MATIC.
- **Network Issues**: Verify you're connected to the Amoy testnet (Chain ID: 80002)

## Benefits of Using the Faucet

- **Free**: No need to spend real ETH
- **Simple**: Quick and easy process
- **Sufficient**: Provides enough MATIC for multiple deployments

## Next Steps

After obtaining MATIC from the faucet and deploying your contract, follow the post-deployment configuration steps in our Amoy_Deployment_Guide.md to complete the setup.

Would you like to proceed with getting MATIC from the faucet?
# Post-Deployment Configuration Guide

After successfully deploying the Receipt1155 contract to Polygon Amoy, follow these steps to configure your BlockReceipt.ai application to use the new contract.

## Update Environment Variables

1. Open your `.env` file and locate these variables:
   ```
   RECEIPT_NFT_CONTRACT_ADDRESS=0x0CC9bb224dA2cbe7764ab7513D493cB2b3BeA6FC
   RECEIPT_MINTER_ADDRESS=0x0CC9bb224dA2cbe7764ab7513D493cB2b3BeA6FC
   ```

2. Replace them with your newly deployed contract address:
   ```
   RECEIPT_NFT_CONTRACT_ADDRESS=<your-newly-deployed-contract-address>
   RECEIPT_MINTER_ADDRESS=<your-newly-deployed-contract-address>
   ```

## Update Blockchain Service

Replace the current blockchain service with the improved version that validates contract connections:

```bash
# Backup the current service
mv server/services/blockchainService-amoy.ts server/services/blockchainService-amoy.ts.bak

# Install the improved service
mv server/services/blockchainService-amoy.ts.new server/services/blockchainService-amoy.ts
```

## Restart Application

Restart your application to use the new contract:

```bash
npm run dev
```

## Verify Connection

After restarting, check your application logs to confirm:
- Successful connection to the Amoy network
- Proper contract initialization
- No errors in contract function calls

Look for logs like:
```
Connected to blockchain network: amoy chainId: 80002
Blockchain service initialized with contract: <your-contract-address>
✅ Contract implements X required methods
```

## Test NFT Minting

Create a new receipt through your application to test the NFT minting process. The system should:
1. Generate a receipt hash
2. Mint an NFT receipt on the blockchain
3. Return transaction details
4. Store the token ID in your database

## Troubleshooting

### Contract Validation Fails
If you see errors about the contract not being valid or not implementing required methods:
- Verify that the contract was deployed correctly
- Check that the ABI in the blockchain service matches the deployed contract
- Ensure the contract address is correct in your .env file

### Transaction Failures
If receipt minting transactions fail:
- Ensure the wallet has enough MATIC for gas fees
- Check that the wallet has the correct permissions on the contract
- Verify that the contract functions are called with the correct parameters

### Mock Mode Fallback
If the system falls back to mock mode:
- Check the contract connection logs for errors
- Verify the RPC endpoint is working correctly
- Ensure the blockchain service can connect to the Amoy network
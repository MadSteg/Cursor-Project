# BlockReceipt.ai Smart Contracts

This directory contains the smart contracts used by the BlockReceipt.ai platform.

## Contract Structure

### Receipt1155Enhanced.sol

The main smart contract for the BlockReceipt.ai platform, implementing an enhanced ERC-1155 token for digital receipts.

#### Key Features:

- **Role-Based Access Control**: Uses OpenZeppelin's AccessControl instead of Ownable
  - `ADMIN_ROLE`: Can add/remove minters, pause the contract, and revoke receipts
  - `MINTER_ROLE`: Can mint new receipts

- **Event Emission**: Detailed events for on-chain traceability
  - `ReceiptMinted`: When a new receipt is created
  - `ReceiptRevoked`: When a receipt is marked as invalid
  - `ReceiptBurned`: When a receipt is destroyed
  - `BaseURISet`: When the base URI for metadata is updated

- **Metadata Structure**: Enhanced receipt metadata both on-chain and off-chain
  - On-chain: Timestamp, revocation status, receipt type
  - Off-chain: OpenSea-compatible, detailed purchase information (via IPFS)

- **Security Features**: Multiple mechanisms for safe operation
  - Pausable: Emergency stop mechanism
  - Revocation: Mark receipts as invalid without burning
  - Burn functionality: For when receipts need to be permanently removed
  - Input validation: Prevents duplicate receipt IDs

## Usage Guide

### Deployment

Deploy the contract with:

```bash
npx hardhat run scripts/deploy-enhanced-receipt.js --network amoy
```

### Verify on Polygonscan

Verify the contract for public inspection with:

```bash
npx hardhat run scripts/verify-contract-polygonscan.js --network amoy
```

### Testing

Run contract tests with:

```bash
npx hardhat test
```

## Role Management

### Granting Roles

To grant the minter role to a new address (admin only):

```javascript
// Using ethers.js
const MINTER_ROLE = await contract.MINTER_ROLE();
await contract.grantRole(MINTER_ROLE, "0xMinterAddress");
```

### Revoking Roles

To revoke a role (admin only):

```javascript
const MINTER_ROLE = await contract.MINTER_ROLE();
await contract.revokeRole(MINTER_ROLE, "0xMinterAddress");
```

## Minting Receipts

### Single Receipt

```javascript
await contract.mintReceipt(
  recipientAddress,      // Address to receive the receipt
  tokenId,               // Unique token ID
  1,                     // Amount (usually 1)
  "ipfs://tokenURI",     // Token metadata URI
  "premium"              // Receipt type (standard, premium, luxury)
);
```

### Batch Minting

```javascript
await contract.batchMintReceipts(
  recipientAddress,          // Address to receive the receipts
  [tokenId1, tokenId2],      // Array of token IDs
  [1, 1],                    // Array of amounts
  ["uri1", "uri2"],          // Array of URIs
  ["standard", "premium"]    // Array of receipt types
);
```

## Receipt Management

### Revocation

To mark a receipt as invalid without burning (admin only):

```javascript
await contract.revokeReceipt(tokenId);
```

### Burning

To permanently destroy a receipt (owner or admin):

```javascript
await contract.burn(ownerAddress, tokenId, 1);
```

### Pausing/Unpausing

For emergency purposes (admin only):

```javascript
// Pause all transfers and minting
await contract.pause();

// Resume operations
await contract.unpause();
```

## URI Management

### Setting Base URI

To update the base URI for all tokens (admin only):

```javascript
await contract.setBaseURI("ipfs://newBaseURI/");
```

## OpenSea Compatibility

The contract includes OpenSea-compatible features:

- `contractURI()` function for collection metadata
- Standard NFT metadata format
- Proper event emissions for activity tracking

## Security Recommendations

1. Keep admin private keys in secure, offline storage
2. Use multi-sig wallets for admin operations in production
3. Thoroughly test any script before executing against the contract
4. Follow the documented revocation process for invalidating receipts
5. Regularly audit active admin and minter role-holders
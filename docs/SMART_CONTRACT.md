# BlockReceipt.ai Smart Contract Documentation

## Receipt1155Enhanced Contract

The Receipt1155Enhanced contract is an ERC-1155 implementation designed specifically for digital receipts with enhanced features for security, flexibility, and scalability.

### Key Features

#### 1. Role-Based Access Control

The contract uses OpenZeppelin's AccessControl module instead of simple Ownable to enable fine-grained permissioning:

- `ADMIN_ROLE`: Can add/remove minters, pause the contract, and revoke receipts
- `MINTER_ROLE`: Can mint new receipts (e.g., merchant partners, payment processors)

This allows for delegation of minting rights to trusted partners without giving them full administrative control.

#### 2. Event Emission

For better on-chain traceability, the contract emits detailed events:

- `ReceiptMinted`: When a new receipt is created
- `ReceiptRevoked`: When a receipt is marked as invalid
- `ReceiptBurned`: When a receipt is destroyed
- `BaseURISet`: When the base URI for metadata is updated

These events make it easier to track receipt activities on-chain and enable integration with analytics platforms and marketplaces.

#### 3. Metadata Structure

Each receipt has associated metadata stored both on-chain and off-chain:

**On-chain metadata:**
- Timestamp of receipt creation
- Revocation status
- Receipt type (standard, premium, luxury)

**Off-chain metadata (IPFS):**
- Standardized OpenSea-compatible JSON structure
- Encrypted transaction details using TPRE
- Merchant information
- Purchase details and attributes

#### 4. Security and Resilience Features

The contract includes multiple mechanisms for safe operation:

- `Pausable`: Emergency stop mechanism to halt minting and transfers
- Revocation: Ability to mark receipts as invalid without burning them
- Burn functionality: For when receipts need to be permanently removed
- Input validation: Prevents duplicate receipt IDs and enforces access controls

### Contract Methods

#### Minting

```solidity
function mintReceipt(
    address to,
    uint256 tokenId,
    uint256 amount,
    string calldata tokenURI,
    string calldata receiptType
) external whenNotPaused onlyRole(MINTER_ROLE)
```

Mints a new receipt and assigns it to the specified address.

```solidity
function batchMintReceipts(
    address to,
    uint256[] calldata tokenIds,
    uint256[] calldata amounts,
    string[] calldata tokenURIs,
    string[] calldata receiptTypes
) external whenNotPaused onlyRole(MINTER_ROLE)
```

Efficiently mints multiple receipts in a single transaction.

#### Burning and Revocation

```solidity
function burn(
    address from,
    uint256 tokenId,
    uint256 amount
) external
```

Burns a receipt. Can be called by the token owner or an admin.

```solidity
function revokeReceipt(uint256 tokenId) external onlyRole(ADMIN_ROLE)
```

Marks a receipt as revoked (invalid) without burning it.

#### URI Management

```solidity
function setBaseURI(string calldata newBaseURI) external onlyRole(ADMIN_ROLE)
```

Sets the base URI for all receipt tokens.

```solidity
function uri(uint256 tokenId) public view override returns (string memory)
```

Returns the URI for a specific receipt token.

```solidity
function contractURI() public view returns (string memory)
```

Returns the contract-level metadata URI (for marketplaces).

#### Metadata Access

```solidity
function getReceiptMetadata(uint256 tokenId) external view returns (
    uint256 timestamp,
    bool revoked,
    string memory receiptType
)
```

Retrieves on-chain metadata for a receipt.

```solidity
function isValidReceipt(uint256 tokenId) public view returns (bool)
```

Checks if a receipt exists and is not revoked.

#### Contract Management

```solidity
function pause() external onlyRole(ADMIN_ROLE)
```

Pauses all transfers and minting.

```solidity
function unpause() external onlyRole(ADMIN_ROLE)
```

Resumes normal contract operation.

### Deployment

The contract is deployed with a base URI for metadata and automatically sets up the deployer with both admin and minter roles.

### Security Considerations

1. **Admin Keys Security**: Store the private keys for admin wallets securely, preferably offline.
2. **Minter Role Management**: Only grant the minter role to trusted partners and services.
3. **Revocation Process**: Establish clear off-chain governance for when receipts should be revoked.
4. **Metadata Integrity**: Ensure IPFS content is properly pinned and available.

### Best Practices for Frontend Integration

1. **Verification UI**: Implement a simple UI for users to verify receipt validity.
2. **Display Receipt Details**: Show all relevant receipt information including revocation status.
3. **OpenSea/Marketplace Integration**: Ensure metadata follows OpenSea standards for proper display.
4. **Export/Share**: Allow users to export or share their receipts.

### Testing

The contract includes a comprehensive test suite covering all functionality:

- Role-based access control
- Minting (single and batch)
- Burning and revocation
- URI management
- Pausing/unpausing
- Metadata validation

Run tests with:

```bash
npx hardhat test
```
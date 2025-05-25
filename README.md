# BlockReceipt.ai - NFT Digital Receipt Platform

BlockReceipt.ai transforms financial transactions into secure, interactive, and privacy-preserving digital receipts backed by blockchain technology. Convert your paper receipts into verified NFTs that provide immutable proof of purchase and unlock new consumer experiences.

## Project Overview

BlockReceipt.ai offers a blockchain-powered digital receipt platform with:

- **ERC-1155 NFT Receipts**: Transform transactions into verified NFTs
- **Multi-Chain Support**: Compatible with Polygon, Ethereum, and more
- **Tiered Pricing**: Standard ($0.99), Premium ($2.99), and Luxury ($5.00) receipt tiers
- **Threshold Encryption**: Privacy-preserving receipt data storage
- **IPFS Integration**: Decentralized content storage
- **Stripe Integration**: Traditional payment processing
- **Crypto Payments**: Accept MATIC, USDC, and more
- **Mobile Integration**: Display receipts in Apple Wallet, Google Pay

## System Architecture

The system consists of:

1. **Frontend**: React TypeScript with Vite and Tailwind CSS
2. **Backend**: Node.js Express server with PostgreSQL database
3. **Blockchain**: Smart contracts on Polygon Amoy testnet
4. **Storage**: IPFS for decentralized content storage
5. **Payments**: Dual Stripe + crypto payment pathways

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/blockreceipt.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Compile the smart contracts
npx hardhat compile

# Deploy the contract (or use simulation mode)
node deploy-enhanced.js
# For simulation mode:
# SIMULATE=true node deploy-enhanced.js

# Verify the contract functionality
node verify-enhanced-contract.js

# Start the application
npm run dev
```

## Smart Contract Features

The enhanced Receipt1155Enhanced contract includes:

- **Role-Based Access Control**: Separate ADMIN_ROLE and MINTER_ROLE for better security
- **Pausable Functionality**: Emergency stop mechanism for critical situations
- **Receipt Revocation**: Ability to mark receipts as invalid without removing them
- **Batch Minting**: Gas-efficient creation of multiple receipts
- **Receipt Types**: Support for Standard, Premium, and Luxury receipt tiers
- **OpenSea Compatibility**: Contract URI support for marketplace integration
- **Enhanced Metadata**: Timestamps, receipt types, and revocation status
- **Comprehensive Events**: Detailed event emission for all operations

## Contract Deployment

The system uses an enhanced ERC-1155 NFT contract for receipt minting. Follow these steps to deploy:

### Option 1: Direct Deployment via Script

```bash
# Regular deployment (requires funded wallet)
node deploy-enhanced.js

# Simulation mode (for testing without real funds)
SIMULATE=true node deploy-enhanced.js
```

### Option 2: Remix IDE Deployment

For manual deployment, follow the instructions in [Remix_Deployment_Guide.md](./Remix_Deployment_Guide.md).

## Verification

After deployment, verify the contract functionality:

```bash
node verify-enhanced-contract.js
```

This script will:
1. Connect to the deployed contract
2. Check role assignments
3. Test receipt minting
4. Verify receipt data integrity
5. Check contract status on Polygonscan

## Environment Variables

Configure the system through environment variables:

```
# Blockchain RPC URLs
ALCHEMY_RPC=https://polygon-amoy.g.alchemy.com/v2/your-api-key
POLYGON_MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your-api-key

# Wallet Configuration
WALLET_PRIVATE_KEY=your-private-key

# Contract Addresses
RECEIPT_NFT_CONTRACT_ADDRESS=0x...
```

See [.env.example](./.env.example) for a complete list of environment variables.

## Key Features

### For Merchants

- **No-Code Integration**: Simple plugin for e-commerce platforms
- **Customer Analytics**: Privacy-preserving purchase insights
- **Custom Branding**: Personalized receipt themes and designs
- **Tiered Offerings**: Multiple receipt types at different price points

### For Consumers

- **Verified Purchases**: Blockchain-backed proof of transactions
- **Interactive Receipts**: Dynamic content and experiences
- **Privacy Control**: Selective disclosure of purchase information
- **Mobile Integration**: Apple Wallet and Google Pay compatibility

## Development Guidelines

For developers contributing to the project:

- Follow the TypeScript type definitions in `shared/schema.ts`
- Use the blockchain service abstractions in `server/services/`
- Test all changes in simulation mode before live deployment
- Add comprehensive error handling for blockchain operations

## Simulation Mode

For development and testing without real blockchain interactions:

```bash
# Enable simulation mode
SIMULATE=true node deploy-enhanced.js
```

This creates a sandboxed environment with mock blockchain responses.

## License

This project is proprietary and confidential. All rights reserved.

---

For detailed deployment instructions, see [Amoy_Deployment_Guide.md](./Amoy_Deployment_Guide.md).
For Remix IDE deployment, see [Remix_Deployment_Guide.md](./Remix_Deployment_Guide.md).

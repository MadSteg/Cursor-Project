# MemoryChain 🪄

A blockchain-powered digital receipt platform that transforms credit card transactions into NFT-based receipts with advanced analytics and integration capabilities.

## Features

- **Blockchain NFT Receipt Generation**: Transform Stripe payments into verifiable NFT receipts
- **Stripe Payment Webhook Integration**: Automatically process payment intents
- **IPFS Storage**: Store encrypted receipt data securely on IPFS
- **Threshold Encryption**: Protect sensitive receipt data with advanced encryption
- **Vendor Verification API**: Allow merchants to verify receipt authenticity
- **React Frontend Gallery**: Browse and view your receipt collection
- **ERC-1155 Smart Contract**: Base L2 compatible Receipt NFT implementation

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm package manager
- Ethereum wallet with Base L2 network configured
- Stripe account for payment processing
- IPFS account (such as Infura) for decentralized storage

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/memorychain.git
cd memorychain

# Install dependencies
pnpm install

# Copy example environment file and fill in your secrets
cp example.env .env
```

### Environment Variables

The following environment variables need to be set in your `.env` file:

```
# Stripe API keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Blockchain configuration
ALCHEMY_RPC=https://base-mainnet.g.alchemy.com/v2/your-api-key
WALLET_PRIVATE_KEY=your-private-key
RECEIPT_MINTER_ADDRESS=0x...

# IPFS configuration
IPFS_PROJECT_ID=your-infura-project-id
IPFS_PROJECT_SECRET=your-infura-project-secret

# Vendor verification
VENDOR_PUBLIC_KEY=public-key-for-vendor
```

### Development

```bash
# Start the development server with webhook forwarding
pnpm dev

# This starts:
# 1. Backend server on port 3000
# 2. Frontend Vite server on port 3001 (with proxy to backend)
# 3. Stripe webhook listener that forwards events to your local server
```

### Smart Contract Development

The project uses Hardhat for Ethereum development:

```bash
# Compile smart contracts
npx hardhat compile

# Run contract tests
npx hardhat test

# Deploy to Base Goerli testnet
npx hardhat run scripts/deploy.ts --network baseGoerli

# Deploy to Base mainnet (BE CAREFUL!)
npx hardhat run scripts/deploy.ts --network base
```

### Testing

```bash
# Run all tests
pnpm test

# Run specific test suite
pnpm test webhook
```

### Building for Production

```bash
# Build frontend and backend
pnpm build

# Start production server
pnpm start
```

## Docker

The project includes a multi-stage Dockerfile for containerized deployment:

```bash
# Build the Docker image
docker build -t memorychain .

# Run the container
docker run -p 3000:3000 --env-file .env memorychain
```

## Architecture

### Backend

- Express.js server with TypeScript
- Stripe webhook integration for payment processing
- Blockchain integration with ethers.js
- IPFS storage for receipt data
- Threshold cryptography for sensitive information

### Frontend

- React with TypeScript
- Web3 wallet integration (MetaMask/WalletConnect)
- Receipt gallery and detail views
- Tailwind CSS for styling

### Smart Contracts

- ERC-1155 token standard for receipts
- Solidity 0.8.25
- Access control for minting permissions
- Base L2 for low gas fees and Ethereum compatibility

## License

[MIT](LICENSE)

## Acknowledgments

- OpenZeppelin for secure contract templates
- Stripe for payment processing
- Base for L2 scaling solution
- IPFS for decentralized storage
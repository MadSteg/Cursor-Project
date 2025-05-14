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

# Deploy the contract (or use simulation mode)
SIMULATE=true node direct-deploy.js

# Start the application
npm run dev
```

## Contract Deployment

The system uses an ERC-1155 NFT contract for receipt minting. Follow the deployment instructions in [Amoy_Deployment_Guide.md](./Amoy_Deployment_Guide.md) to:

1. Deploy the contract to Polygon Amoy testnet
2. Configure your application with the contract address
3. Test receipt minting and verification

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

## Strategic Roadmap

The current development focus is on:

1. **Bullet-Proof Chain Interaction**: Reliable blockchain integration
2. **No-Code Merchant Plugin**: Simple deployment for businesses
3. **Live Pilot Preparation**: Real-world testing with select partners

## Development Guidelines

For developers contributing to the project:

- Follow the TypeScript type definitions in `shared/schema.ts`
- Use the blockchain service abstractions in `server/services/`
- Test all changes in simulation mode before live deployment
- Add comprehensive error handling for blockchain operations

## Configuration

Configure the system through environment variables:

- **Blockchain**: ALCHEMY_RPC, WALLET_PRIVATE_KEY, RECEIPT_NFT_CONTRACT_ADDRESS
- **Payments**: STRIPE_SECRET_KEY, VITE_STRIPE_PUBLIC_KEY
- **Database**: DATABASE_URL and related PostgreSQL variables

## Simulation Mode

For development and testing without real blockchain interactions:

```bash
# Enable simulation mode
SIMULATE=true npm run dev
```

This creates a sandboxed environment with mock blockchain responses.

## License

This project is proprietary and confidential. All rights reserved.

---

For detailed deployment instructions, see [Amoy_Deployment_Guide.md](./Amoy_Deployment_Guide.md).
For Remix IDE deployment, see [Remix_Deployment_Guide.md](./Remix_Deployment_Guide.md).
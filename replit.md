# replit.md

## Overview

BlockReceipt.ai is a comprehensive NFT digital receipt platform that transforms traditional paper receipts into secure, interactive blockchain-based NFTs. The system provides merchants with a sustainable, fraud-proof receipt solution while offering customers permanent, verifiable transaction records. The platform is built around a React/TypeScript frontend with an Express.js backend, integrated with Polygon blockchain for NFT minting and Google Cloud services for storage.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and builds
- **UI Components**: shadcn/ui components with Radix UI primitives for consistent design
- **Styling**: Tailwind CSS with custom dark theme support and responsive design
- **State Management**: TanStack Query for server state management and caching
- **Authentication**: Web3 wallet integration (MetaMask, WalletConnect)

### Backend Architecture
- **Runtime**: Node.js with Express.js framework using ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints with comprehensive error handling and validation
- **Middleware**: CORS, body parsing, session management, and security headers

### Blockchain Integration
- **Primary Network**: Polygon Amoy testnet (chainId: 80002) for cost-effective transactions
- **Contract Standard**: ERC-1155 multi-token contract for receipt NFTs
- **Wallet Management**: Automatic wallet creation using customer phone/email as identifier
- **Gas Optimization**: Batch minting capabilities and efficient contract design

## Key Components

### Receipt Processing Pipeline
1. **Image Upload**: Google Cloud Storage integration for receipt image management
2. **OCR Processing**: Google Cloud Vision API and OpenAI for receipt data extraction
3. **Data Validation**: Multi-tier validation with confidence scoring
4. **Encryption**: Threshold Network's TACo PRE for privacy-preserving receipt storage
5. **NFT Minting**: Automated blockchain minting with metadata and IPFS storage

### Smart Contract System
- **Receipt1155Enhanced.sol**: Main contract with role-based access control
- **Features**: Receipt minting, revocation, batch operations, and burn capabilities
- **Security**: OpenZeppelin's AccessControl with ADMIN_ROLE and MINTER_ROLE
- **Events**: Comprehensive event emission for blockchain traceability

### Data Management
- **Receipt Storage**: Encrypted receipt data with selective sharing capabilities
- **User Management**: Customer profiles with transaction history and preferences
- **Merchant Integration**: POS system integration with real-time receipt processing
- **Cache Layer**: OCR result caching to optimize processing costs and speed

## Data Flow

### Receipt Creation Flow
1. Customer completes purchase at merchant POS
2. System captures transaction data (items, amounts, merchant info)
3. Automatic wallet creation if customer doesn't have existing wallet
4. Receipt data encrypted using TACo PRE with customer's public key
5. NFT metadata prepared with IPFS hash and encryption details
6. Smart contract minting transaction submitted to Polygon Amoy
7. Receipt NFT delivered to customer's wallet with viewing access

### Brand Engagement Flow
1. Merchants create targeted campaigns through dashboard
2. Customers opt-in to share specific receipt data with brands
3. Consent-based data sharing with granular permission controls
4. Real-time analytics and engagement tracking
5. Reward point distribution based on participation

## External Dependencies

### Blockchain Services
- **Alchemy**: Polygon Amoy RPC provider for blockchain connectivity
- **ethers.js**: Ethereum library for wallet and contract interactions
- **OpenZeppelin**: Secure smart contract primitives and standards

### Cloud Services
- **Google Cloud Storage**: Receipt image and NFT asset storage
- **Google Cloud Vision**: OCR processing for receipt data extraction
- **IPFS**: Decentralized storage for NFT metadata and assets

### Payment Processing
- **Stripe**: Traditional payment processing for premium receipt tiers
- **Crypto Payments**: Native MATIC and USDC payment acceptance

### Privacy and Security
- **Threshold Network TACo**: Proxy re-encryption for receipt privacy
- **Environment Security**: Secure key management and API credentials

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 and PostgreSQL 16
- **Hot Reload**: Vite development server with fast refresh
- **Database**: Local PostgreSQL with Drizzle migrations
- **Blockchain**: Polygon Amoy testnet with faucet MATIC

### Production Environment
- **Build Process**: Vite production build with asset optimization
- **Server**: Express.js with production middleware and security headers
- **Database**: PostgreSQL with connection pooling and backup strategies
- **Deployment**: Docker containerization with health checks

### Monitoring and Analytics
- **Error Tracking**: Comprehensive logging with structured output
- **Performance**: API response time monitoring and optimization
- **Blockchain**: Transaction success rate tracking and gas optimization
- **User Analytics**: Receipt processing metrics and user engagement data

## Recent Changes

### June 25, 2025 - Production Readiness Sprint
- **WebSocket Integration**: Real-time notifications with automatic reconnection and browser notifications
- **Mobile Interface**: Responsive customer app with live notification status indicator
- **Merchant Onboarding**: Complete merchant signup flow with step-by-step guidance
- **Production APIs**: Merchant application processing, analytics, and onboarding progress tracking
- **Notification System**: Brand access requests with real-time customer consent management

### Technical Stack Completed
- Production-ready smart contract deployment system
- Real-time WebSocket notification infrastructure
- Mobile-first customer experience with live updates
- Merchant onboarding pipeline with progress tracking
- Comprehensive API endpoints for all core functionality

## Changelog

Changelog:
- June 25, 2025. Initial setup and technical enhancement sprint

## User Preferences

Preferred communication style: Simple, everyday language.
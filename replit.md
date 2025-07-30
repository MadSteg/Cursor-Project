# replit.md

## Overview

BlockReceipt is a comprehensive digital receipt platform that transforms traditional paper receipts into secure, interactive digital records. The system provides merchants with a sustainable, fraud-proof receipt solution while offering customers permanent, verifiable transaction records. The platform is built around a React/TypeScript frontend with an Express.js backend, integrated with advanced cryptographic verification and Google Cloud services for storage.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and builds
- **UI Components**: shadcn/ui components with Radix UI primitives for consistent design
- **Styling**: Tailwind CSS with custom dark theme support and responsive design
- **State Management**: TanStack Query for server state management and caching
- **Authentication**: Simple email-based authentication system

### Backend Architecture
- **Runtime**: Node.js with Express.js framework using ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API Design**: RESTful endpoints with comprehensive error handling and validation
- **Middleware**: CORS, body parsing, session management, and security headers

### Digital Verification System
- **Primary Network**: Advanced cryptographic verification system for cost-effective transactions
- **Record Standard**: Multi-token digital receipt system with unique identifiers
- **Account Management**: Automatic account creation using customer phone/email as identifier
- **Optimization**: Batch processing capabilities and efficient record generation

## Key Components

### Receipt Processing Pipeline
1. **Image Upload**: Google Cloud Storage integration for receipt image management
2. **OCR Processing**: Google Cloud Vision API and OpenAI for receipt data extraction
3. **Data Validation**: Multi-tier validation with confidence scoring
4. **Encryption**: Threshold Network's TACo PRE for privacy-preserving receipt storage
5. **Digital Record Creation**: Automated digital record generation with metadata and secure storage

### Digital Receipt System
- **ReceiptEngine**: Main processing system with role-based access control
- **Features**: Receipt generation, revocation, batch operations, and deletion capabilities
- **Security**: Advanced access control with administrative and processing roles
- **Audit Trail**: Comprehensive event logging for digital verification traceability

### Data Management
- **Receipt Storage**: Encrypted receipt data with selective sharing capabilities
- **User Management**: Customer profiles with transaction history and preferences
- **Merchant Integration**: POS system integration with real-time receipt processing
- **Cache Layer**: OCR result caching to optimize processing costs and speed

## Data Flow

### Receipt Creation Flow
1. Customer completes purchase at merchant POS
2. System captures transaction data (items, amounts, merchant info)
3. Automatic account creation if customer doesn't have existing account
4. Receipt data encrypted using advanced encryption with customer's access key
5. Digital metadata prepared with secure hash and encryption details
6. Digital record creation transaction submitted to verification system
7. Digital receipt delivered to customer's account with viewing access

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
- **Digital Payments**: Native payment acceptance and processing

### Privacy and Security
- **Threshold Network TACo**: Proxy re-encryption for receipt privacy
- **Environment Security**: Secure key management and API credentials

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 and PostgreSQL 16
- **Hot Reload**: Vite development server with fast refresh
- **Database**: Local PostgreSQL with Drizzle migrations
- **Verification**: Advanced testnet with verification credits

### Production Environment
- **Build Process**: Vite production build with asset optimization
- **Server**: Express.js with production middleware and security headers
- **Database**: PostgreSQL with connection pooling and backup strategies
- **Deployment**: Docker containerization with health checks

### Monitoring and Analytics
- **Error Tracking**: Comprehensive logging with structured output
- **Performance**: API response time monitoring and optimization
- **Verification**: Transaction success rate tracking and processing optimization
- **User Analytics**: Receipt processing metrics and user engagement data

## Recent Changes

### July 30, 2025 - Cursor IDE Migration Preparation
- **GitHub Repository Migration**: Prepared project for transfer to https://github.com/MadSteg/Curso-export
- **Complete Export Package**: Created 102MB comprehensive export with all source code, configurations, and documentation
- **Banking Compliance Maintained**: All wallet removal transformations and email authentication preserved
- **Migration Documentation**: Complete guides for Cursor IDE setup and repository cloning

### June 25, 2025 - Production Readiness Sprint
- **WebSocket Integration**: Real-time notifications with automatic reconnection and browser notifications
- **Mobile Interface**: Responsive customer app with live notification status indicator
- **Merchant Onboarding**: Complete merchant signup flow with step-by-step guidance
- **Production APIs**: Merchant application processing, analytics, and onboarding progress tracking
- **Notification System**: Brand access requests with real-time customer consent management
- **Banking Compliance**: Removed all crypto/blockchain terminology and wallet integrations for Chase banking approval

### Technical Stack Completed
- Production-ready digital verification deployment system
- Real-time WebSocket notification infrastructure
- Mobile-first customer experience with live updates
- Merchant onboarding pipeline with progress tracking
- Comprehensive API endpoints for all core functionality
- Banking-compliant authentication system replacing wallet connectivity
- Complete removal of crypto/blockchain terminology and MetaMask/WalletConnect integrations

## Changelog

Changelog:
- June 25, 2025. Initial setup and technical enhancement sprint

## User Preferences

Preferred communication style: Simple, everyday language.

## Business Requirements

### Chase Banking Compliance
- All language sanitized to remove crypto/blockchain terminology
- Platform positioned as "digital receipt management" and "verified purchase data platform"
- Focus on traditional business benefits: customer engagement, data analytics, fraud prevention
- Technology described as "advanced cryptographic verification" rather than blockchain
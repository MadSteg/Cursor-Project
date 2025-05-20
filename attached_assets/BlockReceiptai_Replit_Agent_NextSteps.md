# BlockReceipt.ai - Next Steps for Replit AI Agent

## Overview

This document outlines the next steps for implementing and enhancing the BlockReceipt.ai platform using a Replit AI agent. Based on the current codebase analysis, these tasks are prioritized to improve functionality, security, and user experience.

## Priority Tasks for Replit AI Agent

### 1. Core Integration Tasks

- **Upload Flow Rewrite**
  - Enforce connected wallet in frontend + backend (via wagmi or similar)
  - Validate presence of wallet in `uploadReceipt.ts`
  - Call `extractReceiptData()` and verify line items + categories
  - Call `encryptLineItems(userPublicKey, receiptItems)` post-parsing
  - Save `ciphertext`, `capsule`, `policyPublicKey` with tokenId in DB
  - Trigger NFT bot with `wallet + tier` and return result to frontend

- **NFT Purchase Bot Implementation**
  - Replace internal NFT minting with external NFT procurement from artists
  - Implement `purchaseExternalNFT()` function to buy NFTs from marketplaces
  - Integrate with Reservoir API to fetch NFTs based on price tiers
  - Add fallback to local minting if no suitable NFT is found
  - Transfer purchased NFT to user's connected wallet
  - Store metadata with source, artist wallet, and receipt tier

- **Metadata Encryption**
  - Store encrypted receipt details (items + merchant + total) in backend
  - Ensure data is gated: only visible to NFT owner (via wallet match)
  - Implement `/decrypt/:tokenId` route or decrypt in frontend
  - Use Threshold TACo for encryption/decryption

- **NFT Gallery Feature**
  - Create `/gallery/:wallet` route to return owned NFTs
  - For each NFT, include metadataLocked: true/false
  - Build `NFTGallery.jsx` frontend to display card-style grid
  - Add lock overlay and unlock button to attempt decryption via TACo

### 2. Smart Contract Enhancements

- **Implement Role-Based Access Control**
  - Replace the current `Ownable` pattern with OpenZeppelin's `AccessControl`
  - Define roles: `ADMIN_ROLE`, `MINTER_ROLE`, and `MANAGER_ROLE`
  - Update all functions to use role-based checks instead of `onlyOwner`

- **Add Batch Operations**
  - Implement batch minting functionality for gas optimization
  - Create batch verification methods for multiple receipts

- **Improve Event Emissions**
  - Ensure all state-changing functions emit appropriate events
  - Add indexed parameters to events for better filtering

### 3. Frontend Improvements

- **Wallet Integration Enhancements**
  - Add support for additional wallet providers (Coinbase Wallet, Trust Wallet)
  - Implement WalletConnect v2 protocol
  - Create a more robust connection recovery mechanism

- **UX and Messaging Updates**
  - Update copy in all components to reflect real capabilities
  - Change 'Upload' button to 'Immortalize Receipt' or similar
  - Add tooltip or link: 'Why is this metadata locked? Powered by Threshold TACo.'

- **Receipt Upload Flow Optimization**
  - Add drag-and-drop support with preview
  - Implement client-side image compression before upload
  - Add progress indicators for the entire minting process

### 4. Backend Optimizations

- **OCR Service Enhancements**
  - Fine-tune the merchant name extraction algorithm
  - Improve item categorization with machine learning
  - Add support for more receipt formats and languages

- **Task Queue Improvements**
  - Implement retry mechanisms for failed tasks
  - Add webhook notifications for task completion
  - Create a dashboard for monitoring task status

- **Marketplace Integration**
  - Integrate with Reservoir API for NFT discovery and purchase
  - Add support for OpenSea, Zora, and other marketplaces
  - Implement filters for emerging artists and affordable NFTs

### 5. Testing and Validation

- **Core Functionality Testing**
  - Verify a user can upload a receipt and receive an NFT
  - Confirm the NFT is stored on-chain and sent to the correct wallet
  - Validate that encrypted metadata is stored securely
  - Test that the frontend shows locked metadata
  - Verify the wallet owner can unlock the metadata
  - Ensure the gallery works for previously claimed NFTs

- **Smart Contract Testing**
  - Create comprehensive unit tests for all contract functions
  - Implement integration tests for the complete minting flow
  - Add fuzzing tests for input validation

- **Documentation**
  - Update all README files with the latest information
  - Create a comprehensive developer guide
  - Add inline code documentation

## Implementation Guidelines for Replit AI Agent

### Replit Environment Setup

1. **Fork the Repository**
   - Fork the repository to your Replit account
   - Alternatively, create a new Replit project and import from GitHub

2. **Configure Replit Environment**
   - The project already includes `.replit` and `.replit.workflows.json` configurations
   - Ensure the following modules are enabled:
     - `web`
     - `postgresql-16`
     - `nodejs-20`

3. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Configure the following variables:
     - `ALCHEMY_RPC`: Alchemy API endpoint for Polygon Amoy
     - `WALLET_PRIVATE_KEY`: Development wallet private key
     - `RECEIPT_NFT_CONTRACT_ADDRESS`: Deployed contract address
     - `DATABASE_URL`: PostgreSQL connection string (Replit provides this automatically)

4. **Development Mode**
   - The project is configured to run with `npm run dev`
   - Replit will automatically expose the necessary ports:
     - Port 3000: Main application
     - Port 3001: Secondary service
     - Port 80: Public access

5. **Mock Blockchain Server**
   - The project includes a mock blockchain server configuration in `.replit.workflows.json`
   - This server starts automatically on boot and can be used for testing without real blockchain interactions

### Implementation Approach for Replit

1. **Start with Smart Contract Enhancements**
   - Modify `Receipt1155Enhanced.sol` to implement role-based access
   - Test thoroughly using Hardhat within Replit
   - Deploy to Polygon Amoy testnet using the provided deployment scripts
   - Update the `.env` file with the new contract address

2. **Update Backend Services**
   - Enhance the blockchain service to work with the updated contract
   - Implement the task queue improvements
   - Add the multi-chain support
   - Ensure compatibility with the mock blockchain server for testing

3. **Improve Frontend Components**
   - Update wallet integration
   - Enhance the receipt upload flow
   - Implement the NFT gallery improvements
   - Test UI components using Replit's preview functionality

4. **Database Integration**
   - Utilize Replit's PostgreSQL module
   - Update the Drizzle ORM configuration if needed
   - Implement database migrations for new features
   - Create backup and restore procedures

5. **Add Testing and Documentation**
   - Write tests for all new functionality
   - Update documentation to reflect changes
   - Create user guides for new features
   - Add Replit-specific setup instructions

## Replit-Specific Considerations

### Monitoring and Maintenance

- **Performance Monitoring**
  - Implement logging for all critical operations
  - Set up alerts for failed transactions
  - Monitor gas costs and optimize as needed
  - Use Replit's always-on functionality for continuous operation

- **Security Audits**
  - Regularly review smart contract security
  - Implement security best practices
  - Consider a professional audit before mainnet deployment
  - Secure environment variables in Replit's Secrets tab

- **User Feedback Loop**
  - Create a mechanism for collecting user feedback
  - Prioritize improvements based on user needs
  - Implement A/B testing for new features
  - Use Replit's multiplayer functionality for collaborative development

### Replit Deployment Optimizations

- **Autoscaling Configuration**
  - The project is configured for autoscaling deployment
  - Optimize build and start scripts in the `.replit` file
  - Configure proper resource allocation

- **Workflow Automation**
  - Enhance the existing workflows in `.replit.workflows.json`
  - Add automated testing workflows
  - Create deployment verification workflows
  - Implement database backup workflows

## Conclusion

The BlockReceipt.ai platform shows great potential as a blockchain-powered digital receipt solution. By implementing these next steps, the Replit AI agent can significantly enhance the platform's functionality, security, and user experience. Focus on incremental improvements, thorough testing, and comprehensive documentation to ensure a robust and user-friendly product.

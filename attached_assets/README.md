# 🧾 BlockReceipt.ai

**Transform paper receipts into verifiable digital NFTs on the Polygon blockchain**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-https://blockreceipt.ai-blue)](https://blockreceipt.ai)
[![GitHub](https://img.shields.io/badge/GitHub-MadSteg/Cursor--Project-green)](https://github.com/MadSteg/Cursor-Project)
[![CI/CD](https://img.shields.io/github/actions/workflow/status/MadSteg/Cursor-Project/ci-cd.yml?branch=main)](https://github.com/MadSteg/Cursor-Project/actions)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 🎯 **What is BlockReceipt.ai?**

BlockReceipt.ai is a revolutionary platform that converts traditional paper receipts into **verifiable digital NFTs** on the Polygon blockchain. Our solution addresses the $1.2 trillion receipt processing industry by providing:

- 🔐 **Secure Digital Receipts** - Encrypted and tamper-proof
- 🏪 **Merchant Integration** - Easy POS system integration
- 📱 **Mobile-First Experience** - Scan and mint receipts instantly
- 🌐 **Blockchain Verification** - On-chain receipt authenticity
- 💰 **Loyalty Programs** - NFT-based rewards and incentives

## 🚀 **Live Demo**

**Visit our live application:** [https://blockreceipt.ai](https://blockreceipt.ai)

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Blockchain    │
│   (React/TS)    │◄──►│   (Node.js/TS)  │◄──►│   (Polygon)     │
│   Tailwind CSS  │    │   Express.js    │    │   Smart Contracts│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Tech Stack**
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, TypeScript
- **Blockchain**: Polygon (Amoy testnet), Solidity, OpenZeppelin
- **Database**: PostgreSQL (assumed from structure)
- **Encryption**: Threshold PRE (Proxy Re-Encryption)

## 🛠️ **Development Workflow**

### **The Perfect Setup: Cursor + GitHub + Replit**

This project is optimized for a **three-tier development workflow**:

1. **🖥️ Develop in Cursor** - Superior AI assistance and IDE features
2. **📦 Push to GitHub** - Version control and CI/CD pipeline  
3. **🚀 Auto-deploy to Replit** - Live preview and production hosting

### **Prerequisites**
- Node.js 18+ 
- Git
- MetaMask or similar Web3 wallet
- Cursor IDE (recommended) or VS Code
- GitHub account
- Replit account (for deployment)

## 🚀 **Quick Start**

### **Option 1: Local Development (Cursor IDE)**

1. **Clone the repository**
```bash
git clone https://github.com/MadSteg/Cursor-Project.git
cd Cursor-Project
```

2. **Install dependencies**
```bash
npm run install:all
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development servers**
```bash
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### **Option 2: Replit Development**

1. **Fork the repository** on GitHub
2. **Import to Replit** using the GitHub integration
3. **Replit will auto-deploy** from the main branch
4. **Live site** available at your Replit URL

## 📁 **Project Structure**

```
BlockReceiptai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   └── App.tsx        # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── middleware/        # Express middleware
│   └── index.ts           # Server entry point
├── contracts/             # Solidity smart contracts
│   ├── Receipt1155Enhanced.sol
│   └── README.md
├── scripts/               # Deployment scripts
├── .github/               # GitHub Actions CI/CD
│   └── workflows/
│       └── ci-cd.yml
├── .replit               # Replit configuration
├── replit.nix            # Replit dependencies
└── docs/                  # Documentation
```

## 🔧 **Key Features**

### **Smart Contracts**
- **Receipt1155Enhanced.sol**: ERC-1155 tokens for digital receipts
- **Threshold PRE Integration**: Encrypted receipt sharing
- **Role-Based Access Control**: Secure minting and management
- **Receipt Revocation**: Burn tokens for refunds/returns

### **Frontend Features**
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Wallet Integration**: MetaMask and other Web3 wallets
- **Receipt Gallery**: Browse and manage your digital receipts
- **Merchant Portal**: Business dashboard for receipt management
- **Real-time Updates**: WebSocket integration for live updates

### **Backend API**
- **RESTful API**: Comprehensive endpoints for all operations
- **Authentication**: JWT-based user authentication
- **Rate Limiting**: Security against abuse
- **File Upload**: Receipt image processing
- **Blockchain Integration**: Smart contract interactions

## 🚀 **CI/CD Pipeline**

### **GitHub Actions Workflow**

The project includes a comprehensive CI/CD pipeline that runs on every push:

1. **Lint and Test** - Code quality checks and unit tests
2. **Security Audit** - Vulnerability scanning
3. **Smart Contracts** - Solidity compilation and testing
4. **Build** - Production build verification
5. **Deploy** - Automatic deployment to Replit (main branch only)
6. **Performance** - Bundle size and performance monitoring

### **Pipeline Features**
- ✅ **Automated testing** on every commit
- ✅ **Security scanning** for vulnerabilities
- ✅ **Smart contract verification** and testing
- ✅ **Build optimization** and size monitoring
- ✅ **Automatic deployment** to production
- ✅ **Performance monitoring** and reporting

## 🚀 **Deployment**

### **Production Deployment**
The application is currently deployed on **Replit** and accessible at:
- **Live Site**: https://blockreceipt.ai
- **GitHub**: https://github.com/MadSteg/Cursor-Project

### **Development Workflow**
1. **Develop in Cursor IDE** (recommended for AI assistance)
2. **Push changes to GitHub** (version control)
3. **GitHub Actions run** (CI/CD pipeline)
4. **Replit auto-deploys** from GitHub repository
5. **Test on live site** (production validation)

### **Replit Configuration**
- **Run Command**: `npm run start`
- **Entry Point**: `server/index.ts`
- **Environment**: Node.js 18+
- **Auto-deploy**: Enabled from GitHub main branch

## 🧪 **Testing**

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:client
npm run test:server
npm run test:contracts

# Run with coverage
npm run test:coverage

# Run UI tests
npm run test:ui
```

## 📚 **Documentation**

- [Smart Contract Guide](contracts/README.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Development Roadmap](DEVELOPMENT_ROADMAP.md)

## 🤝 **Contributing**

### **Development Workflow**

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Develop in Cursor IDE** (recommended)
4. **Write tests** for your changes
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**
8. **CI/CD pipeline runs** automatically
9. **Review and merge** when tests pass

### **Code Quality Standards**
- ✅ **TypeScript** for all new code
- ✅ **ESLint** for code linting
- ✅ **Prettier** for code formatting
- ✅ **Unit tests** for all functions
- ✅ **Integration tests** for APIs
- ✅ **Smart contract tests** for blockchain code

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- **Live Demo**: https://blockreceipt.ai
- **GitHub Issues**: https://github.com/MadSteg/Cursor-Project/issues
- **Documentation**: [docs/](docs/)

## 🎯 **Roadmap**

- [ ] **Enhanced UI/UX** - Improved mobile experience
- [ ] **Merchant Onboarding** - Streamlined business integration
- [ ] **Analytics Dashboard** - Business insights and reporting
- [ ] **Multi-chain Support** - Ethereum, BSC, and more
- [ ] **API Rate Limiting** - Enhanced security measures
- [ ] **Automated Testing** - Comprehensive test coverage

## 🔧 **Troubleshooting**

### **Common Issues**

**Node.js Version**
```bash
# Ensure you're using Node.js 18+
node --version
# Should show v18.x.x or higher
```

**Dependencies**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

**Build Issues**
```bash
# Clear cache and rebuild
npm run clean
npm run install:all
npm run build
```

**Replit Deployment**
- Ensure `.replit` file is present
- Check `replit.nix` configuration
- Verify GitHub integration is enabled

**GitHub Actions Monitoring**
- Check Actions tab in GitHub repository
- Monitor workflow status in Cursor IDE
- Review logs for any failures
- Set up notifications for build status

---

**Built with ❤️ by the BlockReceipt.ai team**

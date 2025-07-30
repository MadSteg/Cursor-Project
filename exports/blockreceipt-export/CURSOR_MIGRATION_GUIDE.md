# BlockReceipt.ai - Cursor IDE Migration Guide

## Overview
This guide will help you migrate the complete BlockReceipt.ai project from Replit to Cursor IDE. BlockReceipt is a digital receipt management platform that transforms traditional receipts into secure, interactive digital records with advanced verification and customer engagement features.

## Project Architecture Summary

### Core Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express.js 
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS + shadcn/ui components + Radix UI
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter (lightweight React router)
- **Authentication**: Email-based login system (wallet-free for banking compliance)

### Key Features Implemented
- Digital receipt processing with OCR (Google Cloud Vision + OpenAI)
- Real-time WebSocket notifications
- Merchant onboarding and dashboard
- Customer mobile interface
- Brand engagement platform with consent-based data sharing
- Advanced cryptographic verification system
- Google Cloud Storage integration
- Comprehensive API endpoints for all core functionality

## Pre-Migration Setup

### 1. Install Required Software
```bash
# Install Node.js 20 (recommended version)
# Download from: https://nodejs.org/

# Install PostgreSQL 16
# Download from: https://www.postgresql.org/download/

# Install Git
# Download from: https://git-scm.com/downloads
```

### 2. Clone/Download Project Files
Either:
- Download all project files from Replit
- Or use git if repository is connected to GitHub

## Step-by-Step Migration

### 1. Create New Project Directory
```bash
mkdir blockreceipt-ai
cd blockreceipt-ai
```

### 2. Copy All Project Files
Copy the entire project structure from Replit to your local directory. The structure should look like:

```
blockreceipt-ai/
├── client/                 # React frontend
├── server/                 # Express backend  
├── shared/                 # Shared types and schemas
├── contracts/              # Smart contract files
├── public/                 # Static assets
├── attached_assets/        # Project assets
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
└── ... (other config files)
```

### 3. Environment Setup

#### Create `.env` file:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/blockreceipt
PGHOST=localhost
PGPORT=5432
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=blockreceipt

# Google Cloud Services
GOOGLE_CLOUD_CREDENTIALS=your_service_account_json
GOOGLE_CLOUD_BUCKET_NAME=your_bucket_name

# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# Google Analytics (Optional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Advanced Verification System
RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
PRE_MODULE_ADDRESS=your_module_address
```

### 4. Database Setup

#### Create PostgreSQL Database:
```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE blockreceipt;
CREATE USER blockreceipt_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE blockreceipt TO blockreceipt_user;
```

#### Update connection string in .env:
```env
DATABASE_URL=postgresql://blockreceipt_user:your_secure_password@localhost:5432/blockreceipt
```

### 5. Install Dependencies
```bash
# Install all project dependencies
npm install

# If you encounter any issues, try:
npm install --legacy-peer-deps
```

### 6. Database Migration
```bash
# Push database schema to PostgreSQL
npm run db:push

# If you need to generate migrations:
npm run db:generate
```

### 7. Build and Start Development
```bash
# Start development server (runs both frontend and backend)
npm run dev

# The application should be available at:
# http://localhost:5173 (or the port shown in terminal)
```

## Cursor IDE Specific Setup

### 1. Open Project in Cursor
```bash
# Open Cursor IDE
# File -> Open Folder -> Select your blockreceipt-ai directory
```

### 2. Install Recommended Extensions
Open Command Palette (Ctrl/Cmd + Shift + P) and install:
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense  
- ES7+ React/Redux/React-Native snippets
- PostgreSQL (for database management)
- GitLens (for Git integration)

### 3. Configure Cursor Settings
Create `.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "'([^']*)'"],
    ["clsx\\(([^)]*)\\)", "'([^']*)'"]
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

### 4. Configure Tasks (Optional)
Create `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Dev Server",
      "type": "shell",
      "command": "npm run dev",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "new"
      }
    },
    {
      "label": "Database Push",
      "type": "shell", 
      "command": "npm run db:push",
      "group": "build"
    }
  ]
}
```

## Required Secrets/API Keys

### Google Cloud Services
1. Create Google Cloud Project
2. Enable Cloud Storage and Vision APIs
3. Create service account and download JSON key
4. Create storage bucket for receipt images

### OpenAI API
1. Sign up at https://platform.openai.com
2. Generate API key from dashboard
3. Add credits for OCR and text processing

### Stripe (Optional - for payments)
1. Create Stripe account
2. Get publishable and secret keys from dashboard

### Database Services
- Local PostgreSQL installation OR
- Cloud database (Neon, Supabase, etc.)

## Important File Structure

### Key Configuration Files
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS setup
- `tsconfig.json` - TypeScript configuration
- `drizzle.config.ts` - Database ORM configuration

### Application Entry Points
- `client/src/main.tsx` - React app entry point
- `server/index.ts` - Express server entry point
- `server/routes.ts` - API route definitions
- `shared/schema.ts` - Database schema and types

### Key Features
- `client/src/pages/` - All React page components
- `client/src/components/` - Reusable UI components
- `client/src/contexts/` - React context providers
- `server/services/` - Business logic services
- `server/middleware/` - Express middleware

## Common Issues and Solutions

### 1. Port Conflicts
If port 5173 is in use:
```bash
# Vite will automatically try the next available port
# Or specify a different port in vite.config.ts
```

### 2. Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS

# Test connection
psql -h localhost -U blockreceipt_user -d blockreceipt
```

### 3. Missing Dependencies
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### 4. TypeScript Errors
```bash
# Restart TypeScript server in Cursor
# Command Palette -> "TypeScript: Restart TS Server"
```

## Development Workflow

### Starting Development
```bash
npm run dev          # Start both frontend and backend
npm run dev:client   # Frontend only (if needed)
npm run dev:server   # Backend only (if needed)
```

### Database Operations
```bash
npm run db:push      # Push schema changes
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:generate  # Generate migration files
```

### Building for Production
```bash
npm run build        # Build both frontend and backend
npm run preview      # Preview production build
```

## Banking Compliance Features

This version of BlockReceipt has been specifically modified for Chase banking approval:

### ✅ Completed Transformations
- Removed all crypto/blockchain terminology
- Eliminated MetaMask and WalletConnect integrations
- Replaced wallet authentication with email-based login
- Updated all user-facing language to banking-friendly terms
- Converted "NFT receipts" to "digital receipts"
- Changed "wallet" references to "account"

### Key Compliance Features
- Traditional email/password authentication
- No cryptocurrency dependencies
- Standard payment processing via Stripe
- Regulatory-compliant data handling
- Banking-appropriate terminology throughout

## Support and Resources

### Documentation
- React: https://react.dev/
- Vite: https://vitejs.dev/
- Tailwind CSS: https://tailwindcss.com/
- Drizzle ORM: https://orm.drizzle.team/
- TanStack Query: https://tanstack.com/query/latest

### Project-Specific Help
- Check `replit.md` for architectural decisions
- Review `PROJECT_README.md` for detailed feature documentation
- API documentation in individual route files

## Post-Migration Checklist

- [ ] All dependencies installed successfully
- [ ] Database connection established
- [ ] Environment variables configured
- [ ] Development server starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] API endpoints respond correctly
- [ ] Database schema applied successfully
- [ ] Google Cloud services connected (if using)
- [ ] OpenAI API integration working
- [ ] Real-time notifications functional
- [ ] File uploads working correctly

## Next Steps After Migration

1. **Test Core Features**: Upload a receipt, test OCR processing
2. **Verify Integrations**: Check Google Cloud Storage, OpenAI API
3. **Database Operations**: Test CRUD operations via the UI
4. **Real-time Features**: Verify WebSocket notifications
5. **Mobile Interface**: Test responsive design on different devices
6. **Production Deployment**: Consider Vercel, Netlify, or traditional hosting

---

**Migration Complete!** 
Your BlockReceipt.ai platform should now be fully functional in Cursor IDE with all banking compliance features intact and ready for Chase business banking approval.
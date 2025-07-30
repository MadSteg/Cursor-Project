# Manual Upload Checklist for GitHub

## Target Repository
**https://github.com/MadSteg/BlockReceiptai**

## Step-by-Step Upload Process

### 1. Create New Branch
- Go to https://github.com/MadSteg/BlockReceiptai
- Click "Branch: main" dropdown
- Type "cursor-ready-v1" and click "Create branch"

### 2. Upload Core Directories

#### Frontend Files (`client/` folder)
Upload entire `client` folder containing:
- `src/` - All React components, pages, hooks
- `public/` - Static assets
- `index.html` - Main HTML file

#### Backend Files (`server/` folder)  
Upload entire `server` folder containing:
- `services/` - Business logic services
- `middleware/` - Express middleware
- `utils/` - Server utilities
- Main server files

#### Shared Files (`shared/` folder)
Upload `shared` folder containing:
- `schema.ts` - Database schemas
- Type definitions

#### Public Assets (`public/` folder)
Upload `public` folder with static files

### 3. Upload Configuration Files

**Root Level Files to Upload:**
- ✅ `package.json` - All dependencies
- ✅ `package-lock.json` - Dependency lock
- ✅ `tsconfig.json` - TypeScript config
- ✅ `vite.config.ts` - Vite build config
- ✅ `tailwind.config.ts` - Tailwind CSS
- ✅ `drizzle.config.ts` - Database ORM
- ✅ `components.json` - shadcn/ui config
- ✅ `.eslintrc.js` - Linting rules
- ✅ `postcss.config.js` - CSS processing
- ✅ `.env.example` - Environment template
- ✅ `.gitignore` - Git ignore rules

### 4. Upload Documentation

**Documentation Files:**
- ✅ `README.md` - Project overview
- ✅ `replit.md` - Architecture docs
- ✅ `CURSOR_MIGRATION_GUIDE.md` - Migration guide
- ✅ `CURSOR_CLONE_INSTRUCTIONS.md` - Clone setup
- ✅ All other .md files

### 5. Upload Additional Files (Optional)

**Blockchain/Contract Files:**
- `contracts/` folder - Smart contracts
- `scripts/` - Deployment scripts
- Hardhat configurations

**Export Packages:**
- `exports/` folder - Complete export packages

## Verification After Upload

### Check Repository Structure
Your GitHub repository should have:
```
BlockReceiptai/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── ...
├── server/
│   ├── services/
│   ├── middleware/
│   └── ...
├── shared/
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── ...
```

### Test Clone in Cursor
After upload, test in Cursor:
```bash
git clone https://github.com/MadSteg/BlockReceiptai.git
cd BlockReceiptai
git checkout cursor-ready-v1
npm install
```

## Banking Compliance Verification

Ensure uploaded code includes:
- ✅ Email-based authentication (no wallet connect)
- ✅ Traditional payment processing
- ✅ No crypto terminology in UI
- ✅ Real-time WebSocket notifications
- ✅ Merchant onboarding system
- ✅ Production-ready configuration

## Files to Skip Uploading

**Don't upload these:**
- `node_modules/` - Will be installed via npm
- `.git/` - Git history (if doing manual upload)
- `.cache/` - Replit cache files
- `temp_*` files
- Lock files from Replit

Your BlockReceipt project will be ready for Cursor IDE once uploaded!
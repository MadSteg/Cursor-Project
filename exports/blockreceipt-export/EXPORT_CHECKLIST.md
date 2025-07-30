# BlockReceipt.ai - Export Checklist for Cursor Migration

## Files to Export from Replit

### ✅ Core Application Files
- [ ] `package.json` - Dependencies and scripts
- [ ] `package-lock.json` - Dependency lock file
- [ ] `tsconfig.json` - TypeScript configuration
- [ ] `vite.config.ts` - Vite build configuration
- [ ] `tailwind.config.ts` - Tailwind CSS configuration
- [ ] `postcss.config.js` - PostCSS configuration
- [ ] `drizzle.config.ts` - Database ORM configuration
- [ ] `components.json` - shadcn/ui configuration

### ✅ Frontend Files (client/ directory)
- [ ] `client/src/main.tsx` - React app entry point
- [ ] `client/src/App.tsx` - Main App component
- [ ] `client/src/index.css` - Global styles
- [ ] `client/src/lib/` - Utility libraries and configurations
- [ ] `client/src/components/` - All React components
- [ ] `client/src/pages/` - All page components
- [ ] `client/src/contexts/` - React context providers
- [ ] `client/src/hooks/` - Custom React hooks
- [ ] `client/src/data/` - Static data files
- [ ] `client/env.d.ts` - Environment type definitions

### ✅ Backend Files (server/ directory)
- [ ] `server/index.ts` - Express server entry point
- [ ] `server/routes.ts` - API route definitions
- [ ] `server/storage.ts` - Storage interface and implementations
- [ ] `server/db.ts` - Database connection setup
- [ ] `server/services/` - Business logic services
- [ ] `server/middleware/` - Express middleware
- [ ] `server/utils/` - Server utility functions

### ✅ Shared Files (shared/ directory)
- [ ] `shared/schema.ts` - Database schema and types
- [ ] `shared/types.ts` - Shared TypeScript types

### ✅ Public Assets (public/ directory)
- [ ] `public/favicon.ico` - Site favicon
- [ ] `public/index.html` (if exists)
- [ ] Any other static assets

### ✅ Attached Assets (attached_assets/ directory)
- [ ] All project documentation files
- [ ] Screenshot images
- [ ] Template files
- [ ] Any other project assets

### ✅ Configuration Files
- [ ] `.env.example` - Environment variable template
- [ ] `.gitignore` - Git ignore rules
- [ ] `.eslintrc.js` - ESLint configuration
- [ ] `jest.config.js` - Jest testing configuration (if exists)
- [ ] `jest.setup.js` - Jest setup file (if exists)

### ✅ Documentation Files
- [ ] `README.md` - Main project documentation
- [ ] `replit.md` - Replit-specific documentation (keep for reference)
- [ ] `PROJECT_README.md` - Detailed project documentation
- [ ] Any other .md files in the root directory

### ✅ Database Files (if applicable)
- [ ] `migrations/` directory (if exists)
- [ ] Database dump files (if any)

### ✅ Smart Contract Files (contracts/ directory)
- [ ] All .sol contract files
- [ ] Contract deployment scripts
- [ ] Contract configuration files

### ✅ Build and Deployment Files
- [ ] `Dockerfile` (if exists)
- [ ] `docker-compose.yml` (if exists)
- [ ] Deployment scripts
- [ ] Build configuration files

## Files NOT to Export (Replit-specific)

### ❌ Skip These Files
- [ ] `.replit` - Replit configuration
- [ ] `.replit.workflows.json` - Replit workflows
- [ ] Any `.pyc` files
- [ ] `node_modules/` directory (will be regenerated)
- [ ] `.env` file (contains secrets - create new one)
- [ ] Cache directories
- [ ] Log files
- [ ] Temporary files

## Pre-Export Steps

### 1. Clean Up Development Files
```bash
# Remove node_modules (will be reinstalled)
rm -rf node_modules

# Remove build artifacts
rm -rf dist
rm -rf build
rm -rf .vite

# Remove logs
rm -rf logs
rm *.log
```

### 2. Backup Important Data
- [ ] Export any database data you need to preserve
- [ ] Save any environment variables (separately and securely)
- [ ] Document any custom configurations

### 3. Verify All Files Are Included
- [ ] Check that all source code is included
- [ ] Verify all configuration files are present
- [ ] Ensure all assets and documentation are included

## Post-Export Verification

### 1. File Structure Check
Verify your exported project has this structure:
```
blockreceipt-ai/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── data/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── env.d.ts
├── server/
│   ├── services/
│   ├── middleware/
│   ├── utils/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   └── db.ts
├── shared/
│   ├── schema.ts
│   └── types.ts
├── public/
├── attached_assets/
├── contracts/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── drizzle.config.ts
└── README.md
```

### 2. Essential Files Verification
- [ ] `package.json` exists and contains all dependencies
- [ ] TypeScript configuration files are present
- [ ] Vite and Tailwind configs are included
- [ ] Database schema file exists
- [ ] All React components are present
- [ ] API routes are included
- [ ] Documentation files are included

## Environment Variables to Set Up in Cursor

Create a new `.env` file with these variables (get values separately):

```env
# Database
DATABASE_URL=
PGHOST=
PGPORT=
PGUSER=
PGPASSWORD=
PGDATABASE=

# Google Cloud
GOOGLE_CLOUD_CREDENTIALS=
GOOGLE_CLOUD_BUCKET_NAME=

# OpenAI
OPENAI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
VITE_STRIPE_PUBLIC_KEY=

# Analytics (Optional)
VITE_GA_MEASUREMENT_ID=

# Advanced Verification
RPC_URL=
PRIVATE_KEY=
PRE_MODULE_ADDRESS=
```

## Quick Test After Export

### 1. Basic Setup Test
```bash
cd blockreceipt-ai
npm install
```

### 2. Build Test
```bash
npm run build
```

### 3. Development Server Test
```bash
npm run dev
```

### 4. Database Test
```bash
npm run db:push
```

If all these commands succeed, your export is complete and ready for development in Cursor IDE!

## Emergency Backup Plan

If you encounter issues during export:

1. **Create a full Replit backup**:
   - Download entire Replit as ZIP
   - Save all environment variables separately
   - Document any special configurations

2. **Incremental transfer**:
   - Start with core files (package.json, src/)
   - Add features one by one
   - Test each addition

3. **Version control**:
   - Initialize git repository immediately
   - Commit after each successful migration step
   - Create branches for experimentation

---

**Export Complete!** Follow the main migration guide to set up your development environment in Cursor IDE.
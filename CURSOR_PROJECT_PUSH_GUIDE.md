# Push to Cursor-Project Repository

## Target Repository
**https://github.com/MadSteg/Cursor-Project**

## What You Need to Do

### Option 1: Manual Upload (Recommended - Bypasses Git Issues)

**Step 1: Download Your Project Export**
- Go to `exports/` folder in your Replit file tree
- Right-click on `blockreceipt-complete-export.tar.gz` (102MB)
- Click "Download" to save it to your computer

**Step 2: Extract and Upload to GitHub**
1. Extract the downloaded file on your computer
2. Go to https://github.com/MadSteg/Cursor-Project
3. Click "Add file" → "Upload files"
4. Upload the complete project structure:

**Core Folders:**
- `client/` - Complete React frontend
- `server/` - Express.js backend  
- `shared/` - Database schemas
- `public/` - Static assets

**Essential Files:**
- `package.json` - All 133 dependencies
- `package-lock.json` - Dependency lock
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Build configuration
- `tailwind.config.ts` - Styling configuration
- `drizzle.config.ts` - Database ORM
- `.env.example` - Environment template
- All documentation files (*.md)

**Step 3: Commit Upload**
- Commit message: "Complete banking-compliant BlockReceipt project for Cursor IDE"
- Click "Commit changes"

### Option 2: Try Git Interface (If Working)

**Step 1: Open Git Tab**
- Click Git icon in Replit sidebar

**Step 2: Change Remote**
- Try to update remote URL to: `https://github.com/MadSteg/Cursor-Project.git`
- If it gives an error (like before), use Option 1 instead

**Step 3: Push**
- Click "Push" to upload all 265+ commits

## What Gets Uploaded

Your complete production-ready project:
- Banking-compliant authentication (email-based, no wallets)
- Real-time WebSocket notification system
- Merchant onboarding portal with dashboard
- Customer mobile interface
- Digital receipt processing with OCR
- Advanced verification system
- Complete documentation and migration guides

## After Upload - Cursor Setup

Once in the repository, Cursor can clone and run:

```bash
git clone https://github.com/MadSteg/Cursor-Project.git
cd Cursor-Project
npm install
cp .env.example .env
# Add your API keys to .env file
npm run dev
```

## Required Environment Variables

Your `.env` file needs:
```env
OPENAI_API_KEY=your_openai_key
GOOGLE_CLOUD_CREDENTIALS=your_google_credentials
GOOGLE_CLOUD_BUCKET_NAME=your_bucket_name  
DATABASE_URL=postgresql://user:pass@localhost:5432/blockreceipt
STRIPE_SECRET_KEY=your_stripe_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## Project Features Ready for Cursor

- Complete React + TypeScript frontend (50+ components)
- Express.js backend (40+ API endpoints)  
- PostgreSQL database with Drizzle ORM
- Real-time WebSocket notifications
- Chase banking compliance (no crypto terminology)
- Production deployment configuration
- Comprehensive documentation

Your BlockReceipt project will be ready for immediate development in Cursor IDE!
# Quick Upload to Curso-export Repository

## The Problem
Replit's Git interface won't let you change the remote repository due to conflicts.

## Quick Solution: Manual Upload

### Step 1: Get Your Export File
- In your Replit file tree, go to `exports/` folder
- Right-click on `blockreceipt-complete-export.tar.gz` (102MB)
- Click "Download"

### Step 2: Extract Files Locally
- Extract the downloaded file on your computer
- You'll see the complete project structure

### Step 3: Upload to GitHub
1. **Go to**: https://github.com/MadSteg/Curso-export
2. **Click**: "Add file" → "Upload files"
3. **Drag and drop** all folders and files from the extracted project:
   - `client/` folder
   - `server/` folder  
   - `shared/` folder
   - `public/` folder
   - `package.json`
   - `package-lock.json`
   - All `.ts`, `.js`, `.md` files
   - Configuration files

### Step 4: Commit Upload
- **Commit message**: "Complete BlockReceipt project - Banking compliant for Cursor IDE"
- **Click**: "Commit changes"

## Alternative: Individual Folder Upload

If uploading everything at once is too large:

1. **Upload `client/` folder first**
2. **Upload `server/` folder second**
3. **Upload remaining files** (package.json, configs, etc.)
4. **Commit each upload** separately

## What You're Uploading

Your complete project includes:
- React + TypeScript frontend (50+ components)
- Express.js backend (40+ API endpoints)
- Email authentication system
- Real-time WebSocket notifications
- Merchant onboarding portal
- Digital receipt processing with OCR
- PostgreSQL database schemas
- Production configurations

## After Upload - Cursor Setup

Once uploaded, Cursor can clone and run:

```bash
git clone https://github.com/MadSteg/Curso-export.git
cd Curso-export
npm install
npm run dev
```

## Success Check

Your repository should show:
- All project folders and files
- 133 dependencies in package.json
- Banking-compliant features (no wallet terminology)
- Complete documentation

This bypasses all git conflicts and gets your production-ready project to Curso-export!
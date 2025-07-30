# Push to Curso-export Repository

## New Target Repository
**https://github.com/MadSteg/Curso-export**

## Current Situation
- You have 265 commits ready to push
- Current project contains banking-compliant BlockReceipt
- Need to push to the new Curso-export repository

## Method 1: Use Replit's Git Interface (Recommended)

### Step 1: Open Git Tab
- Click the **Git icon** in your Replit left sidebar
- Open the Git panel

### Step 2: Change Remote Repository
In the Git tab, you need to:
1. **Update remote URL** to: `https://github.com/MadSteg/Curso-export.git`
2. **Save the changes**

### Step 3: Push All Commits
- Click **"Push"** or **"Sync"** button
- This pushes all 265 commits to Curso-export
- Wait for upload to complete

## Method 2: Command Line (If Available)

If git commands work, try these in Shell:

```bash
# Add new remote
git remote set-url origin https://github.com/MadSteg/Curso-export.git

# Verify change
git remote -v

# Push all commits
git push origin main

# If conflicts occur, force push
git push origin main --force
```

## Method 3: Manual Export Upload

If git methods fail:
1. **Download** the export file: `exports/blockreceipt-complete-export.tar.gz` (102MB)
2. **Extract** the files locally
3. **Upload** to GitHub manually:
   - Go to https://github.com/MadSteg/Curso-export
   - Upload folders: `client/`, `server/`, `shared/`
   - Upload files: `package.json`, config files, etc.

## What Gets Pushed

Your complete banking-compliant project:
- Email-based authentication (no wallets)
- Real-time WebSocket notifications
- Merchant onboarding system
- Digital receipt processing with OCR
- Production-ready configuration
- All 265 commits of development history

## For Cursor IDE Setup

After successful push, Cursor can clone:

```bash
git clone https://github.com/MadSteg/Curso-export.git
cd Curso-export
npm install
cp .env.example .env
# Add your API keys to .env
npm run dev
```

## Verification

After push, check GitHub shows:
- All your project files and folders
- Latest commit about Cursor preparation
- 265 commits in repository history
- Banking-compliant features intact

Your BlockReceipt project will be ready for Cursor migration!
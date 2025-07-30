# Step-by-Step: Push to Curso-export in Replit

## Your Goal
Push current BlockReceipt project to: **https://github.com/MadSteg/Curso-export**

## Visual Steps in Replit

### 1. Find the Git Tab
- Look at your **left sidebar** in Replit
- Find the icon that looks like a **branch/tree** (Git icon)
- **Click it** to open Git panel

### 2. Current Repository Settings
You should see:
- Repository currently pointing to `BlockReceiptNEW` or similar
- "265 commits to push" or similar message
- "1 commit to pull" (might vary)

### 3. Change Repository URL
**Method A: If there's a settings/config option:**
- Look for "Repository Settings" or "Remote" option
- Change URL from current to: `https://github.com/MadSteg/Curso-export.git`
- Save/Apply changes

**Method B: If no visual option:**
- You may need to create a fresh connection to the new repo

### 4. Push Your Commits
After changing repository:
- **Click "Push"** button
- **Wait** for all 265 commits to upload
- **Confirm** success message

## Alternative: Fresh Repository Connection

If changing URL doesn't work:

### Option 1: Clone New Repo
1. **Create new Replit project**
2. **Clone** Curso-export repository
3. **Copy** your current files over
4. **Commit and push**

### Option 2: Export and Upload
1. **Download** `exports/blockreceipt-complete-export.tar.gz`
2. **Go to** https://github.com/MadSteg/Curso-export
3. **Upload files** manually through GitHub interface

## What You're Pushing

Your complete project includes:
- **Frontend**: React + TypeScript with all components
- **Backend**: Express.js with all API endpoints
- **Database**: PostgreSQL schemas and migrations
- **Authentication**: Email-based system (banking compliant)
- **Features**: WebSocket notifications, merchant portal, receipt processing
- **Configuration**: All build and deployment configs

## Success Indicators

Push is successful when:
- GitHub shows your project files in Curso-export
- All folders present: `client/`, `server/`, `shared/`
- `package.json` with all dependencies visible
- Recent commit shows "Cursor preparation" or similar
- 265+ commits in repository history

## For Cursor After Push

Once pushed, Cursor setup is simple:
```bash
git clone https://github.com/MadSteg/Curso-export.git
cd Curso-export
npm install
npm run dev
```

Your banking-compliant BlockReceipt will be ready for production!
# Using Replit's Git Interface

## Problem: Command Line Git is Locked
Replit has locked git command line operations for security. Use the visual Git interface instead.

## Step-by-Step Solution

### 1. Open Git Tab
- Look for the **Git** icon in your left sidebar (looks like a branch symbol)
- Click to open the Git panel

### 2. Change Repository URL
Your Git tab should show:
- Current: `https://github.com/MadSteg/BlockReceiptNEW`
- Need to change to: `https://github.com/MadSteg/BlockReceiptai`

**How to change**:
- Look for repository settings or "Change remote" option
- Update the URL to your correct repository
- Save the changes

### 3. Push Your Changes
You should see:
- "265 commits to push"
- "1 commit to pull"

**Push process**:
- Click the **"Push"** or **"Sync"** button
- This will push all 265 commits to your GitHub repository
- Wait for the upload to complete

## Alternative: Force Push Method

If you encounter conflicts:

1. **Pull First** (optional):
   - Click "Pull" to get the 1 remote commit
   - This might cause merge conflicts

2. **Force Push** (if needed):
   - Look for "Force Push" option in Git settings
   - This overwrites the remote repository with your local version
   - ⚠️ This will replace whatever is on GitHub with your current project

## What You're Pushing

Your 265 commits contain:
- Complete banking-compliant BlockReceipt project
- Email authentication (no wallet requirements)
- Real-time notifications system
- Merchant onboarding portal
- Digital receipt processing
- All production-ready features

## After Successful Push

Once pushed, your GitHub repository will have:
- All your latest code
- Complete project history (265 commits)
- Banking-compliant features ready for Cursor IDE
- Production-ready configuration

## For Cursor Clone

Cursor can then clone your updated repository:
```bash
git clone https://github.com/MadSteg/BlockReceiptai.git
```

## If Git Tab Doesn't Work

Contact Replit support or use the export files we created earlier:
- Download `blockreceipt-complete-export.tar.gz` (102MB)
- Upload manually to GitHub through web interface
- Create new repository if needed

Your project is ready for migration once the push completes!
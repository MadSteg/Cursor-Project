# Fix Remote Repository Error

## The Error You're Seeing
"Error (UNKNOWN) setting origin to use https://github.com/MadSteg/Curso-export as a remote."

This happens when Replit's Git interface can't change the remote URL due to conflicts or permissions.

## Solution 1: Manual Export to New Repository (Recommended)

Since the Git interface won't let you change remotes, let's manually export your project:

### Step 1: Download Your Project Export
1. Go to `exports/` folder in your file tree
2. Download `blockreceipt-complete-export.tar.gz` (102MB)
3. Extract it locally on your computer

### Step 2: Upload to Curso-export Repository
1. Go to https://github.com/MadSteg/Curso-export
2. Click "uploading an existing file" or "Add file" → "Upload files"
3. Upload your entire project structure:
   - `client/` folder (React frontend)
   - `server/` folder (Express backend)
   - `shared/` folder (database schemas)
   - `package.json` and `package-lock.json`
   - All configuration files (`vite.config.ts`, `tailwind.config.ts`, etc.)

### Step 3: Commit the Upload
- Add commit message: "Initial commit - Banking compliant BlockReceipt for Cursor IDE"
- Click "Commit changes"

## Solution 2: Create Fresh Repository Connection

### Option A: New Replit Project
1. Create a new Replit project
2. Clone the Curso-export repository (currently empty)
3. Copy your current project files over
4. Push to the repository

### Option B: Command Line (If Available)
Try these commands in the Shell tab:

```bash
# Remove existing git connection
rm -rf .git

# Initialize fresh git repository
git init

# Add new remote
git remote add origin https://github.com/MadSteg/Curso-export.git

# Add all files
git add .

# Commit
git commit -m "Banking compliant BlockReceipt ready for Cursor IDE"

# Push to new repository
git push -u origin main
```

## What This Accomplishes

Either method will get your complete project to the Curso-export repository:
- Complete banking-compliant codebase
- Email authentication (no wallet requirements)
- Real-time WebSocket notifications
- Merchant onboarding portal
- Digital receipt processing
- Production-ready configuration

## For Cursor Setup After Upload

Once your project is in the repository, Cursor can clone it:

```bash
git clone https://github.com/MadSteg/Curso-export.git
cd Curso-export
npm install
cp .env.example .env
npm run dev
```

## Recommended Approach

**Use Solution 1 (Manual Export)** - it's the most reliable since it bypasses all git conflicts and ensures your complete project gets to the new repository without any issues.

Your BlockReceipt project will be ready for Cursor IDE migration once uploaded!
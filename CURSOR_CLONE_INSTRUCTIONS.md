# Cursor IDE Clone Instructions

## GitHub Repository
**URL**: https://github.com/MadSteg/BlockReceiptai

## Option 1: Clone Main Branch (Current)
```bash
git clone https://github.com/MadSteg/BlockReceiptai.git
cd BlockReceiptai
```

## Option 2: Wait for Updated Push
After resolving git conflicts, clone the latest version:
```bash
git clone https://github.com/MadSteg/BlockReceiptai.git
cd BlockReceiptai
git checkout cursor-migration-v1  # if using new branch approach
```

## Immediate Setup in Cursor

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` file with your API keys:
```env
# Required for OCR processing
OPENAI_API_KEY=your_openai_key_here

# Required for image storage
GOOGLE_CLOUD_CREDENTIALS=your_google_credentials_here
GOOGLE_CLOUD_BUCKET_NAME=your_bucket_name

# Required for database
DATABASE_URL=postgresql://username:password@localhost:5432/blockreceipt

# Optional for payments
STRIPE_SECRET_KEY=your_stripe_key_here
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key_here
```

### 3. Database Setup
```bash
# Ensure PostgreSQL is running
npm run db:push
```

### 4. Start Development Server
```bash
npm run dev
```

## Current Project Status

### ✅ Banking Compliant Features
- Email-based authentication (no wallet requirements)
- Traditional payment processing
- No crypto/blockchain terminology in UI
- Chase banking approval ready

### ✅ Core Features Working
- Digital receipt processing with OCR
- Real-time WebSocket notifications  
- Merchant onboarding dashboard
- Customer mobile interface
- Advanced verification system

### ✅ Technical Stack
- React 18 + TypeScript frontend
- Express.js backend with REST APIs
- PostgreSQL database with Drizzle ORM
- Tailwind CSS + shadcn/ui components
- WebSocket for real-time features

## Verification Steps

After cloning and setup, verify these work:
1. **App loads**: http://localhost:5000
2. **Database connected**: Check console for connection success
3. **Authentication**: Email signup/login works
4. **Receipt upload**: Can upload and process receipts
5. **Real-time notifications**: WebSocket connection active

## If You Encounter Issues

1. **Dependencies**: Run `npm install` again
2. **Database**: Ensure PostgreSQL is running and accessible
3. **Environment**: Double-check all required API keys in `.env`
4. **Ports**: Ensure port 5000 is available

Your BlockReceipt project is production-ready and banking-compliant!
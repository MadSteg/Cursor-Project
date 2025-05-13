# MemoryChain – Polygon Mumbai Quick Start (no-Stripe version)

This guide sets up the “big” MemoryChain repo on **Polygon Mumbai** without needing Stripe or IPFS yet.  
It assumes the codebase already exists in the Repl (as created by the AI agent scaffold).

---

## 0. Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18 |
| **pnpm** | `npm install -g pnpm@8` |
| Test wallet | Holds a little **Mumbai MATIC** (faucet) |
| Alchemy | Polygon Mumbai endpoint ✔︎ |

---

## 1  Create `.env`

Copy this block into a new file called `.env` in the project root and **replace \`0xYOUR_TEST_WALLET_PRIVATE_KEY\`** with your real private key.  
Leave \`RECEIPT_MINTER_ADDRESS=\` blank for now.

```env
# ---------- Stripe (placeholders – ignore for now) ----------
STRIPE_SECRET_KEY=dummy
STRIPE_WEBHOOK_SECRET=dummy

# ---------- Blockchain (Polygon Mumbai) ----------
ALCHEMY_RPC=https://polygon-mumbai.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr
WALLET_PRIVATE_KEY=0xYOUR_TEST_WALLET_PRIVATE_KEY
RECEIPT_MINTER_ADDRESS=

# ---------- IPFS (placeholders – ignore for now) ----------
IPFS_PROJECT_ID=dummy
IPFS_PROJECT_SECRET=dummy

# ---------- Vendor verification ----------
VENDOR_PUBLIC_KEY=demo
```

---

## 2  Add Mumbai network to Hardhat

Edit **\`hardhat.config.ts\`** (or `.js`) and ensure the \`networks\` section includes:

```ts
mumbai: {
  url: process.env.ALCHEMY_RPC || "",
  accounts: process.env.WALLET_PRIVATE_KEY
    ? [process.env.WALLET_PRIVATE_KEY]
    : [],
},
```

---

## 3  Install dependencies

```bash
pnpm install
```

---

## 4  Compile & deploy the Receipt ERC-1155 contract

```bash
npx hardhat compile
npx hardhat run scripts/deploy.ts --network mumbai
```

Copy the address that prints, e.g.:

```
🚀 Contract deployed → 0xAbCd…1234
```

---

## 5  Put the contract address into `.env`

Open `.env` again and set:

```
RECEIPT_MINTER_ADDRESS=0xAbCd…1234
```

Save the file.

---

## 6  Start the backend (dev mode, Stripe disabled)

```bash
pnpm dev
```

You should see:

```
✅ Server listening on port 3000
⚠️  Stripe disabled (dummy keys)
```

---

## 7  Mint a mock receipt

In a **second** shell tab:

```bash
curl -X POST http://localhost:3000/receipt/mock
```

Expected JSON:

```json
{
  "tokenId": 1,
  "cid": "bafybeia…",
  "txHash": "0x789…",
  "message": "Mock receipt minted on Polygon Mumbai"
}
```

---

## 8  Verify on-chain (optional)

Visit <https://mumbai.polygonscan.com>, paste your **wallet** or **contract** address, and you’ll see the transfer.

---

### Next milestones (when you’re ready)

1. Add real IPFS credentials → store encrypted JSON off-chain.  
2. Replace `/receipt/mock` with a real Stripe webhook (requires Stripe keys).  
3. Launch the React front-end gallery.  

But none of that blocks you from minting and testing receipts today. 🎉

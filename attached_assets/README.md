# MemoryChain POC

End‑to‑end demo that turns a credit‑card transaction into an encrypted receipt NFT (ERC‑1155) on Polygon Mumbai.

## Quick start (Replit)

1. **Create a new Node.js Repl**  
2. Upload **`memorychain_poc.zip`** or drag‑drop the unzipped folder.  
3. Copy `.env.example` ➜ `.env` and fill in:  
   - `RPC_URL` (Alchemy/Infura Polygon Mumbai)  
   - `PRIVATE_KEY` (wallet that will own & mint)  
4. Open the Replit shell and run:

```bash
npm install       # first time
npx hardhat compile
npx hardhat run scripts/deploy.js --network mumbai
# copy the deployed address to .env as CONTRACT_ADDRESS
npm run dev       # start backend + nodemon
```

5. In another tab:

```bash
curl -X POST http://localhost:3000/transaction   -H "Content-Type: application/json"   --data-binary @sample_data/transaction.json
```

A new token mints, and the response shows the `cid` and the AES key you’ll need to decrypt off‑chain.

## Next milestones

- Swap mock JSON for Plaid sandbox ✨  
- React dashboard that lists tokens & decrypts receipts  
- Replace simple AES with Threshold proxy re‑encryption for granular sharing  

Happy hacking! 🎉

# MemoryChain — Migration Guide  
### Polygon Mumbai ➜ Polygon **Amoy** + Threshold Proxy Re‑encryption (TPRE)

> **Date:** May 2025     
> This guide replaces the deprecated Mumbai endpoint, deploys your Receipt NFT contract on **Polygon Amoy** (chain‑id 80002), and shows how to layer Threshold proxy re‑encryption so only the receipt owner (or their delegate) can decrypt the JSON metadata.

---

## 0. Prerequisites

| Tool / Account | Notes |
|----------------|-------|
| **Alchemy** (or any provider that supports Amoy) | Create a free *Polygon Amoy* app → copy the HTTPS endpoint. |
| **Replit Secrets / .env** | Store private values – never commit them. |
| **Wallet** funded with test **Amoy MATIC** | <https://faucet.polygon.technology> (select Amoy). |
| **pnpm @ 8**, **Hardhat**, **ethers v5** | Already in the project from previous steps. |
| **Threshold JS SDK** | `pnpm add @threshold-network/tcrypto` |

---

## 1. Environment file (`.env`)

```env
# ---------- Polygon Amoy ----------
ALCHEMY_RPC=https://polygon-amoy.g.alchemy.com/v2/Your_Amoy_API_Key
WALLET_PRIVATE_KEY=0xYourPrivateKey
RECEIPT_MINTER_ADDRESS=          # leave blank until deploy

# ---------- Threshold (TPRE) ----------
T_NETWORK=https://rpc.threshold.network
THRESHOLD_PROVIDER_ID=1          # example; grab from Threshold docs
```

Add the same keys in **Replit → Secrets** for runtime.

---

## 2. ​Hardhat config (`hardhat.amoy.config.cjs`)

```js
require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");   // ethers v5

module.exports = {
  solidity: "0.8.24",
  networks: {
    amoy: {
      url: process.env.ALCHEMY_RPC || "",
      chainId: 80002,
      accounts: process.env.WALLET_PRIVATE_KEY
        ? [process.env.WALLET_PRIVATE_KEY]
        : [],
    },
  },
};
```

> Keep your old Mumbai config for reference—Hardhat picks config via `--config`.

---

## 3. Deploy **Receipt1155.sol** to Amoy

```bash
# compile
npx hardhat --config hardhat.amoy.config.cjs compile

# deploy
DEPLOY_ADDR=$(npx hardhat --config hardhat.amoy.config.cjs run   scripts/deploy.ts --network amoy | grep -o '0x[0-9A-Fa-f]\{40\}')
echo "Deployed at $DEPLOY_ADDR"

# write into .env
apply_patch <<PATCH
*** Begin Patch
*** Update File: .env
@@
 RECEIPT_MINTER_ADDRESS=
+RECEIPT_MINTER_ADDRESS=$DEPLOY_ADDR
*** End Patch
PATCH
```

Commit the address to Secrets as well.

Verify in explorer: <https://www.oklink.com/amoy/address/0x…>

---

## 4. Backend provider swap

```js
// blockchain-service.js
const { ethers } = require("ethers");
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC);
const signer   = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
const receipt  = new ethers.Contract(
  process.env.RECEIPT_MINTER_ADDRESS,
  Receipt1155Abi,
  signer
);
```

Restart:

```bash
pnpm dev
```

---

## 5. Integrate **Threshold Proxy Re‑encryption**

### 5.1 Encrypting the receipt JSON

```js
import { encrypt } from "@threshold-network/tcrypto";

async function encryptReceipt(ownerAddress, json) {
  const plaintext = Buffer.from(JSON.stringify(json));
  const { capsule, ciphertext, symmetricKey } = await encrypt(
    plaintext,
    ownerAddress,                  // EC public key derived from wallet
    { network: process.env.T_NETWORK }
  );
  // store capsule + ciphertext on IPFS; keep symmetricKey only with owner
  return { capsule, ciphertext };
}
```

### 5.2 Mint flow (server route)

```js
app.post("/receipt/mint", async (req, res) => {
  const data = buildReceipt(req.body);
  const { capsule, ciphertext } = await encryptReceipt(wallet.address, data);

  const cid = await pinJSON({ capsule, ciphertext });
  const skuId = Date.now();

  await receiptContract.mint(wallet.address, skuId, 1, `ipfs://${cid}`);
  res.json({ tokenId: skuId, cid });
});
```

### 5.3 Delegated access

Later, the owner calls a Threshold network function to **generate a re‑encryption key** for a delegate wallet without exposing the symmetric key. The delegate pulls the IPFS payload, requests re‑encryption from Threshold nodes, and decrypts locally.

---

## 6. Smoke Test

```bash
curl -X POST http://localhost:3000/receipt/mock   # or /receipt/mint
# should return tokenId, cid, txHash (on Amoy)
```

Check the tx hash at <https://www.oklink.com/amoy/tx/0x…>

---

## 7. Fallback public Amoy RPCs (if Alchemy blocks)

/etc. Add list.

---

## 8. Troubleshooting

| Error | Fix |
|-------|-----|
| `could not detect network` | Ensure Alchemy URL has **polygon-amoy** and opens in cURL. |
| `invalid sender` | Private key not funded or mismatched. |
| `revert Ownable` | Call to `mint` not from contract owner – use deployer wallet. |
| DNS error | Use public RPC: `https://endpoints.omniatech.io/v1/matic/amoy/public` |

---

Happy minting on Amoy 🎉

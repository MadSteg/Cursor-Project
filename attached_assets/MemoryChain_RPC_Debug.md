# Polygon Mumbai RPC Debug Guide

Use this guide to confirm that your **Alchemy Polygon Mumbai** RPC endpoint is reachable from within your Replit workspace and to diagnose the “could not detect network” error.

---

## 1. Quick cURL Ping

Run the following command in the **Replit Shell** (replace `$ALCHEMY_RPC` with the full URL or rely on the environment variable if it’s set):

```bash
curl -s -X POST "$ALCHEMY_RPC" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'
```

**Expected result**

```json
{"jsonrpc":"2.0","id":1,"result":"0x2edc4a9"}
```

Any JSON with a hex block number means the endpoint is healthy.  
If you see a timeout, HTML page, or a JSON error like **`project_id does not exist`**, the URL or API key is incorrect.

---

## 2. Tiny Node Script (ethers v6)

Create **`rpc-test.js`** in the project root (or run via `node -`):

```js
const { ethers } = require("ethers");

(async () => {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC);
    const { chainId, name } = await provider.getNetwork();
    const block = await provider.getBlockNumber();
    console.log("✅ Connected to", name, "(chainId =", chainId + ")");
    console.log("Latest block:", block);
  } catch (err) {
    console.error("❌ RPC test failed:", err.message);
  }
})();
```

Run it:

```bash
node rpc-test.js
```

**Expected output**

```
✅ Connected to polygon-mumbai (chainId = 80001)
Latest block: 48576234
```

If you still see “could not detect network”:

1. Check the variable is set:  
   ```bash
   echo $ALCHEMY_RPC
   ```
2. URL must be exactly:  
   ```
   https://polygon-mumbai.g.alchemy.com/v2/aW44pWE6n-X1AhiLXaJQPu3POOrIlArr
   ```
3. Ensure the **Secrets** key in Replit is named `ALCHEMY_RPC` with no trailing spaces.

---

## 3. After RPC Passes

1. **Deploy contract**

   ```bash
   npx hardhat --config hardhat.mumbai.config.cjs run scripts/deploy.ts --network mumbai
   ```

2. **Start backend**

   ```bash
   pnpm dev
   ```

3. **Mint mock receipt**

   ```bash
   curl -X POST http://localhost:3000/receipt/mock
   ```

If cURL and `rpc-test.js` both succeed but Hardhat still errors, capture the full Hardhat command and error text for deeper troubleshooting.

---

### Common Pitfalls

| Symptom | Fix |
|---------|-----|
| `project_id does not exist` | Wrong API key or incorrect URL segment (`/v2/`). |
| Timeout / No route to host | Local network/firewall issue or typo in domain. |
| `invalid sender` when deploying | Private key doesn’t match the funded Mumbai wallet. |
| `insufficient funds for gas` | Top-up with test MATIC at <https://faucet.polygon.technology>. |

---

Happy debugging! 🎉

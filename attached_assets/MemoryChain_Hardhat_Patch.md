### PATCH to fix Hardhat ESM/CommonJS conflict

```
# 1. Force project back to CommonJS
apply_patch <<'PATCH_PKG'
*** Begin Patch
*** Update File: package.json
@@
-  "type": "module",
*** End Patch
PATCH_PKG

# 2. Replace / create hardhat.config.js in CJS style
cat > hardhat.config.js <<'JS'
require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");      // includes hardhat-ethers v5

module.exports = {
  solidity: "0.8.24",
  networks: {
    mumbai: {
      url: process.env.ALCHEMY_RPC || "",
      accounts: process.env.WALLET_PRIVATE_KEY ? [process.env.WALLET_PRIVATE_KEY] : [],
    },
  },
};
JS

# 3. Delete any .ts config so Hardhat doesn’t auto-load it
rm -f hardhat.config.ts

# 4. Re-compile to verify config loads
npx hardhat compile
```

#### What this does
* Removes `"type": "module"` so Node treats `.js` files as CommonJS.
* Creates a CommonJS `hardhat.config.js` with the Mumbai network and toolbox plug‑in.
* Deletes `hardhat.config.ts` to avoid dual‑config conflicts.
* Runs `npx hardhat compile` to confirm everything loads without ESM errors.

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { encryptJSON } = require('./utils/aes');
const { pinJSON } = require('./utils/ipfs');
const { ethers } = require('ethers');
const contractAbi = require('./utils/Receipt1155.json');

const app = express();
app.use(bodyParser.json());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || '');
const wallet =
  process.env.PRIVATE_KEY && process.env.RPC_URL
    ? new ethers.Wallet(process.env.PRIVATE_KEY, provider)
    : null;

const contractAddress = process.env.CONTRACT_ADDRESS || '';
const receiptContract =
  wallet && contractAddress
    ? new ethers.Contract(contractAddress, contractAbi, wallet)
    : null;

// Simple health check
app.get('/', (_, res) => {
  res.send('MemoryChain backend running ✅');
});

// Main webhook endpoint
app.post('/transaction', async (req, res) => {
  if (!receiptContract) {
    return res
      .status(500)
      .json({ error: 'Contract not configured. Check env vars.' });
  }
  try {
    const txn = req.body;
    const receiptObj = buildReceipt(txn);
    const { encrypted, key } = encryptJSON(receiptObj);
    const cid = await pinJSON(encrypted);

    // For demo, use skuId = Date.now()
    const skuId = Date.now();
    await receiptContract.mint(wallet.address, skuId, 1, `ipfs://${cid}`);
    console.log('Minted receipt token. AES key (save this!):', key);

    res.status(200).json({ cid, aesKey: key, tokenId: skuId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error processing transaction');
  }
});

// Helper to shape the receipt JSON
function buildReceipt(txn) {
  return {
    txnId: txn.id || 'demo-' + Date.now(),
    merchant: txn.merchant || 'Demo Merchant',
    date: txn.date || new Date().toISOString(),
    items: txn.items || [
      { sku: 'demo-sku', name: 'Demo Item', qty: 1, price: 100 },
    ],
    subtotal: txn.subtotal || 100,
    tax: txn.tax || 0,
    total: txn.total || 100,
  };
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MemoryChain backend listening on ${PORT}`);
});

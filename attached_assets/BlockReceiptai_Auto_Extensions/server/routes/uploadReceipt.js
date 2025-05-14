const express = require('express');
const multer = require('multer');
const { extractReceiptData, getTierFromTotal } = require('../../shared/utils/receiptLogic');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-receipt', upload.single('receipt'), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    const receiptData = await extractReceiptData(imageBuffer);
    const tier = getTierFromTotal(receiptData.total);

    res.json({
      success: true,
      parsed: receiptData,
      tier,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to process receipt.' });
  }
});

module.exports = router;

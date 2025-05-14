async function extractReceiptData(imageBuffer) {
  // Mocked OCR response
  return {
    merchant: "CVS",
    items: ["Shampoo", "Twix"],
    total: 12.20,
    purchaseDate: "2025-05-14"
  };
}

function getTierFromTotal(total) {
  if (total < 10) return "Basic";
  if (total < 50) return "Standard";
  if (total < 200) return "Premium";
  return "Luxury";
}

module.exports = {
  extractReceiptData,
  getTierFromTotal
};

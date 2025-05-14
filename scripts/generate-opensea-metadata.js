/**
 * OpenSea Metadata Generator
 * 
 * This script generates OpenSea-compatible metadata for NFT receipts.
 * It creates both token-level and collection-level metadata.
 */

const fs = require('fs');
const path = require('path');

// Set output directory for metadata
const OUTPUT_DIR = path.join(__dirname, '../metadata');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Collection-level metadata for OpenSea
const collectionMetadata = {
  name: "BlockReceipt.ai Digital Receipts",
  description: "Blockchain-verified receipts for your purchases. Each NFT represents a verifiable proof of purchase with encrypted transaction details.",
  image: "ipfs://QmYourCollectionImageCID/collection-image.png",
  external_link: "https://blockreceipt.ai",
  seller_fee_basis_points: 100, // 1% royalty
  fee_recipient: "0xYourFeeRecipientAddress",
  banner_image_url: "ipfs://QmYourBannerImageCID/banner.png",
  seller_fee_recipient: "0xYourFeeRecipientAddress"
};

// Sample receipt metadata templates for each receipt type
const receiptTemplates = {
  standard: {
    name: "Standard Receipt",
    description: "Standard digital receipt with basic purchase information",
    attributes: [
      { trait_type: "Receipt Type", value: "Standard" },
      { trait_type: "Features", value: "Basic" }
    ],
    image: "ipfs://QmStandardReceiptImageCID/standard.png",
    animation_url: "ipfs://QmStandardAnimationCID/standard-animation.mp4"
  },
  premium: {
    name: "Premium Receipt",
    description: "Enhanced digital receipt with detailed purchase information and warranty tracking",
    attributes: [
      { trait_type: "Receipt Type", value: "Premium" },
      { trait_type: "Features", value: "Enhanced" }
    ],
    image: "ipfs://QmPremiumReceiptImageCID/premium.png",
    animation_url: "ipfs://QmPremiumAnimationCID/premium-animation.mp4"
  },
  luxury: {
    name: "Luxury Receipt",
    description: "Exclusive digital receipt with comprehensive purchase information, warranty tracking, and premium visuals",
    attributes: [
      { trait_type: "Receipt Type", value: "Luxury" },
      { trait_type: "Features", value: "Premium" }
    ],
    image: "ipfs://QmLuxuryReceiptImageCID/luxury.png",
    animation_url: "ipfs://QmLuxuryAnimationCID/luxury-animation.mp4"
  }
};

/**
 * Generate metadata for a specific receipt
 * @param {number} tokenId - Token ID
 * @param {string} receiptType - Type of receipt (standard, premium, luxury)
 * @param {object} purchaseData - Purchase information
 */
function generateReceiptMetadata(tokenId, receiptType, purchaseData) {
  // Get the template for this receipt type
  const template = receiptTemplates[receiptType] || receiptTemplates.standard;
  
  // Build custom attributes based on purchase data
  const attributes = [
    ...template.attributes,
    { trait_type: "Merchant", value: purchaseData.merchant.name },
    { trait_type: "Purchase Date", display_type: "date", value: Math.floor(new Date(purchaseData.date).getTime() / 1000) },
    { trait_type: "Total Amount", display_type: "number", value: purchaseData.amount },
    { trait_type: "Currency", value: purchaseData.currency },
    { trait_type: "Items", value: purchaseData.items }
  ];
  
  // Add optional attributes if available
  if (purchaseData.taxAmount) {
    attributes.push({ trait_type: "Tax Amount", display_type: "number", value: purchaseData.taxAmount });
  }
  
  if (purchaseData.discountAmount) {
    attributes.push({ trait_type: "Discount", display_type: "number", value: purchaseData.discountAmount });
  }
  
  if (purchaseData.storeId) {
    attributes.push({ trait_type: "Store ID", value: purchaseData.storeId });
  }
  
  // Add status (valid or revoked)
  attributes.push({ trait_type: "Status", value: purchaseData.revoked ? "Revoked" : "Valid" });
  
  // Create the metadata object
  const metadata = {
    name: `${purchaseData.merchant.name} Receipt #${tokenId}`,
    description: `Digital receipt for a purchase at ${purchaseData.merchant.name} on ${new Date(purchaseData.date).toLocaleDateString()}. This receipt includes detailed purchase information and provides proof of purchase for warranty and return purposes.`,
    image: template.image,
    external_url: `https://blockreceipt.ai/receipt/${tokenId}`,
    background_color: "FFFFFF",
    animation_url: template.animation_url,
    attributes: attributes,
    encrypted_data: {
      ciphertext: purchaseData.encryptedData?.ciphertext || "0x",
      taco_urls: purchaseData.encryptedData?.tacoUrls || [],
      policy_id: purchaseData.encryptedData?.policyId || ""
    },
    receipt_details: {
      transaction_id: purchaseData.transactionId || `txn-${purchaseData.merchant.name.toLowerCase()}-${Date.now()}`,
      refund_policy_url: purchaseData.merchant.refundPolicyUrl || "https://example.com/refund-policy",
      warranty_info: purchaseData.warrantyInfo || "Standard return policy applies to all items",
      loyalty_rewards: purchaseData.loyaltyRewards || null
    }
  };
  
  return metadata;
}

/**
 * Generate a sample dataset of receipt metadata
 */
function generateSampleDataset() {
  // Save collection metadata for contractURI
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'collection.json'),
    JSON.stringify(collectionMetadata, null, 2)
  );
  console.log('Generated collection metadata');
  
  // Create sample merchants
  const merchants = [
    { name: "Whole Foods Market", refundPolicyUrl: "https://www.wholefoodsmarket.com/refund-policy" },
    { name: "Apple Store", refundPolicyUrl: "https://www.apple.com/shop/help/returns_refund" },
    { name: "Best Buy", refundPolicyUrl: "https://www.bestbuy.com/return-policy" },
    { name: "Target", refundPolicyUrl: "https://www.target.com/return-policy" },
    { name: "Amazon", refundPolicyUrl: "https://www.amazon.com/return-policy" }
  ];
  
  // Generate 5 sample receipts (one of each type)
  const receiptTypes = ['standard', 'premium', 'luxury', 'standard', 'premium'];
  const sampleReceipts = [];
  
  for (let i = 1; i <= 5; i++) {
    const merchant = merchants[i - 1];
    const receiptType = receiptTypes[i - 1];
    const purchaseDate = new Date();
    purchaseDate.setDate(purchaseDate.getDate() - (i * 3)); // Spread out purchase dates
    
    const purchaseData = {
      merchant: merchant,
      date: purchaseDate.toISOString(),
      amount: 50 + (i * 25), // Different amounts
      currency: "USD",
      items: i + 2,
      taxAmount: (50 + (i * 25)) * 0.0825, // 8.25% tax
      discountAmount: i === 3 ? 15 : 0, // Discount on the 3rd receipt
      storeId: `STORE-${1000 + i}`,
      revoked: i === 4, // 4th receipt is revoked
      transactionId: `TXN-${Date.now()}-${i}`,
      warrantyInfo: i === 2 ? "Extended 2-year warranty included" : "Standard 30-day return policy",
      loyaltyRewards: i === 5 ? { points_earned: 75, membership_level: "Gold" } : null,
      encryptedData: {
        ciphertext: `0x${Buffer.from(JSON.stringify({
          itemized_receipt: "This would be encrypted in production"
        })).toString('hex')}`,
        tacoUrls: ["https://taco1.example.com", "https://taco2.example.com"],
        policyId: `POLICY-${Date.now()}-${i}`
      }
    };
    
    // Generate metadata
    const metadata = generateReceiptMetadata(i, receiptType, purchaseData);
    
    // Save to file
    fs.writeFileSync(
      path.join(OUTPUT_DIR, `${i}.json`),
      JSON.stringify(metadata, null, 2)
    );
    
    sampleReceipts.push(metadata);
    console.log(`Generated metadata for token #${i}`);
  }
  
  // Save a combined file with all receipts for easy reference
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'sample-receipts.json'),
    JSON.stringify(sampleReceipts, null, 2)
  );
  
  console.log(`\nGenerated ${sampleReceipts.length} sample receipt metadata files`);
  console.log(`Output directory: ${OUTPUT_DIR}`);
}

// Execute the generator
generateSampleDataset();
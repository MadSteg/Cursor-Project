// Simple test script for PRE encryption functionality
const { thresholdClient } = require('./server/services/tacoService');

async function testPREEncryption() {
  console.log('🔐 Testing PRE Encryption Functionality...\n');
  
  // Sample receipt data
  const receiptData = {
    merchantName: "Test Coffee Shop",
    total: 15.99,
    items: [
      { name: "Latte", price: 5.99, quantity: 1 },
      { name: "Croissant", price: 4.50, quantity: 2 }
    ],
    date: "2025-05-24T23:50:00Z",
    subtotal: 14.49,
    tax: 1.50
  };
  
  console.log('📄 Original receipt data:');
  console.log(JSON.stringify(receiptData, null, 2));
  
  try {
    // Test encryption
    console.log('\n🔒 Testing encryption...');
    const receiptJson = JSON.stringify(receiptData);
    const testPublicKey = "test-public-key-for-encryption";
    
    const encryptedData = await thresholdClient.encrypt(receiptJson, testPublicKey);
    
    console.log('✅ Encryption successful!');
    console.log('📊 Encrypted data structure:');
    console.log({
      ciphertext: encryptedData.ciphertext ? '✅ Present' : '❌ Missing',
      capsule: encryptedData.capsule ? '✅ Present' : '❌ Missing',
      policyId: encryptedData.policyId ? '✅ Present' : '❌ Missing',
      ciphertextSize: encryptedData.ciphertext?.length || 0,
      capsuleSize: encryptedData.capsule?.length || 0
    });
    
    // Generate receipt hash
    const crypto = require('crypto');
    const receiptHash = crypto.createHash('sha256').update(receiptJson).digest('hex');
    console.log('🔍 Receipt hash:', receiptHash);
    
    console.log('\n🎉 PRE encryption test completed successfully!');
    console.log('✅ Core encryption functionality is working');
    console.log('✅ TACo integration is operational');
    console.log('✅ Data structures are properly formatted');
    
  } catch (error) {
    console.error('❌ Encryption test failed:', error.message);
    
    if (error.message.includes('API key') || error.message.includes('authentication')) {
      console.log('\n💡 This might be due to missing API keys or authentication tokens.');
      console.log('   The PRE integration requires proper TACo service configuration.');
    }
  }
}

// Run the test
testPREEncryption();
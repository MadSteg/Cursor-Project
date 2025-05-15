import taco from '@nucypher/taco';

/**
 * Encrypts receipt line items using the TACo library
 * This enables privacy-preserving sharing of receipt data
 * 
 * @param userPublicKey The user's public key for encryption
 * @param receipt The receipt data with line items to encrypt
 * @returns Encrypted data with ciphertext, capsule, and policy key
 */
export async function encryptLineItems(userPublicKey: string, receipt: any) {
  try {
    // Prepare the data to encrypt - focus on sensitive line items
    const dataToEncrypt = JSON.stringify({
      merchant: receipt.merchantName,
      items: receipt.items.map((item: any) => ({
        name: item.name,
        price: item.price,
        category: determineItemCategory(item.name)
      })),
      date: receipt.date,
      subtotal: receipt.subtotal,
      tax: receipt.tax
    });
    
    // Use TACo's encrypt function
    const { ciphertext, capsule, policyPublicKey } = await taco.encrypt({
      data: dataToEncrypt,
      recipientPublicKey: userPublicKey
    });
    
    return {
      ciphertext,
      capsule,
      policyPublicKey
    };
  } catch (error: any) {
    console.error('Error encrypting line items:', error);
    // Return a mock encryption result for development
    return {
      ciphertext: 'mock-encrypted-data',
      capsule: 'mock-capsule',
      policyPublicKey: 'mock-policy-key',
      error: error.message
    };
  }
}

/**
 * Determines the category of an item based on its name
 * Uses a simple keyword matching approach
 * 
 * @param itemName The name of the item
 * @returns The determined category
 */
function determineItemCategory(itemName: string): string {
  const name = itemName.toLowerCase();
  
  // Food and beverage keywords
  if (name.match(/coffee|tea|latte|espresso|cappuccino|mocha|americano/)) {
    return 'coffee';
  }
  
  if (name.match(/pizza|burger|sandwich|fries|salad|sushi|taco|burrito|pasta|noodle|rice/)) {
    return 'food';
  }
  
  if (name.match(/soda|coke|pepsi|sprite|water|juice|beer|wine|cocktail|drink/)) {
    return 'beverage';
  }
  
  if (name.match(/cookie|cake|ice cream|chocolate|candy|dessert|sweet|pastry|donut|snack/)) {
    return 'snack';
  }
  
  // Grocery and household keywords
  if (name.match(/milk|bread|eggs|cheese|meat|chicken|beef|pork|fish|vegetable|fruit/)) {
    return 'grocery';
  }
  
  if (name.match(/toilet|paper|soap|detergent|cleaner|tissue|shampoo|toothpaste|deodorant/)) {
    return 'household';
  }
  
  // Technology keywords
  if (name.match(/phone|laptop|computer|tablet|mouse|keyboard|monitor|printer|headphone|speaker/)) {
    return 'electronics';
  }
  
  if (name.match(/service|repair|installation|maintenance|subscription|membership/)) {
    return 'service';
  }
  
  // Clothing and accessories keywords
  if (name.match(/shirt|pants|dress|jacket|coat|sweater|jeans|shoes|hat|socks|underwear/)) {
    return 'clothing';
  }
  
  if (name.match(/bag|wallet|purse|watch|jewelry|accessory|belt|scarf|glove/)) {
    return 'accessory';
  }
  
  // Transportation keywords
  if (name.match(/gas|fuel|parking|toll|taxi|uber|lyft|bus|train|plane|ticket/)) {
    return 'transportation';
  }
  
  // Default category if no matches
  return 'miscellaneous';
}
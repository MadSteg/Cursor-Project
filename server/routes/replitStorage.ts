import { Router } from 'express';
import { Client } from '@replit/object-storage';

const router = Router();

// Initialize Replit Object Storage client
let replitClient: Client | null = null;
let isConnected = false;

try {
  replitClient = new Client();
  isConnected = true;
  console.log('[replit-storage] Connected to Replit Object Storage successfully');
} catch (error) {
  console.error('[replit-storage] Failed to connect:', error);
}

/**
 * GET /api/replit-storage/images
 * Get all images from Replit Object Storage
 */
router.get('/images', async (req, res) => {
  try {
    if (!isConnected || !replitClient) {
      return res.status(503).json({ 
        error: 'Replit Object Storage not initialized',
        message: 'Unable to connect to object storage'
      });
    }

    const objects = await replitClient.list();
    
    // Filter for image files
    const imageObjects = objects.filter(obj => {
      const name = obj.key.toLowerCase();
      return name.endsWith('.png') || 
             name.endsWith('.jpg') || 
             name.endsWith('.jpeg') || 
             name.endsWith('.gif') || 
             name.endsWith('.webp');
    });

    const images = imageObjects.map(obj => ({
      key: obj.key,
      name: obj.key.split('/').pop() || obj.key,
      size: obj.size,
      lastModified: obj.lastModified,
      url: `https://storage.googleapis.com/replit/${process.env.REPL_SLUG}/${obj.key}`
    }));
    
    res.json({
      success: true,
      count: images.length,
      images: images
    });
  } catch (error: any) {
    console.error('[replit-storage-route] Error listing images:', error);
    res.status(500).json({ 
      error: 'Failed to list images from storage',
      message: error.message
    });
  }
});

/**
 * GET /api/replit-storage/generate-nfts
 * Generate NFT metadata from Object Storage images
 */
router.get('/generate-nfts', async (req, res) => {
  try {
    if (!isConnected || !replitClient) {
      return res.status(503).json({ 
        error: 'Replit Object Storage not initialized'
      });
    }

    const result = await replitClient.list();
    console.log('[replit-storage] List result:', result);
    
    // Extract the actual objects array from the result
    let objects: any[] = [];
    if (result && result.ok && Array.isArray(result.value)) {
      objects = result.value;
    } else if (Array.isArray(result)) {
      objects = result;
    }
    
    console.log('[replit-storage] Found objects:', objects.length);
    
    // Filter for PNG image files specifically (like in your bucket)
    const imageObjects = objects.filter((obj: any) => {
      if (!obj || !obj.key) return false;
      const name = obj.key.toLowerCase();
      return name.endsWith('.png');
    });
    
    // Generate NFT metadata for each image
    const nfts = imageObjects.map((obj, index) => {
      const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
      const merchants = ['dunkin', 'cvs', null]; // null for general NFTs
      
      // Clean up the name from filename
      const fileName = obj.key.split('/').pop() || obj.key;
      const cleanName = fileName
        .replace(/Screenshot\s+\d{4}-\d{2}-\d{2}\s+at\s+/, '')
        .replace(/\.png$/i, '')
        .replace(/[\d\.\s]+/g, ' ')
        .trim();
      
      // Assign rarity based on index for variety
      const rarity = rarities[index % rarities.length];
      const merchant = merchants[index % merchants.length];
      
      return {
        id: `replit-${index + 1}`,
        name: cleanName || `Character #${index + 1}`,
        description: `Exclusive NFT character with unique traits and ${rarity} rarity level.`,
        image: `https://storage.googleapis.com/replit/${process.env.REPL_SLUG}/${obj.key}`,
        rarity: rarity,
        merchant: merchant,
        attributes: [
          {
            trait_type: "Source",
            value: "Replit Storage"
          },
          {
            trait_type: "Rarity",
            value: rarity.charAt(0).toUpperCase() + rarity.slice(1)
          },
          {
            trait_type: "Type",
            value: "Character"
          },
          ...(merchant ? [{
            trait_type: "Merchant",
            value: merchant === 'dunkin' ? 'Dunkin\'' : 'CVS'
          }] : [])
        ]
      };
    });

    res.json({
      success: true,
      count: nfts.length,
      nfts: nfts
    });
  } catch (error: any) {
    console.error('[replit-storage-route] Error generating NFTs:', error);
    res.status(500).json({ 
      error: 'Failed to generate NFTs from images',
      message: error.message
    });
  }
});

/**
 * GET /api/replit-storage/status
 * Check Replit Object Storage connection status
 */
router.get('/status', (req, res) => {
  res.json({
    connected: isConnected,
    message: isConnected 
      ? 'Connected to Replit Object Storage'
      : 'Not connected to Replit Object Storage'
  });
});

export default router;
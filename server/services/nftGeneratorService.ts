import * as fs from 'fs-extra';
import * as path from 'path';
import { Storage } from '@google-cloud/storage';
import * as canvas from 'canvas';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import logger from '../logger';

interface Trait {
  name: string;
  weight?: number;
}

interface LayerConfig {
  name: string;
  traits: Trait[];
}

interface NFTGenerationConfig {
  collectionName: string;
  description: string;
  size: number;
  width?: number;
  height?: number;
  folders: string[];
}

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

interface NFT {
  id: number;
  name: string;
  image: string;
  metadata: string;
  traits: Record<string, string>;
  edition: number;
}

interface GenerationResult {
  collection: {
    id: string;
    name: string;
    description: string;
    size: number;
    folder: string;
    metadata: string;
  };
  nfts: NFT[];
}

let storage: Storage;
let bucket: any;

// Initialize the Google Cloud Storage service
try {
  const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS || '{}');
  storage = new Storage({ credentials });
  bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME || '');
  logger.info('[nft-generator] Google Storage service initialized for NFT generation');
} catch (error) {
  logger.error('[nft-generator] Failed to initialize Google Storage service:', error);
}

/**
 * NFTGeneratorService provides methods to generate NFTs from images in Google Cloud Storage
 */
class NFTGeneratorService {
  /**
   * Lists all folders in the specified bucket path
   */
  async listFolders(prefix = ''): Promise<string[]> {
    try {
      const [files] = await bucket.getFiles({
        prefix,
        delimiter: '/',
        autoPaginate: false
      });

      // Get unique folders from files
      const folders = new Set<string>();
      files.forEach((file: any) => {
        const filePath = file.name;
        if (filePath.includes('/')) {
          const folder = filePath.split('/')[0];
          if (folder) folders.add(folder);
        }
      });

      return Array.from(folders);
    } catch (error) {
      logger.error('[nft-generator] Error listing folders:', error);
      throw new Error('Failed to list folders from Google Cloud Storage');
    }
  }

  /**
   * Lists all images in a specific folder
   */
  async listImagesInFolder(folder: string): Promise<Array<{ name: string; publicUrl: string }>> {
    try {
      const [files] = await bucket.getFiles({
        prefix: folder ? `${folder}/` : '',
        autoPaginate: false
      });

      return files
        .filter((file: any) => {
          const fileName = file.name.toLowerCase();
          return fileName.endsWith('.png') || 
                 fileName.endsWith('.jpg') || 
                 fileName.endsWith('.jpeg') || 
                 fileName.endsWith('.gif');
        })
        .map((file: any) => ({
          name: file.name,
          publicUrl: file.publicUrl()
        }));
    } catch (error) {
      logger.error('[nft-generator] Error listing images in folder:', error);
      throw new Error('Failed to list images from Google Cloud Storage');
    }
  }

  /**
   * Creates a merged NFT image from multiple trait images
   */
  async createLayeredImage(layerImages: string[], width = 1000, height = 1000): Promise<Buffer> {
    try {
      // Create a canvas with the specified dimensions
      const cnv = canvas.createCanvas(width, height);
      const ctx = cnv.getContext('2d');
      
      // Download and composite each layer
      for (const imageUrl of layerImages) {
        const img = await canvas.loadImage(imageUrl);
        ctx.drawImage(img, 0, 0, width, height);
      }
      
      // Convert canvas to buffer
      return cnv.toBuffer();
    } catch (error) {
      logger.error('[nft-generator] Error creating layered image:', error);
      throw new Error('Failed to create layered NFT image');
    }
  }

  /**
   * Creates NFT metadata
   */
  createMetadata(name: string, description: string, imageUrl: string, attributes: Record<string, string> = {}): NFTMetadata {
    return {
      name,
      description,
      image: imageUrl,
      attributes: Object.entries(attributes).map(([trait_type, value]) => ({
        trait_type,
        value
      }))
    };
  }

  /**
   * Generates a collection of NFTs from Google Cloud Storage images
   */
  async generateNFTCollection(config: NFTGenerationConfig): Promise<GenerationResult> {
    try {
      const {
        collectionName = 'BlockReceipt Collection',
        description = 'A collection of unique BlockReceipt NFTs',
        size = 10,
        width = 1000,
        height = 1000,
        folders = []
      } = config;

      const results: NFT[] = [];
      const collectionId = uuidv4().substring(0, 8);
      const outputFolder = `nft-collections/${collectionName.toLowerCase().replace(/\s+/g, '-')}-${collectionId}`;
      
      // Create mapping of folders to their images
      const folderImages: Record<string, Array<{ name: string; publicUrl: string }>> = {};
      for (const folder of folders) {
        const images = await this.listImagesInFolder(folder);
        if (images.length > 0) {
          folderImages[folder] = images;
        }
      }

      // Check if we have enough layers
      if (Object.keys(folderImages).length === 0) {
        throw new Error('No valid image folders found');
      }

      // Generate the specified number of NFTs
      for (let i = 0; i < size; i++) {
        // Select one random image from each folder
        const selectedImages: string[] = [];
        const traits: Record<string, string> = {};
        
        for (const [folder, images] of Object.entries(folderImages)) {
          if (images.length > 0) {
            const randomIndex = Math.floor(Math.random() * images.length);
            const selectedImage = images[randomIndex];
            selectedImages.push(selectedImage.publicUrl);
            
            // Extract trait name from filename (remove extension)
            const fileName = path.basename(selectedImage.name);
            const traitName = fileName.substring(0, fileName.lastIndexOf('.'));
            traits[folder] = traitName;
          }
        }
        
        // Create the composite image
        const imageBuffer = await this.createLayeredImage(selectedImages, width, height);
        
        // Upload the image to Google Cloud Storage
        const imageName = `${outputFolder}/${i + 1}.png`;
        const imageFile = bucket.file(imageName);
        await imageFile.save(imageBuffer, {
          metadata: {
            contentType: 'image/png'
          }
        });
        
        // Make the image publicly accessible
        await imageFile.makePublic();
        const imageUrl = imageFile.publicUrl();
        
        // Create and upload metadata
        const metadata = this.createMetadata(
          `${collectionName} #${i + 1}`,
          description,
          imageUrl,
          traits
        );
        
        const metadataName = `${outputFolder}/${i + 1}.json`;
        const metadataFile = bucket.file(metadataName);
        await metadataFile.save(JSON.stringify(metadata, null, 2), {
          metadata: {
            contentType: 'application/json'
          }
        });
        
        // Make the metadata publicly accessible
        await metadataFile.makePublic();
        const metadataUrl = metadataFile.publicUrl();
        
        // Add to results
        results.push({
          id: i + 1,
          name: `${collectionName} #${i + 1}`,
          image: imageUrl,
          metadata: metadataUrl,
          traits,
          edition: i + 1
        });
      }
      
      // Create and upload collection metadata
      const collectionMetadata = {
        name: collectionName,
        description,
        image: results[0]?.image || null,
        external_link: null,
        seller_fee_basis_points: 0,
        fee_recipient: null,
        size: results.length,
        created_at: new Date().toISOString()
      };
      
      const collectionMetadataName = `${outputFolder}/collection.json`;
      const collectionMetadataFile = bucket.file(collectionMetadataName);
      await collectionMetadataFile.save(JSON.stringify(collectionMetadata, null, 2), {
        metadata: {
          contentType: 'application/json'
        }
      });
      
      // Make the collection metadata publicly accessible
      await collectionMetadataFile.makePublic();
      
      return {
        collection: {
          id: collectionId,
          name: collectionName,
          description,
          size: results.length,
          folder: outputFolder,
          metadata: collectionMetadataFile.publicUrl()
        },
        nfts: results
      };
    } catch (error) {
      logger.error('[nft-generator] Error generating NFT collection:', error);
      throw new Error(`Failed to generate NFT collection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new NFTGeneratorService();
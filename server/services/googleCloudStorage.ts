import { Storage } from '@google-cloud/storage';

class GoogleCloudStorageService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    if (!process.env.GOOGLE_CLOUD_CREDENTIALS || !process.env.GOOGLE_CLOUD_BUCKET_NAME) {
      throw new Error('Google Cloud Storage credentials or bucket name not configured');
    }

    // Parse the credentials from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
    
    this.storage = new Storage({
      credentials,
      projectId: credentials.project_id,
    });
    
    this.bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
  }

  /**
   * List all NFT images in the bucket
   */
  async listNFTImages(): Promise<string[]> {
    try {
      const [files] = await this.storage.bucket(this.bucketName).getFiles({
        prefix: 'nft', // Assuming your NFT images have 'nft' prefix
      });

      // Filter for image files and return their names
      return files
        .filter(file => {
          const name = file.name.toLowerCase();
          return name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.gif');
        })
        .map(file => file.name);
    } catch (error) {
      console.error('Error listing NFT images:', error);
      return [];
    }
  }

  /**
   * Get a public URL for an image in the bucket
   */
  getPublicUrl(fileName: string): string {
    return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
  }

  /**
   * Get all NFT images with their public URLs
   */
  async getNFTImagesWithUrls(): Promise<Array<{ fileName: string; url: string }>> {
    try {
      const imageFileNames = await this.listNFTImages();
      return imageFileNames.map(fileName => ({
        fileName,
        url: this.getPublicUrl(fileName)
      }));
    } catch (error) {
      console.error('Error getting NFT images with URLs:', error);
      return [];
    }
  }

  /**
   * Check if bucket exists and is accessible
   */
  async testConnection(): Promise<boolean> {
    try {
      const [exists] = await this.storage.bucket(this.bucketName).exists();
      return exists;
    } catch (error) {
      console.error('Error testing Google Cloud Storage connection:', error);
      return false;
    }
  }
}

export const googleCloudStorageService = new GoogleCloudStorageService();
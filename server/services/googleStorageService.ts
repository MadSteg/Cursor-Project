import { Storage } from '@google-cloud/storage';
import { createLogger } from '../logger';

const logger = createLogger('google-storage');

/**
 * Service to interact with Google Cloud Storage
 * This service provides methods to fetch images and other assets from a GCS bucket
 */
class GoogleStorageService {
  private storage: Storage;
  private bucketName: string = 'blockreceipt-images'; // Default bucket name
  private isInitialized: boolean = false;

  constructor() {
    try {
      // Get the credentials from environment
      const credentials = process.env.GOOGLE_CLOUD_CREDENTIALS;
      this.bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || 'blockreceipt-images';
      
      if (!credentials) {
        logger.warn('Google Cloud credentials not found in environment variables');
        this.storage = new Storage();
        return;
      }
      
      // Parse the credentials JSON
      let parsedCredentials;
      try {
        parsedCredentials = JSON.parse(credentials);
      } catch (error) {
        logger.error('Failed to parse Google Cloud credentials', error);
        this.storage = new Storage();
        return;
      }

      // Initialize the storage client with credentials
      this.storage = new Storage({
        credentials: parsedCredentials,
        projectId: parsedCredentials.project_id
      });
      
      this.isInitialized = true;
      logger.info(`Google Storage service initialized with bucket: ${this.bucketName}`);
    } catch (error) {
      logger.error('Error initializing Google Storage service', error);
      this.storage = new Storage();
    }
  }

  /**
   * Check if the service is properly initialized with credentials
   */
  public isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get a signed URL for a file in the bucket
   * @param fileName The name of the file in the bucket
   * @param expiresInMinutes How long the URL should be valid (default: 15 minutes)
   * @returns A signed URL that can be used to access the file
   */
  public async getSignedUrl(fileName: string, expiresInMinutes: number = 15): Promise<string> {
    if (!this.isInitialized) {
      logger.warn('Attempted to get signed URL without initialized service');
      return '';
    }

    try {
      const options = {
        version: 'v4' as const,
        action: 'read' as const,
        expires: Date.now() + expiresInMinutes * 60 * 1000
      };

      const [url] = await this.storage
        .bucket(this.bucketName)
        .file(fileName)
        .getSignedUrl(options);

      return url;
    } catch (error) {
      logger.error(`Error getting signed URL for file ${fileName}`, error);
      return '';
    }
  }

  /**
   * Get a list of all files in the bucket or a specific folder
   * @param prefix Optional folder prefix to limit results
   * @returns Array of file names
   */
  public async listFiles(prefix?: string): Promise<string[]> {
    if (!this.isInitialized) {
      logger.warn('Attempted to list files without initialized service');
      return [];
    }

    try {
      const options: any = {};
      if (prefix) {
        options.prefix = prefix;
      }

      const [files] = await this.storage.bucket(this.bucketName).getFiles(options);
      return files.map(file => file.name);
    } catch (error) {
      logger.error('Error listing files from Google Cloud Storage', error);
      return [];
    }
  }

  /**
   * Create public URLs for files (non-authenticated)
   * Note: This only works if the bucket or objects are set to public
   * @param fileName The name of the file in the bucket
   * @returns A public URL for the file
   */
  public getPublicUrl(fileName: string): string {
    return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
  }
}

// Export as a singleton
export const googleStorageService = new GoogleStorageService();
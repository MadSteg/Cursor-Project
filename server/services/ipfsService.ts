/**
 * IPFS Service for BlockReceipt.ai
 * 
 * This service provides functionality for uploading and retrieving files 
 * from IPFS (InterPlanetary File System).
 */

import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import logger from '../logger';

/**
 * IPFS Service Class
 */
class IPFSService {
  private pinataApiKey: string;
  private pinataSecretApiKey: string;
  private useLocal: boolean;
  private localNode: string;
  
  constructor() {
    // Initialize with environment variables
    this.pinataApiKey = process.env.PINATA_API_KEY || '';
    this.pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY || '';
    this.useLocal = process.env.USE_LOCAL_IPFS === 'true';
    this.localNode = process.env.LOCAL_IPFS_API || 'http://localhost:5001/api/v0';
    
    // For development, allow the service to work without real credentials
    const devMode = process.env.NODE_ENV === 'development' && !this.pinataApiKey;
    
    if (!this.pinataApiKey && !this.useLocal && !devMode) {
      logger.warn('IPFS Service initialized without Pinata API keys');
    } else {
      logger.info('IPFS Service initialized');
    }
  }
  
  /**
   * Upload a file to IPFS
   * @param filePath Path to the file to upload
   * @returns CID of the uploaded file
   */
  async uploadFile(filePath: string): Promise<string> {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }
      
      logger.info(`Uploading file to IPFS: ${filePath}`);
      
      if (this.useLocal) {
        return this.uploadToLocalNode(filePath);
      } else {
        return this.uploadToPinata(filePath);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`IPFS upload failed: ${message}`);
      throw new Error(`Failed to upload file to IPFS: ${message}`);
    }
  }
  
  /**
   * Upload a buffer to IPFS
   * @param buffer Buffer to upload
   * @param filename Optional filename
   * @returns CID of the uploaded file
   */
  async uploadBuffer(buffer: Buffer, filename: string = 'file'): Promise<string> {
    try {
      logger.info(`Uploading buffer to IPFS with filename: ${filename}`);
      
      if (this.useLocal) {
        // Create temporary file from buffer
        const tempPath = `/tmp/${Date.now()}-${filename}`;
        fs.writeFileSync(tempPath, buffer);
        
        try {
          return await this.uploadToLocalNode(tempPath);
        } finally {
          // Clean up temp file
          fs.unlinkSync(tempPath);
        }
      } else {
        return this.uploadBufferToPinata(buffer, filename);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`IPFS buffer upload failed: ${message}`);
      throw new Error(`Failed to upload buffer to IPFS: ${message}`);
    }
  }
  
  /**
   * Upload JSON data to IPFS
   * @param data JSON data to upload
   * @returns CID of the uploaded data
   */
  async uploadJSON(data: any): Promise<string> {
    try {
      logger.info('Uploading JSON data to IPFS');
      
      const jsonString = JSON.stringify(data);
      const buffer = Buffer.from(jsonString);
      
      return await this.uploadBuffer(buffer, 'data.json');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`IPFS JSON upload failed: ${message}`);
      throw new Error(`Failed to upload JSON to IPFS: ${message}`);
    }
  }
  
  /**
   * Upload a file to Pinata IPFS service
   * @param filePath Path to the file to upload
   * @returns CID of the uploaded file
   */
  private async uploadToPinata(filePath: string): Promise<string> {
    // For development mode, return a mock CID if no API keys
    if (!this.pinataApiKey && process.env.NODE_ENV === 'development') {
      logger.warn('Development mode: Returning mock CID for IPFS upload');
      return `ipfs-mock-cid-${Date.now()}`;
    }
    
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    
    const data = new FormData();
    data.append('file', fs.createReadStream(filePath));
    
    const response = await axios.post(url, data, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`,
        'pinata_api_key': this.pinataApiKey,
        'pinata_secret_api_key': this.pinataSecretApiKey
      }
    });
    
    logger.info(`File uploaded to IPFS with CID: ${response.data.IpfsHash}`);
    
    return response.data.IpfsHash;
  }
  
  /**
   * Upload a buffer to Pinata IPFS service
   * @param buffer Buffer to upload
   * @param filename Filename to use
   * @returns CID of the uploaded file
   */
  private async uploadBufferToPinata(buffer: Buffer, filename: string): Promise<string> {
    // For development mode, return a mock CID if no API keys
    if (!this.pinataApiKey && process.env.NODE_ENV === 'development') {
      logger.warn('Development mode: Returning mock CID for IPFS buffer upload');
      return `ipfs-mock-cid-${Date.now()}`;
    }
    
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    
    const data = new FormData();
    data.append('file', buffer, { filename });
    
    const response = await axios.post(url, data, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`,
        'pinata_api_key': this.pinataApiKey,
        'pinata_secret_api_key': this.pinataSecretApiKey
      }
    });
    
    logger.info(`Buffer uploaded to IPFS with CID: ${response.data.IpfsHash}`);
    
    return response.data.IpfsHash;
  }
  
  /**
   * Upload a file to a local IPFS node
   * @param filePath Path to the file to upload
   * @returns CID of the uploaded file
   */
  private async uploadToLocalNode(filePath: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));
      
      const response = await axios.post(`${this.localNode}/add`, formData, {
        headers: formData.getHeaders()
      });
      
      logger.info(`File uploaded to local IPFS node with CID: ${response.data.Hash}`);
      
      return response.data.Hash;
    } catch (error) {
      throw new Error(`Local IPFS node upload failed: ${error.message}`);
    }
  }
  
  /**
   * Get a file from IPFS
   * @param cid CID of the file to retrieve
   * @returns Buffer containing the file data
   */
  async getFile(cid: string): Promise<Buffer> {
    try {
      // For development mode, return a mock buffer if no API keys
      if (!this.pinataApiKey && process.env.NODE_ENV === 'development' && cid.startsWith('ipfs-mock-cid-')) {
        logger.warn('Development mode: Returning mock data for IPFS retrieval');
        return Buffer.from('Mock IPFS data for development');
      }
      
      logger.info(`Retrieving file from IPFS with CID: ${cid}`);
      
      let url: string;
      
      if (this.useLocal) {
        url = `${this.localNode}/cat?arg=${cid}`;
      } else {
        // Use IPFS gateway
        url = `https://gateway.pinata.cloud/ipfs/${cid}`;
      }
      
      const response = await axios.get(url, {
        responseType: 'arraybuffer'
      });
      
      return Buffer.from(response.data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`IPFS retrieval failed: ${message}`);
      throw new Error(`Failed to retrieve file from IPFS: ${message}`);
    }
  }
  
  /**
   * Get JSON data from IPFS
   * @param cid CID of the JSON data to retrieve
   * @returns Parsed JSON data
   */
  async getJSON(cid: string): Promise<any> {
    try {
      // For development mode, return mock data if no API keys
      if (!this.pinataApiKey && process.env.NODE_ENV === 'development' && cid.startsWith('ipfs-mock-cid-')) {
        logger.warn('Development mode: Returning mock JSON for IPFS retrieval');
        return {
          mockData: true,
          timestamp: Date.now(),
          message: 'This is mock data for development'
        };
      }
      
      logger.info(`Retrieving JSON from IPFS with CID: ${cid}`);
      
      const buffer = await this.getFile(cid);
      const jsonString = buffer.toString('utf8');
      
      return JSON.parse(jsonString);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`IPFS JSON retrieval failed: ${message}`);
      throw new Error(`Failed to retrieve JSON from IPFS: ${message}`);
    }
  }
}

// Export singleton instance
export const ipfsService = new IPFSService();
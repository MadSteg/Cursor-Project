/**
 * NFT Purchase Handler for BlockReceipt.ai
 * 
 * This handler processes asynchronous NFT purchase requests
 * via the task queue service.
 */

import { Task } from '../services/taskQueueService';
import { nftMintService } from '../services/nftMintService';
import { ipfsService } from '../services/ipfsService';
import { tacoService } from '../services/tacoService';
import logger from '../logger';

/**
 * Handle NFT purchase task
 * @param task Task from queue
 * @returns Task result
 */
async function handleNftPurchaseTask(task: Task): Promise<any> {
  const { receipt, wallet, publicKey, encryptMetadata } = task.data;
  
  if (!receipt) {
    throw new Error('Receipt data missing from task');
  }
  
  if (!wallet) {
    throw new Error('Wallet address missing from task');
  }
  
  logger.info(`Processing NFT purchase for receipt ${receipt.id}`);
  
  try {
    // Upload receipt image to IPFS if available
    let imageCid = '';
    if (receipt.imageData) {
      logger.info('Uploading receipt image to IPFS');
      
      // Decode base64 image data
      const imageBuffer = Buffer.from(receipt.imageData, 'base64');
      
      // Upload to IPFS
      const imageResult = await ipfsService.uploadFile(imageBuffer, `receipt_${receipt.id}.jpg`);
      imageCid = imageResult.cid;
      
      logger.info(`Image uploaded to IPFS with CID: ${imageCid}`);
    }
    
    // Add image path to receipt data
    const receiptWithImage = {
      ...receipt,
      imagePath: imageCid || undefined
    };
    
    // Mint NFT with encryption if requested
    const mintResult = await nftMintService.mintReceiptNFT(receiptWithImage, {
      encryptedMetadata: encryptMetadata,
      wallet,
      recipientPublicKey: publicKey
    });
    
    logger.info(`NFT minted successfully with token ID: ${mintResult.nft.tokenId}`);
    
    return {
      success: true,
      receipt: {
        id: receipt.id,
        merchant: receipt.merchantName,
        date: receipt.date,
        total: receipt.total
      },
      nft: mintResult.nft,
      transaction: mintResult.nft.transaction,
      encryption: mintResult.encryption
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`NFT purchase failed: ${errorMessage}`);
    throw new Error(`NFT purchase failed: ${errorMessage}`);
  }
}

export default handleNftPurchaseTask;
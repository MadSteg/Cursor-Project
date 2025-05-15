/**
 * Task Queue Service for BlockReceipt
 * 
 * Manages asynchronous tasks like NFT purchases and fallback minting
 * with proper tracking and error handling.
 */

import { nftPurchaseBot } from './nftPurchaseBot';
import { encryptLineItems } from '../utils/encryptLineItems';

type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface Task {
  id: string;
  type: 'nft_purchase' | 'fallback_mint' | 'metadata_encryption';
  status: TaskStatus;
  data: any;
  result?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  walletAddress: string;
  receiptId: string;
}

// In-memory storage for task queue (replace with DB in production)
const taskQueue: Map<string, Task> = new Map();

/**
 * Generate a unique task ID
 */
function generateTaskId(): string {
  return `task-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

/**
 * Create a new task and add it to the queue
 */
export function createTask(
  type: 'nft_purchase' | 'fallback_mint' | 'metadata_encryption',
  data: any,
  walletAddress: string,
  receiptId: string
): Task {
  const taskId = generateTaskId();
  const now = new Date();
  
  const task: Task = {
    id: taskId,
    type,
    status: 'pending',
    data,
    createdAt: now,
    updatedAt: now,
    walletAddress,
    receiptId
  };
  
  taskQueue.set(taskId, task);
  console.log(`Task created: ${taskId} of type ${type} for wallet ${walletAddress}`);
  
  // Start processing the task immediately
  processTask(taskId).catch(err => {
    console.error(`Error processing task ${taskId}:`, err);
    updateTaskStatus(taskId, 'failed', { error: err.message || 'Unknown error' });
  });
  
  return task;
}

/**
 * Update the status of a task
 */
export function updateTaskStatus(
  taskId: string, 
  status: TaskStatus, 
  updates: Partial<Task> = {}
): Task | null {
  const task = taskQueue.get(taskId);
  
  if (!task) {
    console.warn(`Attempted to update non-existent task: ${taskId}`);
    return null;
  }
  
  const updatedTask = {
    ...task,
    ...updates,
    status,
    updatedAt: new Date()
  };
  
  taskQueue.set(taskId, updatedTask);
  console.log(`Task ${taskId} updated to status: ${status}`);
  
  return updatedTask;
}

/**
 * Get a task by ID
 */
export function getTaskById(taskId: string): Task | null {
  return taskQueue.get(taskId) || null;
}

/**
 * Get all tasks for a wallet address
 */
export function getTasksByWallet(walletAddress: string): Task[] {
  return Array.from(taskQueue.values())
    .filter(task => task.walletAddress === walletAddress)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Process a task based on its type
 */
async function processTask(taskId: string): Promise<void> {
  const task = taskQueue.get(taskId);
  
  if (!task) {
    console.warn(`Attempted to process non-existent task: ${taskId}`);
    return;
  }
  
  updateTaskStatus(taskId, 'processing');
  
  try {
    let result;
    
    switch (task.type) {
      case 'nft_purchase':
        // Try to purchase an NFT from the marketplace
        console.log(`Processing NFT purchase task ${taskId} for wallet ${task.walletAddress}`);
        result = await nftPurchaseBot.purchaseAndTransferNFT(
          task.walletAddress,
          task.receiptId,
          task.data.receiptData
        );
        
        if (result && result.success) {
          // NFT purchase successful
          updateTaskStatus(taskId, 'completed', { result });
          
          // If we have encrypted metadata, update the encryption with the token ID
          if (task.data.encryptedMetadata) {
            createTask(
              'metadata_encryption',
              {
                encryptedMetadata: task.data.encryptedMetadata,
                tokenId: result.tokenId
              },
              task.walletAddress,
              task.receiptId
            );
          }
        } else {
          // NFT purchase failed, try fallback minting
          console.log(`NFT purchase failed for ${task.walletAddress}, trying fallback mint...`);
          createTask(
            'fallback_mint',
            task.data,
            task.walletAddress,
            task.receiptId
          );
          
          updateTaskStatus(taskId, 'failed', { 
            error: 'NFT marketplace purchase failed, trying fallback mint', 
            result 
          });
        }
        break;
        
      case 'fallback_mint':
        // Mint a fallback NFT from our collection
        console.log(`Processing fallback mint task ${taskId} for wallet ${task.walletAddress}`);
        result = await nftPurchaseBot.mintFallbackNFT(
          task.walletAddress,
          task.receiptId,
          task.data.receiptData
        );
        
        if (result && result.success) {
          // Fallback mint successful
          updateTaskStatus(taskId, 'completed', { result });
          
          // If we have encrypted metadata, update the encryption with the token ID
          if (task.data.encryptedMetadata) {
            createTask(
              'metadata_encryption',
              {
                encryptedMetadata: task.data.encryptedMetadata,
                tokenId: result.tokenId
              },
              task.walletAddress,
              task.receiptId
            );
          }
        } else {
          // Fallback mint failed
          updateTaskStatus(taskId, 'failed', { 
            error: 'Fallback NFT minting failed', 
            result 
          });
        }
        break;
        
      case 'metadata_encryption':
        // Store or update encrypted metadata with token ID
        console.log(`Processing metadata encryption task ${taskId} for wallet ${task.walletAddress}`);
        
        // In a production system, this would update a database record
        // with the tokenId and encryption details.
        // For now, we'll just log the association
        
        const { encryptedMetadata, tokenId } = task.data;
        console.log(`Associated encrypted metadata for receipt ${task.receiptId} with tokenId ${tokenId}`);
        console.log(`Encryption details: Policy key: ${encryptedMetadata.policyId}, Capsule: ${encryptedMetadata.capsuleId}`);
        
        updateTaskStatus(taskId, 'completed', { 
          result: { 
            tokenId,
            encryptionStatus: 'associated',
            message: 'Encrypted metadata successfully associated with NFT'
          } 
        });
        break;
        
      default:
        updateTaskStatus(taskId, 'failed', { error: `Unknown task type: ${task.type}` });
        break;
    }
  } catch (error) {
    console.error(`Error processing task ${taskId} of type ${task.type}:`, error);
    updateTaskStatus(taskId, 'failed', { error: error.message || 'Unknown error' });
  }
}

/**
 * Create an NFT purchase task with receipt data and wallet address
 */
export function createNFTPurchaseTask(
  walletAddress: string,
  receiptId: string,
  receiptData: any,
  encryptedMetadata?: any
): Task {
  return createTask('nft_purchase', { receiptData, encryptedMetadata }, walletAddress, receiptId);
}

/**
 * Get the status of the NFT purchase process for a receipt
 */
export function getNFTPurchaseStatus(receiptId: string): Task | null {
  const tasks = Array.from(taskQueue.values())
    .filter(task => task.receiptId === receiptId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  return tasks.length > 0 ? tasks[0] : null;
}

export default {
  createTask,
  createNFTPurchaseTask,
  getTaskById,
  getTasksByWallet,
  getNFTPurchaseStatus,
  updateTaskStatus
};
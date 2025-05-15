/**
 * Task Queue API Routes
 * 
 * Provides endpoints for checking status of background tasks like NFT purchases
 */

import express, { Request, Response } from 'express';
import { getTaskById, getTasksByWallet, getNFTPurchaseStatus } from '../services/taskQueue';

const router = express.Router();

// Get task by ID
router.get('/tasks/:taskId', (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'Task ID is required'
      });
    }
    
    const task = getTaskById(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      task
    });
  } catch (error: any) {
    console.error('Error retrieving task:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve task',
      error: error.message || 'Unknown error'
    });
  }
});

// Get tasks by wallet address
router.get('/tasks/wallet/:walletAddress', (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: 'Wallet address is required'
      });
    }
    
    const tasks = getTasksByWallet(walletAddress);
    
    return res.status(200).json({
      success: true,
      tasks
    });
  } catch (error: any) {
    console.error('Error retrieving tasks for wallet:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks for wallet',
      error: error.message || 'Unknown error'
    });
  }
});

// Get task by receipt ID
router.get('/tasks/receipt/:receiptId', (req: Request, res: Response) => {
  try {
    const { receiptId } = req.params;
    
    if (!receiptId) {
      return res.status(400).json({
        success: false,
        message: 'Receipt ID is required'
      });
    }
    
    const task = getNFTPurchaseStatus(receiptId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'No task found for this receipt'
      });
    }
    
    return res.status(200).json({
      success: true,
      task
    });
  } catch (error: any) {
    console.error('Error retrieving task for receipt:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve task for receipt',
      error: error.message || 'Unknown error'
    });
  }
});

export default router;
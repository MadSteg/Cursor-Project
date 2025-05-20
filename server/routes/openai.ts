import express from 'express';
import { openaiService } from '../services/openaiService';
import { logger } from '../utils/logger';

const router = express.Router();

// Initialize the OpenAI service on route import
const isInitialized = openaiService.initialize();

// Track progress
router.post('/track-progress', async (req, res) => {
  try {
    const { task, status, details } = req.body;
    
    if (!task || !status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: task and status are required' 
      });
    }
    
    if (!['completed', 'in-progress', 'planned'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Status must be one of: completed, in-progress, planned' 
      });
    }
    
    openaiService.trackProgress(task, status, details);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Progress tracked successfully' 
    });
  } catch (error) {
    logger.error(`Error tracking progress: ${error}`);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to track progress',
      error: (error as Error).message 
    });
  }
});

// Track feedback
router.post('/track-feedback', async (req, res) => {
  try {
    const { type, message, context } = req.body;
    
    if (!type || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: type and message are required' 
      });
    }
    
    if (!['error', 'suggestion', 'feedback'].includes(type)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Type must be one of: error, suggestion, feedback' 
      });
    }
    
    openaiService.trackFeedback(type, message, context);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Feedback tracked successfully' 
    });
  } catch (error) {
    logger.error(`Error tracking feedback: ${error}`);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to track feedback',
      error: (error as Error).message 
    });
  }
});

// Sync with OpenAI to get AI feedback
router.post('/sync', async (req, res) => {
  try {
    if (!isInitialized) {
      return res.status(503).json({
        success: false,
        message: 'OpenAI service is not initialized. Check if the API key is present.'
      });
    }
    
    const feedback = await openaiService.syncWithOpenAI();
    
    if (!feedback) {
      return res.status(500).json({
        success: false,
        message: 'Failed to sync with OpenAI'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    logger.error(`Error syncing with OpenAI: ${error}`);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to sync with OpenAI',
      error: (error as Error).message 
    });
  }
});

// Get current project state
router.get('/state', (req, res) => {
  try {
    const state = openaiService.getProjectState();
    return res.status(200).json({
      success: true,
      data: state
    });
  } catch (error) {
    logger.error(`Error getting project state: ${error}`);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to get project state',
      error: (error as Error).message 
    });
  }
});

// Get tracked progress
router.get('/progress', (req, res) => {
  try {
    const progress = openaiService.getTrackedProgress();
    return res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    logger.error(`Error getting tracked progress: ${error}`);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to get tracked progress',
      error: (error as Error).message 
    });
  }
});

// Get tracked feedback
router.get('/feedback', (req, res) => {
  try {
    const feedback = openaiService.getTrackedFeedback();
    return res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    logger.error(`Error getting tracked feedback: ${error}`);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to get tracked feedback',
      error: (error as Error).message 
    });
  }
});

// Clear tracked data
router.delete('/clear', (req, res) => {
  try {
    openaiService.clearTrackedData();
    return res.status(200).json({
      success: true,
      message: 'Cleared all tracked data'
    });
  } catch (error) {
    logger.error(`Error clearing tracked data: ${error}`);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to clear tracked data',
      error: (error as Error).message 
    });
  }
});

export default router;
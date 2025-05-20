import express from 'express';
import openaiService from '../services/openaiService';

const router = express.Router();

// Check if the OpenAI API key is set
if (!process.env.OPENAI_API_KEY) {
  console.warn('[OpenAI] Warning: OPENAI_API_KEY environment variable is not set.');
}

/**
 * Get project state
 * GET /api/openai/state
 */
router.get('/state', async (req, res) => {
  try {
    const state = await openaiService.getProjectState();
    res.json({ success: true, data: state });
  } catch (error) {
    console.error('[OpenAI] Error getting project state:', error);
    res.status(500).json({ success: false, message: 'Failed to get project state' });
  }
});

/**
 * Track project progress
 * POST /api/openai/track-progress
 */
router.post('/track-progress', async (req, res) => {
  try {
    const { task, status, details } = req.body;
    
    if (!task || !status) {
      return res.status(400).json({ success: false, message: 'Task and status are required' });
    }
    
    if (!['planned', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be one of: planned, in-progress, completed' });
    }
    
    const progressItem = await openaiService.trackProgress({
      task,
      status: status as 'planned' | 'in-progress' | 'completed',
      details
    });
    
    res.json({ success: true, data: progressItem });
  } catch (error) {
    console.error('[OpenAI] Error tracking progress:', error);
    res.status(500).json({ success: false, message: 'Failed to track progress' });
  }
});

/**
 * Track project feedback
 * POST /api/openai/track-feedback
 */
router.post('/track-feedback', async (req, res) => {
  try {
    const { type, message, context } = req.body;
    
    if (!type || !message) {
      return res.status(400).json({ success: false, message: 'Type and message are required' });
    }
    
    if (!['error', 'suggestion', 'feedback'].includes(type)) {
      return res.status(400).json({ success: false, message: 'Type must be one of: error, suggestion, feedback' });
    }
    
    const feedbackItem = await openaiService.trackFeedback({
      type: type as 'error' | 'suggestion' | 'feedback',
      message,
      context
    });
    
    res.json({ success: true, data: feedbackItem });
  } catch (error) {
    console.error('[OpenAI] Error tracking feedback:', error);
    res.status(500).json({ success: false, message: 'Failed to track feedback' });
  }
});

/**
 * Sync with OpenAI to get feedback
 * POST /api/openai/sync
 */
router.post('/sync', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({ 
        success: false, 
        message: 'OpenAI API key is not set. Please set the OPENAI_API_KEY environment variable.'
      });
    }
    
    const aiResponse = await openaiService.syncWithOpenAI();
    res.json({ success: true, data: aiResponse });
  } catch (error) {
    console.error('[OpenAI] Error syncing with OpenAI:', error);
    res.status(500).json({ success: false, message: 'Failed to sync with OpenAI' });
  }
});

/**
 * Clear all tracked data
 * DELETE /api/openai/clear
 */
router.delete('/clear', async (req, res) => {
  try {
    await openaiService.clearTrackedData();
    res.json({ success: true, message: 'All tracked data cleared successfully' });
  } catch (error) {
    console.error('[OpenAI] Error clearing tracked data:', error);
    res.status(500).json({ success: false, message: 'Failed to clear tracked data' });
  }
});

/**
 * Initialize status endpoint
 * GET /api/openai/status
 */
router.get('/status', async (req, res) => {
  try {
    // Check if OpenAI API key is set
    const isConfigured = !!process.env.OPENAI_API_KEY;
    res.json({ 
      success: true, 
      data: { 
        configured: isConfigured,
        message: isConfigured 
          ? 'OpenAI integration is configured and active' 
          : 'OpenAI integration is not fully configured. Please set the OPENAI_API_KEY environment variable.'
      } 
    });
  } catch (error) {
    console.error('[OpenAI] Error checking status:', error);
    res.status(500).json({ success: false, message: 'Failed to check OpenAI integration status' });
  }
});

export default router;
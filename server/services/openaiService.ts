import OpenAI from 'openai';
import { logger } from '../utils/logger';

// Store the OpenAI instance globally
let openai: OpenAI | null = null;

// Track project progress
interface ProgressItem {
  timestamp: string;
  task: string;
  status: 'completed' | 'in-progress' | 'planned';
  details?: string;
}

// Track errors and feedback
interface FeedbackItem {
  timestamp: string;
  type: 'error' | 'suggestion' | 'feedback';
  message: string;
  context?: string;
}

// Main tracking state
const projectState = {
  progress: [] as ProgressItem[],
  feedback: [] as FeedbackItem[],
  lastSyncTime: null as Date | null,
};

/**
 * Initialize the OpenAI service
 */
export function initializeOpenAIService(): boolean {
  try {
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      logger.warn('[OpenAI] No API key found. OpenAI integration disabled.');
      return false;
    }

    // Create OpenAI client
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    logger.info('[OpenAI] Service initialized successfully.');
    return true;
  } catch (error) {
    logger.error(`[OpenAI] Failed to initialize service: ${error}`);
    return false;
  }
}

/**
 * Track project progress
 */
export function trackProgress(task: string, status: 'completed' | 'in-progress' | 'planned', details?: string): void {
  if (!openai) {
    // Don't report anything if OpenAI is not initialized
    return;
  }

  const progressItem: ProgressItem = {
    timestamp: new Date().toISOString(),
    task,
    status,
    details,
  };

  projectState.progress.push(progressItem);
  logger.info(`[OpenAI] Tracked progress: ${task} (${status})`);
}

/**
 * Track feedback or errors
 */
export function trackFeedback(type: 'error' | 'suggestion' | 'feedback', message: string, context?: string): void {
  if (!openai) {
    // Don't report anything if OpenAI is not initialized
    return;
  }

  const feedbackItem: FeedbackItem = {
    timestamp: new Date().toISOString(),
    type,
    message,
    context,
  };

  projectState.feedback.push(feedbackItem);
  logger.info(`[OpenAI] Tracked ${type}: ${message}`);
}

/**
 * Sync project state with OpenAI to get feedback and suggestions
 */
export async function syncWithOpenAI(): Promise<{
  feedback: string;
  suggestions: string[];
  nextSteps: string[];
} | null> {
  if (!openai) {
    logger.warn('[OpenAI] Cannot sync with OpenAI: Service not initialized');
    return null;
  }

  try {
    // Format the project state as a structured message
    const projectStateText = JSON.stringify(projectState, null, 2);
    
    // Create system message that explains the project context
    const systemMessage = `You are analyzing the progress of BlockReceipt.ai, a blockchain-powered digital receipt platform. 
    The platform transforms financial transactions into secure, interactive, and privacy-preserving experiences using 
    blockchain technology, OCR processing, and Threshold Network's TACo PRE for access control.
    
    Provide concise feedback on progress, specific suggestions for improvement, and recommended next steps.`;

    const userMessage = `Here is the current project state:\n${projectStateText}\n\nPlease analyze this data and provide:
    1. Brief feedback on current progress
    2. 1-3 specific suggestions for improvement 
    3. 1-3 recommended next steps in priority order`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    // Parse the response
    const responseText = response.choices[0].message.content;
    if (!responseText) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse the JSON response
    const parsedResponse = JSON.parse(responseText);
    
    // Update the last sync time
    projectState.lastSyncTime = new Date();
    
    // Return the feedback, suggestions, and next steps
    return {
      feedback: parsedResponse.feedback || 'No feedback provided',
      suggestions: parsedResponse.suggestions || [],
      nextSteps: parsedResponse.nextSteps || []
    };
  } catch (error) {
    logger.error(`[OpenAI] Error syncing with OpenAI: ${error}`);
    return null;
  }
}

/**
 * Get all tracked progress
 */
export function getTrackedProgress(): ProgressItem[] {
  return [...projectState.progress];
}

/**
 * Get all tracked feedback
 */
export function getTrackedFeedback(): FeedbackItem[] {
  return [...projectState.feedback];
}

/**
 * Get the full project state
 */
export function getProjectState() {
  return {
    ...projectState,
    lastSyncTime: projectState.lastSyncTime?.toISOString() || null,
  };
}

// Clear all tracked data
export function clearTrackedData(): void {
  projectState.progress = [];
  projectState.feedback = [];
  projectState.lastSyncTime = null;
  logger.info('[OpenAI] Cleared all tracked data');
}

// Export the service
export const openaiService = {
  initialize: initializeOpenAIService,
  trackProgress,
  trackFeedback,
  syncWithOpenAI,
  getTrackedProgress,
  getTrackedFeedback,
  getProjectState,
  clearTrackedData,
};
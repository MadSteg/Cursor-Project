import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define data storage paths
const DATA_DIR = path.join(process.cwd(), 'data');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');
const STATE_FILE = path.join(DATA_DIR, 'state.json');

// Data types
export interface ProgressItem {
  timestamp: string;
  task: string;
  status: 'completed' | 'in-progress' | 'planned';
  details?: string;
}

export interface FeedbackItem {
  timestamp: string;
  type: 'error' | 'suggestion' | 'feedback';
  message: string;
  context?: string;
}

export interface AIFeedback {
  feedback: string;
  suggestions: string[];
  nextSteps: string[];
}

interface ProjectState {
  progress: ProgressItem[];
  feedback: FeedbackItem[];
  lastSyncTime: string | null;
}

/**
 * Ensure the data directory exists
 */
async function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      await mkdir(DATA_DIR, { recursive: true });
    }
  } catch (error) {
    console.error('[OpenAI] Failed to create data directory:', error);
    throw error;
  }
}

/**
 * Initialize the project state files if they don't exist
 */
async function initializeFiles() {
  try {
    await ensureDataDir();
    
    // Initialize progress file if it doesn't exist
    if (!fs.existsSync(PROGRESS_FILE)) {
      await writeFile(PROGRESS_FILE, JSON.stringify([], null, 2));
    }
    
    // Initialize feedback file if it doesn't exist
    if (!fs.existsSync(FEEDBACK_FILE)) {
      await writeFile(FEEDBACK_FILE, JSON.stringify([], null, 2));
    }
    
    // Initialize state file if it doesn't exist
    if (!fs.existsSync(STATE_FILE)) {
      const initialState: ProjectState = {
        progress: [],
        feedback: [],
        lastSyncTime: null
      };
      await writeFile(STATE_FILE, JSON.stringify(initialState, null, 2));
    }
  } catch (error) {
    console.error('[OpenAI] Failed to initialize files:', error);
    throw error;
  }
}

/**
 * Track project progress
 */
export async function trackProgress(progressItem: Omit<ProgressItem, 'timestamp'>): Promise<ProgressItem> {
  try {
    await ensureDataDir();
    
    // Read existing progress
    let progress: ProgressItem[] = [];
    if (fs.existsSync(PROGRESS_FILE)) {
      const content = await readFile(PROGRESS_FILE, 'utf-8');
      progress = JSON.parse(content);
    }
    
    // Add new progress item
    const newItem: ProgressItem = {
      ...progressItem,
      timestamp: new Date().toISOString()
    };
    
    progress.push(newItem);
    
    // Write updated progress
    await writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2));
    
    // Update state
    await updateState();
    
    return newItem;
  } catch (error) {
    console.error('[OpenAI] Failed to track progress:', error);
    throw error;
  }
}

/**
 * Track project feedback
 */
export async function trackFeedback(feedbackItem: Omit<FeedbackItem, 'timestamp'>): Promise<FeedbackItem> {
  try {
    await ensureDataDir();
    
    // Read existing feedback
    let feedback: FeedbackItem[] = [];
    if (fs.existsSync(FEEDBACK_FILE)) {
      const content = await readFile(FEEDBACK_FILE, 'utf-8');
      feedback = JSON.parse(content);
    }
    
    // Add new feedback item
    const newItem: FeedbackItem = {
      ...feedbackItem,
      timestamp: new Date().toISOString()
    };
    
    feedback.push(newItem);
    
    // Write updated feedback
    await writeFile(FEEDBACK_FILE, JSON.stringify(feedback, null, 2));
    
    // Update state
    await updateState();
    
    return newItem;
  } catch (error) {
    console.error('[OpenAI] Failed to track feedback:', error);
    throw error;
  }
}

/**
 * Update the project state
 */
async function updateState(): Promise<ProjectState> {
  try {
    await ensureDataDir();
    
    // Read progress
    let progress: ProgressItem[] = [];
    if (fs.existsSync(PROGRESS_FILE)) {
      const content = await readFile(PROGRESS_FILE, 'utf-8');
      progress = JSON.parse(content);
    }
    
    // Read feedback
    let feedback: FeedbackItem[] = [];
    if (fs.existsSync(FEEDBACK_FILE)) {
      const content = await readFile(FEEDBACK_FILE, 'utf-8');
      feedback = JSON.parse(content);
    }
    
    // Create state
    const state: ProjectState = {
      progress,
      feedback,
      lastSyncTime: fs.existsSync(STATE_FILE) 
        ? JSON.parse(await readFile(STATE_FILE, 'utf-8')).lastSyncTime 
        : null
    };
    
    // Write state
    await writeFile(STATE_FILE, JSON.stringify(state, null, 2));
    
    return state;
  } catch (error) {
    console.error('[OpenAI] Failed to update state:', error);
    throw error;
  }
}

/**
 * Get the current project state
 */
export async function getProjectState(): Promise<ProjectState> {
  try {
    await ensureDataDir();
    
    if (!fs.existsSync(STATE_FILE)) {
      await updateState();
    }
    
    const content = await readFile(STATE_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('[OpenAI] Failed to get project state:', error);
    throw error;
  }
}

/**
 * Clear all tracked data
 */
export async function clearTrackedData(): Promise<void> {
  try {
    await ensureDataDir();
    
    // Clear progress
    await writeFile(PROGRESS_FILE, JSON.stringify([], null, 2));
    
    // Clear feedback
    await writeFile(FEEDBACK_FILE, JSON.stringify([], null, 2));
    
    // Update state
    const state: ProjectState = {
      progress: [],
      feedback: [],
      lastSyncTime: null
    };
    
    await writeFile(STATE_FILE, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error('[OpenAI] Failed to clear tracked data:', error);
    throw error;
  }
}

/**
 * Sync with OpenAI to get feedback
 */
export async function syncWithOpenAI(): Promise<AIFeedback> {
  try {
    // Get project state
    const state = await getProjectState();
    
    // Prepare the prompt
    const prompt = generatePrompt(state);
    
    // Call OpenAI API
    // The newest OpenAI model is "gpt-4o" which was released May 13, 2024
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert software development assistant helping analyze project progress and providing feedback. You should analyze progress data and feedback to give insights on the project status, suggest improvements, and recommend next steps."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    const content = response.choices[0].message.content;
    const aiResponse = JSON.parse(content) as AIFeedback;
    
    // Update last sync time
    const updatedState: ProjectState = {
      ...state,
      lastSyncTime: new Date().toISOString()
    };
    
    await writeFile(STATE_FILE, JSON.stringify(updatedState, null, 2));
    
    return aiResponse;
  } catch (error) {
    console.error('[OpenAI] Failed to sync with OpenAI:', error);
    throw error;
  }
}

/**
 * Generate a prompt for OpenAI based on the project state
 */
function generatePrompt(state: ProjectState): string {
  const progressData = state.progress
    .map(item => `- ${item.timestamp} [${item.status}] ${item.task}${item.details ? `: ${item.details}` : ''}`)
    .join('\n');
  
  const feedbackData = state.feedback
    .map(item => `- ${item.timestamp} [${item.type}] ${item.message}${item.context ? ` (Context: ${item.context})` : ''}`)
    .join('\n');
  
  return `
Please analyze the following project data and provide feedback in JSON format with three sections: 
1. A general feedback summary analyzing the current state 
2. Specific suggestions for improvement
3. Recommended next steps in priority order

Progress Data:
${progressData || 'No progress data available.'}

Feedback Data:
${feedbackData || 'No feedback data available.'}

Context:
BlockReceipt.ai is a blockchain-based digital receipt platform that transforms financial transactions into secure, interactive NFTs, and preserves privacy using Threshold encryption.

Respond in this exact JSON format:
{
  "feedback": "Your overall analysis of project progress and status",
  "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "nextSteps": ["Step 1", "Step 2", "Step 3", "Step 4"]
}
  `.trim();
}

// Initialize on module load
(async () => {
  try {
    await initializeFiles();
    console.log('[2025-05-20T01:50:04.406Z] [INFO] [OpenAI] Service initialized successfully.');
  } catch (error) {
    console.error('[OpenAI] Initialization failed:', error);
  }
})();

export default {
  trackProgress,
  trackFeedback,
  getProjectState,
  clearTrackedData,
  syncWithOpenAI
};
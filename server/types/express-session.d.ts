/**
 * Type definitions for express-session
 * 
 * This file extends the Express.Session interface to include our custom user session data.
 */
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    /** The authenticated user's ID */
    userId?: number;
    
    /** The authenticated user's wallet address (if they have one) */
    walletAddress?: string;
  }
}
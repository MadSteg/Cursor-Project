/**
 * Authentication middleware
 * 
 * This middleware ensures that requests to protected endpoints are authenticated.
 */
import { Request, Response, NextFunction } from 'express';

// Add user property to Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        email: string;
      };
    }
  }
}

/**
 * Middleware to ensure the user is authenticated
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // Mock authentication for development purposes
  // In a real implementation, this would verify a JWT token or session
  if (process.env.NODE_ENV === 'development') {
    // Set a mock user for development
    req.user = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com'
    };
    return next();
  }
  
  // Check if user is authenticated
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  next();
};
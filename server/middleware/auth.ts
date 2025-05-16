/**
 * Authentication Middleware for BlockReceipt.ai
 * 
 * Provides authentication and authorization checks for protected routes.
 */

import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

/**
 * Middleware to require authentication for protected routes
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  // For development purposes, we'll allow authentication to be bypassed
  // This should be removed in production
  const bypassAuth = process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true';
  
  if (bypassAuth) {
    logger.warn('Authentication bypassed in development mode');
    // Set a default user for development
    if (!req.session) {
      req.session = {} as any;
    }
    req.session.userId = 1;
    return next();
  }
  
  // Check if user is authenticated
  if (!req.session || !req.session.userId) {
    logger.warn('Unauthorized access attempt');
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'You must be logged in to access this resource'
    });
  }
  
  // User is authenticated
  next();
}

/**
 * Middleware to require wallet connection for blockchain operations
 */
export function requireWallet(req: Request, res: Response, next: NextFunction): void {
  // First, ensure the user is authenticated
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'You must be logged in to access this resource'
    });
  }
  
  // Then, check if wallet is connected
  if (!req.session.walletAddress) {
    return res.status(403).json({
      error: 'Wallet Required',
      message: 'You must connect a wallet to perform this action'
    });
  }
  
  // Wallet is connected
  next();
}

/**
 * Middleware to check if a user has admin privileges
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  // First, ensure the user is authenticated
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'You must be logged in to access this resource'
    });
  }
  
  // Check if user has admin role
  // This would normally check a database or similar
  const isAdmin = req.session.userRole === 'admin';
  
  if (!isAdmin) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin privileges required for this resource'
    });
  }
  
  // User is an admin
  next();
}

/**
 * Get the current user ID from the session
 */
export function getCurrentUserId(req: Request): number | null {
  return req.session?.userId || null;
}

/**
 * Get the current wallet address from the session
 */
export function getCurrentWalletAddress(req: Request): string | null {
  return req.session?.walletAddress || null;
}
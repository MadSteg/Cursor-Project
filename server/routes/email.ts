/**
 * Email Scanning API Routes
 * 
 * This file defines the API routes for configuring email connections
 * and scanning emails for receipts and order confirmations.
 */

import { Request, Response, Router } from "express";
import { z } from "zod";
import { getEmailScanningService } from "../services/emailScanningService";
import { storage } from "../storage";

const router = Router();

// Schema for email connection configuration
const emailConnectionSchema = z.object({
  provider: z.enum(['gmail', 'outlook', 'yahoo', 'imap']),
  credentials: z.object({
    email: z.string().email(),
    accessToken: z.string().optional(),
    refreshToken: z.string().optional(),
    imapHost: z.string().optional(),
    imapPort: z.number().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
  }),
  syncFrequency: z.enum(['manual', 'daily', 'hourly']),
  folders: z.array(z.string()).default(['INBOX']),
});

/**
 * GET /api/email/connections
 * Get all email connections for the current user
 */
router.get("/connections", async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const emailService = getEmailScanningService(storage);
    const connections = await emailService.getUserEmailConnections(req.session.userId);
    
    // Don't return sensitive credential information
    const sanitizedConnections = connections.map(conn => ({
      ...conn,
      credentials: {
        email: conn.credentials.email
      }
    }));
    
    res.json(sanitizedConnections);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

/**
 * POST /api/email/connections
 * Configure a new email connection
 */
router.post("/connections", async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const validation = emailConnectionSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.format() });
    }

    const emailService = getEmailScanningService(storage);
    const config = {
      userId: req.session.userId,
      ...validation.data,
    };
    
    const success = await emailService.configureEmailConnection(config);
    
    if (success) {
      res.status(201).json({ message: "Email connection configured successfully" });
    } else {
      res.status(400).json({ error: "Failed to configure email connection" });
    }
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

/**
 * DELETE /api/email/connections/:email
 * Remove an email connection
 */
router.delete("/connections/:email", async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const emailService = getEmailScanningService(storage);
    const email = decodeURIComponent(req.params.email);
    const success = await emailService.removeEmailConnection(req.session.userId, email);
    
    if (success) {
      res.json({ message: "Email connection removed successfully" });
    } else {
      res.status(404).json({ error: "Email connection not found" });
    }
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

/**
 * POST /api/email/scan
 * Trigger a manual scan of configured email accounts
 */
router.post("/scan", async (req: Request, res: Response) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const emailService = getEmailScanningService(storage);
    const result = await emailService.scanEmails(req.session.userId);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

export default router;
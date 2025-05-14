import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import blockchainRoutes from "./routes/blockchain-updated";
import emailRoutes from "./routes/email";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes
  // All routes are prefixed with /api
  
  // Register blockchain routes
  app.use('/api/blockchain', blockchainRoutes);
  
  // Register email scanning routes
  app.use('/api/email', emailRoutes);
  


  // Get categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get merchants
  app.get("/api/merchants", async (req, res) => {
    try {
      const merchants = await storage.getMerchants();
      res.json(merchants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch merchants" });
    }
  });

  // Get all receipts for a user
  app.get("/api/receipts", async (req, res) => {
    try {
      // For demo purposes, always use user ID 1
      const userId = 1;
      const receipts = await storage.getReceipts(userId);
      res.json(receipts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch receipts" });
    }
  });

  // Get recent receipts with limit
  app.get("/api/receipts/recent", async (req, res) => {
    try {
      // For demo purposes, always use user ID 1
      const userId = 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const receipts = await storage.getRecentReceipts(userId, limit);
      res.json(receipts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent receipts" });
    }
  });

  // Get full receipt by ID
  app.get("/api/receipts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const receipt = await storage.getFullReceipt(id);
      
      if (!receipt) {
        return res.status(404).json({ message: "Receipt not found" });
      }
      
      res.json(receipt);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch receipt" });
    }
  });

  // Create new receipt
  app.post("/api/receipts", async (req, res) => {
    try {
      // For demo purposes, always use user ID 1
      const userId = 1;
      const { merchantId, categoryId, date, subtotal, tax, total, items } = req.body;
      
      // Create receipt
      const receipt = await storage.createReceipt({
        userId,
        merchantId,
        categoryId,
        date: new Date(date),
        subtotal,
        tax,
        total,
        blockchainTxHash: undefined,
        blockchainVerified: false,
        blockNumber: undefined,
        nftTokenId: undefined
      });
      
      // Add items
      if (items && Array.isArray(items)) {
        for (const item of items) {
          await storage.createReceiptItem({
            receiptId: receipt.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity || 1
          });
        }
      }
      
      // Update spending stats
      await storage.createOrUpdateSpendingStat({
        userId,
        month: new Date(date).getMonth() + 1, // JavaScript months are 0-indexed
        year: new Date(date).getFullYear(),
        categoryId,
        amount: total
      });
      
      // Simulate blockchain processing
      setTimeout(async () => {
        // Generate fake blockchain data
        const txHash = `0x${Math.random().toString(16).substring(2, 42)}`;
        const blockNumber = Math.floor(14000000 + Math.random() * 1000000);
        const nftTokenId = `NFT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Update receipt with blockchain data
        await storage.updateReceipt(receipt.id, {
          blockchainTxHash: txHash,
          blockchainVerified: true,
          blockNumber,
          nftTokenId
        });
      }, 3000);
      
      res.status(201).json(receipt);
    } catch (error) {
      res.status(500).json({ message: "Failed to create receipt" });
    }
  });

  // Get spending stats by month and year
  app.get("/api/stats/:year/:month", async (req, res) => {
    try {
      // For demo purposes, always use user ID 1
      const userId = 1;
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
      
      const stats = await storage.getSpendingStatsByMonth(userId, month, year);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch spending stats" });
    }
  });

  // Get category breakdown for a month and year
  app.get("/api/stats/:year/:month/breakdown", async (req, res) => {
    try {
      // For demo purposes, always use user ID 1
      const userId = 1;
      const year = parseInt(req.params.year);
      const month = parseInt(req.params.month);
      
      const breakdown = await storage.getCategoryBreakdown(userId, month, year);
      res.json(breakdown);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category breakdown" });
    }
  });

  // Get monthly spending for a year
  app.get("/api/stats/:year/monthly", async (req, res) => {
    try {
      // For demo purposes, always use user ID 1
      const userId = 1;
      const year = parseInt(req.params.year);
      
      const monthlySpending = await storage.getMonthlySpending(userId, year);
      res.json(monthlySpending);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch monthly spending" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}

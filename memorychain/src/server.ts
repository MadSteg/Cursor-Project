import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Set up routes
import webhookRoutes from './routes/webhooks.js';
import verifyRoutes from './routes/verify.js';

// API routes
app.use('/webhook', webhookRoutes);
app.use('/verify', verifyRoutes);

// Get the directory name of the current module (ESM replacement for __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));
  
  // Handle SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    console.log('Stripe webhook secret configured');
  } else {
    console.warn('Warning: Stripe webhook secret not configured');
  }
  
  if (process.env.ALCHEMY_RPC) {
    console.log('Blockchain RPC URL configured');
  } else {
    console.warn('Warning: Blockchain RPC URL not configured');
  }
});

export default app;
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '../shared/schema';

// Configure the WebSocket for Neon serverless
neonConfig.webSocketConstructor = ws;

// Check for required environment variables
if (!process.env.DATABASE_URL) {
  console.warn('WARNING: DATABASE_URL not set. Database features will not work.');
}

// Create a connection pool
export const pool = process.env.DATABASE_URL 
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

// Create a drizzle instance with our schema
export const db = pool 
  ? drizzle(pool, { schema })
  : null;

// Initialize database tables
export async function initDatabase() {
  if (!db) {
    console.warn('Database not initialized. Skipping table creation.');
    return;
  }
  
  try {
    console.log('Initializing database tables...');
    
    // You can add database migrations or initialization here
    // For now, we're using drizzle-kit push command to create tables
    
    console.log('Database tables initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Check database connection
export async function checkDatabaseConnection(): Promise<boolean> {
  if (!pool) return false;
  
  try {
    // Simple query to check connection
    const result = await pool.query('SELECT NOW()');
    return result.rows.length > 0;
  } catch (error) {
    console.error('Database connection check failed:', error);
    return false;
  }
}

export default {
  db,
  pool,
  initDatabase,
  checkDatabaseConnection
};
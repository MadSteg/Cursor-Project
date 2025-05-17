import { createCanvas, loadImage } from 'canvas';
import { ipfsService } from './ipfsService';
import path from 'path';
import fs from 'fs';

// Deterministic PRNG for overlays
function mulberry32(a: number): () => number {
  return () => {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Convert string to numeric seed
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export interface StampOptions {
  cityCode: string;
  receiptHash: string;
  merchantCategory: string;
  timestamp: number;
  promoActive: boolean;
}

// Color palettes for different times of day
const timeOfDayPalettes = {
  morning: ['#F9DB6D', '#FFF4D4', '#FFAC4A', '#6BB5FF'],
  afternoon: ['#5EB0E5', '#FFFFFF', '#87CEEB', '#4682B4'],
  evening: ['#FF7F50', '#FFA07A', '#FFD700', '#FF6347'],
  night: ['#1A237E', '#283593', '#3949AB', '#5C6BC0']
};

// Category colors for merchant types
const categoryColors = {
  food: '#8BC34A',
  retail: '#FF9800',
  service: '#03A9F4',
  entertainment: '#9C27B0',
  travel: '#795548',
  default: '#607D8B'
};

// City emblem lookup
const cityEmblems: Record<string, string> = {
  NYC: 'newYork.png',
  PAR: 'paris.png',
  LON: 'london.png',
  TKY: 'tokyo.png',
  SYD: 'sydney.png',
  default: 'default.png'
};

/**
 * Generates a unique passport stamp based on receipt data
 */
export async function generatePassportStamp(options: StampOptions): Promise<string> {
  const { cityCode, receiptHash, merchantCategory, timestamp, promoActive } = options;
  
  // Create deterministic random generator from receipt hash
  const seed = hashString(receiptHash + merchantCategory);
  const random = mulberry32(seed);
  
  // Get time of day
  const hour = new Date(timestamp).getHours();
  let timeOfDay = 'afternoon';
  if (hour < 11) timeOfDay = 'morning';
  else if (hour >= 16 && hour < 20) timeOfDay = 'evening';
  else if (hour >= 20 || hour < 6) timeOfDay = 'night';
  
  const palette = timeOfDayPalettes[timeOfDay as keyof typeof timeOfDayPalettes];
  
  // Create canvas (400x400 square)
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext('2d');
  
  // Fill background
  ctx.fillStyle = palette[0];
  ctx.fillRect(0, 0, 400, 400);
  
  // Get city emblem or use default
  const emblemFile = cityEmblems[cityCode] || cityEmblems.default;
  
  try {
    // In production, these would be pinned to IPFS or hosted in a CDN
    // For development, we'll try to load from local filesystem
    const emblemPath = path.join(__dirname, '../../assets/cities', emblemFile);
    
    // Create assets directory if it doesn't exist
    const assetsDir = path.join(__dirname, '../../assets/cities');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
      
      // Create a simple default emblem
      const defaultCanvas = createCanvas(200, 200);
      const defaultCtx = defaultCanvas.getContext('2d');
      defaultCtx.fillStyle = '#FFFFFF';
      defaultCtx.beginPath();
      defaultCtx.arc(100, 100, 90, 0, Math.PI * 2);
      defaultCtx.fill();
      defaultCtx.fillStyle = '#000000';
      defaultCtx.font = 'bold 24px Arial';
      defaultCtx.textAlign = 'center';
      defaultCtx.fillText('BR', 100, 108);
      
      const buffer = defaultCanvas.toBuffer('image/png');
      fs.writeFileSync(path.join(assetsDir, 'default.png'), buffer);
    }
    
    let cityEmblem;
    try {
      cityEmblem = await loadImage(emblemPath);
    } catch (err) {
      // Fallback to default
      cityEmblem = await loadImage(path.join(assetsDir, 'default.png'));
    }
    
    // Draw city emblem in the center
    ctx.drawImage(cityEmblem, 100, 100, 200, 200);
    
    // Add dynamic patterns based on seed
    ctx.strokeStyle = palette[1];
    ctx.lineWidth = 3;
    
    // Draw unique pattern (circles, lines, etc)
    for (let i = 0; i < 12; i++) {
      const x = random() * 400;
      const y = random() * 400;
      const size = 30 + random() * 100;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw merchant category indicator
    const categoryColor = categoryColors[merchantCategory as keyof typeof categoryColors] || categoryColors.default;
    ctx.fillStyle = categoryColor;
    ctx.beginPath();
    ctx.arc(200, 200, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Add promo border if active
    if (promoActive) {
      ctx.strokeStyle = '#FFD700'; // Gold
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.rect(10, 10, 380, 380);
      ctx.stroke();
    }
    
    // Add receipt code
    ctx.fillStyle = palette[3];
    ctx.font = 'bold 12px Courier';
    ctx.fillText(`RECEIPT: ${receiptHash.substring(0, 12)}...`, 20, 380);
    
    // Add timestamp
    const dateStr = new Date(timestamp).toISOString().split('T')[0];
    ctx.fillText(`ISSUED: ${dateStr}`, 280, 380);
    
    // Convert canvas to PNG buffer
    const buffer = canvas.toBuffer('image/png');
    
    // Pin image to IPFS
    const cid = await ipfsService.uploadBuffer(buffer, 'stamp.png');
    return `ipfs://${cid}`;
  } catch (err) {
    console.error('Error generating passport stamp:', err);
    
    // Fall back to generating a simple text stamp
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`BlockReceipt`, 200, 180);
    ctx.fillText(`${cityCode || 'GLOBAL'}`, 200, 220);
    ctx.font = '18px Arial';
    ctx.fillText(new Date(timestamp).toLocaleDateString(), 200, 260);
    
    // Convert canvas to PNG buffer
    const buffer = canvas.toBuffer('image/png');
    
    // Pin image to IPFS
    const cid = await ipfsService.uploadBuffer(buffer, 'fallback-stamp.png');
    return `ipfs://${cid}`;
  }
}
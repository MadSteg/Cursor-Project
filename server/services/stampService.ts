import { createCanvas } from 'canvas';
import { pinFileToIPFS } from './ipfsService';
import crypto from 'crypto';
import { logger } from '../utils/logger';

// Stamp generation constants
const STAMP_SIZE = 400;
const CITIES = {
  // Major cities by region with iconic landmarks
  Americas: ['New York', 'San Francisco', 'Chicago', 'Los Angeles', 'Toronto', 'Mexico City', 'Rio de Janeiro'],
  Europe: ['London', 'Paris', 'Rome', 'Berlin', 'Barcelona', 'Amsterdam', 'Prague'],
  Asia: ['Tokyo', 'Hong Kong', 'Singapore', 'Seoul', 'Shanghai', 'Dubai', 'Bangkok'],
  Africa: ['Cape Town', 'Cairo', 'Marrakech', 'Nairobi', 'Lagos', 'Johannesburg'],
  Oceania: ['Sydney', 'Melbourne', 'Auckland', 'Wellington']
};

// Time of day colors for visually distinct stamps
const TIME_COLORS = {
  morning: {
    primary: '#F9D423',
    secondary: '#FF4E50',
    accent: '#E0C3FC',
    text: '#333333'
  },
  afternoon: {
    primary: '#4CB8C4',
    secondary: '#3CD3AD',
    accent: '#24C6DC',
    text: '#333333'
  },
  evening: {
    primary: '#614385',
    secondary: '#516395',
    accent: '#9D50BB',
    text: '#ffffff'
  },
  night: {
    primary: '#141E30',
    secondary: '#243B55',
    accent: '#5F2C82',
    text: '#ffffff'
  }
};

// Merchant category colors
const CATEGORY_COLORS = {
  food: '#8BC34A',
  retail: '#03A9F4',
  travel: '#FF9800',
  entertainment: '#9C27B0',
  services: '#FFEB3B',
  health: '#E91E63',
  electronics: '#00BCD4',
  default: '#607D8B'
};

interface StampOptions {
  merchantName: string;
  merchantLocation?: string;
  category?: string;
  date: Date;
  total: number;
  isPromotional?: boolean;
  tokenId: string | number;
}

export class StampService {
  /**
   * Generates a unique passport stamp based on receipt details
   */
  async generateStamp(options: StampOptions): Promise<string> {
    try {
      const { 
        merchantName, 
        merchantLocation = this.getRandomCity(), 
        category = 'default',
        date, 
        total, 
        isPromotional = false,
        tokenId
      } = options;

      // Create canvas for the stamp
      const canvas = createCanvas(STAMP_SIZE, STAMP_SIZE);
      const ctx = canvas.getContext('2d');
      
      // Get time of day from date
      const hour = date.getHours();
      const timeOfDay = this.getTimeOfDay(hour);
      const colors = TIME_COLORS[timeOfDay as keyof typeof TIME_COLORS];
      
      // Get color for category
      const categoryColor = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.default;
      
      // Generate a unique pattern based on tokenId
      const pattern = this.generateUniquePattern(tokenId.toString(), colors);
      
      // Draw the stamp
      this.drawStampBackground(ctx, colors);
      this.drawStampBorder(ctx, isPromotional, categoryColor);
      this.drawStampPattern(ctx, pattern);
      this.drawStampInfo(ctx, {
        merchantName,
        locationName: merchantLocation,
        date,
        total,
        timeOfDay,
        colors,
        tokenId: tokenId.toString()
      });
      
      // Convert canvas to buffer
      const buffer = canvas.toBuffer('image/png');
      
      // Upload to IPFS
      const result = await pinFileToIPFS(buffer);
      
      if (!result || !result.IpfsHash) {
        throw new Error('Failed to upload stamp to IPFS');
      }
      
      logger.info(`Generated and uploaded stamp for ${merchantName} with IPFS hash: ${result.IpfsHash}`);
      
      return `ipfs://${result.IpfsHash}`;
    } catch (error) {
      logger.error('Error generating stamp:', error);
      throw error;
    }
  }
  
  /**
   * Get random city for stamp if location not provided
   */
  private getRandomCity(): string {
    const regions = Object.keys(CITIES);
    const randomRegion = regions[Math.floor(Math.random() * regions.length)];
    const cities = CITIES[randomRegion as keyof typeof CITIES];
    return cities[Math.floor(Math.random() * cities.length)];
  }
  
  /**
   * Get time of day based on hour
   */
  private getTimeOfDay(hour: number): string {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }
  
  /**
   * Draw stamp background
   */
  private drawStampBackground(ctx: CanvasRenderingContext2D, colors: any) {
    // Create gradient background
    const gradient = ctx.createRadialGradient(
      STAMP_SIZE / 2, STAMP_SIZE / 2, 0,
      STAMP_SIZE / 2, STAMP_SIZE / 2, STAMP_SIZE / 2
    );
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(0.7, colors.secondary);
    gradient.addColorStop(1, colors.accent);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(STAMP_SIZE / 2, STAMP_SIZE / 2, STAMP_SIZE / 2 - 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Add inner circle
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(STAMP_SIZE / 2, STAMP_SIZE / 2, STAMP_SIZE / 2 - 40, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  /**
   * Draw stamp border (gold for promotional receipts)
   */
  private drawStampBorder(ctx: CanvasRenderingContext2D, isPromotional: boolean, categoryColor: string) {
    ctx.strokeStyle = isPromotional ? '#FFD700' : categoryColor;
    ctx.lineWidth = isPromotional ? 12 : 8;
    ctx.beginPath();
    ctx.arc(STAMP_SIZE / 2, STAMP_SIZE / 2, STAMP_SIZE / 2 - 10, 0, Math.PI * 2);
    ctx.stroke();
    
    // Add decorative elements at cardinal points
    const points = [
      { x: STAMP_SIZE / 2, y: 20 },
      { x: STAMP_SIZE / 2, y: STAMP_SIZE - 20 },
      { x: 20, y: STAMP_SIZE / 2 },
      { x: STAMP_SIZE - 20, y: STAMP_SIZE / 2 }
    ];
    
    points.forEach(point => {
      ctx.fillStyle = isPromotional ? '#FFD700' : categoryColor;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  
  /**
   * Generate a unique pattern based on tokenId
   */
  private generateUniquePattern(tokenId: string, colors: any): Array<{x: number, y: number, size: number}> {
    const hash = crypto.createHash('sha256').update(tokenId).digest('hex');
    const pattern = [];
    
    // Generate a series of points based on hash
    for (let i = 0; i < hash.length; i += 4) {
      const value = parseInt(hash.substring(i, i + 4), 16);
      const x = (value % STAMP_SIZE) * 0.8 + STAMP_SIZE * 0.1;
      const y = ((value >> 8) % STAMP_SIZE) * 0.8 + STAMP_SIZE * 0.1;
      const size = (value % 8) + 2;
      
      pattern.push({ x, y, size });
    }
    
    return pattern;
  }
  
  /**
   * Draw the unique pattern on the stamp
   */
  private drawStampPattern(ctx: CanvasRenderingContext2D, pattern: Array<{x: number, y: number, size: number}>) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    
    pattern.forEach(point => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  
  /**
   * Draw text information on the stamp
   */
  private drawStampInfo(ctx: CanvasRenderingContext2D, info: any) {
    const { merchantName, locationName, date, colors, tokenId } = info;
    
    // Format date
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    // Set text color
    ctx.fillStyle = colors.text;
    ctx.textAlign = 'center';
    
    // Draw merchant name
    ctx.font = 'bold 28px Arial';
    ctx.fillText(this.truncateText(merchantName, 18), STAMP_SIZE / 2, STAMP_SIZE / 2 - 40);
    
    // Draw location
    ctx.font = '24px Arial';
    ctx.fillText(locationName, STAMP_SIZE / 2, STAMP_SIZE / 2);
    
    // Draw date
    ctx.font = '18px Arial';
    ctx.fillText(formattedDate, STAMP_SIZE / 2, STAMP_SIZE / 2 + 30);
    
    // Draw token ID (partially obscured)
    ctx.font = '14px Arial';
    ctx.fillText(`#${tokenId.substring(0, 8)}`, STAMP_SIZE / 2, STAMP_SIZE / 2 + 60);
    
    // Draw "BLOCKRECEIPT" text around the bottom arc
    this.drawArcText(ctx, 'BLOCKRECEIPT', STAMP_SIZE / 2, STAMP_SIZE / 2, STAMP_SIZE / 2 - 25, Math.PI / 2, Math.PI * 3 / 2);
  }
  
  /**
   * Draw text along an arc
   */
  private drawArcText(
    ctx: CanvasRenderingContext2D, 
    text: string, 
    centerX: number, 
    centerY: number, 
    radius: number, 
    startAngle: number, 
    endAngle: number
  ) {
    const textLength = text.length;
    const angleSize = (endAngle - startAngle) / textLength;
    
    ctx.save();
    ctx.font = 'bold 16px Arial';
    
    for (let i = 0; i < textLength; i++) {
      const angle = startAngle + i * angleSize;
      
      ctx.save();
      ctx.translate(
        centerX + Math.cos(angle) * radius,
        centerY + Math.sin(angle) * radius
      );
      ctx.rotate(angle + Math.PI / 2);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
    
    ctx.restore();
  }
  
  /**
   * Truncate text to fit on the stamp
   */
  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
}

export const stampService = new StampService();
/**
 * Multi-Network Blockchain Status API
 * 
 * This file aggregates status information from all configured blockchain networks
 */

import express, { Request, Response } from 'express';
import { blockchainService as mumbaiService } from '../services/blockchainService';
import { blockchainService as amoyService } from '../services/blockchainService-amoy';
import { cryptoPaymentService } from '../services/cryptoPaymentService';

const router = express.Router();

/**
 * GET /api/blockchain/multi-status
 * Get aggregated status from all blockchain networks and crypto payment service
 */
router.get('/multi-status', async (req: Request, res: Response) => {
  try {
    // Get status from Amoy network (Primary)
    const amoyStatus = await amoyService.getNetworkStatus().catch(error => {
      console.error('Error getting Amoy status:', error);
      return {
        status: 'Error',
        network: 'amoy',
        error: error.message,
        mockMode: true
      };
    });
    
    // Get status from Mumbai network (Legacy/Deprecated)
    const mumbaiStatus = await mumbaiService.getNetworkStatus().catch(error => {
      console.error('Error getting Mumbai status:', error);
      return {
        status: 'Deprecated',
        network: 'mumbai',
        error: 'Mumbai network is deprecated, please use Amoy',
        mockMode: true
      };
    });
    
    // Get crypto payment service currencies and availability info
    const cryptoPaymentStatus = await Promise.resolve({
      available: true,
      currencies: cryptoPaymentService.getAvailableCurrencies(),
      providers: cryptoPaymentService.getProviderStatuses ? 
        cryptoPaymentService.getProviderStatuses() : 
        { polygon: { available: true }, ethereum: { available: true } }
    }).catch(error => {
      console.error('Error getting crypto payment status:', error);
      return {
        available: false,
        status: 'Error',
        error: error.message
      };
    });
    
    // Normalize status responses to have consistent format
    const normalizeNetworkStatus = (status: any) => {
      return {
        status: status.mockMode ? 'Mock Mode' : (status.available === false ? 'Error' : 'Connected'),
        network: status.network,
        chainId: status.chainId,
        mockMode: status.mockMode,
        blockHeight: status.blockHeight,
        contractAddress: status.contractAddress,
        availableProviders: status.availableProviders,
        activeProvider: status.activeProvider,
        error: status.error
      };
    };
    
    // Format the response with timestamp
    const response = {
      timestamp: new Date().toISOString(),
      networks: {
        mumbai: normalizeNetworkStatus(mumbaiStatus),
        amoy: normalizeNetworkStatus(amoyStatus)
      },
      cryptoPayment: {
        status: cryptoPaymentStatus.available ? 'Connected' : 'Error',
        availableCurrencies: Array.isArray(cryptoPaymentStatus.currencies) ? 
          cryptoPaymentStatus.currencies : 
          cryptoPaymentStatus.currencies ? Object.keys(cryptoPaymentStatus.currencies) : [],
        error: cryptoPaymentStatus.error
      }
    };
    
    res.json(response);
  } catch (error: any) {
    console.error('Error getting blockchain multi-status:', error);
    
    // Return a partial response even if there's an error
    res.status(200).json({
      timestamp: new Date().toISOString(),
      error: error.message,
      networks: {
        mumbai: { status: 'Error', mockMode: true },
        amoy: { status: 'Error', mockMode: true }
      },
      cryptoPayment: {
        status: 'Error',
        error: 'Failed to retrieve data'
      }
    });
  }
});

export default router;
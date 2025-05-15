/**
 * Hook for managing hot wallets with TACo encryption
 */
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useWeb3Wallet } from './useWeb3Wallet';
import { useToast } from './use-toast';

interface Wallet {
  address: string;
  privateKey: string;
  publicKey?: string;
}

interface UseHotWalletOptions {
  autoGenerate?: boolean;
}

export function useHotWallet(options: UseHotWalletOptions = {}) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const { isConnected, address: connectedAddress } = useWeb3Wallet();
  const { toast } = useToast();

  // Helper function to get the current wallet
  const fetchWallet = async () => {
    try {
      setIsLoading(true);
      
      // In development, return a mock wallet for testing
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock wallet data
        return {
          address: '0xD8c7d4e0D8E44Ec8A78FF65F7a405e6621520E9E',
          privateKey: '0x86de521f02f7e0f456574b1a0d2cc0bf5ee4a2024fe2e064b1e2fd10be6a2b45',
          encrypted: true
        };
      }
      
      const response = await apiRequest('GET', '/api/wallet/current');
      const data = await response.json();
      
      if (data.wallet) {
        return data.wallet;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching wallet:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Load wallet on initial mount
  useEffect(() => {
    const loadWallet = async () => {
      if (isConnected) {
        const walletData = await fetchWallet();
        setWallet(walletData);
        
        // Auto-generate a wallet if requested and none exists
        if (options.autoGenerate && !walletData) {
          generateWallet();
        }
      } else {
        setWallet(null);
        setIsLoading(false);
      }
    };
    
    loadWallet();
  }, [isConnected, options.autoGenerate]);

  // Generate a new hot wallet
  const generateWallet = async () => {
    if (!isConnected) {
      toast({
        title: 'Wallet Connection Required',
        description: 'Please connect your Web3 wallet first',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock new wallet
        const mockWallet = {
          address: '0xD8c7d4e0D8E44Ec8A78FF65F7a405e6621520E9E',
          privateKey: '0x86de521f02f7e0f456574b1a0d2cc0bf5ee4a2024fe2e064b1e2fd10be6a2b45',
          encrypted: true
        };
        
        setWallet(mockWallet);
        return mockWallet;
      }
      
      const response = await apiRequest('POST', '/api/wallet/generate-for-new-user', {
        walletAddress: connectedAddress
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate wallet');
      }
      
      const data = await response.json();
      setWallet(data.wallet);
      return data.wallet;
    } catch (error) {
      console.error('Error generating hot wallet:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // Export wallet to file
  const exportWallet = () => {
    if (!wallet) return;
    
    try {
      const dataStr = JSON.stringify(wallet);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `blockreceiptai-wallet-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: 'Wallet Exported',
        description: 'Your wallet has been exported to a file'
      });
    } catch (error) {
      console.error('Error exporting wallet:', error);
      toast({
        title: 'Export Failed',
        description: 'Could not export wallet',
        variant: 'destructive'
      });
    }
  };

  return {
    wallet,
    isLoading,
    isGenerating,
    generateWallet,
    exportWallet
  };
}
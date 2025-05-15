/**
 * Hook for managing hot wallets with TACo encryption
 */
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';

interface UseHotWalletOptions {
  autoGenerate?: boolean;
}

export function useHotWallet(options: UseHotWalletOptions = {}) {
  const { autoGenerate = false } = options;
  
  const [hotWalletAddress, setHotWalletAddress] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tacoKey, setTacoKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { address: connectedWalletAddress, isConnected } = useWeb3Wallet();
  
  // Check for existing hot wallet on component mount
  useEffect(() => {
    const checkForHotWallet = async () => {
      try {
        // In a real implementation, this would call an API endpoint
        // For now, we'll use local storage as a mock
        const savedWallet = localStorage.getItem('hotWalletAddress');
        const savedTacoKey = localStorage.getItem('tacoPublicKey');
        
        if (savedWallet && savedTacoKey) {
          setHotWalletAddress(savedWallet);
          setTacoKey(savedTacoKey);
        } else if (autoGenerate && !isGenerating) {
          // Auto-generate a wallet if one doesn't exist
          generateWallet();
        }
      } catch (err) {
        console.error('Error checking for hot wallet:', err);
        setError('Failed to check for existing hot wallet');
      }
    };
    
    checkForHotWallet();
  }, [autoGenerate]);
  
  // Generate a new hot wallet
  const generateWallet = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Call the wallet generation API
      const response = await apiRequest('POST', '/api/wallet/generate-for-new-user', {
        userId: 1, // In a real app, this would be the current user's ID
      });
      
      const data = await response.json();
      
      if (data.success) {
        setHotWalletAddress(data.walletAddress);
        setTacoKey(data.tacoKey);
        
        // Store in local storage as a mock persistence layer
        localStorage.setItem('hotWalletAddress', data.walletAddress);
        localStorage.setItem('tacoPublicKey', data.tacoKey);
        
        toast({
          title: 'Hot Wallet Generated',
          description: `Your secure hot wallet has been created: ${data.walletAddress.slice(0, 8)}...${data.walletAddress.slice(-6)}`,
        });
      } else {
        throw new Error(data.error || 'Failed to generate wallet');
      }
    } catch (err: any) {
      console.error('Error generating hot wallet:', err);
      setError(err.message || 'Failed to generate hot wallet');
      
      toast({
        title: 'Wallet Generation Failed',
        description: err.message || 'An error occurred while generating your hot wallet',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Recover a wallet's private key
  const recoverWalletPrivateKey = async (tacoPrivateKey: string) => {
    try {
      setError(null);
      
      // Call the private key recovery API
      const response = await apiRequest('POST', '/api/wallet/recover', {
        recipientPrivateKey: tacoPrivateKey,
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Private Key Recovered',
          description: 'Your wallet private key has been successfully recovered.',
        });
        
        return data.privateKey;
      } else {
        throw new Error(data.error || 'Failed to recover private key');
      }
    } catch (err: any) {
      console.error('Error recovering private key:', err);
      setError(err.message || 'Failed to recover private key');
      
      toast({
        title: 'Recovery Failed',
        description: err.message || 'An error occurred while recovering your private key',
        variant: 'destructive',
      });
      
      return null;
    }
  };
  
  return {
    hotWalletAddress,
    tacoKey,
    isGenerating,
    error,
    generateWallet,
    recoverWalletPrivateKey,
    hasHotWallet: !!hotWalletAddress
  };
}
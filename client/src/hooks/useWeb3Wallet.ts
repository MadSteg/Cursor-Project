import { useEffect, useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface WalletInfo {
  address: string;
  connected: boolean;
  isHotWallet: boolean;
  balance: string | null;
  isCorrectNetwork: boolean;
}

export function useWeb3Wallet() {
  const { active, account, connect, disconnect, isCorrectNetwork, switchToPolygonAmoy } = useWeb3();
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    address: account || '',
    connected: active,
    isHotWallet: false,
    balance: null,
    isCorrectNetwork
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Update wallet info when web3 state changes
  useEffect(() => {
    if (account) {
      setWalletInfo(prev => ({
        ...prev,
        address: account,
        connected: active,
        isCorrectNetwork
      }));
      
      // Check if this is a hot wallet
      checkIfHotWallet(account);
      
      // Fetch the wallet balance
      fetchWalletBalance(account);
    } else {
      setWalletInfo({
        address: '',
        connected: false,
        isHotWallet: false,
        balance: null,
        isCorrectNetwork: false
      });
    }
  }, [account, active, isCorrectNetwork]);

  // Check if the wallet is a hot wallet managed by our app
  async function checkIfHotWallet(address: string) {
    try {
      const response = await apiRequest('GET', `/api/wallet/check-hot-wallet?address=${address}`);
      const data = await response.json();
      
      setWalletInfo(prev => ({
        ...prev,
        isHotWallet: data.isHotWallet
      }));
    } catch (error) {
      console.error('Failed to check if hot wallet:', error);
    }
  }
  
  // Fetch the wallet's MATIC balance
  async function fetchWalletBalance(address: string) {
    try {
      const response = await apiRequest('GET', `/api/wallet/balance?address=${address}`);
      const data = await response.json();
      
      setWalletInfo(prev => ({
        ...prev,
        balance: data.balance
      }));
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
    }
  }
  
  // Connect wallet handler
  async function connectWallet() {
    setLoading(true);
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to wallet. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }
  
  // Disconnect wallet handler
  function disconnectWallet() {
    setLoading(true);
    try {
      disconnect();
      setWalletInfo({
        address: '',
        connected: false,
        isHotWallet: false,
        balance: null,
        isCorrectNetwork: false
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      toast({
        title: 'Disconnect Failed',
        description: 'Could not disconnect wallet. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }
  
  // Generate a new hot wallet for the user
  async function generateHotWallet() {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/wallet/generate');
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Wallet Created',
          description: 'Your new hot wallet has been generated successfully',
          variant: 'default'
        });
        
        // Update wallet info with new hot wallet
        setWalletInfo({
          address: data.address,
          connected: true,
          isHotWallet: true,
          balance: data.balance || '0',
          isCorrectNetwork: true
        });
        
        return data.address;
      } else {
        throw new Error(data.message || 'Failed to generate hot wallet');
      }
    } catch (error) {
      console.error('Failed to generate hot wallet:', error);
      toast({
        title: 'Wallet Generation Failed',
        description: 'Could not generate a new hot wallet. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }
  
  // Connect to a pre-existing hot wallet
  async function connectToHotWallet() {
    setLoading(true);
    try {
      const response = await apiRequest('GET', '/api/wallet/hot-wallet');
      const data = await response.json();
      
      if (data.success && data.address) {
        setWalletInfo({
          address: data.address,
          connected: true,
          isHotWallet: true,
          balance: data.balance || '0',
          isCorrectNetwork: true
        });
        
        toast({
          title: 'Hot Wallet Connected',
          description: 'Your existing hot wallet has been connected',
          variant: 'default'
        });
        
        return data.address;
      } else if (data.message === 'No hot wallet found') {
        return null; // No hot wallet found, user might need to generate one
      } else {
        throw new Error(data.message || 'Failed to connect to hot wallet');
      }
    } catch (error) {
      console.error('Failed to connect to hot wallet:', error);
      toast({
        title: 'Hot Wallet Connection Failed',
        description: 'Could not connect to your hot wallet. Please try again.',
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }
  
  return {
    walletInfo,
    loading,
    connectWallet,
    disconnectWallet,
    generateHotWallet,
    connectToHotWallet,
    switchToPolygonAmoy
  };
}
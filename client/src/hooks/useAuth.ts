import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useWeb3 } from "@/contexts/Web3Context";

interface AuthResponse {
  authenticated: boolean;
  userId?: number;
  walletAddress?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  userId?: number;
  walletAddress?: string;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  const web3Context = useWeb3();
  
  // Get authentication status from server
  const { data, isLoading } = useQuery<AuthResponse>({
    queryKey: ['/api/auth/status'],
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // Refresh every minute
  });
  
  // Set default values if data is undefined
  const isAuthenticated = data?.authenticated || false;
  const userId = data?.userId;
  const walletAddress = data?.walletAddress || web3Context.account;
  
  // Auto-connect to wallet if user is authenticated and has a wallet address
  useEffect(() => {
    if (isAuthenticated && walletAddress && !web3Context.active) {
      // Connect to the wallet when authenticated and has a wallet address
      web3Context.connect();
    }
  }, [isAuthenticated, walletAddress, web3Context]);
  
  return {
    isAuthenticated,
    userId,
    walletAddress,
    isLoading,
  };
}
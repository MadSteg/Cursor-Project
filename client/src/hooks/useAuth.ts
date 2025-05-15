import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useWeb3 } from "@/contexts/Web3Context";

export interface AuthState {
  isAuthenticated: boolean;
  userId?: number;
  walletAddress?: string;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  const { connect, account } = useWeb3();
  
  // Get authentication status from server
  const { data, isLoading } = useQuery({
    queryKey: ['/api/auth/status'],
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // Refresh every minute
  });
  
  const isAuthenticated = data?.authenticated || false;
  
  // Auto-connect to wallet if user is authenticated and has a wallet address
  useEffect(() => {
    if (isAuthenticated && data?.walletAddress && !account) {
      // Connect to the wallet when authenticated and has a wallet address
      connect();
    }
  }, [isAuthenticated, data?.walletAddress, account, connect]);
  
  return {
    isAuthenticated,
    userId: data?.userId,
    walletAddress: data?.walletAddress || account,
    isLoading,
  };
}
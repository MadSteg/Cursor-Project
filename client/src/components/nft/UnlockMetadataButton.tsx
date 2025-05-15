import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, Loader2 } from 'lucide-react';
import { useWeb3Wallet } from '../../hooks/useWeb3Wallet';

interface UnlockMetadataButtonProps {
  tokenId: string;
  isLocked: boolean;
  onUnlock: (decryptedData: any) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  fullWidth?: boolean;
}

export default function UnlockMetadataButton({
  tokenId,
  isLocked,
  onUnlock,
  variant = 'default',
  size = 'default',
  fullWidth = false
}: UnlockMetadataButtonProps) {
  const { address, isConnected } = useWeb3Wallet();
  const { toast } = useToast();
  
  // Mutation for unlocking encrypted metadata
  const unlockMutation = useMutation({
    mutationFn: async () => {
      if (!isConnected || !address) {
        throw new Error('Wallet connection required to unlock');
      }
      
      const response = await apiRequest('POST', `/api/gallery/unlock/${tokenId}`, {
        walletAddress: address
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.metadata) {
        // Call the parent's onUnlock callback with the decrypted data
        onUnlock(data.metadata);
        
        toast({
          title: 'Metadata Unlocked',
          description: 'Receipt details decrypted successfully.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Unlock Failed',
          description: data.message || 'Unable to unlock the metadata.',
          variant: 'destructive',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Unlock Failed',
        description: error.message || 'An error occurred while unlocking the metadata.',
        variant: 'destructive',
      });
    }
  });
  
  // If the metadata is already unlocked, show a disabled button
  if (!isLocked) {
    return (
      <Button 
        variant="ghost" 
        size={size}
        disabled
        className={`flex items-center gap-2 ${fullWidth ? 'w-full' : ''}`}
      >
        <Unlock className="h-4 w-4" />
        Already Unlocked
      </Button>
    );
  }
  
  // If the wallet is not connected, show a button prompting connection
  if (!isConnected) {
    return (
      <Button 
        variant={variant} 
        size={size}
        className={`flex items-center gap-2 ${fullWidth ? 'w-full' : ''}`}
        onClick={() => {
          toast({
            title: 'Wallet Required',
            description: 'Please connect your wallet to unlock this data.',
            variant: 'default',
          });
        }}
      >
        <Lock className="h-4 w-4" />
        Connect to Unlock
      </Button>
    );
  }
  
  // Otherwise, show the unlock button
  return (
    <Button 
      variant={variant} 
      size={size}
      className={`flex items-center gap-2 ${fullWidth ? 'w-full' : ''}`}
      onClick={() => unlockMutation.mutate()}
      disabled={unlockMutation.isPending}
    >
      {unlockMutation.isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Unlocking...
        </>
      ) : (
        <>
          <Lock className="h-4 w-4" />
          Unlock Receipt Data
        </>
      )}
    </Button>
  );
}
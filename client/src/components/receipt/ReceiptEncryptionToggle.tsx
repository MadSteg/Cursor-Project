/**
 * Receipt Encryption Toggle Component
 * 
 * This component provides a UI toggle for enabling/disabling TaCo encryption
 * when uploading or processing receipts.
 */
import React, { useState } from 'react';
import { LockIcon, UnlockIcon, KeyIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import { useWeb3 } from '@/contexts/Web3Context';
import { usePublicKey } from '@/hooks/usePublicKey';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ReceiptEncryptionToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  className?: string;
}

export const ReceiptEncryptionToggle: React.FC<ReceiptEncryptionToggleProps> = ({
  enabled,
  onChange,
  className = '',
}) => {
  const { user, isAuthenticated } = useAuth();
  const { isConnected } = useWeb3();
  const { publicKey, isLoading: keyLoading } = usePublicKey();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Determine if encryption is available (must be authenticated and have a public key)
  const encryptionAvailable = isAuthenticated && isConnected && publicKey;
  
  // Handle toggle change
  const handleToggleChange = (checked: boolean) => {
    if (checked && !encryptionAvailable) {
      // If trying to enable but requirements not met, show dialog
      setDialogOpen(true);
      return;
    }
    
    onChange(checked);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2">
              <Switch
                id="encryption-toggle"
                checked={enabled}
                onCheckedChange={handleToggleChange}
                disabled={!encryptionAvailable}
              />
              <Label htmlFor="encryption-toggle" className="cursor-pointer flex items-center">
                {enabled ? (
                  <LockIcon className="w-4 h-4 mr-2 text-green-500" />
                ) : (
                  <UnlockIcon className="w-4 h-4 mr-2 text-gray-500" />
                )}
                TaCo Encryption
              </Label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {encryptionAvailable
              ? "Enable threshold encryption for enhanced privacy of your receipt metadata"
              : "Connect wallet and generate a TaCo key to enable encryption"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Encryption Requirements</DialogTitle>
            <DialogDescription>
              To enable TaCo threshold encryption for your receipts, you need to:
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center mb-2">
              <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center
                ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}>
                {isAuthenticated ? '✓' : '✗'}
              </div>
              <span>Be logged in to your account</span>
            </div>
            <div className="flex items-center mb-2">
              <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center
                ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}>
                {isConnected ? '✓' : '✗'}
              </div>
              <span>Connect your wallet</span>
            </div>
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center
                ${publicKey ? 'bg-green-500' : 'bg-red-500'}`}>
                {publicKey ? '✓' : '✗'}
              </div>
              <span>Generate a TaCo encryption key</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Close
            </Button>
            {!publicKey && isConnected && (
              <Button 
                onClick={() => {
                  setDialogOpen(false);
                  // Navigate to key management
                  window.location.href = '/taco/keys';
                }}
              >
                <KeyIcon className="w-4 h-4 mr-2" />
                Generate Key
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReceiptEncryptionToggle;
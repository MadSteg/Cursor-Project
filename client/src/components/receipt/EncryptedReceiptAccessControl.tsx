import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Key, User, Share2, LockKeyhole, Eye, AlertTriangle, Copy, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/contexts/WalletContext';
import { apiRequest } from '@/lib/queryClient';

interface EncryptedReceiptAccessControlProps {
  receiptId: string;
  receiptTitle?: string;
  nftId?: string;
  encryptionStatus: 'encrypted' | 'unencrypted' | 'partial';
  ownerAddress: string;
}

const EncryptedReceiptAccessControl: React.FC<EncryptedReceiptAccessControlProps> = ({
  receiptId,
  receiptTitle = 'Receipt',
  nftId,
  encryptionStatus,
  ownerAddress,
}) => {
  const { toast } = useToast();
  const { walletAddress, isConnected, signMessage } = useWallet();
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  const [isKeysDialogOpen, setIsKeysDialogOpen] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [accessDuration, setAccessDuration] = useState(7);
  const [isLoading, setIsLoading] = useState(false);
  const [privateKey, setPrivateKey] = useState('');
  const [accessGranted, setAccessGranted] = useState<string[]>([]);
  const [accessStatus, setAccessStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Check if current wallet is the owner
  const isOwner = walletAddress && ownerAddress && walletAddress.toLowerCase() === ownerAddress.toLowerCase();

  const fetchAccessRights = async () => {
    if (!receiptId || !isConnected) return;
    
    try {
      setIsLoading(true);
      const response = await apiRequest('GET', `/api/receipt-encryption/${receiptId}/access`);
      const data = await response.json();
      
      if (data.success) {
        setAccessGranted(data.grantedAccess || []);
      }
    } catch (error) {
      console.error('Error fetching access rights:', error);
      toast({
        title: 'Error fetching access rights',
        description: 'Unable to retrieve access information for this receipt',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const grantAccess = async () => {
    if (!receiptId || !isConnected || !recipientAddress) return;
    
    try {
      setAccessStatus('loading');
      // First, sign a message to prove ownership
      const signature = await signMessage(`I authorize granting access to receipt ${receiptId} to ${recipientAddress} for ${accessDuration} days`);
      
      const response = await apiRequest('POST', `/api/receipt-encryption/${receiptId}/grant`, {
        recipientAddress,
        durationDays: accessDuration,
        signature
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAccessStatus('success');
        toast({
          title: 'Access granted',
          description: `Successfully granted access to ${recipientAddress}`,
        });
        
        // Refresh access rights list
        fetchAccessRights();
        
        // Close dialog after a brief delay
        setTimeout(() => {
          setIsAccessDialogOpen(false);
          setAccessStatus('idle');
          setRecipientAddress('');
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to grant access');
      }
    } catch (error: any) {
      setAccessStatus('error');
      toast({
        title: 'Error granting access',
        description: error.message || 'An error occurred while granting access',
        variant: 'destructive',
      });
    }
  };

  const revokeAccess = async (targetAddress: string) => {
    if (!receiptId || !isConnected) return;
    
    try {
      setIsLoading(true);
      // Sign a message to prove ownership
      const signature = await signMessage(`I authorize revoking access to receipt ${receiptId} from ${targetAddress}`);
      
      const response = await apiRequest('POST', `/api/receipt-encryption/${receiptId}/revoke`, {
        targetAddress,
        signature
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Access revoked',
          description: `Successfully revoked access from ${targetAddress}`,
        });
        
        // Refresh access rights list
        fetchAccessRights();
      } else {
        throw new Error(data.message || 'Failed to revoke access');
      }
    } catch (error: any) {
      toast({
        title: 'Error revoking access',
        description: error.message || 'An error occurred while revoking access',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const retrievePrivateKey = async () => {
    if (!isConnected || !walletAddress) return;
    
    try {
      setIsLoading(true);
      
      // In a real implementation, this would securely retrieve the user's private key
      // Here we're simulating this with a mock service call
      const signature = await signMessage(`I authorize retrieving my encryption key for receipt ${receiptId}`);
      
      const response = await apiRequest('POST', `/api/taco/keys/retrieve`, {
        walletAddress,
        signature,
        purpose: 'view-receipt',
        receiptId
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPrivateKey(data.privateKey);
        toast({
          title: 'Key retrieved',
          description: 'Your private key has been securely retrieved',
        });
      } else {
        throw new Error(data.message || 'Failed to retrieve private key');
      }
    } catch (error: any) {
      toast({
        title: 'Error retrieving key',
        description: error.message || 'An error occurred while retrieving your key',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyPrivateKey = () => {
    if (!privateKey) return;
    
    navigator.clipboard.writeText(privateKey);
    toast({
      title: 'Copied to clipboard',
      description: 'Your private key has been copied to clipboard',
    });
  };

  const decryptData = async () => {
    if (!receiptId || !privateKey) return;
    
    try {
      setIsLoading(true);
      
      const response = await apiRequest('POST', `/api/receipt-encryption/${receiptId}/decrypt`, {
        privateKey
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Decryption successful',
          description: 'Receipt data has been decrypted',
        });
        
        // Here you would typically update the UI to show the decrypted data
        // or redirect to a page that displays it
        window.location.href = `/receipts/${receiptId}/decrypted`;
      } else {
        throw new Error(data.message || 'Failed to decrypt receipt data');
      }
    } catch (error: any) {
      toast({
        title: 'Decryption error',
        description: error.message || 'An error occurred while decrypting data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border border-amber-200 bg-amber-50 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-amber-800 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-amber-600" />
            Encrypted Receipt
          </CardTitle>
          {nftId && (
            <span className="text-xs bg-slate-200 px-2 py-1 rounded-full text-slate-700">
              NFT #{nftId}
            </span>
          )}
        </div>
        <CardDescription className="text-amber-700">
          {receiptTitle}'s metadata is secured with TaCo threshold encryption.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pb-3">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-amber-800 flex items-center">
              <LockKeyhole className="h-4 w-4 mr-2 text-amber-600" />
              Encryption Status:
            </span>
            <span className="font-medium">
              {encryptionStatus === 'encrypted' && 'Fully Encrypted'}
              {encryptionStatus === 'unencrypted' && 'Not Encrypted'}
              {encryptionStatus === 'partial' && 'Partially Encrypted'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-amber-800 flex items-center">
              <User className="h-4 w-4 mr-2 text-amber-600" />
              Owner:
            </span>
            <span className="font-medium">
              {ownerAddress.substring(0, 6)}...{ownerAddress.substring(ownerAddress.length - 4)}
            </span>
          </div>
        </div>
        
        <div className="border-t border-amber-200 pt-3 pb-1">
          <p className="text-sm text-amber-800 mb-3">
            <AlertTriangle className="h-4 w-4 inline-block mr-1 text-amber-600" />
            To access this encrypted data, you need:
          </p>
          
          <ul className="text-sm text-amber-700 space-y-1.5 ml-6 list-disc">
            <li>Your decryption key associated with this receipt</li>
            <li>Permission from the receipt owner</li>
            <li>A valid blockchain wallet connection</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-4 flex justify-between gap-2">
        {/* Access Keys Dialog */}
        <Dialog open={isKeysDialogOpen} onOpenChange={setIsKeysDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900"
              onClick={() => {
                setIsKeysDialogOpen(true);
                retrievePrivateKey();
              }}
            >
              <Key className="h-4 w-4 mr-2" />
              Access Keys
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Encryption Keys</DialogTitle>
              <DialogDescription>
                These are your encryption keys for accessing this receipt's data.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="privateKey">Your Private Key</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="privateKey"
                    value={privateKey || ''}
                    readOnly
                    className="font-mono text-xs"
                    placeholder="Retrieving your key..."
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyPrivateKey}
                    disabled={!privateKey}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                {!privateKey && isLoading && (
                  <p className="text-sm text-muted-foreground">Retrieving your key...</p>
                )}
                {privateKey && (
                  <p className="text-sm text-amber-600">
                    <AlertTriangle className="h-3.5 w-3.5 inline mr-1" />
                    Never share this key with anyone.
                  </p>
                )}
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
              <Button 
                variant="outline" 
                onClick={() => setIsKeysDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={decryptData}
                disabled={!privateKey || isLoading}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                Decrypt Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Share Access Dialog - Only visible for owners */}
        {isOwner && (
          <Dialog open={isAccessDialogOpen} onOpenChange={setIsAccessDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="default" 
                size="sm"
                className="bg-amber-600 hover:bg-amber-700"
                onClick={() => {
                  setIsAccessDialogOpen(true);
                  fetchAccessRights();
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Manage Access
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Manage Receipt Access</DialogTitle>
                <DialogDescription>
                  Grant or revoke access to this encrypted receipt.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientAddress">Recipient Address</Label>
                  <Input
                    id="recipientAddress"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="0x..."
                    disabled={accessStatus === 'loading'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accessDuration">Access Duration (Days)</Label>
                  <Input
                    id="accessDuration"
                    type="number"
                    min={1}
                    max={365}
                    value={accessDuration}
                    onChange={(e) => setAccessDuration(parseInt(e.target.value))}
                    disabled={accessStatus === 'loading'}
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Current Access</h4>
                  {isLoading ? (
                    <p className="text-sm text-muted-foreground">Loading access list...</p>
                  ) : accessGranted.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {accessGranted.map((address) => (
                        <div key={address} className="flex items-center justify-between text-sm p-2 bg-slate-100 rounded">
                          <span className="font-mono">
                            {address.substring(0, 6)}...{address.substring(address.length - 4)}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-red-600 hover:text-red-700 hover:bg-red-100 p-0 px-2"
                            onClick={() => revokeAccess(address)}
                            disabled={isLoading}
                          >
                            Revoke
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No access has been granted yet.</p>
                  )}
                </div>
              </div>
              <DialogFooter className="sm:justify-start">
                <Button
                  onClick={grantAccess}
                  disabled={!recipientAddress || accessStatus === 'loading'}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {accessStatus === 'loading' ? (
                    <>Loading...</>
                  ) : accessStatus === 'success' ? (
                    <><CheckCircle className="h-4 w-4 mr-1" /> Access Granted</>
                  ) : accessStatus === 'error' ? (
                    <><XCircle className="h-4 w-4 mr-1" /> Error</>
                  ) : (
                    <>Grant Access</>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* For non-owners, we show a simpler UI */}
        {!isOwner && (
          <Button 
            variant="default" 
            size="sm"
            className="bg-amber-600 hover:bg-amber-700"
            onClick={() => window.location.href = `/receipts/${receiptId}/request-access`}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Request Access
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EncryptedReceiptAccessControl;
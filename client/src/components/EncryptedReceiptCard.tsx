import { useState } from 'react';
import { Shield, Lock, Unlock, Eye, EyeOff, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface EncryptedReceiptCardProps {
  receipt: {
    id: number;
    merchantName: string;
    total: number;
    date: string;
    tokenId?: string;
    encrypted: boolean;
    hasAccess?: boolean;
  };
  userAddress?: string;
}

export function EncryptedReceiptCard({ receipt, userAddress }: EncryptedReceiptCardProps) {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [showDecrypted, setShowDecrypted] = useState(false);
  const [grantAddress, setGrantAddress] = useState('');
  const [isGranting, setIsGranting] = useState(false);
  const [decryptedData, setDecryptedData] = useState<any>(null);
  const { toast } = useToast();

  const handleDecrypt = async () => {
    if (!receipt.tokenId || !userAddress) {
      toast({
        title: "Cannot Decrypt",
        description: "Missing token ID or user address"
      });
      return;
    }

    setIsDecrypting(true);
    try {
      const response = await fetch(`/api/pre/decrypt/${receipt.tokenId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress,
          userPrivateKey: 'user-private-key' // In real app, get from wallet
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDecryptedData(data.receiptData);
        setShowDecrypted(true);
        toast({
          title: "Receipt Decrypted!",
          description: "Your encrypted receipt data is now visible"
        });
      } else {
        const error = await response.json();
        toast({
          title: "Decryption Failed",
          description: error.message || "Could not decrypt receipt"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decrypt receipt"
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleGrantAccess = async () => {
    if (!grantAddress.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a wallet address to grant access"
      });
      return;
    }

    if (!receipt.tokenId) {
      toast({
        title: "Cannot Grant Access",
        description: "Missing token ID"
      });
      return;
    }

    setIsGranting(true);
    try {
      const response = await fetch(`/api/pre/grant-access/${receipt.tokenId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          delegateeAddress: grantAddress,
          signerPrivateKey: 'owner-private-key' // In real app, get from wallet
        }),
      });

      if (response.ok) {
        toast({
          title: "Access Granted!",
          description: `${grantAddress} can now access this receipt`
        });
        setGrantAddress('');
      } else {
        const error = await response.json();
        toast({
          title: "Grant Failed",
          description: error.message || "Could not grant access"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to grant access"
      });
    } finally {
      setIsGranting(false);
    }
  };

  return (
    <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-green-600" />
            {receipt.merchantName}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Lock className="w-3 h-3 mr-1" />
              Encrypted
            </Badge>
            {receipt.hasAccess && (
              <Badge variant="default" className="bg-blue-100 text-blue-800">
                <Unlock className="w-3 h-3 mr-1" />
                Access Granted
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Receipt Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Total:</span> ${receipt.total.toFixed(2)}
          </div>
          <div>
            <span className="font-medium">Date:</span> {new Date(receipt.date).toLocaleDateString()}
          </div>
          {receipt.tokenId && (
            <div className="col-span-2">
              <span className="font-medium">Token ID:</span> {receipt.tokenId}
            </div>
          )}
        </div>

        {/* Decryption Section */}
        {receipt.hasAccess && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Encrypted Details
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecrypt}
                disabled={isDecrypting}
              >
                {isDecrypting ? (
                  "Decrypting..."
                ) : showDecrypted ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-1" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </>
                )}
              </Button>
            </div>

            {showDecrypted && decryptedData && (
              <div className="bg-white p-3 rounded-lg border">
                <pre className="text-xs overflow-auto max-h-40">
                  {JSON.stringify(decryptedData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Access Control Section */}
        <div className="border-t pt-4">
          <h4 className="font-medium flex items-center gap-2 mb-3">
            <Users className="w-4 h-4" />
            Grant Access
          </h4>
          <div className="flex gap-2">
            <Input
              placeholder="Enter wallet address..."
              value={grantAddress}
              onChange={(e) => setGrantAddress(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleGrantAccess}
              disabled={isGranting || !grantAddress.trim()}
              size="sm"
            >
              {isGranting ? "Granting..." : "Grant"}
            </Button>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-xs text-blue-800">
            🔐 This receipt is protected by Threshold Network's PRE encryption. 
            Only authorized users can access the encrypted details.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
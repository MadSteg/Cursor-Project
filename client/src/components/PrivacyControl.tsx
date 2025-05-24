import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock, Unlock, Eye, EyeOff, Key } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PrivacyControlProps {
  receiptId: string;
  isOwner: boolean;
  currentAccess?: string[];
}

export function PrivacyControl({ receiptId, isOwner, currentAccess = [] }: PrivacyControlProps) {
  const [grantAddress, setGrantAddress] = useState("");
  const [revokeAddress, setRevokeAddress] = useState("");
  const [isGranting, setIsGranting] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const { toast } = useToast();

  const handleGrantAccess = async () => {
    if (!grantAddress.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a wallet address to grant access"
      });
      return;
    }

    setIsGranting(true);
    try {
      const response = await fetch(`/api/pre/grant/${receiptId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetAddress: grantAddress.trim() })
      });

      if (response.ok) {
        toast({
          title: "Access Granted",
          description: `Successfully granted access to ${grantAddress}`,
        });
        setGrantAddress("");
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to grant access');
      }
    } catch (error) {
      toast({
        title: "Grant Failed",
        description: error instanceof Error ? error.message : "Failed to grant access",
        variant: "destructive"
      });
    } finally {
      setIsGranting(false);
    }
  };

  const handleRevokeAccess = async () => {
    if (!revokeAddress.trim()) {
      toast({
        title: "Address Required", 
        description: "Please enter a wallet address to revoke access",
        variant: "destructive"
      });
      return;
    }

    setIsRevoking(true);
    try {
      const response = await fetch(`/api/pre/revoke/${receiptId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetAddress: revokeAddress.trim() })
      });

      if (response.ok) {
        toast({
          title: "Access Revoked",
          description: `Successfully revoked access from ${revokeAddress}`,
        });
        setRevokeAddress("");
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to revoke access');
      }
    } catch (error) {
      toast({
        title: "Revoke Failed",
        description: error instanceof Error ? error.message : "Failed to revoke access",
        variant: "destructive"
      });
    } finally {
      setIsRevoking(false);
    }
  };

  const handleEncryptReceipt = async () => {
    setIsEncrypting(true);
    try {
      const response = await fetch(`/api/pre/encrypt/${receiptId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        toast({
          title: "Receipt Encrypted",
          description: "Your receipt data is now securely encrypted",
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to encrypt receipt');
      }
    } catch (error) {
      toast({
        title: "Encryption Failed",
        description: error instanceof Error ? error.message : "Failed to encrypt receipt",
        variant: "destructive"
      });
    } finally {
      setIsEncrypting(false);
    }
  };

  if (!isOwner) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            Privacy Status
          </CardTitle>
          <CardDescription>
            You have read access to this encrypted receipt
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="flex items-center gap-2 w-fit">
            <Shield className="h-4 w-4" />
            Read Access Granted
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encryption Control */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Privacy Protection
          </CardTitle>
          <CardDescription>
            Encrypt your receipt data using Threshold Network's privacy technology
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleEncryptReceipt}
            disabled={isEncrypting}
            className="w-full"
          >
            {isEncrypting ? (
              <>
                <Lock className="mr-2 h-4 w-4 animate-spin" />
                Encrypting...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Encrypt Receipt Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Access Management */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-blue-600" />
            Access Management
          </CardTitle>
          <CardDescription>
            Grant or revoke access to your encrypted receipt data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Access List */}
          {currentAccess.length > 0 && (
            <div>
              <Label className="text-sm font-medium">Current Access</Label>
              <div className="mt-2 space-y-2">
                {currentAccess.map((address, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-2 w-fit">
                    <Eye className="h-3 w-3" />
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Grant Access */}
          <div className="space-y-2">
            <Label htmlFor="grant-address">Grant Access</Label>
            <div className="flex gap-2">
              <Input
                id="grant-address"
                placeholder="Enter wallet address (0x...)"
                value={grantAddress}
                onChange={(e) => setGrantAddress(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleGrantAccess}
                disabled={isGranting || !grantAddress.trim()}
                size="sm"
              >
                {isGranting ? (
                  <>
                    <Unlock className="mr-2 h-4 w-4 animate-spin" />
                    Granting...
                  </>
                ) : (
                  <>
                    <Unlock className="mr-2 h-4 w-4" />
                    Grant
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Revoke Access */}
          <div className="space-y-2">
            <Label htmlFor="revoke-address">Revoke Access</Label>
            <div className="flex gap-2">
              <Input
                id="revoke-address"
                placeholder="Enter wallet address (0x...)"
                value={revokeAddress}
                onChange={(e) => setRevokeAddress(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleRevokeAccess}
                disabled={isRevoking || !revokeAddress.trim()}
                variant="destructive"
                size="sm"
              >
                {isRevoking ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4 animate-spin" />
                    Revoking...
                  </>
                ) : (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Revoke
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
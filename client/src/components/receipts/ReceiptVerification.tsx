import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle2, 
  XCircle, 
  CircleOff, 
  Loader2, 
  Shield, 
  Lock, 
  LucideQrCode, 
  FileText,
  ShieldCheck,
  Key
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface VerificationResult {
  status: 'verified' | 'failed' | 'pending' | null;
  tokenId?: string;
  transactionHash?: string;
  contractAddress?: string;
  blockNumber?: number;
  timestamp?: string;
  merchantName?: string;
  merchantId?: string;
  issueDate?: string;
  totalAmount?: number;
  encryptionStatus?: 'encrypted' | 'unencrypted';
  message?: string;
}

const initialVerificationState: VerificationResult = {
  status: null
};

const ReceiptVerification: React.FC = () => {
  const [verificationMethod, setVerificationMethod] = useState<'tokenid' | 'txhash' | 'qr'>('tokenid');
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [verificationResult, setVerificationResult] = useState<VerificationResult>(initialVerificationState);
  const [verificationInput, setVerificationInput] = useState('');
  
  const handleVerify = async () => {
    if (!verificationInput.trim()) return;
    
    setIsVerifying(true);
    setProgress(0);
    
    // Reset previous verification result
    setVerificationResult(initialVerificationState);
    
    // Simulate verification process with progress updates
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += 5;
      setProgress(Math.min(currentProgress, 95)); // Cap at 95% until complete
      
      if (currentProgress >= 95) {
        clearInterval(progressInterval);
        // Mock result for demonstration (in real implementation, this would be API response)
        setTimeout(() => {
          simulateVerificationResult();
        }, 1000);
      }
    }, 200);
  };
  
  const simulateVerificationResult = () => {
    // This is where actual blockchain verification would occur
    // For demo purposes, we'll simulate success for valid-looking inputs
    const isValidTokenId = /^\d+$/.test(verificationInput.trim());
    const isValidTxHash = /^0x[a-fA-F0-9]{64}$/.test(verificationInput.trim());
    
    // In a real implementation, these values would come from blockchain query
    if (isValidTokenId || isValidTxHash || verificationMethod === 'qr') {
      setVerificationResult({
        status: 'verified',
        tokenId: isValidTokenId ? verificationInput : '12345',
        transactionHash: isValidTxHash ? verificationInput : '0x7d3e9e6bd34cf3c22376138b586d9a551349e0a34c3967d3cbc5c2d3f1bb8d32',
        contractAddress: '0x2C5c7578BbA4bBE52BAe580E8D8B2DA6D8D55Cb8',
        blockNumber: 7895421,
        timestamp: '2025-05-14T15:23:45Z',
        merchantName: 'Whole Foods Market',
        merchantId: 'WFM1053',
        issueDate: '2025-05-14',
        totalAmount: 84.32,
        encryptionStatus: Math.random() > 0.5 ? 'encrypted' : 'unencrypted'
      });
    } else {
      setVerificationResult({
        status: 'failed',
        message: 'The receipt could not be verified on the blockchain. Please check your input and try again.'
      });
    }
    
    setProgress(100);
    setIsVerifying(false);
  };
  
  const resetVerification = () => {
    setVerificationResult(initialVerificationState);
    setVerificationInput('');
    setProgress(0);
  };
  
  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue={verificationMethod} 
        onValueChange={(value) => setVerificationMethod(value as 'tokenid' | 'txhash' | 'qr')}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="tokenid" disabled={isVerifying}>
            <Shield className="h-4 w-4 mr-2" /> Token ID
          </TabsTrigger>
          <TabsTrigger value="txhash" disabled={isVerifying}>
            <Key className="h-4 w-4 mr-2" /> Transaction Hash
          </TabsTrigger>
          <TabsTrigger value="qr" disabled={isVerifying}>
            <LucideQrCode className="h-4 w-4 mr-2" /> QR Code
          </TabsTrigger>
        </TabsList>
        
        <Card>
          <CardHeader>
            <CardTitle>Verify Receipt Authenticity</CardTitle>
            <CardDescription>
              Confirm that a receipt exists on the blockchain and verify its details
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!verificationResult.status && (
              <>
                <TabsContent value="tokenid" className="mt-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="token-id">NFT Token ID</Label>
                      <Input
                        id="token-id"
                        placeholder="Enter the receipt token ID (e.g. 12345)"
                        value={verificationInput}
                        onChange={(e) => setVerificationInput(e.target.value)}
                        disabled={isVerifying}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter the unique token ID of the NFT receipt you want to verify.
                      This can be found on the receipt or in your digital wallet.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="txhash" className="mt-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tx-hash">Transaction Hash</Label>
                      <Textarea
                        id="tx-hash"
                        placeholder="Enter the blockchain transaction hash (0x...)"
                        value={verificationInput}
                        onChange={(e) => setVerificationInput(e.target.value)}
                        disabled={isVerifying}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Paste the full transaction hash from the blockchain. This is a unique
                      identifier for the transaction that created this receipt.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="qr" className="mt-0">
                  <div className="space-y-4">
                    <div className="bg-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center p-10">
                      <LucideQrCode className="h-16 w-16 text-gray-400 mb-4" />
                      <p className="text-center text-sm text-gray-600 mb-4">
                        Scan a receipt QR code to verify its authenticity on the blockchain
                      </p>
                      <Button 
                        onClick={() => {
                          // Set dummy value for demo
                          setVerificationInput('qr-scan-12345');
                          handleVerify();
                        }}
                        disabled={isVerifying}
                      >
                        Start Camera Scan
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Use your device's camera to scan the QR code on a physical or digital receipt.
                    </p>
                  </div>
                </TabsContent>
              
                {isVerifying && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-center text-muted-foreground">
                      Verifying receipt on blockchain... {progress}%
                    </p>
                  </div>
                )}
              </>
            )}
            
            {verificationResult.status === 'verified' && (
              <div className="space-y-6">
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <AlertTitle className="text-green-800">Verification Successful</AlertTitle>
                  <AlertDescription className="text-green-700">
                    This receipt has been verified as authentic on the blockchain.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Merchant</Label>
                      <div className="font-medium">{verificationResult.merchantName}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Receipt Date</Label>
                      <div className="font-medium">{new Date(verificationResult.issueDate || '').toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Amount</Label>
                      <div className="font-medium">${verificationResult.totalAmount?.toFixed(2)}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Token ID</Label>
                      <div className="font-medium flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-1 text-green-600" />
                        {verificationResult.tokenId}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <Label className="text-sm text-muted-foreground">Blockchain Information</Label>
                    <div className="bg-gray-50 p-3 rounded-md space-y-2 text-sm font-mono">
                      <div className="grid grid-cols-5 gap-2">
                        <span className="text-gray-500 col-span-1">TX Hash:</span>
                        <span className="col-span-4 truncate">{verificationResult.transactionHash}</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        <span className="text-gray-500 col-span-1">Contract:</span>
                        <span className="col-span-4 truncate">{verificationResult.contractAddress}</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        <span className="text-gray-500 col-span-1">Block:</span>
                        <span className="col-span-4">{verificationResult.blockNumber}</span>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        <span className="text-gray-500 col-span-1">Time:</span>
                        <span className="col-span-4">{new Date(verificationResult.timestamp || '').toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <FileText className="h-3 w-3 mr-1" /> NFT Receipt
                      </Badge>
                      
                      {verificationResult.encryptionStatus === 'encrypted' ? (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          <Lock className="h-3 w-3 mr-1" /> Encrypted
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          Unencrypted
                        </Badge>
                      )}
                    </div>
                    
                    <Button variant="link" size="sm">
                      View on Explorer
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {verificationResult.status === 'failed' && (
              <div className="space-y-6">
                <Alert className="bg-red-50 border-red-200">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <AlertTitle className="text-red-800">Verification Failed</AlertTitle>
                  <AlertDescription className="text-red-700">
                    {verificationResult.message}
                  </AlertDescription>
                </Alert>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-start space-x-3">
                    <CircleOff className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Possible reasons for verification failure:</p>
                      <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                        <li>The receipt doesn't exist on the blockchain</li>
                        <li>The token ID or transaction hash was entered incorrectly</li>
                        <li>The receipt may have been revoked or marked as invalid</li>
                        <li>There could be a temporary blockchain connection issue</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className={verificationResult.status ? "justify-between pt-2 border-t" : ""}>
            {!verificationResult.status ? (
              <Button 
                onClick={handleVerify} 
                disabled={isVerifying || !verificationInput.trim()}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Verify Receipt
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={resetVerification}>
                  Verify Another Receipt
                </Button>
                
                {verificationResult.status === 'verified' && (
                  <Button>
                    View Full Receipt Details
                  </Button>
                )}
              </>
            )}
          </CardFooter>
        </Card>
      </Tabs>
    </div>
  );
};

export default ReceiptVerification;
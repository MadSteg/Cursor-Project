import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  Key, 
  Unlock, 
  Copy, 
  Share2, 
  Fingerprint, 
  User, 
  Eye,
  Lock,
  CheckCircle,
  RefreshCw,
  Download,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useWallet } from '@/contexts/WalletContext';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const ReceiptKeysPage: React.FC = () => {
  const { receiptId } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { walletAddress, signMessage, isConnected } = useWallet();
  const [loading, setLoading] = useState(true);
  const [keyData, setKeyData] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('access');
  const [accessRequests, setAccessRequests] = useState<any[]>([]);
  const [privateKey, setPrivateKey] = useState('');
  const [decrypting, setDecrypting] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  
  // Fetch encryption keys and receipt data
  useEffect(() => {
    const fetchData = async () => {
      if (!receiptId || !isConnected || !walletAddress) return;
      
      try {
        setLoading(true);
        
        // Fetch receipt details
        const receiptResponse = await apiRequest('GET', `/api/receipts/${receiptId}`);
        const receiptData = await receiptResponse.json();
        
        if (receiptData.success) {
          setReceipt(receiptData.receipt);
        }
        
        // Fetch encryption key data
        const signature = await signMessage(`I authorize retrieving my encryption keys for receipt ${receiptId}`);
        
        const keyResponse = await apiRequest('POST', `/api/taco/keys/receipt/${receiptId}`, {
          walletAddress,
          signature
        });
        
        const keyResponseData = await keyResponse.json();
        
        if (keyResponseData.success) {
          setKeyData(keyResponseData.keyData);
        }
        
        // Fetch access requests
        const accessResponse = await apiRequest('GET', `/api/receipt-encryption/${receiptId}/requests`);
        const accessData = await accessResponse.json();
        
        if (accessData.success) {
          setAccessRequests(accessData.requests || []);
        }
      } catch (error: any) {
        toast({
          title: 'Error fetching encryption data',
          description: error.message || 'Failed to load encryption keys',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [receiptId, walletAddress, isConnected, signMessage, toast]);
  
  const generateNewKeys = async () => {
    if (!receiptId || !isConnected || !walletAddress) return;
    
    try {
      setLoading(true);
      
      const signature = await signMessage(`I authorize generating new encryption keys for receipt ${receiptId}`);
      
      const response = await apiRequest('POST', `/api/taco/keys/generate`, {
        walletAddress,
        signature,
        receiptId
      });
      
      const data = await response.json();
      
      if (data.success) {
        setKeyData(data.keyData);
        toast({
          title: 'Keys generated',
          description: 'New encryption keys have been generated successfully',
        });
      } else {
        throw new Error(data.message || 'Failed to generate new keys');
      }
    } catch (error: any) {
      toast({
        title: 'Error generating keys',
        description: error.message || 'Failed to generate new encryption keys',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const retrievePrivateKey = async () => {
    if (!receiptId || !isConnected || !walletAddress) return;
    
    try {
      setDecrypting(true);
      
      const signature = await signMessage(`I authorize retrieving my private key for receipt ${receiptId}`);
      
      const response = await apiRequest('POST', `/api/taco/keys/private`, {
        walletAddress,
        signature,
        receiptId
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPrivateKey(data.privateKey);
        setShowPrivateKey(true);
        toast({
          title: 'Private key retrieved',
          description: 'Your private key has been securely retrieved',
        });
      } else {
        throw new Error(data.message || 'Failed to retrieve private key');
      }
    } catch (error: any) {
      toast({
        title: 'Error retrieving private key',
        description: error.message || 'Failed to retrieve your private key',
        variant: 'destructive',
      });
    } finally {
      setDecrypting(false);
    }
  };
  
  const decryptReceipt = async () => {
    if (!receiptId || !privateKey) return;
    
    try {
      setDecrypting(true);
      
      const response = await apiRequest('POST', `/api/receipt-encryption/${receiptId}/decrypt`, {
        privateKey
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Decryption successful',
          description: 'Receipt data has been decrypted',
        });
        
        // Navigate to view decrypted receipt
        navigate(`/receipts/${receiptId}/view`);
      } else {
        throw new Error(data.message || 'Failed to decrypt receipt data');
      }
    } catch (error: any) {
      toast({
        title: 'Decryption error',
        description: error.message || 'Failed to decrypt receipt data',
        variant: 'destructive',
      });
    } finally {
      setDecrypting(false);
    }
  };
  
  const approveAccessRequest = async (requestId: string) => {
    if (!receiptId || !isConnected || !walletAddress) return;
    
    try {
      const signature = await signMessage(`I authorize approving access request ${requestId} for receipt ${receiptId}`);
      
      const response = await apiRequest('POST', `/api/receipt-encryption/${receiptId}/approve-request`, {
        requestId,
        signature
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update access requests list
        setAccessRequests(prevRequests => 
          prevRequests.map(req => 
            req.id === requestId 
              ? { ...req, status: 'approved' } 
              : req
          )
        );
        
        toast({
          title: 'Access approved',
          description: 'You have granted access to this receipt',
        });
      } else {
        throw new Error(data.message || 'Failed to approve access request');
      }
    } catch (error: any) {
      toast({
        title: 'Error approving request',
        description: error.message || 'Failed to approve access request',
        variant: 'destructive',
      });
    }
  };
  
  const denyAccessRequest = async (requestId: string) => {
    if (!receiptId || !isConnected || !walletAddress) return;
    
    try {
      const signature = await signMessage(`I authorize denying access request ${requestId} for receipt ${receiptId}`);
      
      const response = await apiRequest('POST', `/api/receipt-encryption/${receiptId}/deny-request`, {
        requestId,
        signature
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update access requests list
        setAccessRequests(prevRequests => 
          prevRequests.map(req => 
            req.id === requestId 
              ? { ...req, status: 'denied' } 
              : req
          )
        );
        
        toast({
          title: 'Access denied',
          description: 'You have denied access to this receipt',
        });
      } else {
        throw new Error(data.message || 'Failed to deny access request');
      }
    } catch (error: any) {
      toast({
        title: 'Error denying request',
        description: error.message || 'Failed to deny access request',
        variant: 'destructive',
      });
    }
  };
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: `${label} has been copied to clipboard`,
    });
  };
  
  const downloadKeyFile = () => {
    if (!keyData) return;
    
    const keyFileContent = JSON.stringify({
      publicKey: keyData.publicKey,
      receiptId,
      walletAddress,
      createdAt: new Date().toISOString(),
    }, null, 2);
    
    const blob = new Blob([keyFileContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blockreceipt-key-${receiptId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Shield className="mr-2 h-6 w-6 text-amber-600" />
              Loading Encryption Keys
            </CardTitle>
            <CardDescription>
              Please wait while we retrieve your encryption keys...
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 flex justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Button 
        variant="outline" 
        size="sm"
        className="mb-4" 
        onClick={() => navigate(`/receipts/${receiptId}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Receipt
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Shield className="mr-2 h-6 w-6 text-amber-600" />
            TaCo Encryption Keys
          </CardTitle>
          <CardDescription>
            Manage encryption keys for your secure receipt
            {receipt?.merchantName && (
              <span className="font-medium"> from {receipt.merchantName}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="access">
                <Key className="h-4 w-4 mr-2" />
                Access Keys
              </TabsTrigger>
              <TabsTrigger value="decrypt">
                <Unlock className="h-4 w-4 mr-2" />
                Decrypt Receipt
              </TabsTrigger>
              <TabsTrigger value="requests">
                <Share2 className="h-4 w-4 mr-2" />
                Access Requests
                {accessRequests.filter(req => req.status === 'pending').length > 0 && (
                  <span className="ml-2 h-5 w-5 rounded-full bg-primary text-xs flex items-center justify-center text-primary-foreground">
                    {accessRequests.filter(req => req.status === 'pending').length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="access" className="px-1 py-4 space-y-4">
              {keyData ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium flex items-center">
                          <Fingerprint className="h-5 w-5 mr-2 text-primary" />
                          Your Public Key
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          This is your public key for receipt encryption.
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(keyData.publicKey, 'Public key')}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        readOnly
                        value={keyData.publicKey}
                        className="font-mono text-xs pr-24"
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-amber-600" />
                      Key Management
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Button
                        variant="outline"
                        onClick={generateNewKeys}
                        disabled={loading}
                        className="w-full justify-start"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Generate New Keys
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={downloadKeyFile}
                        disabled={!keyData}
                        className="w-full justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Key File
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                    <Key className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-medium">No Keys Found</h3>
                  <p className="text-center text-muted-foreground max-w-md">
                    You don't have encryption keys for this receipt yet. Generate new keys to secure your receipt data.
                  </p>
                  <Button onClick={generateNewKeys} disabled={loading}>
                    <Key className="h-4 w-4 mr-2" />
                    Generate Encryption Keys
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="decrypt" className="px-1 py-4 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Unlock className="h-5 w-5 mr-2 text-primary" />
                    Decrypt Receipt Data
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Use your private key to decrypt and view your receipt data.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="privateKey">Your Private Key</Label>
                  <div className="relative">
                    <Input
                      id="privateKey"
                      type={showPrivateKey ? "text" : "password"}
                      value={privateKey}
                      onChange={e => setPrivateKey(e.target.value)}
                      placeholder="Enter your private key or click 'Retrieve Key'"
                      className="font-mono text-xs pr-24"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                    >
                      {showPrivateKey ? "Hide" : "Show"}
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button 
                    onClick={retrievePrivateKey} 
                    variant="outline"
                    disabled={decrypting}
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Retrieve Private Key
                  </Button>
                  
                  <Button 
                    onClick={decryptReceipt}
                    disabled={!privateKey || decrypting}
                  >
                    {decrypting ? (
                      <span className="flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Decrypting...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        Decrypt and View Receipt
                      </span>
                    )}
                  </Button>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mt-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800">Security Notice</h4>
                      <p className="text-sm text-amber-700 mt-1">
                        Your private key gives complete access to your encrypted data. Never share it with others and keep it secure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="requests" className="px-1 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Share2 className="h-5 w-5 mr-2 text-primary" />
                    Access Requests
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Manage who can access your encrypted receipt data.
                  </p>
                </div>
                
                {accessRequests.length > 0 ? (
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                    {accessRequests.map(request => (
                      <Card key={request.id} className={`border ${
                        request.status === 'approved' ? 'border-green-200 bg-green-50' :
                        request.status === 'denied' ? 'border-red-200 bg-red-50' :
                        'border-amber-200 bg-amber-50'
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-slate-600" />
                                <span className="font-medium">
                                  {request.requesterName || 'Unknown user'}
                                </span>
                              </div>
                              <div className="text-sm text-slate-600">
                                Address: {request.requesterAddress.substring(0, 8)}...{request.requesterAddress.substring(request.requesterAddress.length - 6)}
                              </div>
                              <div className="text-sm text-slate-600">
                                Requested: {new Date(request.requestedAt).toLocaleString()}
                              </div>
                              {request.reason && (
                                <div className="text-sm">
                                  <span className="font-medium">Reason:</span> {request.reason}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col space-y-2">
                              {request.status === 'pending' ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-green-100 border-green-200 hover:bg-green-200 text-green-800"
                                    onClick={() => approveAccessRequest(request.id)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="bg-red-100 border-red-200 hover:bg-red-200 text-red-800"
                                    onClick={() => denyAccessRequest(request.id)}
                                  >
                                    Deny
                                  </Button>
                                </>
                              ) : (
                                <div className={`text-sm font-medium ${
                                  request.status === 'approved' ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {request.status === 'approved' ? (
                                    <span className="flex items-center">
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approved
                                    </span>
                                  ) : (
                                    <span>Denied</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                      <Share2 className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium">No Access Requests</h3>
                    <p className="text-center text-muted-foreground max-w-md">
                      You don't have any access requests for this receipt yet.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/receipts/${receiptId}`)}
          >
            Back to Receipt
          </Button>
          
          {keyData && (
            <Button onClick={downloadKeyFile}>
              <Download className="h-4 w-4 mr-2" />
              Download Key File
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReceiptKeysPage;
import { useState } from 'react';
import { Shield, Lock, Zap, Users, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { EncryptedReceiptCard } from '@/components/EncryptedReceiptCard';

export default function PREDemo() {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptedReceipt, setEncryptedReceipt] = useState<any>(null);
  const [sampleData, setSampleData] = useState({
    merchantName: "Coffee & Code Cafe",
    total: 24.99,
    items: [
      { name: "Premium Latte", price: 5.99, quantity: 2 },
      { name: "Artisan Croissant", price: 4.50, quantity: 2 },
      { name: "Organic Coffee Beans", price: 8.51, quantity: 1 }
    ],
    subtotal: 22.49,
    tax: 2.50,
    date: new Date().toISOString()
  });
  const { toast } = useToast();

  const handleTestEncryption = async () => {
    setIsEncrypting(true);
    try {
      // Test the TACo encryption service directly
      const response = await fetch('/api/taco/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: JSON.stringify(sampleData),
          publicKey: 'demo-public-key-for-testing'
        }),
      });

      if (response.ok) {
        const encryptedData = await response.json();
        
        // Create a mock encrypted receipt for demo
        const mockEncryptedReceipt = {
          id: Date.now(),
          merchantName: sampleData.merchantName,
          total: sampleData.total,
          date: sampleData.date,
          tokenId: `demo-${Date.now()}`,
          encrypted: true,
          hasAccess: true,
          encryptedData: encryptedData
        };

        setEncryptedReceipt(mockEncryptedReceipt);
        
        toast({
          title: "Encryption Successful!",
          description: "Receipt data has been encrypted using TACo PRE technology"
        });
      } else {
        const error = await response.json();
        toast({
          title: "Encryption Failed",
          description: error.message || "Could not encrypt receipt data"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Could not connect to encryption service"
      });
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Threshold PRE Encryption Demo
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Experience privacy-preserving receipt encryption powered by Threshold Network's 
          TACo technology integrated with BlockReceipt.ai
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-green-700">
              <Shield className="w-5 h-5" />
              End-to-End Encryption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Receipt data is encrypted using threshold cryptography, ensuring only 
              authorized parties can access sensitive purchase information.
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
              <Users className="w-5 h-5" />
              Granular Access Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Grant and revoke access to specific individuals without exposing 
              your private keys or compromising overall security.
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-purple-700">
              <Zap className="w-5 h-5" />
              Blockchain Native
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Seamlessly integrated with our NFT receipt system on Polygon, 
              providing decentralized privacy protection.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Demo Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Sample Data & Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Sample Receipt Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(sampleData, null, 2)}
                </pre>
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Merchant Name"
                  value={sampleData.merchantName}
                  onChange={(e) => setSampleData(prev => ({
                    ...prev,
                    merchantName: e.target.value
                  }))}
                />
                <Input
                  type="number"
                  placeholder="Total"
                  value={sampleData.total}
                  onChange={(e) => setSampleData(prev => ({
                    ...prev,
                    total: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>

              <Button 
                onClick={handleTestEncryption}
                disabled={isEncrypting}
                className="w-full"
                size="lg"
              >
                {isEncrypting ? (
                  <>
                    <Lock className="w-4 h-4 mr-2 animate-spin" />
                    Encrypting with TACo...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Test PRE Encryption
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Status */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-800">System Status</h3>
                  <p className="text-sm text-green-600">All PRE encryption services are operational</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    TACo Active
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    API Ready
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Encrypted Result */}
        <div className="space-y-6">
          {encryptedReceipt ? (
            <EncryptedReceiptCard 
              receipt={encryptedReceipt}
              userAddress="0x742d35Cc7aB2eBF5b5F1234567890ABCDef123456"
            />
          ) : (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Lock className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Encrypted Receipt Will Appear Here
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Click "Test PRE Encryption" to see how your receipt data is protected 
                  with threshold encryption technology.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Integration Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-blue-800 mb-2">
                🔐 Privacy-First Design
              </h3>
              <p className="text-sm text-blue-700">
                This demo showcases BlockReceipt.ai's integration with Threshold Network's 
                TACo technology, providing enterprise-grade privacy protection for your 
                digital receipts while maintaining full blockchain transparency.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
/**
 * Encrypted Checkout Page
 * 
 * This page provides a secure checkout experience with threshold encryption,
 * enhancing privacy and security for users' transaction data.
 */
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useQueryParams } from '@/hooks/use-query-params';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  Lock, 
  ShieldCheck, 
  Info, 
  ArrowLeft, 
  Key, 
  RefreshCw
} from 'lucide-react';
import { EncryptedCheckout } from '@/components/blockchain/EncryptedCheckout';

export default function EncryptedCheckoutPage() {
  const [isClient, setIsClient] = useState(false);
  const [_, navigate] = useLocation();
  const { amount: amountParam } = useQueryParams();
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    setIsClient(true);
    if (amountParam) {
      const parsedAmount = parseFloat(amountParam);
      if (!isNaN(parsedAmount)) {
        setAmount(parsedAmount);
      } else {
        setAmount(49.99); // Default amount
      }
    } else {
      setAmount(49.99); // Default amount
    }
  }, [amountParam]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="text-muted-foreground mb-4"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">Enhanced Security Checkout</h1>
        <p className="text-muted-foreground max-w-2xl">
          This checkout uses threshold proxy re-encryption to enhance your privacy and security
          while still allowing blockchain verification of your purchase.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EncryptedCheckout amount={amount} />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-blue-500" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex">
                <div className="bg-blue-100 rounded-full p-2 h-8 w-8 flex items-center justify-center text-blue-700 font-medium mr-3 flex-shrink-0">1</div>
                <div>
                  <p className="font-medium">Key Generation</p>
                  <p className="text-muted-foreground">Your browser generates secure encryption keys</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-blue-100 rounded-full p-2 h-8 w-8 flex items-center justify-center text-blue-700 font-medium mr-3 flex-shrink-0">2</div>
                <div>
                  <p className="font-medium">Data Encryption</p>
                  <p className="text-muted-foreground">Your payment and receipt data is encrypted client-side</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-blue-100 rounded-full p-2 h-8 w-8 flex items-center justify-center text-blue-700 font-medium mr-3 flex-shrink-0">3</div>
                <div>
                  <p className="font-medium">Blockchain Storage</p>
                  <p className="text-muted-foreground">Encrypted receipt is stored on blockchain with your keys</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-blue-100 rounded-full p-2 h-8 w-8 flex items-center justify-center text-blue-700 font-medium mr-3 flex-shrink-0">4</div>
                <div>
                  <p className="font-medium">Selective Sharing</p>
                  <p className="text-muted-foreground">You control who can access your receipt data</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Alert variant="default" className="bg-amber-50 border-amber-200">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Demo Mode</AlertTitle>
            <AlertDescription className="text-amber-700 text-sm">
              This is a demonstration of threshold encryption. In a production environment, 
              keys would be securely stored and managed with additional layers of protection.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Threshold Encryption Benefits</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-2">
                <li className="flex">
                  <ShieldCheck className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Enhanced privacy through end-to-end encryption</span>
                </li>
                <li className="flex">
                  <ShieldCheck className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Selective disclosure to third parties</span>
                </li>
                <li className="flex">
                  <ShieldCheck className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Immutable blockchain verification</span>
                </li>
                <li className="flex">
                  <ShieldCheck className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Protection against unauthorized access</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
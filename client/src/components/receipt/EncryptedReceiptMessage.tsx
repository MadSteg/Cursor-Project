import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Shield, Key, Eye, Lock } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { Link } from 'wouter';

interface EncryptedReceiptMessageProps {
  receiptId: string;
  receiptTitle?: string;
  ownerAddress?: string;
  className?: string;
}

const EncryptedReceiptMessage: React.FC<EncryptedReceiptMessageProps> = ({
  receiptId,
  receiptTitle = 'Receipt',
  ownerAddress,
  className = '',
}) => {
  const { walletAddress } = useWallet();
  
  // Check if current wallet is the owner (if owner address is provided)
  const isOwner = ownerAddress && walletAddress && 
    walletAddress.toLowerCase() === ownerAddress.toLowerCase();

  return (
    <Card className={`border-amber-200 bg-amber-50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-amber-800 flex items-center">
          <Shield className="h-5 w-5 mr-2 text-amber-600" />
          Encrypted Receipt
        </CardTitle>
        <CardDescription className="text-amber-700">
          This receipt's metadata is secured with TaCo threshold encryption.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-amber-800 mb-2">
          <Lock className="h-4 w-4 inline-block mr-1 text-amber-600" />
          Your private data is protected using advanced encryption.
        </p>
      </CardContent>
      <CardFooter className="pt-0 flex flex-wrap gap-2">
        <Link href={`/receipts/${receiptId}/keys`}>
          <Button 
            variant="outline" 
            size="sm"
            className="border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200 hover:text-amber-900"
          >
            <Key className="h-4 w-4 mr-2" />
            Access Keys
          </Button>
        </Link>
        
        <Link href={`/receipts/${receiptId}/view`}>
          <Button 
            variant="default" 
            size="sm"
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Receipt
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EncryptedReceiptMessage;
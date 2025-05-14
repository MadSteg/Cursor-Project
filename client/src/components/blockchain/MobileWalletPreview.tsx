import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import { format } from 'date-fns';
import { decryptData, encryptData } from '../../lib/thresholdCrypto';
import { Shield, Lock, Share2, CreditCard, Receipt } from 'lucide-react';

interface MobileWalletPreviewProps {
  merchant: string;
  amount: number;
  date: Date;
  nftTokenId?: string; 
  theme?: 'default' | 'luxury' | 'minimal';
  encrypted?: boolean;
  encryptedData?: string;
  sharedKey?: string;
}

export default function MobileWalletPreview({
  merchant,
  amount,
  date,
  nftTokenId,
  theme = 'default',
  encrypted = false,
  encryptedData,
  sharedKey
}: MobileWalletPreviewProps) {
  const [showPass, setShowPass] = useState(true);
  const [qrValue, setQrValue] = useState('');
  const [decryptedData, setDecryptedData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Generate QR code data
  useEffect(() => {
    // For a real implementation, this would generate a valid Apple Wallet/Google Pay pass
    const receiptData = {
      merchant,
      amount: amount.toFixed(2),
      date: date.toISOString(),
      id: nftTokenId || `rcpt_${Math.random().toString(36).slice(2, 10)}`,
      type: 'nft_receipt'
    };
    
    setQrValue(JSON.stringify(receiptData));
  }, [merchant, amount, date, nftTokenId]);
  
  // Handle decrypting data if provided
  useEffect(() => {
    if (encrypted && encryptedData) {
      try {
        // Simulate decryption (in a real app this would use the actual key)
        const mockDecrypted = {
          merchant,
          amount: amount.toFixed(2),
          date: date.toISOString(),
          tokenId: nftTokenId,
          isEncrypted: true
        };
        setDecryptedData(mockDecrypted);
      } catch (error) {
        console.error("Failed to decrypt data:", error);
      }
    }
  }, [encrypted, encryptedData, sharedKey, merchant, amount, date, nftTokenId]);

  const handleCopyShareLink = () => {
    // In a real app, this would generate a URL with the shared encryption key
    navigator.clipboard.writeText(`https://memorychain.app/share/receipt/${nftTokenId || 'demo-id'}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Theme-based styling
  const getThemeStyles = () => {
    switch (theme) {
      case 'luxury':
        return {
          background: 'bg-gradient-to-r from-gray-900 to-gray-800',
          text: 'text-white',
          accent: 'from-amber-400 to-amber-600',
          border: 'border-gray-700',
          buttonBg: 'bg-amber-500 hover:bg-amber-600',
          buttonText: 'text-gray-900',
          secondaryText: 'text-gray-300',
          logoClass: 'text-amber-400'
        };
      case 'minimal':
        return {
          background: 'bg-white',
          text: 'text-gray-900',
          accent: 'from-gray-200 to-gray-300',
          border: 'border-gray-200',
          buttonBg: 'bg-black hover:bg-gray-800',
          buttonText: 'text-white',
          secondaryText: 'text-gray-500',
          logoClass: 'text-gray-900'
        };
      default:
        return {
          background: 'bg-white',
          text: 'text-gray-900',
          accent: 'from-blue-500 to-indigo-600',
          border: 'border-gray-200',
          buttonBg: 'bg-blue-600 hover:bg-blue-700',
          buttonText: 'text-white',
          secondaryText: 'text-gray-600',
          logoClass: 'text-blue-600'
        };
    }
  };
  
  const styles = getThemeStyles();

  return (
    <div className="mx-auto max-w-[326px]">
      <div className={`${styles.background} rounded-xl shadow-lg overflow-hidden border ${styles.border}`}>
        {/* Header */}
        <div className={`p-4 relative bg-gradient-to-r ${styles.accent}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Receipt className={`w-5 h-5 mr-2 ${styles.logoClass}`} />
              <span className={`font-semibold ${styles.text}`}>Memory Chain</span>
            </div>
            {encrypted && (
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-1 text-white" />
                <span className="text-xs text-white">Encrypted</span>
              </div>
            )}
          </div>
          <div className={`mt-3 text-white text-center`}>
            <div className="text-xl font-semibold">{merchant}</div>
            <div className="text-2xl font-bold mt-1">${amount.toFixed(2)}</div>
            <div className="text-xs mt-1">{format(date, 'PPP')}</div>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-4">
          {/* QR Code */}
          <div className="flex justify-center mb-4">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <QRCodeCanvas 
                value={qrValue} 
                size={180}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                includeMargin={false}
              />
            </div>
          </div>
          
          {/* Receipt Info */}
          <div className="space-y-2">
            <div className={`flex justify-between ${styles.text}`}>
              <span className={`${styles.secondaryText} text-sm`}>Receipt ID</span>
              <span className="text-sm font-mono">{nftTokenId || 'DEMO-RECEIPT'}</span>
            </div>
            
            {encrypted && (
              <div className={`text-xs ${styles.secondaryText} bg-gray-100 p-2 rounded flex items-start`}>
                <Shield className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0 text-blue-500" />
                <span>This receipt is secured with threshold encryption for your privacy.</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className={`p-3 border-t ${styles.border}`}>
          <div className="flex space-x-2 justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex-1"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? 'Hide Pass' : 'Show Pass'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs flex items-center"
              onClick={handleCopyShareLink}
            >
              <Share2 className="w-3 h-3 mr-1" />
              {copied ? 'Copied!' : 'Share'}
            </Button>
            <Button 
              size="sm" 
              className={`text-xs ${styles.buttonBg} ${styles.buttonText} flex-1`}
            >
              Add to Wallet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { QRCodeCanvas } from 'qrcode.react';
import { format } from 'date-fns';
import { decryptData, encryptData } from '../../lib/thresholdCrypto';
import { Shield, Lock, Share2, CreditCard, Receipt } from 'lucide-react';

interface MobileWalletPreviewProps {
  merchant: string;
  amount: number;
  date?: Date;
  nftTokenId?: string; 
  theme?: 'default' | 'luxury' | 'minimal';
  encrypted?: boolean;
  encryptedData?: string;
  sharedKey?: string;
}

export default function MobileWalletPreview({
  merchant = 'Demo Merchant',
  amount = 0,
  date = new Date(),
  nftTokenId = 'demo-receipt-id',
  theme = 'default',
  encrypted = false,
  encryptedData,
  sharedKey
}: MobileWalletPreviewProps) {
  const [showPass, setShowPass] = useState(true);
  const [copied, setCopied] = useState(false);

  // Use useMemo instead of useEffect to avoid infinite loop
  const receiptData = useMemo(() => {
    const amountStr = typeof amount === 'number' ? amount.toFixed(2) : '0.00';
    const dateStr = date instanceof Date ? date.toISOString() : new Date().toISOString();
    
    return {
      merchant,
      amount: amountStr,
      date: dateStr,
      id: nftTokenId,
      type: 'nft_receipt'
    };
  }, [merchant, amount, date, nftTokenId]);
  
  // Create QR code data from receipt data
  const qrValue = useMemo(() => {
    return JSON.stringify(receiptData);
  }, [receiptData]);
  
  // Handle decrypted data
  const decryptedData = useMemo(() => {
    if (encrypted && encryptedData) {
      try {
        // In a real app, this would use the actual decryption logic with the sharedKey
        // Here we're using a mock implementation for demonstration
        return {
          ...receiptData,
          isEncrypted: true
        };
      } catch (error) {
        console.error("Failed to decrypt data:", error);
        return null;
      }
    }
    return null;
  }, [encrypted, encryptedData, receiptData]);

  const handleCopyShareLink = () => {
    // Generate a URL with the shared encryption key
    navigator.clipboard.writeText(`https://blockreceipt.ai/share/receipt/${nftTokenId || 'demo-id'}`);
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
              <span className={`font-semibold ${styles.text}`}>BlockReceipt.ai</span>
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
            <div className="text-2xl font-bold mt-1">${typeof amount === 'number' ? amount.toFixed(2) : amount.toString()}</div>
            <div className="text-xs mt-1">{date instanceof Date ? format(date, 'PPP') : new Date().toLocaleDateString()}</div>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-4">
          {/* Future of Receipts Heading */}
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">The Future of Receipts</h3>
            <p className="text-xs text-gray-600 mt-1">Forever on the blockchain, always accessible</p>
          </div>
          
          {/* Preview Graphic */}
          <div className="flex justify-center mb-4 relative">
            <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
              <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center mb-3 justify-center">
                  <CreditCard className="w-4 h-4 mr-2 text-indigo-500" />
                  <span className="text-sm font-medium text-indigo-700">NFT Receipt #{nftTokenId?.slice(-4) || '0000'}</span>
                </div>
                
                <div className="text-center mb-2">
                  <div className="text-sm font-semibold text-gray-800">{merchant}</div>
                  <div className="text-lg font-bold text-gray-900">${typeof amount === 'number' ? amount.toFixed(2) : amount.toString()}</div>
                  <div className="text-xs text-gray-500">{date instanceof Date ? format(date, 'PPP') : new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features List */}
          <div className="space-y-2 mb-2">
            <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded-md flex items-start">
              <Shield className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0 text-emerald-500" />
              <span>Secure blockchain verification with tamper-proof technology</span>
            </div>
            
            {encrypted ? (
              <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded-md flex items-start">
                <Lock className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0 text-blue-500" />
                <span>Enhanced with threshold encryption for ultimate privacy</span>
              </div>
            ) : (
              <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded-md flex items-start">
                <Share2 className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0 text-indigo-500" />
                <span>Easily shareable across devices and with others</span>
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
              Add to Apple Wallet
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
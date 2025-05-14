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
          background: 'bg-gradient-to-br from-purple-900 via-fuchsia-800 to-pink-700',
          text: 'text-white',
          accent: 'from-amber-400 via-orange-500 to-pink-500',
          border: 'border-fuchsia-700',
          buttonBg: 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500',
          buttonText: 'text-black font-bold',
          secondaryText: 'text-fuchsia-100',
          logoClass: 'text-amber-300',
          decorations: true,
          decorClass: 'animate-pulse'
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
          logoClass: 'text-gray-900',
          decorations: false
        };
      default:
        return {
          background: 'bg-gradient-to-r from-blue-600 to-indigo-700',
          text: 'text-white',
          accent: 'from-cyan-400 to-blue-500',
          border: 'border-blue-800',
          buttonBg: 'bg-blue-500 hover:bg-blue-600',
          buttonText: 'text-white',
          secondaryText: 'text-blue-100',
          logoClass: 'text-cyan-300',
          decorations: false
        };
    }
  };
  
  const styles = getThemeStyles();

  return (
    <div className="mx-auto max-w-[326px]">
      <div className={`${styles.background} rounded-xl shadow-lg overflow-hidden border ${styles.border} relative`}>
        {/* Decorative Elements for Luxury Theme */}
        {styles.decorations && (
          <>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-b from-pink-500/40 to-yellow-500/20 rounded-full blur-xl"></div>
            <div className="absolute top-1/2 -left-8 w-16 h-16 bg-gradient-to-tr from-teal-500/30 to-blue-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 right-1/2 w-24 h-24 bg-gradient-to-tr from-purple-500/30 to-pink-500/20 rounded-full blur-xl"></div>
            
            {/* Colorful Mexican-inspired patterns */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
            <div className="absolute top-2 left-0 w-2 h-full bg-gradient-to-b from-orange-500 via-yellow-500 to-red-500"></div>
            <div className="absolute top-2 right-0 w-2 h-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500"></div>
            
            {/* Star burst pattern for Jet Set Radio feel */}
            <div className="absolute right-6 top-16 w-10 h-10 rotate-12 opacity-40">
              <svg viewBox="0 0 24 24" className="w-full h-full text-yellow-300 animate-pulse">
                <path fill="currentColor" d="M12,2L15.09,8.26L22,9.27L17,14.14L18.18,21.02L12,17.77L5.82,21.02L7,14.14L2,9.27L8.91,8.26L12,2Z" />
              </svg>
            </div>
            <div className="absolute left-5 bottom-20 w-8 h-8 -rotate-12 opacity-40">
              <svg viewBox="0 0 24 24" className="w-full h-full text-pink-400 animate-spin-slow">
                <path fill="currentColor" d="M12,2L15.09,8.26L22,9.27L17,14.14L18.18,21.02L12,17.77L5.82,21.02L7,14.14L2,9.27L8.91,8.26L12,2Z" />
              </svg>
            </div>
          </>
        )}
        
        {/* Header */}
        <div className={`p-4 relative bg-gradient-to-r ${styles.accent}`}>
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center">
              <div className={`relative ${theme === 'luxury' ? 'mr-3' : 'mr-2'}`}>
                {theme === 'luxury' && (
                  <div className="absolute inset-0 -m-1 bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-300 rounded-full blur-sm animate-pulse"></div>
                )}
                <Receipt className={`w-5 h-5 relative z-10 ${styles.logoClass}`} />
              </div>
              <span className={`font-semibold ${styles.text} ${theme === 'luxury' ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200' : ''}`}>BlockReceipt.ai</span>
            </div>
            {encrypted && (
              <div className="flex items-center">
                <Lock className={`w-4 h-4 mr-1 ${theme === 'luxury' ? 'text-amber-300' : 'text-white'}`} />
                <span className={`text-xs ${theme === 'luxury' ? 'text-amber-200' : 'text-white'}`}>Encrypted</span>
              </div>
            )}
          </div>
          <div className={`mt-3 text-white text-center relative z-10`}>
            <div className="text-xl font-semibold">{merchant}</div>
            <div className="text-2xl font-bold mt-1 flex justify-center items-baseline">
              {typeof amount === 'number' ? (
                <>
                  <span className="text-xl mr-0.5">$</span>
                  <span className={theme === 'luxury' ? 'bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-300' : ''}>{amount.toFixed(2)}</span>
                </>
              ) : amount.toString()}
            </div>
            <div className="text-xs mt-1">{date instanceof Date ? format(date, 'PPP') : new Date().toLocaleDateString()}</div>
          </div>
        </div>
        
        {/* Body */}
        <div className="p-4">
          {/* Future of Receipts Heading */}
          <div className="text-center mb-4 relative">
            {theme === 'luxury' && (
              <div className="absolute inset-0 flex justify-center">
                <div className="w-32 h-8 bg-gradient-to-tr from-green-500/20 via-yellow-500/10 to-pink-500/20 blur-xl rounded-full"></div>
              </div>
            )}
            <h3 className={`text-lg font-bold bg-clip-text text-transparent ${
              theme === 'luxury' 
                ? 'bg-gradient-to-r from-red-500 via-yellow-500 to-green-500' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600'
            }`}>The Future of Receipts</h3>
            <p className={`text-xs mt-1 ${theme === 'luxury' ? 'text-amber-100' : 'text-gray-600'}`}>
              Forever on the blockchain, always accessible
            </p>
          </div>
          
          {/* Preview Graphic */}
          <div className="flex justify-center mb-4 relative">
            <div className={`${theme === 'luxury' ? 'bg-gradient-to-b from-fuchsia-950 to-purple-900' : 'bg-white'} p-3 rounded-xl shadow-lg border ${theme === 'luxury' ? 'border-fuchsia-700' : 'border-gray-100'} relative overflow-hidden`}>
              {/* Background decorations */}
              {theme === 'luxury' ? (
                <>
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-yellow-400/30 to-pink-500/30 rounded-full blur-xl"></div>
                  <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-full blur-xl"></div>
                  
                  {/* Luxury stripes */}
                  <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400"></div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400"></div>
                </>
              ) : (
                <>
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
                  <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-xl"></div>
                </>
              )}
              
              <div className="relative z-10">
                <div className="flex items-center mb-3 justify-center">
                  <CreditCard className={`w-4 h-4 mr-2 ${theme === 'luxury' ? 'text-yellow-400' : 'text-indigo-500'}`} />
                  <span className={`text-sm font-medium ${theme === 'luxury' ? 'text-amber-300' : 'text-indigo-700'}`}>
                    NFT Receipt #{nftTokenId?.slice(-4) || '0000'}
                  </span>
                </div>
                
                <div className="text-center mb-2">
                  <div className={`text-sm font-semibold ${theme === 'luxury' ? 'text-white' : 'text-gray-800'}`}>{merchant}</div>
                  <div className={`text-lg font-bold ${theme === 'luxury' ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300' : 'text-gray-900'}`}>
                    {typeof amount === 'number' ? `$${amount.toFixed(2)}` : amount.toString()}
                  </div>
                  <div className={`text-xs ${theme === 'luxury' ? 'text-fuchsia-300' : 'text-gray-500'}`}>
                    {date instanceof Date ? format(date, 'PPP') : new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features List */}
          <div className="space-y-2 mb-2">
            <div className={`text-xs ${theme === 'luxury' ? 'text-white bg-gradient-to-r from-purple-800 to-fuchsia-800' : 'text-gray-700 bg-gray-50'} p-2 rounded-md flex items-start relative overflow-hidden`}>
              {theme === 'luxury' && (
                <>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400"></div>
                  <div className="absolute -right-1 -bottom-2 w-8 h-8 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-md"></div>
                </>
              )}
              <Shield className={`w-3 h-3 mr-1 mt-0.5 flex-shrink-0 ${theme === 'luxury' ? 'text-yellow-400' : 'text-emerald-500'} relative z-10`} />
              <span className="relative z-10">Secure blockchain verification with tamper-proof technology</span>
            </div>
            
            {encrypted ? (
              <div className={`text-xs ${theme === 'luxury' ? 'text-white bg-gradient-to-r from-blue-800 to-indigo-800' : 'text-gray-700 bg-gray-50'} p-2 rounded-md flex items-start relative overflow-hidden`}>
                {theme === 'luxury' && (
                  <>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"></div>
                    <div className="absolute -left-1 -bottom-2 w-8 h-8 bg-gradient-to-bl from-indigo-500/30 to-blue-500/30 rounded-full blur-md"></div>
                  </>
                )}
                <Lock className={`w-3 h-3 mr-1 mt-0.5 flex-shrink-0 ${theme === 'luxury' ? 'text-cyan-400' : 'text-blue-500'} relative z-10`} />
                <span className="relative z-10">Enhanced with threshold encryption for ultimate privacy</span>
              </div>
            ) : (
              <div className={`text-xs ${theme === 'luxury' ? 'text-white bg-gradient-to-r from-green-800 to-emerald-800' : 'text-gray-700 bg-gray-50'} p-2 rounded-md flex items-start relative overflow-hidden`}>
                {theme === 'luxury' && (
                  <>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400"></div>
                    <div className="absolute -left-1 -bottom-2 w-8 h-8 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full blur-md"></div>
                  </>
                )}
                <Share2 className={`w-3 h-3 mr-1 mt-0.5 flex-shrink-0 ${theme === 'luxury' ? 'text-green-400' : 'text-indigo-500'} relative z-10`} />
                <span className="relative z-10">Easily shareable across devices and with others</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className={`p-3 border-t ${styles.border} relative ${theme === 'luxury' ? 'overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900' : ''}`}>
          {theme === 'luxury' && (
            <>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.1),transparent_30%)]"></div>
              <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-300/5 rounded-full blur-lg animate-spin-slow"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400"></div>
            </>
          )}
          
          <div className="flex space-x-2 justify-between relative z-10">
            <Button 
              variant={theme === 'luxury' ? 'outline' : 'outline'}
              size="sm" 
              className={`text-xs flex-1 ${
                theme === 'luxury' 
                  ? 'border-amber-500/50 text-amber-300 hover:text-amber-200 hover:bg-amber-950/40 shadow-inner' 
                  : ''
              }`}
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? 'Hide Pass' : 'Show Pass'}
            </Button>
            <Button 
              variant={theme === 'luxury' ? 'outline' : 'outline'}
              size="sm" 
              className={`text-xs flex items-center ${
                theme === 'luxury' 
                  ? 'border-amber-500/50 text-amber-300 hover:text-amber-200 hover:bg-amber-950/40 shadow-inner' 
                  : ''
              }`}
              onClick={handleCopyShareLink}
            >
              <Share2 className={`w-3 h-3 mr-1 ${theme === 'luxury' ? 'text-amber-400' : ''}`} />
              {copied ? 'Copied!' : 'Share'}
            </Button>
            <Button 
              size="sm" 
              className={`text-xs ${theme === 'luxury' 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-black font-bold relative overflow-hidden'
                : `${styles.buttonBg} ${styles.buttonText}`} flex-1`}
            >
              {theme === 'luxury' && (
                <>
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-400 opacity-30 blur-sm"></div>
                  <div className="absolute right-0 top-0 h-8 w-8 bg-white/20 rounded-full blur-sm"></div>
                  <div className="absolute left-1 top-1 h-2 w-2 bg-yellow-300 rounded-full animate-pulse"></div>
                </>
              )}
              <span className="relative z-10">Add to Apple Wallet</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
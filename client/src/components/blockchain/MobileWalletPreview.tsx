import React from 'react';
import { Smartphone, Watch, ShoppingBag, QrCode } from 'lucide-react';

interface MobileWalletPreviewProps {
  theme?: 'default' | 'dark' | 'light' | 'colorful';
  merchantName?: string;
  amount?: string;
  date?: Date;
}

export function MobileWalletPreview({ 
  theme = 'default', 
  merchantName = 'Whole Foods Market',
  amount = '$29.99',
  date = new Date()
}: MobileWalletPreviewProps) {

  // Theme configurations
  const themes = {
    default: {
      bg: 'bg-gradient-to-b from-blue-600 to-blue-800',
      textPrimary: 'text-white',
      textSecondary: 'text-blue-100',
      border: 'border-blue-500'
    },
    dark: {
      bg: 'bg-gradient-to-b from-gray-800 to-gray-900',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      border: 'border-gray-700'
    },
    light: {
      bg: 'bg-gradient-to-b from-gray-100 to-white',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-500',
      border: 'border-gray-200'
    },
    colorful: {
      bg: 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500',
      textPrimary: 'text-white',
      textSecondary: 'text-pink-100',
      border: 'border-pink-400'
    }
  };

  const currentTheme = themes[theme];
  const formattedDate = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Receipt in Mobile Wallet</h4>
      
      {/* Mobile Wallet Card Preview */}
      <div className={`relative w-full max-w-xs mx-auto rounded-xl overflow-hidden shadow-lg ${currentTheme.bg} border ${currentTheme.border}`}>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className={`${currentTheme.textSecondary} text-xs`}>RECEIPT</p>
              <h3 className={`${currentTheme.textPrimary} font-bold text-lg`}>{merchantName}</h3>
              <p className={`${currentTheme.textSecondary} text-xs mt-1`}>{formattedDate}</p>
            </div>
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-end">
            <div>
              <p className={`${currentTheme.textSecondary} text-xs`}>TOTAL</p>
              <p className={`${currentTheme.textPrimary} text-xl font-bold`}>{amount}</p>
            </div>
            <QrCode className={`h-8 w-8 ${currentTheme.textPrimary} opacity-70`} />
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-black/5 flex justify-center items-center">
          <div className="w-12 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>
      
      {/* Device Integration */}
      <div className="flex justify-center space-x-4 mt-2">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Smartphone className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-xs mt-1 text-muted-foreground">iPhone</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Watch className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-xs mt-1 text-muted-foreground">Apple Watch</span>
        </div>
      </div>
    </div>
  );
}

export function MobileWalletInfo() {
  return (
    <div className="mt-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 rounded-full bg-blue-600 flex-shrink-0"></div>
        <span className="text-sm font-medium text-blue-800">Mobile Wallet Integration</span>
      </div>
      <p className="text-xs text-blue-700">
        Your blockchain receipt will be available to add to your Apple Wallet or Google Pay, 
        allowing you to display it on your phone or smartwatch just like boarding passes.
      </p>
    </div>
  );
}
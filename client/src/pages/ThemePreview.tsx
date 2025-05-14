import { useState } from 'react';
import MobileWalletPreview from '@/components/blockchain/MobileWalletPreview';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ThemePreview() {
  const [theme, setTheme] = useState<'default' | 'luxury' | 'minimal'>('luxury');
  
  const sampleReceipt = {
    merchant: 'Apple Store',
    amount: 1299.99,
    date: new Date(),
    nftTokenId: '0x123456789',
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500">
        Receipt Theme Preview
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-4 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Theme Controls</h2>
          
          <div className="mb-8">
            <Tabs defaultValue="luxury" onValueChange={(value) => setTheme(value as any)}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="default">Default</TabsTrigger>
                <TabsTrigger value="luxury">Luxury</TabsTrigger>
                <TabsTrigger value="minimal">Minimal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="default">
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-bold mb-2">Default Theme</h3>
                  <p className="text-sm text-gray-700">Standard blockchain receipt with basic styling.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="luxury">
                <div className="p-4 bg-gradient-to-r from-purple-900 to-fuchsia-800 rounded-lg text-white">
                  <h3 className="font-bold mb-2">Luxury Theme ($5.00)</h3>
                  <p className="text-sm">Premium animated theme with gold accents and vibrant colors.</p>
                  <div className="mt-2 flex gap-2">
                    <div className="px-2 py-1 bg-yellow-400/20 rounded text-xs text-yellow-300">Animated</div>
                    <div className="px-2 py-1 bg-amber-400/20 rounded text-xs text-amber-300">Premium</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="minimal">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                  <h3 className="font-bold mb-2">Minimal Theme</h3>
                  <p className="text-sm text-gray-700">Clean, minimalist design for a professional look.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Theme Features:</h3>
            {theme === 'luxury' ? (
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full text-white text-xs">✓</span>
                  Animated star bursts and sparkles
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full text-white text-xs">✓</span>
                  Gold gradient accents throughout
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full text-white text-xs">✓</span>
                  Mexican art inspired color patterns
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full text-white text-xs">✓</span>
                  Glowing "Add to Apple Wallet" button
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full text-white text-xs">✓</span>
                  Apple Wallet integration
                </li>
              </ul>
            ) : theme === 'minimal' ? (
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-200 rounded-full text-gray-700 text-xs">✓</span>
                  Clean, distraction-free design
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-200 rounded-full text-gray-700 text-xs">✓</span>
                  Monochromatic color scheme
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-gray-200 rounded-full text-gray-700 text-xs">✓</span>
                  Focused on readability
                </li>
              </ul>
            ) : (
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-blue-100 rounded-full text-blue-700 text-xs">✓</span>
                  Standard blockchain verification
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-blue-100 rounded-full text-blue-700 text-xs">✓</span>
                  Blue color scheme
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 mr-2 inline-flex items-center justify-center bg-blue-100 rounded-full text-blue-700 text-xs">✓</span>
                  Basic styling
                </li>
              </ul>
            )}
          </div>
        </Card>
        
        <div className="flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-xl p-8">
          <MobileWalletPreview
            merchant={sampleReceipt.merchant}
            amount={sampleReceipt.amount}
            date={sampleReceipt.date}
            nftTokenId={sampleReceipt.nftTokenId}
            theme={theme}
            encrypted={false}
          />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="mx-2"
        >
          Back to App
        </Button>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mx-2"
          onClick={() => setTheme('luxury')}
        >
          View Luxury Theme
        </Button>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { useToast } from '../hooks/use-toast';

const MerchantDemo: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pos');
  const [posSystem, setPosSystem] = useState('cvs');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState({
    merchantName: 'CVS Pharmacy',
    location: '123 Main St, San Francisco, CA',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    total: '24.99',
    items: [
      { name: 'Vitamins C 1000mg', price: '12.99', quantity: 1 },
      { name: 'Pain Relief Tablets', price: '8.99', quantity: 1 },
      { name: 'Bottled Water', price: '1.49', quantity: 2 }
    ]
  });
  
  const [demoStats, setDemoStats] = useState({
    paperSaved: 0,
    mintedReceipts: 0,
    returnTime: '00:00',
    customerNPS: '+0'
  });
  
  const handleProcessTransaction = () => {
    toast({
      title: 'Transaction Processed!',
      description: 'Receipt data sent to blockchain for minting.',
    });
    
    // Update demo stats
    setDemoStats({
      paperSaved: demoStats.paperSaved + 1,
      mintedReceipts: demoStats.mintedReceipts + 1,
      returnTime: '00:14', // 14 seconds
      customerNPS: '+8'
    });
    
    // Show success dialog after a delay
    setTimeout(() => {
      setShowSuccessDialog(true);
    }, 1500);
  };
  
  const renderPOSDemo = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>POS Terminal</CardTitle>
              <CardDescription>Complete the transaction with a digital receipt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-4">{receiptDetails.merchantName}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{receiptDetails.location}</p>
                  <p className="text-sm text-muted-foreground mb-4">{receiptDetails.date} {receiptDetails.time}</p>
                  
                  <div className="border-t border-b border-gray-200 dark:border-gray-700 py-3 my-3">
                    {receiptDetails.items.map((item, index) => (
                      <div key={index} className="flex justify-between py-1">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                        </div>
                        <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between font-bold mt-4">
                    <span>Total</span>
                    <span>${receiptDetails.total}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="digitalReceipt"
                      name="receiptType"
                      className="w-4 h-4 text-indigo-600 border-gray-300"
                      defaultChecked
                    />
                    <label htmlFor="digitalReceipt" className="ml-2 block text-sm font-medium">
                      BlockReceipt Digital Receipt (NFT)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="paperReceipt"
                      name="receiptType"
                      className="w-4 h-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor="paperReceipt" className="ml-2 block text-sm font-medium">
                      Traditional Paper Receipt
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="emailReceipt"
                      name="receiptType"
                      className="w-4 h-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor="emailReceipt" className="ml-2 block text-sm font-medium">
                      Email Receipt
                    </label>
                  </div>
                </div>
                
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                  <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2">BlockReceipt Benefits</h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <div className="h-5 w-5 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                      <span className="text-indigo-700 dark:text-indigo-300">Secure, immutable proof of purchase</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                      <span className="text-indigo-700 dark:text-indigo-300">Easy returns (no paper needed)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 bg-indigo-500 rounded-full flex items-center justify-center text-white mr-2 flex-shrink-0 mt-0.5">✓</div>
                      <span className="text-indigo-700 dark:text-indigo-300">Eco-friendly (saves paper)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button 
                onClick={handleProcessTransaction}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
              >
                Process Transaction
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>POS Integration</CardTitle>
              <CardDescription>Choose your POS system</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={posSystem} onValueChange={setPosSystem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select POS system" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cvs">CVS Pharmacy (NCR)</SelectItem>
                  <SelectItem value="dunkin">Dunkin' (Oracle Micros)</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="shopify">Shopify POS</SelectItem>
                  <SelectItem value="clover">Clover</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Pilot Results</CardTitle>
              <CardDescription>Real-time metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Paper Receipts Saved</Label>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{demoStats.paperSaved}</div>
                </div>
                <div>
                  <Label>NFTs Minted</Label>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{demoStats.mintedReceipts}</div>
                </div>
                <div>
                  <Label>Avg. Return Processing Time</Label>
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{demoStats.returnTime}</div>
                </div>
                <div>
                  <Label>Customer NPS Change</Label>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{demoStats.customerNPS}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderSetupSteps = () => {
    return (
      <div className="space-y-8">
        <h3 className="text-2xl font-bold">POS Integration Guide</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Step 1: API Setup</CardTitle>
              <CardDescription>Configure your POS connection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input id="apiKey" placeholder="xxx-xxxxx-xxxxx-xxxxx" />
                </div>
                <div>
                  <Label htmlFor="posEndpoint">POS Endpoint</Label>
                  <Input id="posEndpoint" placeholder="https://your-pos-system.com/api" />
                </div>
                <div>
                  <Label htmlFor="callbackUrl">Callback URL</Label>
                  <Input id="callbackUrl" value="https://blockreceipt.ai/api/callback" readOnly />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Validate Connection</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Receipt Template</CardTitle>
              <CardDescription>Customize your digital receipt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="merchantLogo">Upload Merchant Logo</Label>
                  <Input id="merchantLogo" type="file" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="primaryColor">Primary Brand Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input id="primaryColor" type="color" className="w-16 h-10" defaultValue="#5046e5" />
                    <Input value="#5046e5" className="flex-1" readOnly />
                  </div>
                </div>
                <div>
                  <Label htmlFor="receiptFooter">Receipt Footer Text</Label>
                  <Input id="receiptFooter" placeholder="Thank you for shopping with us!" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Save Template</Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Deploy to Stores</CardTitle>
            <CardDescription>Roll out BlockReceipt to your locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label>Deployment Method</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="font-bold mb-2">Phased Rollout</div>
                    <p className="text-sm text-muted-foreground">
                      Start with select flagship stores in tech-forward markets
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <div className="font-bold mb-2">Full Deployment</div>
                    <p className="text-sm text-muted-foreground">
                      Deploy simultaneously across all store locations
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Store Selection</Label>
                <div className="mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 h-32 overflow-y-auto">
                  <div className="space-y-2">
                    {[
                      'San Francisco - Market St',
                      'Los Angeles - Santa Monica',
                      'New York - Times Square',
                      'Austin - Downtown',
                      'Miami - South Beach',
                      'Chicago - Michigan Ave',
                      'Seattle - Capitol Hill',
                      'Denver - 16th Street'
                    ].map((store, i) => (
                      <div key={i} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`store-${i}`}
                          className="w-4 h-4 text-indigo-600 border-gray-300"
                        />
                        <label htmlFor={`store-${i}`} className="ml-2 block text-sm font-medium">
                          {store}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Timeline</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="font-bold mb-1">Phase 1 (30 Days)</div>
                    <p className="text-sm text-muted-foreground">
                      Staff training and infrastructure setup
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="font-bold mb-1">Phase 2 (60 Days)</div>
                    <p className="text-sm text-muted-foreground">
                      Pilot launch with metrics tracking
                    </p>
                  </div>
                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="font-bold mb-1">Phase 3 (90 Days)</div>
                    <p className="text-sm text-muted-foreground">
                      Full rollout based on pilot results
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Schedule Deployment</Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  const renderROICalculator = () => {
    return (
      <div className="space-y-8">
        <h3 className="text-2xl font-bold">ROI Calculator</h3>
        <p className="text-muted-foreground">Calculate your savings with BlockReceipt</p>
        
        <Card>
          <CardHeader>
            <CardTitle>Business Parameters</CardTitle>
            <CardDescription>Enter your company details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="storeCount">Number of Store Locations</Label>
                <Input id="storeCount" type="number" defaultValue="1000" />
              </div>
              <div>
                <Label htmlFor="dailyTransactions">Avg. Daily Transactions per Store</Label>
                <Input id="dailyTransactions" type="number" defaultValue="500" />
              </div>
              <div>
                <Label htmlFor="paperCost">Cost per Paper Receipt ($)</Label>
                <Input id="paperCost" type="number" step="0.001" defaultValue="0.015" />
              </div>
              <div>
                <Label htmlFor="maintenanceCost">Monthly Printer Maintenance ($)</Label>
                <Input id="maintenanceCost" type="number" defaultValue="100" />
              </div>
              <div>
                <Label htmlFor="adoptionRate">Expected Digital Adoption Rate (%)</Label>
                <Input id="adoptionRate" type="number" defaultValue="30" />
              </div>
              <div>
                <Label htmlFor="fraudReduction">Expected Fraud Reduction (%)</Label>
                <Input id="fraudReduction" type="number" defaultValue="20" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-300">Projected Annual Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h4 className="font-bold text-lg mb-2">Paper & Equipment</h4>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">$2,737,500</div>
                <p className="text-sm text-muted-foreground mt-2">Based on transaction volume and adoption rate</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h4 className="font-bold text-lg mb-2">Fraud Reduction</h4>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">$500,000</div>
                <p className="text-sm text-muted-foreground mt-2">From reduced return fraud and disputes</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h4 className="font-bold text-lg mb-2">Total ROI</h4>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">$3,237,500</div>
                <p className="text-sm text-muted-foreground mt-2">First-year projected savings</p>
              </div>
            </div>
            
            <div className="mt-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h4 className="font-bold text-lg mb-4">Environmental Impact</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">54,750,000</div>
                  <p className="text-sm text-muted-foreground">Paper receipts saved</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">2,190</div>
                  <p className="text-sm text-muted-foreground">Tons of paper eliminated</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">9,125</div>
                  <p className="text-sm text-muted-foreground">Trees preserved</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-gradient-to-r from-green-600 to-teal-600">Download Full Report</Button>
          </CardFooter>
        </Card>
      </div>
    );
  };
  
  // Success Dialog Content
  const SuccessDialog = () => (
    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Digital Receipt Created!</DialogTitle>
          <DialogDescription>
            The receipt has been minted as an NFT and added to the customer's wallet.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-lg my-4 text-center">
          <div className="mb-2 text-indigo-600 dark:text-indigo-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-1">Transaction Complete</h3>
          <p className="text-muted-foreground">Transaction ID: 0x8f72b...4e21</p>
          
          <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <h4 className="font-bold text-sm mb-2">Customer reward received:</h4>
            <div className="flex items-center justify-center gap-2">
              <div className="h-10 w-10 bg-amber-500 rounded-full flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span className="font-bold text-amber-600 dark:text-amber-400">Legendary Bulldog NFT Unlocked!</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => setShowSuccessDialog(false)}>
            Close
          </Button>
          <Button onClick={() => setShowSuccessDialog(false)}>
            Process Another
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 brand-gradient-text">Merchant POS Integration</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Experience how BlockReceipt integrates seamlessly with retail point-of-sale systems
        </p>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="/">
            <Button variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Button>
          </Link>
          <Link href="/enterprise">
            <Button>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Enterprise Solutions
            </Button>
          </Link>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="pos">POS Demo</TabsTrigger>
          <TabsTrigger value="setup">Integration Steps</TabsTrigger>
          <TabsTrigger value="roi">ROI Calculator</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pos" className="space-y-6">
          {renderPOSDemo()}
        </TabsContent>
        
        <TabsContent value="setup" className="space-y-6">
          {renderSetupSteps()}
        </TabsContent>
        
        <TabsContent value="roi" className="space-y-6">
          {renderROICalculator()}
        </TabsContent>
      </Tabs>
      
      {/* Success Dialog */}
      <SuccessDialog />
    </div>
  );
};

export default MerchantDemo;
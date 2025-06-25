import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Store,
  CreditCard,
  Settings,
  BarChart3,
  Zap
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  estimatedTime: string;
}

export default function MerchantOnboarding() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: 'cafe',
    averageTransactions: 100,
    currentPOS: 'square',
    integrationType: 'api'
  });

  const [steps] = useState<OnboardingStep[]>([
    {
      id: 'business-info',
      title: 'Business Information',
      description: 'Provide basic business details and contact information',
      completed: false,
      required: true,
      estimatedTime: '3 minutes'
    },
    {
      id: 'pos-integration',
      title: 'POS Integration',
      description: 'Choose your integration method and configure settings',
      completed: false,
      required: true,
      estimatedTime: '10 minutes'
    },
    {
      id: 'testing',
      title: 'Test Transaction',
      description: 'Process a test receipt to verify integration',
      completed: false,
      required: true,
      estimatedTime: '5 minutes'
    },
    {
      id: 'go-live',
      title: 'Go Live',
      description: 'Activate your account and start accepting BlockReceipts',
      completed: false,
      required: true,
      estimatedTime: '2 minutes'
    }
  ]);

  const handleSubmitApplication = async () => {
    setLoading(true);
    try {
      const applicationData = {
        ...formData,
        settings: {
          customBranding: true,
          rewardMultiplier: 1.0,
          specialItems: [],
          notificationPreferences: {
            customerEngagement: true,
            analytics: true,
            systemUpdates: true
          }
        }
      };

      const response = await apiRequest('POST', '/api/merchants/apply', applicationData);
      const result = await response.json();

      if (result.success) {
        toast({
          title: "Application Submitted",
          description: "Your merchant application has been submitted for review",
        });
        setCurrentStep(1);
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Unable to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderBusinessInfoStep = () => (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Store className="h-5 w-5 text-blue-400" />
          Business Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-slate-300">Business Name</Label>
            <Input
              value={formData.businessName}
              onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              placeholder="Downtown Coffee Co."
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-300">Contact Name</Label>
            <Input
              value={formData.contactName}
              onChange={(e) => setFormData({...formData, contactName: e.target.value})}
              placeholder="John Smith"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-300">Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="john@business.com"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <Label className="text-slate-300">Phone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+1-555-0123"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
        </div>

        <div>
          <Label className="text-slate-300">Business Type</Label>
          <select
            value={formData.businessType}
            onChange={(e) => setFormData({...formData, businessType: e.target.value})}
            className="w-full p-3 mt-1 bg-slate-700 border border-slate-600 rounded-md text-white"
          >
            <option value="cafe">Cafe/Coffee Shop</option>
            <option value="restaurant">Restaurant</option>
            <option value="retail">Retail Store</option>
            <option value="grocery">Grocery Store</option>
            <option value="gas-station">Gas Station</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <Label className="text-slate-300">Average Daily Transactions</Label>
          <Input
            type="number"
            value={formData.averageTransactions}
            onChange={(e) => setFormData({...formData, averageTransactions: parseInt(e.target.value)})}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <Button 
          onClick={handleSubmitApplication}
          disabled={loading || !formData.businessName || !formData.email}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit Application"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );

  const renderPOSIntegrationStep = () => (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <CreditCard className="h-5 w-5 text-green-400" />
          POS Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span className="font-semibold text-green-400">Application Approved</span>
          </div>
          <p className="text-sm text-green-300">
            Your merchant application has been approved. You can now proceed with POS integration.
          </p>
        </div>

        <div>
          <Label className="text-slate-300">Current POS System</Label>
          <select
            value={formData.currentPOS}
            onChange={(e) => setFormData({...formData, currentPOS: e.target.value})}
            className="w-full p-3 mt-1 bg-slate-700 border border-slate-600 rounded-md text-white"
          >
            <option value="square">Square</option>
            <option value="clover">Clover</option>
            <option value="shopify">Shopify POS</option>
            <option value="toast">Toast</option>
            <option value="lightspeed">Lightspeed</option>
            <option value="other">Other/Custom</option>
          </select>
        </div>

        <div>
          <Label className="text-slate-300">Integration Type</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
            {[
              { value: 'api', label: 'API Integration', desc: 'Full automation' },
              { value: 'plugin', label: 'POS Plugin', desc: 'One-click setup' },
              { value: 'manual', label: 'Manual Entry', desc: 'Simple start' }
            ].map(option => (
              <div
                key={option.value}
                onClick={() => setFormData({...formData, integrationType: option.value})}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.integrationType === option.value
                    ? 'border-blue-500 bg-blue-900/30'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="font-semibold text-white">{option.label}</div>
                <div className="text-sm text-slate-400">{option.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-900/30 border border-blue-700 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-400 mb-2">Integration Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">API Key:</span>
              <span className="font-mono text-blue-300">br_live_abc123...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Webhook URL:</span>
              <span className="font-mono text-blue-300">https://api.blockreceipt.ai/webhook/merchant_001</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => setCurrentStep(2)}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Configure Integration
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );

  const renderTestingStep = () => (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Settings className="h-5 w-5 text-purple-400" />
          Test Transaction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-slate-300">
          Process a test transaction to ensure BlockReceipt integration is working correctly.
        </p>

        <div className="bg-slate-700 p-4 rounded-lg">
          <h4 className="font-semibold text-white mb-3">Test Transaction Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Amount:</span>
              <span className="text-white">$5.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Customer Phone:</span>
              <span className="text-white">+1-555-TEST</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Items:</span>
              <span className="text-white">Test Coffee</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => {
            toast({
              title: "Test Transaction Successful",
              description: "Digital receipt created successfully for test customer",
            });
            setCurrentStep(3);
          }}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          <Zap className="h-4 w-4 mr-2" />
          Process Test Transaction
        </Button>
      </CardContent>
    </Card>
  );

  const renderGoLiveStep = () => (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <BarChart3 className="h-5 w-5 text-green-400" />
          Ready to Go Live
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-900/30 border border-green-700 p-4 rounded-lg">
          <h4 className="font-semibold text-green-400 mb-2">Setup Complete</h4>
          <p className="text-sm text-green-300">
            Your digital receipt integration is ready. You can now start offering digital receipts to customers.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">$0.005</div>
            <div className="text-sm text-slate-400">Cost per receipt</div>
          </div>
          <div className="bg-slate-700 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-white">94%</div>
            <div className="text-sm text-slate-400">Cost savings</div>
          </div>
        </div>

        <Button 
          onClick={() => {
            toast({
              title: "Merchant Account Activated",
              description: "Welcome to digital receipt management! Start offering digital receipts today.",
            });
          }}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Activate Account
        </Button>
      </CardContent>
    </Card>
  );

  const stepComponents = [
    renderBusinessInfoStep,
    renderPOSIntegrationStep,
    renderTestingStep,
    renderGoLiveStep
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-white">
            Merchant Onboarding
          </h1>
          <p className="text-xl text-slate-300">
            Get started with digital receipt management in just a few simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                  ${index <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-slate-400'
                  }
                `}>
                  {index < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-1">
              {steps[currentStep]?.title}
            </h2>
            <p className="text-slate-400 text-sm">
              {steps[currentStep]?.description}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-500">
                {steps[currentStep]?.estimatedTime}
              </span>
            </div>
          </div>
        </div>

        {/* Current Step Content */}
        {stepComponents[currentStep]?.()}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useLocation } from 'wouter';

// Signup form schema
const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  wantsWallet: z.boolean().default(false),
  tacoPublicKey: z.string().optional(),
});

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Please enter your password' }),
});

// Wallet login schema
const walletLoginSchema = z.object({
  walletAddress: z.string(),
  signature: z.string(),
  nonce: z.string(),
});

type SignupFormValues = z.infer<typeof signupSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;
type WalletLoginValues = z.infer<typeof walletLoginSchema>;

export default function SignInPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('email');
  const [isSignup, setIsSignup] = useState(false);
  const [walletGenerated, setWalletGenerated] = useState(false);
  const [generatedWallet, setGeneratedWallet] = useState<{ address: string; privateKey: string } | null>(null);
  
  // Signup form
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      wantsWallet: false,
      tacoPublicKey: '',
    },
  });
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Handle signup
  const onSignup = async (values: SignupFormValues) => {
    try {
      // Generate TACo public key if user wants a wallet
      let tacoPublicKey = null;
      if (values.wantsWallet) {
        const response = await apiRequest('GET', '/api/taco/generate-key');
        const keyData = await response.json();
        tacoPublicKey = keyData.publicKey;
      }
      
      // Send signup request
      const response = await apiRequest('POST', '/api/auth/signup', {
        ...values,
        tacoPublicKey,
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Account created',
          description: 'Your account has been created successfully.',
          variant: 'default',
        });
        
        // If wallet was created, show it to the user
        if (data.wallet) {
          setGeneratedWallet({
            address: data.wallet.address,
            privateKey: 'Your private key is securely encrypted with TACo',
          });
          setWalletGenerated(true);
        } else {
          // Redirect to dashboard
          setLocation('/dashboard');
        }
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to create account',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while creating your account. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle login
  const onLogin = async (values: LoginFormValues) => {
    try {
      const response = await apiRequest('POST', '/api/auth/login', values);
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Welcome back',
          description: 'You have been logged in successfully.',
          variant: 'default',
        });
        
        // Redirect to dashboard
        setLocation('/dashboard');
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to login',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while logging in. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Handle wallet connection (MetaMask)
  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (!(window as any).ethereum) {
        toast({
          title: 'MetaMask Required',
          description: 'Please install MetaMask to use this feature.',
          variant: 'destructive',
        });
        return;
      }
      
      // Request account access
      const accounts = await (window as any).ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts.length === 0) {
        toast({
          title: 'No accounts found',
          description: 'Please unlock your MetaMask and connect an account.',
          variant: 'destructive',
        });
        return;
      }
      
      const walletAddress = accounts[0];
      
      // Get nonce from server
      const nonceResponse = await apiRequest('GET', `/api/auth/nonce/${walletAddress}`);
      const nonceData = await nonceResponse.json();
      
      if (!nonceData.success) {
        toast({
          title: 'Error',
          description: 'Failed to get authentication nonce.',
          variant: 'destructive',
        });
        return;
      }
      
      // Sign message with MetaMask
      const message = nonceData.message;
      const signature = await (window as any).ethereum.request({
        method: 'personal_sign',
        params: [message, walletAddress],
      });
      
      // Send signature to server for verification
      const authResponse = await apiRequest('POST', '/api/auth/web3-login', {
        walletAddress,
        signature,
        nonce: nonceData.nonce,
      });
      
      const authData = await authResponse.json();
      
      if (authData.success) {
        toast({
          title: 'Wallet connected',
          description: 'You have been logged in with your wallet.',
          variant: 'default',
        });
        
        // Redirect to dashboard
        setLocation('/dashboard');
      } else {
        toast({
          title: 'Authentication Failed',
          description: authData.error || 'Failed to authenticate with wallet.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Wallet login error:', error);
      toast({
        title: 'Connection Failed',
        description: 'An error occurred while connecting your wallet.',
        variant: 'destructive',
      });
    }
  };
  
  // Continue to dashboard after wallet generation
  const continueToApp = () => {
    setLocation('/dashboard');
  };
  
  // Toggle between login and signup
  const toggleSignup = () => {
    setIsSignup(!isSignup);
  };
  
  // If wallet was generated, show success state
  if (walletGenerated && generatedWallet) {
    return (
      <div className="container mx-auto max-w-md py-12">
        <Card>
          <CardHeader>
            <CardTitle>🎉 Welcome to BlockReceipt!</CardTitle>
            <CardDescription>Your wallet has been created successfully</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Your Ethereum wallet address:</h3>
                <code className="block p-3 bg-secondary rounded mt-2 text-xs overflow-x-auto break-all">
                  {generatedWallet.address}
                </code>
              </div>
              
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertTitle className="text-yellow-800">Important!</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  Your private key is encrypted and stored securely. This wallet will be used to collect your NFT receipts.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={continueToApp} className="w-full">
              Continue to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-md py-12">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to BlockReceipt</CardTitle>
          <CardDescription>
            Sign in to manage your digital receipts on the blockchain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  {isSignup ? 'Create an Account' : 'Login to Your Account'}
                </h3>
                <Button variant="link" onClick={toggleSignup}>
                  {isSignup ? 'Already have an account?' : 'Need an account?'}
                </Button>
              </div>
              
              {isSignup ? (
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={signupForm.control}
                      name="wantsWallet"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Create a free Ethereum wallet for me
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              We'll generate a secure wallet that's encrypted with Threshold Encryption
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Create Account
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Sign In
                    </Button>
                  </form>
                </Form>
              )}
            </TabsContent>
            
            <TabsContent value="wallet" className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Connect Web3 Wallet</h3>
              <div className="text-sm text-muted-foreground pb-4">
                Connect your MetaMask wallet to sign in. This provides the strongest security for your BlockReceipt account.
              </div>
              
              <Button onClick={connectWallet} className="w-full">
                Connect MetaMask
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
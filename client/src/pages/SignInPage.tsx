import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { ethers } from 'ethers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { useWeb3 } from '@/contexts/Web3Context';
import { useWalletConnect } from '@/hooks/useWalletConnect';
import WalletButton from '@/components/blockchain/WalletButton';
import DevModeWalletButton from '@/components/blockchain/DevModeWalletButton';

// Define form validation schemas
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const signupSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
  wantsWallet: z.boolean().default(true),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Initialize form for login
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  // Initialize form for signup
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      wantsWallet: true,
    },
  });

  // Handle login form submission
  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const response = await apiRequest('POST', '/api/auth/login', values);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Login failed');
      }
      
      toast({
        title: 'Login Successful',
        description: 'Welcome back to BlockReceipt',
      });
      
      // Redirect to home page after successful login
      setLocation('/');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: error.message || 'An error occurred during login',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle signup form submission
  const onSignupSubmit = async (values: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...signupData } = values;
      
      const response = await apiRequest('POST', '/api/auth/signup', signupData);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Signup failed');
      }
      
      toast({
        title: 'Account Created',
        description: 'Your BlockReceipt account has been created successfully',
      });
      
      // If user requested a wallet, show toast with wallet info
      if (values.wantsWallet && data.wallet) {
        toast({
          title: 'Wallet Created',
          description: `Your wallet address: ${data.wallet.address.substring(0, 8)}...${data.wallet.address.substring(data.wallet.address.length - 6)}`,
        });
      }
      
      // Redirect to home page after successful signup
      setLocation('/');
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: 'Signup Failed',
        description: error.message || 'An error occurred during signup',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Use the useWalletConnect hook
  const { 
    walletAddress, 
    signMessage,
    connectionError,
    connecting
  } = useWalletConnect();
  
  // Handle successful wallet connection
  const handleWalletConnected = async (address: string) => {
    try {
      // Get authentication nonce from server
      const nonceResponse = await apiRequest('GET', `/api/auth/nonce/${address}`);
      const nonceData = await nonceResponse.json();
      
      if (!nonceData.success) {
        throw new Error(nonceData.error || 'Failed to get authentication nonce');
      }
      
      // Sign the message with connected wallet
      const signature = await signMessage(nonceData.message);
      
      // Verify signature on server
      const authResponse = await apiRequest('POST', '/api/auth/web3-login', {
        walletAddress: address,
        signature,
        nonce: nonceData.nonce,
      });
      
      const authData = await authResponse.json();
      
      if (!authData.success) {
        throw new Error(authData.error || 'Web3 authentication failed');
      }
      
      toast({
        title: 'Wallet Connected',
        description: `Successfully authenticated with wallet ${address.substring(0, 8)}...`,
      });
      
      // Redirect to home page after successful wallet connection
      setLocation('/');
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: 'Authentication Failed',
        description: error.message || 'Failed to authenticate wallet',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">BlockReceipt</CardTitle>
          <CardDescription className="text-center">
            Sign in to manage your blockchain receipts on the Polygon network
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
            </TabsList>
            
            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...loginForm.register('email')}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-sm text-blue-600 hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      {...loginForm.register('password')}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="johndoe"
                      {...signupForm.register('username')}
                    />
                    {signupForm.formState.errors.username && (
                      <p className="text-sm text-red-500">{signupForm.formState.errors.username.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...signupForm.register('email')}
                    />
                    {signupForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{signupForm.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...signupForm.register('password')}
                    />
                    {signupForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{signupForm.formState.errors.password.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...signupForm.register('confirmPassword')}
                    />
                    {signupForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">{signupForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="wantsWallet"
                      checked={signupForm.watch('wantsWallet')}
                      onCheckedChange={(checked) => 
                        signupForm.setValue('wantsWallet', checked as boolean)
                      }
                    />
                    <label
                      htmlFor="wantsWallet"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Create a Polygon wallet for me
                    </label>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            {/* Wallet Tab */}
            <TabsContent value="wallet">
              <div className="space-y-4">
                <div className="rounded-md bg-gradient-to-r from-purple-600 to-blue-500 p-[1px]">
                  <div className="bg-white rounded-md p-4">
                    <h3 className="font-medium">Connect with Polygon</h3>
                    <p className="text-sm text-gray-500 mt-2">
                      Connect your Ethereum/Polygon wallet to sign in. Your BlockReceipts are stored on the Polygon network for low gas fees.
                    </p>
                  </div>
                </div>
                
                {connectionError && (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{connectionError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex flex-col gap-4">
                  <WalletButton 
                    onWalletConnected={handleWalletConnected}
                    className="w-full"
                  />
                  
                  {import.meta.env.DEV && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-center mb-2">Development Options</h4>
                      <DevModeWalletButton 
                        onWalletConnected={handleWalletConnected}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
                
                <Alert className="mt-2">
                  <AlertTitle>About Web3 Wallets</AlertTitle>
                  <AlertDescription className="text-xs">
                    <p className="mb-2">
                      Choose between MetaMask or WalletConnect to sign in with your crypto wallet.
                    </p>
                    <p>
                      No wallet? You can always <button type="button" className="text-blue-600 underline" onClick={() => setActiveTab('login')}>log in with email</button> or 
                      {' '}<button type="button" className="text-blue-600 underline" onClick={() => setActiveTab('signup')}>create an account</button> and we'll provide a hot wallet.
                    </p>
                  </AlertDescription>
                </Alert>
                
                <p className="text-xs text-gray-500 mt-2">
                  📍 Your NFT receipts are minted on the Polygon network for low gas costs.
                  <br />
                  You can bridge them to Ethereum in the future if desired.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} BlockReceipt.ai • Privacy-First Receipt Management
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
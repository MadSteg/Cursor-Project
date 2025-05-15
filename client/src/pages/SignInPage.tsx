/**
 * Sign In Page
 * 
 * This page allows users to sign in with email/password or connect a Web3 wallet.
 * It also offers the option to generate a hot wallet with TACo encryption.
 */
import { useState } from 'react';
import { Shield, Mail, Lock, User, Wallet, ArrowRight, CheckCircle } from 'lucide-react';
import { useWeb3Wallet } from '@/hooks/useWeb3Wallet';
import { HotWalletManager } from '@/components/wallet/HotWalletManager';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function SignInPage() {
  const { toast } = useToast();
  const { isConnected, connect, shortDisplayAddress } = useWeb3Wallet();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [autoGenerateWallet, setAutoGenerateWallet] = useState(true);
  
  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect your wallet. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally would validate and submit to backend
    toast({
      title: 'Sign In Successful',
      description: 'Welcome back to BlockReceipt',
    });
  };
  
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Normally would validate and submit to backend
    toast({
      title: 'Account Created',
      description: autoGenerateWallet 
        ? 'Your account has been created with a hot wallet!' 
        : 'Your account has been created successfully!',
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-bold">Sign In to BlockReceipt</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access your receipts, manage your wallet, and protect your data with industry-leading TACo threshold encryption.
          </p>
        </header>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <Card>
                  <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Sign in to your BlockReceipt account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="you@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="password" 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" className="w-full">
                        Sign In 
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <div className="relative my-3 w-full">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-card px-2 text-sm text-muted-foreground">Or continue with</span>
                      </div>
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleConnectWallet}
                      className="w-full mt-2"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Web3 Wallet
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="signup">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>Sign up for a new BlockReceipt account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="name" 
                            type="text" 
                            placeholder="John Doe" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="signup-email" 
                            type="email" 
                            placeholder="you@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            id="signup-password" 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 py-2">
                        <input
                          type="checkbox"
                          id="auto-generate"
                          className="h-4 w-4 rounded border-gray-300"
                          checked={autoGenerateWallet}
                          onChange={() => setAutoGenerateWallet(!autoGenerateWallet)}
                        />
                        <label htmlFor="auto-generate" className="text-sm font-medium text-muted-foreground">
                          Auto-generate a TACo encrypted hot wallet for me
                        </label>
                      </div>
                      
                      <Button type="submit" className="w-full">
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <div className="relative my-3 w-full">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-card px-2 text-sm text-muted-foreground">Or continue with</span>
                      </div>
                    </div>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleConnectWallet}
                      className="w-full mt-2"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Web3 Wallet
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex flex-col">
            {isConnected ? (
              <div className="flex-1">
                <div className="bg-primary/5 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Wallet Connected</h2>
                  </div>
                  <p className="text-muted-foreground mb-2">
                    You're connected with address:
                  </p>
                  <div className="px-3 py-2 bg-muted rounded font-mono text-sm mb-4">
                    {shortDisplayAddress}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You can now generate a hot wallet with TACo encryption for easy access across devices.
                  </p>
                </div>
                
                <HotWalletManager 
                  title="Generate Hot Wallet"
                  description="Create a TACo encrypted hot wallet for quick transactions"
                  autoGenerate={false}
                />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-6 max-w-md">
                  <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <Wallet className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Web3 Wallet</h2>
                    <p className="text-muted-foreground mb-6">
                      Connect your Web3 wallet to access BlockReceipt's full features, including secure hot wallet generation with threshold encryption.
                    </p>
                    <Button size="lg" onClick={handleConnectWallet}>
                      <Wallet className="mr-2 h-5 w-5" />
                      Connect Wallet
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { Mail, Inbox, CheckCircle, AlertCircle } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EmailReceiptStatus = "pending" | "scanning" | "authenticated" | "error";

interface EmailAccount {
  id: string;
  email: string;
  provider: string;
  status: EmailReceiptStatus;
  lastSynced?: Date;
}

const EmailScanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [provider, setProvider] = useState("gmail");
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [foundReceipts, setFoundReceipts] = useState(0);
  const [connectedAccounts, setConnectedAccounts] = useState<EmailAccount[]>([]);
  const { toast } = useToast();

  const handleConnect = () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would securely authenticate with the email provider
    setIsScanning(true);
    
    // Simulate scanning progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      
      if (progress === 100) {
        clearInterval(interval);
        
        // Add the connected account
        const newAccount: EmailAccount = {
          id: Date.now().toString(),
          email,
          provider,
          status: "authenticated",
          lastSynced: new Date(),
        };
        
        setConnectedAccounts([...connectedAccounts, newAccount]);
        
        // Simulate finding receipts
        const found = Math.floor(Math.random() * 20) + 5;
        setFoundReceipts(found);
        
        toast({
          title: "Email Connected",
          description: `Found ${found} receipts in your inbox!`,
        });
        
        setIsScanning(false);
        setEmail("");
        setPassword("");
        
        // Close the dialog after a delay
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      }
    }, 200);
  };

  const handleRemoveAccount = (accountId: string) => {
    setConnectedAccounts(connectedAccounts.filter(account => account.id !== accountId));
    toast({
      title: "Account Removed",
      description: "Email account has been disconnected",
    });
  };

  const handleSyncAccount = (accountId: string) => {
    // Update the specific account's status to scanning
    setConnectedAccounts(connectedAccounts.map(account => {
      if (account.id === accountId) {
        return { ...account, status: "scanning" };
      }
      return account;
    }));
    
    // Simulate scanning
    setTimeout(() => {
      const newFound = Math.floor(Math.random() * 10) + 1;
      setConnectedAccounts(connectedAccounts.map(account => {
        if (account.id === accountId) {
          return { 
            ...account, 
            status: "authenticated",
            lastSynced: new Date()
          };
        }
        return account;
      }));
      
      toast({
        title: "Sync Completed",
        description: `Found ${newFound} new receipts!`,
      });
    }, 3000);
  };

  const getProviderLabel = (providerKey: string): string => {
    switch (providerKey) {
      case "gmail": return "Google Mail";
      case "outlook": return "Microsoft Outlook";
      case "yahoo": return "Yahoo Mail";
      case "other": return "Other Provider";
      default: return providerKey;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            className="lg:w-auto w-full mb-6"
            onClick={() => setIsOpen(true)}
          >
            <Mail className="mr-2 h-4 w-4" /> Connect Email Account
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Email Account</DialogTitle>
            <DialogDescription>
              Connect your email account to automatically scan for receipts and order confirmations.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="connect" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="connect">Connect</TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
            </TabsList>
            
            <TabsContent value="connect">
              {isScanning ? (
                <div className="space-y-4 py-4">
                  <p className="text-center text-sm text-gray-500">
                    Scanning your inbox for receipts and order confirmations...
                  </p>
                  <Progress value={scanProgress} className="h-2" />
                  <p className="text-center text-xs text-gray-400">
                    This may take a moment
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Select defaultValue={provider} onValueChange={setProvider}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select email provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gmail">Google Mail</SelectItem>
                        <SelectItem value="outlook">Microsoft Outlook</SelectItem>
                        <SelectItem value="yahoo">Yahoo Mail</SelectItem>
                        <SelectItem value="other">Other Provider</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password or App Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-xs text-gray-500">
                      Note: For Gmail, you'll need to use an App Password. 
                      <a 
                        href="https://support.google.com/accounts/answer/185833" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline ml-1"
                      >
                        Learn more
                      </a>
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md text-xs text-blue-700">
                    <p className="font-medium">⚠️ Privacy Note</p>
                    <p className="mt-1">
                      BlockReceipt will only scan for emails containing purchase receipts and order confirmations.
                      We will never read your personal emails or store your password.
                    </p>
                  </div>
                </div>
              )}

              {foundReceipts > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-md flex items-center text-green-700">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p className="text-sm">Successfully found {foundReceipts} receipts in your inbox!</p>
                </div>
              )}
              
              <DialogFooter className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  disabled={isScanning}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConnect}
                  disabled={isScanning || !email || !password}
                >
                  {isScanning ? "Connecting..." : "Connect"}
                </Button>
              </DialogFooter>
            </TabsContent>
            
            <TabsContent value="manage">
              <div className="space-y-4 py-4">
                {connectedAccounts.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <Inbox className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No email accounts connected</p>
                    <p className="text-xs mt-1">Connect an account to scan for receipts</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {connectedAccounts.map((account) => (
                      <Card key={account.id} className="border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                                <Mail className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{account.email}</h4>
                                <p className="text-xs text-gray-500">{getProviderLabel(account.provider)}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              {account.status === "scanning" ? (
                                <div className="h-2 w-20 bg-gray-100 rounded-full overflow-hidden mr-2">
                                  <div className="h-full bg-primary animate-pulse" style={{ width: "70%" }}></div>
                                </div>
                              ) : (
                                <div className="flex items-center mr-2">
                                  {account.status === "authenticated" ? (
                                    <div className="flex items-center text-green-500 text-xs">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      <span>Connected</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center text-amber-500 text-xs">
                                      <AlertCircle className="h-3 w-3 mr-1" />
                                      <span>Error</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSyncAccount(account.id)}
                                  disabled={account.status === "scanning"}
                                >
                                  Sync
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveAccount(account.id)}
                                  disabled={account.status === "scanning"}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                          {account.lastSynced && (
                            <p className="text-xs text-gray-500 mt-2">
                              Last synced: {account.lastSynced.toLocaleString()}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmailScanner;
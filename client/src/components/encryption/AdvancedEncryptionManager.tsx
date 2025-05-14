/**
 * Advanced Encryption Manager Component
 * 
 * This component provides an interface for users to manage their advanced 
 * threshold encryption keys, enabling secure receipt sharing.
 */
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { encryptionService } from "@/lib/encryptionService";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Clock, Key, Plus, Trash } from "lucide-react";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(3, {
    message: "Key name must be at least 3 characters.",
  }),
});

// Function for local key storage
const saveKeyToLocalStorage = (keyName: string, privateKey: string) => {
  try {
    const keys = JSON.parse(localStorage.getItem('encryptionPrivateKeys') || '{}');
    keys[keyName] = privateKey;
    localStorage.setItem('encryptionPrivateKeys', JSON.stringify(keys));
    return true;
  } catch (error) {
    console.error("Failed to save private key:", error);
    return false;
  }
};

export default function AdvancedEncryptionManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("keys");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form for creating a new key
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // Get all keys
  const { data: keys = [], isLoading } = useQuery({
    queryKey: ['/api/encryption/keys'],
    queryFn: async () => {
      // In a real app, we would get the actual user ID
      const userId = 1;
      return encryptionService.getKeys(userId);
    },
  });

  // Create a new key
  const createKeyMutation = useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      // In a real app, we would get the actual user ID
      const userId = 1;
      return encryptionService.generateKeyPair(userId, name);
    },
    onSuccess: (data, variables) => {
      // In a real implementation, this would be returned from the backend
      // For the mock, we'll generate a fake private key
      const fakePrivateKey = `private-key-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      // Save the private key to local storage
      saveKeyToLocalStorage(variables.name, fakePrivateKey);
      
      queryClient.invalidateQueries({ queryKey: ['/api/encryption/keys'] });
      
      toast({
        title: "Key Created",
        description: `Your key "${variables.name}" has been created. IMPORTANT: Keep your private key safe!`,
      });
      
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Key Creation Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    createKeyMutation.mutate({ name: values.name });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Advanced Threshold Encryption Keys</CardTitle>
            <CardDescription>
              Manage your encryption keys for secure receipt sharing
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus size={16} /> New Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Encryption Key</DialogTitle>
                <DialogDescription>
                  This key will allow you to securely share receipts with others using threshold encryption
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a name for this key" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={createKeyMutation.isPending}>
                    {createKeyMutation.isPending ? "Creating..." : "Create Key"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="keys">My Keys</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          <TabsContent value="keys" className="py-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : keys.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Key size={48} className="mx-auto mb-4 opacity-30" />
                <p>No encryption keys found</p>
                <p className="text-sm mt-2">
                  Create a key to start securely sharing your receipts
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {keys.map((key) => (
                  <div 
                    key={key.id} 
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium">{key.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Created: {new Date(key.createdAt).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 font-mono truncate max-w-[300px]">
                        {key.publicKey}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {key.lastUsed && (
                        <div className="text-xs flex items-center gap-1 text-muted-foreground">
                          <Clock size={12} />
                          Last used: {new Date(key.lastUsed).toLocaleDateString()}
                        </div>
                      )}
                      <Button size="sm" variant="outline">
                        Copy Key
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive">
                        <Trash size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="advanced" className="py-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Export/Import Keys</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Export your keys for backup or import them to another device.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Export Keys</Button>
                  <Button size="sm" variant="outline">Import Keys</Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Key Recovery</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If you've lost your keys, try to recover them using a recovery phrase.
                </p>
                <Button size="sm" variant="outline">Recover Keys</Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">Security Settings</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure encryption strength and key storage settings.
                </p>
                <Button size="sm" variant="outline">Configure</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
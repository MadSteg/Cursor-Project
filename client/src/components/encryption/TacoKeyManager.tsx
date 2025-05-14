/**
 * Taco Key Manager Component
 * 
 * This component provides a UI for managing Taco threshold encryption keys,
 * including key generation, key details viewing, and permissions management.
 */

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { encryptionService } from "@/lib/encryptionService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, ShieldIcon, KeyIcon, LockIcon } from "lucide-react";

// Schema for creating a new Taco key
const createTacoKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export function TacoKeyManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query to fetch Taco encryption keys
  const { data: keys, isLoading, error } = useQuery({
    queryKey: ["/api/encryption-keys"],
    queryFn: encryptionService.getEncryptionKeys,
    select: (data) => data.filter(key => key.keyType?.includes("taco")),
  });

  // Form for creating a new key
  const form = useForm<z.infer<typeof createTacoKeySchema>>({
    resolver: zodResolver(createTacoKeySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Mutation for creating a new Taco key
  const createKeyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof createTacoKeySchema>) => {
      // In a real app, we would call the taco service to generate a keypair
      // Here we're just mocking the creation
      return encryptionService.createEncryptionKey({
        name: data.name,
        publicKey: `taco-public-key-${Date.now()}`,
        privateKey: `taco-private-key-${Date.now()}`,
        algorithm: "taco-threshold",
        isThresholdKey: true,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Taco threshold encryption key created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/encryption-keys"] });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to create Taco key: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof createTacoKeySchema>) => {
    createKeyMutation.mutate(data);
  };

  const handleViewDetails = (key: any) => {
    setSelectedKey(key);
    setIsDetailsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading Taco encryption keys...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center p-8">
        <Alert variant="destructive">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Error loading Taco encryption keys: {(error as Error).message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const tacoKeys = keys || [];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Taco Threshold Encryption Keys</h2>
            <p className="text-gray-500">
              Manage your Taco threshold encryption keys for secure sharing of receipts
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <KeyIcon className="mr-2 h-4 w-4" />
                Generate New Taco Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New Taco Threshold Key</DialogTitle>
                <DialogDescription>
                  Taco threshold encryption enables secure and selective sharing of your receipts with third parties.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Taco threshold key" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Key purpose or usage notes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit" disabled={createKeyMutation.isPending}>
                      {createKeyMutation.isPending ? "Generating..." : "Generate Key"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {tacoKeys.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                <ShieldIcon className="h-12 w-12 text-gray-300" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">No Taco Keys Found</h3>
                  <p className="text-sm text-gray-500 max-w-md">
                    Taco threshold encryption keys enable secure sharing of your receipts while maintaining privacy.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="mt-4"
                >
                  Generate Your First Taco Key
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tacoKeys.map((key) => (
              <Card key={key.id} className="overflow-hidden border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <ShieldIcon className="h-4 w-4 mr-2 text-blue-500" />
                        {key.name || `Taco Key #${key.id}`}
                      </CardTitle>
                      <CardDescription>
                        Created {new Date(key.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                      Taco
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="text-sm">
                    <div className="flex items-center mb-1 text-gray-600">
                      <LockIcon className="h-3 w-3 mr-1" />
                      <span className="font-medium mr-1">Public Key:</span>
                    </div>
                    <div className="font-mono text-xs bg-gray-50 p-2 rounded overflow-hidden text-ellipsis">
                      {key.publicKey.substring(0, 20)}...
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewDetails(key)}
                    className="w-full"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Key Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Taco Key Details</DialogTitle>
            <DialogDescription>
              Detailed information about your Taco threshold encryption key
            </DialogDescription>
          </DialogHeader>

          {selectedKey && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 font-medium text-gray-600">Key ID</div>
                <div className="col-span-2">{selectedKey.id}</div>
                
                <div className="col-span-1 font-medium text-gray-600">Name</div>
                <div className="col-span-2">{selectedKey.name || `Taco Key #${selectedKey.id}`}</div>
                
                <div className="col-span-1 font-medium text-gray-600">Created</div>
                <div className="col-span-2">{new Date(selectedKey.createdAt).toLocaleString()}</div>
                
                <div className="col-span-1 font-medium text-gray-600">Status</div>
                <div className="col-span-2 flex items-center">
                  <Badge variant={selectedKey.isActive ? "success" : "secondary"}>
                    {selectedKey.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <div className="col-span-1 font-medium text-gray-600">Key Type</div>
                <div className="col-span-2">{selectedKey.keyType}</div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-600">Public Key</h4>
                <div className="font-mono text-xs bg-gray-50 p-3 rounded overflow-auto max-h-24">
                  {selectedKey.publicKey}
                </div>
              </div>
              
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Privacy Information</AlertTitle>
                <AlertDescription>
                  Your private key is stored securely, encrypted with your password. 
                  It never leaves your device unencrypted and is only used for decryption 
                  when you need to access shared encrypted content.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
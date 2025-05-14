import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { encryptionService } from "@/lib/encryptionService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

// Schema for creating a new encryption key
const createKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
  publicKey: z.string().min(1, "Public key is required"),
  privateKey: z.string().optional(),
  algorithm: z.string().min(1, "Algorithm is required"),
  isThresholdKey: z.boolean().default(false),
});

export function EncryptionKeyManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query to fetch all encryption keys
  const { data: keys, isLoading, error } = useQuery({
    queryKey: ["/api/encryption-keys"],
    queryFn: encryptionService.getEncryptionKeys,
  });

  // Form for creating a new key
  const form = useForm<z.infer<typeof createKeySchema>>({
    resolver: zodResolver(createKeySchema),
    defaultValues: {
      name: "",
      publicKey: "",
      privateKey: "",
      algorithm: "RSA",
      isThresholdKey: false,
    },
  });

  // Mutation for creating a new key
  const createKeyMutation = useMutation({
    mutationFn: encryptionService.createEncryptionKey,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Encryption key created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/encryption-keys"] });
      setIsCreateDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to create encryption key: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof createKeySchema>) => {
    createKeyMutation.mutate(data);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading encryption keys...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center p-8 text-red-500">
        Error loading encryption keys: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Encryption Keys</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Key</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Encryption Key</DialogTitle>
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
                        <Input placeholder="My personal key" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="algorithm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Algorithm</FormLabel>
                      <FormControl>
                        <Input placeholder="RSA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="publicKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Public Key</FormLabel>
                      <FormControl>
                        <Input placeholder="Public key string" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="privateKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Private Key (Optional - stored encrypted)</FormLabel>
                      <FormControl>
                        <Input placeholder="Private key string" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isThresholdKey"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-x-2">
                      <FormLabel>Threshold Key</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit" disabled={createKeyMutation.isPending}>
                    {createKeyMutation.isPending ? "Creating..." : "Create Key"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Keys</TabsTrigger>
          <TabsTrigger value="threshold">Threshold Keys</TabsTrigger>
          <TabsTrigger value="standard">Standard Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keys && keys.length > 0 ? (
              keys.map((key) => (
                <EncryptionKeyCard key={key.id} encryptionKey={key} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                No encryption keys found. Create your first key to get started.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="threshold">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keys && keys.filter((key) => key.isThresholdKey).length > 0 ? (
              keys
                .filter((key) => key.isThresholdKey)
                .map((key) => <EncryptionKeyCard key={key.id} encryptionKey={key} />)
            ) : (
              <div className="col-span-full text-center py-8">
                No threshold encryption keys found.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="standard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keys && keys.filter((key) => !key.isThresholdKey).length > 0 ? (
              keys
                .filter((key) => !key.isThresholdKey)
                .map((key) => <EncryptionKeyCard key={key.id} encryptionKey={key} />)
            ) : (
              <div className="col-span-full text-center py-8">
                No standard encryption keys found.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EncryptionKeyCard({ encryptionKey }: { encryptionKey: any }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{encryptionKey.name}</CardTitle>
          <Badge variant={encryptionKey.isThresholdKey ? "secondary" : "outline"}>
            {encryptionKey.isThresholdKey ? "Threshold" : "Standard"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500 mb-2">Algorithm: {encryptionKey.algorithm}</div>
        <div className="text-sm overflow-hidden text-ellipsis">
          <span className="font-semibold">Public Key:</span>
          <div className="truncate max-w-full">{encryptionKey.publicKey.substring(0, 35)}...</div>
        </div>
        {encryptionKey.privateKey && (
          <div className="text-sm overflow-hidden text-ellipsis mt-2">
            <span className="font-semibold">Private Key:</span> <span className="text-gray-400">(Stored encrypted)</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-between">
        <div className="text-xs text-gray-400">
          Created: {new Date(encryptionKey.createdAt).toLocaleDateString()}
        </div>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
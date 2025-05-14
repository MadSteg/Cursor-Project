/**
 * Taco Key Manager Component
 * 
 * This component provides an interface for managing Taco threshold encryption keys.
 */
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Key, Shield, Clock, Calendar } from 'lucide-react';
import { tacoThresholdCrypto } from '@/lib/tacoThresholdCrypto';

// Demo user ID for demonstration purposes
const DEMO_USER_ID = 1;

interface TacoKey {
  id: number;
  userId: number;
  publicKey: string;
  keyType: string;
  name: string;
  createdAt: Date;
}

export default function TacoKeyManager() {
  const [keys, setKeys] = useState<TacoKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load keys on component mount
  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const fetchedKeys = await tacoThresholdCrypto.getKeys(DEMO_USER_ID);
      setKeys(fetchedKeys);
    } catch (error) {
      console.error('Failed to fetch keys:', error);
      toast({
        title: 'Error',
        description: 'Failed to load encryption keys',
        variant: 'destructive',
      });
    }
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name for the key',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const newKey = await tacoThresholdCrypto.generateKeyPair(DEMO_USER_ID, newKeyName);
      setKeys([...keys, newKey]);
      setNewKeyName('');
      setIsCreateDialogOpen(false);
      toast({
        title: 'Success',
        description: 'New encryption key created successfully',
      });
    } catch (error) {
      console.error('Failed to create key:', error);
      toast({
        title: 'Error',
        description: 'Failed to create encryption key',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const truncateKey = (key: string) => {
    if (!key) return 'N/A';
    return key.length > 20 ? `${key.substring(0, 10)}...${key.substring(key.length - 10)}` : key;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Taco Threshold Encryption Keys</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Taco Encryption Key</DialogTitle>
              <DialogDescription>
                Create a new threshold encryption key for securing your receipts.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="key-name" className="text-right">
                  Key Name
                </Label>
                <Input
                  id="key-name"
                  className="col-span-3"
                  placeholder="Enter a name for your key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateKey} disabled={loading}>
                {loading ? 'Creating...' : 'Create Key'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Encryption Keys</CardTitle>
          <CardDescription>
            These keys are used to secure your receipt data using the Taco threshold encryption protocol.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <div className="text-center py-6">
              <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>You don't have any Taco encryption keys yet.</p>
              <p className="text-sm text-gray-500 mt-2">
                Create a key to start securing your receipts with threshold encryption.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key Type</TableHead>
                  <TableHead>Public Key</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Key className="h-4 w-4 mr-2 text-primary" />
                        {key.name}
                      </div>
                    </TableCell>
                    <TableCell>{key.keyType}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {truncateKey(key.publicKey)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        {formatDate(key.createdAt.toString())}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-500 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Threshold encryption protects your data with mathematical security.
          </div>
          <Button variant="outline" onClick={fetchKeys}>
            Refresh
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
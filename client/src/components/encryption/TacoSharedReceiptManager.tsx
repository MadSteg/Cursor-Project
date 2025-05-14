/**
 * Taco Shared Receipt Manager Component
 * 
 * This component provides an interface for managing receipts shared using
 * Taco proxy re-encryption.
 */
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Share, Lock, Shield, Eye, Calendar, Clock, User } from 'lucide-react';
import { tacoThresholdCrypto } from '@/lib/tacoThresholdCrypto';

// Demo user ID for demonstration purposes
const DEMO_USER_ID = 1;

interface User {
  id: number;
  username: string;
  email?: string;
}

interface Receipt {
  id: number;
  userId: number;
  merchantId: number;
  merchant: {
    name: string;
  };
  date: string;
  total: string;
}

interface SharedAccess {
  id: number;
  receiptId: number;
  ownerId: number;
  targetId: number;
  encryptedData: string;
  createdAt: string;
  expiresAt?: string;
}

interface SharedReceipt {
  access: SharedAccess;
  receipt: Receipt;
}

export default function TacoSharedReceiptManager() {
  const [sharedByMe, setSharedByMe] = useState<SharedReceipt[]>([]);
  const [sharedWithMe, setSharedWithMe] = useState<SharedReceipt[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [encryptionKeys, setEncryptionKeys] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [privateKey, setPrivateKey] = useState('');
  const { toast } = useToast();

  // Load data on component mount
  useEffect(() => {
    fetchSharedReceipts();
    fetchMyReceipts();
    fetchUsers();
    fetchEncryptionKeys();
  }, []);

  const fetchSharedReceipts = async () => {
    try {
      const byMe = await tacoThresholdCrypto.getSharedByMe(DEMO_USER_ID);
      const withMe = await tacoThresholdCrypto.getSharedWithMe(DEMO_USER_ID);
      setSharedByMe(byMe);
      setSharedWithMe(withMe);
    } catch (error) {
      console.error('Failed to fetch shared receipts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load shared receipts',
        variant: 'destructive',
      });
    }
  };

  const fetchMyReceipts = async () => {
    try {
      const response = await fetch('/api/receipts');
      const data = await response.json();
      setReceipts(data);
    } catch (error) {
      console.error('Failed to fetch receipts:', error);
    }
  };

  const fetchUsers = async () => {
    // In a real app, this would fetch users from the server
    // For demo purposes, we'll use mock data
    setUsers([
      { id: 1, username: 'demo_user', email: 'demo@example.com' },
      { id: 2, username: 'alice', email: 'alice@example.com' },
      { id: 3, username: 'bob', email: 'bob@example.com' },
    ]);
  };

  const fetchEncryptionKeys = async () => {
    try {
      const keys = await tacoThresholdCrypto.getKeys(DEMO_USER_ID);
      setEncryptionKeys(keys);
    } catch (error) {
      console.error('Failed to fetch encryption keys:', error);
    }
  };

  const handleShareReceipt = async () => {
    if (!selectedReceipt || !selectedUser) {
      toast({
        title: 'Error',
        description: 'Please select a receipt and a user',
        variant: 'destructive',
      });
      return;
    }

    if (!privateKey) {
      toast({
        title: 'Error',
        description: 'Please enter your private key',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      // Get the target user's public key
      // In a real app, this would be fetched from the server
      const targetUser = users.find(u => u.id === selectedUser);
      if (!targetUser) {
        throw new Error('Target user not found');
      }

      // Get the receipt data to encrypt
      const receipt = receipts.find(r => r.id === selectedReceipt);
      if (!receipt) {
        throw new Error('Receipt not found');
      }

      // Mock target user's public key for demo
      const targetPublicKey = `taco-public-key-user-${selectedUser}`;

      // Prepare receipt data to share
      const receiptData = JSON.stringify({
        merchant: receipt.merchant.name,
        date: new Date(receipt.date).toISOString(),
        total: receipt.total,
        items: [
          { name: 'Item 1', price: '45.67', quantity: 1 },
          { name: 'Item 2', price: '77.78', quantity: 1 }
        ]
      });

      // Encrypt receipt data
      const encryptedData = await tacoThresholdCrypto.encrypt(receiptData, targetPublicKey);

      // Share receipt
      await tacoThresholdCrypto.shareReceipt(
        selectedReceipt,
        DEMO_USER_ID,
        selectedUser,
        encryptedData,
        privateKey,
        targetPublicKey
      );

      // Refresh shared receipts list
      await fetchSharedReceipts();

      setIsShareDialogOpen(false);
      toast({
        title: 'Success',
        description: `Receipt shared with ${targetUser.username} successfully`,
      });
    } catch (error) {
      console.error('Failed to share receipt:', error);
      toast({
        title: 'Error',
        description: 'Failed to share receipt',
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Taco Shared Receipts</h2>
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Share className="mr-2 h-4 w-4" />
              Share a Receipt
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Receipt with Threshold Encryption</DialogTitle>
              <DialogDescription>
                Share a receipt with another user using Taco proxy re-encryption.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="receipt" className="text-right">
                  Receipt
                </Label>
                <Select
                  value={selectedReceipt?.toString() || ''}
                  onValueChange={(value) => setSelectedReceipt(parseInt(value))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a receipt to share" />
                  </SelectTrigger>
                  <SelectContent>
                    {receipts.map((receipt) => (
                      <SelectItem key={receipt.id} value={receipt.id.toString()}>
                        {receipt.merchant.name} - ${receipt.total}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user" className="text-right">
                  Share with
                </Label>
                <Select
                  value={selectedUser?.toString() || ''}
                  onValueChange={(value) => setSelectedUser(parseInt(value))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter(user => user.id !== DEMO_USER_ID)
                      .map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.username} {user.email ? `(${user.email})` : ''}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="private-key" className="text-right">
                  Your Private Key
                </Label>
                <Input
                  id="private-key"
                  className="col-span-3"
                  type="password"
                  placeholder="Enter your private key"
                  value={privateKey}
                  onChange={(e) => setPrivateKey(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleShareReceipt} disabled={loading}>
                {loading ? 'Sharing...' : 'Share Receipt'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="with-me">
        <TabsList>
          <TabsTrigger value="with-me">Shared With Me</TabsTrigger>
          <TabsTrigger value="by-me">Shared By Me</TabsTrigger>
        </TabsList>
        <TabsContent value="with-me">
          <Card>
            <CardHeader>
              <CardTitle>Receipts Shared With Me</CardTitle>
              <CardDescription>
                Receipts that other users have shared with you using Taco threshold encryption.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sharedWithMe.length === 0 ? (
                <div className="text-center py-6">
                  <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No receipts have been shared with you yet.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    When someone shares a receipt with you, it will appear here.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Shared By</TableHead>
                      <TableHead>Shared On</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sharedWithMe.map((shared) => (
                      <TableRow key={shared.access.id}>
                        <TableCell className="font-medium">
                          {shared.receipt?.merchant?.name || 'Unknown Merchant'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-primary" />
                            {users.find(u => u.id === shared.access.ownerId)?.username || 'Unknown User'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            {formatDate(shared.access.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="by-me">
          <Card>
            <CardHeader>
              <CardTitle>Receipts Shared By Me</CardTitle>
              <CardDescription>
                Receipts that you have shared with other users using Taco threshold encryption.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sharedByMe.length === 0 ? (
                <div className="text-center py-6">
                  <Share className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>You haven't shared any receipts yet.</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Share a receipt with another user to see it here.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Merchant</TableHead>
                      <TableHead>Shared With</TableHead>
                      <TableHead>Shared On</TableHead>
                      <TableHead>Expires</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sharedByMe.map((shared) => (
                      <TableRow key={shared.access.id}>
                        <TableCell className="font-medium">
                          {shared.receipt?.merchant?.name || 'Unknown Merchant'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-primary" />
                            {users.find(u => u.id === shared.access.targetId)?.username || 'Unknown User'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            {formatDate(shared.access.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {shared.access.expiresAt ? (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              {formatDate(shared.access.expiresAt)}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Never</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto" onClick={fetchSharedReceipts}>
                Refresh
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
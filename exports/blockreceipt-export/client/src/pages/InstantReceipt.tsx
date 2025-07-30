import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { CheckCircle, Wallet, Link, Copy, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
}

interface InstantReceiptResult {
  receiptId: number;
  walletAddress: string;
  accessUrl: string;
  seedPhrase?: string;
  expiresAt: string;
}

export default function InstantReceipt() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InstantReceiptResult | null>(null);
  const [formData, setFormData] = useState({
    merchantName: '',
    date: new Date().toISOString().split('T')[0],
    total: '',
    subtotal: '',
    tax: '',
    email: '',
    phoneNumber: '',
    walletAddress: '',
    createWalletIfNeeded: true
  });
  const [items, setItems] = useState<ReceiptItem[]>([
    { name: '', price: 0, quantity: 1 }
  ]);

  const { toast } = useToast();

  const addItem = () => {
    setItems([...items, { name: '', price: 0, quantity: 1 }]);
  };

  const updateItem = (index: number, field: keyof ReceiptItem, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validItems = items.filter(item => item.name.trim() !== '');
      
      const response = await fetch('/api/instant-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantName: formData.merchantName,
          date: formData.date,
          total: parseFloat(formData.total) || 0,
          subtotal: parseFloat(formData.subtotal) || 0,
          tax: parseFloat(formData.tax) || 0,
          items: validItems,
          delivery: {
            email: formData.email || undefined,
            phoneNumber: formData.phoneNumber || undefined,
            walletAddress: formData.walletAddress || undefined,
            createWalletIfNeeded: formData.createWalletIfNeeded
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        toast({
          title: "Receipt delivered!",
          description: data.message,
        });
      } else {
        throw new Error(data.message || 'Failed to create receipt');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create receipt',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Receipt Delivered Successfully!</h1>
          <p className="text-gray-600">Your digital receipt is ready and secure</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Wallet Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Wallet Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono">
                    {result.walletAddress}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(result.walletAddress, 'Wallet address')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {result.seedPhrase && (
                <div>
                  <Label className="text-sm font-medium text-amber-600">
                    Seed Phrase (Save this securely!)
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-2 bg-amber-50 border border-amber-200 rounded text-sm font-mono">
                      {result.seedPhrase}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(result.seedPhrase!, 'Seed phrase')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-amber-600 mt-1">
                    Save this phrase safely. It's needed to recover your wallet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Receipt Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Receipt ID</Label>
                <p className="text-lg font-mono">#{result.receiptId}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Access URL</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono break-all">
                    {result.accessUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(result.accessUrl, 'Access URL')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Expires</Label>
                <p className="text-sm text-gray-600">
                  {new Date(result.expiresAt).toLocaleDateString()}
                </p>
              </div>

              <Button 
                className="w-full" 
                onClick={() => window.open(result.accessUrl, '_blank')}
              >
                <Receipt className="w-4 h-4 mr-2" />
                View Receipt
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" onClick={() => setResult(null)}>
            Create Another Receipt
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Instant Digital Receipt</h1>
        <p className="text-gray-600">Create and deliver secure blockchain receipts instantly</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Receipt Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="merchantName">Merchant Name *</Label>
                <Input
                  id="merchantName"
                  value={formData.merchantName}
                  onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
                  placeholder="e.g., Coffee Shop"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="subtotal">Subtotal</Label>
                <Input
                  id="subtotal"
                  type="number"
                  step="0.01"
                  value={formData.subtotal}
                  onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="tax">Tax</Label>
                <Input
                  id="tax"
                  type="number"
                  step="0.01"
                  value={formData.tax}
                  onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="total">Total *</Label>
                <Input
                  id="total"
                  type="number"
                  step="0.01"
                  value={formData.total}
                  onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid gap-4 md:grid-cols-4 items-end">
                <div>
                  <Label>Item Name</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    placeholder="e.g., Coffee"
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addItem}>
              Add Item
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number (optional)</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="walletAddress">Existing Wallet Address (optional)</Label>
              <Input
                id="walletAddress"
                value={formData.walletAddress}
                onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                placeholder="0x..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="createWallet"
                checked={formData.createWalletIfNeeded}
                onChange={(e) => setFormData({ ...formData, createWalletIfNeeded: e.target.checked })}
              />
              <Label htmlFor="createWallet">Create new wallet if needed</Label>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating Receipt...' : 'Create Instant Receipt'}
        </Button>
      </form>
    </div>
  );
}
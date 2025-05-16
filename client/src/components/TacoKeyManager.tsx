import { useState, useEffect } from 'react';
import { 
  Card, 
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { tacoThresholdCryptoClient } from '../lib/tacoThresholdCryptoClient';

export function TacoKeyManager() {
  const [keys, setKeys] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [keyName, setKeyName] = useState('My TaCo Key');
  const [testText, setTestText] = useState('');
  const [encryptedText, setEncryptedText] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [selectedKey, setSelectedKey] = useState<any>(null);
  const { toast } = useToast();

  // Load keys when component mounts
  useEffect(() => {
    loadKeys();
  }, []);

  // Load all TaCo keys for the current user
  const loadKeys = async () => {
    setIsLoading(true);
    try {
      const userKeys = await tacoThresholdCryptoClient.getUserKeys();
      setKeys(userKeys);
      // Set the first key as selected if available
      if (userKeys.length > 0 && !selectedKey) {
        setSelectedKey(userKeys[0]);
      }
    } catch (error) {
      console.error('Error loading keys:', error);
      toast({
        title: 'Error',
        description: 'Failed to load encryption keys',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate a new TaCo key pair
  const handleGenerateKey = async () => {
    setIsGenerating(true);
    try {
      const newKey = await tacoThresholdCryptoClient.generateKeyPair(keyName);
      
      if (newKey) {
        toast({
          title: 'Key Generated',
          description: 'New encryption key created successfully',
        });
        
        // Reload keys to include the new one
        await loadKeys();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to generate new key',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error generating key:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate new key',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Encrypt sample text
  const handleEncrypt = async () => {
    if (!selectedKey || !testText) return;
    
    try {
      const encrypted = await tacoThresholdCryptoClient.encryptData(
        testText,
        selectedKey.publicKey
      );
      
      if (encrypted) {
        setEncryptedText(encrypted);
        toast({
          title: 'Text Encrypted',
          description: 'The text was encrypted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to encrypt text',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error encrypting text:', error);
      toast({
        title: 'Error',
        description: 'Failed to encrypt text',
        variant: 'destructive',
      });
    }
  };

  // Decrypt sample text
  const handleDecrypt = async () => {
    if (!selectedKey || !encryptedText) return;
    
    try {
      const decrypted = await tacoThresholdCryptoClient.decryptData(
        encryptedText,
        selectedKey.publicKey
      );
      
      if (decrypted) {
        setDecryptedText(decrypted);
        toast({
          title: 'Text Decrypted',
          description: 'The text was decrypted successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to decrypt text',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error decrypting text:', error);
      toast({
        title: 'Error',
        description: 'Failed to decrypt text',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>TaCo Threshold Encryption</CardTitle>
        <CardDescription>
          Manage your encryption keys and test the TaCo threshold encryption service
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Management Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Key Management</h3>
          
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="Enter a name for your key"
              />
            </div>
            <Button 
              onClick={handleGenerateKey} 
              disabled={isGenerating}
              className="self-end"
            >
              {isGenerating ? 'Generating...' : 'Generate New Key'}
            </Button>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Your Keys</h4>
            {isLoading ? (
              <p>Loading keys...</p>
            ) : keys.length === 0 ? (
              <p className="text-muted-foreground">No keys found. Generate a new key to get started.</p>
            ) : (
              <div className="space-y-2">
                {keys.map((key) => (
                  <div 
                    key={key.id}
                    className={`p-3 border rounded-md cursor-pointer ${
                      selectedKey?.id === key.id ? 'border-primary bg-primary/10' : ''
                    }`}
                    onClick={() => setSelectedKey(key)}
                  >
                    <div className="font-medium">{key.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {key.publicKey.substring(0, 20)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Test Encryption Section */}
        {selectedKey && (
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Test Encryption</h3>
            
            <div>
              <Label htmlFor="plaintext">Plain Text</Label>
              <div className="flex space-x-2">
                <Input
                  id="plaintext"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="Enter text to encrypt"
                  className="flex-1"
                />
                <Button 
                  onClick={handleEncrypt}
                  disabled={!testText || !selectedKey}
                >
                  Encrypt
                </Button>
              </div>
            </div>
            
            {encryptedText && (
              <div>
                <Label htmlFor="encrypted">Encrypted Text</Label>
                <Input
                  id="encrypted"
                  value={encryptedText}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button 
                  onClick={handleDecrypt}
                  disabled={!encryptedText}
                  className="mt-2"
                >
                  Decrypt
                </Button>
              </div>
            )}
            
            {decryptedText && (
              <div>
                <Label htmlFor="decrypted">Decrypted Text</Label>
                <Input
                  id="decrypted"
                  value={decryptedText}
                  readOnly
                  className="font-mono"
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={loadKeys}>
          Refresh Keys
        </Button>
        <span className="text-xs text-muted-foreground">
          Using TaCo threshold encryption
        </span>
      </CardFooter>
    </Card>
  );
}
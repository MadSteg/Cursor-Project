/**
 * Encryption Settings Page
 * 
 * This page provides tools for managing encryption settings and shared receipts
 * using the Taco threshold encryption protocol.
 */
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TacoKeyManager from '@/components/encryption/TacoKeyManager';
import TacoSharedReceiptManager from '@/components/encryption/TacoSharedReceiptManager';
import { Shield, Share, Lock } from 'lucide-react';

export default function EncryptionSettings() {
  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-8">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Encryption Settings</h1>
      </div>
      
      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Threshold Encryption Security</h2>
            <p className="text-muted-foreground">
              MemoryChain uses Taco (formerly NuCypher) threshold encryption to ensure your receipts 
              are secure and private. This technology allows you to selectively share receipts 
              without exposing your encryption keys.
            </p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="keys" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="keys">Encryption Keys</TabsTrigger>
          <TabsTrigger value="shared">Shared Receipts</TabsTrigger>
        </TabsList>
        <TabsContent value="keys" className="mt-6">
          <TacoKeyManager />
        </TabsContent>
        <TabsContent value="shared" className="mt-6">
          <TacoSharedReceiptManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
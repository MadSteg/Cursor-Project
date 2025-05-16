import { TacoKeyManager } from '@/components/TacoKeyManager';

export default function TacoTestPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">TaCo Threshold Encryption Test</h1>
        <p className="text-muted-foreground mt-2">
          Test the TaCo threshold encryption service for secure receipt data protection
        </p>
      </div>
      
      <TacoKeyManager />
    </div>
  );
}
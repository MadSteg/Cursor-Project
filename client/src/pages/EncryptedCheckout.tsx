/**
 * Encrypted Checkout Page
 * 
 * This page provides a checkout experience with threshold encryption for enhanced privacy and security.
 */
import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQueryParams } from '@/hooks/use-query-params';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { EncryptedCheckout } from '@/components/blockchain/EncryptedCheckout';
import { ArrowLeft } from 'lucide-react';

export default function EncryptedCheckoutPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryParams = useQueryParams();
  
  // Default amount if not provided in query params
  const defaultAmount = 29.99;
  
  // Get amount from query params or use default
  const amount = queryParams.amount ? parseFloat(queryParams.amount) : defaultAmount;
  const receiptId = queryParams.receiptId ? parseInt(queryParams.receiptId) : undefined;
  
  // Handle payment completion
  const handlePaymentComplete = (paymentId: string) => {
    // In a real application, we would update the database or perform other operations
    console.log('Payment completed with ID:', paymentId);
    
    // Optionally show a toast
    toast({
      title: "Payment Processed",
      description: "Your encrypted payment has been processed successfully.",
      variant: "default",
    });
  };

  return (
    <main className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center text-muted-foreground"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Secure Encrypted Checkout</h1>
        <p className="text-muted-foreground">
          Your payment and receipt data will be protected with threshold encryption technology.
        </p>
      </div>
      
      <EncryptedCheckout 
        amount={amount} 
        receiptId={receiptId}
        onPaymentComplete={handlePaymentComplete}
      />
    </main>
  );
}
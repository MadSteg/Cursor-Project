import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cryptoPaymentService, formatCryptoAddress, formatCryptoAmount } from "@/lib/cryptoPaymentService";
import { QRCodeSVG } from "qrcode.react";
import { Loader2, Check, ExternalLink, Copy, AlertTriangle } from "lucide-react";

type CheckoutState = "initial" | "processing" | "awaitingPayment" | "verifyingPayment" | "paymentConfirmed" | "error";

export default function CryptoCheckout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [state, setState] = useState<CheckoutState>("initial");
  const [amount, setAmount] = useState(0.99); // Default amount for NFT receipt
  const [currency, setCurrency] = useState("MATIC");
  const [paymentAddress, setPaymentAddress] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [txHash, setTxHash] = useState("");
  const [confirmations, setConfirmations] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [verificationInterval, setVerificationInterval] = useState<number | null>(null);

  // Create a payment intent when the component mounts
  useEffect(() => {
    const createIntent = async () => {
      setState("processing");
      
      try {
        const result = await cryptoPaymentService.createPaymentIntent(amount, currency);
        
        if (result.success) {
          setPaymentAddress(result.paymentAddress);
          setPaymentId(result.paymentId);
          setState("awaitingPayment");
        } else {
          setErrorMessage(result.error || "Failed to create payment intent");
          setState("error");
        }
      } catch (error) {
        console.error("Error creating payment intent:", error);
        setErrorMessage("An unexpected error occurred");
        setState("error");
      }
    };
    
    createIntent();
    
    // Clean up any intervals when component unmounts
    return () => {
      if (verificationInterval) {
        window.clearInterval(verificationInterval);
      }
    };
  }, []);

  // Function to handle transaction hash input
  const handleVerifyTransaction = async () => {
    if (!txHash || txHash.trim() === "") {
      toast({
        title: "Transaction hash required",
        description: "Please enter a valid transaction hash to verify your payment",
        variant: "destructive",
      });
      return;
    }

    setState("verifyingPayment");
    
    try {
      const result = await cryptoPaymentService.verifyPayment(paymentId, txHash);
      
      if (result.success && result.verified) {
        // Payment is confirmed
        setConfirmations(result.transaction?.confirmations || 1);
        setState("paymentConfirmed");
        
        // Clear any existing interval
        if (verificationInterval) {
          window.clearInterval(verificationInterval);
          setVerificationInterval(null);
        }
        
        // Show success toast
        toast({
          title: "Payment confirmed",
          description: "Your transaction has been verified and your receipt has been created",
        });
        
        // Redirect to receipt details after 3 seconds
        setTimeout(() => {
          setLocation("/receipts");
        }, 3000);
      } else if (result.success) {
        // Payment is pending further confirmations
        toast({
          title: "Payment detected",
          description: "Your transaction is being processed. Please wait for confirmation.",
        });
        
        // Set up automatic verification every 10 seconds
        if (!verificationInterval) {
          const interval = window.setInterval(() => {
            setVerificationAttempts((prev) => prev + 1);
            verifyAutomatically();
          }, 10000);
          setVerificationInterval(interval);
        }
      } else {
        // Payment verification failed
        setErrorMessage(result.error || "Failed to verify payment");
        setState("awaitingPayment");
        
        toast({
          title: "Verification failed",
          description: "We couldn't verify your transaction. Please double-check the transaction hash.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setErrorMessage("An error occurred while verifying your payment");
      setState("awaitingPayment");
    }
  };

  // Function for automatic verification
  const verifyAutomatically = async () => {
    if (verificationAttempts > 30) {
      // Give up after 30 attempts (5 minutes)
      if (verificationInterval) {
        window.clearInterval(verificationInterval);
        setVerificationInterval(null);
      }
      setErrorMessage("Verification timed out. Please check the transaction status and try again.");
      setState("awaitingPayment");
      return;
    }
    
    try {
      const result = await cryptoPaymentService.verifyPayment(paymentId, txHash);
      
      if (result.success && result.verified) {
        setConfirmations(result.transaction?.confirmations || 1);
        setState("paymentConfirmed");
        
        if (verificationInterval) {
          window.clearInterval(verificationInterval);
          setVerificationInterval(null);
        }
        
        toast({
          title: "Payment confirmed",
          description: "Your transaction has been verified and your receipt has been created",
        });
        
        setTimeout(() => {
          setLocation("/receipts");
        }, 3000);
      }
    } catch (error) {
      console.error("Error in automatic verification:", error);
    }
  };

  // Copy payment address to clipboard
  const copyAddressToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(paymentAddress)
        .then(() => {
          toast({
            title: "Address copied",
            description: "Payment address copied to clipboard",
          });
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
        });
    }
  };

  // Function to check transaction on block explorer
  const openBlockExplorer = () => {
    let explorerUrl = "";
    
    switch (currency.toUpperCase()) {
      case "MATIC":
        explorerUrl = `https://mumbai.polygonscan.com/tx/${txHash}`;
        break;
      case "ETH":
        explorerUrl = `https://goerli.etherscan.io/tx/${txHash}`;
        break;
      default:
        explorerUrl = `https://mumbai.polygonscan.com/tx/${txHash}`;
    }
    
    window.open(explorerUrl, "_blank");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Crypto Payment</CardTitle>
          <CardDescription>
            Pay with cryptocurrency to mint your NFT receipt
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {state === "initial" || state === "processing" ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-center text-muted-foreground">
                Initializing payment...
              </p>
            </div>
          ) : state === "awaitingPayment" ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-3 rounded-lg">
                  <QRCodeSVG
                    value={`ethereum:${paymentAddress}?value=${amount}&currency=${currency}`}
                    size={200}
                    level="H"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Send exactly:</Label>
                <div className="font-bold text-xl text-center">
                  {formatCryptoAmount(amount, currency)}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>To address:</Label>
                <div className="flex items-center">
                  <div className="border rounded-l-md p-2 flex-1 font-mono text-sm truncate bg-muted">
                    {paymentAddress}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-l-none"
                    onClick={copyAddressToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <Label htmlFor="txHash">Enter transaction hash after payment:</Label>
                <div className="flex items-center mt-2 gap-2">
                  <Input
                    id="txHash"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="0x..."
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={openBlockExplorer}
                    disabled={!txHash}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : state === "verifyingPayment" ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-center text-muted-foreground">
                Verifying your transaction...
              </p>
              <p className="mt-2 text-sm text-center text-muted-foreground">
                This may take a few moments as we wait for network confirmations.
              </p>
            </div>
          ) : state === "paymentConfirmed" ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-green-100 p-3">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Payment Confirmed!</h3>
              <p className="mt-2 text-center text-muted-foreground">
                Your transaction has been verified with {confirmations} confirmations.
              </p>
              <p className="mt-4 text-sm text-center">
                Your NFT receipt is being generated. You will be redirected in a moment...
              </p>
            </div>
          ) : state === "error" ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">Error</h3>
              <p className="mt-2 text-center text-muted-foreground">
                {errorMessage || "An error occurred during payment processing."}
              </p>
            </div>
          ) : null}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          {state === "awaitingPayment" && (
            <Button 
              className="w-full" 
              onClick={handleVerifyTransaction}
              disabled={!txHash}
            >
              Verify Payment
            </Button>
          )}
          
          {state === "error" && (
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => setLocation("/")}
            >
              Back to Dashboard
            </Button>
          )}
          
          <p className="text-xs text-center text-muted-foreground pt-2">
            Payment ID: {paymentId || "Generating..."}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
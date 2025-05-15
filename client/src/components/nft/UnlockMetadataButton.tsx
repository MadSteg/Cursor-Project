import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Unlock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UnlockMetadataButtonProps {
  tokenId: string;
  walletAddress: string;
  onUnlockSuccess: (data: any) => void;
}

export function UnlockMetadataButton({ tokenId, walletAddress, onUnlockSuccess }: UnlockMetadataButtonProps) {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const { toast } = useToast();

  const handleUnlock = async () => {
    if (isUnlocking) return;

    setIsUnlocking(true);
    try {
      console.log(`Requesting metadata unlock for token: ${tokenId}`);
      
      const response = await fetch(`/api/gallery/unlock/${tokenId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ walletAddress })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to unlock metadata');
      }
      
      if (data.success) {
        // Call the success callback with the unlocked data
        onUnlockSuccess(data);
      } else {
        toast({
          title: "Error Unlocking",
          description: data.message || "Could not decrypt receipt data",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error unlocking metadata:", error);
      toast({
        title: "Unlock Failed",
        description: error instanceof Error ? error.message : "An error occurred while decrypting the receipt data",
        variant: "destructive"
      });
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <Button 
      onClick={handleUnlock} 
      disabled={isUnlocking}
      variant="default" 
      size="sm"
      className="flex items-center gap-1 w-full justify-center"
    >
      <Unlock className="h-3 w-3 mr-1" />
      {isUnlocking ? "Unlocking..." : "Unlock Receipt Data"}
    </Button>
  );
}
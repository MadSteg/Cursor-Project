import React, { useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ScanReceipt: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleScan = () => {
    // This would be implemented with a camera API in a real application
    setIsCameraActive(true);
    setTimeout(() => {
      setIsCameraActive(false);
      setIsOpen(false);
      // Show success toast
      alert("Receipt scanned successfully!");
    }, 3000);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      // Simulate upload process
      setTimeout(() => {
        setIsUploading(false);
        setIsOpen(false);
        // Show success toast
        alert("Receipt uploaded successfully!");
      }, 2000);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <Button 
          className="w-14 h-14 rounded-full shadow-lg p-0"
          onClick={() => setIsOpen(true)}
        >
          <Camera className="h-6 w-6" />
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan Receipt</DialogTitle>
            <DialogDescription>
              Scan a physical receipt or upload an image to create an NFT receipt.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {isCameraActive ? (
              <div className="relative">
                <div className="w-full h-64 bg-gray-100 rounded-md flex items-center justify-center">
                  <div className="animate-pulse text-gray-500">
                    Scanning receipt...
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => setIsCameraActive(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-32 flex flex-col justify-center gap-2"
                  onClick={handleScan}
                >
                  <Camera className="h-8 w-8" />
                  <span>Scan Receipt</span>
                </Button>
                
                <label 
                  htmlFor="receipt-upload" 
                  className="cursor-pointer h-32 border rounded-md border-input flex flex-col items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Upload className="h-8 w-8" />
                  <span>Upload Image</span>
                  <input 
                    id="receipt-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleUpload} 
                  />
                </label>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-start">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScanReceipt;

import { useState, useRef, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle2, UploadCloud, Camera, ReceiptIcon, ArrowRight, Tag, DollarSign, Landmark, ShoppingBag } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  processReceiptImage, 
  processReceiptBase64, 
  fileToBase64, 
  ReceiptData, 
  getReceiptTier, 
  ReceiptTier 
} from '@/lib/receiptOcr';

// Components
const UploadInstruction = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <div className="flex items-start space-x-3 mb-4">
    <div className="mt-1 text-primary">{icon}</div>
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const ScanReceiptPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [receiptTier, setReceiptTier] = useState<ReceiptTier | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // Reset state when changing tabs
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setReceiptData(null);
    setReceiptImage(null);
    setReceiptTier(null);
    setProgress(0);
    
    // Stop camera if it's active
    if (value !== 'camera' && isCameraActive) {
      stopCamera();
    }
    
    // Start camera if switching to camera tab
    if (value === 'camera' && !isCameraActive) {
      startCamera();
    }
  };
  
  // File dropzone for receipt upload
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setReceiptImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Process the receipt
    await processReceipt(file);
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    disabled: isProcessing
  });
  
  // Process the receipt image
  const processReceipt = async (file: File) => {
    try {
      setIsProcessing(true);
      setProgress(10);
      
      // Process image with OCR
      setProgress(30);
      const data = await processReceiptImage(file);
      setProgress(90);
      
      // Set receipt data
      setReceiptData(data);
      
      // Determine the receipt tier based on total
      const tier = getReceiptTier(data.total);
      setReceiptTier(tier);
      
      setProgress(100);
      
      toast({
        title: "Receipt scanned successfully",
        description: `Found ${data.items.length} items from ${data.merchantName}`,
      });
    } catch (error) {
      console.error('Receipt processing error:', error);
      toast({
        title: "Failed to process receipt",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Camera functionality
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError('Failed to access camera. Please check your camera permissions.');
    }
  };
  
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };
  
  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match the video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame on the canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg');
      setReceiptImage(imageData);
      
      // Process the image
      setIsProcessing(true);
      setProgress(20);
      
      // Extract the base64 data
      const base64Data = imageData.split(',')[1];
      
      // Process with OCR
      setProgress(50);
      const data = await processReceiptBase64(base64Data);
      setProgress(90);
      
      // Set receipt data
      setReceiptData(data);
      
      // Determine the receipt tier based on total
      const tier = getReceiptTier(data.total);
      setReceiptTier(tier);
      
      setProgress(100);
      
      // Stop camera after capture
      stopCamera();
      
      toast({
        title: "Receipt captured successfully",
        description: `Found ${data.items.length} items from ${data.merchantName}`,
      });
    } catch (error) {
      console.error('Image capture error:', error);
      toast({
        title: "Failed to process receipt",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Format currency
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };
  
  // Get tier badge color
  const getTierColor = (tier: ReceiptTier | null) => {
    if (!tier) return 'bg-gray-200';
    
    switch (tier) {
      case ReceiptTier.STANDARD:
        return 'bg-blue-100 text-blue-800';
      case ReceiptTier.PREMIUM:
        return 'bg-purple-100 text-purple-800';
      case ReceiptTier.LUXURY:
        return 'bg-amber-100 text-amber-800';
      case ReceiptTier.ULTRA:
        return 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white';
      default:
        return 'bg-gray-200';
    }
  };
  
  // Get tier icon
  const getTierIcon = (tier: ReceiptTier | null) => {
    if (!tier) return <Tag size={16} />;
    
    switch (tier) {
      case ReceiptTier.STANDARD:
        return <Tag size={16} />;
      case ReceiptTier.PREMIUM:
        return <DollarSign size={16} />;
      case ReceiptTier.LUXURY:
        return <Landmark size={16} />;
      case ReceiptTier.ULTRA:
        return <ShoppingBag size={16} />;
      default:
        return <Tag size={16} />;
    }
  };
  
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Scan Receipt</h1>
        <p className="text-muted-foreground">
          Upload or take a photo of your receipt to create a blockchain-verified digital copy
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" disabled={isProcessing}>Upload Receipt</TabsTrigger>
          <TabsTrigger value="camera" disabled={isProcessing}>Take Photo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4 mt-4">
          {!receiptData ? (
            <Card>
              <CardHeader>
                <CardTitle>Upload Receipt Image</CardTitle>
                <CardDescription>
                  Drag and drop a photo of your receipt, or click to select a file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer hover:bg-muted/50 ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20'
                  }`}
                >
                  <input {...getInputProps()} />
                  <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  {isDragActive ? (
                    <p className="text-primary font-medium">Drop the receipt image here...</p>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Drag and drop a receipt image here, or click to select
                      </p>
                      <Button size="sm" disabled={isProcessing}>
                        Select Image
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4 mt-6">
                  <h3 className="text-base font-medium">How it works:</h3>
                  <UploadInstruction 
                    title="Upload any receipt" 
                    description="Paper receipts, digital receipts, or screenshots" 
                    icon={<ReceiptIcon size={18} />} 
                  />
                  <UploadInstruction 
                    title="Smart OCR extraction" 
                    description="Our AI scans and extracts all receipt details" 
                    icon={<CheckCircle2 size={18} />} 
                  />
                  <UploadInstruction 
                    title="Create NFT receipt" 
                    description="Store your receipt securely on the blockchain" 
                    icon={<ArrowRight size={18} />} 
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Receipt Preview */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Receipt Image</CardTitle>
                </CardHeader>
                <CardContent>
                  {receiptImage && (
                    <div className="rounded-lg overflow-hidden border">
                      <img 
                        src={receiptImage} 
                        alt="Receipt" 
                        className="w-full object-contain max-h-96" 
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Extracted Data */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Extracted Data</CardTitle>
                    {receiptTier && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTierColor(receiptTier)}`}>
                        {getTierIcon(receiptTier)} {receiptTier.toUpperCase()} TIER
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="px-0">
                  <ScrollArea className="h-96 px-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground text-xs">MERCHANT</Label>
                        <p className="text-lg font-semibold">{receiptData.merchantName}</p>
                      </div>
                      
                      <div>
                        <Label className="text-muted-foreground text-xs">DATE</Label>
                        <p>{new Date(receiptData.date).toLocaleDateString()}</p>
                      </div>
                      
                      {receiptData.category && (
                        <div>
                          <Label className="text-muted-foreground text-xs">CATEGORY</Label>
                          <p className="capitalize">{receiptData.category}</p>
                        </div>
                      )}
                      
                      <Separator />
                      
                      <div>
                        <Label className="text-muted-foreground text-xs">ITEMS</Label>
                        <div className="space-y-2 mt-1">
                          {receiptData.items.map((item, i) => (
                            <div key={i} className="flex justify-between">
                              <div>
                                <span>{item.name}</span>
                                {item.quantity > 1 && (
                                  <span className="text-muted-foreground text-sm ml-1">×{item.quantity}</span>
                                )}
                              </div>
                              <span className="font-medium">{formatCurrency(item.price)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>{formatCurrency(receiptData.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax</span>
                          <span>{formatCurrency(receiptData.tax)}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>{formatCurrency(receiptData.total)}</span>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <div className="w-full">
                    <p className="text-sm text-muted-foreground mb-3">
                      Ready to save this receipt to the blockchain?
                    </p>
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1" 
                        onClick={() => {
                          // Reset and scan a new receipt
                          setReceiptData(null);
                          setReceiptImage(null);
                          setReceiptTier(null);
                        }}
                        variant="outline"
                      >
                        Scan Another
                      </Button>
                      <Button className="flex-1">
                        Create NFT Receipt
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="camera" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Take a Photo of Your Receipt</CardTitle>
              <CardDescription>
                Position the receipt clearly in the frame and take a photo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cameraError && (
                <Alert className="mb-4 bg-red-50" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Camera Error</AlertTitle>
                  <AlertDescription>{cameraError}</AlertDescription>
                </Alert>
              )}
              
              {!receiptData ? (
                <div className="space-y-4">
                  <div className="relative rounded-lg overflow-hidden border aspect-[3/4] flex items-center justify-center bg-black">
                    {!isCameraActive ? (
                      <div className="text-white text-center p-4">
                        <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Camera will appear here</p>
                      </div>
                    ) : (
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <canvas ref={canvasRef} className="hidden" />
                  
                  <div className="flex justify-center">
                    {isCameraActive ? (
                      <Button 
                        size="lg" 
                        className="rounded-full w-16 h-16 p-0"
                        onClick={captureImage}
                        disabled={isProcessing}
                      >
                        <span className="sr-only">Take Photo</span>
                        <div className="rounded-full w-12 h-12 bg-white" />
                      </Button>
                    ) : (
                      <Button onClick={startCamera} disabled={isProcessing}>
                        Start Camera
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4 mt-2">
                    <h3 className="text-base font-medium">Tips for best results:</h3>
                    <UploadInstruction 
                      title="Good lighting" 
                      description="Ensure the receipt is well-lit without shadows" 
                      icon={<AlertCircle size={18} />} 
                    />
                    <UploadInstruction 
                      title="Flat surface" 
                      description="Smooth out wrinkles and place on a dark background" 
                      icon={<AlertCircle size={18} />} 
                    />
                    <UploadInstruction 
                      title="Capture full receipt" 
                      description="Make sure the entire receipt is visible in the frame" 
                      icon={<AlertCircle size={18} />} 
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Receipt Preview */}
                  <div>
                    <Label className="block mb-2">Receipt Image</Label>
                    {receiptImage && (
                      <div className="rounded-lg overflow-hidden border">
                        <img 
                          src={receiptImage} 
                          alt="Receipt" 
                          className="w-full object-contain max-h-80" 
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Extracted Data */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Extracted Data</Label>
                      {receiptTier && (
                        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getTierColor(receiptTier)}`}>
                          {getTierIcon(receiptTier)} {receiptTier.toUpperCase()} TIER
                        </div>
                      )}
                    </div>
                    <ScrollArea className="h-80 border rounded-lg p-4">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-muted-foreground text-xs">MERCHANT</Label>
                          <p className="text-lg font-semibold">{receiptData.merchantName}</p>
                        </div>
                        
                        <div>
                          <Label className="text-muted-foreground text-xs">DATE</Label>
                          <p>{new Date(receiptData.date).toLocaleDateString()}</p>
                        </div>
                        
                        {receiptData.category && (
                          <div>
                            <Label className="text-muted-foreground text-xs">CATEGORY</Label>
                            <p className="capitalize">{receiptData.category}</p>
                          </div>
                        )}
                        
                        <Separator />
                        
                        <div>
                          <Label className="text-muted-foreground text-xs">ITEMS</Label>
                          <div className="space-y-2 mt-1">
                            {receiptData.items.map((item, i) => (
                              <div key={i} className="flex justify-between">
                                <div>
                                  <span>{item.name}</span>
                                  {item.quantity > 1 && (
                                    <span className="text-muted-foreground text-sm ml-1">×{item.quantity}</span>
                                  )}
                                </div>
                                <span className="font-medium">{formatCurrency(item.price)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatCurrency(receiptData.subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tax</span>
                            <span>{formatCurrency(receiptData.tax)}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Total</span>
                            <span>{formatCurrency(receiptData.total)}</span>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              )}
            </CardContent>
            {receiptData && (
              <CardFooter className="border-t px-6 py-4">
                <div className="w-full">
                  <p className="text-sm text-muted-foreground mb-3">
                    Ready to save this receipt to the blockchain?
                  </p>
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1" 
                      onClick={() => {
                        // Reset and scan a new receipt
                        setReceiptData(null);
                        setReceiptImage(null);
                        setReceiptTier(null);
                        startCamera();
                      }}
                      variant="outline"
                    >
                      Scan Another
                    </Button>
                    <Button className="flex-1">
                      Create NFT Receipt
                    </Button>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Progress indicator */}
      {isProcessing && (
        <Card className="mb-6">
          <CardContent className="py-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {progress < 100 ? 'Processing receipt...' : 'Processing complete!'}
                </p>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScanReceiptPage;
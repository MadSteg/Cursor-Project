import React, { useState } from 'react';
import CloudStorageGallery from '../components/CloudStorageGallery';
import CloudImage from '../components/CloudImage';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CloudStorageDemo: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [folderPath, setFolderPath] = useState<string>('bulldogs/');
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setUploadStatus('idle');
      setUploadError('');
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file first');
      return;
    }
    
    try {
      setUploadStatus('uploading');
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('folderPath', folderPath);
      
      const response = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload file');
      }
      
      const data = await response.json();
      setUploadedImageUrl(data.publicUrl);
      setUploadStatus('success');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('error');
      setUploadError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };
  
  const handleFolderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Ensure folder path ends with a slash
    let path = event.target.value;
    if (path && !path.endsWith('/')) {
      path += '/';
    }
    setFolderPath(path);
  };
  
  return (
    <div className="container mx-auto py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-center brand-gradient-text">BlockReceipt Cloud Storage</h1>
      <p className="text-center text-muted-foreground mb-10">
        High-quality images for your NFT receipts powered by Google Cloud Storage
      </p>
      
      <Tabs defaultValue="gallery" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery">NFT Gallery</TabsTrigger>
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gallery" className="p-4 border rounded-lg mt-4">
          <CloudStorageGallery />
        </TabsContent>
        
        <TabsContent value="upload" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload to Cloud Storage</CardTitle>
              <CardDescription>
                Upload high-quality images to your Google Cloud Storage bucket
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="folder">Folder Path (optional)</Label>
                  <Input 
                    id="folder" 
                    placeholder="e.g., bulldogs/" 
                    value={folderPath} 
                    onChange={handleFolderChange} 
                  />
                  <p className="text-xs text-muted-foreground">
                    The folder path in your bucket where the image should be stored
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Select Image</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="image" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleUpload} 
                      disabled={!selectedFile || uploadStatus === 'uploading'}
                    >
                      {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
                    </Button>
                  </div>
                </div>
                
                {uploadStatus === 'error' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Upload Failed</AlertTitle>
                    <AlertDescription>
                      {uploadError || 'There was an error uploading your image.'}
                    </AlertDescription>
                  </Alert>
                )}
                
                {uploadStatus === 'success' && (
                  <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    <ImageIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle className="text-green-600 dark:text-green-400">Upload Successful</AlertTitle>
                    <AlertDescription>
                      Your image has been uploaded to the cloud storage.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
            
            {uploadStatus === 'success' && uploadedImageUrl && (
              <CardFooter className="flex flex-col items-center border-t p-6">
                <h3 className="text-lg font-medium mb-4">Uploaded Image Preview</h3>
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <img 
                    src={uploadedImageUrl} 
                    alt="Uploaded preview" 
                    className="max-w-full h-auto max-h-80"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  This image is now available in your Google Cloud Storage bucket
                </p>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold mb-4">How to Use Cloud Images</h2>
        
        <Card>
          <CardHeader>
            <CardTitle>CloudImage Component</CardTitle>
            <CardDescription>
              Display any image from your Google Cloud Storage with built-in loading states and error handling
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="font-medium">Basic Usage</p>
                <div className="border rounded bg-slate-50 dark:bg-slate-900 p-4">
                  <CloudImage 
                    fileName="bulldogs/basic.png" 
                    alt="Basic example" 
                    className="w-full h-auto rounded"
                  />
                </div>
                <code className="text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded block whitespace-pre-wrap">
                  {`<CloudImage 
  fileName="bulldogs/basic.png" 
  alt="Basic example" 
  className="w-full h-auto"
/>`}
                </code>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">With Fallback</p>
                <div className="border rounded bg-slate-50 dark:bg-slate-900 p-4">
                  <CloudImage 
                    fileName="bulldogs/nonexistent.png" 
                    alt="Fallback example" 
                    fallbackImage="/icons/placeholder-image.svg"
                    className="w-full h-auto rounded"
                  />
                </div>
                <code className="text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded block whitespace-pre-wrap">
                  {`<CloudImage 
  fileName="bulldogs/nonexistent.png" 
  alt="Fallback example" 
  fallbackImage="/icons/placeholder.svg"
  className="w-full h-auto"
/>`}
                </code>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Custom Dimensions</p>
                <div className="border rounded bg-slate-50 dark:bg-slate-900 p-4">
                  <CloudImage 
                    fileName="bulldogs/sized.png" 
                    alt="Sized example" 
                    width={150}
                    height={150}
                    className="rounded"
                  />
                </div>
                <code className="text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded block whitespace-pre-wrap">
                  {`<CloudImage 
  fileName="bulldogs/sized.png" 
  alt="Sized example" 
  width={150}
  height={150}
  className="rounded"
/>`}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CloudStorageDemo;
import React, { useState } from 'react';
import CloudStorageGallery from '../components/CloudStorageGallery';
import CloudImage from '../components/CloudImage';
import { AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';

const CloudStorageDemo: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');
  const [folderPath, setFolderPath] = useState<string>('bulldogs/');
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');
  
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
      <p className="text-center text-gray-600 dark:text-gray-400 mb-10">
        High-quality images for your NFT receipts powered by Google Cloud Storage
      </p>
      
      {/* Basic Tabs */}
      <div className="mb-8">
        <div className="flex mb-4 border-b">
          <button 
            className={`py-2 px-4 ${activeTab === 'gallery' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('gallery')}
          >
            NFT Gallery
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === 'upload' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload Image
          </button>
        </div>
        
        {activeTab === 'gallery' && (
          <div className="p-4 border rounded-lg mt-4">
            <CloudStorageGallery />
          </div>
        )}
        
        {activeTab === 'upload' && (
          <div className="mt-4 border rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">Upload to Cloud Storage</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Upload high-quality images to your Google Cloud Storage bucket
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="folder" className="block font-medium">Folder Path (optional)</label>
                <input 
                  id="folder" 
                  className="w-full p-2 border rounded" 
                  placeholder="e.g., bulldogs/" 
                  value={folderPath} 
                  onChange={handleFolderChange} 
                />
                <p className="text-xs text-gray-500">
                  The folder path in your bucket where the image should be stored
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="image" className="block font-medium">Select Image</label>
                <div className="flex items-center gap-2">
                  <input 
                    id="image" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="flex-1 p-2 border rounded"
                  />
                  <button 
                    onClick={handleUpload} 
                    disabled={!selectedFile || uploadStatus === 'uploading'}
                    className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
                  >
                    {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </div>
              
              {uploadStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Upload Failed</h3>
                      <p className="text-sm">
                        {uploadError || 'There was an error uploading your image.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {uploadStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-green-700">
                  <div className="flex items-start">
                    <ImageIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Upload Successful</h3>
                      <p className="text-sm">
                        Your image has been uploaded to the cloud storage.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {uploadStatus === 'success' && uploadedImageUrl && (
              <div className="mt-6 pt-6 border-t flex flex-col items-center">
                <h3 className="text-lg font-medium mb-4">Uploaded Image Preview</h3>
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <img 
                    src={uploadedImageUrl} 
                    alt="Uploaded preview" 
                    className="max-w-full h-auto max-h-80"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  This image is now available in your Google Cloud Storage bucket
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold mb-4">How to Use Cloud Images</h2>
        
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-100 dark:bg-gray-800 p-4">
            <h3 className="text-xl font-bold">CloudImage Component</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Display any image from your Google Cloud Storage with built-in loading states and error handling
            </p>
          </div>
          
          <div className="p-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudStorageDemo;
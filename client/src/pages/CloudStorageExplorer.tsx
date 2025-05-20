import React, { useState, useEffect } from 'react';
import CloudImage from '../components/CloudImage';

interface CloudFile {
  name: string;
  url: string;
  size?: number;
  contentType?: string;
  updated?: string;
}

const CloudStorageExplorer: React.FC = () => {
  const [files, setFiles] = useState<CloudFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string>('');

  useEffect(() => {
    // Fetch all files from the bucket
    fetchAllFiles();
  }, []);

  const fetchAllFiles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch files directly from the server
      const response = await fetch('/api/storage/all-files');
      if (!response.ok) {
        throw new Error(`Error fetching files: ${response.statusText}`);
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file first');
      return;
    }

    try {
      setUploadStatus('uploading');
      setUploadError('');

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/storage/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload file');
      }

      // Refresh file list after successful upload
      await fetchAllFiles();
      setUploadStatus('success');
      setSelectedFile(null);
      
      // Reset the file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setUploadStatus('error');
      setUploadError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Cloud Storage Explorer</h1>
      
      <div className="mb-8 p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Upload New File</h2>
        
        <div className="flex flex-col md:flex-row gap-4 items-start mb-4">
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploadStatus === 'uploading'}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload to Cloud'}
          </button>
        </div>
        
        {uploadStatus === 'error' && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            <p className="font-medium">Upload failed</p>
            <p className="text-sm">{uploadError}</p>
          </div>
        )}
        
        {uploadStatus === 'success' && (
          <div className="p-3 bg-green-100 text-green-700 rounded">
            <p className="font-medium">File uploaded successfully!</p>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">All Files in Bucket</h2>
          <button 
            onClick={fetchAllFiles}
            className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Refresh
          </button>
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading files...</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            <p className="font-medium">Error loading files</p>
            <p>{error}</p>
          </div>
        )}
        
        {!loading && !error && files.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-lg text-gray-600 dark:text-gray-400">No files found in the bucket</p>
            <p className="text-sm mt-1 text-gray-500">Upload your first file to get started</p>
          </div>
        )}
        
        {!loading && files.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <div 
                key={file.name} 
                className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 border-b bg-gray-50 dark:bg-gray-700">
                  <p className="font-medium truncate" title={file.name}>
                    {file.name}
                  </p>
                </div>
                
                <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-900">
                  {file.contentType?.startsWith('image/') ? (
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      <img 
                        src={file.url} 
                        alt={file.name} 
                        className="w-full h-full object-contain"
                      />
                    </a>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center p-4">
                        <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                          <span className="text-2xl">📄</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {file.contentType || 'Unknown type'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-3 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between mb-1">
                    <span>Size:</span>
                    <span>{file.size ? `${Math.round(file.size / 1024)} KB` : 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <a 
                      href={file.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View File
                    </a>
                    <span>{file.updated ? new Date(file.updated).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudStorageExplorer;
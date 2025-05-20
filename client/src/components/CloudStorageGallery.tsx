import React, { useState, useEffect } from 'react';
import CloudImage from './CloudImage';

interface CloudImage {
  fileName: string;
  id: string;
  url: string;
}

/**
 * CloudStorageGallery Component
 * 
 * This component displays NFT images from Google Cloud Storage
 * It fetches a list of images from the API and displays them in a grid
 */
const CloudStorageGallery: React.FC = () => {
  const [images, setImages] = useState<CloudImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchNftImages() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch NFT images from the storage API
        const response = await fetch('/api/storage/nft-images');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch images: ${response.statusText}`);
        }
        
        const data = await response.json();
        setImages(data.images || []);
      } catch (error) {
        console.error('Error fetching cloud images:', error);
        setError('Failed to load images from cloud storage');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchNftImages();
  }, []);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div 
            key={`skeleton-${index}`} 
            className="aspect-square rounded-lg animate-pulse bg-slate-200 dark:bg-slate-700"
          />
        ))}
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400 mb-2">
          {error}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Please make sure your Google Cloud Storage is properly configured.
        </p>
      </div>
    );
  }
  
  // Show empty state
  if (images.length === 0) {
    return (
      <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-lg font-medium mb-2">No images found</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Upload some images to your Google Cloud Storage bucket to get started.
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Images should be placed in the "bulldogs/" folder in your bucket.
        </p>
      </div>
    );
  }
  
  // Show the gallery of images
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold brand-gradient-text">Cloud-Hosted NFT Gallery</h2>
      <p className="text-muted-foreground mb-6">
        These high-quality images are loaded directly from your Google Cloud Storage bucket.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <CloudImage
              fileName={image.fileName}
              alt={`NFT ${image.id}`}
              className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <span className="text-white text-sm font-bold truncate">
                {image.id}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CloudStorageGallery;
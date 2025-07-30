import React, { useState, useEffect } from 'react';

interface CloudImageProps {
  fileName: string;
  alt: string;
  className?: string;
  fallbackImage?: string;
  width?: string | number;
  height?: string | number;
}

/**
 * CloudImage Component
 * 
 * This component loads images from Google Cloud Storage
 * It handles loading states, errors, and fallbacks automatically
 * 
 * @param fileName - The name of the file in the Google Cloud Storage bucket
 * @param alt - Alt text for the image
 * @param className - Optional CSS class for styling
 * @param fallbackImage - Optional fallback image URL to use if loading fails
 * @param width - Optional width
 * @param height - Optional height
 */
const CloudImage: React.FC<CloudImageProps> = ({ 
  fileName, 
  alt, 
  className = '', 
  fallbackImage = '/images/placeholder.png',
  width,
  height
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  
  useEffect(() => {
    async function fetchImageUrl() {
      try {
        setIsLoading(true);
        setHasError(false);
        
        // Get image URL from the storage API
        const response = await fetch(`/api/storage/file?fileName=${encodeURIComponent(fileName)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch image URL: ${response.statusText}`);
        }
        
        const data = await response.json();
        setImageUrl(data.url);
      } catch (error) {
        console.error('Error fetching cloud image:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchImageUrl();
  }, [fileName]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} style={{ width, height }}>
        <span className="sr-only">Loading image...</span>
      </div>
    );
  }
  
  // Show error state with fallback
  if (hasError || !imageUrl) {
    return (
      <img 
        src={fallbackImage} 
        alt={`${alt} (unavailable)`} 
        className={className}
        width={width}
        height={height}
      />
    );
  }
  
  // Show the image
  return (
    <img 
      src={imageUrl} 
      alt={alt} 
      className={className}
      width={width}
      height={height}
      onError={() => setHasError(true)}
    />
  );
};

export default CloudImage;
import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'page' | 'nft-grid' | 'hero';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'card', 
  count = 1 
}) => {
  const renderCardSkeleton = () => (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 animate-pulse">
      <div className="bg-white/20 h-32 rounded-lg mb-4"></div>
      <div className="space-y-2">
        <div className="bg-white/20 h-4 rounded w-3/4"></div>
        <div className="bg-white/20 h-3 rounded w-1/2"></div>
        <div className="bg-white/20 h-3 rounded w-2/3"></div>
      </div>
    </div>
  );

  const renderNFTGridSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {Array.from({ length: count || 12 }).map((_, i) => (
        <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden animate-pulse">
          <div className="bg-white/20 h-32 w-full"></div>
          <div className="p-3 space-y-2">
            <div className="bg-white/20 h-3 rounded w-3/4"></div>
            <div className="bg-white/20 h-2 rounded w-1/2"></div>
            <div className="bg-white/20 h-2 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderHeroSkeleton = () => (
    <div className="text-center py-16 animate-pulse">
      <div className="bg-white/20 h-12 rounded w-3/4 mx-auto mb-6"></div>
      <div className="bg-white/20 h-6 rounded w-2/3 mx-auto mb-4"></div>
      <div className="bg-white/20 h-6 rounded w-1/2 mx-auto mb-8"></div>
      <div className="bg-white/20 h-12 rounded-full w-48 mx-auto"></div>
    </div>
  );

  const renderPageSkeleton = () => (
    <div className="space-y-8 animate-pulse">
      {renderHeroSkeleton()}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count || 6 }).map((_, i) => (
          <div key={i}>{renderCardSkeleton()}</div>
        ))}
      </div>
    </div>
  );

  switch (type) {
    case 'nft-grid':
      return renderNFTGridSkeleton();
    case 'hero':
      return renderHeroSkeleton();
    case 'page':
      return renderPageSkeleton();
    default:
      return (
        <div className="space-y-4">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i}>{renderCardSkeleton()}</div>
          ))}
        </div>
      );
  }
};

export default LoadingSkeleton;
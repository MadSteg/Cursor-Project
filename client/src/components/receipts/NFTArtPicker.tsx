import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Image, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface NFTOption {
  id: string;
  name: string;
  image: string;
  preview: string;
  description: string;
}

interface NFTArtPickerProps {
  receiptData: any;
  onSelect: (selectedNft: NFTOption) => void;
  onCancel: () => void;
}

const NFTArtPicker: React.FC<NFTArtPickerProps> = ({ receiptData, onSelect, onCancel }) => {
  const [options, setOptions] = useState<NFTOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { toast } = useToast();

  // Extract tags from receipt data
  const tags = receiptData?.items?.map((item: any) => item.name.split(' ')[0].toLowerCase()) || [];
  
  useEffect(() => {
    const fetchNFTOptions = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiRequest('POST', '/api/nft-options', {
          tags,
          merchantName: receiptData?.merchantName || '',
          items: receiptData?.items || [],
          tier: receiptData?.tier?.id || 'BASIC'
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Use placeholder images for development
          const placeholderOptions = result.options.map((option: NFTOption, index: number) => ({
            ...option,
            // Use a mix of different placeholder images
            image: `https://via.placeholder.com/300x300/${getColorForIndex(index)}/ffffff?text=${encodeURIComponent(option.name.split(' ')[0])}`,
            preview: `https://via.placeholder.com/150x150/${getColorForIndex(index)}/ffffff?text=${encodeURIComponent(option.name.split(' ')[0])}`
          }));
          
          setOptions(placeholderOptions);
        } else {
          throw new Error(result.message || 'Failed to fetch NFT options');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching NFT options');
        toast({
          title: 'Error',
          description: err.message || 'Failed to load BlockReceipt art options',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchNFTOptions();
  }, [receiptData]);
  
  const handleSelect = (option: NFTOption) => {
    setSelectedId(option.id);
    onSelect(option);
  };
  
  // Generate a color based on the index
  function getColorForIndex(index: number): string {
    const colors = ['3b82f6', '8b5cf6', 'ec4899', 'f59e0b', '10b981', 'ef4444'];
    return colors[index % colors.length];
  }
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg font-medium">Generating BlockReceipt Art Options...</p>
        <p className="text-muted-foreground">We're creating special art for your receipt</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 p-6 rounded-lg mb-6">
          <p className="text-red-600 mb-2">{error}</p>
          <Button onClick={onCancel} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-4">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">Choose Your BlockReceipt Art</h3>
        <p className="text-muted-foreground">
          Select one of these unique digital collectibles for your receipt from {receiptData?.merchantName}
        </p>
        
        {/* Show extracted categories */}
        {tags && tags.length > 0 && (
          <div className="mt-4 p-4 rounded-md bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-medium mb-2">Receipt Categories</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, index: number) => (
                <span 
                  key={index} 
                  className={`px-2 py-1 text-xs rounded-full bg-${getColorForIndex(index)}/20 text-${getColorForIndex(index)}/80 border border-${getColorForIndex(index)}/30`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              We've automatically categorized your purchase to help with inventory tracking and spending analytics
            </p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((option) => (
          <Card 
            key={option.id}
            className={`overflow-hidden transition-all cursor-pointer hover:shadow-md ${
              selectedId === option.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleSelect(option)}
          >
            <div className="relative aspect-square">
              <img 
                src={option.image} 
                alt={option.name}
                className="w-full h-full object-cover" 
              />
              {selectedId === option.id && (
                <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
            <CardContent className="p-3">
              <h4 className="font-medium truncate">{option.name}</h4>
              <p className="text-xs text-muted-foreground truncate">{option.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          disabled={!selectedId} 
          onClick={() => {
            const selected = options.find(o => o.id === selectedId);
            if (selected) onSelect(selected);
          }}
        >
          {selectedId ? 'Mint Selected BlockReceipt' : 'Select a BlockReceipt Design'}
        </Button>
      </div>
    </div>
  );
};

export default NFTArtPicker;
/**
 * NFT Art Selector Component
 * 
 * This component allows users to select from available NFT art options
 * when minting a receipt NFT. The available options are determined by
 * the tier of the receipt, which is based on the total amount spent.
 */

import React, { useState, useEffect } from 'react';
import { NftArtOption, NftArtTier, getAvailableArtOptions, determineReceiptTier } from '@/data/nftArtManifest';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NFTArtSelectorProps {
  totalAmount: number;
  onArtSelected: (artOption: NftArtOption) => void;
  preselectedArtId?: string;
}

export const NFTArtSelector: React.FC<NFTArtSelectorProps> = ({ 
  totalAmount, 
  onArtSelected,
  preselectedArtId
}) => {
  // Determine the tier based on the total amount
  const receiptTier = determineReceiptTier(totalAmount);
  
  // Get available art options for this tier
  const artOptions = getAvailableArtOptions(receiptTier);
  
  // State for the selected art option
  const [selectedArtId, setSelectedArtId] = useState<string>(
    preselectedArtId || (artOptions.length > 0 ? artOptions[0].id : '')
  );
  
  // State for the active tab (tier)
  const [activeTab, setActiveTab] = useState<NftArtTier>(receiptTier);
  
  // Group art options by tier
  const artOptionsByTier = artOptions.reduce((acc, option) => {
    if (!acc[option.tier]) {
      acc[option.tier] = [];
    }
    acc[option.tier].push(option);
    return acc;
  }, {} as Record<NftArtTier, NftArtOption[]>);
  
  // Effect to notify parent of selection change
  useEffect(() => {
    const selectedArt = artOptions.find(art => art.id === selectedArtId);
    if (selectedArt) {
      onArtSelected(selectedArt);
    }
  }, [selectedArtId, onArtSelected, artOptions]);
  
  // Helper to get tier display name
  const getTierDisplayName = (tier: NftArtTier): string => {
    const capitalizeFirst = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
    return capitalizeFirst(tier);
  };
  
  // Helper to get tier badge color
  const getTierBadgeVariant = (tier: NftArtTier): "default" | "secondary" | "destructive" | "outline" => {
    switch (tier) {
      case 'standard':
        return 'default';
      case 'premium':
        return 'secondary';
      case 'luxury':
        return 'destructive';
      case 'ultra':
        return 'outline';
      default:
        return 'default';
    }
  };
  
  // Get the tiers in order from highest to lowest that this receipt qualifies for
  const availableTiers = Object.keys(artOptionsByTier) as NftArtTier[];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Select NFT Art Design</span>
          <Badge variant={getTierBadgeVariant(receiptTier)}>
            {getTierDisplayName(receiptTier)} Tier
          </Badge>
        </CardTitle>
        <CardDescription>
          Choose from {artOptions.length} different designs for your receipt NFT
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={receiptTier} onValueChange={(value) => setActiveTab(value as NftArtTier)}>
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${availableTiers.length}, 1fr)` }}>
            {availableTiers.map(tier => (
              <TabsTrigger key={tier} value={tier}>
                {getTierDisplayName(tier)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {availableTiers.map(tier => (
            <TabsContent key={tier} value={tier}>
              <RadioGroup 
                value={selectedArtId} 
                onValueChange={setSelectedArtId}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
              >
                {artOptionsByTier[tier].map(art => (
                  <div key={art.id} className="relative">
                    <RadioGroupItem 
                      value={art.id} 
                      id={art.id} 
                      className="sr-only" 
                    />
                    <Label 
                      htmlFor={art.id} 
                      className={`
                        flex flex-col items-center p-4 rounded-lg border-2 cursor-pointer
                        transition-all duration-200 hover:bg-secondary/10
                        ${selectedArtId === art.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-gray-200 dark:border-gray-700'}
                      `}
                    >
                      <div className="relative w-full aspect-square mb-3 overflow-hidden rounded-md">
                        <img 
                          src={art.thumbnailUrl} 
                          alt={art.name} 
                          className="object-cover w-full h-full"
                        />
                        {art.rarity && art.rarity <= 10 && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Rare
                          </span>
                        )}
                      </div>
                      <div className="text-center">
                        <h3 className="font-medium">{art.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {art.description.length > 60 
                            ? art.description.substring(0, 60) + '...'
                            : art.description}
                        </p>
                        {art.artist && (
                          <p className="text-xs text-gray-400 mt-1">Artist: {art.artist}</p>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          {receiptTier === 'standard' ? (
            <span>Spend $50+ to unlock Premium tier designs</span>
          ) : receiptTier === 'premium' ? (
            <span>Spend $100+ to unlock Luxury tier designs</span>
          ) : receiptTier === 'luxury' ? (
            <span>Spend $500+ to unlock Ultra tier designs</span>
          ) : (
            <span>All NFT designs unlocked!</span>
          )}
        </div>
        <Button 
          onClick={() => {
            const selectedArt = artOptions.find(art => art.id === selectedArtId);
            if (selectedArt) onArtSelected(selectedArt);
          }}
        >
          Confirm Selection
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NFTArtSelector;
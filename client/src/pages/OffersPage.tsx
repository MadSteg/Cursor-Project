/**
 * OffersPage.tsx
 * 
 * Page for displaying time-limited promotional offers 
 * and coupons attached to NFT receipts
 */

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import CouponCard from '../components/coupons/CouponCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const OffersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Fetch NFTs with coupons
  const { data: nfts, isLoading, error } = useQuery({
    queryKey: ['/api/nfts/with-coupons'],
    retry: 1,
  });

  // Filter NFTs by active/expired
  const now = Date.now();
  const activeOffers = nfts?.filter(
    (nft) => nft.metadata?.coupon?.validUntil && now < nft.metadata.coupon.validUntil
  ) || [];
  
  const expiredOffers = nfts?.filter(
    (nft) => nft.metadata?.coupon?.validUntil && now >= nft.metadata.coupon.validUntil
  ) || [];

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Helmet>
        <title>Exclusive Offers & Coupons | BlockReceipt.ai</title>
        <meta 
          name="description" 
          content="View your exclusive time-limited offers and promotional coupons from your receipts on BlockReceipt.ai" 
        />
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500 mb-2">
          Exclusive Offers
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Special discounts and promotional offers attached to your receipts. 
          These offers are encrypted and time-limited - they can only be revealed during their validity period.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-60">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load offers. Please try again later.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {nfts?.length === 0 ? (
            <Card className="p-6 text-center">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Info className="h-5 w-5" />
                  No Offers Available
                </CardTitle>
                <CardDescription>
                  You don't have any promotional offers attached to your receipts yet. 
                  New offers will appear here after processing receipts.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-6">
                <TabsTrigger value="all" className="relative">
                  All Offers
                  {nfts?.length > 0 && (
                    <span className="ml-2 text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                      {nfts.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="active" className="relative">
                  Active
                  {activeOffers.length > 0 && (
                    <span className="ml-2 text-xs bg-green-500/10 px-2 py-0.5 rounded-full text-green-600 dark:text-green-400">
                      {activeOffers.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="expired" className="relative">
                  Expired
                  {expiredOffers.length > 0 && (
                    <span className="ml-2 text-xs bg-gray-500/10 px-2 py-0.5 rounded-full text-gray-500">
                      {expiredOffers.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {nfts?.map((nft) => (
                    <CouponCard key={nft.id} nft={nft} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="active" className="mt-0">
                {activeOffers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No active offers available
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeOffers.map((nft) => (
                      <CouponCard key={nft.id} nft={nft} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="expired" className="mt-0">
                {expiredOffers.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No expired offers
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {expiredOffers.map((nft) => (
                      <CouponCard key={nft.id} nft={nft} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </>
      )}
    </div>
  );
};

export default OffersPage;
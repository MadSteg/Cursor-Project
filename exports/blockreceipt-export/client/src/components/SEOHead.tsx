import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'BlockReceipt.ai - Secure Digital Receipts on Blockchain',
  description = 'Transform your receipts into secure, encrypted NFTs with BlockReceipt.ai. Carbon-neutral digital receipts powered by Threshold Network encryption and Polygon blockchain.',
  keywords = 'blockchain receipts, NFT receipts, digital receipts, Threshold PRE, privacy-first receipts, carbon-neutral receipts, Web3 receipts, encrypted receipts',
  image = '/og-image.png',
  url = 'https://blockreceipt.ai',
  type = 'website'
}) => {
  const fullTitle = title.includes('BlockReceipt') ? title : `${title} | BlockReceipt.ai`;
  const fullUrl = url.startsWith('http') ? url : `https://blockreceipt.ai${url}`;
  const fullImage = image.startsWith('http') ? image : `https://blockreceipt.ai${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="author" content="BlockReceipt.ai" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="BlockReceipt.ai" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="msapplication-TileColor" content="#6366f1" />
      
      {/* Structured Data for Web3/Blockchain */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "BlockReceipt.ai",
          "description": description,
          "url": "https://blockreceipt.ai",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "creator": {
            "@type": "Organization",
            "name": "BlockReceipt.ai",
            "url": "https://blockreceipt.ai"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;
import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header/Navigation
    'nav.mintBlockReceipt': 'Mint a BlockReceipt',
    'nav.nftGallery': 'NFT Gallery',
    'nav.whyBlockReceipt': 'Why BlockReceipt?',
    'nav.forMerchants': 'For Merchants',
    'nav.posDemo': 'POS Demo',
    'nav.howItWorks': 'How BlockReceipt Works',
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    
    // Gallery
    'gallery.title': 'Enhanced NFT Gallery',
    'gallery.description': 'Discover our exclusive character NFTs - each with unique traits and varying rarity levels. Mint these collectible characters to your wallet or earn them by uploading receipts.',
    'gallery.filterByMerchant': 'Filter by Merchant',
    'gallery.filterByRarity': 'Filter by Rarity',
    'gallery.allMerchants': 'All Merchants',
    'gallery.allRarities': 'All',
    'gallery.mintThisNft': 'MINT THIS NFT',
    'gallery.minted': '✓ MINTED',
    'gallery.noNftsFound': 'No NFTs Found',
    'gallery.tryDifferentFilter': 'Try selecting a different rarity or merchant filter',
    
    // Home Page
    'home.title': 'Digital Receipts. Minted at Checkout.',
    'home.subtitle': 'The future of point-of-sale receipts is here',
    'home.description': 'BlockReceipt transforms every purchase into a secure, verifiable NFT receipt. Minted instantly at checkout — no paper, no uploads, just better receipts.',
    'home.getStarted': 'Get Started',
    'home.learnMore': 'Learn More',
    'home.features.secure': 'Instant & Verifiable',
    'home.features.secureDesc': 'Receipts are minted on-chain with cryptographic proof',
    'home.features.tradeable': 'No Paper Waste',
    'home.features.tradeableDesc': 'Eco-friendly digital receipts replace thermal paper',
    'home.features.universal': 'POS Integration',
    'home.features.universalDesc': 'Works with existing point-of-sale systems',
    
    // Common
    'common.connectWallet': 'Connect Wallet',
    'common.disconnect': 'Disconnect',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.pageNotFound': 'Page not found',
    'common.backToHome': 'Back to Home',
    'common.copyright': 'All rights reserved',
    
    // Upload/Mint
    'upload.title': 'Upload Receipt',
    'upload.description': 'Upload your receipt to mint it as an NFT',
    'upload.dragDrop': 'Drag and drop your receipt here, or click to browse',
    'upload.processing': 'Processing...',
    'upload.mint': 'Mint Receipt',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome to BlockReceipt',
    'dashboard.myNfts': 'My NFTs',
    'dashboard.recentActivity': 'Recent Activity',
    
    // Rarities
    'rarity.common': 'Common',
    'rarity.uncommon': 'Uncommon',
    'rarity.rare': 'Rare',
    'rarity.epic': 'Epic',
    'rarity.legendary': 'Legendary'
  },
  es: {
    // Header/Navigation
    'nav.mintBlockReceipt': 'Acuñar un BlockReceipt',
    'nav.nftGallery': 'Galería NFT',
    'nav.whyBlockReceipt': '¿Por qué BlockReceipt?',
    'nav.forMerchants': 'Para Comerciantes',
    'nav.posDemo': 'Demo POS',
    'nav.howItWorks': 'Cómo Funciona BlockReceipt',
    'nav.home': 'Inicio',
    'nav.dashboard': 'Panel',
    
    // Gallery
    'gallery.title': 'Galería NFT Mejorada',
    'gallery.description': 'Descubre nuestros NFTs de personajes exclusivos - cada uno con rasgos únicos y diferentes niveles de rareza. Acuña estos personajes coleccionables en tu billetera o gánalos subiendo recibos.',
    'gallery.filterByMerchant': 'Filtrar por Comerciante',
    'gallery.filterByRarity': 'Filtrar por Rareza',
    'gallery.allMerchants': 'Todos los Comerciantes',
    'gallery.allRarities': 'Todos',
    'gallery.mintThisNft': 'ACUÑAR ESTE NFT',
    'gallery.minted': '✓ ACUÑADO',
    'gallery.noNftsFound': 'No se Encontraron NFTs',
    'gallery.tryDifferentFilter': 'Intenta seleccionar un filtro de rareza o comerciante diferente',
    
    // Home Page
    'home.title': 'Recibos Digitales. Acuñados al Pagar.',
    'home.subtitle': 'El futuro de los recibos de punto de venta está aquí',
    'home.description': 'BlockReceipt transforma cada compra en un recibo NFT seguro y verificable. Acuñado instantáneamente al pagar — sin papel, sin cargas, solo mejores recibos.',
    'home.getStarted': 'Comenzar',
    'home.learnMore': 'Aprender Más',
    'home.features.secure': 'Instantáneo y Verificable',
    'home.features.secureDesc': 'Recibos acuñados en cadena con prueba criptográfica',
    'home.features.tradeable': 'Sin Desperdicio de Papel',
    'home.features.tradeableDesc': 'Recibos digitales ecológicos reemplazan papel térmico',
    'home.features.universal': 'Integración POS',
    'home.features.universalDesc': 'Funciona con sistemas de punto de venta existentes',
    
    // Common
    'common.connectWallet': 'Conectar Billetera',
    'common.disconnect': 'Desconectar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.pageNotFound': 'Página no encontrada',
    'common.backToHome': 'Volver al Inicio',
    'common.copyright': 'Todos los derechos reservados',
    
    // Upload/Mint
    'upload.title': 'Subir Recibo',
    'upload.description': 'Sube tu recibo para acuñarlo como un NFT',
    'upload.dragDrop': 'Arrastra y suelta tu recibo aquí, o haz clic para buscar',
    'upload.processing': 'Procesando...',
    'upload.mint': 'Acuñar Recibo',
    
    // Dashboard
    'dashboard.title': 'Panel',
    'dashboard.welcome': 'Bienvenido a BlockReceipt',
    'dashboard.myNfts': 'Mis NFTs',
    'dashboard.recentActivity': 'Actividad Reciente',
    
    // Rarities
    'rarity.common': 'Común',
    'rarity.uncommon': 'Poco Común',
    'rarity.rare': 'Raro',
    'rarity.epic': 'Épico',
    'rarity.legendary': 'Legendario'
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
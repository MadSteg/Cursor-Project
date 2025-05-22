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
    
    // Navigation
    'nav.home': 'Home',
    'nav.gallery': 'Gallery',
    'nav.dashboard': 'Dashboard',
    'nav.howItWorks': 'How It Works',
    'nav.whyBlockReceipt': 'Why BlockReceipt',
    
    // Common
    'common.connectWallet': 'Connect Wallet',
    'common.disconnect': 'Disconnect',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Rarities
    'rarity.common': 'Common',
    'rarity.uncommon': 'Uncommon',
    'rarity.rare': 'Rare',
    'rarity.epic': 'Epic',
    'rarity.legendary': 'Legendary'
  },
  es: {
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
    
    // Navigation
    'nav.home': 'Inicio',
    'nav.gallery': 'Galería',
    'nav.dashboard': 'Panel',
    'nav.howItWorks': 'Cómo Funciona',
    'nav.whyBlockReceipt': 'Por qué BlockReceipt',
    
    // Common
    'common.connectWallet': 'Conectar Billetera',
    'common.disconnect': 'Desconectar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    
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
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

// Translation dictionary
const translations = {
  en: {
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back! Here\'s an overview of your digital receipts.',
    'wallet.connect': 'Connect Wallet',
    'wallet.disconnect': 'Disconnect',
    'wallet.notConnected': 'Connect your wallet to view your digital receipts dashboard',
    'stats.totalReceipts': 'Total Receipts',
    'stats.thisMonth': 'This Month',
    'stats.totalValue': 'Total Value',
    'stats.averageValue': 'Average Value',
    'actions.scanReceipt': 'Scan Receipt',
    'actions.viewGallery': 'View Gallery',
    'actions.verifyReceipt': 'Verify Receipt',
    'actions.uploadReceipt': 'Upload a new receipt',
    'actions.browseReceipts': 'Browse all receipts',
    'actions.checkAuthenticity': 'Check authenticity',
    'recentActivity.title': 'Recent Activity',
    'recentActivity.loading': 'Loading recent receipts...',
    'recentActivity.empty': 'No recent receipts found',
    'status.minted': 'minted',
    'status.pending': 'pending',
    'status.failed': 'failed',
  },
  es: {
    'dashboard.title': 'Panel de Control',
    'dashboard.welcome': '¡Bienvenido de vuelta! Aquí tienes una vista general de tus recibos digitales.',
    'wallet.connect': 'Conectar Billetera',
    'wallet.disconnect': 'Desconectar',
    'wallet.notConnected': 'Conecta tu billetera para ver tu panel de recibos digitales',
    'stats.totalReceipts': 'Total de Recibos',
    'stats.thisMonth': 'Este Mes',
    'stats.totalValue': 'Valor Total',
    'stats.averageValue': 'Valor Promedio',
    'actions.scanReceipt': 'Escanear Recibo',
    'actions.viewGallery': 'Ver Galería',
    'actions.verifyReceipt': 'Verificar Recibo',
    'actions.uploadReceipt': 'Subir un nuevo recibo',
    'actions.browseReceipts': 'Explorar todos los recibos',
    'actions.checkAuthenticity': 'Verificar autenticidad',
    'recentActivity.title': 'Actividad Reciente',
    'recentActivity.loading': 'Cargando recibos recientes...',
    'recentActivity.empty': 'No se encontraron recibos recientes',
    'status.minted': 'acuñado',
    'status.pending': 'pendiente',
    'status.failed': 'fallido',
  },
  fr: {
    'dashboard.title': 'Tableau de Bord',
    'dashboard.welcome': 'Bon retour ! Voici un aperçu de vos reçus numériques.',
    'wallet.connect': 'Connecter le Portefeuille',
    'wallet.disconnect': 'Déconnecter',
    'wallet.notConnected': 'Connectez votre portefeuille pour voir votre tableau de bord des reçus numériques',
    'stats.totalReceipts': 'Total des Reçus',
    'stats.thisMonth': 'Ce Mois',
    'stats.totalValue': 'Valeur Totale',
    'stats.averageValue': 'Valeur Moyenne',
    'actions.scanReceipt': 'Scanner le Reçu',
    'actions.viewGallery': 'Voir la Galerie',
    'actions.verifyReceipt': 'Vérifier le Reçu',
    'actions.uploadReceipt': 'Télécharger un nouveau reçu',
    'actions.browseReceipts': 'Parcourir tous les reçus',
    'actions.checkAuthenticity': 'Vérifier l\'authenticité',
    'recentActivity.title': 'Activité Récente',
    'recentActivity.loading': 'Chargement des reçus récents...',
    'recentActivity.empty': 'Aucun reçu récent trouvé',
    'status.minted': 'frappé',
    'status.pending': 'en attente',
    'status.failed': 'échoué',
  },
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key: string): string => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
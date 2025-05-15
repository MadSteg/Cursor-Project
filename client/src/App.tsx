import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Web3Provider } from "@/contexts/Web3Context";

// Core pages
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
// NFT Catalog removed per request

// NFT Receipt Features (New Focus)
import UserNFTWallet from "@/pages/UserNFTWallet";
import NFTReceiptDetail from "@/pages/NFTReceiptDetail";
import ScanReceipt from "@/pages/ScanReceiptPage";
import VerifyReceipt from "@/pages/VerifyReceipt";
import UploadReceiptPage from "@/pages/UploadReceiptPage";
import ReceiptGalleryPage from "@/pages/ReceiptGalleryPage";
import MerchantDashboard from "@/pages/MerchantDashboard";

// Analytics & Inventory (now integrated with NFT Wallet)
import Analytics from "@/pages/Analytics";
import Inventory from "@/pages/Inventory";
import InventoryDetail from "@/pages/InventoryDetail";
import InventoryUpload from "@/pages/InventoryUpload";

// Traditional Receipts Features
import Receipts from "@/pages/Receipts";
import ReceiptDetail from "@/pages/ReceiptDetail";

// E-commerce related
import ProductCatalog from "@/pages/ProductCatalog";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import CryptoCheckout from "@/pages/CryptoCheckout";
import EncryptedCheckout from "@/pages/EncryptedCheckout";

// Settings & Admin
import EncryptionSettings from "@/pages/EncryptionSettings";
import SignInPage from "@/pages/SignInPage";
import WalletPage from "@/pages/WalletPage";
import Admin from "@/pages/Admin";
import ThemePreview from "@/pages/ThemePreview";

// Development Testing Pages
import TaskStatusTestPage from "@/pages/TaskStatusTestPage";

// Layout components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Switch>
        {/* Core pages */}
        <Route path="/" component={HomePage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/about" component={AboutPage} />
        
        {/* Core Receipt Features */}
        <Route path="/scan-receipt" component={ScanReceipt} />
        <Route path="/upload-receipt" component={UploadReceiptPage} />
        <Route path="/receipt-gallery" component={ReceiptGalleryPage} />
        <Route path="/receipt-gallery/:address" component={ReceiptGalleryPage} />
        <Route path="/verify-receipt" component={VerifyReceipt} />
        <Route path="/merchant-dashboard" component={MerchantDashboard} />
        
        {/* NFT Receipt Features - Commented out as requested, but kept for future development */}
        {/* <Route path="/nft-wallet" component={UserNFTWallet} /> */}
        {/* <Route path="/nft-receipts/:id" component={NFTReceiptDetail} /> */}
        
        {/* Routes now accessible via NFT Wallet tabs - Commented out as requested, but kept for future development */}
        {/* <Route path="/nft-wallet/analytics" component={Analytics} /> */}
        {/* <Route path="/nft-wallet/inventory" component={Inventory} /> */}
        {/* <Route path="/nft-wallet/inventory/:id" component={InventoryDetail} /> */}
        {/* <Route path="/nft-wallet/inventory/:id/edit" component={InventoryUpload} /> */}
        {/* <Route path="/nft-wallet/inventory-upload" component={InventoryUpload} /> */}
        
        {/* Traditional Receipts (Legacy) */}
        <Route path="/receipts" component={Receipts} />
        <Route path="/receipts/:id" component={ReceiptDetail} />
        
        {/* E-commerce */}
        <Route path="/products" component={ProductCatalog} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/crypto-checkout" component={CryptoCheckout} />
        <Route path="/encrypted-checkout" component={EncryptedCheckout} />
        
        {/* Authentication & Settings */}
        <Route path="/sign-in" component={SignInPage} />
        <Route path="/encryption-settings" component={EncryptionSettings} />
        <Route path="/wallet" component={WalletPage} />
        <Route path="/wallet-settings" component={WalletPage} />
        <Route path="/admin" component={Admin} />
        <Route path="/theme-preview" component={ThemePreview} />
        
        {/* Development Testing Pages */}
        <Route path="/test/task-status" component={TaskStatusTestPage} />
        
        {/* 404 Page */}
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </Web3Provider>
    </QueryClientProvider>
  );
}

export default App;

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Core pages
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";

// NFT Receipt Features (New Focus)
import UserNFTWallet from "@/pages/UserNFTWallet";
import NFTReceiptDetail from "@/pages/NFTReceiptDetail";
import ScanReceipt from "@/pages/ScanReceiptPage";
import VerifyReceipt from "@/pages/VerifyReceipt";
import MerchantDashboard from "@/pages/MerchantDashboard";

// Analytics & Merchant Features
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
import Admin from "@/pages/Admin";
import ThemePreview from "@/pages/ThemePreview";

// Layout components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Switch>
        {/* Core pages */}
        <Route path="/" component={Dashboard} />
        
        {/* NFT Receipt Features */}
        <Route path="/nft-wallet" component={UserNFTWallet} />
        <Route path="/nft-receipts/:id" component={NFTReceiptDetail} />
        <Route path="/scan-receipt" component={ScanReceipt} />
        <Route path="/verify-receipt" component={VerifyReceipt} />
        <Route path="/merchant-dashboard" component={MerchantDashboard} />
        
        {/* Analytics & Merchant Features */}
        <Route path="/analytics" component={Analytics} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/inventory/:id" component={InventoryDetail} />
        <Route path="/inventory/:id/edit" component={InventoryUpload} />
        <Route path="/inventory-upload" component={InventoryUpload} />
        
        {/* Traditional Receipts (Legacy) */}
        <Route path="/receipts" component={Receipts} />
        <Route path="/receipts/:id" component={ReceiptDetail} />
        
        {/* E-commerce */}
        <Route path="/products" component={ProductCatalog} />
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/crypto-checkout" component={CryptoCheckout} />
        <Route path="/encrypted-checkout" component={EncryptedCheckout} />
        
        {/* Settings & Admin */}
        <Route path="/encryption-settings" component={EncryptionSettings} />
        <Route path="/admin" component={Admin} />
        <Route path="/theme-preview" component={ThemePreview} />
        
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
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

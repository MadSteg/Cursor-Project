import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Receipts from "@/pages/Receipts";
import ReceiptDetail from "@/pages/ReceiptDetail";
import Analytics from "@/pages/Analytics";
import Checkout from "@/pages/Checkout";
import CryptoCheckout from "@/pages/CryptoCheckout";
import EncryptedCheckout from "@/pages/EncryptedCheckout";
import EncryptionSettings from "@/pages/EncryptionSettings";
import ThemePreview from "@/pages/ThemePreview";
import Inventory from "@/pages/Inventory";
import InventoryDetail from "@/pages/InventoryDetail";
import InventoryUpload from "@/pages/InventoryUpload";
import Admin from "@/pages/Admin";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/receipts" component={Receipts} />
        <Route path="/receipts/:id" component={ReceiptDetail} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/crypto-checkout" component={CryptoCheckout} />
        <Route path="/encrypted-checkout" component={EncryptedCheckout} />
        <Route path="/encryption-settings" component={EncryptionSettings} />
        <Route path="/theme-preview" component={ThemePreview} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/inventory/:id" component={InventoryDetail} />
        <Route path="/inventory/:id/edit" component={InventoryUpload} />
        <Route path="/inventory-upload" component={InventoryUpload} />
        <Route path="/admin" component={Admin} />
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

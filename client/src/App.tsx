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
import EncryptedCheckout from "@/pages/EncryptedCheckout";
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
        <Route path="/encrypted-checkout" component={EncryptedCheckout} />
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
